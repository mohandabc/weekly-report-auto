/*******************************************************************************
 *                    GENERATING THE DAILY PDF REPORT HERE                     *
 * IF YOU WANT TO ADD ANY HELPER FUNCTIONS IN ORDER TO BETTER GENERATE THE PDF *
 *     PLEASE ADD THEM IN SERVICES/UTILS.JS TO KEEP THE PROJECT STRUCTURE      *
 *******************************************************************************/

import { BACKGROUND } from '../constants/backgrounds';
import {getChartByContainerId ,exportCharts, setupNewPage, createHeaderPage, createStatsTablePage, createLastPage, addChartToPDF, createDoc, downloadPDF} from './utils';

export const generateDailyReport = (chartsToPrint, dailyData, range) =>{
  return new Promise((resolve, reject) => {
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

          var doc=createDoc('A4', 'landscape', [15,20,0,10]) 

          var displayedDate=new Date(range.split(" - ")[0]);
          displayedDate.setDate(displayedDate.getDate()+1);
          displayedDate=displayedDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});

          const headerOptions = {
            title:"BO Daily Report",
            range:displayedDate,
            bg: {image: BACKGROUND,
              margin:[-15,-20,0,-10],
              width: 842},
            titlePosition: {y: 236},
            datePosition: {y: 280},
          }
          createHeaderPage(doc, headerOptions);
          createAgendaPage(doc);
          
          setupNewPage(doc, "- Extra jobs status :", dailyData['extra_jobs_n'], ['Extra Job Transmitted','Extra Job  Not Transmitted','Extra Job Not Completed'],dailyData['extra_jobs'], ['NDJ Name','Well','Rig','NDJ Result','RootCause']);
          setupNewPage(doc, "- Wells spud :", dailyData['wells_spud'], ["Spudded Wells"]);

          
          if (dailyData['data_quality'][0]['Tickets Resolved'][0]==0 && dailyData['data_quality'][0]['Channels Resolved'][0]==0 ) {
            setupNewPage(doc, "- Data Quality  :", ...[,,,,,], true, "No Resolved Quality Tickets Today.");
            setupNewPage(doc, "- Data Quality :");
            addChartToPDF(doc, exportedCharts[0]);
            setupNewPage(doc, "- Reservoir Tickets :", dailyData['reservoir_tickets'], ['Rig', 'Well', 'Phase', 'Stage', 'Channels']);
          } else {
          setupNewPage(doc, "- Data Quality Stats :");
          createStatsTablePage(doc, dailyData['data_quality'][0]['Tickets Resolved'], dailyData['data_quality'][0]['Channels Resolved'], 'Total tickets resolved Today', 'Total channels resolved Today')
          if (!dailyData['resolved_Q_tickets_channels'].length) setupNewPage(doc, "- Data Quality  :", ...[,,,,,], true, "No Resolved Quality Tickets Today."); else {
          setupNewPage(doc, "- Data Quality :");
          addChartToPDF(doc, exportedCharts[0]);
          setupNewPage(doc, "- Data Quality :");
          addChartToPDF(doc, exportedCharts[1]);
          setupNewPage(doc, "- Reservoir Tickets :", dailyData['reservoir_tickets'], ['Rig', 'Well', 'Phase', 'Stage', 'Channels']);}}

          
          if (dailyData['data_loss'][0]['Total Tickets Resolved'][0]==0 && dailyData['data_loss'][0]['Gap to Total Ratio'][0]==0 ) {
            setupNewPage(doc, "- Data Loss  :", ...[,,,,,], true, "No Resolved Loss Tickets Today.");
          } else {setupNewPage(doc, "- Data Loss Stats :");
          createStatsTablePage(doc, dailyData['data_loss'][0]['Total Tickets Resolved'], dailyData['data_loss'][0]['Gap to Total Ratio'], 'Total tickets resolved Today', 'Gap/TotalGap ratio for Today')
          setupNewPage(doc, "- Data Loss :");
          addChartToPDF(doc, exportedCharts[2]);
          setupNewPage(doc, "- Data Loss :");
          addChartToPDF(doc, exportedCharts[3]);}

          
          if (dailyData['data_recovery'][0]['Total Tickets Resolved'][0]==0 && dailyData['data_recovery'][0]['Gap to Total Ratio'][0]==0 ) {
            setupNewPage(doc, "- Data Recovery  :", ...[,,,,,], true, "No Resolved Recovery Tickets Today.");
          } else {setupNewPage(doc, "- Data Recovery Stats :");
          createStatsTablePage(doc, dailyData['data_recovery'][0]['Total Tickets Resolved'], dailyData['data_recovery'][0]['Gap to Total Ratio'], 'Total tickets resolved Today', 'Gap/TotalGap ratio for Today')
          setupNewPage(doc, "- Data Recovery :");
          addChartToPDF(doc, exportedCharts[4]);
          setupNewPage(doc, "- Data Recovery :");
          addChartToPDF(doc, exportedCharts[5]);}

          
          if (!dailyData['deployements_and_interventions'].length) setupNewPage(doc, "- Deployments and Interventions  :", ...[,,,,,], true, "No Deployments/Intervations Today."); else {
            setupNewPage(doc, "- Deployments and Interventions :", dailyData['deployements_and_interventions'], ['rig','well','activity','status','distance']);
            setupNewPage(doc, "- D/I :");
            addChartToPDF(doc, exportedCharts[6]);
          }

          if (!dailyData['jira_data'].length) setupNewPage(doc, "- DevTasks  :", ...[,,,,,], true, "Connectivity Issue, Couldn't Get Data from Jira's Server."); else 
          setupNewPage(doc, "- DevTasks :", dailyData['jira_data'], ['Issue','Summary','Issue Type','Assigned To','Status','Priority']);
          createLastPage(doc);

          downloadPDF(doc, `Daily_report_${range}`)
          resolve(); // Resolve the Promise when PDF generation is completed
        }).catch(error => {
            reject(error);
        });
      });
  }

export const createAgendaPage = (doc) =>{
  setupNewPage(doc, "- Agenda :");
    doc.content.push({
      columns: [{
          style: 'tableExample',
          table:{
          body: [
              [{
                markerColor:'#C00000',
                ul: [
                  {text:'Extra Jobs', listType: 'square', bold: true},
                  {
                    markerColor:'grey',
                    ul: [
                      {text:'Extra jobs stats', listType: 'circle'},
                      {text:'NDJs', listType: 'circle'},
                    ]
                  },
                  {text:'Wells spud', listType: 'square', bold: true},
                  {text:'Data quality', listType: 'square', bold: true},
                  {
                    markerColor:'grey',
                    ul: [
                      {text:'Data quality stats', listType: 'circle'},
                      {text:'Pending quality tickets', listType: 'circle'},
                      {text:'Resolved quality tickets and channels', listType: 'circle'},
                      {text:'Reservoir tickets', listType: 'circle'},
                    ]
                  },
                  {text:'Data loss', listType: 'square', bold: true},
                  {
                    markerColor:'grey',
                    ul: [
                      {text:'Data loss stats', listType: 'circle'},
                      {text:'Resolved loss tickets and gaps', listType: 'circle'},
                      {text:'Resolved loss tickets by rootcauses', listType: 'circle'},
                    ]
                  },
                  {text:'Data Recovery', listType: 'square', bold: true},
                  {
                    markerColor:'grey',
                    ul: [
                      {text:'Data recovery stats', listType: 'circle'},
                      {text:'Resolved recovery tickets and gaps', listType: 'circle'},
                      {text:'Resolved recovery tickets by rootcauses', listType: 'circle'},
                    ]
                  },
                  {text:'Deployments and interventions', listType: 'square', bold: true,},
                  {text:'Development Tasks', listType: 'square', bold: true,},
                ],
              fillColor:'#e6e6e6'},],
      ],},
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
        paddingTop: function(i, node) { return 20; },
        paddingBottom: function(i, node) { return 20; },
        paddingLeft: function(i, node) { return 60; },
        paddingRight: function(i, node) { return 210; },
      },
    },
    ],
      margin: [90,-20,0,0],
      fontSize: 18,          
  });
}