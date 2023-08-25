import React, { useEffect, useState } from "react";

import { ActionButton, PaginationComp } from "../../../components";
import { DateRangePicker } from "rsuite";
import { Pagination } from 'rsuite';
import { SelectPicker, Input, InputGroup, Tooltip, Whisper } from "rsuite";
import { API_URL, BACK_URL } from "../../../constants/URI";
import { getData } from "../../../api/api";
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

const rotarySys_placeHolder = [
  "Top Drive",
  "Kelly",
].map((item) => ({ label: item, value: item }));

const TrippingType_placeHolder = [
  "RIH",
  "POOH",
].map((item) => ({ label: item, value: item }));

const tripReason_placeHolder = [
    "Pick Up",
    "Run Back",
    "Drilling",
    "Wiper Trip",
    "Scraping",
    "Completion",
    "Clean Out",
    "Coring",
    "TD",
    "BHA",
    "Slow ROP",
    "Logging",
    "DST",
    "Fishing",
    "DPRB",
    "Cement Plug",
    "Safety String",
    "Milling",
].map((item) => ({ label: item, value: item }));

const lastCSG_placeHolder = [
    '30"',
    '18" 5/8',
    '13" 3/8',
    '9" 5/8',
    '7"',
    '4" 1/2',
].map((item) => ({ label: item, value: item }));

const drillString_placeHolder = [
    '5"',
    '5" 1/2',
    '3"',
    '3" 1/2'
].map((item) => ({ label: item, value: item }));

const casedHole_placeHolder = [
    'Cased',
    'Open',
].map((item) => ({ label: item, value: item }));

const phase_placeHolder = [
    '12"1/4',
    '16"',
    '17"1/2',
    '22"',
    '26"',
    '28"',
    '30"',
    '3"3/4',
    '3"3/4',
    '36"',
    '4"1/2',
    '4" 3/4',
    '6"',
    '8"1/2',
    '8.375"',
    'Completion',
    'Decompletion',
    'Drill Out CMT',
    'Flat Time',
    'Inter Phase 12"1/4 - 8"1/2',
    'Inter Phase 16" - 12"1/4',
    'Inter Phase 17"1/2 - 12"1/4',
    'Inter Phase 22" - 16"',
    'Inter Phase 22" - 17 1/2"',
    'Inter Phase 24" - 16"',
    'Inter Phase 26" - 16"',
    'Inter Phase 26" - 17"1/2',
    'Inter Phase 28" - 22"',
    'Inter Phase 28" - 24"',
    'Inter Phase 28" - 26"',
    'Inter Phase 30" - 28"',
    'Inter Phase 36" - 26"',
    'Inter Phase 36" - 28"',
    'Inter Phase 36" - 30"',
    'Inter Phase 6"- 3"3/4',
    'Inter Phase 6"- 4"3/4',
    'Inter Phase 8"1/2 - 6"',
    'Recertification',
    'Rig Move',
    'Workover',
].map((item) => ({ label: item, value: item }));

export const TrippingSpeed = () => {
  const [dateRangeValue, setDateRangeValue] = React.useState([new Date(),new Date()]);
  const [data, setData] = useState(0);

  const [well, setWell] = useState(0);
  const [wellname, setWellName] = useState(0);
  const [wellsplaceholder, setWellsplaceholder] = useState(0);

  const [rig, setRig] = useState(0);
  const [rigname, setRigName] = useState(0);
  const [rigsplaceholder, setRigsplaceholder] = useState(0);

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

  const [msg, setMsg] = useState(0);

  const params = {
    well: wellname,
    rig: rigname,
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
    dateRangeValue:[dateRangeValue[0],dateRangeValue[1]],
  };

  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
    populateWellRigPickers();
  },[]);

  useEffect(() => {
    if (well) {
      const rig = rigsplaceholder.find(rig => rig.value === well);
      if (rig) {setRig(rig.value);
        setRigName(rig.label)}
    }
  }, [well]);
  
  useEffect(() => {
    if (rig) {
      const well = wellsplaceholder.find(well => well.value === rig);
      if (well) {
                  setWell(well.value);
                  setWellName(well.label)}
    }
  }, [rig]);

  const processInput = (params) => {
    /***************************************************************************
     * TODO: FURTHER PROCESSING , SEND PARAMS TO WHATEVER THE OTHER SIDE IS ;) *
     ***************************************************************************/
    console.log("Params from TrippingSpeed : ", params);
    const path = "TrippingSpeed/";
    getData(BACK_URL, path, params).then((res) => {
      if (!('error' in res)) {
        setData(res);
      } else {
        setMsg({
          msg: res['error'],
        })
      }
      console.log("Returned Results : ", res);
    });
  };

  function populateWellRigPickers() {
    const path = 'api/reports/getwells';
      getData(API_URL, path, params)
      .then(res=> {
        let wells = res.result['wells'].map((item) => ({ label: item['well'], value: item['wid'] }));
        let rigs = res.result['wells'].map((item) => ({ label: item['rig'], value: item['wid'] }));
        setWellsplaceholder(wells || []);
        setRigsplaceholder(rigs || []);
      });
  }

  return (
    <>
      {data ? (
          <PaginationComp data = {data}></PaginationComp>
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
              loading={wellsplaceholder ? false : true}
              data={wellsplaceholder || []}
              style={styles.wide}
              value={well}
            />
            <SelectPicker
              onChange={setRig}
              placeholder="Rig"
              loading={rigsplaceholder ? false : true}
              data={rigsplaceholder || []}
              style={styles.wide}
              value={rig}
            />
            <SelectPicker
              onChange={setRotarySys}
              placeholder="Rotary System"
              data={rotarySys_placeHolder}
              style={styles.wide}
            />
            <SelectPicker
              onChange={setPhase}
              placeholder="Phase"
              data={phase_placeHolder}
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
              data={lastCSG_placeHolder}
              style={styles.wide}
            />
            <Whisper placement="top" speaker={<Tooltip>The Trip Type is automatically set !</Tooltip>}>
              <span>
                <SelectPicker
                  onChange={setTrippingType}
                  placeholder="Tripping Type"
                  data={TrippingType_placeHolder}
                  style={styles.wide}
                  disabled
                />
              </span>
            </Whisper>
            <SelectPicker
              onChange={setTripReason}
              placeholder="Trip reason"
              data={tripReason_placeHolder}
              style={styles.wide}
            />
            <Whisper placement="top" speaker={<Tooltip>The Trip Number is automatically calculated. Do not skip trips !</Tooltip>}>
            <span>
              <SelectPicker
                onChange={setTripNumber}
                placeholder="Trip number"
                data={data_placeHolder}
                style={styles.wide}
                disabled
              />
              </span>
            </Whisper>
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
              data={casedHole_placeHolder}
              style={styles.wide}
            />
            <SelectPicker
              onChange={setDrillString}
              placeholder="Drill String Size"
              data={drillString_placeHolder}
              style={styles.wide}
            />
            <Input
              onChange={setBHAname}
              placeholder="BHA Name"
              data={data_placeHolder}
              style={styles.wide}
            />
            <InputGroup style={styles.wide}>
              <Input onChange={setBenchmarkTS}
              placeholder="Benchmark (Tripping Speed)"
              data={data_placeHolder}
              />
              <InputGroup.Addon>m/h</InputGroup.Addon>
            </InputGroup>
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
            <InputGroup style={styles.wide}>
            <Input
              onChange={setBenchmarkCT}
              placeholder="Benchmark (Connection Time)"
              data={data_placeHolder}
            />
            <InputGroup.Addon>min</InputGroup.Addon>
            </InputGroup>

            <Whisper placement="top" speaker={<Tooltip>The Threshold is automatically calculated for the main time.</Tooltip>}>
              <span>
                <InputGroup style={styles.wide}>
                  <Input
                    onChange={setThreshold}
                    placeholder="Threshold"
                    data={data_placeHolder}
                    disabled
                  />
                  <InputGroup.Addon>T</InputGroup.Addon>
                </InputGroup>
              </span>
            </Whisper>

            <DateRangePicker
              value={dateRangeValue}
              onChange={setDateRangeValue}
              format="dd-MM-yyyy HH:mm:ss"
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
              className="bg-blue-500 hover:bg-blue-700 text-black font-bold text-base mt-7 py-2 px-4 rounded "
              text="Submit"
              action={processInput}
              args={[params]}
            ></ActionButton>
            
          </div>
          <div class="flex justify-center items-center">
              <div class="text-sm text-red-500 my-4">
                {msg["msg"]}
              </div>
          </div>
        </div>
      )}
    </>
  );
};
