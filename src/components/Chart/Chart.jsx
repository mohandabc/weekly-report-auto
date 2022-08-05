import React, { useLayoutEffect} from 'react';
import { BarChart, PieChart } from './charts';

export const Chart = ({id, chartData, chartType}) => {
  const div = id.toString();

  useLayoutEffect(()=>{
    let chart = null;
    if(chartType === "Pie"){ 
      chart = new PieChart(chartData, div).chart; 
    }
    if(chartType === "Bar"){
      chart = new BarChart(chartData, div).chart; 
    }
  });

  return (
        <div 
          style={{ width: "100%", height: "500px" }} 
          id={div}>
        </div>    
  );
}
