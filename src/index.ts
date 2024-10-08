import express, {
  Express,
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from "express";
import "dotenv/config";
import { validateEnvs } from "./utils/env.utils";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { router as counterRouter } from "./routes/counter.route";
import { router as authRouter } from "./routes/auth.route";
import { connectToDatabase } from "./utils/db.utils";
import { authenticateToken } from "./middlewares/auth";

const app = express();
const { PORT, CLIENT_URL } = validateEnvs();

app.use(
  cors({
    origin: CLIENT_URL,
  })
);
app.use(helmet());
app.use(compression({ level: 6 }));
app.use(json());
app.use(urlencoded({ extended: true }));

// Connect to MongoDB and start the server
connectToDatabase()
  .then(() => {
    app.use("/auth", authRouter);
    app.use(authenticateToken);
    app.use("/counter", counterRouter);

    app.get("*", (req: Request, res: Response) => {
      res.send("Express + TypeScript Server");
    });
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
