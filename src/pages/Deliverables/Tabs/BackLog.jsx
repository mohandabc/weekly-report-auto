import { useEffect, useMemo, useState } from "react";
import { Loader } from "../../../components";
import { BACK_URL } from "../../../constants/URI";
import { MaterialReactTable } from "material-react-table";
import { getData } from "../../../api/api";
import { TsAnalysis } from "./AnalysisForms/TsAnalysis";
import { darkModeState } from "../../../shared/globalState";
import { useRecoilValue } from "recoil";

export const BackLog = () => {
  //data and fetching state
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([
    { id: "analysis.create_date", desc: true },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const [tsAnalysisData, setTsAnalysisData] = useState(null);
  const [docId, setDocId] = useState(null);

  const darkMode = useRecoilValue(darkModeState);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const url = new URL("fetchDeliverables/", BACK_URL);
      url.searchParams.set("page", `${pagination.pageIndex}`);
      url.searchParams.set("size", `${pagination.pageSize}`);
      url.searchParams.set(
        "filters",
        JSON.stringify(
          columnFilters.map((filter) => ({
            ...filter,
            id: filter.id.replace("analysis.", ""),
          })) ?? []
        )
      );
      url.searchParams.set("globalFilter", globalFilter ?? "");
      url.searchParams.set(
        "sorting",
        JSON.stringify(
          sorting.map((filter) => ({
            ...filter,
            id: filter.id.replace("analysis.", ""),
          })) ?? []
        )
      );

      try {
        const response = await fetch(url.href);
        const json = await response.json();
        setData(json.items);
        setAnimation(true);
        setRowCount(json.total);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);

  const columns = useMemo(
    () => [
      {
        header: "Well",
        accessorKey: "analysis.well",
        size: 200,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        header: "Trip Type",
        accessorKey: "analysis.trip_information.trip_type",
        size: 200,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        header: "Phase",
        accessorKey: "analysis.phase",
        size: 200,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        header: "Create Date",
        accessorKey: "analysis.create_date",
        type: "date",
        size: 200,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        header: "Created By",
        accessorKey: "analysis.created_by",
        size: 200,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        header: "Report Type",
        accessorKey: "analysis.analysis_type",
        size: 200,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],
    []
  );

  function getTSanalysisRecord(id) {
    const path = `TrippingSpeed/getDoc/${id}`;
    getData(BACK_URL, path, id).then((res) => {
      console.log(res);
      setTsAnalysisData(res.ts_analysis);
      setDocId(res._id);
    });
  }

  const resetStates = () => {
    setGlobalFilter('')
  };

    return (
    <>
      {tsAnalysisData ? (
        <div
          className={`sticky rounded-xl bg-gray-200 dark:bg-stone-700 h-auto`}
        >
          <TsAnalysis
            key={docId}
            TsAnalysisData={tsAnalysisData}
            doc_id={docId}
            resetStates={resetStates}
            ParentComponent={BackLog}
            parentStr="BackLog"
          />
        </div>
      ) : (
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
                  Deliverables Backlog
                </h1>
              </div>
            </div>
            <div
              className={`flex items-center justify-center pb-10 px-10 duration-1000 relative transform transition-all ease-out ${
                animation
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <MaterialReactTable
                columns={columns}
                data={data}
                getRowId={(row) => row._id}
                initialState={{ density: "compact", showColumnFilters: true }}
                manualFiltering
                manualPagination
                manualSorting
                muiToolbarAlertBannerProps={
                  isError
                    ? {
                        color: "error",
                        children: "Error loading data",
                      }
                    : undefined
                }
                enableDensityToggle={false}
                onColumnFiltersChange={setColumnFilters}
                onGlobalFilterChange={setGlobalFilter}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                rowCount={rowCount}
                state={{
                  columnFilters,
                  globalFilter,
                  isLoading,
                  pagination,
                  showAlertBanner: isError,
                  showProgressBars: isRefetching,
                  sorting,
                }}
                muiTableHeadCellProps={{
                  sx: {
                    backgroundColor: darkMode?"rgba(0, 0, 0, 0.4)":"rgba(39, 73, 98, 0.3)",
                    color: darkMode?"rgba(28, 28, 26, 1)":"rgba(55, 90, 112, 1)",
                  },
                }}
                muiTableBodyRowProps={({ row }) => ({
                  onClick: (event) => {
                    getTSanalysisRecord(row.id);
                  },
                  sx: {
                    cursor: "pointer",
                    backgroundColor: (theme) =>
                      row.index % 2 !== 0
                        ? (darkMode?"rgba(28, 28, 26, 0.2)":"rgba(55, 90, 112, 0.15)")
                        : (darkMode?"rgb(42, 44, 41, 0.2)":"rgba(65, 100, 122, 0.1)"),
                  },
                })}
                muiBottomToolbarProps={{
                  sx: {
                    backgroundColor: darkMode?"rgba(0, 0, 0, 0.4)":"rgba(39, 73, 98, 0.3)",
                    color: darkMode?"rgba(28, 28, 26, 1)":"rgba(55, 90, 112, 1)",
                  },
                }}
                muiTopToolbarProps={{
                  sx: {
                    backgroundColor: darkMode?"rgba(0, 0, 0, 0.4)":"rgba(39, 73, 98, 0.3)",
                    color: darkMode?"rgba(28, 28, 26, 1)":"rgba(55, 90, 112, 1)",
                  },
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
