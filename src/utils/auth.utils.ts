import jwt from "jsonwebtoken";
import { validateEnvs } from "./env.utils";
import { User } from "../models/user.model";

export const generateAccessToken = (user: User) => {
  const { JWT_SECRET } = validateEnvs();

  const token = jwt.sign(
    { email: user.email, password: user.password },
    JWT_SECRET,
    {
      // uncomment this to debug token generation
      expiresIn: "15s",
      //   expiresIn: "1h",
    }
  );
  return token;
};
