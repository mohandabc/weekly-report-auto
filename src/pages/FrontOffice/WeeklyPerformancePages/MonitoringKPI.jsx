import { Dropdown, IconButton } from "rsuite";
import { darkModeState } from "../../../shared/globalState";
import { useRecoilValue } from "recoil";
import { useState } from "react";
import BarChartIcon from "@rsuite/icons/BarChart";
import { Chart } from "../../../components";
import MaterialReactTable from "material-react-table";

export const MonitoringKPI = (monitoringKPI) => {
  const darkMode = useRecoilValue(darkModeState);
  const [selectedItem, setSelectedItem] = useState("1");
  console.log(monitoringKPI);

  const handleItemClick = (itemKey) => {
    setSelectedItem(itemKey);
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

  const monitoredVSdrilledColumns = [
    {
      id: "Rig",
      accessorKey: "rig",
      header: "Rig",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Well",
      accessorKey: "well",
      header: "Well",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Meters Drilled [m]",
      accessorKey: "meters_drilled",
      header: "Meters Drilled [m]",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Meters Monitored [m]",
      accessorKey: "meters_monitored",
      header: "Meters Monitored [m]",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Service Value [%]",
      accessorKey: "service",
      header: "Service Value [%]",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Root Cause",
      accessorKey: "root_cause",
      header: "Root Cause",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
  ];

function createNestedDict(array) {
  let result = {};
  for (let element of array) {
    let rig = element.rig;
    let well = element.well;
    result[rig] = result[rig] || {};
    result[rig][well] = { meters_drilled: element.meters_drilled, meters_monitored: element.meters_monitored };
  }
  return result;
}

  return (
    <div
      className="sticky rounded-xl bg-gray-200 dark:bg-stone-700 h-auto p-10"
      style={{ height: 915, width: "100%" }}
    >
      <div className="flex flex-row-reverse rounded-xl bg-stone-100 dark:bg-stone-400">
        <div className="flex justify-end">
          <div className="mr-1.5 mt-1.5">
            <Dropdown renderToggle={renderIconButton} placement="leftStart">
              <Dropdown.Item eventKey="1" onSelect={handleItemClick}>
                Graph | Per Rig
              </Dropdown.Item>
              <Dropdown.Item eventKey="2" onSelect={handleItemClick}>
                Table | View
              </Dropdown.Item>
              <Dropdown.Item eventKey="3" onSelect={handleItemClick}>
                Graph | Total
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        {selectedItem === "1" && (
        <Chart
          id="chart"
          chartData={createNestedDict(monitoringKPI["monitoringKPI"]["drilled_vs_monitored_perRig"])}
          title="Meters Drilled Vs Monitored Per Rig"
          c_options={{
            unit: "Meters",
            serie1_name: "Meters Monitored",
            serie2_name: "Meters Drilled",
            provide_data1: "meters_drilled",
            provide_data2: "meters_monitored",
            serie1_color: "#004C99",
            serie2_color: "#CC6600",
          }}
          chartType="Monitored_vs_Drilled_Rig"
          className="h-160"
          shadow={false}
        />
      )}
        {selectedItem === "2" && (
        <MaterialReactTable
        columns={monitoredVSdrilledColumns}
        data={monitoringKPI["monitoringKPI"]["drilled_vs_monitored_perRig"]}
        initialState={{ density: "compact", showColumnFilters: true, pagination: {
          pageIndex: 0,
          pageSize: 15,
        }, }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: darkMode
              ? "rgba(0, 0, 0, 0.4)"
              : "rgba(39, 73, 98, 0.3)",
            color: darkMode
              ? "rgba(28, 28, 26, 1)"
              : "rgba(55, 90, 112, 1)",
          },
        }}
        muiTableBodyRowProps={({ row }) => ({
          sx: {
            backgroundColor: (theme) =>
              row.index % 2 !== 0
                ? darkMode
                  ? "rgba(28, 28, 26, 0.2)"
                  : "rgba(55, 90, 112, 0.15)"
                : darkMode
                ? "rgb(42, 44, 41, 0.2)"
                : "rgba(65, 100, 122, 0.1)",
          },
        })}
        muiBottomToolbarProps={{
          sx: {
            backgroundColor: darkMode
              ? "rgba(0, 0, 0, 0.4)"
              : "rgba(39, 73, 98, 0.3)",
            color: darkMode
              ? "rgba(28, 28, 26, 1)"
              : "rgba(55, 90, 112, 1)",
          },
        }}
        muiTopToolbarProps={{
          sx: {
            backgroundColor: darkMode
              ? "rgba(0, 0, 0, 0.4)"
              : "rgba(39, 73, 98, 0.3)",
            color: darkMode
              ? "rgba(28, 28, 26, 1)"
              : "rgba(55, 90, 112, 1)",
          },
        }}
        muiTableBodyCellProps={({ cell }) => ({
          sx: {
            backgroundColor:
              cell.column.columnDef.accessorKey === "Severity"
                ? cell.getValue() === "Major"
                  ? "rgba(255, 153, 153, 0.7)"
                  : cell.getValue() === "Medium"
                  ? "rgba(255, 191, 191, 0.7)"
                  : cell.getValue() === "Low"
                  ? "rgba(255, 214, 214, 0.7)"
                  : "inherit"
                : "inherit",
          },
        })}
      />
      )}
        {selectedItem === "3" && (
        <Chart
          id="chart"
          chartData={monitoringKPI["monitoringKPI"]["drilled_vs_monitored"]}
          title="Total Drilled Meters Vs Total Monitored Meters"
          c_options={{
            unit: "Minute",
            Benchmark_3_passed: "2",
            Benchmark_5_passed: "3",
            show_benchmark: "No",
          }}
          chartType="Monitored_vs_Drilled"
          className="h-160"
          shadow={false}
        />
      )}
      </div>
    </div>
  );
};
