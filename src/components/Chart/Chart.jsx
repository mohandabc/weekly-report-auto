import React, { useLayoutEffect} from 'react';
import { BarChart, PieChart, ClusteredBarChart } from './charts';

export const Chart = ({title, id, chartData, chartType}) => {
  const div = id.toString();

  useLayoutEffect(()=>{
    let chart = null;

    if(chartType === "Pie"){ 
      chart = new PieChart(chartData, div).chart; 
    }
    if(chartType === "Bar"){
      chart = new BarChart(chartData, div).chart; 
    }
    if(chartType === "ClusterBar"){
      chart = new ClusteredBarChart(chartData, div).chart; 
    }
  });

  return (
        <div className='w-full'>
          <h2 className='text-center'>{title}</h2>
          <div 
            className='inline-block mx-auto h-96 w-full'
            id={div}>
          </div>    
        </div>
  );
}
