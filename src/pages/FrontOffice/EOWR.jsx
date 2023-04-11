import React, { useEffect } from 'react';
import { useState } from 'react';

import {generateEOWR} from '../../services/EOWReportPdf';

import { ActionButton, ReportInputScreen, Chart, ImagePicker, Table, Paragraphe} from '../../components';

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
        const url = 'api/reports/eowr';
        getData(API_URL, url, params)
        .then(res=> {
            let data = res.result;
            setEOWRData({well:params['wid'],
                            ...data, 
                            chart_data:[{'category': 'good', 'value':2}, {'category': 'bad', 'value':5}],
                            table_data:[{'name':'lehin','value':10, 'date':'2023-03-29'}, {'name':'siklab','value':9, 'date':'2023-03-29'}]
                        } || {});
                        
            // set paragraphes to recovered data if possible
            setParagraphes({'p-0' : '', 'p-1':'', 'p-2':'', 'p-3':""});
        });
    }

    // Logging data
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

    const EOWR_CONFIG_BAR_OPTIONS = {...DEFAULT_CONFIG_BAR_OPTIONS, well:true, datePicker:false}
    
    return (
        <div className="App">
            <ReportInputScreen 
                    title="End Of Well Report"
                    configBarAction = {getEowrData} 
                    options = {EOWR_CONFIG_BAR_OPTIONS}>
            </ReportInputScreen>

           {Object.keys(EOWRData).length === 0?
           <></>
           :
            <div id="result-section" className={`bg-slate-300 dark:bg-zinc-900`}>
                <div className='flex flex-row-reverse sticky top-14 px-10 py-4  z-40'>
                    <ActionButton className=" bg-green-500 hover:bg-green-700 text-black font-bold text-base py-2 px-4 rounded" 
                                    text="PDF" 
                                    action={generateEOWR} 
                                    args={[chartsToPrint, images, EOWRData, paragraphes]}
                                    >
                    </ActionButton>
                </div>

                <span className='text-xl'>I. Global overview</span>
                <section id="main" className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                    <ImagePicker id="image-picker-0" title="Well Information" setImages = {setImages} ></ImagePicker>
                    <ImagePicker id="image-picker-1" title="Well Architecture" setImages = {setImages} ></ImagePicker>
                    <ImagePicker id="image-picker-2" title="Well Location Map" setImages = {setImages} ></ImagePicker>
                    <ImagePicker id="image-picker-3" title="Well Schematics" setImages = {setImages} ></ImagePicker>
                </section>

                <span className='text-xl'>II. Time Activity Breakdown</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                    <Table title = "Rig Time Performance" id = {getDivId('table')} tableData = {EOWRData['rig_performance']}/>

                    {/* <Chart title = "Progress chart" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>
                    <Chart title = "Progress chart with cost" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/> */}

                    {/* <ImagePicker id="image-picker-4" title = "Progress chart" setImages={setImages} /> */}
                    <Chart title = "Progress Chart" id = {getDivId('chart')} chartData = {EOWRData['progress_chart']} chartType="DateAxes"/> 
                    <Chart title = "Progress Chart / DOL" id = {getDivId('chart')} chartData = {EOWRData['progress_chart_dol']} chartType="DateAxes"/> 
                    {/* <ImagePicker id="image-picker-5" title = "Progress chart with cost" setImages={setImages} /> */}
                    
                    <Table title = "Time Distribution" id = {getDivId('table')} tableData = {EOWRData['time_distribution']['time_distribution']}/>

                    <Chart title = "Well Activity" id = {getDivId('chart')} chartData = {EOWRData['well_activity']} chartType="Pie"/>
                    <Chart title = "Time Distribution per phase" id = {getDivId('chart')} chartData = {EOWRData['time_distribution']['time_dist_per_phase']} chartType="Bar"/>
                </section>

                <span className='text-xl'>III. NPT Analysis</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                    <Chart title = "PT vs NPT" id = {getDivId('chart')} chartData = {EOWRData['npt_related']['pt_vs_npt']} chartType="Pie"/>
                    {/* TODO : below instruction is skipped and needs to be implemented */}
                    <Chart title = "NPT vs Section" id = {getDivId('chart')} chartData = {EOWRData['npt_sections']} chartType="Stacked"/> 
                    <Chart title = "PT vs Category" id = {getDivId('chart')} chartData = {EOWRData['npt_related']['npt_categories']} chartType="Pie"/>
                    <Chart title = "PT vs Sub-Category" id = {getDivId('chart')} chartData = {EOWRData['npt_related']['npt_subcategories']} chartType="Pie"/>
                    <Chart title = "PT Details" id = {getDivId('chart')} chartData = {EOWRData['npt_related']['npt_details']} chartType="Pie"/>
                    <Chart title = "PT vs Service companies" id = {getDivId('chart')} chartData = {EOWRData['npt_related']['npt_companies']} chartType="Pie"/>
                    <Chart title = "PT Down Hole Problems" id = {getDivId('chart')} chartData = {EOWRData['npt_related']['npt_downhole']} chartType="Pie"/>
                </section>

                <span className='text-xl'>IV. Drilling & Tripping connection time KPI's</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                    <Table title = "Drilling connection Time KPI's" id = {getDivId('table')} tableData = {EOWRData['table_data']}/>
                    <Table title = "Tripping connection Time KPI's" id = {getDivId('table')} tableData = {EOWRData['table_data']}/>
                </section>

                <span className='text-xl'>V. Real Time Impact & Prevention</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >  
                    <Paragraphe id="p-0" title = "High Value Interventions"  text = {paragraphes['p-0']} onSave={handleParagrapheSave}/>
                    <Paragraphe id="p-1" title = "Prevention & Mitigation plan"  text = {paragraphes['p-1']} onSave={handleParagrapheSave}/>
                </section>

                <span className='text-xl'>VI. Section Summary</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                    {
                        EOWRData['section_summary']?.map(section=>
                            <>
                            <Table title = "Section overview" id = {getDivId('table')} tableData = {EOWRData['table_data']}/>
                            <Paragraphe id="p-2" title = "Operation Summary  Results" text={section['description']} onSave={handleParagrapheSave}></Paragraphe>
                            </>
                        )
                    }  
                </section>
                
            </div>
           }

        </div>
    );
}