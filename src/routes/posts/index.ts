import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
const posts = new Hono<{
    Bindings: {
        DATABASE_URL: string,
    }
}>

export default posts;
