import { WeeklyPerformanceInputScreen } from "../../components";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { darkModeState } from "../../shared/globalState";
import { useRecoilValue } from "recoil";
import { DrillState, EventsKPIs, MonitoringKPI, NPTAnalysis, TrippingSpeed } from "./WeeklyPerformancePages";

export const WeeklyPerformance = () => {
  const darkMode = useRecoilValue(darkModeState);
  const [weeklyPerformanceData, setWeeklyPerformanceData] = useState(undefined);
  const [isDataEmpty, setIsDataEmpty] = useState(true);
  const [eventsKPI, setEventsKPI] = useState(undefined);
  const [drillState, setDrillState] = useState(undefined);
  const [trippingSpeed, setTrippingSpeed] = useState(undefined);
  const [monitoringKPI, setMonitoringKPI] = useState(undefined);
  const [nptAnalysis, setNPTAnalysis] = useState(undefined);

  useEffect(() => {
    console.log("Results : ", weeklyPerformanceData);
    console.log("Results : ", eventsKPI);
  }, [weeklyPerformanceData, eventsKPI]);

  useEffect(() => {
    const mainSection = document.getElementById("result-section");
    if (mainSection) {
      const headerOffset = 30;
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
        setMonitoringKPI={setMonitoringKPI}
        setNPTAnalysis={setNPTAnalysis}
        setIsDataEmpty={setIsDataEmpty}
      />
      {!isDataEmpty&&trippingSpeed ? (
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

              <TabPanel>
                <MonitoringKPI monitoringKPI={monitoringKPI} events={eventsKPI}/>
              </TabPanel>

              <TabPanel>
                <NPTAnalysis nptAnalysis={nptAnalysis}/>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
