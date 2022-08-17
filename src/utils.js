
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";


import * as am4core from "@amcharts/amcharts4/core";

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
    let promises_list = charts.map((chart) => chart?.exporting.getImage("png"));
    const nbr_charts = promises_list.length;
    let tables_promesses = tablesToPrint.map(table => html2canvas(document.getElementById(table)));
    promises_list = [...promises_list, ...tables_promesses];

    return Promise.all(promises_list)
    .then((res) => [res.slice(0, nbr_charts), res.slice(nbr_charts) ]);
}

const setupNewPage = (doc, title = '', pageBreak = true) => {
  doc.content.push({
    columns: [{
        image: SMARTEST_LOGO,
        margin: [0,50,0,0],
        width: 160
    },{

        image: SONATRACH_LOGO,
        margin: [330,40,0,0],
        width: 40
    }], 
    pageBreak:pageBreak===true ? 'before':''
  });

  if(title !== ''){
    doc.content.push({
      text : title,
      fontSize : 22,
      margin:[20,50,0,20],
      alignment:'left',
      color:'#880000',
      
    });
  }
  
} 

const createHeaderPage = (doc, range) =>{
 
  setupNewPage(doc, '', false);

  doc.content.push({
    text : "BO Weekly Report",
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
  });

}



const addChartToPDF = (doc, chart) =>{
  if (chart === undefined){
    console.log("chart isn't defined");
    return
  }
  // doc.content.push({
  //   text : title,
  //   fontSize:14,
  //   color:'#555', 
  //   alignment:'center',
  // });
  doc.content.push({
    image:chart,
    margin : [5,5,0,0],
    width : 500,
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

          createHeaderPage(doc, range);

          setupNewPage(doc, "Rig Box, Maintenance");
          addChartToPDF(doc, exportedCharts[0]);

          setupNewPage(doc, "NDJ Jobs");
          addChartToPDF(doc, exportedCharts[1]);

          setupNewPage(doc,  "Extra Jobs");
          addChartToPDF(doc,  exportedTables[0]?.toDataURL("image/png"));

          setupNewPage(doc,  "Extra Jobs");
          addChartToPDF(doc, exportedTables[1]?.toDataURL("image/png"));

          setupNewPage(doc,  "Data Recovery");
          addChartToPDF(doc, exportedCharts[2])
          addChartToPDF(doc, exportedCharts[3])
          
          setupNewPage(doc,  "Data Quality");
          addChartToPDF(doc, exportedCharts[4])
          addChartToPDF(doc, exportedCharts[5])
                    
          setupNewPage(doc,  "Data Quality");
          addChartToPDF(doc, exportedCharts[6])
          addChartToPDF(doc, exportedCharts[7])
          
          setupNewPage(doc,  "Data Quality");
          addChartToPDF(doc, exportedCharts[8])
        
          setupNewPage(doc,  "Helpdesk Tickets");
          addChartToPDF(doc, exportedCharts[9])

          setupNewPage(doc,  "Mini Project Progress");
          addChartToPDF(doc, exportedTables[2]?.toDataURL("image/png"));

        pdfMake.createPdf(doc).download("daily.pdf");
      });
       
    // });
  }

  