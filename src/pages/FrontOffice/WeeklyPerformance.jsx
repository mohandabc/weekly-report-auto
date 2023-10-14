import { WeeklyPerformanceInputScreen } from "../../components";
import { useEffect,useState } from "react";

export const WeeklyPerformance = () => {
  const [weeklyPerformanceData, setWeeklyPerformanceData] = useState(undefined);

  useEffect(() => {
    console.log(weeklyPerformanceData);
  }, [weeklyPerformanceData]);
  return (
    <div className="App">
      <WeeklyPerformanceInputScreen setWeeklyPerformanceData={setWeeklyPerformanceData}/>
      {weeklyPerformanceData?'There is data !!':'There is no data !!'}
    </div>
  );
};
