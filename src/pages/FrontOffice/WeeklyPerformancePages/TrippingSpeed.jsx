import { Dropdown, IconButton } from "rsuite";
import { darkModeState } from "../../../shared/globalState";
import { useRecoilValue } from "recoil";
import BarChartIcon from "@rsuite/icons/BarChart";
import { useState } from "react";
import { Chart } from "../../../components";

export const TrippingSpeed = (trippingSpeed) => {
  const darkMode = useRecoilValue(darkModeState);
  const [selectedItem, setSelectedItem] = useState("2");
  const [selectedItem2, setSelectedItem2] = useState("2");

  var TS_Data = trippingSpeed.trippingSpeed["TS_Data"];
  console.log(groupAndAverage(TS_Data, ["well", "phase", "drill_pipe_size"], "speed"), "by well")
  console.log(groupAndAverage(TS_Data, ["rig", "phase", "drill_pipe_size"], "speed"), "by rig")
  
function groupAndAverage(data, keys, type) {
  function average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
  let result = {};
  for (let obj of data) {
    let key = keys.map(k => obj[k]).join("|");

    let subkey = obj["drill_pipe_size"];

    if (!result[key]) {
      result[key] = {};
    }
    if (!result[key][subkey]) {
      result[key][subkey] = {};
    }
    if (!result[key][subkey]["day"]) {
      result[key][subkey]["day"] = [];
    }
    if (!result[key][subkey]["night"]) {
      result[key][subkey]["night"] = [];
    }
    if (type === "speed") {
      result[key][subkey]["day"].push(obj["avg_spd_day"]);
      result[key][subkey]["night"].push(obj["avg_spd_night"]);
    } else if (type === "connectionTime") {
      result[key][subkey]["day"].push(obj["avg_ct_day"]);
      result[key][subkey]["night"].push(obj["avg_ct_night"]);
    } else {
      return "Invalid type parameter. Please use either 'speed' or 'connectionTime'.";
    }
  }
  for (let key in result) {
    for (let subkey in result[key]) {
      result[key][subkey]["day"] = average(result[key][subkey]["day"]);
      result[key][subkey]["night"] = average(result[key][subkey]["night"]);
    }
  }
  return result;
}


  const handleItemClick = (itemKey) => {
    setSelectedItem(itemKey);
  };
  const handleItemClick2 = (itemKey) => {
    setSelectedItem2(itemKey);
  };

  const renderIconButton = (props, ref) => {
    return (
      <IconButton
        {...props}
        ref={ref}
        icon={<BarChartIcon />}
        color="cyan"
        appearance="primary"
        size="sm"
      />
    );
  };

  return (
    <div className="sticky rounded-xl bg-gray-200 dark:bg-stone-700 h-auto p-10">
      <div className="sticky rounded-xl bg-stone-100 dark:bg-stone-400">
        <div className="flex justify-end">
          <div className="mr-1.5 mt-1.5">
            <Dropdown renderToggle={renderIconButton} placement="leftStart">
              <Dropdown.Item eventKey="1" onSelect={handleItemClick}>
                Per Rig
              </Dropdown.Item>
              <Dropdown.Item eventKey="2" onSelect={handleItemClick}>
                Per Well
              </Dropdown.Item>
              <Dropdown.Item eventKey="3" onSelect={handleItemClick}>
                Per Hoisting System
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        {selectedItem === "1" && (
          <Chart
            id="chart"
            chartData={groupAndAverage(TS_Data, ["well", "phase", "drill_pipe_size"], "speed")}
            title="Tripping Speed Average Per Well"
            c_options={{
              unit: "m/h",
              Benchmark_3_passed: "2",
              Benchmark_5_passed: "3",
              show_benchmark: "Yes",
            }}
            chartType="GroupedBarChart"
            className="h-160"
            shadow={false}
          />
        )}
        {selectedItem === "2" && (
          <Chart
            id="chart"
            chartData={groupAndAverage(TS_Data, ["rig", "phase", "drill_pipe_size"], "speed")}
            title="Tripping Speed Average Per Rig"
            c_options={{
              unit: "m/h",
              Benchmark_3_passed: "2",
              Benchmark_5_passed: "3",
              show_benchmark: "Yes",
            }}
            chartType="GroupedBarChart"
            className="h-160"
            shadow={false}
          />
        )}
      </div>
      <div className="sticky rounded-xl bg-stone-100 dark:bg-stone-400 mt-10">
        <div className="flex justify-end">
          <div className="mr-1.5 mt-1.5">
            <Dropdown renderToggle={renderIconButton} placement="leftStart">
              <Dropdown.Item eventKey="1" onSelect={handleItemClick2}>
                Per Rig
              </Dropdown.Item>
              <Dropdown.Item eventKey="2" onSelect={handleItemClick2}>
                Per Well
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        {selectedItem2 === "1" && (
          <Chart
            id="chart1"
            chartData={groupAndAverage(TS_Data, ["well", "phase", "drill_pipe_size"], "connectionTime")}
            title="Tripping Connection Time Average Per Well"
            c_options={{
              unit: "Minute",
              Benchmark_3_passed: "2",
              Benchmark_5_passed: "3",
              show_benchmark: "Yes",
            }}
            chartType="GroupedBarChart"
            className="h-160"
            shadow={false}
          />
        )}
        {selectedItem2 === "2" && (
          <Chart
            id="chart1"
            chartData={groupAndAverage(TS_Data, ["rig", "phase", "drill_pipe_size"], "connectionTime")}
            title="Tripping Connection Time Average Per Rig"
            c_options={{
              unit: "Minute",
              Benchmark_3_passed: "2",
              Benchmark_5_passed: "3",
              show_benchmark: "Yes",
            }}
            chartType="GroupedBarChart"
            className="h-160"
            shadow={false}
          />
        )}
      </div>
    </div>
  );
};
