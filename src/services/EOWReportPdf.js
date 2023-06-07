// Keep all the messy code here like creating options and parameters to pass to functions
// keep the functions in utils.js clean and standard. should work for any report not only weekly or daily...
// 

import {getChartByContainerId ,exportCharts, createDoc, downloadPDF, createPage, buildTitle, buildChart, buildParagraph, logError, buildTable} from './utils';

let TOTAL_PAGES = '--TOTAL-PAGES--';

const colors = {
    Low : "yellow",
    Medium : "orange",
    Major : "red",
}

const event_custom_layout ={
    fillColor: function (i, node, j) {
        if('colSpan' in node.table.body[i][0]) return '#999999'
        const severity = node.table.body[i][j].text
        if(['Low', 'Medium', 'Major'].includes(severity)) return colors[severity];
        else return (i === 0) ? '#F05C40' : (i%2===0) ? '#e8e8e8' : "#eeeeee"
    },
    hLineColor: function (i, node) {
    return '#F05C40';
    },
    vLineColor: function (i, node) {
    return '#F05C40';
    },
}
const team_members_layout = {
    vLineColor: function (i, node, j) {
        return (j>0 && i===1) ? '#000' : '#fff';
    },
    hLineColor: function (i, node) {
    return i===1 ? '#000' : '#fff';
    },
}

let items = {
    p : 0,
    img : 0,
}

const nextId = (item, newId=true) => {
    let id = newId===true ? items[item] += 1 : items[item];
    return item === 'img' ? `image-picker-${id}`  : `p-${id}`
}

const replaceTotalPages = (docContent, total) => {
    docContent.forEach((item, i) =>{
        if(!('columns' in item)) return;
        if (item.columns.length <2) return;
        if (!('text' in item.columns[1])) return;
        item.columns[1].text = item.columns[1].text.replace('--TOTAL-PAGES--', total)
    })
}

const buildTeamTable = (paragraph) => {
    let [ose, teamLeaders] = paragraph.split('\n')
    ose = ose.replace(/,/g, '\nOSE : ')
    teamLeaders= teamLeaders.replace(/,/g, '\nTeam Leader : ')
    const table = {
        table : {
        headerRows:1,
        widths:[150, 300],
        body:[
                [{text : 'Prepared by', alignment:'left', font:'Arial', fontSize:16, colSpan:2}, {}],
                [{}, {text:ose, font:'Arial', fontSize : 14, color: "#F05C40",fillColor:'#f3eeee', alignment : 'left'}],
                [{}, {text:'filler', fontSize : 12, color: "#fff",fillColor:'#fff', alignment : 'left'}],
                [{}, {text:teamLeaders, font:'Arial', fontSize : 14, color: "#F05C40",fillColor:'#f3eeee', alignment : 'left'}],
            ],
        },
        layout:team_members_layout,
    }
      return table

}

export const generateEOWR = (chartsToPrint, images, EOWRData, paragraphes) => {
    items.p = 0
    items.img = 0

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

    let end_of_well_date = new Date(EOWRData['end_of_well_date']) || new Date()
    let displayedDate = end_of_well_date.toLocaleDateString('en-us', {year:"numeric", month:"long"});
    
    let doc = createDoc('A4', 'portrait', [15,20,0,10]);

    let pageNumber = 1;

    // ----------------------------------------Cover page----------------------------------------
    let pageContent =[{
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
                text : "RTOM End Of Well Report",
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
            {
             columns: [  
                buildTeamTable(paragraphes['team-members']),
                ],
                absolutePosition: {x:50, y:580},
            }
        ],
      }]
    createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES)
      
    // ----------------------------------------Table of content ----------------------------------------
    pageNumber += 1;
    pageContent = []
    pageContent.push(buildTitle(1, "TABLE OF CONTENT", false))
    pageContent.push({toc: { title: null , font:'Arial'}, margin:[40,0,40,0]})
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
        pageContent.push(buildTable(EOWRData['rig_performance'], undefined, [150, 150, 100, 100]));

        const data = EOWRData['rig_performance'][0]
        if (data !== undefined){
            const plan = data['Planned days']
            const actual = data['Actual days']
            const gainLoss = data['Gained']
            const npt  = data['NPT']

            let last_sentence = gainLoss < 0 ? ` and ${Math.abs(gainLoss)-npt} days are considered as ILT (invisible lost time)`:''
            let text = `The drilling and well completion plan was estimated at ${plan} days, and the well was completed over ${actual} days. 
            The total number of days ${gainLoss>0 ? 'gained' : 'lost'} is calculated at ${Math.abs(gainLoss)} days, which represents (${Math.abs(gainLoss)/plan*100}%) of the 
            planned well, where ${npt} days are confirmed as NPT${last_sentence}.`
            pageContent.push(buildParagraph(text));
        }
        
        pageContent.push(buildTitle(2, "2. Progress chart"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 470));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 470));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        // ----------------------------------------Time Distribution && Well Activity----------------------------------------
        pageNumber += 1;
        pageContent = []
        pageContent.push(buildTitle(2, "3. Time Distribution"));
        pageContent.push(buildTable(EOWRData['time_distribution']['time_distribution']));
        pageContent.push(buildTitle(2, "4. Well Activity"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 470));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        // ----------------------------------------Time Distribution per phase && NPT analysis----------------------------------------
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(2, "5. Time Distribution per phase"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 470));
        
        pageContent.push(buildTitle(1, "III. NPT Analysis"));
        pageContent.push(buildTitle(2, "1. PT VS NPT"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 470));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        // ---------------------------------------- NPT vs section && NPT vs category----------------------------------------
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(2, "2. NPT VS Section"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 470));
        pageContent.push(buildTitle(2, "3. NPT VS Category"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 470));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        // ---------------------------------------- NPT vs section && NPT vs category----------------------------------------
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(2, "4. NPT VS Sub-category"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 470));
        pageContent.push(buildTitle(2, "5. NPT Details"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 400));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);

        // ---------------------------------------- NPT vs section && NPT vs category----------------------------------------
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(2, "6. NPT VS Service company"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 400));
        pageContent.push(buildTitle(2, "7. NPT Down hole problems"));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 400));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        
        
        // ---------------------------------------- Drilling & Tripping Connection Time KPI's ----------------------------------------
        pageNumber += 1;
        pageContent = [];
        if(EOWRData['connection_details']['drill_time'].length > 3){
            pageContent.push(buildTitle(1, "IV. Drilling & Tripping Connection Time KPI's"));
            pageContent.push(buildTable(EOWRData['connection_details']['drill_time'], 'grouped', event_custom_layout));
        }
        if(EOWRData['connection_details']['tripping_time']['pooh'].length > 3){
            pageContent.push(buildTitle(2, "1. Tripping out and Connection Time KPI's"));
            pageContent.push(buildTable(EOWRData['connection_details']['tripping_time']['pooh'], 'grouped', event_custom_layout));
        }
        if(EOWRData['connection_details']['tripping_time']['rih'].length > 3){
            pageContent.push(buildTitle(2, "2. Tripping In and Connection Time KPI's"));
            pageContent.push(buildTable(EOWRData['connection_details']['tripping_time']['rih'], 'grouped', event_custom_layout));
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

        const NA_text = {
            text:'N/A',
            fontSize : 18,
            alignment : 'center'
        }
        let p = paragraphes[nextId('p')] === '' ? NA_text : paragraphes[nextId('p', false)]
        pageContent.push(buildParagraph(p));

        pageContent.push(buildTitle(2, "2. Intervenion and mitigation plan"));
        p = paragraphes[nextId('p')] === '' ? NA_text : paragraphes[nextId('p', false)]
        pageContent.push(buildParagraph(p));
        
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        
        // ---------------------------------------- Section Summary ----------------------------------------
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(1, "VI. Section Summary"));
        EOWRData['section_summary']?.map((section, index)=> {
            const title_3_style = {alignment:'center', color:'#F05C40', bold:true, decoration:''}
            pageContent.push(buildTitle(2, `${index+1}. ${section['Hole Section']}`));

            pageContent.push(buildTitle(3, "Section Overview", false, title_3_style));
            const {description, ...section_param} = section;
            pageContent.push(buildTable([section_param], 'one_row'));
            
            pageContent.push(buildTitle(3, "Operation summary & Results", false, title_3_style));
            pageContent.push(buildParagraph(description));
            
            createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
            
            const run_casing_img = images[nextId('img')];
            const ream_backream_img = images[nextId('img')];
            if (run_casing_img || ream_backream_img){
                pageNumber += 1;
                pageContent = [];
                pageContent.push(buildTitle(3, "Run Casing (Broomsticks)", false, title_3_style));
                pageContent.push(buildChart(run_casing_img, 400))
                
                pageContent.push(buildTitle(3, "Ream & Back Ream Interval", false, title_3_style));
                pageContent.push(buildChart(ream_backream_img, 400))
                
                createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
            }
            pageNumber += 1;
            pageContent = [];
            return null
        })
        
        pageContent = [];
        pageContent.push(buildTitle(1, "VII. Conclusion"));
        pageContent.push(buildParagraph(paragraphes[nextId('p')]));
        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        // ---------------------------------------- APPENDIX ----------------------------------------
        
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(1, "VIII. Appendix"));
        pageContent.push(buildTitle(2, "1. Drilling Events Captured", false));

        /***this table can be very large, so we devide it manualy in order to keep track of page numbers
         * max number of lines is set to 12
         * if the last chunk of data and the next data (events caused npt) can fit in the same page (plus title)
         * we add them to the same page, else we create a separate page for the next data
         * event caused npt is usually a small table (can fit in one page), so no need to do the same thing to it
         */

        const n_lines_per_page = 20;
        const events_len = EOWRData['drilling_events_kpi']['events_kpi_res'].length;
        const events_caused_len = EOWRData['drilling_events_kpi']['events_caused_npt_res'].length;
        const  n_parts = Math.ceil(events_len / n_lines_per_page);
        const last_chunk_len = events_len % n_lines_per_page;
        const put_in_same_page = (last_chunk_len + events_caused_len) <= (n_lines_per_page - 2); //we leave 2 lines worth of space for the title
        
        for (let i = 0; i < n_parts; i += 1) {
            pageContent.push(buildTable(EOWRData['drilling_events_kpi']['events_kpi_res'].slice(i*n_lines_per_page, i*n_lines_per_page + n_lines_per_page), 'grouped', event_custom_layout));
            
            if (i === (n_parts-1) && put_in_same_page){ //last part of data and there is enough space
                pageContent.push(buildTitle(2, "2. Drilling Events Caused NPT", false));
                pageContent.push(buildTable(EOWRData['drilling_events_kpi']['events_caused_npt_res'], 'grouped', event_custom_layout));
            }
            createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
            pageNumber += 1;
            pageContent = [];
        }
        if(put_in_same_page === false){
            pageContent.push(buildTitle(2, "2. Drilling Events Caused NPT", false));
            pageContent.push(buildTable(EOWRData['drilling_events_kpi']['events_caused_npt_res'], 'grouped', event_custom_layout));
            createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        }
        else{
            pageNumber -= 1;
        }
        
        pageNumber += 1;
        pageContent = [];
        pageContent.push(buildTitle(2, "3. Drilling Events Category", false));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 470));
        
        pageContent.push(buildTitle(2, "4. Drilling Events Sub-category", false));
        pageContent.push(buildChart(exportedCharts[chart_index+=1], 470));

        createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
        
        // ---------------------------------------- Ream & back ream ----------------------------------------
        
        
        pageContent = [];
        pageContent.push(buildTitle(1, "IX. Ream & Back Ream", false));
        EOWRData['section_summary']?.map((section, index)=> {
            
            const ream_backream_img_1 = images[nextId('img')]
            const ream_backream_img_2 = images[nextId('img')]
            const ream_backream_img_3 = images[nextId('img')]
            const ream_backream_img_4 = images[nextId('img')]
            
            if(ream_backream_img_1 || ream_backream_img_2){
                pageContent.push(buildTitle(3,`${section['Hole Section']}`, false));
                pageContent.push(buildChart(ream_backream_img_1, 500))
                pageContent.push(buildChart(ream_backream_img_2, 500))
                pageNumber += 1;
                createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);
    
                pageContent = [];
            }

            if(ream_backream_img_3 || ream_backream_img_4){
                pageContent.push(buildChart(ream_backream_img_3, 500))
                pageContent.push(buildChart(ream_backream_img_4, 500))
                pageNumber += 1;
                createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES);

                pageContent = [];
            }
            return null;
        })
        
        // ---------------------------------------- Ream & back ream ----------------------------------------
        const bit_record_img = images[nextId('img')]
        if (bit_record_img){
            pageNumber += 1;
            pageContent = [];
            pageContent.push(buildTitle(1, "X. Bit Record", false));
            pageContent.push(buildChart(bit_record_img, 500))
            createPage(doc, pageContent, `${WELL} - End Of Well Report`, pageNumber, TOTAL_PAGES, "landscape");
        }

        replaceTotalPages(doc.content, pageNumber)
        
        downloadPDF(doc, `EOWR_${WELL}`);
    })
    
    
}