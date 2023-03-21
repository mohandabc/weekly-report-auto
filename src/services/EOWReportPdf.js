import {getChartByContainerId ,exportCharts, setupNewPage, createHeaderPage, createStatsTablePage, createLastPage, addChartToPDF} from './utils';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export const generateEOWR = (chartsToPrint, images, EOWRData) => {
    console.log(EOWRData)
    if(chartsToPrint.length === 0){
        return;
    }
  
    let charts = chartsToPrint.map((chartDivId)=>getChartByContainerId(chartDivId));
    if(charts.length === 0){
        return;
    }
      
   
    // exportCharts(charts)
    // .then(response => {
    //     const [exportedCharts] = response; 

    //     pdfMake.vfs = pdfFonts.pdfMake.vfs;
    //     var doc={
    //         pageSize: "A4",
    //         pageOrientation: "landscape",
    //         pageMargins: [15,20,0,10],
    //         content: [],  
    //         };
    //     setupNewPage(doc, "- Well:");
    //     addChartToPDF(doc, exportedCharts[0]);
    //     addChartToPDF(doc, images[0]);
    //     pdfMake.createPdf(doc).download(`EOWR_${EOWRData['well']}.pdf`);
    // })

}