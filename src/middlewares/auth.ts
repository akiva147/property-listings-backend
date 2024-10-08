import { Response, NextFunction } from "express";
import { Request } from "../types/express.type";
import jwt from "jsonwebtoken";
import { validateEnvs } from "../utils/env.utils";
import { generateAccessToken } from "../utils/auth.utils";
import { UserSchema } from "../models/user.model";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { JWT_SECRET } = validateEnvs();
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) res.sendStatus(401);
  else {
    jwt.verify(token, JWT_SECRET, (err, token) => {
      console.log("jwt.verify  token:", token);
      if (err || typeof token === "string" || !token) {
        res.sendStatus(403);
      }

      const user = UserSchema.parse(token);

      // Attach the user to the request object for use in the next middleware/route
      req.user = user;
      next();
    });
  }
};
