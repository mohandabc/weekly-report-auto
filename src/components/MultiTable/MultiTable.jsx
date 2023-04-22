import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";

export const MultiTable = ({title, id, tableData})=>{
    /**
     * @dataformat
     * Please to respect this data format :
     * [
     *  {'title':'anything'},
     *  {Table1 Rows}
     *  {'title':'anything'},
     *  {Table2 Rows}
     *  ...
     * ]
     * @example
     * [
     *     {'title': 'Average'},
     *     {'Phase': '12"1/4', 'Connection Time': 2.87, 'Connection Speed': 434.94},
     *     {'Phase': 'Inter Phase 12"1/4 - 8"1/2', 'Connection Time': 3.14, 'Connection Speed': 416.5},
     *     {'Phase': 'Inter Phase 16" - 12"1/4', 'Connection Time': 3.11, 'Connection Speed': 412.47},
     *     {'title': 'Maximum'},
     *     {'Phase': '12"1/4', 'Connection Time': 5.3, 'Connection Speed': 720.25},
     *     {'Phase': 'Inter Phase 12"1/4 - 8"1/2', 'Connection Time': 9.93, 'Connection Speed': 667.72},
     *     {'Phase': 'Inter Phase 16" - 12"1/4', 'Connection Time': 6.8, 'Connection Speed': 573.23},
     *     {'title': 'Minimum'},
     *     {'Phase': '12"1/4', 'Connection Time': 1.85, 'Connection Speed': 202.15},
     *     {'Phase': 'Inter Phase 12"1/4 - 8"1/2', 'Connection Time': 1.6, 'Connection Speed': 141.87},
     *     {'Phase': 'Inter Phase 16" - 12"1/4', 'Connection Time': 2.1, 'Connection Speed': 218.93}
     * ]
     */
    const darkMode = useRecoilValue(darkModeState);
    return (
        <div className={`min-h-120 rounded-lg py-3 px-2 bg-stone-100 dark:bg-stone-400 shadow w-full`}>
  {tableData === undefined ? (
    <></>
  ) : (
    <table id={id.toString()} className="mx-auto table-auto border-collapse border-2 border-slate-900 w-2/3">
      {title !== undefined ? (
        <caption className="text-center font-normal mb-8 text-black text-3xl" align="top">
          {title}
        </caption>
      ) : (
        <></>
      )}
      <thead className={`text-center text-white dark:text-black bg-stone-700 text-align-top`}>
        <tr>
          {tableData.length > 0 ? (
            Object.entries(tableData[1]).map((item, index) => (
              <th key={index} className="px-3 py-2">
                {item[0]}
              </th>
            ))
          ) : (
            <th>
              <h2>No Data To Display</h2>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) =>
          row.title !== undefined ? (
            <tr
              className={`${index % 2 === 0 ? "" : darkMode ? "bg-stone-500" : "bg-slate-200"}`}
              key={index}
            >
              <td colSpan={Object.keys(tableData[1]).length} className="px-auto py-2.5 text-center text-white bg-stone-600">
                {row.title}
              </td>
            </tr>
          ) : (
            <tr
              className={`${index % 2 === 0 ? "" : darkMode ? "bg-stone-500" : "bg-slate-200"}`}
              key={index}
            >
              {Object.entries(row).map((item, index) => (
                <td key={index} className="px-auto py-2.5 text-center text-black">
                  {item[1]}
                </td>
              ))}
            </tr>
          )
        )}
      </tbody>
    </table>
  )}
</div>
    );
}