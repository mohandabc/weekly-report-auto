import { ActionButton } from "..";

import { SideBar } from "../../components/SideBar";
import React from "react";
import { dateStartEndState } from "../../shared/globalState";
import { useRecoilState } from "recoil";
import { Loader } from "../../components";
import { useState } from "react";
import { DateRangePicker, Uploader } from "rsuite";

import "./styles.css";

import { SelectPicker } from "rsuite";

const styles = {
  left: {
    height: 38,
    width: 257,
    marginBottom: 30,
    marginRight: 60,
  },
  right: {
    height: 38,
    width: 257,
    marginBottom: 30,
  },
  addi: {
    height: 38,
    marginBottom: 30,
  },
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

export const ConfigBar = ({ title, configBarAction, options }) => {
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
    files: uploaderValue
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
    <div className="flex flex-col h-72 bg-reporting_image min-h-screen bg-no-repeat bg-cover bg-center bg-fixed">
      <div className="fixed top-0 z-50 w-full">
        <SideBar />
      </div>
      <header
        className={`flex flex-col h-72 bg-reporting_image min-h-screen bg-no-repeat bg-cover bg-center bg-fixed text-white text-3xl justify-center items-center`}
      >
        <div className="absolute mt-56 z-50">
          <Loader></Loader>
        </div>
        <div className="sticky rounded-xl bg-gray-200 w-1/2 h-96 ">
          <div className="flex justify-center items-center">
            <div className="py-9">
              <h1 className="text-zinc-500 text-3xl text-center">{title}</h1>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {/* @TODO impliment these components */}
            {options.rig ? (
              <SelectPicker onChange={setRig} label="Rig" data={rigs_data} style={styles.left} />
            ) : (
              <></>
            )}
            {options.well ? (
              <SelectPicker
                onChange={setWell}
                label="Well"
                data={wells_data}
                style={styles.right}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="flex items-center justify-center">
            {options.pole ? (
              <SelectPicker
              onChange={setPole}
                label="Pole"
                data={poles_data}
                style={styles.left}
              />
            ) : (
              <></>
            )}
            {options.phase ? (
              <SelectPicker
                onChange={setPhase}
                label="Phase"
                data={phases_data}
                style={styles.right}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="flex items-center justify-center">
            {options.files ?
              <><DateRangePicker
                value={value}
                onChange={setValue}
                style={styles.left}
                format="dd-MM-yyyy" /><div
                  style={{
                    height: 38,
                    width: 257,
                    color: "black",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Uploader
                    value={uploaderValue}
                    onChange={setUploaderValue}
                    autoUpload={false}
                    ref={uploader}
                    action="//jsonplaceholder.typicode.com/posts/"
                    draggable
                    multiple
                    style={styles.right}
                  >
                    <span>Click or Drag files to this area to upload</span>
                  </Uploader>
                </div></>
            :
            <DateRangePicker
            value={value}
            onChange={setValue}
            style={styles.left}
            format="dd-MM-yyyy" />
            }
          </div>
          <div className="flex items-center justify-center">
            <ActionButton
              className="bg-blue-500 hover:bg-blue-700 text-black font-bold text-base py-2 px-4 rounded "
              text="Submit"
              action={configBarAction}
              args={[params]}
            ></ActionButton>
          </div>
        </div>
      </header>
    </div>
  );
};
