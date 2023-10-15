import { WeeklyPerformanceInputScreen } from "../../components";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { darkModeState } from "../../shared/globalState";
import { useRecoilValue } from "recoil";
import { DrillState, EventsKPIs, TrippingSpeed } from "./WeeklyPerformancePages";

export const WeeklyPerformance = () => {
  const darkMode = useRecoilValue(darkModeState);
  const [weeklyPerformanceData, setWeeklyPerformanceData] = useState(undefined);
  const [eventsKPI, setEventsKPI] = useState(undefined);
  const [drillState, setDrillState] = useState(undefined);
  const [trippingSpeed, setTrippingSpeed] = useState(undefined);

  useEffect(() => {
    console.log("Results : ", weeklyPerformanceData);
  }, [weeklyPerformanceData]);

  useEffect(() => {
    const mainSection = document.getElementById("result-section");
    if (mainSection) {
      const headerOffset = 30; // Set your desired offset in pixels
      const elementPosition = mainSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });

  return (
    <div className="App">
      <WeeklyPerformanceInputScreen
        setWeeklyPerformanceData={setWeeklyPerformanceData}
        setEventsKPI={setEventsKPI}
        setDrillState={setDrillState}
        setTrippingSpeed={setTrippingSpeed}
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
                <EventsKPIs eventsKPI={eventsKPI} />
              </TabPanel>

              <TabPanel>
                <TrippingSpeed trippingSpeed={trippingSpeed}/>
              </TabPanel>

              <TabPanel>
                <DrillState drillState={drillState} />
              </TabPanel>

              <TabPanel></TabPanel>
              <TabPanel></TabPanel>
            </Tabs>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
