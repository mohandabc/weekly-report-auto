/*****************************************************
 * TODO: IMPLEMENT THE FRONTOFFICE REPORTS GENERATORS*
 *****************************************************/

import { Link } from "react-router-dom";
import { SideBar } from "../../components/SideBar";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";
import * as Mode from "../../constants/darkmode_constants";

export const FrontOffice = () => {
  const darkMode = useRecoilValue(darkModeState);
  const [animation, setAnimation] = useState(false);
  useEffect(() => {
    setAnimation(true);
  });

  return (
    <div className="App">
      <header
        className={`flex flex-col h-72 ${
          // choose background on Whether darkmode is in "dark" or "light" mode.
            darkMode ? Mode.DARK_BACKGROUND : Mode.LIGHT_BACKGROUND
        } min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}
      >
        <div
          className={`sticky top-0 z-30 w-full ${
            // choose Navbar Color on Whether darkmode is in "dark" or "light" mode.
            darkMode ? Mode.NAVBAR_DARK : Mode.NAVBAR_LIGHT
          }`}
        >
          <SideBar
            appearance={`${
              darkMode
                ? Mode.NAVBAR_DARK_APPEARANCE
                : Mode.NAVBAR_LIGHT_APPEARANCE
            }`}
          />
        </div>

        <div className="py-5">
          <h1 className="text-white text-3xl text-center">
            FRONT-OFFICE Reports
          </h1>
        </div>

        <div className="flex flex-wrap justify-center items-center">
          <div
            className={`w-1/4 px-8 block duration-700 relative transform transition-all ease-out
                    ${
                      // hiding components when they first appear and then applying a translate effect gradually
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
              <div
                className={`${
                  darkMode
                    ? Mode.CARDS_DARK_DEACTIVATED
                    : Mode.CARDS_LIGHT_DEACTIVATED
                } h-60 w-full p-4 text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg position:relative z-0`}
              >
                <h3>FO Daily Report</h3>
                <p>
                  Automatically Generate a front office daily report for a
                  specific day
                </p>
                <h5 className="my-10">Under Construction</h5>
              </div>
            </Link>
          </div>
          <div
            className={`w-1/4 px-8 block duration-700 relative transform transition-all ease-out
                    ${
                      // hiding components when they first appear and then applying a translate effect gradually
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
              <div
                className={`${
                  darkMode
                    ? Mode.CARDS_DARK_DEACTIVATED
                    : Mode.CARDS_LIGHT_DEACTIVATED
                } h-60 w-full p-4 text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg position:relative z-0`}
              >
                <h3>FO Weekly Report</h3>
                <p>
                  Automatically Generate a front office weekly report for a
                  specific week
                </p>
                <h5 className="my-10">Under Construction</h5>
              </div>
            </Link>
          </div>

          <div
            className={`w-1/4 px-8 block duration-700 relative transform transition-all ease-out
                    ${
                      // hiding components when they first appear and then applying a translate effect gradually
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
              <div
                className={`${
                  darkMode
                    ? Mode.CARDS_DARK_DEACTIVATED
                    : Mode.CARDS_LIGHT_DEACTIVATED
                } h-60 w-full p-4 text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg position:relative z-0`}
              >
                <h3>FO Monthly Report</h3>
                <p>
                  Automatically Generate a front office monthly report for a
                  specific week
                </p>
                <h5 className="my-10">Under Construction</h5>
              </div>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};
