import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Request as RequestWithUser } from "../types/express.type";
import { getDb } from "../utils/db.utils";
import { User } from "../models/user.model";
import { generateAccessToken } from "../utils/auth.utils";
import { authenticateToken } from "../middlewares/auth";

export const router = Router();

const collectionName = "users";

// Sign-up route
router.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const db = getDb();

  try {
    // Check if user already exists
    const existingUser = await db
      .collection<User>(collectionName)
      .findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db
      .collection<User>(collectionName)
      .insertOne({ email, password: hashedPassword });

    res
      .status(201)
      .json({ message: "User created", userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

// Login route
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const db = getDb();

  try {
    const user = await db.collection<User>(collectionName).findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      const token = generateAccessToken(user);

      res.json({ token });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

router.get(
  "/refresh-token",
  authenticateToken,
  async (req: RequestWithUser, res: Response) => {
    const { user } = req;
    if (!user) res.status(401);
    else {
      const refreshToken = generateAccessToken(user);

      res.status(201).json({ token: refreshToken });
    }
  }
);
