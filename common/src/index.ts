import z from "zod"

export const signupInput = z.object({
    username: z.string(),
    password: z.string().min(6),
    email: z.string()
})

export const signinInput = z.object({
    email: z.string(),
    password: z.string().min(6),
})

export const createBlog = z.object({
    title: z.string(),
    constent: z.string()
})

export const updateBlog = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string()
})

export type SignUp = z.infer<typeof signupInput>
export type SignIn = z.infer<typeof signinInput>
export type CreateBlog = z.infer<typeof createBlog>
export type UpdateBlog = z.infer<typeof updateBlog>