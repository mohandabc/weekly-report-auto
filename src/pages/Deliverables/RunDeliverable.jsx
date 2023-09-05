/**************************************************************************************
 *         RETURNS THE CONFIGBAR WITH "DELIVERABLE" OPTION TO SHOW THE TABS           *
 * REMINDER : CONFIGBAR SHOULD BE REPLACED WITH DELIVERABLE AND REPORTING COMPONENTS  *
 *            IN THE FUTURE TO PREVENT IT FROM SPAGITIFYING WHEN ADDING NEW COMPONENTS*
 **************************************************************************************/
import React, { useEffect, useState } from "react";
import { DeliverableInputScreen, PDFButton, Chart, Table, ActionButton, Tabular } from "../../components";
import { DELIVERABLE_CONFIG_BAR_OPTIONS } from "../../constants/constants";
import { useRecoilState } from "recoil";
import { TSReportDataState } from "../../shared/globalState";
import { generateTrippingSpeed } from "../../services/TrippingSpeedPDF";


const processInput =  (params) =>{
    
  console.log("Params from RunDeliverable : ", params)
}

export const RunDeliverable = () => {
  const [TS_REPORT_DATA, setReportData] = useRecoilState(TSReportDataState);
  const [chartsToPrint, setChartsToPrint] = useState([]);
    
  let chartsIds = [];
  
  let divNumber = 0;
  const getDivId = (type) => {
    divNumber +=1;
    let divId = `${type}-div-${divNumber}`;
    if (type === 'chart'){
      chartsIds = [...chartsIds, divId];
    }
    return divId;    
  }

  useEffect(()=>{
    setChartsToPrint(chartsIds);
  }, [TS_REPORT_DATA])

  useEffect(()=>{
    const TS_report_section = document.getElementById('ts-report-section');
    TS_report_section?.scrollIntoView({behavior: "smooth"});
  });

  return (
    <div className="App">

      <DeliverableInputScreen 
        // title="Run Deliverable"
        // configBarAction = {processInput} 
        options={DELIVERABLE_CONFIG_BAR_OPTIONS}
      ></DeliverableInputScreen >

{
        Object.keys(TS_REPORT_DATA).length === 0?
        <></>
        :
        <div id="ts-report-section" className={`w-full mt-50 bg-slate-300 dark:bg-zinc-900`}>
                <div className='flex flex-row-reverse sticky top-14 px-10 py-4  z-40'>
                    <PDFButton className=" bg-green-500 hover:bg-green-700 text-black font-bold text-base py-2 px-4 rounded" 
                                    text="PDF" 
                                    action={generateTrippingSpeed} 
                                    args={[chartsToPrint, TS_REPORT_DATA]}
                                    >
                    </PDFButton>
                </div>

                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4 align-bottom`} >
                    <Tabular title="Overview" id={getDivId('table')} tableData={TS_REPORT_DATA['overview'].map(item => ({
                                [item.Attribute]: item.Value}))} 
                                columns={3} />

                    <Chart title = "Connection Time vs Tripping Time (hours)" id = {getDivId('chart')} chartData = {TS_REPORT_DATA['tripping_connection']} chartType="Pie"/>

                    <Chart title = "Connection Time (min) per Stand" id = {getDivId('chart')} 
                            chartData = {TS_REPORT_DATA['connection_per_stand']} 
                            chartType="PartitionedBar"
                            c_options={{leftYaxisTitle : "Connection Time (min)"}}/>

                    <Chart title = "Tripping Speed (m/h) per Stand" id = {getDivId('chart')} 
                            chartData = {TS_REPORT_DATA['connection_per_stand'].map(item =>{const {c_time, ...rest} = item; return rest;})} 
                            chartType="Combined"
                            c_options={{leftYaxisTitle : "Tripping speed (m/h)", rightYaxisTitle:"Depth (m)", threshold: TS_REPORT_DATA['TS_benchmark']}}/>
                    <Table title = "Stands with justified excess time" id = {getDivId('table')} tableData = {TS_REPORT_DATA['abnormal_stands']}/>
                    <Chart title = "Connection Time (min), Tripping Speed (m/h) per Stand" id = {getDivId('chart')} chartData = {TS_REPORT_DATA['connection_t_tripping_s']} chartType="Scatter"/>

                    <Table title = "KPI's" id = {getDivId('table')} tableData = {TS_REPORT_DATA['kpi']}/> 
                    <Table title = "Abnormal Overview" id = {getDivId('table')} tableData = {TS_REPORT_DATA['abnormal_overview']} size={'big'}/> 
                </section>
        </div>
       
      }
    </div>
    
  );
};
