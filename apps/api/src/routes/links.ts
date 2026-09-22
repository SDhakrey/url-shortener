import { randomBytes } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { LinkModel } from "../models/link.model";

const createLinkSchema = z.object({
  destination: z.string().url().max(2048),
  alias: z
    .string()
    .trim()
    .min(4)
    .max(24)
    .regex(/^[a-zA-Z0-9-]+$/, "Use letters, numbers, and hyphens only.")
    .optional(),
});

export const linkRouter = Router();

function createCode() {
  return randomBytes(5).toString("base64url");
}

linkRouter.post("/", async (request, response) => {
  const input = createLinkSchema.safeParse(request.body);

  if (!input.success) {
    return response.status(400).json({
      error: "Enter a valid destination URL and optional alias.",
    });
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = input.data.alias ?? createCode();
    const existing = await LinkModel.exists({ code });

    if (existing) {
      if (input.data.alias) {
        return response.status(409).json({
          error: "This custom alias is already in use.",
        });
      }

      continue;
    }

    const link = await LinkModel.create({
      code,
      destination: input.data.destination,
    });

    const baseUrl = `${request.protocol}://${request.get("host")}`;

    return response.status(201).json({
      code: link.code,
      destination: link.destination,
      shortUrl: `${baseUrl}/${link.code}`,
    });
  }

  return response.status(500).json({
    error: "Unable to generate a unique code.",
  });
});
linkRouter.delete("/:code", async (request, response) => {
  const link = await LinkModel.findOneAndDelete({
    code: request.params.code,
  });

  if (!link) {
    return response.status(404).json({
      error: "Short link not found.",
    });
  }

  return response.status(204).send();
});
