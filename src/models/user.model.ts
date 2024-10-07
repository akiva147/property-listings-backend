import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(255),
});

export type User = z.infer<typeof UserSchema>;
