import React from "react";


export const Table = ({title, id, tableData})=>{
    return (
        <div className="border bg-white border-4 rounded-lg py-3 px-2 shadow w-full">
            <h3 className="text-center font-normal mb-8">{title}</h3>
            {
                tableData === undefined ? 
                <></>
                :
                <table id = {id.toString()} className="mx-auto table-auto border-collapse border border-2 border-slate-400">
                <thead>
                    <tr className="text-center">

                    {   tableData.length > 0 ?
                        Object.entries(tableData[0]).map((item, index) => 
                            <th key={index} className="px-3 py-1 border border-slate-400">
                            {
                                item[0]
                            }
                            </th>)
                            :<></>
                        }
                    </tr>
                </thead>
                <tbody>

                {/* {tableData?.map(row => <tr>{Object.entries(row).map(cell) => <td>{cell}</td>}</tr>} */}
                {
                    tableData.map((row, index) => 
                    <tr key={index}>
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