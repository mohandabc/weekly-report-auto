import './App.css';
import React, { useEffect, useState } from 'react';

import {useRecoilState} from 'recoil';
import {chartsToPrintState} from './shared/globalState';

import {PieData, BarData} from './api/dummyData';

import {Chart, DateSelector}from './components';

import {getData} from './api/getData';
import {generatePDF} from './utils';

function App() {
  const [data, setData] = useState([]);
  const [chartsToPrint, setChartsToPrint] = useRecoilState(chartsToPrintState);

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
      <header className="App-header">
          <DateSelector></DateSelector>
          <Chart id = {getDivId()} chartData = {data[0]}  chartType="Pie"/>
          <Chart id = {getDivId()} chartData = {data[1]} chartType="Bar"/>
                  
        <button onClick={()=>generatePDF(chartsToPrint)}>PDF</button>
        <button onClick={()=>getData()}>Fetch Data</button>
        
      </header>
    </div>
  );
}


export default App;
