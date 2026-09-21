import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { LinkModel } from "./models/link.model";
import { linkRouter } from "./routes/links";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3000);
const databaseUrl = process.env.MONGODB_URI;

if (!databaseUrl) {
  throw new Error("MONGODB_URI is required.");
}

app.use(cors());
app.use(express.json());

app.use("/api/links", linkRouter);

app.get("/api/health", (request, response) => {
  response.status(200).json({
    status: "ok",
    service: "url-shortener-api",
  });
});

app.get("/:code", async (request, response) => {
  const link = await LinkModel.findOneAndUpdate(
    { code: request.params.code },
    { $inc: { clicks: 1 } },
    { returnDocument: "after" },
  );

  if (!link) {
    return response.status(404).json({
      error: "Short link not found.",
    });
  }

  return response.redirect(302, link.destination);
});
async function startServer(url: string) {
  await mongoose.connect(url);
  console.log("MongoDB connected");

  app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
  });
}

startServer(databaseUrl).catch((error: unknown) => {
  console.error("Failed to start API", error);
  process.exit(1);
});





