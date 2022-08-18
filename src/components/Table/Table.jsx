import React from "react";


export const Table = ({title, id, tableData})=>{
    return (
        <div  className="min-h-120 rounded-lg py-3 px-2 bg-white shadow w-full">
            {
                tableData === undefined ? 
                <></>
                :
                <table id = {id.toString()} className="mx-auto table-auto border-collapse border border-2 border-slate-600">
                    {title !== undefined ? <caption className="text-center font-normal mb-8 text-gray-700 text-3xl" align="top">{title}</caption> : <></>}
                <thead className="text-center text-white bg-smartestgray text-align-top">
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
                    <tr className={`${index%2===0?"":"bg-slate-200"}`} key={index}>
                        {
                            Object.entries(row).map((item, index) => 
                            <td key={index} className="px-auto py-2.5 text-center">
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