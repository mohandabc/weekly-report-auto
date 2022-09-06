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
    
        const path = 'reports/daily_report';
    
        setIsHidden(false);
        getData(path, params)
        .then(res=> {
          let data = res.result;
          setDailyData(data || {});
          console.log(data);
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

                <section id="main" className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >

                    <section id="main" className={`grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2`} >
                    <Table title = "Wells Spud" id = {getDivId('table')} tableData = {dailyData['wells_spud']}/>
                    <Table title = "Extra Jobs status" id = {getDivId('table')} tableData = {dailyData['extra_jobs_n']}/>
                    </section>

                    <Table title = "Extra Jobs" id = {getDivId('table')} tableData = {dailyData['extra_jobs']}/>
                    <Table title = "Reservoir Tickets" id = {getDivId('table')} tableData = {dailyData['reservoir_tickets']}/>
                    <Table title = "Data Quality" id = {getDivId('table')} tableData = {dailyData['data_quality']}/>
                </section>

                <section id="main" className={`align-middle grid grid-col-1 xl:grid-cols-3 gap-4 place-items-top px-2 pb-4`} >
                    <Chart title = "Pending Quality Tickets By MLU" id = {getDivId('chart')} chartData = {dailyData['pending_tickets_byMLU']} chartType="ClusterBar"/>
                    <Chart title = "Pending Quality Tickets By RootCause" id = {getDivId('chart')} chartData = {dailyData['pending_tickets_byRootCause']} chartType="ClusterBar"/>
                    <Chart title = "Pending Quality Tickets By User" id = {getDivId('chart')} chartData = {dailyData['pending_tickets_byDM']} chartType="ClusterBar"/>
                    <Chart title = "Resolved Quality Tickets By MLU" id = {getDivId('chart')} chartData = {dailyData['resolved_tickets_byMLU']} chartType="ClusterBar"/>
                    <Chart title = "Resolved Quality Tickets By RootCause" id = {getDivId('chart')} chartData = {dailyData['resolved_tickets_byRootCause']} chartType="ClusterBar"/>
                    <Chart title = "Resolved Quality Tickets By DM" id = {getDivId('chart')} chartData = {dailyData['resolved_tickets_byDM']} chartType="ClusterBar"/>
                </section>

                <section id="main" className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                    <Table title = "Data Loss" id = {getDivId('table')} tableData = {dailyData['data_loss']}/>
                    <Chart title = "Resolved Loss Tickets By User" id = {getDivId('chart')} chartData = {dailyData['data_loss_ticket_byUser']} chartType="ClusterBar"/>
                    <Chart title = "Resolved Loss Gaps By User" id = {getDivId('chart')} chartData = {dailyData['data_loss_gap_byUser']} chartType="ClusterBar"/>
                    <Chart title = "Resolved Loss Tickets By RootCause" id = {getDivId('chart')} chartData = {dailyData['data_loss_ticket_byRootCause']} chartType="ClusterBar"/>
                    <Table title = "Data Recovery" id = {getDivId('table')} tableData = {dailyData['data_recovery']}/>
                    <Chart title = "Resolved Recovery Tickets By User" id = {getDivId('chart')} chartData = {dailyData['data_recovery_ticket_byUser']} chartType="ClusterBar"/>
                    <Chart title = "Resolved Recovery Gaps By User" id = {getDivId('chart')} chartData = {dailyData['data_recovery_gap_byUser']} chartType="ClusterBar"/>
                    <Chart title = "Resolved Recovery Tickets By RootCause" id = {getDivId('chart')} chartData = {dailyData['data_recovery_ticket_byRootCause']} chartType="ClusterBar"/>
                    <Table title = "Deployements And Interventions" id = {getDivId('table')} tableData = {dailyData['deployements_and_interventions']}/>
                    <Chart title = "Deployements And Interventions" id = {getDivId('chart')} chartData = {dailyData['obs_int_chart']} chartType="ClusterBar"/>

                </section>

            </div>
        </div>
    );
}