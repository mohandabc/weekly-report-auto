import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";

export const Table = ({title, id, tableData, size='small'})=>{
    const darkMode = useRecoilValue(darkModeState);
    return (
        <div  className={`min-h-120 rounded-lg py-3 px-2 bg-stone-100 dark:bg-stone-400 shadow w-full`}>
            {
                tableData === undefined ? 
                <></>
                :
                <table id = {id.toString()} className="mx-auto table-auto border-collapse border-2 border-slate-900">
                    {title !== undefined ? <caption className="text-center font-normal mb-8 text-black text-3xl" align="top">{title}</caption> : <></>}
                <thead className={`text-center text-white dark:text-black bg-stone-700 text-align-top`}>
                    <tr>

                    {   tableData.length > 0 ?
                        Object.entries(tableData[0]).map((item, index) => 
                            <th key={index} className="px-3 py-2">
                            {
                                item[0]
                            }
                            </th>)
                            : <th className="w-96 text-black bg-white"><h2>N/A</h2></th>
                        }
                    </tr>
                </thead>
                <tbody>

                {/* {tableData?.map(row => <tr>{Object.entries(row).map(cell) => <td>{cell}</td>}</tr>} */}
                {
                    tableData.map((row, index) => 
                    size==='big' ?
                    <tr className={`${index%2===0?"":darkMode ? "bg-stone-500" : "bg-slate-200"}`} key={index}>
                        {
                            Object.entries(row).map((item, index) => 
                            <td key={index} className="px-16 py-16 text-center text-black">
                                <h3>{
                                    item[1]
                                }</h3>
                            </td>)
                        }
                    </tr> :
                    <tr className={`${index%2 === 0 ? "" : (darkMode ? "bg-stone-500" : "bg-slate-200")} ${row['Phase'] === 'Total' ? 'bg-stone-700' : ''}`} key={index}>
                    {
                      Object.entries(row).map((item, index) => 
                        <td key={index} className={`px-auto py-2.5 text-center ${row['Phase'] === 'Total' ? 'font-bold text-white dark:text-black' : 'text-black'}`}>
                          {
                            item[1]
                          }
                        </td>
                      )
                    }
                  </tr>
                    )
                }

                </tbody>
            </table>
            }
            
        </div>
    );
}