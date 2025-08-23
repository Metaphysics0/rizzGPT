import { z } from "zod/v4";

export const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type FormSchema = typeof formSchema;
