import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "url-shortener-api",
  });
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});

