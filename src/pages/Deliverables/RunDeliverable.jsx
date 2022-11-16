/**************************************************************************************
 *         RETURNS THE CONFIGBAR WITH "DELIVERABLE" OPTION TO SHOW THE TABS           *
 * REMINDER : CONFIGBAR SHOULD BE REPLACED WITH DELIVERABLE AND REPORTING COMPONENTS  *
 *            IN THE FUTURE TO PREVENT IT FROM SPAGITIFYING WHEN ADDING NEW COMPONENTS*
 **************************************************************************************/
import React from "react";
import { ConfigBar } from "../../components";
import { DELIVERABLE_CONFIG_BAR_OPTIONS } from "../../constants/constants";

const processInput =  (params) =>{
    
  console.log("Params from RunDeliverable : ", params)
}

export const RunDeliverable = () => {
  return (
    <div className="App">

      <ConfigBar
        // title="Run Deliverable"
        // configBarAction = {processInput} 
        options={DELIVERABLE_CONFIG_BAR_OPTIONS}
      ></ConfigBar>
    </div>
    
  );
};
