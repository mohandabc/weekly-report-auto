// Keep all the messy code here like creating options and parameters to pass to functions
// keep the functions in utils.js clean and standard. should work for any report not only weekly or daily...
// 

import {getChartByContainerId ,exportCharts, setupNewPage, createHeaderPage, createLastPage, addChartToPDF, createDoc, downloadPDF} from './utils';
import {BACKGROUND,LASTPAGE,TOPLEFT} from '../constants/backgrounds'


export const generateEOWR = (chartsToPrint, images, EOWRData, paragraphes) => {
    console.log(EOWRData)
    if(chartsToPrint.length === 0){
        return;
    }
  
    let charts = chartsToPrint.map((chartDivId)=>getChartByContainerId(chartDivId));
    if(charts.length === 0){
        return;
    }

    let displayedDate = new Date().toLocaleDateString('en-us', {year:"numeric", month:"long"});
    
    exportCharts(charts)
    .then(response => {
        const [exportedCharts] = response; 

        var doc = createDoc('A4', 'portrait', [15,20,0,10]);
        
        const headerOptions = {
            orientation:"portrait",
            title : "End Of Well Report",
            range:displayedDate,
            bg: {},
            titlePosition: {y: 100},
            datePosition: {y: 150},
        } 
        createHeaderPage(doc, headerOptions);

        
        setupNewPage(doc, "I.  Global overview");
        addChartToPDF(doc, exportedCharts[0]);
        addChartToPDF(doc, images[0]);

        downloadPDF(doc, `EOWR_${EOWRData['well_name']}`)
    })

}