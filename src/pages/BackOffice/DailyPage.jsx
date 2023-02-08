import React, { useEffect } from 'react';

import {useRecoilState, useSetRecoilState} from 'recoil';
import {chartsToPrintState, dateStartEndState, dailyDataState ,loaderIsHidden} from '../../shared/globalState';

import { ActionButton, Chart, ReportInputScreen, Table} from '../../components';

import {generateDailyReport} from '../../services/dailyPdfGenBO';
import { getData } from '../../services/api';
import { DEFAULT_CONFIG_BAR_OPTIONS } from '../../constants/constants';
import { API_URL } from '../../constants/URI';

export const BoDailyPage = () => {
    const [chartsToPrint, setChartsToPrint] = useRecoilState(chartsToPrintState);
    const [dailyData, setDailyData] = useRecoilState(dailyDataState);
    const [range, setRange] = useRecoilState(dateStartEndState);
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
    
        const path = 'reports/daily_report';
    
        setIsHidden(false);
        setRange(params['dates'])
        getData(API_URL, path, params)
        .then(res=> {
            let data = res.result;
            setDailyData(data || {});
            setIsHidden(true);
        });
    }
    useEffect(()=>{
        window.scrollTo(0,400);
    });

    useEffect(()=>{
        // When all charts are created, update the array of divs containing them
        setChartsToPrint(chartsIds);
    }, []);

    return (
        <div className="App">
            <ReportInputScreen 
                    title="Back Office Daily Report"
                    configBarAction = {getDailyData} 
                    options = {DEFAULT_CONFIG_BAR_OPTIONS}>
            </ReportInputScreen>
            <div className={`bg-slate-300 dark:bg-zinc-900 ${Object.keys(dailyData).length === 0? "hidden":""}`}>
                <div className='flex flex-row-reverse sticky top-14 px-10 py-4  z-40'>
                    <ActionButton className=" bg-green-500 hover:bg-green-700 text-black font-bold text-base py-2 px-4 rounded" 
                                    text="PDF" 
                                    action={generateDailyReport} 
                                    args={[chartsToPrint, dailyData, range]}>
                    </ActionButton>
                </div>

                <section id="main" className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >

                    <section id="main" className={`grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2`} >
                    <Table title = "Wells Spud" id = {getDivId('table')} tableData = {dailyData['wells_spud']}/>
                    <Table title = "Extra Jobs status" id = {getDivId('table')} tableData = {dailyData['extra_jobs_n']}/>
                    </section>

                    <Table title = "Extra Jobs" id = {getDivId('table')} tableData = {dailyData['extra_jobs']}/>
                    <Table title = "Reservoir Tickets" id = {getDivId('table')} tableData = {dailyData['reservoir_tickets']}/>
                    <Table title = "Data Quality" id = {getDivId('table')} tableData = {dailyData['data_quality']}/>
                </section>

                <section id="main" className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                    <Chart title = "Pending Quality Tickets" id = {getDivId('chart')} chartData = {dailyData['pending_Q_tickets']} chartType="ClusterBar"/>
                    <Chart title = "Resolved Quality Tickets-Channels" id = {getDivId('chart')} chartData = {dailyData['resolved_Q_tickets_channels']} chartType="ClusterBar"/>
                    <Table title = "Data Loss" id = {getDivId('table')} tableData = {dailyData['data_loss']}/>
                    <Chart title = "Resolved Loss Tickets-Gap" id = {getDivId('chart')} chartData = {dailyData['data_loss_ticket_gap']} chartType="ClusterBar"/>
                    <Chart title = "Resolved Loss Tickets By RootCause" id = {getDivId('chart')} chartData = {dailyData['data_loss_ticket_byRootCause']} chartType="ClusterBar"/>
                    <Table title = "Data Recovery" id = {getDivId('table')} tableData = {dailyData['data_recovery']}/>
                    <Chart title = "Resolved Recovery Tickets-Gap" id = {getDivId('chart')} chartData = {dailyData['data_recovery_ticket_gap']} chartType="ClusterBar"/>
                    <Chart title = "Resolved Recovery Tickets By RootCause" id = {getDivId('chart')} chartData = {dailyData['data_recovery_ticket_byRootCause']} chartType="ClusterBar"/>
                    <Table title = "Deployements And Interventions" id = {getDivId('table')} tableData = {dailyData['deployements_and_interventions']}/>
                    <Chart title = "Deployements And Interventions" id = {getDivId('chart')} chartData = {dailyData['obs_int_chart']} chartType="ClusterBar"/>
                </section>
                
            </div>
        </div>
    );
}