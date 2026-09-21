import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3000);
const databaseUrl = process.env.MONGODB_URI;

if (!databaseUrl) {
  throw new Error("MONGODB_URI is required.");
}

app.use(cors());
app.use(express.json());

app.get("/api/health", (request, response) => {
  response.status(200).json({
    status: "ok",
    service: "url-shortener-api",
  });
});

async function startServer() {
  await mongoose.connect(databaseUrl);
  console.log("MongoDB connected");

  app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Failed to start API", error);
  process.exit(1);
});

