import {getChartByContainerId ,exportCharts, createDoc, downloadPDF, createPage, buildTitle, buildChart, buildParagraph, logError, buildTable} from './utils';

let TOTAL_PAGES = '--TOTAL-PAGES--';

let items = {
    p : 0,
    img : 0,
}
const nextId = (item, newId=true) => {
    let id = newId===true ? items[item] += 1 : items[item];
    return item === 'img' ? `image-picker-${id}`  : `p-${id}`;
}

export const generateTrippingSpeed = (chartsToPrint, TrippingSpeedData) => {


    return new Promise((resolve, reject) => {
    
        items.p = 0
        items.img = 0
        if(chartsToPrint.length === 0){
            logError('No chart found');
            return;
        }
    
        let charts = chartsToPrint.map((chartDivId)=>getChartByContainerId(chartDivId));
        if(charts.length === 0){
            logError("Charts couldn't be loaded");
            return;
        }

        let doc = createDoc('A4', 'portrait', [15,20,0,10]);
        doc['footer'] = function(currentPage, pageCount){ return currentPage.toString() + ' of ' + pageCount;};

        let WELL = TrippingSpeedData.well || 'Well-Test';
        let TS_date = new Date()
        let displayedDate = TS_date.toLocaleDateString('en-us', {year:"numeric", month:"long"});

        exportCharts(charts)
            .then(response => {
                const [exportedCharts] = response;
                
                const title_margin = {margin:[10, 20, 0, 10]};

                const table_layout = {
                    fillColor: function (i, node, j) {
                        return (j%2===0) ? '#b8b8b8' : "#eeeeee"
                    },
                    hLineColor: function (i, node) {
                        return '#405CF0';
                    },
                    vLineColor: function (i, node) {
                        return '#405CF0';
                    },
                };

                let pageNumber = 1;
                let pageContent =[];



                pageContent =[{
                    columns: [
                        {
                            text : WELL,
                            font:'Arial',
                            fontSize : 32,
                            absolutePosition: {y : 200},
                            alignment:'center',
                            color:"#000000",
                        },
                        {
                            text : "RTOM Tripping Speed Report",
                            font:'Arial',
                            fontSize : 32,
                            absolutePosition: {y : 250},
                            alignment:'center',
                            color:'#000000',
                            bold: true,
                        },
                        {
                            text : displayedDate,
                            font:'Arial',
                            fontSize : 28,
                            absolutePosition: {y:300},
                            alignment:'center',
                            color:'#00000',
                            bold: true,
                        },
                        {
                            text:"This text is here to create a red box ",
                            fontSize : 36,
                            background:"#c00000",
                            absolutePosition: {y:395},
                            alignment:'center',
                            color:'#c00000',
                        },
                        {
                            text:"REAL TIME OPERATIONS MANAGEMENT",
                            font:'Arial',
                            fontSize : 24,
                            background:"#c00000",
                            absolutePosition: {y:400},
                            alignment:'center',
                            color:'#ffffff',
                        },
                       
                    ],
                  }]
                createPage(doc, pageContent, '',  pageNumber)





                let chart_index = -1;

                pageContent = [];
                pageContent.push(buildTitle(1, "Overview", false, title_margin));
                
                let overviewData = {};
                TrippingSpeedData['overview'].forEach(item=>{
                    overviewData[item.Attribute] = item.Value;
                } );
                pageContent.push(buildTable([overviewData], 'one_row', table_layout));
                
                pageContent.push(buildTitle(1, "Connection Time VS Tripping Time", false, title_margin));
                pageContent.push(buildChart(exportedCharts[chart_index+=1], 560, 1.2));
                createPage(doc, pageContent);          
                
                pageNumber += 1;
                pageContent = [];
                
                pageContent.push(buildTitle(1, "Connection Time per Stand", false, title_margin));
                pageContent.push(buildChart(exportedCharts[chart_index+=1], 560, 1.2));
                createPage(doc, pageContent);
                
                // ------------------ tripping speed per stand with DEPTH ----------------
                pageNumber += 1;
                pageContent = [];
                
                pageContent.push(buildTitle(1, "Tripping Speed per Stand", false, title_margin));
                pageContent.push(buildChart(exportedCharts[chart_index+=1], 560, 1.2));
                pageContent.push(buildTitle(1, "Abnormal Stands", false, title_margin));
                pageContent.push(buildTable(TrippingSpeedData['abnormal_stands']));
                createPage(doc, pageContent);
                
                pageNumber += 1;
                pageContent = [];
                
                pageContent.push(buildTitle(1, "Connection Time / Tripping Speed per Stand", false, title_margin));
                pageContent.push(buildChart(exportedCharts[chart_index+=1], 560, 1.2));
                
                pageContent.push(buildTitle(1, "KPI's", false, title_margin));
                pageContent.push(buildTable(TrippingSpeedData['kpi']));
                createPage(doc, pageContent);

                // replaceTotalPages(doc.content, pageNumber)
                
                downloadPDF(doc, `Tripping Speed Report`);
                resolve();
             }).catch(error => {
                reject(error);
            });

       
    
    })


    
}