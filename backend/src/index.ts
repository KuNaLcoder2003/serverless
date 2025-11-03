import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

import signup from "./routes/users";
import posts from "./routes/posts";


const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECERT: string
	},
	Variables: {
		userId: string
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
app.use('/blog/*', async (c, next) => {
	const authtoken = c.req.header("Authorization");
	if (!authtoken || !authtoken.startsWith('Bearer ')) {
		return c.json({
			message: 'unauthorized',
			valid: false
		}, 401)
	}

	const token = authtoken.split('Bearer ')[1]

	const verified = await verify(token, "93490-0=-")

	if (!verified) {
		return c.json({
			message: 'unauthorized',
			valid: false
		}, 401)
	} else {
		c.set('userId', `${verified.id}`)
		await next();
	}
})


app.route('/', signup)
app.route('/', posts)

export default app;