
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";


import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import html2canvas from 'html2canvas';

import {SMARTEST_LOGO, SONATRACH_LOGO} from './constants/logos'

const getChartByContainerId = (id) => {
  var charts = am4core.registry.baseSprites;
  for(var i = 0; i < charts.length; i++) {
    if (charts[i].svgContainer.htmlElement.id === id) {
      return charts[i];
    }
  }
}

const exportCharts = async (charts, tablesToPrint) => {
    let promises_list = charts.map((chart) => chart.exporting.getImage("png"));
    const nbr_charts = promises_list.length;
    let tables_promesses = tablesToPrint.map(table => html2canvas(document.getElementById(table)));
    promises_list = [...promises_list, ...tables_promesses];

    return Promise.all(promises_list)
    .then((res) => [res.slice(0, nbr_charts), res.slice(nbr_charts) ]);
}

const createHeaderPage = (doc, title, range) =>{
  doc.content.push({
    columns: [{
        image: SMARTEST_LOGO,
        margin: [0,50,0,0],
        width: 160
    },{

        image: SONATRACH_LOGO,
        margin: [330,40,0,0],
        width: 40
    }]
  })

  doc.content.push({
    text : title,
    fontSize : 48,
    margin:[0,100,0,20],
    alignment:'center',
    color:'#444',
    
  });
  doc.content.push({
    text : `From ${range.split(" - ")[0]} To ${range.split(" - ")[1]}`,
    fontSize : 36,
    margin:[0,0,0,100],
    alignment:'center',
    color:'#444',
    pageBreak:'after'
  });

}

const addChartToPDF = (doc, title, chart) =>{
  doc.content.push({
    text : title,
    fontSize:16,
    color:'#CC5555', 
    alignment:'center',
  });
  doc.content.push({
    image:chart,
    margin : [5,5,0,0],
    width : 250,
    alignment:'center',

  });

}

export const generateWeeklyReport = (chartsToPrint, tablesToPrint, range) =>{
    if(chartsToPrint.length === 0){
      return;
    }

    let charts = chartsToPrint.map((chartDivId)=>getChartByContainerId(chartDivId));
    if(charts.length === 0){
      return;
    }

    exportCharts(charts, tablesToPrint)
    .then(response => {
        const [exportedCharts, exportedTables] = response;    
    
        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        var doc={
          pageSize: "A4",
          pageOrientation: "portrait",
          pageMargins: [15,20,0,10],
          content: [],  
          };

          createHeaderPage(doc, "BO Weekly Report", range);
          addChartToPDF(doc, "Rig Box, Maintenance", exportedCharts[0]);
          addChartToPDF(doc, "NDJ Jobs", exportedCharts[1]);
          addChartToPDF(doc, "Cementing Job Transmission", exportedTables[0]?.toDataURL("image/png"));
          addChartToPDF(doc, "MWD Transmission", exportedTables[1]?.toDataURL("image/png"));
          


        //   exportedCharts.forEach((chart)=>{
        //   doc.content.push({
        //     image:chart,
        //     margin : [5,5,0,0],
        //     width : 400,
        //   })
        // });

        // exportedTables.forEach((table)=>{
        //   doc.content.push({
        //     image:table.toDataURL("image/png"),
        //     margin : [5,5,0,0],
        //     width : 250,
        //   })
        // });
        
        pdfMake.createPdf(doc).download("daily.pdf");
      });
       
    // });
  }

  