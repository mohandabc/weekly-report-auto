import React, { useEffect, useState } from "react";

import { ActionButton } from "../../../components";
import { DateRangePicker } from "rsuite";
import { dateStartEndState, darkModeState } from "../../../shared/globalState";
import * as Mode from "../../../constants/darkmode_constants";
import { useRecoilState, useRecoilValue } from "recoil";
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
  console.log("Params from ReamBream : ", params);
};

export const ReamBream = () => {
  const [dateStartEnd, setDateStartEnd] = useRecoilState(dateStartEndState);
  const [dateRangeValue, setDateRangeValue] = React.useState([
    new Date(dateStartEnd.split(" - ")[0]),
    new Date(dateStartEnd.split(" - ")[1]),
  ]);
  const [well, setWell] = useState(0);
  const [phase, setPhase] = useState(0);
  const [npt, setNpt] = useState(0);

  const params = {
    well: well,
    phase: phase,
    npt: npt,
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
  const darkMode = useRecoilValue(darkModeState);

  useEffect(() => {
    setAnimation(true);
  });

  return (
    <>
      <div className="absolute mt-56 z-50">
        <Loader></Loader>
      </div>
      <div
        className={`sticky rounded-xl ${
          // choose container color on Whether darkmode is in "dark" or "light" mode.
              darkMode ? Mode.CONTAINER_DARK_COLOR : Mode.CONTAINER_LIGHT_COLOR
        } h-auto}`}
      >
        <div className="flex justify-center items-center">
          <div className="py-9">
            <h1
              className={`${
                darkMode
                  ? Mode.CONTAINER_DARK_TITLE
                  : Mode.CONTAINER_LIGHT_TITLE
              } text-3xl text-center delay-200 duration-1000 relative transform transition-all ease-out
                    ${
                      // hiding components when they first appear and then applying a translate effect gradually
                      animation
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
            >
              Ream-Back Ream Analysis
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
            onChange={setPhase}
            placeholder="Phase"
            data={data_placeHolder}
            style={styles.wide}
          />
          <SelectPicker
            onChange={setNpt}
            placeholder="NPT"
            data={data_placeHolder}
            style={styles.wide}
          />
          <DateRangePicker
            value={dateRangeValue}
            onChange={setDateRangeValue}
            format="dd-MM-yyyy"
            style={{
              width: 250,
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
