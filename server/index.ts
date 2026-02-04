import { Hono } from "hono";
import { getTodos } from "./db/queries";
import { auth } from "./lib/auth";
import { todos } from "./routes/todos.routes";

const app = new Hono().basePath("/api");

const router = app
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
  .route("/todos", todos);

export type AppType = typeof router;
export default app;
