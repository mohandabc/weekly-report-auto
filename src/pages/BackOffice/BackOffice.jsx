import { SideBar } from "../../components/SideBar";
import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";
import { ReportCard } from "../../components/ReportCard";

export const BackOffice = () => {
  const darkMode = useRecoilValue(darkModeState);


  return (
    <div className="App">
      <header
        className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode  min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}
      >
        <div className={`sticky top-0 z-30 w-full dark:bg-black`}>
          <SideBar
            appearance={`${darkMode ? "subtle": "default"}`}
          />
        </div>

        <div className="py-5">
          <h1 className="text-white text-3xl text-center">
            BACK-OFFICE Reports
          </h1>
        </div>

        <div className="flex flex-wrap justify-center items-center">
              <ReportCard 
                to="/dailyBo"
                title = "BO Daily Report" 
                description="Automatically Generate a back office daily report for a specific day"
              />
              <ReportCard 
                to="/weeklyBo"
                title="BO Weekly Report" 
                description="Automatically Generate a back office weekly report for a specific week"
              />
              <ReportCard 
                to=""
                title="BO Monthly Report" 
                description="Automatically Generate a back office monthly report for a specific week"
                notReady
              />
        </div>
        
      </header>
    </div>
  );
};
