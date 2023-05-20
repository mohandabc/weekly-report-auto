/************************************************************
 * A SET OF HELPER FUNCTIONS USED IN GENERATING THE REPORTS *
 *                   AND LOGGING IN USERS                   *
 * functions here should do only one task and do general 
 * case. exp: setupNewPage has a relation with data, meaning
 * I can't use it to create a new page in any report type
 ************************************************************/

import * as am4core from "@amcharts/amcharts4/core";

import {SMARTEST_LOGO,SONATRACH_LOGO} from '../constants/logos'

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { LASTPAGE, TOPLEFT } from "../constants/backgrounds";
const baseLayout = {
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
      return (rowIndex>0) ? '#e6e6e6' : "#eeeeee";
    },
    paddingTop: function(i, node) { return 8; },
    paddingBottom: function(i, node) { return 8; },
  }
const tablesLayouts = {
  'simple':baseLayout,
  'one_row': {...baseLayout, 
    fillColor: function (rowIndex,node,  columnIndex) {
      return (columnIndex%2===0) ? '#e6e6e6' : "#c00000";
    },
  },
  'grouped':{...baseLayout,
    fillColor: function (i, node) {
      if('colSpan' in node.table.body[i][0]) return '#999999'
      else return (i === 0) ? '#555555' : (i%2===0) ? '#e6e6e6' : "#eeeeee";
    },
  }
}


export const logError = (text) => {
  alert(text);
}
export const createDoc = (size, orientation, margin) =>{
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  return {
      pageSize: size,
      pageOrientation: orientation,
      pageMargins: margin,
      content: [],  
  };
}

export const buildPageHeader = () =>{
  return {
    columns: [{
        image: SMARTEST_LOGO,
        absolutePosition: {x:30 ,y: 30},
        width: 160
        },{
        image: SONATRACH_LOGO,
        absolutePosition: {x:500 ,y: 10},
        width: 50
    }],
    margin:[0,0,0,80]
  };
}
export const buildPageFooter = (leftText, rightText) =>{
  return {
    columns: [{
      text : leftText,
      fontSize : 12,
      alignment:'left',
      color:'#090909',
      bold: true,
      absolutePosition: {x: 40, y: 800},
        },{
          text : rightText,
          fontSize : 12,
          margin:[0,0,25,0],
          alignment:'left',
          color:'#090909',
          bold: true,absolutePosition: {x: 500,y: 800},
        }],
  };
}
export const buildTitle = (level, text, isTocItem=true) =>{
  return {
    text:text,
    fontSize : level === 1 ? 18 : 14,
    margin:level===1? [10, 0, 0, 10] : [20,0,0, 15],
    color:'#c00000',
    decoration: 'underline',
    tocItem: isTocItem
  }
}
export const buildChart = (chart, size) => {

  if (chart === undefined) return null
  return {
    image:chart,
    margin : [0,0,0,10],
    width : size,
    alignment:'center',
  }
}
export const buildParagraph = (text, options = {fontSize:10, margin:[30,0,0,0], color:'#000'}) => {
  return {
    text:text,
    fontSize : options.fontSize,
    margin:options.margin,
    color: options.color,
  }
}

const computeTableColRowRatio = (length) =>{
  if(length % 2 !== 0) return 1;

  let PGCD = 2;
  for(let i=2; i < length/2; i++){
    if(length % i !== 0) continue;
    if (length/i < i) return PGCD;
    PGCD = i;
  }
}
/**
 * When we have an object of key values and we want to display them in a table
 * we will create a table that has one row, or split the values to create
 * a more compact table
 * the split should be done dynamically depending on the number of elements
 * @param {*} data data of table that consist of only one row, or an object of key values
 */
const buildOneRowTableBody = (data) =>{
  if (data.length <= 0) return []
  const keys = Object.keys(data[0]);
  const values = Object.values(data[0]);
  const ratio = computeTableColRowRatio(keys.length);

  let tableBody = []
  for(let i=0; i<keys.length; i+=ratio){
    let row = []
    for(let j=i; j < i+ratio; j++){
      row.push(keys[j]);
      row.push(values[j]);
    }
    tableBody.push(row);
  }
  return tableBody;
}
const getTableHeaders = (row) => {
  return Object.keys(row)
}
const buildSimpleTableBody = (data) =>{
  if (data.length <= 0) return []

  let tableBody = []
  const headers = getTableHeaders(data[0])
  tableBody.push(headers)

  data.forEach(row => {
    tableBody.push(Object.values(row));
  })
  return tableBody;
}

const buildGroupedTableBody = (data) => {
  if (data.length <= 1) return []
  let tableBody = [];
  const headers = getTableHeaders(data[1]);
  tableBody.push(headers);

  data.forEach(row => {
    if(row.title !== undefined) tableBody.push([{'colSpan':headers.length, 'text':row.title, alignment : 'center'}]);
    else tableBody.push(Object.values(row));
  })
  return tableBody;
}
export const buildTable = (data, type='simple') => {

  const tableBuilders = {
    'simple' : buildSimpleTableBody,
    'one_row' : buildOneRowTableBody,
    'grouped' : buildGroupedTableBody,
  }

  const table = {
    width: 'auto',
    table : {
      headerRows:1,
      body:tableBuilders[type](data)//type==='simple' ? buildSimpleTableBody(data) : buildOneRowTableBody(data),
      },
    layout: tablesLayouts[type]
  }

  return {
    // A workaround to center tables
    columns: [
      { width: '*', text: '' },
      table,
      { width: '*', text: '' }
    ],
    margin:[0,0,0,20]
  }

}


export const addElementToDoc = (doc, element, pageBreak = null) => {
  if (element === null || element === undefined) return
  doc.content.push({...element, pageBreak:pageBreak===null ? 'None':pageBreak});
}

export const createPage = (doc, content, report, pageNumber, totalPageNumber) =>{
  let header = buildPageHeader()
  let footer = buildPageFooter(`${report}`, `Page ${pageNumber} / ${totalPageNumber}`)

  addElementToDoc(doc, header)

  content.forEach(element => {
    addElementToDoc(doc, element)
  })
  addElementToDoc(doc, footer, pageNumber===totalPageNumber?null:'after')
}

export const downloadPDF = (doc, title) =>{
  pdfMake.createPdf(doc).download(`${title}.pdf`);
}

// ------------------------------------------- OLD FUNCTION RELATED TO DAILY AND WEEKLY--------------------------

export const pushTabToDoc = (doc, data, columns, widths) => {
  return doc.content.push({
    columns: [
      table(data, columns, widths)
    ], 
    margin: [90,20,0,0],
    alignment : 'center'
  });
}

export const buildTableBodyCustom = (data, columns) => {
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
            body: buildTableBodyCustom(data, columns)
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


export const createHeaderPage = (doc, options) =>{

  doc.content.push({
    columns: [
      options.bg,
      {
        text : options.title,
        fontSize : 36,
        absolutePosition: options.titlePosition,
        alignment:'center',
        color:'#c00000',
        bold: true,
      },
      {
        text : options.range,
        fontSize : 28,
        absolutePosition: options.datePosition,
        alignment:'center',
        color:'#00000',
        bold: true,
      }
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

  
export const singleTablePage = () =>{
  
} 
  
export const twoTablesPage = () =>{

} 
  
export const threeTablePage = () =>{

} 
  
export const statsTablePage = () =>{
  // for table that dont have headers like Data Recovery Stats

} 