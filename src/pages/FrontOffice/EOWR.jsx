import React, { useEffect } from 'react';
import { useState } from 'react';

import {generateEOWR} from '../../services/EOWReportPdf';

import { ActionButton, ReportInputScreen, Chart, ImagePicker, Table, Paragraphe} from '../../components';

// import {generateDailyReport} from '../../services/dailyPdfGenBO';
import { getData } from '../../api/api';
import { DEFAULT_CONFIG_BAR_OPTIONS} from '../../constants/constants';
import { API_URL } from '../../constants/URI';

export const EOWR = () => {
    const [EOWRData, setEOWRData] = useState({});
    const [chartsToPrint, setChartsToPrint] = useState([]);
    const [images, setImages] = useState({});
    const [paragraphes, setParagraphes] = useState({})

    const handleParagrapheSave = (id, text)=>{
        setParagraphes(current=>{
            let tmp = {...current};
            tmp[id] = text;
            return tmp;
        })
    }

    const getEowrData = (params) => {
        // API call to get data
        const url = 'reports/eowr/data';
        getData(API_URL, url, params)
        .then(res=> {
            let data = res.result;
            setEOWRData({well:params['wid'],
                            ...data, 
                            chart_data:[{'category': 'good', 'value':2}, {'category': 'bad', 'value':5}],
                            table_data:[{'name':'lehin','value':10, 'date':'2023-03-29'}, {'name':'siklab','value':9, 'date':'2023-03-29'}]
                        } || {});
                        
            setParagraphes({'p-1' : '', 'p-2':'', 'p-3':''});
        });
    }
    useEffect(()=>{
        console.log({EOWRData})
        console.log({paragraphes})

    })

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
    }, [])

    const EOWR_CONFIG_BAR_OPTIONS = {...DEFAULT_CONFIG_BAR_OPTIONS, well:true}
    
    return (
        <div className="App">
            <ReportInputScreen 
                    title="End Of Well Report"
                    configBarAction = {getEowrData} 
                    options = {EOWR_CONFIG_BAR_OPTIONS}>
            </ReportInputScreen>
           
            <div id="result-section" className={`bg-slate-300 dark:bg-zinc-900 ${Object.keys(EOWRData).length === 0? "hidden":""}`}>
                <div className='flex flex-row-reverse sticky top-14 px-10 py-4  z-40'>
                    <ActionButton className=" bg-green-500 hover:bg-green-700 text-black font-bold text-base py-2 px-4 rounded" 
                                    text="PDF" 
                                    action={generateEOWR} 
                                    args={[chartsToPrint, images, EOWRData, paragraphes]}
                                    >
                    </ActionButton>
                </div>

                <section id="main" className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                <ImagePicker id="image-picker-1" title="Well Architecture" setImages = {setImages} ></ImagePicker>
                <ImagePicker id="image-picker-2" title="Well Location Map" setImages = {setImages} ></ImagePicker>
                <ImagePicker id="image-picker-3" title="Well Schematics" setImages = {setImages} ></ImagePicker>

                <Table title = "Rig Time Performance" id = {getDivId('table')} tableData = {EOWRData['table_data']}/>

                <Chart title = "Progress chart" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>
                <Chart title = "Progress chart with cost" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>
                  
                <Table title = "Time Distribution" id = {getDivId('table')} tableData = {EOWRData['table_data']}/>

                <Chart title = "Well Activity" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>
                <Chart title = "Time Distribution per phase" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Bar"/>
                <Chart title = "PT vs NPT" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>
                <Chart title = "NPT vs Section" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Bar"/>

                <Chart title = "PT vs Category" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>
                <Chart title = "PT vs Sub-Category" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>
                <Chart title = "PT Details" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>
                <Chart title = "PT vs Service companies" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>
                <Chart title = "PT Down Hole Prombles" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>

                <Table title = "Drilling connection Time KPI's" id = {getDivId('table')} tableData = {EOWRData['table_data']}/>
                <Table title = "Tripping connection Time KPI's" id = {getDivId('table')} tableData = {EOWRData['table_data']}/>
                
                <Chart title = "Activity Well Breakdown" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>

                <Table title = "Hole Section" id = {getDivId('table')} tableData = {EOWRData['table_data']}/>

                <Chart title = "Activity Breakdown For " id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>

                <Paragraphe id="p-1" title = "Operation Summary  Results" text={paragraphes['p-1']} onSave={handleParagrapheSave}></Paragraphe>
                <Paragraphe id="p-2" title="Operation Summary  Results" text={paragraphes['p-2']} onSave={handleParagrapheSave}></Paragraphe>

                <ImagePicker id="image-picker-4" title="Ream Back Ream Interval" setImages = {setImages} ></ImagePicker>

                <Table title = "Section overview" id = {getDivId('table')} tableData = {EOWRData['table_data']}/>

                <Chart title = "Activity Breakdown For " id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>
                </section>

                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                   
                </section>
                
            </div>
        </div>
    );
}