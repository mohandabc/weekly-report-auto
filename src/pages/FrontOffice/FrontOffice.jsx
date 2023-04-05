/*****************************************************
 * TODO: IMPLEMENT THE FRONTOFFICE REPORTS GENERATORS*
 *****************************************************/

import React from "react";
import { ReportCard } from "../../components/ReportCard";

export const FrontOffice = () => {

  return (
    <div className="App">
      <header
        className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}
      >
        <div
          className={`sticky top-0 z-30 w-full dark:bg-black`}
        >
        </div>

        <div className="py-5 my-20">
          <h1 className="text-white text-3xl text-center">
            FRONT-OFFICE Reports
          </h1>
        </div>

        <div className="flex flex-wrap justify-center items-center">  
            <ReportCard 
                to="/eowr"
                title="End Of Well Report (EOWR)" 
                description="Automatically Generate End of Well Report"
                notReady
              />
            <ReportCard 
                to=""
                title="FO Daily Report" 
                description="Automatically Generate a front office daily report for a specific day"
                notReady
              />
            <ReportCard 
                to=""
                title="FO Weekly Report" 
                description="Automatically Generate a front office weekly report for a specific week"
                notReady
              />
            <ReportCard 
                to=""
                title="FO Monthly Report" 
                description="Automatically Generate a front office weekly report for a specific month"
                notReady
              />
         </div>
         
      </header>
    </div>
  );
};
