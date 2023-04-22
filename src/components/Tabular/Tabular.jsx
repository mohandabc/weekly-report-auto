import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";

export const Tabular = ({ title, id, tableData, columns}) => {
    /**
     * @dataformat
     * Please to respect this data format :
     * @example
      [
          {
              "Hole Section": "26\"",
              "Inclination In": 0,
              "Drilling Hours": 0,
              "Start Date": "2022-12-02 23:00:00",
              "Inclination Out": 4,
              "Circulation Hours": 0,
              "End Date": "2022-12-22 16:30:00",
              "Azimute In": 0,
              "ROP WOC": 0,
              "Depth From": 0,
              "Azimute Out": 0,
              "TVD In": 0,
              "Depth To": 555,
              "Casing Size": "18.625in",
              "TVD Out": 554.55,
              "Metrage": 555,
              "Casing Shoe": 554,
              "Mud Weight": "1.05"
          }
        ...
        ]
     */
  const filteredTableData = tableData.filter((item) => !item.hasOwnProperty("description"));

  const tableRows = [];
  for (let i = 0; i < filteredTableData.length; i += columns) {
    const row = filteredTableData.slice(i, i + columns);
    tableRows.push(row);
  }

  const darkMode = useRecoilValue(darkModeState);

  return (
    <div className={`min-h-120 rounded-lg py-3 px-2 bg-stone-100 dark:bg-stone-400 shadow w-full`}>
      <div id={id}>
        <table className="mx-auto table-auto border-collapse border-2 border-slate-900">
        <caption className="text-center font-normal mb-8 text-black text-3xl" align="top">
                {title}
              </caption>
          <tbody>
            {tableRows.map((row, index) => (
              <tr className={`${index % 2 === 0 ? "" : darkMode ? "bg-stone-500" : "bg-slate-200"}`} key={index}>
                {row.map((cell, index) => (
                  <React.Fragment key={index}>
                    <td className="px-auto text-center text-white bg-stone-600 p-2.5 w-1/7">
                      {Object.keys(cell)[0]}
                    </td>
                    <td className="px-auto text-center text-black p-2.5 w-1/5">{cell[Object.keys(cell)[0]]}</td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
