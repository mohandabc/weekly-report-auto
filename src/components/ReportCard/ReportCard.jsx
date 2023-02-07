import { Link } from "react-router-dom";
import { useEffect, useState } from  "react";

export const ReportCard = ({to, title, description, notReady}) => {
    const [animation, setAnimation] = useState(false);

    useEffect(() => {
        setAnimation(true);
    },[]);

    return(
            <div className={`w-1/4 px-8 block duration-700 relative transform transition-all ease-out
                    ${
                        // hiding components when they first appear and then applying a translate effect gradually
                        animation
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
            >
            <Link
                className="no-underline text-header"
                to={to}
                style={{ textDecoration: "none", color: "#000" }}
            >
                {/* <div className={`bg-gray-400 text-black dark:bg-stone-800 dark:text-white h-60 w-full p-4 text-center rounded-lg 
                shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg position:relative z-0`}> */}
                <div className={`${notReady? "bg-gray-400":"bg-gray-200"} text-black dark:${notReady?"bg-stone-800":"bg-stone-600"} dark:text-white h-60 w-full p-4 
                text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg position:relative z-0`}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    {
                    notReady?
                    (<h5 className="my-10">Under Construction</h5>)
                    :
                    (<></>)
                    }
                </div>
        </Link>
            </div>
    );
};