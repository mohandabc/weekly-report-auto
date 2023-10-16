import { darkModeState } from "../../../shared/globalState";
import { useRecoilValue } from "recoil";
import { Chart } from "../../../components";

export const DrillState = (drillState) => {
  const darkMode = useRecoilValue(darkModeState);

  function createNestedDict(originalData, type) {
    const nestedDict = {};

    originalData.forEach((entry) => {
      const rigPhaseKey = `${entry[type]}|${entry.phase}`;
      const drillPipeSize = entry.drill_pipe_size;

      if (!nestedDict[rigPhaseKey]) {
        nestedDict[rigPhaseKey] = {};
      }

      if (!nestedDict[rigPhaseKey][drillPipeSize]) {
        nestedDict[rigPhaseKey][drillPipeSize] = {};
      }

      if (entry.shift === "Day Shift") {
        nestedDict[rigPhaseKey][drillPipeSize].day = entry.connection_time;
      } else if (entry.shift === "Night Shift") {
        nestedDict[rigPhaseKey][drillPipeSize].night = entry.connection_time;
      }
    });

    return nestedDict;
  }

  return (
    <div
      className="sticky rounded-xl bg-gray-200 dark:bg-stone-700 h-auto px-10"
      style={{ height: 1260, width: "100%" }}
    >
      <div className="flex justify-center items-center">
        <span className="text-xl py-4">Drill State</span>
      </div>
      <div className="grid grid-cols-1 grid-rows-2 gap-4">
        <Chart
          id="chart"
          chartData={createNestedDict(
            drillState["drillState"]["per_rig"],
            "rig"
          )}
          title="Drilling Connection Time Average Per Rig"
          c_options={{
            unit: "Minute",
            Benchmark_3_passed: "2",
            Benchmark_5_passed: "3",
            show_benchmark: "No",
          }}
          chartType="GroupedBarChart"
          className="h-160"
        />
        <Chart
          id="chart1"
          chartData={createNestedDict(
            drillState["drillState"]["per_well"],
            "well"
          )}
          title="Drilling Connection Time Average Per Well"
          c_options={{
            unit: "Minute",
            Benchmark_3_passed: "2",
            Benchmark_5_passed: "3",
            show_benchmark: "No",
          }}
          chartType="GroupedBarChart"
        />
        <Chart
          id="chart2"
          chartData={createNestedDict(
            drillState["drillState"]["per_contractor"],
            "contractor"
          )}
          title="Drilling Connection Time Average Per Contractor"
          c_options={{
            unit: "Minute",
            Benchmark_3_passed: "2",
            Benchmark_5_passed: "3",
            show_benchmark: "No",
          }}
          chartType="GroupedBarChart"
        />
      </div>
    </div>
  );
};
