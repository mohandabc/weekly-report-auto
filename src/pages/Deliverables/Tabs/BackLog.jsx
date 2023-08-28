import { useEffect, useMemo, useState } from "react";
import { Loader } from "../../../components";
import { getData } from "../../../api/api";
import { BACK_URL } from "../../../constants/URI";
import { MaterialReactTable } from "material-react-table";

export const BackLog = () => {
  const [animation, setAnimation] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setAnimation(true);
    getData(BACK_URL, "fetchDeliverables/", 0).then((res) => {
      setData(res);
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "Well",
        accessorKey: "analysis.well",
        size: 200,
      },
      {
        header: "Phase",
        accessorKey: "analysis.phase",
        size: 200,
      },
      {
        header: "Create Date",
        accessorKey: "analysis.create_date",
        type: 'date',
        size: 200,
      },
      {
        header: "Report Type",
        accessorKey: "analysis.analysis_type",
        size: 200,
      },
    ],
    []
  );

  return (
    <>
      <div className="absolute mt-56 z-50">
        <Loader></Loader>
      </div>
      <div
        className={`sticky rounded-xl bg-gray-200 dark:bg-stone-700 h-auto}`}
      >
        <div className="flex justify-center items-center">
          <div className="py-9">
            <h1
              className={`text-zinc-500 dark:text-black text-3xl text-center delay-200 duration-1000 relative transform transition-all ease-out ${
                animation
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              Deliverables Back Log
              {console.log(data)}
            </h1>
          </div>
        </div>
        <div
          className={`flex items-center justify-center pb-10 px-20 duration-1000 relative transform transition-all ease-out mb-10 ${
            animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <MaterialReactTable
            columns={columns}
            data={data}
            enableColumnActions={true}
            enableColumnFilters={true}
            enablePagination={true}
            enableSorting={true}
            enableBottomToolbar={true}
            enableTopToolbar={true}
            muiTableBodyRowProps={{ hover: true }}
            muiTableProps={{
              sx: {
                border: "1px solid rgba(81, 81, 81, 1)",
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                border: "1px solid rgba(81, 81, 81, 1)",
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                border: "1px solid rgba(81, 81, 81, 1)",
              },
            }}
            initialState={{
              density: "compact",
              expanded: true,
              pagination: { pageIndex: 0, pageSize: 10 },
              showColumnFilters: true,
              sorting: [{ id: "analysis.create_date", desc: false }],
            }}
            enableDensityToggle={false}
          />
        </div>
      </div>
    </>
  );
};
