import { Link } from "react-router-dom";
import { SideBar } from "../../components/SideBar";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";

export const BackOffice = () => {
  const darkMode = useRecoilValue(darkModeState);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  });

  return (
    <div className="App">
      <header
        className={`flex flex-col h-72 ${
          darkMode ? "bg-dark-mode" : "bg-light-mode"
        } min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}
      >
        <div
          className={`sticky top-0 z-30 w-full ${darkMode ? "bg-black" : ""}`}
        >
          <SideBar appearance={`${darkMode ? "subtle" : "default"}`} />
        </div>

        <div className="py-5">
          <h1 className="text-white text-3xl text-center">
            BACK-OFFICE Reports
          </h1>
        </div>

        <div className="flex flex-wrap justify-center items-center">
          <div
            className={`w-1/4 px-8 block duration-700 relative transform transition-all ease-out
                    ${
                      animation
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
          >
            <Link
              className="no-underline text-header"
              to="/dailyBo"
              style={{ textDecoration: "none", color: "#000" }}
            >
              <div className="bg-gray-200 h-60 w-full p-4 text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg position:relative z-0">
                <h3>BO Daily Report</h3>
                <p>
                  Automatically Generate a back office daily report for a
                  specific day
                </p>
              </div>
            </Link>
          </div>

          <div
            className={`w-1/4 px-8 block duration-700 relative transform transition-all ease-out
                    ${
                      animation
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
          >
            <Link
              className="no-underline text-header"
              to="/weeklyBo"
              style={{ textDecoration: "none", color: "#000" }}
            >
              <div className="bg-gray-200 h-60 w-full py-4 text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg">
                <h3>BO Weekly Report</h3>
                <p>
                  Automatically Generate a back office weekly report for a
                  specific week
                </p>
              </div>
            </Link>
          </div>

          <div
            className={`w-1/4 px-8 block duration-700 relative transform transition-all ease-out
                    ${
                      animation
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
          >
            <Link
              className="no-underline text-header"
              to=""
              style={{ textDecoration: "none", color: "#000" }}
            >
              <div className="bg-gray-400 h-60 w-full p-4 text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg">
                <h3>BO Monthly Report</h3>
                <p>
                  Automatically Generate a back office monthly report for a
                  specific week
                </p>
                <h5>Under Construction</h5>
              </div>
            </Link>
          </div>

        </div>
      </header>
    </div>
  );
};
