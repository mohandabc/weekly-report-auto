import React, { useEffect } from 'react';

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {chartsToPrintState, dateStartEndState, tablesToPrintState, weeklyDataState ,loaderIsHidden} from '../../shared/globalState';

import { ActionButton, Chart, ConfigBar, Table} from '../../components';

import {generateWeeklyReport} from '../../utils';
import { getData } from '../../services/Services';
import { DEFAULT_CONFIG_BAR_OPTIONS } from '../../constants/constants';



export const WeeklyPage = () => {
    const [chartsToPrint, setChartsToPrint] = useRecoilState(chartsToPrintState);
    const [tablesToPrint, setTablesToPrint] = useRecoilState(tablesToPrintState);
    const [weeklyData, setWeeklyData] = useRecoilState(weeklyDataState);
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
    const getWeeklyData =  (params) =>{
    
        const path = 'reports/weekly_report';
    
        setIsHidden(false);
        getData(path, params)
        .then(res=> {
          let data = res.result;
          setWeeklyData(data || {});
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
                configBarAction={getWeeklyData}
                options={DEFAULT_CONFIG_BAR_OPTIONS}>
            </ConfigBar>
            <div className={`bg-slate-200 ${Object.keys(weeklyData).length === 0? "hidden":""}`}>
                <div className='flex flex-row-reverse bg-slate-200 sticky top-0 px-10 py-4  z-40'>
                    <ActionButton className=" bg-green-500 hover:bg-green-700 text-black font-bold text-base py-2 px-4 rounded" 
                                    text="PDF" 
                                    action={generateWeeklyReport} 
                                    args={[chartsToPrint, tablesToPrint, range]}>
                    </ActionButton>
                </div>
                <section id="main" className={`grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2  pb-4`} >
                    <Table title = "Remote Relacation" id = {getDivId('table')} tableData = {weeklyData['remote_relocation']}/>
                    <Table title = "Deployment & Relocation" id = {getDivId('table')} tableData = {weeklyData['deployements_and_interventions']}/>
                    <Table title = "Spud" id = {getDivId('table')} tableData = {weeklyData['wells_spudded']}/>
                    <Chart title = "Rig Box Maintenance" id = {getDivId('chart')} chartData = {weeklyData['rigbox_maintenance']} chartType="Bar"/>
                    <Chart title = "NDJ Jobs" id = {getDivId('chart')} chartData = {weeklyData['ndj']} chartType="ClusterBar"/>
                    <Chart title = "Global Recovery" id = {getDivId('chart')} chartData = {weeklyData['global_recovery']} chartType="Bar"/>
                    <Chart title = "Weekly Recovery" id = {getDivId('chart')} chartData = {weeklyData['weekly_recovery']} chartType="Bar"/>
                    <Table title = "Cementing Jobs Transmission" id = {getDivId('table')} tableData = {weeklyData['cementing_jobs']}/>
                    <Table title = "MWD Transmission" id = {getDivId('table')} tableData = {weeklyData['mwd_jobs']}/>

                    <Chart title = "resolved Quality" id = {getDivId('chart')} chartData = {weeklyData['resolved_quality']} chartType="ClusterBar"/>

                    <Chart title = "Pending Quality" id = {getDivId('chart')} chartData = {weeklyData['pending_quality']} chartType="ClusterBar"/>

                    <Chart title = "resolved Channels" id = {getDivId('chart')} chartData = {weeklyData['resolved_channels']} chartType="ClusterBar"/>

                    <Chart title = "Pending Channels" id = {getDivId('chart')} chartData = {weeklyData['pending_channels']} chartType="ClusterBar"/>

                    <Chart title = "Resolved channels by user" id = {getDivId('chart')} chartData = {weeklyData['resolved_channels_by_user']} chartType="Bar"/>

                    <Chart title = "Helpdesk Tickets" id = {getDivId('chart')} chartData = {weeklyData['helpdesk_tickets']} chartType="ClusterBar"/>

                    <Table title = "Teamspace Projects" id = {getDivId('table')} tableData = {weeklyData['teamspace_projects']}/>
                </section>
            </div>
            
           
      
        </div>
        
    );
}