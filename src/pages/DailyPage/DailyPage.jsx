import React, { useEffect } from 'react';

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {chartsToPrintState, dateStartEndState, tablesToPrintState, dailyDataState ,loaderIsHidden} from '../../shared/globalState';

import { ActionButton, Chart, ConfigBar, Table} from '../../components';

import {generateDailyReport} from '../../services/utils';
import { getData } from '../../services/api';
import { DEFAULT_CONFIG_BAR_OPTIONS } from '../../constants/constants';

export const DailyPage = () => {
    const [chartsToPrint, setChartsToPrint] = useRecoilState(chartsToPrintState);
    const [tablesToPrint, setTablesToPrint] = useRecoilState(tablesToPrintState);
    const [dailyData, setDailyData] = useRecoilState(dailyDataState);
    const range = useRecoilValue(dateStartEndState);
    const setIsHidden = useSetRecoilState(loaderIsHidden);

    let chartsIds = [];
    let tablesIds = [];

    let divNumber = 0;
    const getDivId = (type) => {
        divNumber +=1;
        let divId = `${type}-div-${divNumber}`;
        if (type === 'chart'){
            chartsIds = [...chartsIds, divId];
        }
        if (type === 'table'){
            tablesIds = [...tablesIds, divId];
        }
        return divId;

    }
    const getDailyData =  (params) =>{
    
        const path = 'reports/weekly_report';
    
        setIsHidden(false);
        getData(path, params)
        .then(res=> {
          let data = res.result;
          setDailyData(data || {});
        });
    }
    useEffect(()=>{
        setIsHidden(true);
        window.scrollTo(0,400);
    });

    useEffect(()=>{
        // When all charts are created, update the array of divs containing them
        setChartsToPrint(chartsIds);
        setTablesToPrint(tablesIds);
    }, []);

    return (
        <div className="App">
            <ConfigBar 
                    title="Back Office Daily Report"
                    configBarAction = {getDailyData} 
                    options = {DEFAULT_CONFIG_BAR_OPTIONS}>
            </ConfigBar>
            <div className={`bg-slate-300 ${Object.keys(dailyData).length === 0? "hidden":""}`}>
                <div className='flex flex-row-reverse bg-slate-300 sticky top-0 px-10 py-4  z-40'>
                    <ActionButton className=" bg-green-500 hover:bg-green-700 text-black font-bold text-base py-2 px-4 rounded" 
                                    text="PDF" 
                                    action={generateDailyReport} 
                                    args={[chartsToPrint, tablesToPrint, range]}>
                    </ActionButton>
                </div>
                <section id="main" className={`grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                    <Table title = "Spud" id = {getDivId('table')} tableData = {dailyData['wells_spudded']}/>
                    <Table title = "Cementing Jobs Transmission" id = {getDivId('table')} tableData = {dailyData['cementing_jobs']}/>
                    <Table title = "MWD Transmission" id = {getDivId('table')} tableData = {dailyData['mwd_jobs']}/>
                    <Chart title = "NDJ Jobs" id = {getDivId('chart')} chartData = {dailyData['ndj']} chartType="ClusterBar"/>
                    <Chart title = "resolved Quality" id = {getDivId('chart')} chartData = {dailyData['resolved_quality']} chartType="ClusterBar"/>
                    <Chart title = "resolved Channels" id = {getDivId('chart')} chartData = {dailyData['resolved_channels']} chartType="ClusterBar"/>

                    <Chart title = "Global Recovery" id = {getDivId('chart')} chartData = {dailyData['global_recovery']} chartType="Bar"/>
                    <Chart title = "Weekly Recovery" id = {getDivId('chart')} chartData = {dailyData['weekly_recovery']} chartType="Bar"/>

                    <Table title = "Remote Relacation" id = {getDivId('table')} tableData = {dailyData['remote_relocation']}/>
                    <Table title = "Deployment & Intervention" id = {getDivId('table')} tableData = {dailyData['deployements_and_interventions']}/>
                </section>
            </div>
        </div>
    );
}