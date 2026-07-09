import { Hono } from "hono";
import { cors } from "hono/cors";
import { blogList } from "./data";

const app = new Hono();

// Enable CORS for all routes
app.use("/*", cors());

app.get("/", (c) => {
  return c.json({ message: "Hello from vercel + Hono" });
});

app.get("/blogs", (c) => {
  const pageStr = c.req.query("page");
  const limitStr = c.req.query("limit");
  const search = c.req.query("search");
  const website = c.req.query("website");

  const page = Math.max(1, pageStr ? Number.parseInt(pageStr, 10) || 1 : 1);
  const limit = Math.max(1, limitStr ? Number.parseInt(limitStr, 10) || 10 : 10);

  let filteredBlogs = blogList;

  if (website) {
    filteredBlogs = filteredBlogs.filter(
      (b) => b.website.toLowerCase() === website.toLowerCase(),
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredBlogs = filteredBlogs.filter(
      (b) =>
        b.title.toLowerCase().includes(searchLower) ||
        b.description.toLowerCase().includes(searchLower) ||
        b.author.toLowerCase().includes(searchLower),
    );
  }

  const total = filteredBlogs.length;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

  return c.json({
    data: paginatedBlogs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

app.get("/blogs/:idOrSlug", (c) => {
  const idOrSlug = c.req.param("idOrSlug");
  const blog = blogList.find((b) => b.id === idOrSlug || b.slug === idOrSlug);

  if (!blog) {
    return c.json({ message: "Blog not found" }, 404);
  }

  return c.json(blog);
});

export default {
  port: process.env.PORT || 80,
  fetch: app.fetch,
};
