import express, {
  Express,
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from "express";
import "dotenv/config";
import { validateEnvs } from "./utils/env.util";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { router as counterRouter } from "./routes/counter.route";
import { router as authRouter } from "./routes/auth.route";
import { connectToDatabase } from "./utils/db.util";
import { authenticateToken } from "./middlewares/auth";

const app = express();
const { PORT } = validateEnvs();

app.use(cors());
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
// const logger = (req: Request, res: Response, next: () => void) => {
//   console.log(req.originalUrl);
//   next();
// };

// app.use(logger);

// const posts = [
//   {
//     username: "Kyle",
//     title: "Post 1",
//   },
//   {
//     username: "Jim",
//     title: "Post 2",
//   },
// ];

// app.get("/posts", authenticateToken, (req, res) => {
//   res.json(posts.filter((post) => post.username === req.user.name));
// });

// function authenticateToken(req: Request, res: Response, next: NextFunction) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
//     console.log(err);
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

// let refreshTokens: string[] = [];

// app.post("/token", (req: Request, res: Response) => {
//   const { REFRESH_TOKEN_SECRET } = validateEnvs();
//   const refreshToken: string = req.body.token;
//   if (refreshToken == null) res.sendStatus(401);
//   if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);
//   jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) res.sendStatus(403);
//     if (user === undefined || typeof user === "string") res.sendStatus(400);
//     else {
//       const accessToken = generateAccessToken({ name: user.name });
//       res.json({ accessToken: accessToken });
//     }
//   });
// });

// app.delete("/logout", (req, res) => {
//   refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
//   res.sendStatus(204);
// });

// app.post("/login", (req, res) => {
//   // Authenticate User
//   const { REFRESH_TOKEN_SECRET } = validateEnvs();

//   const username = req.body.username;
//   const user = { name: username };

//   const accessToken = generateAccessToken(user);
//   const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);
//   refreshTokens.push(refreshToken);
//   res.json({ accessToken: accessToken, refreshToken: refreshToken });
// });

// function generateAccessToken(user: any) {
//   const { ACCESS_TOKEN_SECRET } = validateEnvs();

//   return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
// }
