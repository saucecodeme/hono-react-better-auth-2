import { auth } from "./lib/auth";
import { todos } from "./db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type HonoEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
};

// export type TodoInsert = typeof todos.$inferInsert;
export const todoInsertSchema = createInsertSchema(todos)
  .pick({ title: true, description: true })
  .extend({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().max(1000).optional(),
  });
export type TodoInsert = z.infer<typeof todoInsertSchema>;
