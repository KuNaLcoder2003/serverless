import type React from "react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type SignUp } from "@kunaljprsingh/medium-common";
import { BACKEND_URL } from "../config"

type AuthType = "signin" | "signup"
interface prop {
    type: AuthType
}
const Auth: React.FC<prop> = ({ type }) => {
    const [signup, setSignupInputs] = useState<SignUp>({
        username: "",
        password: "",
        email: "",
    });
    const navigate = useNavigate();
    const sendRequest = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BACKEND_URL}/${type == "signin" ? "signin" : "signup"}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: type == "signin" ? JSON.stringify({
                    email: signup.email,
                    password: signup.password
                }) : JSON.stringify({
                    username: signup.username,
                    password: signup.password,
                    email: signup.email
                })
            })
            const data = await response.json();
            if (!data.valid) {
                localStorage.setItem('token', `Bearer ${data.token}`)
                navigate('/blogs')
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-3xl font-extrabold">
                            {
                                type == "signin" ? "Login into your account" : "Create an account"
                            }
                        </div>
                        <div className="text-slate-500">
                            {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                            <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                                {type === "signin" ? "Sign up" : "Sign in"}
                            </Link>
                        </div>
                    </div>
                    <div className="pt-8">
                        {type === "signup" ? <LabelledInput label="Name" placeholder="Harkirat Singh..." onChange={(e) => {
                            setSignupInputs({
                                ...signup,
                                username: e.target.value
                            })
                        }} /> : null}
                        <LabelledInput label="Email" placeholder="harkirat@gmail.com" onChange={(e) => {
                            setSignupInputs({
                                ...signup,
                                email: e.target.value
                            })
                        }} />
                        <LabelledInput label="Password" type={"password"} placeholder="123456" onChange={(e) => {
                            setSignupInputs({
                                ...signup,
                                password: e.target.value
                            })
                        }} />
                        <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return <div>
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}

export default Auth;