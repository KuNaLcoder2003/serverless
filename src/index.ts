import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

import signup from "./routes/users";

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECERT: string
	}
}>

function toHash(string: string) {

	let hash: any = 0;

	if (string.length == 0) return hash;

	for (let i = 0; i < string.length; i++) {
		let char: any = string.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}

	return Math.abs(hash);
}

app.get('/', (c) => c.text('Server is alive'));



app.route('/', signup)

export default app;