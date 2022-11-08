import React from "react";

import { ActionButton } from "../../../components";
import { Loader } from "../../../components";
import { SelectPicker } from "rsuite";
import { useState } from "react";
import "./styles.css";

const styles = {
  wide: { height: 38, width: 250, margin: 10 },
  ewide: { height: 38, width: 520, margin: 10 },
};

const data_placeHolder = [
  // Test populating data
  "TEST-1",
  "TEST-2",
].map((item) => ({ label: item, value: item }));

const processInput = (params) => {
  console.log("Params from BitRecord : ", params);
};

export const BitRecord = () => {
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
    // files: uploaderValue,
  };

  return (
    <>
      <div className="absolute mt-56 z-50">
        <Loader></Loader>
      </div>
      <div className="sticky rounded-xl bg-gray-200 h-auto">
        <div className="flex justify-center items-center">
          <div className="py-9">
            <h1 className="text-zinc-500 text-3xl text-center">
              Drilling Bit Analysis
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center">
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
        <div className="flex items-center justify-center">
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
        <div className="flex items-center justify-center">
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
        <div className="flex items-center justify-center">
          <SelectPicker
            onChange={setInnerRows}
            placeholder="Inner rows"
            data={data_placeHolder}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setOuterRows}
            placeholder="Outer rows"
            data={data_placeHolder}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setDull}
            placeholder="Dull"
            data={data_placeHolder}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setLocation}
            placeholder="Location"
            style={styles.wide}
          />
        </div>
        <div className="flex items-center justify-center">
          <SelectPicker
            onChange={setBearingSeals}
            placeholder="Bearing seals"
            data={data_placeHolder}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setGauge}
            placeholder="Gauge 1/16 in"
            data={data_placeHolder}
            style={styles.wide}
          />
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
        </div>
        <div className="flex items-center justify-center">
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
