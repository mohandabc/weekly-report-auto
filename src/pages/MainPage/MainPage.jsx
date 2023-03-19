import { TopMenu } from "../../components/TopMenu";
import React, { useState } from "react";
import { useAuth } from "../../services/useAuth";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";
import { Chart} from '../../components';
import "./mainPage.css";

export const MainPage = () => {
  const darkMode = useRecoilValue(darkModeState);
  const { user } = useAuth();
  const [testData, setTestData] = useState({})
  const [testData2, setTestData2] = useState({})

  const seeStatsClick = () => {
    // TODO: Call back to get necessary data and set it to states, no need for recoil global state, cause these will not be printed
    setTestData([{'category': 'good', 'value':2}, {'category': 'bad', 'value':5}])
    setTestData2([{'type' : 'test', 'category': 'good', 'value':2}, {'type' : 'test', 'category': 'bad', 'value':5},{'type' : 'test2', 'category': 'bad', 'value':2}, {'type' : 'test2', 'category': 'good', 'value':2}])
    const statSection = document.getElementById("stats");
    const down = document.getElementById("go-down");
    statSection.classList.toggle('hidden');
    down.classList.toggle('hidden');
    statSection.scrollIntoView({behavior: "smooth"});
    
  };

  let chartsIds = [];
  let tablesIds = [];

  let divNumber = 0;
  const getDivId = (type) => {
    divNumber +=1;
    let divId = `${type}-div-${divNumber}`;
    if (type === 'chart'){
        chartsIds = [...chartsIds, divId];
    }
    if (type === 'table'){
        tablesIds = [...tablesIds, divId];
    }
    return divId;

  }

  return (
    <>
      <div className={`sticky top-0 z-30 w-full dark:bg-black`}>
        <TopMenu appearance={`${darkMode ? "subtle": "default"}`}/>
      </div>
      <header className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}>
        <div className="flex sticky top-40 justify-center items-center">
          <div className="pt-24 pb-24">
            <h1 className="my-4 mx-9 text-2xl font-bold leading-tight text-slate-200">
              Welcome {user.name} !
            </h1>
            <p className="leading-normal text-2xl mb-8 text-slate-200">
              Here is a set of protocols and tools designed to extract data into
              custom reports for more automated and efficient reporting and
              analysis !
            </p>
          </div>
        </div>
        <div className="fixed bottom-10 left-0 right-0 pb-10 flex justify-center">
          <button id="go-down"  className="z-100 bg-indigo-600 text-white py-8 px-4 rounded-full shadow-lg transition transition-transform duration-300">
              See Stats
          </button>
        </div>
      </header>
      <section id="stats" className="h-full pt-10 bg-gradient-to-b from-cyan-900 to-blue-900 dark:from-black dark:to-indigo-400 bg-cover bg-center hidden">
  
                <section id="main" className={`grid grid-col-1 xl:grid-cols-3 gap-4 place-items-top px-2  pb-4`} >
                    <Chart title = "Pending Quality Tickets" id = {getDivId('chart')} chartData = {testData} chartType="Pie" dashboard/>
                    <Chart title = "Resolved Quality Tickets" id = {getDivId('chart')} chartData = {testData} chartType="Pie" dashboard/>
                    <Chart title = "Pending Quality Channels" id = {getDivId('chart')} chartData = {testData} chartType="Bar" dashboard/>
                    <Chart title = "Resolved Quality Channels" id = {getDivId('chart')} chartData = {testData2} chartType="ClusterBar" dashboard/>
                </section>
           
      </section>
    </>
  );
};
