import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {useRecoilState, useRecoilValue} from 'recoil';
import {chartsToPrintState, dateStartEndState} from '../../shared/globalState';

import { DateSelector, ActionButton, Chart, ConfigBar} from '..';

import home from '../../assets/home.svg';
import { getData } from '../../api/getData';
import {PieData, BarData} from '../../api/dummyData';
import {generatePDF} from '../../utils';


export const WeeklyPage = () => {
    const [data, setData] = useState([]);
    const [chartsToPrint, setChartsToPrint] = useRecoilState(chartsToPrintState);

  // const dateStartEnd = useRecoilValue(dateStartEndState)

    let divIds = [];

    let divIdNumber = 0;
    const getDivId = () => {
        divIdNumber +=1;
        let divId = `chart-div-${divIdNumber}`;

        divIds = [...divIds, divId];
        return divId;
    }

    useEffect(()=>{
        // When all charts are created, update the array of divs containing them
        setChartsToPrint(divIds);
    }, []);

    useEffect(()=>{
        //simulate api call to fetch data
        setTimeout(()=>{
        setData([PieData, BarData]);
        
        },1000);
    }, []);


    return (
        <div className="App">
            <header className="flex flex-col bg-header min-h-screen text-white text-3xl align-middle justify-center items-center ">
                <Link className="" to='/'>
                    <img src={home}  className="fixed top-5 left-10 w-12" alt='home'></img>
                </Link>
                <div>
                    <ConfigBar></ConfigBar>
                </div>
            </header>

            <section className='bg-slate-200'>
                <Chart id = {getDivId()} chartData = {data[0]}  chartType="Pie"/>
                <Chart id = {getDivId()} chartData = {data[1]} chartType="Bar"/>
            </section>
      
        </div>
        
    );
}