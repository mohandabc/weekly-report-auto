import React, { useEffect, useState } from "react";

import { ActionButton } from "../../../components";
import { DateRangePicker } from "rsuite";
import { dateStartEndState} from "../../../shared/globalState";
import { useRecoilValue } from "recoil";
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
  const dateStartEnd = useRecoilValue(dateStartEndState);
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
            disabled
          />
          <SelectPicker
            onChange={setPhase}
            placeholder="Phase"
            data={data_placeHolder}
            style={styles.wide}
            disabled
          />
          <SelectPicker
            onChange={setNpt}
            placeholder="NPT"
            data={data_placeHolder}
            style={styles.wide}
            disabled
          />
          <DateRangePicker
            value={dateRangeValue}
            onChange={setDateRangeValue}
            format="dd-MM-yyyy"
            style={{
              width: 250,
              margin: 10,
            }}
            disabled
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
            className="bg-gray-400 hover:bg-gray-500 text-black font-bold text-base my-7 py-2 px-4 rounded"
            text="Submit"
            action={processInput}
            args={[params]}
            disabled
          ></ActionButton>
        </div>
      </div>
    </>
  );
};
