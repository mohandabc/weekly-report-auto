import { darkModeState } from "../../../shared/globalState";
import { useRecoilValue } from "recoil";
import { Chart } from "../../../components";
import { ButtonToolbar, Dropdown, IconButton, Whisper } from "rsuite";
import { useState } from "react";
import BarChartIcon from "@rsuite/icons/BarChart";

export const DrillState = (drillState) => {
  const darkMode = useRecoilValue(darkModeState);
  const [selectedItem, setSelectedItem] = useState("1");

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

  function WTWmapDATA(data) {
    let new_data = {};
  
    (data).forEach(function (element) {
      let obj={};
      if (element.shift==='Day Shift') {
        obj['rig']=element['rig'] + ' | ' + element['phase']
        obj['day_pre_conn']=element['pre_conn']
        obj['day_connection_time']=element['connection_time']
        obj['day_post_conn']=element['post_conn']
      } else {
        obj['rig']=element['rig'] + ' | ' + element['phase']
        obj['night_pre_conn']=element['pre_conn']
        obj['night_connection_time']=element['connection_time']
        obj['night_post_conn']=element['post_conn']
      }
      new_data[element['rig'] + ' | ' + element['phase']]=Object.assign({}, new_data[element['rig'] + ' | ' + element['phase']], obj);;
  });
  return Object.values(new_data);
  }

  function filterByValue(array, value) {
    return array.filter((obj) => obj.rotary_system !== value);
  }

  const handleItemClick = (itemKey) => {
    setSelectedItem(itemKey);
  };

  const renderIconButton = (props, ref) => {
    return (
      <IconButton
        {...props}
        ref={ref}
        icon={<BarChartIcon />}
        color="green"
        appearance="primary"
      />
    );
  };

  return (
    <div
      className="sticky rounded-xl bg-gray-200 dark:bg-stone-700 px-10 h-full"
    >
      <div className="flex justify-end">
        <div className="mt-5 mr-1">
          <Dropdown renderToggle={renderIconButton} placement="leftStart">
            <Dropdown.Item eventKey="1" onSelect={handleItemClick}>
              Per Rig
            </Dropdown.Item>
            <Dropdown.Item eventKey="2" onSelect={handleItemClick}>
              Per Well
            </Dropdown.Item>
            <Dropdown.Item eventKey="3" onSelect={handleItemClick}>
              Per Contractor
            </Dropdown.Item>
            <Dropdown.Item eventKey="4" onSelect={handleItemClick}>
              Top-Drive
            </Dropdown.Item>
            <Dropdown.Item eventKey="5" onSelect={handleItemClick}>
              Kelly
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      {selectedItem === "1" && (
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
      )}
      {selectedItem === "2" && (
        <Chart
          id="chart"
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
          className="h-160"
        />
      )}
      {selectedItem === "3" && (
        <Chart
          id="chart"
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
          className="h-160"
        />
      )}
      {selectedItem === "4" && (
        <Chart
          id="chart"
          chartData={createNestedDict(
            filterByValue(drillState["drillState"]["per_rig"], "kelly"),
            "rig"
          )}
          title="Drilling Connection Time Average Per Rig (Top Drive)"
          c_options={{
            unit: "Minute",
            Benchmark_3_passed: "2",
            Benchmark_5_passed: "3",
            show_benchmark: "No",
          }}
          chartType="GroupedBarChart"
          className="h-160"
        />
      )}
      {selectedItem === "5" && (
        <Chart
          id="chart"
          chartData={createNestedDict(
            filterByValue(drillState["drillState"]["per_rig"], "top_drive"),
            "rig"
          )}
          title="Drilling Connection Time Average Per Rig (Kelly)"
          c_options={{
            unit: "Minute",
            Benchmark_3_passed: "2",
            Benchmark_5_passed: "3",
            show_benchmark: "No",
          }}
          chartType="GroupedBarChart"
          className="h-160"
        />
      )}
      <div className="my-3">
        <Chart
          id="chart1"
          chartData={WTWmapDATA(drillState["drillState"]["WTW_shift"])}
          title="Drilling Connection Time Average Per Rig (Kelly)"
          c_options={{
            category_axis: 'rig',
          }}
          chartType="WTW_shift"
          className="h-160"
        />
      </div>
      <div className="grid grid-cols-1 grid-rows-2 gap-4"></div>
    </div>
  );
};
