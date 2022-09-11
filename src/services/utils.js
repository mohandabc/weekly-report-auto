
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import * as am4core from "@amcharts/amcharts4/core";

import {SMARTEST_LOGO,SONATRACH_LOGO} from '../constants/logos'
import {BACKGROUND,LASTPAGE,TOPLEFT} from '../constants/backgrounds'

const pushTabToDoc = (doc, data, columns, widths) => {
  return doc.content.push({
    columns: [
      table(data, columns, widths)
    ], 
    margin: [90,20,0,0],
    alignment : 'center'
  });
}

const buildTableBody = (data, columns) => {
  var body = [];

  body.push(columns);

  data.forEach(function(row) {
      var dataRow = [];
      columns.forEach(function(column) {
          dataRow.push(row[column['text']].toString());
      })
      if (dataRow.includes('1900-01-01')) {
        dataRow = dataRow.map(function(x){return x.replace('1900-01-01', 'N/A');});
      } 
      if (dataRow.includes('succesful')) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#91eb9d'}});
      if (dataRow.includes('In Progress')) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#8cc0e6'}});
      if (dataRow.includes('unsuccessful')) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#eb9791'}});
      if (dataRow.includes('canceled')) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#eb9791'}});
      if (dataRow.includes('incomplete')) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#e8bc90'}});
      body.push(dataRow);
  });
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

const exportCharts = async (charts) => {
    let promises_list = charts.map((chart) => chart?.exporting.getImage("png"));
    const nbr_charts = promises_list.length;
    promises_list = [...promises_list];

    return Promise.all(promises_list)
    .then((res) => [res.slice(0, nbr_charts)]);
}

const setupNewPage = (doc, title = '', data, column, data1, column1, pageBreak = true, noData = false, string) => {
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

  if (noData) {
    doc.content.push({
      text : string,
      fontSize : 22,
      margin:[0,150,0,20],
      alignment:'center',
      color:'black',
    });
  }
  switch(title) {
    case "- Deployment and Relocation :":
      pushTabToDoc(doc, data, column, [202, 202, 202]);
      pushTabToDoc(doc, data1, column1, [308, 308]);
      break;
    case "- Wells Spud :":
      pushTabToDoc(doc, data, column, [202, 202, 202]);
      break;
    case "- Extra Jobs Cementing :":
      pushTabToDoc(doc, data, column, [40,50,72,80,50,150,61,105]);
      break;
    case "- Extra Jobs MWD :":
      pushTabToDoc(doc, data, column, [40,50,72,80,150,61,105]);
      break;
    case "- Extra jobs status :":
      pushTabToDoc(doc, data, column, [202, 202, 202]);
      pushTabToDoc(doc, data1, column1, [200,60,60,100,170]);
      break;
    case "- Wells spud :":
      pushTabToDoc(doc, data, column, [623]);
      break;
    case "- Deployments and Interventions :":
      pushTabToDoc(doc, data, column, [70,70,120,100,170]);
      break;
    case "- Reservoir Tickets :":
      pushTabToDoc(doc, data, column, [70,70,70,100,280]);
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

const createPlainTextPage = (doc, data1, data2, text1, text2) =>{
 doc.content.push(
  {
    style: 'tableExample',
    table: {
      headerRows: 1,
      
      body: [
        [{text: text1, color: 'black', width:60 ,alignment: 'center', fillColor: '#e6e6e6', fontSize: 16, style: 'tableHeader', bold: true,},
        {text: data1, color: 'black', width:60 ,alignment: 'center', fillColor: '#e6e6e6', fontSize: 16, style: 'tableHeader'}],
        [{text: text2, color: 'black', width:60 ,alignment: 'center', fillColor: '#e6e6e6', fontSize: 16, style: 'tableHeader', bold: true,},
        {text: data2, color: 'black', width:60 ,alignment: 'center', fillColor: '#e6e6e6', fontSize: 16, style: 'tableHeader'}],
      ],
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
      paddingTop: function(i, node) { return 40; },
      paddingBottom: function(i, node) { return 40; },
      paddingLeft: function(i, node) { return 40; },
      paddingRight: function(i, node) { return 40; },
    },
    margin:[160,70,0,0]
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

export const generateWeeklyReport = (chartsToPrint, weeklyData, range) =>{
    if(chartsToPrint.length === 0){
      return;
    }

    let charts = chartsToPrint.map((chartDivId)=>getChartByContainerId(chartDivId));
    if(charts.length === 0){
      return;
    }
    
    exportCharts(charts)
    .then(response => {
        const [exportedCharts] = response; 
    
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

          if (!weeklyData['resolved_quality'].length) setupNewPage(doc, "- Data Quality :", ...[,,,,,], true, "No Resolved Quality Tickets this week."); else {
            setupNewPage(doc,  "- Data Quality :");
            addChartToPDF(doc, exportedCharts[5])
          }

          setupNewPage(doc,  "- Data Quality :");
          addChartToPDF(doc, exportedCharts[6])

          if (weeklyData['resolved_channels'].length) {
            setupNewPage(doc,  "- Data Quality :");
            addChartToPDF(doc, exportedCharts[7])
          }
          
          if (weeklyData['resolved_channels_by_user'].length) {
            setupNewPage(doc,  "- Data Quality :");
            addChartToPDF(doc, exportedCharts[8])
          }
        
          setupNewPage(doc,  "- Helpdesk Tickets :");
          addChartToPDF(doc, exportedCharts[9])

          createLastPage(doc);

        pdfMake.createPdf(doc).download(`Weekly_report_${range}.pdf`);
      });
  }

  export const generateDailyReport = (chartsToPrint, dailyData, range) =>{
    if(chartsToPrint.length === 0){
      return;
    }

    let charts = chartsToPrint.map((chartDivId)=>getChartByContainerId(chartDivId));
    if(charts.length === 0){
      return;
    }

    exportCharts(charts)
    .then(response => {

        const [exportedCharts] = response; 

        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        var doc={
          pageSize: "A4",
          pageOrientation: "landscape",
          pageMargins: [15,20,0,10],
          content: [],  
          };
          createHeaderPage(doc, range, "BO Daily Report");

          
          setupNewPage(doc, "- Extra jobs status :", dailyData['extra_jobs_n'], ['Extra Job Transmitted','Extra Job  Not Transmitted','Extra Job Not Completed'],dailyData['extra_jobs'], ['NDJ Name','Well','Rig','NDJ Result','RootCause']);
          setupNewPage(doc, "- Wells spud :", dailyData['wells_spud'], ["Spudded Wells"]);

          
          if (dailyData['data_quality'][0]['Tickets Resolved'][0]==0 && dailyData['data_quality'][0]['Channels Resolved'][0]==0 ) {
            setupNewPage(doc, "- Data Quality  :", ...[,,,,,], true, "No Resolved Quality Tickets Today.");
            setupNewPage(doc, "- Data Quality :");
            addChartToPDF(doc, exportedCharts[0]);
            setupNewPage(doc, "- Reservoir Tickets :", dailyData['reservoir_tickets'], ['Rig', 'Well', 'Phase', 'Stage', 'Channels']);
          } else {
          setupNewPage(doc, "- Data Quality Stats :");
          createPlainTextPage(doc, dailyData['data_quality'][0]['Tickets Resolved'], dailyData['data_quality'][0]['Channels Resolved'], 'Total tickets resolved Today', 'Total channels resolved Today')
          if (!dailyData['resolved_Q_tickets_channels'].length) setupNewPage(doc, "- Data Quality  :", ...[,,,,,], true, "No Resolved Quality Tickets Today."); else {
          setupNewPage(doc, "- Data Quality :");
          addChartToPDF(doc, exportedCharts[1]);}}

          
          if (dailyData['data_loss'][0]['Total Tickets Resolved'][0]==0 && dailyData['data_loss'][0]['Gap to Total Ratio'][0]==0 ) {
            setupNewPage(doc, "- Data Loss  :", ...[,,,,,], true, "No Resolved Loss Tickets Today.");
          } else {setupNewPage(doc, "- Data Loss Stats :");
          createPlainTextPage(doc, dailyData['data_loss'][0]['Total Tickets Resolved'], dailyData['data_loss'][0]['Gap to Total Ratio'], 'Total tickets resolved Today', 'Gap/TotalGap ratio for Today')
          setupNewPage(doc, "- Data Loss :");
          addChartToPDF(doc, exportedCharts[2]);}

          
          if (dailyData['data_recovery'][0]['Total Tickets Resolved'][0]==0 && dailyData['data_recovery'][0]['Gap to Total Ratio'][0]==0 ) {
            setupNewPage(doc, "- Data Recovery  :", ...[,,,,,], true, "No Resolved Recovery Tickets Today.");
          } else {setupNewPage(doc, "- Data Recovery Stats :");
          createPlainTextPage(doc, dailyData['data_recovery'][0]['Total Tickets Resolved'], dailyData['data_recovery'][0]['Gap to Total Ratio'], 'Total tickets resolved Today', 'Gap/TotalGap ratio for Today')
          setupNewPage(doc, "- Data Recovery :");
          addChartToPDF(doc, exportedCharts[5]);}

          
          if (!dailyData['deployements_and_interventions'].length) setupNewPage(doc, "- Deployments and Interventions  :", ...[,,,,,], true, "No Deployments/Intervations Today."); else {
            setupNewPage(doc, "- Deployments and Interventions :", dailyData['deployements_and_interventions'], ['rig','well','activity','status','distance']);
            setupNewPage(doc, "- D/I :");
            addChartToPDF(doc, exportedCharts[8]);
          }

          createLastPage(doc);

        pdfMake.createPdf(doc).download(`Daily_report_${range}.pdf`);

      });
  }