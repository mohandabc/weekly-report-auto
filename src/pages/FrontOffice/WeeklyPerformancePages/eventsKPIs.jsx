import "./react-tabs.css";
import { darkModeState } from "../../../shared/globalState";
import { useRecoilValue } from "recoil";
import MaterialReactTable from "material-react-table";

export const EventsKPIs = (eventsKPI) => {
  const darkMode = useRecoilValue(darkModeState);

  const columnsEvents = [
    {
      id: "Rig",
      accessorKey: "Rig",
      header: "Rig / Well",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Depth",
      accessorKey: "Depth",
      header: "Depth",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Section",
      accessorKey: "Section",
      header: "Section",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "DateStart",
      accessorKey: "DateStart",
      header: "Date Start",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Title",
      accessorKey: "Title",
      header: "Title",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "OffsetWellRisk",
      accessorKey: "OffsetWellRisk",
      header: "Offset Well Risk",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "SubCategory",
      accessorKey: "SubCategory",
      header: "Sub Category",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Formation",
      accessorKey: "Formation",
      header: "Formation",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Operation",
      accessorKey: "Operation",
      header: "Operation",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Severity",
      accessorKey: "Severity",
      header: "Severity",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
  ];
  const columnsEventsNPT = [
    {
      id: "Rig",
      accessorKey: "Rig",
      header: "Rig / Well",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Depth",
      accessorKey: "Depth",
      header: "Depth",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Section",
      accessorKey: "Section",
      header: "Section",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Date",
      accessorKey: "Date",
      header: "Date Start",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Title",
      accessorKey: "Title",
      header: "Title",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "NPTCaused",
      accessorKey: "NPTCaused",
      header: "NPT Caused",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "OffsetWellRisk",
      accessorKey: "OffsetWellRisk",
      header: "Offset Well Risk",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "NPTSubCategory",
      accessorKey: "NPTSubCategory",
      header: "NPT Sub Category",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Formation",
      accessorKey: "Formation",
      header: "Formation",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Operation",
      accessorKey: "Operation",
      header: "Operation",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
    {
      id: "Severity",
      accessorKey: "Severity",
      header: "Severity",
      size: 10,
      muiTableBodyCellProps: { align: "center" },
    },
  ];

  return (
    <div
      className="sticky rounded-xl bg-gray-200 dark:bg-stone-700 h-auto px-10"
      style={{ height: 1310, width: "100%" }}
    >
      <div className="flex justify-center items-center">
        <span className="text-xl py-4">Drilling Events</span>
      </div>
      <div>
        <MaterialReactTable
          columns={columnsEvents}
          data={eventsKPI.eventsKPI["event_kpi_res"]}
          initialState={{ density: "compact", showColumnFilters: true }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: darkMode
                ? "rgba(0, 0, 0, 0.4)"
                : "rgba(39, 73, 98, 0.3)",
              color: darkMode ? "rgba(28, 28, 26, 1)" : "rgba(55, 90, 112, 1)",
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            sx: {
              cursor: "pointer",
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
              color: darkMode ? "rgba(28, 28, 26, 1)" : "rgba(55, 90, 112, 1)",
            },
          }}
          muiTopToolbarProps={{
            sx: {
              backgroundColor: darkMode
                ? "rgba(0, 0, 0, 0.4)"
                : "rgba(39, 73, 98, 0.3)",
              color: darkMode ? "rgba(28, 28, 26, 1)" : "rgba(55, 90, 112, 1)",
            },
          }}
        />
      </div>

      <div className="flex justify-center items-center">
        <span className="text-xl py-4">Drilling Events That Caused NPT</span>
      </div>
      <MaterialReactTable
        columns={columnsEventsNPT}
        data={eventsKPI.eventsKPI["event_caused_npt_res"]}
        initialState={{ density: "compact", showColumnFilters: true }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: darkMode
              ? "rgba(0, 0, 0, 0.4)"
              : "rgba(39, 73, 98, 0.3)",
            color: darkMode ? "rgba(28, 28, 26, 1)" : "rgba(55, 90, 112, 1)",
          },
        }}
        muiTableBodyRowProps={({ row }) => ({
          sx: {
            cursor: "pointer",
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
            color: darkMode ? "rgba(28, 28, 26, 1)" : "rgba(55, 90, 112, 1)",
          },
        }}
        muiTopToolbarProps={{
          sx: {
            backgroundColor: darkMode
              ? "rgba(0, 0, 0, 0.4)"
              : "rgba(39, 73, 98, 0.3)",
            color: darkMode ? "rgba(28, 28, 26, 1)" : "rgba(55, 90, 112, 1)",
          },
        }}
      />
    </div>
  );
};
