import React, { useLayoutEffect} from 'react';
import { useState } from 'react';
import { BarChart, PieChart, ClusteredBarChart } from './charts';
import gear from '../../assets/gear.svg';

export const Chart = ({title, id, chartData, chartType}) => {
  const divID = id.toString();
  const [type, setType] = useState(chartType);

  const changeType = () =>{
    const newType = type==='Pie' ? 'Bar' : 'Pie';
    setType(newType);
  }
  useLayoutEffect(()=>{
    let chart = null;
    if (chartData === undefined || chartData.length === 0){
      return
    }

    if(type === "Pie"){ 
      chart = new PieChart(chartData, divID, title).chart; 
    }
    if(type === "Bar"){
      chart = new BarChart(chartData, divID, title).chart; 
    }
    if(type === "ClusterBar"){
      // eslint-disable-next-line
      chart = new ClusteredBarChart(chartData, divID, title).chart; 
    }
  });

  return (
        <div className={`h-120  pb-5 bg-white dark:bg-stone-600 rounded-lg shadow w-full`}>
              {
                type==='Pie' || type === 'Bar' ? 
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
