import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

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

app.post('/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate())
	try {
		const body = await c.req.json();
		if (!body.username || !body.email || !body.password) {
			c.json({
				message: "Missing entries",
				valid: false
			}, 400)
			return
		}
		const user = await prisma.users.findFirst({
			where: {
				email: body.email
			}
		})

		if (user) {
			c.json({
				message: "User already exists",
				valid: false
			}, 402)
			return
		}
		const hashed_password = toHash(body.password);

		const new_user = await prisma.users.create({
			data: {
				username: body.username,
				email: body.email,
				password: body.password,
				created_on: new Date()
			}
		})

		if (!new_user) {
			c.json({
				message: "Unable to create account, try again later",
				valid: false
			}, 403)
			return
		}

		const token = await sign({
			id: new_user.id,

		}, "93490-0=-")

		c.json({
			message: 'Successfully creatred account',
			token: token,
			valid: true
		}, 200)


	} catch (error) {
		c.json({
			message: "Soemthing went wrong",
			error: error
		}, 500);
	}
})

export default app;