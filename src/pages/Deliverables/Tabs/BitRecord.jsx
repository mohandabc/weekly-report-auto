import React from "react";

import { ActionButton } from "../../../components";
import { DateRangePicker, Uploader } from "rsuite";
import { dateStartEndState } from "../../../shared/globalState";
import { useRecoilState } from "recoil";
import { Loader } from "../../../components";
import { SelectPicker } from "rsuite";
import { useState } from "react";
import "./styles.css";

const styles = {
  wide: { height: 38, width: 250, margin: 10 },
  ewide: { height: 38, width: 520, margin: 10 },
};

const wells_data = [
  // Test populating data
  "WOENS-1",
  "KARS-3",
  "DJHSE-1",
  "HBKN-4",
  "BIRN-1",
  "EMR-1",
  "RAA-8",
  "HDZ-20",
].map((item) => ({ label: item, value: item }));

const rigs_data = ["TP1", "TP2", "TP3", "TP4", "TP5", "TP6", "TP7", "TP8"].map(
  // Test populating data
  (item) => ({ label: item, value: item })
);

const poles_data = ["Nord", "Centre", "Sud"].map((item) => ({
  // Test populating data
  label: item,
  value: item,
}));

const phases_data = ["1", "2", "3", "4", "5", "6", "7"].map((item) => ({
  // Test populating data
  label: item,
  value: item,
}));

const processInput = (params) => {
  console.log("Params from BitRecord : ", params);
};

export const BitRecord = () => {
  const [dateStartEnd, setDateStartEnd] = useRecoilState(dateStartEndState);
  const [value, setValue] = React.useState([
    new Date(dateStartEnd.split(" - ")[0]),
    new Date(dateStartEnd.split(" - ")[1]),
  ]);
  const [uploaderValue, setUploaderValue] = React.useState([]);
  const uploader = React.useRef();

  const [well, setWell] = useState(0);
  const [rig, setRig] = useState(0);
  const [pole, setPole] = useState(0);
  const [phase, setPhase] = useState(0);

  const params = {
    well: well,
    rig: rig,
    pole: pole,
    phase: phase,
    dates: value
      ? formatDate(value[0]) + " - " + formatDate(value[1])
      : dateStartEnd,
    files: uploaderValue,
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
            onChange={setRig}
            placeholder="Well"
            data={rigs_data}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setRig}
            placeholder="Bit Size"
            data={rigs_data}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setRig}
            placeholder="Bit Type"
            data={rigs_data}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setRig}
            placeholder="Bit Manufactor"
            data={rigs_data}
            style={styles.wide}
          />
        </div>
        <div className="flex items-center justify-center">
          <SelectPicker
            onChange={setPole}
            placeholder="TFA"
            data={poles_data}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setPhase}
            placeholder="Bit Serial Number"
            data={phases_data}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setPhase}
            placeholder="Bit IADC Code"
            data={phases_data}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setPhase}
            placeholder="Bit Model"
            data={phases_data}
            style={styles.wide}
          />
        </div>
        <div className="flex items-center justify-center">
          <SelectPicker
            onChange={setPole}
            placeholder="Bit Jets"
            data={poles_data}
            style={styles.ewide}
          />
          <SelectPicker
            onChange={setPhase}
            placeholder="Bit Number"
            data={phases_data}
            style={styles.ewide}
          />
        </div>
        <div className="flex items-center justify-center">
          <SelectPicker
            onChange={setPole}
            placeholder="Inner rows"
            data={poles_data}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setPhase}
            placeholder="Outer rows"
            data={phases_data}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setPole}
            placeholder="Dull"
            data={poles_data}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setPhase}
            placeholder="Location"
            style={styles.wide}
          />
        </div>
        <div className="flex items-center justify-center">
          <SelectPicker
            onChange={setPole}
            placeholder="Bearing seals"
            data={poles_data}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setPhase}
            placeholder="Gauge 1/16 in"
            data={phases_data}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setPole}
            placeholder="Other"
            data={poles_data}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setPhase}
            placeholder="Reason"
            data={phases_data}
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
