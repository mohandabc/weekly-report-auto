import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const ReportCard = ({ to, title, description, notReady }) => {
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  }, []);

  return (
    <div
      className={`w-1/4 px-8 block duration-700 relative transform transition-all ease-out
    ${
      // hiding components when they first appear and then applying a translate effect gradually
      animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
    }`}
    >
      <Link
        className="no-underline text-header"
        to={notReady ? "" : to}
        style={{ textDecoration: "none", color: "#000" }}
      >
        <div
          className={`${notReady?"bg-gray-400":"bg-gray-200"} text-black dark:${notReady?"bg-stone-800":"bg-stone-700"} dark:text-white h-60 w-full p-4 
          text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out ${notReady?"":"hover:scale-105 hover:shadow-lg"} position:relative z-0`}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm mt-2">{description}</p>
          {notReady ? (
            <div className="my-10 inline-block px-4 py-2 border border-gray-600 rounded">
              <h5 className="text-xs font-medium">Under Construction</h5>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Link>
    </div>
  );
};