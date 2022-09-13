
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import {getChartByContainerId ,exportCharts, setupNewPage, createHeaderPage, createLastPage, addChartToPDF} from './utils';

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

          createHeaderPage(doc, range, "BO Weekly Report", 'weekly');

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