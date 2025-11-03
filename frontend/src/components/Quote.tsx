import type React from "react";


const Quote: React.FC = () => {
    return (
        <div className="bg-slate-200 h-screen flex items-center justify-center">
            <div className="h-full flex flex-col justify-center gap-8">

                <div className="max-w-lg text-left text-2xl font-bold">
                    "The customer service I received was exceptional. The support team went above and beyond to address my concerns"
                </div>

                <div className="max-w-lg flex flex-col gap-1">
                    <p className="text-lg font-semibold">
                        Julius Winfiels
                    </p>
                    <p className="text-md font-semibold text-slate-500">CEO , Acme Group</p>
                </div>

            </div>
        </div>
    )
}

export default Quote