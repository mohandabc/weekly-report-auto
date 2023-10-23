import { Dropdown, IconButton } from "rsuite";
import { darkModeState } from "../../../shared/globalState";
import { useRecoilValue } from "recoil";
import BarChartIcon from "@rsuite/icons/BarChart";
import { Chart } from "../../../components";
import { useState } from "react";

export const NPTAnalysis = (NPTAnalysis) => {
  const darkMode = useRecoilValue(darkModeState);
  const [selectedItem, setSelectedItem] = useState("1");
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

  function rig_npt(npt_data) {
    let output = [];
    let total_npt = 0;
    let total_pt = 0;
    let grouped_rig = {};
    for (let item of npt_data) {
      let rig = item.rig;
      if (!grouped_rig[rig]) {
        grouped_rig[rig] = { npt: item.npt, pt: item.pt };
      } else {
        grouped_rig[rig].npt += item.npt;
        grouped_rig[rig].pt += item.pt;
      }
      total_npt += item.npt;
      total_pt += item.pt;
    }
    for (let rig in grouped_rig) {
      let row = {
        rig: rig,
        npt: grouped_rig[rig].npt,
        pt: grouped_rig[rig].pt,
      };
      output.push(row);
    }
    return output;
  }

function well_npt(data) {
  var result = {};
  for (var i = 0; i < data.length; i++) {
    var rig = data[i].rig;
    var well = data[i].well;
    if (result.hasOwnProperty(rig)) {
      if (result[rig].hasOwnProperty(well)) {
      } else {
        result[rig][well] = {
          "npt": data[i].npt,
          "pt": data[i].pt
        };
      }
    } else {
      result[rig] = {};
      result[rig][well] = {
        "npt": data[i].npt,
        "pt": data[i].pt
      };
    }
  }
  return result;
}

function NPT_details_grouped(data) {
  return data.reduce(function (r, a) {
    r[a.well] = r[a.well] || [];
    r[a.well].push(a);
    return r;
  }, Object.create(null));
};

function groupByField(data) {
  var grouped = {};
  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var field = d.field;
    if (!grouped.hasOwnProperty(field)) {
      grouped[field] = {npt: 0, pt: 0};
    }
    grouped[field].npt += d.npt;
    grouped[field].pt += d.pt;
  }
  var result = [];
  for (var key in grouped) {
    var row = {rig: key, npt: grouped[key].npt, pt: grouped[key].pt};
    result.push(row);
  }
  return result;
}


  return (
    <div
      className="sticky rounded-xl bg-gray-200 dark:bg-stone-700 h-auto px-10"
      style={{ height: 900, width: "100%" }}
    >
      <div className="sticky rounded-xl bg-gray-200 dark:bg-stone-700 px-10 h-full">
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
                Per Field
              </Dropdown.Item>
              <Dropdown.Item eventKey="4" onSelect={handleItemClick}>
                Per Category
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        {selectedItem === "1" && (
          <Chart
            id="chart"
            chartData={rig_npt(NPTAnalysis["nptAnalysis"]["npt_total"] || 'loading')}
            title="NPT Vs PT Per Rig"
            c_options={{
              cat: "rig",
              npt_only: false,
            }}
            chartType="NPT"
            className="h-160"
          />
        )}
        {selectedItem === "2" && (
          <Chart
            id="chart"
            chartData={well_npt(NPTAnalysis["nptAnalysis"]["npt_total"])}
            title="NPT Vs PT Per Well"
            c_options={{
              unit: "Days",
              serie1_name: "PT",
              serie2_name: "NPT",
              provide_data1: "pt",
              provide_data2: "npt",
              serie1_color: "#66DE93",
              serie2_color: "#FF616D",
              _NPT_details_grouped: NPT_details_grouped(NPTAnalysis["nptAnalysis"]["npt_details"])
            }}
            chartType="Monitored_vs_Drilled_Rig"
            className="h-160"
          />
        )}
        {selectedItem === "3" && (
          <Chart
            id="chart"
            chartData={groupByField(NPTAnalysis["nptAnalysis"]["npt_total"])}
            title="NPT Vs PT Per Field"
            c_options={{
              cat: "rig",
              npt_only: false,
            }}
            chartType="NPT"
            className="h-160"
          />
        )}
        {selectedItem === "4" && (
          <Chart
            id="chart"
            chartData={NPTAnalysis["nptAnalysis"]["npt_per_category_result"]}
            title="NPT Vs PT Per Category"
            c_options={{
              startAngle:0
            }}
            chartType="SemiCircle"
            className="h-160"
          />
        )}
      </div>
    </div>
  );
};
