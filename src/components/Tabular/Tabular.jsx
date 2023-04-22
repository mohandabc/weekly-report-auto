import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";

export const Tabular = ({ title, id, tableData }) => {
  // Filter out the "description" object from the table data
  const filteredTableData = tableData.filter((item) => !item.hasOwnProperty("description"));

  const tableRows = [];

  // Split the filtered table data into rows of 6 items each
  for (let i = 0; i < filteredTableData.length; i += 3) {
    const row = filteredTableData.slice(i, i + 3);
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
