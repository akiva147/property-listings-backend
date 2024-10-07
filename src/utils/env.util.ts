import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.string(),
});

type Env = z.infer<typeof EnvSchema>;

export const validateEnvs = (): Env => {
  const env = process.env;

  const parsed = EnvSchema.safeParse(env);

  if (parsed.error) throw new Error("Error validating environment variables");

  return parsed.data;
};
