import { db } from "./db";
import type { TodoInsert } from "../types";
import { todos } from "../db/schema";

export const createTodo = async (userId: string, todo: TodoInsert) => {
  const [createdTodo] = await db
    .insert(todos)
    .values({ ...todo, userId })
    .returning();
  return createdTodo;
};
