import { z } from "zod";

export const dogSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string(),
  description: z.string(),
  isFavorite: z.boolean(),
});

export const dogArraySchema = z.array(dogSchema);

export type TDog = z.infer<typeof dogSchema>;
export type TNewDog = Omit<TDog, "id">;

export type TPage = "all" | "favorite" | "unfavorite" | "form";
