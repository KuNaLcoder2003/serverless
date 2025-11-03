import type React from "react";
import Auth from "../components/Auth";
import Quote from "../components/Quote";


const Signin: React.FC = () => {
    return (
        <div className="grid grid-cols-2">
            <div>
                <Auth type="signin" />
            </div>
            <Quote />
        </div>
    )
}

export default Signin;