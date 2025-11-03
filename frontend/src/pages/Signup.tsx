import type React from "react";
import Quote from "../components/Quote";
import Auth from "../components/Auth";


const Signup: React.FC = () => {
    return (
        <div className="grid grid-cols-2">
            <div>
                <Auth type="signup" />
            </div>
            <Quote />
        </div>
    )
}

export default Signup