import React, { useState } from "react";
import { Table, Button, Checkbox, SelectPicker, Pagination } from "rsuite";
import { DatePicker } from "rsuite";
import { DELIVERABLE_CONFIG_BAR_OPTIONS } from "../../../../constants/constants";
import { BACK_URL, API_URL} from "../../../../constants/URI";
import { deleteDoc, getData} from "../../../../api/api";
import "./styles.css";
import { useRecoilState } from "recoil";
import { TSReportDataState } from "../../../../shared/globalState";

const { Column, HeaderCell, Cell } = Table;

function minutesToTime(seconds) {
  const date = new Date();
  date.setMinutes(Math.floor(seconds / 60));
  date.setSeconds(seconds % 60);
  return date;
}

const seconds2minutes = (seconds) => (seconds/60).toFixed(2);
const minutes2hours = (minutes) => (minutes/60).toFixed(2);
const abnormal_description =  [
  {'value':'Circulation', 'label':'Circulation'},
  {'value':'Fill up', 'label':'Fill up'},
  {'value':'Rig Repair', 'label':'Rig Repair'},
  {'value':'Waiting', 'label':'Waiting'},
  {'value':'Flow Check', 'label':'Flow Check'},
  {'value':'Data Quality', 'label':'Data Quality'},
  {'value':'Slip & Cut', 'label':'Slip & Cut'},
  {'value':'Kick Drill', 'label':'Kick Drill'},
  {'value':'Safety Exercise', 'label':'Safety Exercise'},
  {'value':'Change Elevator 5" to 3.5DP', 'label':'Change Elevator 5" to 3.5DP'},
  {'value':'Empty Trip Tank', 'label':'Empty Trip Tank'},
]

function formatDateString(dateString) {
  let date = new Date(dateString);
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let hours = ("0" + date.getHours()).slice(-2);
  let minutes = ("0" + date.getMinutes()).slice(-2);
  let seconds = ("0" + date.getSeconds()).slice(-2);
  let formattedDateString =
    day +
    "-" +
    month +
    "-" +
    year +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return formattedDateString;
}

const EditableCell = ({ rowData, dataKey, onChange, ...props }) => {
  const [descriptions, setDescriptions] = React.useState('');

  return (
    <Cell
      {...props}
      style={{ padding: "0px", color: "black", fontSize: "11px" }}
    >
      {dataKey === "abnormal" ? (
        <Checkbox checked={rowData[dataKey]} onClick={(value) =>
          {
            const newValue = !rowData[dataKey];
            onChange(rowData.standNum, dataKey, newValue);
          }
        }/>
      ) : dataKey === "description" ? (
        <SelectPicker
        placeholder="Description ..."
        data={abnormal_description}
        onChange={(value) => {
          setDescriptions(value);
          onChange(rowData.standNum, dataKey, value);
        }}
        value={rowData[dataKey]}
        disabled={!rowData.abnormal}
        style={{width:226}}/>
      ) : dataKey === "connection_time" ? (
        <span className={`table-content-edit-span ${rowData[dataKey] > 540 ? "text-red-500" : rowData['gross_speed'] <= 150 ? "text-red-500" : ""}`}>
          {minutesToTime(rowData[dataKey]).getMinutes() +
            ":" +
            minutesToTime(rowData[dataKey]).getSeconds()}
        </span>
      ) : dataKey === "date_to" || dataKey === "date_from" ? (
        <span className={`table-content-edit-span ${rowData['connection_time'] > 540 ? "text-red-500" : rowData['gross_speed'] <= 150 ?"text-red-500":""}`}>
          {formatDateString(rowData[dataKey])}
        </span>
      ) : (
        <span className={`table-content-edit-span ${rowData['connection_time'] > 540 ? "text-red-500" : rowData['gross_speed'] <= 150 ?"text-red-500":""}`}>{rowData[dataKey]}</span>
      )}
    </Cell>
  );
};

export const TsAnalysis = ({TsAnalysisData, resetStates, doc_id, ParentComponent, parentStr}) => {
  const [TS_REPORT_DATA, setReportData] = useRecoilState(TSReportDataState);
  const [loadingValue, setLoadingValue] = useState(false);

  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [defData, setdefData] = React.useState(TsAnalysisData.standline);
  const [showParent, setShowParent] = React.useState(false);

  const data = defData.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });

  const handleChange = (standNum, key, value) => {
    const nextData = Object.assign([], defData);
    nextData.find((item) => item.standNum === standNum)[key] = value;
    setdefData(nextData);
  };

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const handleDeleteClick = () => {
    deleteDoc(BACK_URL, "TrippingSpeed/deleteDoc/", doc_id).then((res) => {
      if ("msg" in res && res.status === 200) {
        setShowParent(true);
        resetStates({
          msg: "Document deleted successfully",
          color: "text-green-500",
        });
        alert("Document deleted successfully");
      }
    });
  };

  const [msg, setMsg] = React.useState({ msg:'', color:"text-gray-500" });
  const handleSaveClick = () => {
    const updatedData = defData.map((object) => {
      const { status, ...otherFields } = object;
      return otherFields;
    });

    const requestData = {
      _id: doc_id,
      standline: updatedData,
    };
    setLoadingValue(true);
    getData(BACK_URL, "TrippingSpeed/updateDoc", requestData).then((res) => {
      if (res) {
        setLoadingValue(false);
        showMessage("Tripping speed analysis updated successfully", "text-green-600", 2000);
        
      }
      TsAnalysisData = res.ts_analysis;
      handleDisplayReportClick();
    });
  };
  

  const dateTimeInRange = (datetimeStr, range) => {
    const datetime = new Date(datetimeStr);

    const hours = datetime.getHours();
    const minutes = datetime.getMinutes();

    const startTime = range.shift_start * 60; 
    const endTime = range.shift_end * 60;  


    const currentTime = hours * 60 + minutes;
    if (currentTime >= startTime && currentTime <= endTime)
      return true;
    return false;
  }

  
  const showMessage = (text, color, duration=3000) => {
    setMsg({ msg:text, color:color });
    setTimeout(() => {
      setMsg({ msg:'', color:'' });
    }, duration);
  };
  
  const handleDisplayReportClick = async () => {
    let reportData = {};

    // const res = await getData(API_URL, 'shift-changes/', {'well_id' : TsAnalysisData.well_id});
    let shifts = {shift_start:TsAnalysisData.crew_change_start, shift_end:TsAnalysisData.crew_change_end}
    // if(res.result && res.result.shifts.length>0){
    //   shifts = res.result?.shifts[0];
    // }else{
    //   showMessage("Could not get crew change time, please set it in rigs in teamspace", "text-red-500", 3500);
    //   return;
    // }
        
    reportData['TS_benchmark'] = TsAnalysisData.benchmarkTS;
    reportData['create_date'] = TsAnalysisData.create_date;
    
    reportData['tripping_connection'] = [{'category' : 'Tripping Time', 'value':minutes2hours(seconds2minutes(TsAnalysisData.performances.post_connection_time))},
                                         {'category' : 'Connection Time', 'value':minutes2hours(seconds2minutes(TsAnalysisData.performances.connection_time))}];

    reportData['overview'] = [{"Attribute":"Rig Name", 'Value':TsAnalysisData.rig}, {"Attribute":"Well Name", 'Value':TsAnalysisData.well}, 
                              {"Attribute":"Phase", 'Value':TsAnalysisData.phase}, {"Attribute":"BHA Name", 'Value':TsAnalysisData.bha}, 
                              {"Attribute":"Drill Pipe Size", 'Value':TsAnalysisData.drill_pipe_size}, {"Attribute":"Rotary System", 'Value':TsAnalysisData.trip_information.rotary_system},
                              {"Attribute": 'Casing Size', 'Value':TsAnalysisData.csg_size}, {"Attribute":"Tripping Type", 'Value':TsAnalysisData.trip_information.trip_type},
                              {"Attribute":"Trip reason", 'Value':TsAnalysisData.trip_information.trip_reason}, {"Attribute":"Trip Number", 'Value':TsAnalysisData.trip_number},
                              {"Attribute":"Cased Open", 'Value':TsAnalysisData.trip_information.hole_type}, {"Attribute":"Speed Benchmark", 'Value':TsAnalysisData.benchmarkTS+' (m/h)'},
                              {"Attribute":"Connection Benchmark", 'Value':TsAnalysisData.benchmarkCT+' (min)'}, {"Attribute":"Threshold", 'Value':TsAnalysisData.threshold + ' (ton)'},
                              {"Attribute":"Start Time", 'Value':TsAnalysisData.result_analysis.start_date},{"Attribute" : "End Time", "Value" : TsAnalysisData.result_analysis.end_date},
                              {"Attribute" : "Generated On" ,"Value" : TsAnalysisData.create_date}, {"Attribute" : "Data Source", "Value" : "OilPort"}];

    reportData['connection_t_tripping_s'] = TsAnalysisData.standline.map(item=>{return {'connection_time' : seconds2minutes(item.connection_time), 
                                                                                        'tripping_speed' :item.gross_speed}});

    reportData['abnormal_stands'] = TsAnalysisData.standline.filter(item=>item.abnormal)
                                                            .map(item=>({'Stand Number' : item.standNum, 'Description' :item.description, 
                                                                         "Connection Time (Min)" : seconds2minutes(item.connection_time), 
                                                                         "Tripping Speed (m/h)" : item.gross_speed}));

    reportData['abnormal_overview'] = [TsAnalysisData.standline.filter(item=>item.abnormal)
                                                              .reduce(function (accumulator, currentValue) {
                                                                accumulator["Abnormal Stands"]++;
                                                                accumulator["Abnormal Time"] += currentValue.connection_time;
                                                                accumulator["Abnormal depth"] += currentValue.delta_depth;
                                                                return accumulator;
                                                              }, { "Abnormal Stands": 0, "Abnormal Time": 0 , "Abnormal depth":0})];
    reportData['abnormal_overview'][0]["Abnormal Time"] =  seconds2minutes(reportData['abnormal_overview'][0]['Abnormal Time']) + " Min";
    reportData['abnormal_overview'][0]['Abnormal depth'] =  reportData['abnormal_overview'][0]['Abnormal depth'].toFixed(2) +" m";
    
    // [{"stand number":"10", 'Description':'Fill TT', 'Connection time':11.2, 'Tripping speed':101.2}, {"stand number":"10", 'Description':'Fill TT', 'Connection time':11.2, 'Tripping speed':101.2}];
    reportData['kpi'] = [{"kpi":"Tripping distance", 'Value':TsAnalysisData.performances.tripping_distance.toFixed(2), 'unit':'m'},
                         {"kpi":"Connection Time AVG", 'Value':seconds2minutes(TsAnalysisData.performances.average_connection_time), 'unit':'Min'}, 
                         {"kpi":"Tripping Speed", 'Value':TsAnalysisData.performances.average_speed.toFixed(2), 'unit':'m/h'}, 
                         {"kpi":"Connection Time", 'Value':minutes2hours(seconds2minutes(TsAnalysisData.performances.connection_time)), 'unit':'Hours'}, 
                         {"kpi":"Tripping Time", 'Value':minutes2hours(seconds2minutes(TsAnalysisData.performances.post_connection_time)), 'unit':'Hours'}, 
                         {"kpi":"Abnormal time", 'Value':minutes2hours(seconds2minutes(TsAnalysisData.performances.abnormal_time)), 'unit':'Hours'},
                         {"kpi":"Number of connection", 'Value':TsAnalysisData.performances.total_connections, 'unit':'nbr'},
                         {"kpi":"Operation Time VS Benchmark Time", 
                                  'Value':(TsAnalysisData.performances.total_connections * (TsAnalysisData.benchmarkCT - seconds2minutes(TsAnalysisData.performances.average_connection_time))).toFixed(2), 
                                  'unit':'min'}];

    reportData['connection_per_stand'] = TsAnalysisData.standline.map((item, index)=>({shift: dateTimeInRange(item.date_from, 
                                                                                                      shifts)?
                                                                                                      "Day":'Night', 
                                                                              stand: "stand "+ item.standNum, 
                                                                              c_time : seconds2minutes(item.connection_time), 
                                                                              t_speed: item.gross_speed, 
                                                                              bit_depth:item.depth_from}));

    setReportData(reportData);
    };

  const handleCancelClick = () => {
    setReportData({});
    resetStates({});
    setShowParent(true);
  };

  const [animation, setAnimation] = React.useState(false);

  React.useEffect(() => {
    setAnimation(true);
  }, []);

  React.useEffect(() => {
    setdefData(TsAnalysisData.standline);
  }, [TsAnalysisData.standline]);

  return showParent ? (
    <ParentComponent options={DELIVERABLE_CONFIG_BAR_OPTIONS}></ParentComponent>
  ) : (
    <div className="pb-4 px-4">
      <div
        className={`text-zinc-500 dark:text-black flex justify-between delay-200 duration-1000 transition-all ease-out ${
          // hiding components when they first appear and then applying a translate effect gradually
          animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="grid grid-cols-3 gap-20 my-3 px-10 mx-auto bg-gray-100 rounded-lg text-sm">
          <div className="pt-2 text-gray-700 text-center">
            <b className="text-gray-900">Created By : </b>{" "}
            {TsAnalysisData.created_by}
          </div>
          <div className="pt-2 text-gray-700 text-center">
            <b className="text-gray-900">Create Date : </b>{" "}
            {TsAnalysisData.create_date}
          </div>
          <div className="py-2 text-gray-700 text-center">
            <b className="text-gray-900">Analysis Type : </b>{" "}
            {TsAnalysisData.analysis_type}
          </div>
        </div>
      </div>
      <div
        className={`text-black duration-1000 transition-all ease-out ${
          // hiding components when they first appear and then applying a translate effect gradually
          animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <Table
          bordered
          cellBordered
          rowHeight={30}
          padding={100}
          height={342}
          width={1070}
          data={data}
        >
          <Column width={50}>
            <HeaderCell>N</HeaderCell>
            <EditableCell dataKey="standNum" onChange={handleChange} />
          </Column>
          <Column width={145}>
            <HeaderCell>Connection Start</HeaderCell>
            <EditableCell dataKey="date_from" onChange={handleChange} />
          </Column>

          <Column width={145}>
            <HeaderCell>Connection End</HeaderCell>
            <EditableCell dataKey="date_to" onChange={handleChange} />
          </Column>

          <Column width={85}>
            <HeaderCell>Depth from</HeaderCell>
            <EditableCell dataKey="depth_from" onChange={handleChange} />
          </Column>

          <Column width={85}>
            <HeaderCell>Depth to</HeaderCell>
            <EditableCell dataKey="depth_to" onChange={handleChange} />
          </Column>

          {/* <Column width={70}>
            <HeaderCell>Delta Depth</HeaderCell>
            <EditableCell dataKey="delta_depth" onChange={handleChange} />
          </Column> */}

          <Column width={105}>
            <HeaderCell>Connection Time</HeaderCell>
            <EditableCell dataKey="connection_time" onChange={handleChange} />
          </Column>

          <Column width={80}>
            <HeaderCell>Gross Speed</HeaderCell>
            <EditableCell dataKey="gross_speed" onChange={handleChange} />
          </Column>

          <Column width={80}>
            <HeaderCell>Net Speed</HeaderCell>
            <EditableCell dataKey="net_speed" onChange={handleChange} />
          </Column>

          <Column width={72}>
            <HeaderCell>Abnormal</HeaderCell>
            <EditableCell dataKey="abnormal" onChange={handleChange} />
          </Column>

          <Column width={223}>
            <HeaderCell>Description</HeaderCell>
            <EditableCell dataKey="description" onChange={handleChange} />
          </Column>
        </Table>
        <div className="px-5">
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="xs"
            layout={["total", "-", "limit", "|", "pager", "skip"]}
            total={TsAnalysisData.standline.length}
            limitOptions={[10, 20, 30]}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            onChangeLimit={handleChangeLimit}
          />
        </div>
      </div>
      <div
        className={`text-zinc-500 dark:text-black flex justify-center items-center delay-200 duration-1000 transition-all ease-out ${
          // hiding components when they first appear and then applying a translate effect gradually
          animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="grid grid-cols-4 mt-3 px-10 bg-gray-100 rounded-lg justify-center items-center">
          <div className="text-sm">
            <div className="pt-2 text-gray-700">
              <b className="text-gray-900">Well :</b> {TsAnalysisData.well}
            </div>
            <div className="pt-2 text-gray-700">
              <b className="text-gray-900">Rotary System :</b>{" "}
              {TsAnalysisData.trip_information.rotary_system}
            </div>
            <div className="py-2 text-gray-700">
              <b className="text-gray-900">Phase : </b> {TsAnalysisData.phase}
            </div>
          </div>
          <div className="text-sm">
            <div className="pt-2 text-gray-700">
              <b className="text-gray-900">Trip Type : </b>{" "}
              {TsAnalysisData.trip_information.trip_type}
            </div>
            <div className="pt-2 text-gray-700">
              <b className="text-gray-900">Trip Reason : </b>{" "}
              {TsAnalysisData.trip_information.trip_reason}
            </div>
            <div className="py-2 text-gray-700">
              <b className="text-gray-900">Trip Number : </b>{" "}
              {TsAnalysisData.trip_number}
            </div>
          </div>
          <div className="text-sm">
            <div className="pt-2 text-gray-700">
              <b className="text-gray-900">CSG Size : </b>{" "}
              {TsAnalysisData.csg_size}
            </div>
            <div className="pt-2 text-gray-700">
              <b className="text-gray-900">Drill String Size : </b>{" "}
              {TsAnalysisData.drill_pipe_size}
            </div>
            <div className="py-2 text-gray-700">
              <b className="text-gray-900">Hole : </b>{" "}
              {TsAnalysisData.trip_information.hole_type}
            </div>
          </div>
          <div className="text-sm">
            <div className="pt-2 text-gray-700">
              <b className="text-gray-900">BHA Name : </b> {TsAnalysisData.bha}
            </div>
            <div className="pt-2 text-gray-700">
              <b className="text-gray-900">Benchmark (TS) : </b> {TsAnalysisData.benchmarkTS}
            </div>
            <div className="py-2 text-gray-700">
              <b className="text-gray-900">Benchmark (CT) : </b> {TsAnalysisData.benchmarkCT}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex-col items-center">
          {msg.msg?
            <div className={`text-center text-sm font-extrabold ${msg.color}  my-1`}>
              {msg.msg}
            </div>:
            <div className={`text-center text-sm font-bold ${msg.color} my-1`}>
              &nbsp;
            </div>
          }
        </div>
        <div className={`flex justify-center mt-1`}>
          <Button
            appearance="default"
            className="mx-4"
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button color="red" appearance="primary" onClick={handleDeleteClick}>
            Delete Analysis
          </Button>
          <Button 
            appearance="primary"
            color="green"
            className="ml-4"
            onClick={handleDisplayReportClick}>
            Display Report
          </Button>
          <Button color="blue" appearance="primary" className="mx-4" onClick={handleSaveClick} loading={loadingValue}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
