import { Router } from "express";
import { getDb } from "../utils/db.util";

export const router = Router();

router.get("/", async (req, res) => {
  const db = getDb();
  try {
    const counter = await db.collection("counter").findOne({});
    if (!counter) {
      res.status(404).json({ message: "Counter not found" });
    } else {
      res.json({ value: counter.value });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving counter", error });
  }
});

router.put("/add", async (req, res) => {
  const db = getDb();
  try {
    const result = await db
      .collection("counter")
      .findOneAndUpdate(
        {},
        { $inc: { value: 1 } },
        { returnDocument: "after", upsert: true }
      );
    if (!result) {
      res.status(404).json({ message: "Counter not found" });
    } else {
      res.json({
        message: "Counter incremented",
        value: result.value?.value || 1,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating counter", error });
  }
});
