import "./react-tabs.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";


import {
    BitRecord,
    DrillingState,
    ReamBream,
    TrippingSpeed,
  } from "../../pages";
import { BackLog } from "../../pages/Deliverables/Tabs/BackLog";


export const DeliverableInputScreen  = ({ title, configBarAction, options }) => {
 
  const [animation, setAnimation] = useState(false);
  const darkMode = useRecoilValue(darkModeState);

  useEffect(() => {
    setAnimation(true);
  },[]);

  return (
    <div className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}>
      <div className={`fixed top-0 z-50 w-full dark:bg-black`}>
      </div>

      <header className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed text-white text-3xl items-center`}>
          <div className={`flex sticky my-36 transform transition-all duration-1000 ease-out ${
            animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}>
            <Tabs
              defaultIndex={1}
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
                <Tab>Backlog</Tab>
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
              <TabPanel>
                <BackLog
                  title={title}
                  configBarAction={configBarAction}
                  options={options}
                ></BackLog>
              </TabPanel>
            </Tabs>
          </div>
        
      </header>
    </div>
  );
  };
  