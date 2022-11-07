import React from "react";

import { ActionButton, ConfigBar } from "../../components";

import { DELIVERABLE_CONFIG_BAR_OPTIONS } from "../../constants/constants";

const processData =  (params) =>{
    
  console.log("Params from Tripping Speed : ", params)
}

export const TrippingSpeed = () => {
  return (
    <div className="App">
      <ConfigBar
        title="Tripping Speed Analysis"
        configBarAction = {processData} 
        options={DELIVERABLE_CONFIG_BAR_OPTIONS}
      ></ConfigBar>
      <div className={`bg-slate-300 ${true? "hidden":""}`}>
        <div className="flex flex-row-reverse sticky top-14 px-10 py-4  z-40">
          <ActionButton className=" bg-green-500 hover:bg-green-700 text-black font-bold text-base py-2 px-4 rounded"></ActionButton>
        </div>
      </div>
    </div>
  );
};
