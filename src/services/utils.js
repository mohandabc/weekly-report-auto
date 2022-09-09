
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";


import * as am4core from "@amcharts/amcharts4/core";

import html2canvas from 'html2canvas';

import {SMARTEST_LOGO,SONATRACH_LOGO} from '../constants/logos'
import {BACKGROUND,LASTPAGE,TOPLEFT} from '../constants/backgrounds'

const buildTableBody = (data, columns) => {
  var body = [];

  body.push(columns);

  data.forEach(function(row) {
      var dataRow = [];
      console.log("hadou", columns)
      columns.forEach(function(column) {
        console.log("hadosdfsu", column)
          dataRow.push(row[column['text']].toString());
      })

      body.push(dataRow);
  });

  return body;
}

const table = (data, columns, widths) => {
  columns = columns.map(column => {return {text: column, alignment: 'center', fillColor: '#FFA500', fontSize: 15,}})
      return {
        table: {
            widths: widths,
            headerRows: 1,
            body: buildTableBody(data, columns)
        }
    };

}

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
    let tables_promesses = [];
    promises_list = [...promises_list, ...tables_promesses];

    return Promise.all(promises_list)
    .then((res) => [res.slice(0, nbr_charts), res.slice(nbr_charts) ]);
}

const setupNewPage = (doc, title = '', data, column, data1, column1, pageBreak = true) => {
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

  doc.content.push({
    text : title,
    fontSize : 22,
    margin:[25,0,0,20],
    alignment:'left',
    color:'#c00000',
    bold: true,
    decoration: 'underline',
  });

  switch(title) {
    case "- Deployment and Relocation :":
      doc.content.push({
        columns: [
          table(data, column,[202, 202, 202])
        ], 
        margin: [90,20,0,40],
        alignment : 'center'
      });

      doc.content.push({
        columns: [
          table(data1, column1,[308, 308])
        ], 
        margin: [90,0,0,0],
      });  

      break;
    case "- Wells Spud :":
      doc.content.push({
        columns: [
          table(data, column,[202, 202, 202])
        ], 
        margin: [90,20,0,40],
        alignment : 'center'
      });
      break;
    case "- Extra Jobs :":
      doc.content.push({
        columns: [
          table(data, column,['auto','auto','auto','auto','auto','auto','auto','auto'])
        ], 
        margin: [90,20,0,40],
        alignment : 'center'
      });
      break;
    case "+ Extra Jobs :":
      doc.content.push({
        columns: [
          table(data, column,['auto','auto','auto','auto','auto','auto','auto'])
        ], 
        margin: [90,20,0,40],
        alignment : 'center'
      });
      break;
    default:
      console.log("default from switch case")
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

const createLastPage = (doc, pageBreak=true) =>{
 
  doc.content.push({
    columns: [{image: LASTPAGE,
        margin: [-15,-20,0,-10],
        width: 842},],
        pageBreak:pageBreak===true ? 'before':''
  });
}

const addChartToPDF = (doc, chart, width = 650) =>{
  if (chart === undefined){
    console.log("chart isn't defined");
    return
  }

  doc.content.push({
    image:chart,
    margin : [-30,10,0,0],
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
    alignment : 'center'
  });
} 

export const generateWeeklyReport = (chartsToPrint, tablesToPrint, weeklyData, range) =>{
    if(chartsToPrint.length === 0){
      return;
    }

    let charts = chartsToPrint.map((chartDivId)=>getChartByContainerId(chartDivId));
    if(charts.length === 0){
      return;
    }

    console.log("tableeees",weeklyData);
    
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

          setupNewPage(doc, "- Deployment and Relocation :", weeklyData['deployements_and_interventions'], ['Deployement','Interventions','Distance'],weeklyData['remote_relocation'], ["N of Remote Relocations","Cost/Distance Saved"]);

          setupNewPage(doc, "- Wells Spud :", weeklyData['wells_spudded'], ['Rigs Spudded and Monitored','Rigs Spudded and Not Monitored','Duration (Days)']);
          
          setupNewPage(doc, "- Rig Box, Maintenance :");
          addChartToPDF(doc, exportedCharts[0]);

          setupNewPage(doc, "- NDJ Jobs :");
          addChartToPDF(doc, exportedCharts[1]);

          setupNewPage(doc,  "- Extra Jobs :", weeklyData['cementing_jobs'], ['Rig','Well','Result','Casing','Company','Unit', 'Start Date', 'NDJ Root Cause']);
          // addChartToPDF(doc,  exportedTables[3]?.toDataURL("image/png"),600);

          setupNewPage(doc,  "+ Extra Jobs :", weeklyData['mwd_jobs'], ['Rig','Well','Result','Company','Unit', 'Start Date', 'NDJ Root Cause']);
          // addChartToPDF(doc,  exportedTables[3]?.toDataURL("image/png"),600);

          // setupNewPage(doc,  "- Data Recovery :");
          // addChartToPDF(doc, exportedCharts[2])
          // setupNewPage(doc,  "- Data Recovery :");
          // addChartToPDF(doc, exportedCharts[3])
          
          // setupNewPage(doc,  "- Data Quality :");
          // addChartToPDF(doc, exportedCharts[4])
          // setupNewPage(doc,  "- Data Quality :");
          // addChartToPDF(doc, exportedCharts[5])
                    
          // setupNewPage(doc,  "- Data Quality :");
          // addChartToPDF(doc, exportedCharts[6])
          // setupNewPage(doc,  "- Data Quality :");
          // addChartToPDF(doc, exportedCharts[7])
          
          // setupNewPage(doc,  "- Data Quality :");
          // addChartToPDF(doc, exportedCharts[8])
        
          // setupNewPage(doc,  "- Helpdesk Tickets :");
          // addChartToPDF(doc, exportedCharts[9])

          // createLastPage(doc);

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
          add2ChartsInline(doc, exportedTables[0]?.toDataURL("image/png"), exportedTables[1]?.toDataURL("image/png"), 195,395);
          addChartToPDF(doc, exportedTables[2]?.toDataURL("image/png"), 600);

          setupNewPage(doc, "- Reservoire Tickets :");
          addChartToPDF(doc, exportedTables[3]?.toDataURL("image/png"), 600);

          setupNewPage(doc, "- Data Quality :");
          addChartToPDF(doc, exportedTables[4]?.toDataURL("image/png"), 600);

          setupNewPage(doc, "- Data Quality :");
          addChartToPDF(doc, exportedCharts[0]);

          setupNewPage(doc, "- Data Quality :");
          addChartToPDF(doc, exportedCharts[1]);

          setupNewPage(doc, "- Data Loss :");
          addChartToPDF(doc, exportedTables[5]?.toDataURL("image/png"), 600);

          setupNewPage(doc, "- Data Loss :");
          addChartToPDF(doc, exportedCharts[2]);

          setupNewPage(doc, "- Data Loss :");
          addChartToPDF(doc, exportedCharts[3]);

          setupNewPage(doc, "- Data Loss :");
          addChartToPDF(doc, exportedCharts[4]);

          setupNewPage(doc, "- Data Recovery :");
          addChartToPDF(doc, exportedTables[6]?.toDataURL("image/png"), 600);

          setupNewPage(doc, "- Data Recovery :");
          addChartToPDF(doc, exportedCharts[5]);

          setupNewPage(doc, "- Data Recovery :");
          addChartToPDF(doc, exportedCharts[6]);

          setupNewPage(doc, "- Data Recovery :");
          addChartToPDF(doc, exportedCharts[7]);

          setupNewPage(doc, "- D/I :");
          addChartToPDF(doc, exportedTables[7]?.toDataURL("image/png"), 600);

          setupNewPage(doc, "- D/I :");
          addChartToPDF(doc, exportedCharts[8]);

          createLastPage(doc);

        pdfMake.createPdf(doc).download(`Daily_report_${range}.pdf`);

      });
  }