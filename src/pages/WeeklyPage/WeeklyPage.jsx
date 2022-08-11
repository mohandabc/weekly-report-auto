import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import {useRecoilState} from 'recoil';
import {chartsToPrintState, tablesToPrintState, weeklyDataState} from '../../shared/globalState';

import { ActionButton, Chart, ConfigBar, Table} from '../../components';

import home from '../../assets/home.svg';
import {generatePDF} from '../../utils';
import { getData } from '../../services/Services';


export const WeeklyPage = () => {
    const [chartsToPrint, setChartsToPrint] = useRecoilState(chartsToPrintState);
    const [tablesToPrint, setTablesToPrint] = useRecoilState(tablesToPrintState);
    const [weeklyData, setWeeklyData] = useRecoilState(weeklyDataState);

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
    
        const path = 'reports/daily_report';
    
        getData(path, params)
        .then(res=> {
          let data = res.result;
          
          setWeeklyData(data);
        });
      }

    useEffect(()=>{
        // When all charts are created, update the array of divs containing them
        setChartsToPrint(chartsIds);
        setTablesToPrint(tablesIds);
    }, []);
     
    return (
        <div className="App">
            <header className={`flex flex-col bg-header min-h-screen text-white text-3xl align-middle justify-center items-center`}>
                <Link className="" to='/'>
                    <img src={home}  className="fixed top-5 left-10 w-12" alt='home'></img>
                </Link>
                <div className= "sticky top-5">
                    <ConfigBar configBarAction={getWeeklyData}></ConfigBar>
                </div>
            </header>
            <div className={`${Object.keys(weeklyData).length === 0? "hidden":""}`}>
                <ActionButton className="bg-blue-500 hover:bg-blue-700 text-black font-bold text-base py-2 px-4 mx-auto float-right sticky top-5 rounded" 
                                text="PDF" 
                                action={generatePDF} 
                                args={[chartsToPrint, tablesToPrint]}>
                </ActionButton>
                <section className={`grid grid-cols-2 gap-4 place-items-center bg-slate-500 `} >
                    <Chart title = "Rig Box Maintenance" id = {getDivId('chart')} chartData = {weeklyData['rigbox_maintenance']}  chartType="Pie"/>
                    <Chart title = "NDJ Jobs"  id = {getDivId('chart')} chartData = {weeklyData['ndj']} chartType="ClusterBar"/>
                    <Chart title = "Rig Box Maintenance"  id = {getDivId('chart')} chartData = {weeklyData['rigbox_maintenance']} chartType="Bar"/>
                    <Chart title = "Global Recovery"  id = {getDivId('chart')} chartData = {weeklyData['global_recovery']} chartType="Bar"/>
                    <Chart title = "Weekly Recovery"  id = {getDivId('chart')} chartData = {weeklyData['weekly_recovery']} chartType="Bar"/>
                    <Table title = "Cementing Jobs Transmission"  id = {getDivId('table')} tableData = {weeklyData['cementing_jobs']}/>
                    <Table title = "MWD Transmission"  id = {getDivId('table')} tableData = {weeklyData['mwd_jobs']}/>
                    <Chart title = "resolved Quality MLU"  id = {getDivId('chart')} chartData = {weeklyData['resolved_quality_company']} chartType="ClusterBar"/>
                    <Chart title = "resolved Quality Rootcase"  id = {getDivId('chart')} chartData = {weeklyData['resolved_quality_rootcause']} chartType="ClusterBar"/>
                </section>
            </div>
            
           
      
        </div>
        
    );
}