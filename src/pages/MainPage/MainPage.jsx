import React, { useState, useEffect } from "react";
import { useAuth } from "../../api/useAuth";
import { Chart } from "../../components";
import "./mainPage.css";

export const MainPage = () => {
  const { user } = useAuth();
  const [testData, setTestData] = useState({});
  const [testData2, setTestData2] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000); // Delay for the typing effect, adjust as needed
  }, []);

  const seeStatsClick = () => {
    // TODO: Call back to get necessary data and set it to states, no need for recoil global state, cause these will not be printed
    setTestData([
      { category: "good", value: 2 },
      { category: "bad", value: 5 },
    ]);
    setTestData2([
      { type: "test", category: "good", value: 2 },
      { type: "test", category: "bad", value: 5 },
      { type: "test2", category: "bad", value: 2 },
      { type: "test2", category: "good", value: 2 },
    ]);

    const statSection = document.getElementById("stats");
    const down = document.getElementById("go-down");
    statSection.classList.toggle("hidden");
    down.classList.toggle("hidden");
    statSection.scrollIntoView({ behavior: "smooth" });
  };

  let chartsIds = [];
  let tablesIds = [];
  let divNumber = 0;

  const getDivId = (type) => {
    divNumber += 1;
    let divId = `${type}-div-${divNumber}`;
    if (type === "chart") {
      chartsIds = [...chartsIds, divId];
    }
    if (type === "table") {
      tablesIds = [...tablesIds, divId];
    }
    return divId;
  };

  return (
    <>
      <div className={`sticky top-0 z-30 w-full dark:bg-black`}>
        {/* ... */}
      </div>
      <header
        className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed header`}
      >
        <div className="flex sticky top-40 justify-center items-center">
          <div className="py-12 px-48 bg-gradient-to-b from-sky-900 to-transparent rounded-lg shadow-lg mx-9">
            <h1 className="my-4 text-4xl font-bold leading-tight text-white">
              <span className="text-4xl text-sky-400">
                Welcome {user.name}!
              </span>
            </h1>
            <p className="leading-normal text-2xl mb-8 text-white px-16">
              <span className="text-2xl font-semibold">OilPort:</span> Your
              Gateway to Oil Field Data and Analytics
              <br />
              <span className="text-2xl font-semibold">Unlock</span> the power
              of data-driven insights with our reporting app.
              <br /> OilPort provides a comprehensive portal to oil field data
              and analytics,
              <br /> offering you the tools and protocols needed to extract and
              analyze data efficiently.
              <br /> Discover automated reporting and gain valuable insights for
              your operations.
            </p>
          </div>
        </div>
        <div className="fixed bottom-10 left-0 right-0 pb-10 flex justify-center">
          <button
            id="go-down"
            className="z-100 py-8 px-4 rounded-full shadow-lg transition transition-transform duration-300 button bg-slate-200 hover:bg-indigo-400 hover:text-white"
            onClick={seeStatsClick}
          >
            See Stats
          </button>
        </div>
      </header>
      <section
        id="stats"
        className="h-full pt-10 bg-gradient-to-b from-cyan-900 to-blue-900 dark:from-black dark:to-indigo-400 bg-cover bg-center hidden"
      >
        <section
          id="main"
          className={`grid grid-col-1 xl:grid-cols-3 gap-4 place-items-top px-2  pb-4`}
        >
          {/* <Chart title = "Pending Quality Tickets" id = {getDivId('chart')} chartData = {testData} chartType="Pie" dashboard/>
                    <Chart title = "Resolved Quality Tickets" id = {getDivId('chart')} chartData = {testData} chartType="Pie" dashboard/>
                    <Chart title = "Pending Quality Channels" id = {getDivId('chart')} chartData = {testData} chartType="Bar" dashboard/>
                    <Chart title = "Resolved Quality Channels" id = {getDivId('chart')} chartData = {testData2} chartType="ClusterBar" dashboard/> */}
        </section>
      </section>
    </>
  );
};
