/***********************************************************************************************
 * THIS PAGE CONTAING A SIMPLE DATA UPLOADER WITH A WELL SELECTOR AND A DRAGABLE FILE UPLOADER *
 *            THE UPLOADED FILES ARE IN PARAMS FOR FURTHER PROCESSING (CHECK LOGS)             *
 ***********************************************************************************************/

import React, { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar";
import { Loader } from "../../components/Loader";
import { Uploader } from "rsuite";
import { SelectPicker } from "rsuite";
import { useRecoilValue } from "recoil";
import "./styles.css";
import { darkModeState } from "../../shared/globalState";
import * as Mode from "../../constants/darkmode_constants";

const wells_placeholder = [
  // Test populating data
  "WOENS-1",
  "KARS-3",
  "DJHSE-1",
  "HBKN-4",
  "BIRN-1",
  "EMR-1",
  "RAA-8",
  "HDZ-20",
  "TOT-10",
].map((item) => ({ label: item, value: item }));

export const DataUploader = () => {
  // Sets the dark mode value.
  const darkMode = useRecoilValue(darkModeState);

  const [well, setWell] = useState(0);
  const [msg, setMsg] = useState(0);
  const [uploaderValue, setUploaderValue] = React.useState([]);

  const params = {
    well: well,
  };

  // Sets the state of the animation to false before assigning it a true value to animate components on useEffect.
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  });

  function onSuccessFun(response, file) {
    console.log(file);
    setMsg({
      msg: file.name.slice(0, -5),
      msg1: " Has been uploaded and inserted successfully",
      color: "#375a70",
    });
  }

  function onErrorFun(reason) {
    setMsg({ msg: reason["response"]["detail"], color: "red" });
  }

  function onProgressFun(percent) {
    percent != 100
      ? setMsg({
          msg: "Uploading..." + parseInt(percent) + "%",
          color: "#375a70",
        })
      : setMsg({
          msg: "Inserting data to database...This operation may take a while, Please dont close this window.",
          color: "#375a70",
        });
  }

  return (
    <div className="App">
      <div
        className={`flex flex-col h-72 ${
          // choose background on Whether darkmode is in "dark" or "light" mode.
          darkMode ? Mode.DARK_BACKGROUND : Mode.LIGHT_BACKGROUND
        } min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}
      >
        <div
          className={`fixed top-0 z-30 w-full ${
            // choose Navbar Color on Whether darkmode is in "dark" or "light" mode.
            darkMode ? Mode.NAVBAR_DARK : Mode.NAVBAR_LIGHT
          }`}
        >
          <SideBar
            appearance={`${
              darkMode
                ? Mode.NAVBAR_DARK_APPEARANCE
                : Mode.NAVBAR_LIGHT_APPEARANCE
            }`}
          />
        </div>
        <header
          className={`flex flex-col h-72 ${
            // choose background on Whether darkmode is in "dark" or "light" mode.
            darkMode ? Mode.DARK_BACKGROUND : Mode.LIGHT_BACKGROUND
          } min-h-screen bg-no-repeat bg-cover bg-center bg-fixed text-white text-3xl items-center justify-center`}
        >
          <div className="absolute mt-56 z-50">
            <Loader></Loader>
          </div>
          <div
            className={`container overflow-y-auto rounded-xl ${
              // choose container color on Whether darkmode is in "dark" or "light" mode.
              darkMode ? Mode.CONTAINER_DARK_COLOR : Mode.CONTAINER_LIGHT_COLOR
            } w-2/4 h-1/2 transform transition-all duration-500 ease-out
          ${animation ? "scale-100" : "scale-0"}`}
          >
            <div
              className={`flex items-center justify-center delay-200 duration-1000 relative transform transition-all ease-out
                    ${
                      // hiding components when they first appear and then applying a translate effect gradually
                      animation
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
            >
              <div className="py-9 w-2/3">
                <h1
                  className={`${
                    // choose the container title's color on Whether darkmode is in "dark" or "light" mode.
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
                  Data Uploader
                </h1>
                <div className="flex-row rounded-xl bg-gray-300 text-black text-sm my-10 p-10 text-center">
                  <SelectPicker
                    style={{ width: 300, marginBottom: 20 }}
                    label="Well"
                    data={wells_placeholder}
                    onChange={setWell}
                    value={well}
                  />

                  {well ? (
                    <Uploader
                      accept=".xlsx"
                      name="excel_files_combined"
                      method="POST"
                      fileList={uploaderValue}
                      onProgress={onProgressFun}
                      onChange={setUploaderValue}
                      onSuccess={onSuccessFun}
                      data={params}
                      style={{ marginBottom: 20}}
                      autoUpload={true}
                      onError={(reason) => {
                        onErrorFun(reason);
                      }}
                      /************************************************
                       * THE PAGE THAT SHOULD RECEIVE THE POST METHOD *
                       *   TO UPLOAD THE FILES GOES HERE IN ACTION    *
                       ************************************************/
                      action="http://localhost:8000/submit"
                      multiple
                      draggable
                    >
                      <div style={{ height: 40 }}>
                        Click or Drag files to upload
                      </div>
                    </Uploader>
                  ) : (
                    <></>
                  )}
                  <div
                  >
                    <div
                      style={{
                        fontSize: 10,
                        overflowWrap: "normal",
                        color: msg["color"],
                      }}
                    >
                      {msg["msg"]}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        overflowWrap: "normal",
                        color: "green",
                      }}
                    >
                      {msg["msg1"]}
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};
