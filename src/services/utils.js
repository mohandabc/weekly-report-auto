/************************************************************
 * A SET OF HELPER FUNCTIONS USED IN GENERATING THE REPORTS *
 *                   AND LOGGING IN USERS                   *
 ************************************************************/

import * as am4core from "@amcharts/amcharts4/core";

import {SMARTEST_LOGO,SONATRACH_LOGO} from '../constants/logos'
import {BACKGROUND,LASTPAGE,TOPLEFT} from '../constants/backgrounds'

export const pushTabToDoc = (doc, data, columns, widths) => {
  return doc.content.push({
    columns: [
      table(data, columns, widths)
    ], 
    margin: [90,20,0,0],
    alignment : 'center'
  });
}

export const buildTableBody = (data, columns) => {
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
      if (['succesful','Done','Waiting For Deployment'].some(el => dataRow.includes(el))) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#bdffc6'}});
      if (['In Progress','Unit Test'].some(el => dataRow.includes(el))) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#fff8bd'}});
      if (['Under Test'].some(el => dataRow.includes(el))) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#bdfaff'}});
      if (['unsuccessful','canceled'].some(el => dataRow.includes(el))) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#ffc1bd'}});
      if (['incomplete','On Hold'].some(el => dataRow.includes(el))) dataRow = dataRow.map(function(row){return {text:row, fillColor:'#ffe0ba'}});
      body.push(dataRow);
  });
  return body;
}

export const table = (data, columns, widths) => {
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

export const getChartByContainerId = (id) => {
  var charts = am4core.registry.baseSprites;
  for(var i = 0; i < charts.length; i++) {
    if (charts[i].svgContainer.htmlElement.id === id) {
      return charts[i];
    }
  }
}

export const exportCharts = async (charts) => {
    let promises_list = charts.map((chart) => chart?.exporting.getImage("png"));
    const nbr_charts = promises_list.length;
    promises_list = [...promises_list];

    return Promise.all(promises_list)
    .then((res) => [res.slice(0, nbr_charts)]);
}

export const setupNewPage = (doc, title = '', data, column, data1, column1, pageBreak = true, noData = false, string) => {
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
    case "- DevTasks :":
      pushTabToDoc(doc, data, column, [60,290,60,70,70,60]);
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


export const createHeaderPage = (doc, range, title, reportType) =>{
  let reportDate;
  if (reportType=='weekly') {
    reportDate=`From ${range.split(" - ")[0]} To ${range.split(" - ")[1]}`
  } else {
    reportDate=new Date(range.split(" - ")[0]);
  reportDate.setDate(reportDate.getDate()+1);
  reportDate=reportDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
  }
  
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
      {text : reportDate,
      fontSize : 28,
      absolutePosition: {y: 280},
      alignment:'center',
      color:'#00000',
      bold: true,}
    ],
  });
}

export const createStatsTablePage = (doc, data1, data2, text1, text2) =>{
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
    margin:[155,70,0,0]
  });
}

export const createLastPage = (doc, pageBreak=true) =>{
 
  doc.content.push({
    columns: [{image: LASTPAGE,
        margin: [-15,-20,0,-10],
        width: 842},],
        pageBreak:pageBreak===true ? 'before':''
  });
}

export const addChartToPDF = (doc, chart, width = 650) =>{
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

// Encrypts a string using a salt (Please refer to Canstants folder SALTKEY.js).
export const crypt = (salt, text) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

  return text
    .split("")
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join("");
};

// Decrypts a string using a salt (Please refer to Canstants folder SALTKEY.js).
export const decrypt = (salt, encoded) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join("");
};

  