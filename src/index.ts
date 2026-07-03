import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello from vercel + Hono" });
});

export default {
  port: 8088,
  fetch: app.fetch,
};
