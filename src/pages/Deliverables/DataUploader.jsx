/***********************************************************************************************
 * THIS PAGE CONTAING A SIMPLE DATA UPLOADER WITH A WELL SELECTOR AND A DRAGABLE FILE UPLOADER *
 *            THE UPLOADED FILES ARE IN PARAMS FOR FURTHER PROCESSING (CHECK LOGS)             *
 ***********************************************************************************************/

import React, { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar";
import { Loader } from "../../components/Loader";
import { Uploader } from "rsuite";
import { SelectPicker } from "rsuite";
import { IconButton } from "rsuite";
import FileUploadIcon from "@rsuite/icons/FileUpload";
import { Tooltip, Whisper } from "rsuite";
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
].map((item) => ({ label: item, value: item }));

const processInput = (params) => {
  /***************************************************************************
   * TODO: FURTHER PROCESSING , SEND PARAMS TO WHATEVER THE OTHER SIDE IS ;) *
   ***************************************************************************/
  console.log("Params from ReamBream : ", params);
};

export const DataUploader = () => {
  const darkMode = useRecoilValue(darkModeState);

  const [well, setWell] = useState(0);
  const [uploaderValue, setUploaderValue] = React.useState([]);
  const uploader = React.useRef();

  const params = {
    well: well,
    uploaderValue: uploaderValue,
    // files: uploaderValue,
  };

  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  });

  return (
    <div className="App">
      <div
        className={`flex flex-col h-72 ${
          darkMode ? Mode.DARK_BACKGROUND : Mode.LIGHT_BACKGROUND
        } min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}
      >
        <div
          className={`fixed top-0 z-30 w-full ${
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
            darkMode ? Mode.DARK_BACKGROUND : Mode.LIGHT_BACKGROUND
          } min-h-screen bg-no-repeat bg-cover bg-center bg-fixed text-white text-3xl items-center justify-center`}
        >
          <div className="absolute mt-56 z-50">
            <Loader></Loader>
          </div>
          <div
            className={`container overflow-y-auto rounded-xl ${
              darkMode ? Mode.CONTAINER_DARK_COLOR : Mode.CONTAINER_LIGHT_COLOR
            } w-1/4 h-2/5 transform transition-all duration-500 ease-out
          ${animation ? "scale-100" : "scale-0"}`}
          >
            <div
              className={`flex items-center justify-center delay-200 duration-1000 relative transform transition-all ease-out
                    ${
                      animation
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
            >
              <div className="py-9">
                <h1
                  className={`${
                    darkMode
                      ? Mode.CONTAINER_DARK_TITLE
                      : Mode.CONTAINER_LIGHT_TITLE
                  } text-3xl text-center delay-200 duration-1000 relative transform transition-all ease-out
                    ${
                      animation
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
                >
                  Data Uploader
                </h1>
                <div className="items-center justify-center rounded-xl bg-gray-300 text-black text-sm my-10 p-10 text-center">
                  <div className="">
                    {uploaderValue.length ? (
                      <>
                        <Whisper speaker={<Tooltip>Send to server !</Tooltip>}>
                          <span className="object-center">
                            <IconButton
                              style={{
                                height: 40,
                                width: 80,
                                marginBottom: 20,
                              }}
                              icon={<FileUploadIcon fill="geen" />}
                              color="green"
                              appearance="primary"
                              onClick={() => {
                                uploader.current.start();
                                processInput(params);
                              }}
                            />
                          </span>
                        </Whisper>
                      </>
                    ) : (
                      <Whisper
                        speaker={<Tooltip>No files to upload !</Tooltip>}
                      >
                        <span>
                          <IconButton
                            style={{ height: 40, width: 80, marginBottom: 20 }}
                            icon={<FileUploadIcon />}
                            color="red"
                            appearance="primary"
                            disabled
                            onClick={() => {
                              uploader.current.start();
                              processInput(params);
                            }}
                          />
                        </span>
                      </Whisper>
                    )}
                  </div>
                  <SelectPicker
                    style={{ width: 238, marginBottom: 20 }}
                    label="Well"
                    data={wells_placeholder}
                    onChange={setWell}
                  />
                  <Uploader
                    value={uploaderValue}
                    onChange={setUploaderValue}
                    ref={uploader}
                    style={{ width: 238 }}
                    autoUpload={false}
                    /************************************************
                     * THE PAGE THAT SHOULD RECEIVE THE POST METHOD *
                     *   TO UPLOAD THE FILES GOES HERE IN ACTION    *
                     ************************************************/
                    // action="//10.171.59.66:8069/web/create_data"
                    multiple
                    draggable
                  >
                    <span style={{ width: 238, height: 40 }}>
                      Click or Drag files to upload
                    </span>
                  </Uploader>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};
