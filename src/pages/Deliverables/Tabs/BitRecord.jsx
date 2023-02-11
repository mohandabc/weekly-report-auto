import React, { useEffect, useState } from "react";

import { ActionButton } from "../../../components";
import { DateRangePicker } from "rsuite";
import { dateStartEndState} from "../../../shared/globalState";
import { useRecoilState } from "recoil";
import { Loader } from "../../../components";
import { SelectPicker } from "rsuite";
import "./styles.css";

const styles = {
  small: { height: 38, width: 160, margin: 10 },
  wide: { height: 38, width: 250, margin: 10 },
  ewide: { height: 38, width: 520, margin: 10 },
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
  console.log("Params from BitRecord : ", params);
};

export const BitRecord = () => {
  const [dateStartEnd, setDateStartEnd] = useRecoilState(dateStartEndState);
  const [dateRangeValue, setDateRangeValue] = React.useState([
    new Date(dateStartEnd.split(" - ")[0]),
    new Date(dateStartEnd.split(" - ")[1]),
  ]);
  const [well, setWell] = useState(0);
  const [bitSize, setBitSize] = useState(0);
  const [bitType, setBitType] = useState(0);
  const [bitManu, setBitManu] = useState(0);
  const [tfa, setTfa] = useState(0);
  const [bitSerialNo, setBitSerialNo] = useState(0);
  const [bitIADCcode, setBitIADCcode] = useState(0);
  const [bitModel, setBitModel] = useState(0);
  const [bitJets, setBitJets] = useState(0);
  const [bitNumber, setBitNumber] = useState(0);
  const [innerRows, setInnerRows] = useState(0);
  const [outerRows, setOuterRows] = useState(0);
  const [dull, setDull] = useState(0);
  const [location, setLocation] = useState(0);
  const [bearingSeals, setBearingSeals] = useState(0);
  const [gauge, setGauge] = useState(0);
  const [other, setOther] = useState(0);
  const [reason, setReason] = useState(0);

  const params = {
    well: well,
    bitSize: bitSize,
    bitType: bitType,
    bitManu: bitManu,
    tfa: tfa,
    bitSerialNo: bitSerialNo,
    bitIADCcode: bitIADCcode,
    bitModel: bitModel,
    bitJets: bitJets,
    bitNumber: bitNumber,
    innerRows: innerRows,
    outerRows: outerRows,
    dull: dull,
    location: location,
    bearingSeals: bearingSeals,
    gauge: gauge,
    other: other,
    reason: reason,
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
              Drilling Bit Analysis
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
            onChange={setBitSize}
            placeholder="Bit Size"
            data={data_placeHolder}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setBitType}
            placeholder="Bit Type"
            data={data_placeHolder}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setBitManu}
            placeholder="Bit Manufactor"
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
            onChange={setTfa}
            placeholder="TFA"
            data={data_placeHolder}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setBitSerialNo}
            placeholder="Bit Serial Number"
            data={data_placeHolder}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setBitIADCcode}
            placeholder="Bit IADC Code"
            data={data_placeHolder}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setBitModel}
            placeholder="Bit Model"
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
            onChange={setBitJets}
            placeholder="Bit Jets"
            data={data_placeHolder}
            style={styles.ewide}
          />
          <SelectPicker
            onChange={setBitNumber}
            placeholder="Bit Number"
            data={data_placeHolder}
            style={styles.ewide}
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
            onChange={setInnerRows}
            placeholder="Inner rows"
            data={data_placeHolder}
            style={styles.small}
          />
          <SelectPicker
            onChange={setOuterRows}
            placeholder="Outer rows"
            data={data_placeHolder}
            style={styles.small}
          />
          <SelectPicker
            onChange={setDull}
            placeholder="Dull"
            data={data_placeHolder}
            style={styles.small}
          />
          <SelectPicker
            onChange={setLocation}
            placeholder="Location"
            data={data_placeHolder}
            style={styles.small}
          />
          <SelectPicker
            onChange={setBearingSeals}
            placeholder="Bearing seals"
            data={data_placeHolder}
            style={styles.small}
          />
          <SelectPicker
            onChange={setGauge}
            placeholder="Gauge 1/16 in"
            data={data_placeHolder}
            style={styles.small}
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
            onChange={setOther}
            placeholder="Other"
            data={data_placeHolder}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setReason}
            placeholder="Reason"
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
    </>
  );
};
