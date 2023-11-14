import React, { useEffect } from 'react';
import { useState } from 'react';
import {useSetRecoilState} from 'recoil';

import {generateEOWR} from '../../services/EOWReportPdf';

import { ActionButton, ReportInputScreen, Chart, ImagePicker, Table, Paragraphe, MultiTable, Tabular, PDFButton} from '../../components';

import { getData } from '../../api/api';
import { DEFAULT_CONFIG_BAR_OPTIONS, runCasingMap, rbrIMap, holeSectionMap, bitRecordData} from '../../constants/constants';
import { API_URL, BACK_URL } from '../../constants/URI';
import { loaderIsHidden } from '../../shared/globalState';

export const EOWR = () => {
    const [EOWRData, setEOWRData] = useState({});
    const [TSTrippingKPI, setTSTrippingKPI] = useState({});

    const [chartsToPrint, setChartsToPrint] = useState([]);
    const [images, setImages] = useState({});
    const [paragraphes, setParagraphes] = useState({})
    const setIsHidden = useSetRecoilState(loaderIsHidden);

    const handleParagrapheSave = (id, text)=>{
        setParagraphes(current=>{
            let tmp = {...current};
            tmp[id] = text;
            return tmp;
        })
    }

    const readyData = (data) => {
        let resultData = []
        data.forEach(item =>{
            if ('value1' in item) {resultData.push({type : item.category, name : 'PT', count: item.value1})}
            if ('value2' in item) {resultData.push({type : item.category, name : 'NPT', count: item.value2})}
            });
        return resultData;
    }

    const getEowrData = (params) => {
        // API call to get data
        setIsHidden(false);
        const url = 'api/reports/eowr';
        getData(API_URL, url, params)
        .then(res=> {
            let data = res.result;
            console.log('teamspace data back', data);

            //@TODO this should be done in the controller, this is temporary
            data['npt_sections'] = readyData(data['npt_sections']);

            setEOWRData({...data} || {});
            setParagraphes({
                'p-1': cleanHTML(data['eowr_snags']['high_value_interventions']),
                'p-2': cleanHTML(data['eowr_snags']['prevention_mitigation']),
                'p-3': cleanHTML(data['eowr_snags']['conclusion']),
                'team-members': formatEmployees(data['eowr_snags']['team_members']) || "Not specified"
            });

        });

        // Get Tripping speed data from fastAPI
        const eowr_endpoint = 'TrippingSpeed/getEOWRData/';
        getData(BACK_URL, eowr_endpoint, params)
        .then(res=> {
            console.log('oilport backend data back', res);
            setTSTrippingKPI(res || {});
        });
        setIsHidden(true);
    }
    
    useEffect(()=>{
        const mainSection = document.getElementById('result-section');
        mainSection?.scrollIntoView({behavior: "smooth"});
    });

    let chartsIds = [];

    let divNumber = 0;
    const getDivId = (type) => {
        divNumber +=1;
        let divId = `${type}-div-${divNumber}`;
        if (type === 'chart'){
            chartsIds = [...chartsIds, divId];
        }
        return divId;

    }

    useEffect(()=>{
        // console.log({images})
        setChartsToPrint(chartsIds);
    }, [EOWRData])

    const EOWR_CONFIG_BAR_OPTIONS = {...DEFAULT_CONFIG_BAR_OPTIONS, well:true, datePicker:false}

    if (Object.keys(EOWRData).length !==0) {
        // console.log({EOWRData})
        // console.log({paragraphes})
        // This processing is to prepare the data with some additional formatting
        let array1 = EOWRData?.connection_details?.drill_time;
        let array2 = EOWRData?.connection_details?.on_bottom;
        
        if (array1 && array2) {
            for (let i = 1; i < array1.length; i++) {
                let phase = array1[i].Phase;
                if (phase) {
                    let matchingObj = array2.find(obj => obj.Phase === phase);
                    if (matchingObj) {
                        array1[i]['On Bottom'] = matchingObj['On Bottom'];
                    }else{
                        array1[i]['On Bottom'] = '-'
                    }
                }
            }
        } else {
            console.error("drill_time or on_bottom is undefined")
        }
    }

    let items = {
        p : 0,
        img : 0,
    }
    const nextId = (item, newId=true) => {
        let id = newId===true ? items[item] += 1 : items[item];
        return item === 'img' ? `image-picker-${id}`  : `p-${id}`
    }

    function cleanHTML(html) {
        if (!html) {
          return "Not specified";
        }
        
        const parser = new DOMParser();
        const tmp = parser.parseFromString(html, 'text/html');
        const textContent = tmp.body.textContent || tmp.body.innerText;
        const cleanedText = textContent.trim();
        return cleanedText;
      }
      
      function formatEmployees(data) {
        const oseEmployees = data?.ose?.map(name => `${name}`) || ["Not specified"];
        const tlEmployees = data?.tl?.map(name => `${name}`) || ["Not specified"];
        const oseOutput = `OSEs:\n${oseEmployees.join('\n')}`;
        const tlOutput = `Team Leaders:\n${tlEmployees.join('\n')}`;
      
        return `${oseOutput}\n\n${tlOutput}`;
      }

    return (
        <div className="App">
            <ReportInputScreen 
                    title="End Of Well Report"
                    configBarAction = {getEowrData} 
                    options = {EOWR_CONFIG_BAR_OPTIONS}>
            </ReportInputScreen>

           {Object.keys(EOWRData).length === 0?
           <></>
           :
           <div id="result-section" className={`bg-slate-300 dark:bg-zinc-900`}>
                <div className='flex flex-row-reverse sticky top-14 px-10 py-4  z-40'>
                    <PDFButton className=" bg-green-500 hover:bg-green-700 text-black font-bold text-base py-2 px-4 rounded" 
                                    text="PDF" 
                                    action={generateEOWR} 
                                    args={[chartsToPrint, images, EOWRData, paragraphes]}
                                    >
                    </PDFButton>
                </div>

                <span className='text-xl px-4'>I. Global overview</span>
                <section className={`align-middle grid grid-col-2 xl:grid-cols-4 gap-4 place-items-top px-2 pb-4`} >
                    <ImagePicker id={nextId('img')} title="1 - Well Information" setImages = {setImages} imageData={EOWRData['eowr_snags']['well_information']} ></ImagePicker>
                    <ImagePicker id={nextId('img')} title="2 - Well Architecture" setImages = {setImages} imageData={EOWRData['eowr_snags']['well_architecture']}></ImagePicker>
                    <ImagePicker id={nextId('img')} title="3 - Well Location Map" setImages = {setImages} imageData={EOWRData['eowr_snags']['well_location_map']}></ImagePicker>
                    <ImagePicker id={nextId('img')} title="4 - Well Schematics" setImages = {setImages} imageData={EOWRData['eowr_snags']['well_schematics']}></ImagePicker>
                </section>

                <span className='text-xl px-4'>II. Time Activity Breakdown</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4 align-bottom`} >
                    <Table title = "Rig Time Performance" id = {getDivId('table')} tableData = {EOWRData['rig_performance']} size={'big'}/>
                    <Table title = "Time Distribution" id = {getDivId('table')} tableData = {EOWRData['time_distribution']['time_distribution']}/>

                    {/* <Chart title = "Progress chart" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/>
                    <Chart title = "Progress chart with cost" id = {getDivId('chart')} chartData = {EOWRData['chart_data']} chartType="Pie"/> */}

                    {/* <ImagePicker id={nextId('img')} title = "Progress chart" setImages={setImages} /> */}
                    <Chart title = "Progress Chart - From Spud Date" id = {getDivId('chart')} chartData = {EOWRData['progress_chart']} chartType="DateAxes"/> 
                    <Chart title = "Progress Chart - From Launch Date" id = {getDivId('chart')} chartData = {EOWRData['progress_chart_dol']} chartType="DateAxes"/> 
                    {/* <ImagePicker id={nextId('img')} title = "Progress chart with cost" setImages={setImages} /> */}
                    

                    <Chart title = "Well Activity" id = {getDivId('chart')} chartData = {EOWRData['well_activity']} chartType="Pie"/>
                    <Chart title = "Time Distribution per phase" id = {getDivId('chart')} chartData = {EOWRData['time_distribution']['time_dist_per_phase']} chartType="Bar"/>
                </section>

                <span className='text-xl px-4'>III. NPT Analysis</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                    <Chart title = "PT vs NPT" id = {getDivId('chart')} chartData = {EOWRData['npt_related']['pt_vs_npt']} chartType="Pie"/>
                    {/* TODO : below instruction is skipped and needs to be implemented */}
                    <Chart title = "NPT vs Section" id = {getDivId('chart')} chartData = {EOWRData['npt_sections']} chartType="ClusterBar"/> 
                    <Chart title = "NPT vs Category" id = {getDivId('chart')} chartData = {EOWRData['npt_related']['npt_categories']} chartType="Pie"/>
                    <Chart title = "NPT vs Sub-Category" id = {getDivId('chart')} chartData = {EOWRData['npt_related']['npt_subcategories']} chartType="Pie"/>
                </section>
                <section className={`align-middle grid grid-col-3 xl:grid-cols-3 gap-4 place-items-top px-2 pb-4`} >
                    <Chart title = "NPT Details" id = {getDivId('chart')} chartData = {EOWRData['npt_related']['npt_details']} chartType="Pie" className="h-150"/>
                    <Chart title = "NPT vs Service companies" id = {getDivId('chart')} chartData = {EOWRData['npt_related']['npt_companies']} chartType="Pie" className="h-150"/>
                    <Chart title = "NPT Down Hole Problems" id = {getDivId('chart')} chartData = {EOWRData['npt_related']['npt_downhole']} chartType="Pie" className="h-150"/>
                </section>

                <span className='text-xl px-4'>IV. Drilling & Tripping connection time KPI's</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-1 gap-4 place-items-top px-2 pb-4`} >
                    <MultiTable title = "Drilling connection Time KPI's" id = {getDivId('table')} tableData = {EOWRData['connection_details']['drill_time']}/>
                </section>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                    <MultiTable title = "Tripping In and connection Time KPI’s " id = {getDivId('table')} tableData = {TSTrippingKPI['rih']}/>
                    <MultiTable title = "Tripping out and connection Time KPI’s" id = {getDivId('table')} tableData = {TSTrippingKPI['pooh']}/>
                </section>

                <span className='text-xl px-4'>V. Real Time Impact & Prevention</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >  
                    <Paragraphe id={nextId('p')} title = "High Value Interventions"  text = {paragraphes[nextId('p', false)]} onSave={handleParagrapheSave}/>
                    <Paragraphe id={nextId('p')} title = "Prevention & Mitigation plan"  text = {paragraphes[nextId('p', false)]} onSave={handleParagrapheSave}/>
                </section>

                <span className='text-xl px-4'>VI. Section Summary</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                {
                    EOWRData['section_summary']?.map((sct, index) => {
                        let section = {...sct};
                        const hs = section['Hole Section'];

                        // search if the reference of section summary has a ST pattern
                        const section_reference = section['reference']
                        const regex = /ST\d+/g;
                        const matches = section_reference.match(regex);
                        const sidetrack = (matches=== null) ? '' : matches[0]

                        // search in the snags sections the section that matches the phase and sidetrack of the current section summary
                        const snags = EOWRData['eowr_snags']?.['sections']?.find(s => (s.section === hs && s.SideTrack === sidetrack))

                        const casing_run_img = snags?.['run_casing']
                        const ream_back_ream_interval_img = snags?.['ream_back_ream_interval']
                        
                        delete section['reference'];
                        return (
                            <React.Fragment key={`section-${index}`}>
                            <Tabular title={`Section Overview (${hs})`} id={getDivId('table')} tableData={Object.entries(section).map(([key, value]) => ({ [key]: value }))} columns={3} />
                            <Paragraphe id={`p-no-need${index * 100}`} title={`Operation Summary Results (${hs})`} text={section['description']} onSave={handleParagrapheSave} />
                            <ImagePicker id={nextId('img')} title={`Run Casing (Broomstick) (${hs})`} setImages={setImages} imageData={casing_run_img} />
                            <ImagePicker id={nextId('img')} title={`Ream & Back Ream Interval (${hs})`} setImages={setImages} imageData={ream_back_ream_interval_img} />
                            </React.Fragment>
                        );
                    })
                }
                </section>
                <span className='text-xl px-4'>VII. Conclusion</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >
                    <Paragraphe id={nextId('p')} title = "Conclusion"  text = {paragraphes[nextId('p', false)]} onSave={handleParagrapheSave}/>
                </section>
                <span className='text-xl px-4'>VIII. Appendix</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-2 gap-4 place-items-top px-2 pb-4`} >  
                    <Chart title = "Drilling Events Category" id = {getDivId('chart')} chartData = {EOWRData['drilling_events']['events_categories']} chartType="Pie"/>
                    <Chart title = "Drilling Events Sub-Category " id = {getDivId('chart')} chartData = {EOWRData['drilling_events']['events_subcategories']} chartType="Pie"/>
                </section>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-1 gap-4 place-items-top px-2 pb-4`} >
                    <MultiTable title = "Drilling Events Captured" id = {getDivId('table')} tableData = {EOWRData['drilling_events_kpi']['events_kpi_res']}/>
                </section>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-1 gap-4 place-items-top px-2 pb-4`} >
                    <MultiTable title = "Drilling Events Caused NPT" id = {getDivId('table')} tableData = {EOWRData['drilling_events_kpi']['events_caused_npt_res']}/>
                </section>
                <span className='text-xl px-4'>IX. Ream & Back Ream</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-4 gap-4 place-items-top px-2 pb-4`} >
                {
                    EOWRData['eowr_snags']['sections']?.map((section, index) => {
                        const holeSection = section['section']
                        const st = section['SideTrack']
                        const mapping = holeSectionMap[holeSection] || { imageKeys: [], count: 0 };
                        const imageKeys = ['ream_back_ream_1', 'ream_back_ream_2', 'ream_back_ream_3', 'ream_back_ream_4'];
                        const imageCount = mapping.count;
                      
                        const imagePickers = Array.from(Array(imageCount), (_, i) => (
                          <ImagePicker
                            id={nextId('img')}
                            title={`Ream & Back Ream (${holeSection} ${st})`}
                            setImages={setImages}
                            imageData={section[imageKeys[i]]}
                            key={nextId('img', false)}
                          />
                        ));
                      
                        return <React.Fragment key={`section-${index}`}>{imagePickers}</React.Fragment>;
                      })
                }
                </section>
                <span className='text-xl px-4'>X. Bit Record</span>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-4 gap-4 place-items-top px-2 pb-4`}
                >
                {bitRecordData.map((record, index) => (
                    <ImagePicker  id={nextId('img')} key={nextId('img', false)} title={record.title} setImages={setImages} imageData={EOWRData['eowr_snags'][record.key]}></ImagePicker>
                ))}
                </section>
                <section className={`align-middle grid grid-col-1 xl:grid-cols-1 gap-4 place-items-top px-2 pb-4`} >
                    <Paragraphe id="team-members" title = "Team members"  text = {paragraphes['team-members']} onSave={handleParagrapheSave}/>
                </section>
            </div>
           }

        </div>
    );
}