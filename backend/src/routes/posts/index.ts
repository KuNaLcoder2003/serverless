import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";

const posts = new Hono<{
    Bindings: {
        DATABASE_URL: string,
    },
    Variables: {
        userId: string
    }
}>

posts.post('/blog', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const userId = c.get('userId')
        if (!userId) {
            return c.json({
                message: 'Unauthorized',
                valid: false
            }, 401)
        }

        const { title, content } = await c.req.json()

        if (!title || !content) {
            c.json({
                message: 'Incomplete post details',
                valid: false
            }, 403)
        }
        const new_post = await prisma.posts.create({
            data: {
                title: title,
                content: content,
                authorId: userId,
                created_on: new Date()
            }
        })
        if (!new_post) {
            return c.json({
                message: 'Unable to create post , try again later',
                valid: false,
            }, 403)
        }
        return c.json({
            message: 'Successfully created post',
            valid: true
        }, 200)
    } catch (error) {
        return c.json({
            message: "Soemthing went wrong",
            error: error
        }, 500);
    }
})

posts.put('/blog/:id', async (c) => {

    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        const userId = c.get('userId')
        if (!userId) {
            return c.json({
                message: 'Unauthorized',
                valid: false
            }, 401)
        }
        const { id } = c.req.param();
        if (!id || id.length < 8) {
            return c.json({
                message: `Blog id ${id} is not valid`,
                valid: false
            }, 403)
        }
        const { title, content } = await c.req.json();
        if (!title || !content) {
            c.json({
                message: 'Incomplete post details',
                valid: false
            }, 403)
        }

        const updated_blog = await prisma.posts.update({
            where: {
                id: id,
                authorId: userId
            },
            data: {
                title: title,
                content: content
            }
        })
        if (!updated_blog) {
            return c.json({
                message: 'Unable to update blog',
                valid: false,
            }, 403)
        }
        return c.json({
            message: 'Blog updated',
            valid: true
        }, 200)
    } catch (error) {
        return c.json({
            message: "Soemthing went wrong",
            error: error
        }, 500);
    }
})

posts.get('/blog/:id', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        const { id } = c.req.param();

        if (!id || id.length < 8) {
            return c.json({
                message: `Blog id ${id} is not valid`,
                valid: false
            }, 403)
        }

        const blog = await prisma.posts.findFirst({
            where: {
                id: id
            }
        })

        if (!blog) {
            return c.json({
                message: `Blog not found`,
                valid: false
            }, 404)
        }

        return c.json({
            blog: blog,
            valid: true
        }, 200)

    } catch (error) {
        return c.json({
            message: "Soemthing went wrong",
            error: error
        }, 500);
    }
})

posts.get('/blog/bulk', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
        const userId = c.get('userId')
        if (!userId) {
            return c.json({
                message: 'Unauthorized',
                valid: false
            }, 401)
        }
        const blogs = await prisma.posts.findMany({});
    } catch (error) {
        return c.json({
            message: "Soemthing went wrong",
            error: error
        }, 500);
    }
})
export default posts;
