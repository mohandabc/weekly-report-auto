import "./react-tabs.css";
import { MultiTable, WeeklyPerformanceInputScreen } from "../../components";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { darkModeState } from "../../shared/globalState";
import { useRecoilValue } from "recoil";

export const WeeklyPerformance = () => {
  const darkMode = useRecoilValue(darkModeState);
  const [weeklyPerformanceData, setWeeklyPerformanceData] = useState(undefined);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    console.log(weeklyPerformanceData);
  }, [weeklyPerformanceData]);

  return (
    <div className="App">
      <WeeklyPerformanceInputScreen
        setWeeklyPerformanceData={setWeeklyPerformanceData}
      />
      {weeklyPerformanceData ? (
        <div id="result-section" className={`bg-slate-300 dark:bg-zinc-900`}>
          <div className="p-10">
            <Tabs
              defaultIndex={0}
              selectedTabClassName={`${
                darkMode
                  ? "react-tabs__tab--selecteddark"
                  : "react-tabs__tab--selectedlight"
              }`}
            >
              <TabList>
                <Tab>Event KPI's</Tab>
                <Tab>Tripping Speed</Tab>
                <Tab>Drill State</Tab>
                <Tab>Monitoring KPI</Tab>
                <Tab>NPT Analysis</Tab>
              </TabList>

              <TabPanel>
                <div
                  className={`sticky rounded-xl bg-gray-200 dark:bg-stone-700 h-auto}`}
                >
                  <div className="flex justify-center items-center">
                    <div className="py-9">
                      <h1
                        className={`text-zinc-500 dark:text-black text-base text-center`}
                      >
                        <section
                          className={`align-middle grid grid-col-1 xl:grid-cols-1 gap-4 place-items-top px-2 pb-4`}
                        >
                          <MultiTable
                            title="Drilling Events Captured"
                            id="table-1"
                            tableData={
                              weeklyPerformanceData['events_data']["event_kpi_res"]
                            }
                          />
                        </section>
                        <section
                          className={`align-middle grid grid-col-1 xl:grid-cols-1 gap-4 place-items-top px-2 pb-4`}
                        >
                          <MultiTable
                            title="Drilling Events Caused NPT"
                            id="table-2"
                            tableData={
                              weeklyPerformanceData['events_data']["event_caused_npt_res"]
                            }
                          />
                        </section>
                      </h1>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel></TabPanel>

              <TabPanel></TabPanel>
              <TabPanel></TabPanel>
              <TabPanel></TabPanel>
            </Tabs>
          </div>
        </div>
      ) : (
        "There is no data !!"
      )}
    </div>
  );
};
