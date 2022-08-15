import React, { useLayoutEffect} from 'react';
import { BarChart, PieChart, ClusteredBarChart } from './charts';

export const Chart = ({title, id, chartData, chartType}) => {
  const div = id.toString();

  useLayoutEffect(()=>{
    let chart = null;

    if(chartType === "Pie"){ 
      chart = new PieChart(chartData, div, title).chart; 
    }
    if(chartType === "Bar"){
      chart = new BarChart(chartData, div, title).chart; 
    }
    if(chartType === "ClusterBar"){
      // eslint-disable-next-line
      chart = new ClusteredBarChart(chartData, div, title).chart; 
    }
  });

  return (
        <div className="border bg-white border-4 border-red-600 rounded-lg shadow w-full">
          <div 
            className='inline-block mx-auto h-96 w-full'
            id={div}>
          </div>    
        </div>
  );
}
