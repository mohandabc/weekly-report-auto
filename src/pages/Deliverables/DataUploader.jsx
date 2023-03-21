/***********************************************************************************************
 * THIS PAGE CONTAING A SIMPLE DATA UPLOADER WITH A WELL SELECTOR AND A DRAGABLE FILE UPLOADER *
 *            THE UPLOADED FILES ARE IN PARAMS FOR FURTHER PROCESSING (CHECK LOGS)             *
 ***********************************************************************************************/

import React, { useEffect, useState } from "react";
import { TopMenu } from "../../components/TopMenu";
import { Loader } from "../../components/Loader";
import { Uploader } from "rsuite";
import { SelectPicker } from "rsuite";
import { useRecoilValue } from "recoil";
import "./styles.css";
import { darkModeState } from "../../shared/globalState";
import { getData } from "../../services/api";
import { API_URL, BACK_URL} from '../../constants/URI';

export const DataUploader = () => {
  const darkMode = useRecoilValue(darkModeState);

  const [well, setWell] = useState(0);
  const [msg, setMsg] = useState(0);
  const [wellsplaceholder, setWellsplaceholder] = useState(0);
  const [uploaderValue, setUploaderValue] = React.useState([]);

  const params = {
    well: well,
  };

  // Sets the state of the animation to false before assigning it a true value to animate components on useEffect.
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  },[]);

  useEffect(()=>{
    populateWellsPicker();
}, [])

  function onSuccessFun(response, file) {
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
    percent !== 100
      ? setMsg({
          msg: "Uploading..." + parseInt(percent) + "%",
          color: "#375a70",
        })
      : setMsg({
          msg: "Inserting data to database...This operation may take a while, Please dont close this window.",
          color: "#375a70",
        });
  }

  function populateWellsPicker() {
    const path = 'api/reports/getwells';
      getData(API_URL, path, params)
      .then(res=> {
        let data = res.result['wells'].map((item) => ({ label: item['name'], value: item['name'] }));;
        setWellsplaceholder(data || []);
      });
  }

  return (
    <div className="App">
      <div
        className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}
      >
        <div
          className={`fixed top-0 z-30 w-full dark:bg-black`}
        >
          <TopMenu
            appearance={`${darkMode ? "subtle": "default"}`}
          />
        </div>
        <header
          className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed text-white text-3xl items-center justify-center`}
        >
          <div className="absolute mt-56 z-50">
            <Loader></Loader>
          </div>
          <div
            className={`container overflow-y-auto rounded-xl bg-gray-200 dark:bg-stone-700 w-2/4 h-1/2 transform transition-all duration-500 ease-out
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
                  className={`text-zinc-500 dark:text-black text-3xl text-center delay-200 duration-1000 relative transform transition-all ease-out
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
                    loading = {wellsplaceholder?false:true}
                    label="Well"
                    data={wellsplaceholder||[]}
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
                      style={{ marginBottom: 20 }}
                      autoUpload={true}
                      onError={(reason) => {
                        onErrorFun(reason);
                      }}
                      /************************************************
                       * THE PAGE THAT SHOULD RECEIVE THE POST METHOD *
                       *   TO UPLOAD THE FILES GOES HERE IN ACTION    *
                       ************************************************/
                      action={BACK_URL+"uploadData/"}
                      multiple
                      draggable
                    >
                      <div style={{ height: 40, paddingTop: "8px" }}>
                        Click or drag files to this area to upload
                      </div>
                    </Uploader>
                  ) : (
                    <></>
                  )}
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        overflowWrap: "normal",
                        color: msg["color"],
                      }}
                    >
                      {msg["msg"]}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
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
