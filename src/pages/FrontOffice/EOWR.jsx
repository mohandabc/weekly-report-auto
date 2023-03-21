import React, { useEffect } from 'react';
import { useState } from 'react';



import {generateEOWR} from '../../services/EOWReportPdf';


import {useRecoilValue} from 'recoil';
import {darkModeState} from '../../shared/globalState';

import { ActionButton, ReportInputScreen, Chart, ImagePicker} from '../../components';

// import {generateDailyReport} from '../../services/dailyPdfGenBO';
import { getData } from '../../api/api';
import { DEFAULT_CONFIG_BAR_OPTIONS} from '../../constants/constants';
import { API_URL } from '../../constants/URI';
import { TopMenu } from '../../components/TopMenu';

export const EOWR = () => {
    const darkMode = useRecoilValue(darkModeState);
    const [EOWRData, setEOWRData] = useState({});
    const [chartsToPrint, setChartsToPrint] = useState([]);
    const [images, setImages] = useState({});

    const getEowrData = (params) => {
        // API call to get data
        const url = 'reports/eowr/data';
        console.log({params})
        getData(API_URL, url, params)
        .then(res=> {
            let data = res.result;
            setEOWRData({well:params['wid'], ...data} || {});
        });
    }
    useEffect(()=>{
        console.log({EOWRData})

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
            <TopMenu appearance={`${darkMode ? "subtle": "default"}`}/>
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
                                    args={[chartsToPrint, images, EOWRData]}
                                    >
                    </ActionButton>
                </div>

                <section id="main" className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                <ImagePicker id="image-picker-1" title="Select image 1" setImages = {setImages} ></ImagePicker>
                <ImagePicker id="image-picker-2" title="Select image 2" setImages = {setImages} ></ImagePicker>
                  

                </section>

                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                <Chart title = "Chart" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>
                   
                </section>
                
            </div>
        </div>
    );
}