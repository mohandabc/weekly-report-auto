/*******************************************************************************
 *                    GENERATING THE DAILY PDF REPORT HERE                     *
 * IF YOU WANT TO ADD ANY HELPER FUNCTIONS IN ORDER TO BETTER GENERATE THE PDF *
 *     PLEASE ADD THEM IN SERVICES/UTILS.JS TO KEEP THE PROJECT STRUCTURE      *
 *******************************************************************************/

import { BACKGROUND } from '../constants/backgrounds';
import {getChartByContainerId ,exportCharts, setupNewPage, createHeaderPage, createLastPage, addChartToPDF, createDoc, downloadPDF} from './utils';

export const generateWeeklyReport = (chartsToPrint, weeklyData, range) =>{
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
    
          var doc= createDoc('A4', 'landscape', [15,20,0,10]);
          
          const displayedDate=`From ${range.split(" - ")[0]} To ${range.split(" - ")[1]}`
          const headerOptions = {
            title:"BO Weekly Report",
            range:displayedDate,
            bg: {image: BACKGROUND,
              margin:[-15,-20,0,-10],
              width: 842},
            titlePosition: {y: 236},
            datePosition: {y: 280},
          }

          createHeaderPage(doc, headerOptions);
          createAgendaPage(doc);

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
          
          setupNewPage(doc,  "- In Progress Archived Well Recovery :");
          addChartToPDF(doc, exportedCharts[10])

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

          if (!weeklyData['jira_data'].length) setupNewPage(doc, "- DevTasks  :", ...[,,,,,], true, "Connectivity Issue, Couldn't Get Data from Jira's Server"); else 
          setupNewPage(doc, "- DevTasks :", weeklyData['jira_data'], ['Issue','Summary','Issue Type','Assigned To','Status','Priority']);


          createLastPage(doc);

          downloadPDF(doc, `Weekly_report_${range}`);
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
                    {text:'Deployments and Relocations', listType: 'square', bold: true},
                    {text:'Wells spud', listType: 'square', bold: true},
                    {text:'Rib-box maintenance', listType: 'square', bold: true},
                    {text:'NDJ jobs', listType: 'square', bold: true},
                    {
                      markerColor:'grey',
                      ul: [
                        {text:'Extra jobs cementing', listType: 'circle'},
                        {text:'Extra jobs MWD', listType: 'circle'},
                      ]
                    },   
                    {text:'Data Recovery', listType: 'square', bold: true},
                    {
                      markerColor:'grey',
                      ul: [
                        {text:'Weekly Recovery', listType: 'circle'},
                        {text:'Global Recovery', listType: 'circle'},
                        {text:'In Progress Archived Well Recovery', listType: 'circle'},
                      ]
                    },
                    {text:'Data quality', listType: 'square', bold: true},
                    {
                      markerColor:'grey',
                      ul: [
                        {text:'Pending quality tickets', listType: 'circle'},
                        {text:'Resolved quality tickets', listType: 'circle'},
                        {text:'Pending quality channels', listType: 'circle'},
                        {text:'Resolved quality channels', listType: 'circle'},
                        {text:'Resolved quality by user', listType: 'circle'},
                      ]
                    },
                    {text:'Helpdesk Tickets', listType: 'square', bold: true},
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
          paddingRight: function(i, node) { return 300; },
        },
      },
      ],
        margin: [100,0,0,0],
        fontSize: 18,          
    });
  }