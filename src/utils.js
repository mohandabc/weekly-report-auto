
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import html2canvas from 'html2canvas';

const getChartByContainerId = (id) => {
  var charts = am4core.registry.baseSprites;
  for(var i = 0; i < charts.length; i++) {
    if (charts[i].svgContainer.htmlElement.id === id) {
      return charts[i];
    }
  }
}

export const generatePDF = (chartsToPrint, tablesToPrint) =>{
    if(chartsToPrint.length === 0){
      return;
    }

    let charts = chartsToPrint.map((chartDivId)=>getChartByContainerId(chartDivId));
    if(charts.length === 0){
      return;
    }

    let promises_list = charts.map((chart) => chart.exporting.getImage("png"));
    const nbr_charts = promises_list.length;
    let tables_promesses = tablesToPrint.map(table => html2canvas(document.getElementById(table)));
    promises_list = [charts[0].exporting.pdfmake, ...promises_list, ...tables_promesses];

    Promise.all(promises_list).then(function (res) {
        var pdfMake=res[0];
        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        var doc={
          pageSize: "A4",
          pageOrientation: "portrait",
          pageMargins: [15,20,0,10],
          content: [],  
          };
        res.slice(1,nbr_charts+1).forEach((chart)=>{
          doc.content.push({
            image:chart,
            margin : [5,5,0,0],
            width : 400,
          })
        });

        res.slice(nbr_charts+1).forEach((table)=>{
          doc.content.push({
            image:table.toDataURL("image/png"),
            margin : [5,5,0,0],
            width : 250,
          })
        });

        
       
        pdfMake.createPdf(doc).download("daily.pdf");
    });
  }

  