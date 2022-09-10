
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import * as am4core from "@amcharts/amcharts4/core";

import {SMARTEST_LOGO,SONATRACH_LOGO} from '../constants/logos'
import {BACKGROUND,LASTPAGE,TOPLEFT} from '../constants/backgrounds'

const buildTableBody = (data, columns) => {
  var body = [];

  body.push(columns);

  data.forEach(function(row) {
      var dataRow = [];
      columns.forEach(function(column) {
          dataRow.push(row[column['text']].toString());
      })
      if (dataRow.includes('succesful')) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#91eb9d'}});
      if (dataRow.includes('In Progress')) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#8cc0e6'}});
      if (dataRow.includes('unsuccessful')) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#eb9791'}});
      if (dataRow.includes('canceled')) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#eb9791'}});
      if (dataRow.includes('incomplete')) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#e8bc90'}});
      body.push(dataRow);
  });
  console.log("boooodyyy",body)
  return body;
}

const table = (data, columns, widths) => {
  columns = columns.map(column => {return {text: column, color: 'white', width:60 ,alignment: 'center', fillColor: '#C00000', fontSize: 15, style: 'tableHeader',}})
      return {
        table: {
            style: 'tableExample',
            widths: widths,
            headerRows: 1,
            body: buildTableBody(data, columns)
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 2 : 1;
          },
          vLineWidth: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
          },
          hLineColor: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 'white' : 'white';
          },
          vLineColor: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 'white' : 'white';
          },
          fillColor: function (rowIndex) {
            return (rowIndex>0) ? '#e6e6e6' : null;
          },
          paddingTop: function(i, node) { return 8; },
          paddingBottom: function(i, node) { return 8; },
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
    promises_list = [...promises_list];

    return Promise.all(promises_list)
    .then((res) => [res.slice(0, nbr_charts)]);
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
        margin: [90,20,0,0],
        alignment : 'center'
      });

      doc.content.push({
        columns: [
          table(data1, column1,[308, 308])
        ], 
        margin: [90,20,0,0],
        alignment : 'center'
      });  

      break;
    case "- Wells Spud :":
      doc.content.push({
        columns: [
          table(data, column,[202, 202, 202])
        ], 
        margin: [90,20,0,0],
        alignment : 'center'
      });
      break;
    case "- Extra Jobs Cementing :":
      doc.content.push({
        columns: [
          table(data, column,[40,50,72,80,50,150,61,105])
        ], 
        margin: [67,20,0,0],
        alignment : 'center'
      });
      break;
    case "- Extra Jobs MWD :":
      doc.content.push({
        columns: [
          table(data, column,[40,50,72,80,150,61,105])
        ], 
        margin: [90,20,0,0],
        alignment : 'center'
      });
      break;
    default:
      doc.content.push({
        columns: [
        ], 
        margin: [90,20,0,0],
        alignment : 'center'
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
    margin : [-40,10,0,0],
    width : width,
    alignment:'center',

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

          setupNewPage(doc,  "- Extra Jobs Cementing :", weeklyData['cementing_jobs'], ['Rig','Well','Result','Casing','Company','Unit', 'Start Date', 'NDJ Root Cause']);

          setupNewPage(doc,  "- Extra Jobs MWD :", weeklyData['mwd_jobs'], ['Rig','Well','Result','Company','Unit', 'Start Date', 'NDJ Root Cause']);

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
          // add2ChartsInline(doc, exportedTables[0]?.toDataURL("image/png"), exportedTables[1]?.toDataURL("image/png"), 195,395);
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