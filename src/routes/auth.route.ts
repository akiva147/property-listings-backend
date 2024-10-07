import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validateEnvs } from "../utils/env.util";
import { getDb } from "../utils/db.util";

export const router = Router();

const collectionName = "users";

// Sign-up route
router.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const db = getDb();

  try {
    // Check if user already exists
    const existingUser = await db.collection(collectionName).findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db
      .collection(collectionName)
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
  const { JWT_SECRET } = validateEnvs();
  const { email, password } = req.body;
  const db = getDb();

  try {
    // Find user
    const user = await db.collection(collectionName).findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    else {
      const token = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Protected route
router.get("/protected", (req: Request, res: Response) => {
  const { JWT_SECRET } = validateEnvs();

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) res.sendStatus(401);
  else {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) res.sendStatus(403);
      res.json({ message: "Welcome to the protected route", user });
    });
  }
});
