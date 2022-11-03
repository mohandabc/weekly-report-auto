import { DateSelector, ActionButton } from "..";

import { SideBar } from "../../components/SideBar";
import React from "react";
import { dateStartEndState } from "../../shared/globalState";
import { useRecoilValue } from "recoil";
import { Loader } from "../../components";
import { useState } from "react";
import { DateRangePicker } from 'rsuite';

import "./styles.css";

import { SelectPicker } from "rsuite";


const styles = { left:{
  height: 38,
  width: 257,
  marginBottom: 30,
  marginRight: 40,},
  right:{
  height: 38,
  width: 257,
  marginBottom: 30,
  }
};

const wells_data = ['WOENS-1', 'KARS-3', 'DJHSE-1', 'HBKN-4', 'BIRN-1', 'EMR-1', 'RAA-8', 'HDZ-20'].map(
    item => ({ label: item, value: item })
  );

const rigs_data = ['TP1', 'TP2', 'TP3', 'TP4', 'TP5', 'TP6', 'TP7', 'TP8'].map(
    item => ({ label: item, value: item })
);

const poles_data = ['Nord', 'Centre', 'Sud'].map(
    item => ({ label: item, value: item })
);

const phases_data = ['1', '2', '3', '4', '5', '6', '7'].map(
    item => ({ label: item, value: item })
);

export const ConfigBar = ({ title, configBarAction, options }) => {
  const dateRange = useRecoilValue(dateStartEndState);
  const [well, setWell] = useState(0);
  const [rig, setRig] = useState(0);
  const [pole, setPole] = useState(0);
  const [phase, setPhase] = useState(0);

  const params = {
    well: well,
    rig: rig,
    pole: pole,
    phase: phase,
    dates: dateRange,
  };

  return (
    <div className="flex flex-col bg-header min-h-screen">
      <div className="fixed top-0 z-50 w-full">
        <SideBar/>
      </div>
      <header
        className={`flex flex-col bg-header min-h-screen text-white text-3xl  justify-center items-center`}
      >
        <div className="absolute mt-80">
          <Loader></Loader>
        </div>

        <div className="sticky top-8 ">
          <div className="flex  justify-center items-center">
            <div className="py-9">
              <h1 className="text-white text-3xl text-center">{title}</h1>
            </div>
          </div>
          <div className="flex ">
            {/* @TODO impliment these components */}
            {options.rig ? (
              <SelectPicker label="Rig" data={rigs_data} style={styles.left} />
            ) : (
              <></>
            )}
            {options.well ? (
              <SelectPicker label="Well" data={wells_data} style={styles.right} />
            ) : (
              <></>
            )}
          </div>
          <div className="flex ">
            {options.pole ? (
              <SelectPicker label="Pole" data={poles_data} style={styles.left} />
            ) : (
              <></>
            )}
            {options.phase ? (
                <SelectPicker label="Phase" data={phases_data} style={styles.right} />
            ) : (
              <></>
            )}
          </div>
          {options.datePicker === "range" ? (
            <div className="flex mx-8 justify-center items-center" style={styles.right}>
              <DateSelector></DateSelector>
            </div>
          ) : (
            <>
              <div>
                {/* <div className="flex-initial w-64 justify-center mx-10"> */}
                <DateRangePicker style={styles.left}/>
                {/* </div> */}
              </div>
            </>
          )}
          <div className="flex w-61 justify-center items-center">
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
