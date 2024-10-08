import { Router } from "express";
import { getDb } from "../utils/db.utils";

export const router = Router();
type Counter = { value: number };

router.get("/", async (req, res) => {
  // console.log("router.get  req:", req);
  const db = getDb();
  try {
    const counter = await db.collection<Counter>("counter").findOne({});
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
      .collection<Counter>("counter")
      .findOneAndUpdate({}, { $inc: { value: 1 } }, { upsert: true });
    if (!result) {
      res.status(404).json({ message: "Counter not found" });
    } else {
      res.json({
        message: "Counter incremented",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating counter", error });
  }
});
