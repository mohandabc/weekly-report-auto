import React, { useEffect, useState } from "react";

import { ActionButton } from "../../../components";
import { DateRangePicker } from "rsuite";
import { dateStartEndState} from "../../../shared/globalState";
import { useRecoilValue} from "recoil";
import { SelectPicker } from "rsuite";
import { BACK_URL } from "../../../constants/URI";
import { getData } from "../../../services/api";
import { TsAnalysis } from "./AnalysisForms/TsAnalysis";
import "./styles.css";

const styles = {
  wide: { height: 38, width: 250, margin: 10 },
};

const data_placeHolder = [
  // Test populating data
  "TEST-1",
  "TEST-2",
].map((item) => ({ label: item, value: item }));

export const TrippingSpeed = () => {
  const dateStartEnd = useRecoilValue(dateStartEndState);
  const [dateRangeValue, setDateRangeValue] = React.useState([
    new Date(dateStartEnd.split(" - ")[0]),
    new Date(dateStartEnd.split(" - ")[1]),
  ]);
  const [data, setData] = useState(0);
  const [well, setWell] = useState(0);
  const [rig, setRig] = useState(0);
  const [rotarySys, setRotarySys] = useState(0);
  const [phase, setPhase] = useState(0);
  const [lastCSG, setLastCSG] = useState(0);
  const [TrippingType, setTrippingType] = useState(0);
  const [tripReason, setTripReason] = useState(0);
  const [tripNumber, setTripNumber] = useState(0);
  const [casedHole, setCasedHole] = useState(0);
  const [drillString, setDrillString] = useState(0);
  const [BHAname, setBHAname] = useState(0);
  const [benchmarkTS, setBenchmarkTS] = useState(0);
  const [benchmarkCT, setBenchmarkCT] = useState(0);
  const [threshold, setThreshold] = useState(0);

  const params = {
    well: well,
    rig: rig,
    rotarySys: rotarySys,
    phase: phase,
    lastCSG: lastCSG,
    TrippingType: TrippingType,
    tripReason: tripReason,
    tripNumber: tripNumber,
    casedHole: casedHole,
    drillString: drillString,
    BHAname: BHAname,
    benchmarkTS: benchmarkTS,
    benchmarkCT: benchmarkCT,
    threshold: threshold,
    dateRangeValue:
      formatDate(dateRangeValue[0]) + " - " + formatDate(dateRangeValue[1]),
    // files: uploaderValue,
  };

  function formatDate(date) {
    if (date)
      return [
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
        date.getFullYear(),
      ].join("/");
  }

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  },[]);

  const processInput = (params) => {
    /***************************************************************************
     * TODO: FURTHER PROCESSING , SEND PARAMS TO WHATEVER THE OTHER SIDE IS ;) *
     ***************************************************************************/
    console.log("Params from TrippingSpeed : ", params);
    const path = "TrippingSpeed/";
    getData(BACK_URL, path, params).then((res) => {
      setData(res);
      console.log("Returned Results : ", res);
    });
  };

  return (
    <>
      {data ? (
          <div
            className={`sticky rounded-xl bg-gray-200 dark:bg-stone-700 h-auto`}
          >
                <TsAnalysis TsAnalysisData={data["ts_analysis"]} doc_id={data["_id"]}></TsAnalysis>
          </div>
      ) : (
        <div
          className={`sticky rounded-xl bg-gray-200 dark:bg-stone-700 h-auto}`}
        >
          <div className="flex justify-center items-center">
            <div className="py-9">
              <h1
                className={`text-zinc-500 dark:text-black text-3xl text-center delay-200 duration-1000 relative transform transition-all ease-out
              ${
                // hiding components when they first appear and then applying a translate effect gradually
                animation
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              >
                Tripping Speed Analysis
              </h1>
            </div>
          </div>
          <div
            className={`flex items-center justify-center duration-1000 relative transform transition-all ease-out
              ${
                // hiding components when they first appear and then applying a translate effect gradually
                animation
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
          >
            <SelectPicker
              onChange={setWell}
              placeholder="Well"
              data={data_placeHolder}
              style={styles.wide}
            />
            <SelectPicker
              onChange={setRig}
              placeholder="Rig"
              data={data_placeHolder}
              style={styles.wide}
            />
            <SelectPicker
              onChange={setRotarySys}
              placeholder="Rotary System"
              data={data_placeHolder}
              style={styles.wide}
            />
            <SelectPicker
              onChange={setPhase}
              placeholder="Phase"
              data={data_placeHolder}
              style={styles.wide}
            />
          </div>
          <div
            className={`flex items-center justify-center duration-1000 relative transform transition-all ease-out
              ${
                // hiding components when they first appear and then applying a translate effect gradually
                animation
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
          >
            <SelectPicker
              onChange={setLastCSG}
              placeholder="Last CSG Shoe [m]"
              data={data_placeHolder}
              style={styles.wide}
            />
            <SelectPicker
              onChange={setTrippingType}
              placeholder="Tripping Type"
              data={data_placeHolder}
              style={styles.wide}
            />
            <SelectPicker
              onChange={setTripReason}
              placeholder="Trip reason"
              data={data_placeHolder}
              style={styles.wide}
            />
            <SelectPicker
              onChange={setTripNumber}
              placeholder="Trip number"
              data={data_placeHolder}
              style={styles.wide}
            />
          </div>
          <div
            className={`flex items-center justify-center duration-1000 relative transform transition-all ease-out
              ${
                // hiding components when they first appear and then applying a translate effect gradually
                animation
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
          >
            <SelectPicker
              onChange={setCasedHole}
              placeholder="Cased Hole/Open Hole"
              data={data_placeHolder}
              style={styles.wide}
            />
            <SelectPicker
              onChange={setDrillString}
              placeholder="Drill String Size"
              data={data_placeHolder}
              style={styles.wide}
            />
            <SelectPicker
              onChange={setBHAname}
              placeholder="BHA Name"
              data={data_placeHolder}
              style={styles.wide}
            />
            <SelectPicker
              onChange={setBenchmarkTS}
              placeholder="Benchmark (Tripping Speed [m/h])"
              data={data_placeHolder}
              style={styles.wide}
            />
          </div>
          <div
            className={`flex items-center justify-center duration-1000 relative transform transition-all ease-out
              ${
                // hiding components when they first appear and then applying a translate effect gradually
                animation
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
          >
            <SelectPicker
              onChange={setBenchmarkCT}
              placeholder="Benchmark (Connection Time [min])"
              data={data_placeHolder}
              style={styles.wide}
            />
            <SelectPicker
              onChange={setThreshold}
              placeholder="Threshold [T]"
              data={data_placeHolder}
              style={styles.wide}
            />
            <DateRangePicker
              value={dateRangeValue}
              onChange={setDateRangeValue}
              format="dd-MM-yyyy"
              style={{
                width: 520,
                margin: 10,
              }}
            />
          </div>
          <div
            className={`flex items-center justify-center duration-1000 relative transform transition-all ease-out
              ${
                // hiding components when they first appear and then applying a translate effect gradually
                animation
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
          >
            <ActionButton
              className="bg-blue-500 hover:bg-blue-700 text-black font-bold text-base my-7 py-2 px-4 rounded "
              text="Submit"
              action={processInput}
              args={[params]}
            ></ActionButton>
          </div>
        </div>
      )}
    </>
  );
};
