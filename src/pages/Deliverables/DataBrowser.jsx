import React from "react";
import { SideBar } from "../../components/SideBar";
import { Loader } from "../../components/Loader";
import { Uploader } from "rsuite";
import { SelectPicker } from "rsuite";
import { IconButton } from "rsuite";
import FileUploadIcon from "@rsuite/icons/FileUpload";
import { Tooltip, Whisper } from "rsuite";

export const DataBrowser = () => {
  const [uploaderValue, setUploaderValue] = React.useState([]);
  const uploader = React.useRef();

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

  return (
    <div className="App">
      <div className="flex flex-col h-72 bg-reporting_image min-h-screen bg-no-repeat bg-cover bg-center bg-fixed">
        <div className="fixed top-0 z-50 w-full">
          <SideBar />
        </div>
        <header
          className={`flex flex-col h-72 bg-reporting_image min-h-screen bg-no-repeat bg-cover bg-center bg-fixed text-white text-3xl items-center justify-center`}
        >
          <div className="absolute mt-56 z-50">
            <Loader></Loader>
          </div>
          <div className="overflow-y-auto h-3/6 rounded-xl bg-gray-200 w-1/3">
            <div className="flex justify-center items-center">
              <div className="py-9">
                <h1 className="text-zinc-500 text-3xl text-center">
                  Data Uploader
                </h1>
                <div className="items-center justify-center rounded-xl bg-gray-300 text-black text-sm my-10 p-10 text-center">
                  <div className="">
                    <Whisper speaker={<Tooltip>Send to server !</Tooltip>}>
                      <span>
                        <IconButton
                          style={{ height: 40, width: 80, marginBottom: 20 }}
                          icon={<FileUploadIcon />}
                          color="green"
                          appearance="primary"
                          onClick={() => {uploader.current.start()}}
                        />
                      </span>
                    </Whisper>
                  </div>
                  <SelectPicker
                    style={{ width: 238, marginBottom: 20 }}
                    label="Well"
                    data={wells_placeholder}
                  />
                  <Uploader
                    style={{ width: 238 }}
                    autoUpload={false}
                    ref={uploader}
                    action="//localhost:3000/upload"
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
