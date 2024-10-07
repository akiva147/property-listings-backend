import express, { Express, Request, Response, json } from "express";
import "dotenv/config";
import { validateEnvs } from "./utils/env.util";
import cors from "cors";

const app = express();
const { PORT } = validateEnvs();

app.use(cors());
app.use(json());
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
