import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";

export const Table = ({title, id, tableData})=>{
    const darkMode = useRecoilValue(darkModeState);
    return (
        <div  className={`min-h-120 rounded-lg py-3 px-2 bg-white dark:bg-stone-600 shadow w-full`}>
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
                            :<th><h2>No Data To Display</h2></th>
                        }
                    </tr>
                </thead>
                <tbody>

                {/* {tableData?.map(row => <tr>{Object.entries(row).map(cell) => <td>{cell}</td>}</tr>} */}
                {
                    tableData.map((row, index) => 
                    title === "Data Quality" || title === "Data Loss" || title === "Data Recovery" ?
                    <tr className={`${index%2===0?"":darkMode ? "bg-stone-500" : "bg-slate-200"}`} key={index}>
                        {
                            Object.entries(row).map((item, index) => 
                            <td key={index} className="px-20 py-20 text-center text-black">
                                <h3>{
                                    item[1]
                                }</h3>
                            </td>)
                        }
                    </tr> :
                    <tr className={`${index%2===0?"":darkMode ? "bg-stone-700" : "bg-slate-200"}`} key={index}>
                    {
                        Object.entries(row).map((item, index) => 
                        <td key={index} className="px-auto py-2.5 text-center text-black">
                            {
                                item[1]
                            }
                        </td>)
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