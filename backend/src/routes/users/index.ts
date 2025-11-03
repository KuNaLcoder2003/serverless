import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { SignIn, signinInput, signupInput } from "@kunaljprsingh/medium-common"
import { bodyLimit } from "hono/body-limit";


const user = new Hono<{
    Bindings: {
        DATABASE_URL: string,
    },
    Variables: {
        userId: string
    }

}>;

user.post('/signup', async (c) => {


    try {
        const body = await c.req.json();
        const { success } = signupInput.safeParse(body)
        if (!success) {
            return c.json({
                message: 'Invalid Input types',
                valid: false
            }, 411)
        }
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
        const user = await prisma.users.findFirst({
            where: {
                email: body.email
            }
        })

        if (user) {
            return c.json({
                message: "User already exists",
                valid: false
            }, 402)

        }
        // const hashed_password = toHash(body.password);

        const new_user = await prisma.users.create({
            data: {
                username: body.username,
                email: body.email,
                password: body.password,
                created_on: new Date()
            }
        })

        if (!new_user) {
            return c.json({
                message: "Unable to create account, try again later",
                valid: false
            }, 403)

        }

        const token = await sign({
            id: new_user.id,

        }, "93490-0=-")

        return c.json({
            message: 'Successfully creatred account',
            token: token,
            valid: true
        }, 200)


    } catch (error) {
        return c.json({
            message: "Soemthing went wrong",
            error: error
        }, 500);
    }
});

user.post('/signin', async (c) => {
    console.log("DATABASE_URL:", c.env.DATABASE_URL);

    try {
        const body: SignIn = await c.req.json();
        const { success } = signinInput.safeParse(body)
        if (!success) {
            return c.json({
                message: 'Inavlid inputs'
            }, 411)
        }

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
        const user = await prisma.users.findFirst({
            where: {
                email: body.email
            }
        })
        if (!user) {
            return c.json({
                message: 'Account does not exists , Signup',
                valid: false
            }, 403)
        }

        if (body.password !== user.password) {
            return c.json({
                message: "Incorrect password",
                valid: false
            }, 403)
        }

        const token = await sign({
            id: user.id
        }, "93490-0=-")

        return c.json({
            message: 'Loggedin successfully',
            valid: true,
            token: token
        }, 200)

    } catch (error) {
        return c.json({
            message: "Soemthing went wrong",
            error: error
        }, 500);
    }
})

export default user;