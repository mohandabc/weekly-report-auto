import React, { useEffect, useState } from "react";

import { PaginationComp } from "../../../components";
import { DateRangePicker } from "rsuite";
import { Form, Schema } from "rsuite";
import {
  SelectPicker,
  Input,
  InputGroup,
  Tooltip,
  Whisper,
  Button,
} from "rsuite";
import { API_URL, BACK_URL } from "../../../constants/URI";
import { getData } from "../../../api/api";
import "./styles.css";

const styles = {
  wide: { height: 38, width: 250, marginLeft: 10, marginRight: 10 },
};

const data_placeHolder = [
  // Test populating data
  "TEST-1",
  "TEST-2",
].map((item) => ({ label: item, value: item }));

const rotarySys_placeHolder = ["Top Drive", "Kelly"].map((item) => ({
  label: item,
  value: item,
}));

const TrippingType_placeHolder = ["RIH", "POOH"].map((item) => ({
  label: item,
  value: item,
}));

const tripReason_placeHolder = [
  "Pick Up",
  "Run Back",
  "Drilling",
  "Wiper Trip",
  "Scraping",
  "Completion",
  "Clean Out",
  "Coring",
  "TD",
  "BHA",
  "Slow ROP",
  "Logging",
  "DST",
  "Fishing",
  "DPRB",
  "Cement Plug",
  "Safety String",
  "Milling",
].map((item) => ({ label: item, value: item }));

const lastCSG_placeHolder = [
  '30"',
  '18" 5/8',
  '13" 3/8',
  '9" 5/8',
  '7"',
  '4" 1/2',
].map((item) => ({ label: item, value: item }));

const drillString_placeHolder = ['5"', '5" 1/2', '3"', '3" 1/2'].map(
  (item) => ({ label: item, value: item })
);

const casedHole_placeHolder = ["Cased", "Open"].map((item) => ({
  label: item,
  value: item,
}));

const phase_placeHolder = [
  '12"1/4',
  '16"',
  '17"1/2',
  '22"',
  '26"',
  '28"',
  '30"',
  '3"3/4',
  '36"',
  '4"1/2',
  '4" 3/4',
  '6"',
  '8"1/2',
  '8.375"',
  "Completion",
  "Decompletion",
  "Drill Out CMT",
  "Flat Time",
  'Inter Phase 12"1/4 - 8"1/2',
  'Inter Phase 16" - 12"1/4',
  'Inter Phase 17"1/2 - 12"1/4',
  'Inter Phase 22" - 16"',
  'Inter Phase 22" - 17 1/2"',
  'Inter Phase 24" - 16"',
  'Inter Phase 26" - 16"',
  'Inter Phase 26" - 17"1/2',
  'Inter Phase 28" - 22"',
  'Inter Phase 28" - 24"',
  'Inter Phase 28" - 26"',
  'Inter Phase 30" - 28"',
  'Inter Phase 36" - 26"',
  'Inter Phase 36" - 28"',
  'Inter Phase 36" - 30"',
  'Inter Phase 6"- 3"3/4',
  'Inter Phase 6"- 4"3/4',
  'Inter Phase 8"1/2 - 6"',
  "Recertification",
  "Rig Move",
  "Workover",
].map((item) => ({ label: item, value: item }));

export const TrippingSpeed = () => {
  const [formValue, setFormValue] = React.useState({
    well: undefined,
    rig: undefined,
    rotarySys: undefined,
    phase: undefined,
    lastCSG: undefined,
    TrippingType: undefined,
    tripReason: undefined,
    tripNumber: undefined,
    casedHole: undefined,
    drillString: undefined,
    BHAname: undefined,
    benchmarkTS: undefined,
    benchmarkCT: undefined,
    threshold: undefined,
    dateRangeValue: undefined,
  });
  const formRef = React.useRef();
  const schemStringType = Schema.Types.StringType().isRequired(
    "This field is required."
  );
  const schemNumberType = Schema.Types.NumberType().isRequired(
    "This field is required."
  );
  const model = Schema.Model({
    well: schemNumberType,
    rig: schemNumberType,
    rotarySys: schemStringType,
    phase: schemStringType,
    lastCSG: schemStringType,
    // TrippingType: schemStringType,
    tripReason: schemStringType,
    // tripNumber: schemNumberType,
    casedHole: schemStringType,
    drillString: schemStringType,
    BHAname: schemStringType,
    // benchmarkTS: schemStringType,
    // benchmarkCT: schemStringType,
    // threshold: schemStringType,
    // dateRangeValue: Schema.Types.ArrayType().isRequired("This field is required."),
  });

  const [loadingValue, setLoadingValue] = React.useState(false);
  const [shake, setShake] = React.useState(false);

  const [dateRangeValue, setDateRangeValue] = React.useState([
    new Date(),
    new Date(),
  ]);
  const [data, setData] = useState([]);

  const [wellsplaceholder, setWellsplaceholder] = useState(0);
  const [rigsplaceholder, setRigsplaceholder] = useState(0);

  const [BHAname, setBHAname] = useState("");

  const [msg, setMsg] = useState(0);

  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
    populateWellRigPickers();
  }, []);

  const processInput = () => {
    /***************************************************************************
     * TODO: FURTHER PROCESSING , SEND PARAMS TO WHATEVER THE OTHER SIDE IS ;) *
     ***************************************************************************/
    if (!formRef.current.check()) {
      setShake(true);
      setMsg({
        msg: `Please complete all required fields before proceeding`,
        color: "text-red-500",
      });
      setTimeout(() => {
        setShake(false);
      }, 820);
      return;
    }

    console.log("Params from TrippingSpeed : ", formValue);
    setLoadingValue(true);
    formValue["well"] = wellsplaceholder.find(
      (well) => well.value === formValue["well"]
    ).label;
    formValue["rig"] = rigsplaceholder.find(
      (rig) => rig.value === formValue["rig"]
    ).label;
    formValue["dateRangeValue"] = dateRangeValue;
    getData(BACK_URL, "TrippingSpeed/", formValue).then((res) => {
      if (!("error" in res)) {
        setData(res);
      } else {
        setMsg({ msg: res["error"], color: "text-red-500" });
      }
      setLoadingValue(false);
      console.log("Returned Results : ", res);
    });
  };

  function populateWellRigPickers() {
    const path = "api/reports/getwells";
    getData(API_URL, path, formValue).then((res) => {
      let wells = res.result["wells"].map((item) => ({
        label: item["well"],
        value: item["wid"],
      }));
      let rigs = res.result["wells"].map((item) => ({
        label: item["rig"],
        value: item["wid"],
      }));
      setWellsplaceholder(wells || []);
      setRigsplaceholder(rigs || []);
    });
  }

  function WellRigConnection(event) {
    const well = wellsplaceholder.find((well) => well.value === event);
    if (well) {
      setFormValue((prevState) => ({
        ...prevState,
        well: well.value,
      }));
    }

    const rig = rigsplaceholder.find((rig) => rig.value === event);
    if (rig) {
      setFormValue((prevState) => ({
        ...prevState,
        rig: rig.value,
      }));
    }
  }

  const resetStates = (newMsg) => {
    setDateRangeValue([new Date(), new Date()]);
    setData([]);
    setMsg(newMsg);
  };
  return (
    <>
      {data.length !== 0 ? (
        <PaginationComp data={data} resetStates={resetStates}></PaginationComp>
      ) : (
        <div
          className={`sticky rounded-xl bg-gray-200 dark:bg-stone-700 h-auto ${
            shake ? "animate-shake" : ""
          }`}
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
                Tripping Speed Analysis
              </h1>
            </div>
          </div>

          <Form
            onSubmit={processInput}
            ref={formRef}
            model={model}
            formValue={formValue}
            onChange={(formValue) => setFormValue(formValue)}
            onCheck={() =>
              setFormValue({
                well: formValue["well"],
                rig: formValue["rig"],
                rotarySys: formValue["rotarySys"],
                phase: formValue["phase"],
                lastCSG: formValue["lastCSG"],
                // TrippingType: formValue["TrippingType"],
                tripReason: formValue["tripReason"],
                // tripNumber: formValue["tripNumber"],
                casedHole: formValue["casedHole"],
                drillString: formValue["drillString"],
                BHAname: formValue["BHAname"],
                // benchmarkTS: formValue["benchmarkTS"],
                // benchmarkCT: formValue["benchmarkCT"],
                // threshold: formValue["threshold"],
                // dateRangeValue: formValue["dateRangeValue"],
              })
            }
          >
            <div
              className={`flex duration-1000 relative transform transition-all ease-out
              ${
                // hiding components when they first appear and then applying a translate effect gradually
                animation
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <Form.Group controlId="well" style={styles.wide}>
                <Form.Control
                  accepter={SelectPicker}
                  name="well"
                  onChange={WellRigConnection}
                  placeholder="Well"
                  loading={wellsplaceholder ? false : true}
                  data={wellsplaceholder || []}
                  style={styles.wide}
                />
              </Form.Group>
              <Form.Group controlId="rig" style={styles.wide}>
                <Form.Control
                  accepter={SelectPicker}
                  name="rig"
                  onChange={WellRigConnection}
                  placeholder="Rig"
                  loading={rigsplaceholder ? false : true}
                  data={rigsplaceholder || []}
                  style={styles.wide}
                />
              </Form.Group>
              <Form.Group controlId="rotarySys" style={styles.wide}>
                <Form.Control
                  accepter={SelectPicker}
                  name="rotarySys"
                  // onChange={setRotarySys}
                  placeholder="Rotary System"
                  data={rotarySys_placeHolder}
                  style={styles.wide}
                />
              </Form.Group>
              <Form.Group controlId="phase" style={styles.wide}>
                <Form.Control
                  accepter={SelectPicker}
                  name="phase"
                  // onChange={setPhase}
                  placeholder="Phase"
                  data={phase_placeHolder}
                  style={styles.wide}
                />
              </Form.Group>
            </div>
            <div
              className={`flex duration-1000 relative transform transition-all ease-out
            ${
              // hiding components when they first appear and then applying a translate effect gradually
              animation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            >
              <Form.Group controlId="lastCSG" style={styles.wide}>
                <Form.Control
                  accepter={SelectPicker}
                  name="lastCSG"
                  // onChange={setLastCSG}
                  placeholder="Last CSG Shoe [m]"
                  data={lastCSG_placeHolder}
                  style={styles.wide}
                />
              </Form.Group>
              <Form.Group controlId="TrippingType" style={styles.wide}>
                <Whisper
                  placement="top"
                  speaker={
                    <Tooltip>The Trip Type is automatically set !</Tooltip>
                  }
                >
                  <span>
                    <Form.Control
                      accepter={SelectPicker}
                      name="TrippingType"
                      // onChange={setTrippingType}
                      placeholder="Tripping Type"
                      data={TrippingType_placeHolder}
                      style={styles.wide}
                      disabled
                    />
                  </span>
                </Whisper>
              </Form.Group>
              <Form.Group controlId="tripReason" style={styles.wide}>
                <Form.Control
                  accepter={SelectPicker}
                  name="tripReason"
                  // onChange={setTripReason}
                  placeholder="Trip reason"
                  data={tripReason_placeHolder}
                  style={styles.wide}
                />
              </Form.Group>
              <Form.Group controlId="trip_number" style={styles.wide}>
                <Whisper
                  placement="top"
                  speaker={
                    <Tooltip>
                      The Trip Number is automatically calculated. Do not skip
                      trips !
                    </Tooltip>
                  }
                >
                  <span>
                    <Form.Control
                      accepter={SelectPicker}
                      name="trip_number"
                      // onChange={setTripNumber}
                      placeholder="Trip number"
                      data={data_placeHolder}
                      style={styles.wide}
                      disabled
                    />
                  </span>
                </Whisper>
              </Form.Group>
            </div>
            <div
              className={`flex duration-1000 relative transform transition-all ease-out
            ${
              // hiding components when they first appear and then applying a translate effect gradually
              animation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            >
              <Form.Group controlId="casedHole" style={styles.wide}>
                <Form.Control
                  accepter={SelectPicker}
                  name="casedHole"
                  // onChange={setCasedHole}
                  placeholder="Cased Hole/Open Hole"
                  data={casedHole_placeHolder}
                  style={styles.wide}
                />
              </Form.Group>
              <Form.Group controlId="drillString" style={styles.wide}>
                <Form.Control
                  accepter={SelectPicker}
                  name="drillString"
                  // onChange={setDrillString}
                  placeholder="Drill String Size"
                  data={drillString_placeHolder}
                  style={styles.wide}
                />
              </Form.Group>
              <Form.Group controlId="BHAname" style={styles.wide}>
                <Form.Control
                  accepter={Input}
                  name="BHAname"
                  onChange={setBHAname}
                  placeholder="BHA Name"
                  data={data_placeHolder}
                  style={styles.wide}
                  value={BHAname}
                />
              </Form.Group>
              <Form.Group
                controlId="BenchmarkTS"
                style={{ marginTop: 6, marginLeft: 10 }}
              >
                <InputGroup style={styles.wide}>
                  <Input
                    name="BenchmarkTS"
                    // onChange={setBenchmarkTS}
                    placeholder="Benchmark (Tripping Speed)"
                    data={data_placeHolder}
                    disabled
                  />
                  <InputGroup.Addon>m/h</InputGroup.Addon>
                </InputGroup>
              </Form.Group>
            </div>
            <div
              className={`flex duration-1000 relative transform transition-all ease-out
            ${
              // hiding components when they first appear and then applying a translate effect gradually
              animation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            >
              <Form.Group
                controlId="BenchmarkCT"
                style={{ marginTop: 6, marginLeft: 10 }}
              >
                <InputGroup style={styles.wide}>
                  <Input
                    name="BenchmarkCT"
                    // onChange={setBenchmarkCT}
                    placeholder="Benchmark (Connection Time)"
                    data={data_placeHolder}
                    disabled
                  />
                  <InputGroup.Addon>min</InputGroup.Addon>
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="threshold" style={{ marginTop: 6 }}>
                <Whisper
                  placement="top"
                  speaker={
                    <Tooltip>
                      The Threshold is automatically calculated for the main
                      time.
                    </Tooltip>
                  }
                >
                  <span>
                    <InputGroup style={styles.wide}>
                      <Input
                        name="threshold"
                        // onChange={setThreshold}
                        placeholder="Threshold"
                        data={data_placeHolder}
                        disabled
                      />
                      <InputGroup.Addon>T</InputGroup.Addon>
                    </InputGroup>
                  </span>
                </Whisper>
              </Form.Group>

              <Form.Group controlId="dateRangeValue">
                <DateRangePicker
                  name="dateRangeValue"
                  value={dateRangeValue}
                  onChange={(event) => {
                    setDateRangeValue(event);
                    setFormValue((prevState) => ({
                      ...prevState,
                      dateRangeValue: dateRangeValue,
                    }));
                  }}
                  format="dd/MM/yyyy HH:mm:ss"
                  style={{
                    width: 520,
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                />
              </Form.Group>
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
              <Form.Group controlId="button">
                <Button
                  appearance="primary"
                  type="submit"
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 16,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingRight: 20,
                    paddingLeft: 20,
                  }}
                  loading={loadingValue}
                >
                  Submit
                </Button>
              </Form.Group>
            </div>
          </Form>
          <div className="flex justify-center items-center">
            <div className="flex-col items-center mb-6">
              <div className={`text-center text-sm ${msg["color"]} mt-4`}>
                {msg["msg"]}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
