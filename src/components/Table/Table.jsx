import React from "react";


export const Table = ({title, id, tableData})=>{
    return (
        <div className="w-full">
            <h2 className="text-center">{title}</h2>
            {
                tableData === undefined ? 
                <></>
                :
                <table id = {id.toString()} className="mx-auto table-auto border-collapse border border-slate-400">
                <thead>
                    <tr className="px-10 py-2 text-center">

                    {   tableData.length > 0 ?
                        Object.entries(tableData[0]).map((item, index) => 
                            <th key={index} className="border border-slate-400">
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
                            <td key={index} className="px-auto py-2 text-center text-sm">
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