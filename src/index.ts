import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello from vercel + Hono" });
});

export default {
  port: process.env.PORT || 80,
  fetch: app.fetch,
};
