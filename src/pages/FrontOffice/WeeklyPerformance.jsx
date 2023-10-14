import { WeeklyPerformanceInputScreen } from "../../components";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { darkModeState } from "../../shared/globalState";
import { useRecoilValue } from "recoil";
import { EventsKPIs } from "./WeeklyPerformancePages";

export const WeeklyPerformance = () => {
  const darkMode = useRecoilValue(darkModeState);
  const [weeklyPerformanceData, setWeeklyPerformanceData] = useState(undefined);
  const [eventsKPI, setEventsKPI] = useState(undefined);
  
  useEffect(() => {
    console.log(weeklyPerformanceData);
  }, [weeklyPerformanceData]);

  return (
    <div className="App">
      <WeeklyPerformanceInputScreen
        setWeeklyPerformanceData={setWeeklyPerformanceData}
        setEventsKPI={setEventsKPI}
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
                <EventsKPIs eventsKPI={eventsKPI}/>
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
