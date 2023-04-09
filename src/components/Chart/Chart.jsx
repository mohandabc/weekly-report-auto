import React, { useLayoutEffect, useState} from 'react';
import { useRecoilValue } from "recoil";
import { BarChart, PieChart, ClusteredBarChart, StackedBarChart } from './charts';
import { darkModeState } from "../../shared/globalState";
import gear from '../../assets/gear.svg';

export const Chart = ({title, id, chartData, chartType, dashboard}) => {
  const divID = id.toString();
  const [type, setType] = useState(chartType);
  const darkMode = useRecoilValue(darkModeState);

  const changeType = () =>{
    const newType = type==='Pie' ? 'Bar' : 'Pie';
    setType(newType);
  }
  useLayoutEffect(()=>{
    let chart = null;
    if (chartData === undefined || chartData.length === 0){
      return
    }

    // these should be the default settings
    let options = {
                    'title-color' : '#111',
                    'label-color' : '#000',
                    'value-color' : '#555',
                    'stroke-color' : null,
                  };
    
    if (dashboard){
      options['title-color'] = darkMode ? "#fff" : "#fff";
      options['label-color'] = "#fff";
      options['value-color'] = darkMode ? "#fff" : "#fff";
      options['stroke-color'] = "#fff";
    }
    
    if(type === "Pie"){ 
      chart = new PieChart(chartData, divID, title, options).chart; 
    }
    if(type === "Bar"){
      chart = new BarChart(chartData, divID, title, options).chart; 
    }
    if(type === "ClusterBar"){
      // eslint-disable-next-line
      chart = new ClusteredBarChart(chartData, divID, title, options).chart; 
    }
    if(type === "Stacked"){
      // eslint-disable-next-line
      chart = new StackedBarChart(chartData, divID, title, options).chart; 
    }
  });

  return (
        <div className={dashboard ? 
                        `h-120 pb-5  rounded-lg w-full`
                      :`h-120 pb-5 bg-stone-100 dark:bg-stone-400 rounded-lg shadow w-full`}>
              {
                (type==='Pie' || type === 'Bar') && !dashboard ? 
                <div>
                  <img src={gear} onClick={changeType} className="px-2 py-2 w-10 hover:cursor-pointer hover:animate-spin" alt="..."></img>
                </div>
                : <></>
              }
              {(chartData === undefined || chartData.length === 0) ? 
                    <h3 className='text-black text-center mt-36'>No Data To Display for <span className='italic font-normal'>{title}</span></h3> 
                  : <div className='inline-block mx-auto h-full w-full' id={divID}>
                  
                  </div>}
                  
        </div>
  );
}
