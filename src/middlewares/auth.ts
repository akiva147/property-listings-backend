import { Response, NextFunction } from "express";
import { Request } from "../types/express.type";
import jwt from "jsonwebtoken";
import { validateEnvs } from "../utils/env.util";

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
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) res.sendStatus(403);
      // Attach the user to the request object for further use in the route
      req.user = user;
      next();
    });
  }
};
