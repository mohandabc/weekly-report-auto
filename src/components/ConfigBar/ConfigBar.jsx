import { DateSelector, ActionButton } from "..";

import { SideBar } from "../../components/SideBar";
import React from "react";
import { dateStartEndState } from "../../shared/globalState";
import { useRecoilValue } from "recoil";
import home from "../../assets/home.svg";
import { Loader } from "../../components";
import { Link } from "react-router-dom";
import { useState } from "react";

import ReactDOM from "react-dom";
import "./styles.css";

import { Input, InputGroup, Whisper, Tooltip } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import InfoIcon from "@rsuite/icons/legacy/Info";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";

const styles = {
  height: 38,
  width: 255,
  marginBottom: 20,
  marginLeft: 40,
};

export const ConfigBar = ({ title, configBarAction, options }) => {
  const [activeKey, setActiveKey] = React.useState("1");
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
        <SideBar activeKey={activeKey} onSelect={setActiveKey} />
      </div>
      <header
        className={`flex flex-col bg-header min-h-screen text-white text-3xl  justify-center items-center`}
      >
        <div className="absolute mt-36">
          <Loader></Loader>
        </div>

        <div className="sticky top-8 ">
          <div className="flex justify-center">
            <div className="py-9">
              <h1 className="text-white text-3xl text-center">{title}</h1>
            </div>
          </div>
          <div className="flex ">
            {/* @TODO impliment these components */}
            {options.rig ? (
              <InputGroup inside style={styles}>
                <Input style={{ width: 300 }} placeholder="Rig Name" />
                <InputGroup.Addon>
                  <Whisper
                    placement="bottom"
                    speaker={<Tooltip> Help information</Tooltip>}
                  >
                    <InfoIcon />
                  </Whisper>
                </InputGroup.Addon>
              </InputGroup>
            ) : (
              <></>
            )}
            {options.well ? (
              <InputGroup inside style={styles}>
                <Input style={{ width: 300 }} placeholder="Well Name" />
                <InputGroup.Addon>
                  <Whisper
                    placement="top"
                    speaker={<Tooltip> Help information</Tooltip>}
                  >
                    <InfoIcon />
                  </Whisper>
                </InputGroup.Addon>
              </InputGroup>
            ) : (
              <></>
            )}
          </div>
          <div className="flex ">
            {options.pole ? (
              <InputGroup inside style={styles}>
                <Input style={{ width: 300 }} placeholder="Pole " />
                <InputGroup.Addon>
                  <Whisper
                    placement="top"
                    speaker={<Tooltip> Help information</Tooltip>}
                  >
                    <InfoIcon />
                  </Whisper>
                </InputGroup.Addon>
              </InputGroup>
            ) : (
              <></>
            )}
            {options.phase ? (
              <InputGroup inside style={styles}>
                <Input style={{ width: 300 }} placeholder="Phase" />
                <InputGroup.Addon>
                  <Whisper
                    placement="top"
                    speaker={<Tooltip> Help information</Tooltip>}
                  >
                    <InfoIcon />
                  </Whisper>
                </InputGroup.Addon>
              </InputGroup>
            ) : (
              <></>
            )}
          </div>
          {options.datePicker === "range" ? (
            <div className="flex-initial w-64">
              <DateSelector></DateSelector>
            </div>
          ) : (
            <>
              <div>
                <div className="flex-initial w-64 justify-center mx-10">
                  <DateSelector></DateSelector>
                </div>
              </div>
            </>
          )}
          <div className="flex-initial w-64 justify-center mx-10 my-4">
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
