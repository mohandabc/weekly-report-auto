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
import { useRecoilState } from "recoil";
import React from "react";

import "./styles.css";

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

  return (
    <div className="flex flex-col h-72 bg-reporting_image min-h-screen bg-no-repeat bg-cover bg-center bg-fixed">
      <div className="fixed top-0 z-50 w-full">
        <SideBar />
      </div>
      <header
        className={`flex flex-col h-72 bg-reporting_image min-h-screen bg-no-repeat bg-cover bg-center bg-fixed text-white text-3xl ${
          options.option == "Reporting" ? "justify-center" : ""
        } items-center`}
      >
        {options.option == "Reporting" ? (
          <>
            <div className="absolute mt-56 z-50">
              <Loader></Loader>
            </div>
            <div className="sticky rounded-xl bg-gray-200 w-1/2 h-96 ">
              <div className="flex justify-center items-center">
                <div className="py-9">
                  <h1 className="text-zinc-500 text-3xl text-center">
                    {title}
                  </h1>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <DateRangePicker
                  value={value}
                  onChange={setValue}
                  format="dd-MM-yyyy"
                  style={{
                    width: 257,
                  }}
                />
              </div>
              <div className="flex items-center justify-center m-11">
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
          <div className="flex sticky bg-reporting_image bg-no-repeat bg-cover bg-center bg-fixed my-36">
            <Tabs>
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
