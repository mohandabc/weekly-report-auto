/******************************************************************************
 * PLEASE NOTE THAT THIS COMPONENT IS USED MULTIPLE TIMES EACH WITH DIFFERENT *
 *         CUSTOMIZATION AND THE JSX RETURNED HERE BECAME A BIT MESSY         *
 *  /***********************************************************************  *
 *  * TODO : SPLIT THIS CONFIGBAR TO TWO DIFFERENT COMPONENTS ONE BELONGS *   *
 *  *            TO THE REPORTING AND ONE TO THE DELIVERABLES             *   *
 *  ***********************************************************************   *
 ******************************************************************************/

import "./react-tabs.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { DateRangePicker } from "rsuite";
import { SideBar } from "../../components/SideBar";
import { dateStartEndState } from "../../shared/globalState";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";
import * as Mode from "../../constants/darkmode_constants";

import {
  BitRecord,
  DrillingState,
  ReamBream,
  TrippingSpeed,
} from "../../pages";
import { Loader } from "../Loader";
import { ActionButton } from "../ActionButton";

export const ConfigBar = ({ title, configBarAction, options }) => {
  const [dateStartEnd, setDateStartEnd] = useRecoilState(dateStartEndState);
  const [value, setValue] = React.useState([
    new Date(dateStartEnd.split(" - ")[0]),
    new Date(dateStartEnd.split(" - ")[1]),
  ]);

  const params = {
    dates: value
      ? formatDate(value[0]) + " - " + formatDate(value[1])
      : dateStartEnd,
  };

  function formatDate(date) {
    if (date)
      return [
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
        date.getFullYear(),
      ].join("/");
  }

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  const [animation, setAnimation] = useState(false);
  const darkMode = useRecoilValue(darkModeState);

  useEffect(() => {
    setAnimation(true);
  });

  return (
    <div
      className={`flex flex-col h-72 ${
        darkMode ? Mode.DARK_BACKGROUND : Mode.LIGHT_BACKGROUND
      } min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}
    >
      <div
        className={`fixed top-0 z-50 w-full ${
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

      <header
        className={`flex flex-col h-72 ${
          darkMode ? Mode.DARK_BACKGROUND : Mode.LIGHT_BACKGROUND
        } min-h-screen bg-no-repeat bg-cover bg-center bg-fixed text-white text-3xl ${
          options.option == "Reporting" ? "justify-center" : ""
        } items-center`}
      >
        {options.option == "Reporting" ? (
          <>
            <div className="absolute mt-56 z-50">
              <Loader></Loader>
            </div>
            <div
              className={`sticky rounded-xl ${
                darkMode
                  ? Mode.CONTAINER_DARK_COLOR
                  : Mode.CONTAINER_LIGHT_COLOR
              } w-1/4 h-1/3 duration-1000 transform transition-all ease-out
          ${
            animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
            >
              <div className="flex justify-center items-center">
                <div className="py-9">
                  <h1
                    className={`${
                      darkMode
                        ? Mode.CONTAINER_DARK_TITLE
                        : Mode.CONTAINER_LIGHT_TITLE
                    } text-3xl text-center delay-200 duration-1000 relative transform transition-all ease-out
                    ${
                      animation
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
                  >
                    {title}
                  </h1>
                </div>
              </div>
              <div
                className={`flex items-center justify-center duration-1000 relative transform transition-all ease-out
                    ${
                      animation
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
              >
                <DateRangePicker
                  value={value}
                  onChange={setValue}
                  format="dd-MM-yyyy"
                  style={{
                    width: 257,
                  }}
                />
              </div>
              <div
                className={`flex items-center justify-center m-11 duration-1000 relative transform transition-all ease-out
                    ${
                      animation
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
              >
                <ActionButton
                  className="bg-blue-500 hover:bg-blue-700 text-black font-bold text-base py-2 px-4 rounded "
                  text="Submit"
                  action={configBarAction}
                  args={[params]}
                ></ActionButton>
              </div>
            </div>
          </>
        ) : (
          <div
            className={`flex sticky my-36 transform transition-all duration-1000 ease-out
          ${
            animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          >
            <Tabs
              selectedTabClassName={`${
                darkMode
                  ? "react-tabs__tab--selecteddark"
                  : "react-tabs__tab--selectedlight"
              }`}
            >
              <TabList>
                <Tab>Bit Record</Tab>
                <Tab>Tripping Speed</Tab>
                <Tab>Drilling State</Tab>
                <Tab>Ream-Back Ream</Tab>
              </TabList>

              <TabPanel>
                <BitRecord
                  title={title}
                  configBarAction={configBarAction}
                  options={options}
                ></BitRecord>
              </TabPanel>

              <TabPanel>
                <TrippingSpeed
                  title={title}
                  configBarAction={configBarAction}
                  options={options}
                ></TrippingSpeed>
              </TabPanel>

              <TabPanel>
                <DrillingState
                  title={title}
                  configBarAction={configBarAction}
                  options={options}
                ></DrillingState>
              </TabPanel>

              <TabPanel>
                <ReamBream
                  title={title}
                  configBarAction={configBarAction}
                  options={options}
                ></ReamBream>
              </TabPanel>
            </Tabs>
          </div>
        )}
      </header>
    </div>
  );
};
