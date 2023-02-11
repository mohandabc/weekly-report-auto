import React, { useEffect, useState } from "react";

import { ActionButton } from "../../../components";
import { DateRangePicker } from "rsuite";
import { dateStartEndState } from "../../../shared/globalState";
import { useRecoilState} from "recoil";
import { Loader } from "../../../components";
import { SelectPicker } from "rsuite";
import "./styles.css";

const styles = {
  wide: { height: 38, width: 250, margin: 10 },
};

const data_placeHolder = [
  // Test populating data
  "TEST-1",
  "TEST-2",
].map((item) => ({ label: item, value: item }));

const processInput = (params) => {
  /***************************************************************************
   * TODO: FURTHER PROCESSING , SEND PARAMS TO WHATEVER THE OTHER SIDE IS ;) *
   ***************************************************************************/
  console.log("Params from DrillingState : ", params);
};

export const DrillingState = () => {
  const [dateStartEnd, setDateStartEnd] = useRecoilState(dateStartEndState);
  const [dateRangeValue, setDateRangeValue] = React.useState([
    new Date(dateStartEnd.split(" - ")[0]),
    new Date(dateStartEnd.split(" - ")[1]),
  ]);
  const [well, setWell] = useState(0);
  const [rig, setRig] = useState(0);
  const [rotarySys, setRotarySys] = useState(0);
  const [phase, setPhase] = useState(0);
  const [lastCSG, setLastCSG] = useState(0);
  const [runNum, setRunNum] = useState(0);
  const [drillString, setDrillString] = useState(0);
  const [BHAname, setBHAname] = useState(0);
  const [benchmarkCT, setBenchmarkCT] = useState(0);
  const [threshold, setThreshold] = useState(0);

  const params = {
    well: well,
    rig: rig,
    rotarySys: rotarySys,
    phase: phase,
    lastCSG: lastCSG,
    runNum: runNum,
    drillString: drillString,
    BHAname: BHAname,
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

  return (
    <>
      <div className="absolute mt-56 z-50">
        <Loader></Loader>
      </div>
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
              Drilling State Analysis
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
            style={styles.wide}
            data={data_placeHolder}
          />
          <SelectPicker
            onChange={setRig}
            placeholder="Rig"
            style={styles.wide}
            data={data_placeHolder}
          />
          <SelectPicker
            onChange={setRotarySys}
            placeholder="Rotary System"
            style={styles.wide}
            data={data_placeHolder}
          />
          <SelectPicker
            onChange={setPhase}
            placeholder="Phase"
            style={styles.wide}
            data={data_placeHolder}
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
            style={styles.wide}
            data={data_placeHolder}
          />
          <SelectPicker
            onChange={setRunNum}
            placeholder="Run number"
            style={styles.wide}
            data={data_placeHolder}
          />
          <SelectPicker
            onChange={setDrillString}
            placeholder="Drill String Size"
            style={styles.wide}
            data={data_placeHolder}
          />
          <SelectPicker
            onChange={setBHAname}
            placeholder="BHA Name"
            style={styles.wide}
            data={data_placeHolder}
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
            style={styles.wide}
            data={data_placeHolder}
          />
          <SelectPicker
            onChange={setThreshold}
            placeholder="Threshold [T]"
            style={styles.wide}
            data={data_placeHolder}
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
    </>
  );
};
