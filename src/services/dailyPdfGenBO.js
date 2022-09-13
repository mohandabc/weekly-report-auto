
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import {getChartByContainerId ,exportCharts, setupNewPage, createHeaderPage, createPlainTextPage, createLastPage, addChartToPDF} from './utils';

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
          createHeaderPage(doc, range, "BO Daily Report", 'daily');

          
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
          addChartToPDF(doc, exportedCharts[0]);
          setupNewPage(doc, "- Data Quality :");
          addChartToPDF(doc, exportedCharts[1]);
          setupNewPage(doc, "- Reservoir Tickets :", dailyData['reservoir_tickets'], ['Rig', 'Well', 'Phase', 'Stage', 'Channels']);}}

          
          if (dailyData['data_loss'][0]['Total Tickets Resolved'][0]==0 && dailyData['data_loss'][0]['Gap to Total Ratio'][0]==0 ) {
            setupNewPage(doc, "- Data Loss  :", ...[,,,,,], true, "No Resolved Loss Tickets Today.");
          } else {setupNewPage(doc, "- Data Loss Stats :");
          createPlainTextPage(doc, dailyData['data_loss'][0]['Total Tickets Resolved'], dailyData['data_loss'][0]['Gap to Total Ratio'], 'Total tickets resolved Today', 'Gap/TotalGap ratio for Today')
          setupNewPage(doc, "- Data Loss :");
          addChartToPDF(doc, exportedCharts[2]);
          setupNewPage(doc, "- Data Loss :");
          addChartToPDF(doc, exportedCharts[3]);}

          
          if (dailyData['data_recovery'][0]['Total Tickets Resolved'][0]==0 && dailyData['data_recovery'][0]['Gap to Total Ratio'][0]==0 ) {
            setupNewPage(doc, "- Data Recovery  :", ...[,,,,,], true, "No Resolved Recovery Tickets Today.");
          } else {setupNewPage(doc, "- Data Recovery Stats :");
          createPlainTextPage(doc, dailyData['data_recovery'][0]['Total Tickets Resolved'], dailyData['data_recovery'][0]['Gap to Total Ratio'], 'Total tickets resolved Today', 'Gap/TotalGap ratio for Today')
          setupNewPage(doc, "- Data Recovery :");
          addChartToPDF(doc, exportedCharts[4]);
          setupNewPage(doc, "- Data Recovery :");
          addChartToPDF(doc, exportedCharts[5]);}

          
          if (!dailyData['deployements_and_interventions'].length) setupNewPage(doc, "- Deployments and Interventions  :", ...[,,,,,], true, "No Deployments/Intervations Today."); else {
            setupNewPage(doc, "- Deployments and Interventions :", dailyData['deployements_and_interventions'], ['rig','well','activity','status','distance']);
            setupNewPage(doc, "- D/I :");
            addChartToPDF(doc, exportedCharts[6]);
          }

          createLastPage(doc);

        pdfMake.createPdf(doc).download(`Daily_report_${range}.pdf`);

      });
  }