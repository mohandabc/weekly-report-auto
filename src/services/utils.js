
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";


import * as am4core from "@amcharts/amcharts4/core";

import html2canvas from 'html2canvas';

import {SMARTEST_LOGO,SONATRACH_LOGO} from '../constants/logos'
import {BACKGROUND,LASTPAGE,TOPLEFT} from '../constants/backgrounds'

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
        image: TOPLEFT,
        absolutePosition: {x:0 ,y: 0},
        width: 50
    },{
      image: SONATRACH_LOGO,
      absolutePosition: {x:750 ,y: 10},
      width: 40
  }], 
  pageBreak:pageBreak===true ? 'before':''
  });

  doc.content.push({
    columns: [{
        image: SMARTEST_LOGO,
        margin: [80,0,0,20],
        width: 210
    },
    ], 
  });

  if(title !== ''){
    doc.content.push({
      text : title,
      fontSize : 22,
      margin:[25,0,0,20],
      alignment:'left',
      color:'#c00000',
      bold: true,
      decoration: 'underline',
    });
  }
} 

const createHeaderPage = (doc, range, title) =>{
 
  doc.content.push({
    columns: [{image: BACKGROUND,
      margin:[-15,-20,0,-10],
      width: 842},
    {text : title,
      fontSize : 36,
      absolutePosition: {y: 236},
      alignment:'center',
      color:'#c00000',
      bold: true,},
      {text : `From ${range.split(" - ")[0]} To ${range.split(" - ")[1]}`,
      fontSize : 28,
      absolutePosition: {y: 280},
      alignment:'center',
      color:'#00000',
      bold: true,}
    ],
  });
}

const createLastPage = (doc) =>{
 
  doc.content.push({
        image: LASTPAGE,
        absolutePosition: {x:0, y: 0},
        width: 842
  });
}

const addChartToPDF = (doc, chart, width = 650) =>{
  if (chart === undefined){
    console.log("chart isn't defined");
    return
  }

  doc.content.push({
    image:chart,
    margin : [0,10,0,0],
    width : width,
    alignment:'center',

  });
}

const add2ChartsInline = (doc, chart1, chart2, width, width2) =>{
  doc.content.push({
    columns :[
      {
        image:chart1,
        width : width,
        alignment:'center',
    
      },
      {
        image:chart2, 
        width : width2,
        alignment:'center',
    
      }
    ], columnGap: 10,
    margin : [125,10,0,0],
    alignment : 'center'
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
          pageOrientation: "landscape",
          pageMargins: [15,20,0,10],
          content: [],  
          };

          createHeaderPage(doc, range, "BO Weekly Report");

          setupNewPage(doc, "- Deployment and Relocation :");
          add2ChartsInline(doc, exportedTables[0]?.toDataURL("image/png"), exportedTables[1]?.toDataURL("image/png"), 295,295);
          addChartToPDF(doc, exportedTables[2]?.toDataURL("image/png"), 600);
          
          setupNewPage(doc, "- Rig Box, Maintenance :");
          addChartToPDF(doc, exportedCharts[0]);

          setupNewPage(doc, "- NDJ Jobs :");
          addChartToPDF(doc, exportedCharts[1]);

          setupNewPage(doc,  "- Extra Jobs :");
          addChartToPDF(doc,  exportedTables[3]?.toDataURL("image/png"),600);

          setupNewPage(doc,  "- Extra Jobs :");
          addChartToPDF(doc, exportedTables[4]?.toDataURL("image/png"),600);

          setupNewPage(doc,  "- Data Recovery :");
          addChartToPDF(doc, exportedCharts[2])
          setupNewPage(doc,  "- Data Recovery :");
          addChartToPDF(doc, exportedCharts[3])
          
          setupNewPage(doc,  "- Data Quality :");
          addChartToPDF(doc, exportedCharts[4])
          setupNewPage(doc,  "- Data Quality :");
          addChartToPDF(doc, exportedCharts[5])
                    
          setupNewPage(doc,  "- Data Quality :");
          addChartToPDF(doc, exportedCharts[6])
          setupNewPage(doc,  "- Data Quality :");
          addChartToPDF(doc, exportedCharts[7])
          
          setupNewPage(doc,  "- Data Quality :");
          addChartToPDF(doc, exportedCharts[8])
        
          setupNewPage(doc,  "- Helpdesk Tickets :");
          addChartToPDF(doc, exportedCharts[9])

          createLastPage(doc);

        pdfMake.createPdf(doc).download(`Weekly_report_${range}.pdf`);
      });
  }

  export const generateDailyReport = (chartsToPrint, tablesToPrint, range) =>{
    if(chartsToPrint.length === 0){
      return;
    }

    let charts = chartsToPrint.map((chartDivId)=>getChartByContainerId(chartDivId));
    if(charts.length === 0){
      return;
    }

    console.log(charts)
    console.log(tablesToPrint)
    exportCharts(charts, tablesToPrint)
    .then(response => {

        const [exportedCharts, exportedTables] = response; 

        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        var doc={
          pageSize: "A4",
          pageOrientation: "landscape",
          pageMargins: [15,20,0,10],
          content: [],  
          };

          createHeaderPage(doc, range, "BO Daily Report");

          setupNewPage(doc, "- Well Spud and Extra jobs status :");
          add2ChartsInline(doc, exportedTables[0]?.toDataURL("image/png"), exportedTables[1]?.toDataURL("image/png"), 300,300);
          addChartToPDF(doc, exportedTables[2]?.toDataURL("image/png"), 500);

          setupNewPage(doc, "- Reservoire Tickets :");
          addChartToPDF(doc, exportedTables[3]?.toDataURL("image/png"), 500);

          setupNewPage(doc, "- Data Quality :");
          addChartToPDF(doc, exportedTables[4]?.toDataURL("image/png"), 450);

          setupNewPage(doc, "- Data Quality :");
          addChartToPDF(doc, exportedCharts[0]);

          setupNewPage(doc, "- Data Quality :");
          addChartToPDF(doc, exportedCharts[1]);

          setupNewPage(doc, "- Data Loss :");
          addChartToPDF(doc, exportedTables[5]?.toDataURL("image/png"), 450);

          setupNewPage(doc, "- Data Loss :");
          addChartToPDF(doc, exportedCharts[2]);

          setupNewPage(doc, "- Data Loss :");
          addChartToPDF(doc, exportedCharts[3]);

          setupNewPage(doc, "- Data Loss :");
          addChartToPDF(doc, exportedCharts[4]);

          setupNewPage(doc, "- Data Recovery :");
          addChartToPDF(doc, exportedTables[6]?.toDataURL("image/png"), 450);

          setupNewPage(doc, "- Data Recovery :");
          addChartToPDF(doc, exportedCharts[5]);

          setupNewPage(doc, "- Data Recovery :");
          addChartToPDF(doc, exportedCharts[6]);

          setupNewPage(doc, "- Data Recovery :");
          addChartToPDF(doc, exportedCharts[7]);

          setupNewPage(doc, "- D/I :");
          addChartToPDF(doc, exportedTables[7]?.toDataURL("image/png"), 200);

          setupNewPage(doc, "- D/I :");
          addChartToPDF(doc, exportedCharts[8]);

          createLastPage(doc);

        pdfMake.createPdf(doc).download(`Daily_report_${range}.pdf`);

      });
  }