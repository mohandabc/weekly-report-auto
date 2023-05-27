// Keep all the messy code here like creating options and parameters to pass to functions
// keep the functions in utils.js clean and standard. should work for any report not only weekly or daily...
// 

import {getChartByContainerId ,exportCharts, setupNewPage, createHeaderPage, createLastPage, addChartToPDF, createDoc, downloadPDF, createPage, buildTitle, buildChart, buildParagraph, logError, buildTable} from './utils';
import {BACKGROUND,LASTPAGE,TOPLEFT} from '../constants/backgrounds'

let TOTAL_PAGES = 30;
let p = 0;
let img = 0;

const nextId = (item) => {
    let id = item === 'img' ? `image-picker-${img+=1}` : `p-${p+=1}`
    console.log(id)
    return id
}

export const generateEOWR = (chartsToPrint, images, EOWRData, paragraphes) => {
    p = 0;
    img=0;
    if(chartsToPrint.length === 0){
        logError('No chart found');
        return;
    }
    let WELL = EOWRData.well || 'Well-Test';
  
    let charts = chartsToPrint.map((chartDivId)=>getChartByContainerId(chartDivId));
    if(charts.length === 0){
        logError("Charts couldn't be loaded")
        return;
    }

    let displayedDate = new Date().toLocaleDateString('en-us', {year:"numeric", month:"long"});
    
    let doc = createDoc('A4', 'portrait', [15,20,0,10]);

    let pageNumber = 1;

    // ----------------------------------------Cover page----------------------------------------
    let pageContent =[{
        columns: [
            {
                text : WELL,
                fontSize : 32,
                absolutePosition: {y : 200},
                alignment:'center',
                color:"#000000",
            },
            {
                text : "RTOM End Of Well Report",
                fontSize : 32,
                absolutePosition: {y : 250},
                alignment:'center',
                color:'#000000',
                bold: true,
            },
            {
                text : displayedDate,
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
                fontSize : 24,
                background:"#c00000",
                absolutePosition: {y:400},
                alignment:'center',
                color:'#ffffff',
            }
        ],
      }]
    createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES)
      
    // ----------------------------------------Table of content ----------------------------------------
    pageNumber += 1;
    pageContent = []
    pageContent.push(buildTitle(1, "TABLE OF CONTENT", false))
    pageContent.push({toc: { title: null }, margin:[40,0,40,0]})
    createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES)

    // ----------------------------------------Well information----------------------------------------
    pageNumber += 1;
    pageContent = []
    pageContent.push(buildTitle(1, "I. Global Overview"))
    pageContent.push(buildTitle(2, "1. Well Information"))
    pageContent.push(buildChart(images[nextId('img')], 500))
    createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES)
    
    // ----------------------------------------Well architecture----------------------------------------
    pageNumber += 1;
    pageContent = []
    pageContent.push(buildTitle(2, "2. Well Architecture"))
    pageContent.push(buildChart(images[nextId('img')], 400))
    createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES)
    
    // ----------------------------------------Well location map----------------------------------------
    pageNumber += 1;
    pageContent = []
    pageContent.push(buildTitle(2, "3. Well Location Map"))
    pageContent.push(buildChart(images[nextId('img')], 500))
    createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES)
    
    // ----------------------------------------Well schematics----------------------------------------
    pageNumber += 1;
    pageContent = []
    pageContent.push(buildTitle(2, "4. Well Schematics"))
    pageContent.push(buildChart(images[nextId('img')], 550))
    createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES)

    // -------- From here we need the charts so we need to wait for them to be exported then continue building 
    exportCharts(charts)
    .then(response => { 
        const [exportedCharts] = response; 

        // use this instead of hard coding indexes, this means if charts are displayed in the right order in view, they will be correct here
        let chart_index = -1;

        // ----------------------------------------Rig performance && Progress chart----------------------------------------
        pageNumber += 1;
        pageContent = []
        pageContent.push(buildTitle(1, "II. Time Activity Breakdown"));
        pageContent.push(buildTitle(2, "1. Rig Time performance"));
        pageContent.push(buildTable(EOWRData['rig_performance']));

        const data = EOWRData['rig_performance'][0]
        if (data !== undefined){
            let text = `[text need correction about gained/lost/npt] The drilling and well completion plan was estimated at ${data['Planned days']} days, and the well was completed over ${data['Actual days']} days. 
            The total number of days lost is calculated at ${data['NPT']+data['Gained']} days, which represents (${(data['NPT']+data['Gained'])/data['Planned days']*100}%) of the 
            planned well, where ${data['NPT']} days are confirmed as NPT and ${data['Gained']} days are considered as ILT (invisible lost time).`
            pageContent.push(buildParagraph(text));
        }
        
        pageContent.push(buildTitle(2, "2. Progress chart"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 510));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 510));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        // ----------------------------------------Time Distribution && Well Activity----------------------------------------
        pageNumber += 1;
        pageContent = []
        pageContent.push(buildTitle(2, "3. Time Distribution"));
        pageContent.push(buildTable(EOWRData['time_distribution']['time_distribution']));
        pageContent.push(buildTitle(2, "4. Well Activity"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 510));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        // ----------------------------------------Time Distribution per phase && NPT analysis----------------------------------------
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(2, "5. Time Distribution per phase"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 510));
        
        pageContent.push(buildTitle(1, "III. NPT Analysis"));
        pageContent.push(buildTitle(2, "1. PT VS NPT"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 510));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        // ---------------------------------------- NPT vs section && NPT vs category----------------------------------------
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(2, "2. NPT VS Section"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 510));
        pageContent.push(buildTitle(2, "3. NPT VS Category"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 510));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        // ---------------------------------------- NPT vs section && NPT vs category----------------------------------------
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(2, "4. NPT VS Sub-category"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 510));
        pageContent.push(buildTitle(2, "5. NPT Details"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 510));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);

        // ---------------------------------------- NPT vs section && NPT vs category----------------------------------------
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(2, "6. NPT VS Service company"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 510));
        pageContent.push(buildTitle(2, "7. NPT Down hole problems"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 510));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        
        
        // ---------------------------------------- Drilling & Tripping Connection Time KPI's ----------------------------------------
        pageNumber += 1;
        pageContent = [];

        if(EOWRData['connection_details']['drill_time'].length > 3){
            pageContent.push(buildTitle(1, "IV. Drilling & Tripping Connection Time KPI's"));
            pageContent.push(buildTable(EOWRData['connection_details']['drill_time'], 'grouped'));
        }
        if(EOWRData['connection_details']['tripping_time']['pooh'].length > 3){
            pageContent.push(buildTitle(2, "1. Tripping out and Connection Time KPI's"));
            pageContent.push(buildTable(EOWRData['connection_details']['tripping_time']['pooh'], 'grouped'));
        }
        if(EOWRData['connection_details']['tripping_time']['rih'].length > 3){
            pageContent.push(buildTitle(2, "2. Tripping In and Connection Time KPI's"));
            pageContent.push(buildTable(EOWRData['connection_details']['tripping_time']['rih'], 'grouped'));
        }

        if(pageContent.length>0){ 
            createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        }
        else{
            pageNumber -= 1
        }
        
        
        // ---------------------------------------- Real Time Impact & Prevention ----------------------------------------
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(1, "V. Real Time Impact & Prevention"));
        pageContent.push(buildTitle(2, "1. High Value Intervention"));
        pageContent.push(buildParagraph(paragraphes[nextId('p')]));
        pageContent.push(buildTitle(2, "2. Intervention and mitigation plan"));
        pageContent.push(buildParagraph(paragraphes[nextId('p')]));
        
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        
        // ---------------------------------------- Section Summary ----------------------------------------
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(1, "VI. Section Summary"));
        EOWRData['section_summary']?.map((section, index)=> {
            const title_3_style = {alignment:'center', color:'white', background:'orange', decoration:''}
            pageContent.push(buildTitle(2, `${index+1}. ${section['Hole Section']}`));

            pageContent.push(buildTitle(3, "Section Overview", false, title_3_style));
            const {description, ...section_param} = section;
            pageContent.push(buildTable([section_param], 'one_row'));
            
            pageContent.push(buildTitle(3, "Operation summary & Results", false, title_3_style));
            pageContent.push(buildParagraph(description));
            
            createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
            
            pageNumber += 1;
            pageContent = [];
            pageContent.push(buildTitle(3, "Run Casing (Broomsticks)", false, title_3_style));
            pageContent.push(buildChart(images[nextId('img')], 500))
            
            pageContent.push(buildTitle(3, "Ream & Back Ream Interval", false, title_3_style));
            pageContent.push(buildChart(images[nextId('img')], 500))
            
            createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
            pageNumber += 1;
            pageContent = [];
            return null
        })
        
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(1, "VII. Conclusion"));
        pageContent.push(buildParagraph(paragraphes[nextId('p')]));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        // ---------------------------------------- APPENDIX ----------------------------------------
        
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(1, "VIII. Appendix"));
        pageContent.push(buildTitle(2, "1. Drilling Events Captured"));

        /***this table can be very large, so we devide it manualy in order to keep track of page numbers
         * max number of lines is set to 12
         * if the last chunk of data and the next data (events caused npt) can fit in the same page (plus title)
         * we add them to the same page, else we create a separate page for the next data
         * event caused npt is usually a small table (can fit in one page), so no need to do the same thing to it
         */

        const n_lines_per_page = 12;
        const events_len = EOWRData['drilling_events_kpi']['events_kpi_res'].length;
        const events_caused_len = EOWRData['drilling_events_kpi']['events_caused_npt_res'].length;
        const  n_parts = Math.ceil(events_len / n_lines_per_page);
        const last_chunk_len = events_len % n_lines_per_page;
        const put_in_same_page = (last_chunk_len + events_caused_len) <= 10;
        
        for (let i = 0; i < n_parts; i += 1) {
            pageContent.push(buildTable(EOWRData['drilling_events_kpi']['events_kpi_res'].slice(i*n_lines_per_page, i*n_lines_per_page + n_lines_per_page), 'grouped'));
            
            if (i === (n_parts-1) && put_in_same_page){ //last part of data and there is enough space
                pageContent.push(buildTitle(2, "2. Drilling Events Caused NPT"));
                pageContent.push(buildTable(EOWRData['drilling_events_kpi']['events_caused_npt_res'], 'grouped'));
            }
            createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
            pageNumber += 1;
            pageContent = [];
        }
        if(put_in_same_page === false){
            pageContent.push(buildTitle(2, "2. Drilling Events Caused NPT"));
            pageContent.push(buildTable(EOWRData['drilling_events_kpi']['events_caused_npt_res'], 'grouped'));
            createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        }
        
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(2, "3. Drilling Events Category"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 510));
        
        pageContent.push(buildTitle(2, "4. Drilling Events Sub-category"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 510));

        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        // ---------------------------------------- Ream & back ream ----------------------------------------
        
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(1, "IX. Ream & Back Ream"));
        EOWRData['section_summary']?.map((section, index)=> {
            pageContent.push(buildTitle(3,`${section['Hole Section']}`));

            pageContent.push(buildChart(images[nextId('img')], 500))
            pageContent.push(buildChart(images[nextId('img')], 500))
            createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);

            pageNumber += 1;
            pageContent = [];
            pageContent.push(buildChart(images[nextId('img')], 500))
            pageContent.push(buildChart(images[nextId('img')], 500))
            createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
            return null;
        })
        
        // ---------------------------------------- Ream & back ream ----------------------------------------
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(1, "X. Bit Record"));
        pageContent.push(buildChart(images[nextId('img')], 500))
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES, "landscape");


        


        downloadPDF(doc, `EOWR_${EOWRData.well}`);
    })
    
    
}