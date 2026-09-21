import { randomBytes } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { LinkModel } from "../models/link.model";

const createLinkSchema = z.object({
  destination: z.string().url().max(2048),
});

export const linkRouter = Router();

function createCode() {
  return randomBytes(5).toString("base64url");
}

linkRouter.post("/", async (request, response) => {
  const input = createLinkSchema.safeParse(request.body);

  if (!input.success) {
    return response.status(400).json({
      error: "A valid destination URL is required.",
    });
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = createCode();
    const existing = await LinkModel.exists({ code });

    if (existing) {
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
