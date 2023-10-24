import { useState, useEffect } from "react";
import { Button, Form, Input, DateRangePicker, TagPicker } from "rsuite";
import { getData } from "../../api/api";
import { API_URL } from "../../constants/URI";
import { predefinedRanges } from "../../constants/constants";

const styles = {
  wide: {
    width: 250,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
};

const section_placeHolder = [
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

const drillString_placeHolder = ['5"', '5" 1/2', '3"', '3" 1/2'].map(
  (item) => ({ label: item, value: item })
);

const pole_placeHolder = ["Centre", "Sud", "Nord"].map((item) => ({
  label: item,
  value: item,
}));

const contractor_placeHolder = ["ENAFOR", "ENTP"].map((item) => ({
  label: item,
  value: item,
}));

export const WeeklyPerformanceInputScreen = ({
  setWeeklyPerformanceData,
  setEventsKPI,
  setDrillState,
  setTrippingSpeed,
  setMonitoringKPI,
  setNPTAnalysis,
}) => {
  const [animation, setAnimation] = useState(false);
  const [loadingValue, setLoadingValue] = useState(false);
  const [wellsplaceholder, setWellsplaceholder] = useState([]);
  const [rigsplaceholder, setRigsplaceholder] = useState([]);

  const [formValues, setFormValues] = useState({
    well: [],
    rig: [],
    pole: undefined,
    contractor: undefined,
    section: undefined,
    pipeSize: [],
    benchmarkTS: "",
    benchmarkCT: "",
    daterange: undefined,
  });

  useEffect(() => {
    setAnimation(true);
    populateWellRigPickers();
  }, []);

  useEffect(() => {
    const pipeSize = formValues.pipeSize;
    const isFive = pipeSize.includes('5"') || pipeSize.includes('5" 1/2');
    const isThree = pipeSize.includes('3"') || pipeSize.includes('3" 1/2');
    const benchmarkTS =
      isFive && isThree ? "500,600" : isFive ? "500" : isThree ? "600" : "";
    const benchmarkCT =
      isFive && isThree ? "2,3" : isFive ? "3" : isThree ? "2" : "";
    setFormValues({ ...formValues, benchmarkTS, benchmarkCT });
  }, [formValues.pipeSize]);

  const handleChange = (value, name) => {
    setFormValues({ ...formValues, [name]: value });
    if (
      Array.isArray(value) &&
      value[0] instanceof Date &&
      value[1] instanceof Date
    ) {
      setFormValues({
        ...formValues,
        startDate: formatDate(value[0], true, "-"),
        endDate: formatDate(value[1], true, "-"),
      });
    }
  };

  function formatDate(date, dayFirst = false, separater = "/") {
    if (date) {
      let formattedDate = [
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
        date.getFullYear(),
      ];
      if (dayFirst === true) {
        formattedDate.unshift(formattedDate.pop());
      }
      return formattedDate.join(separater);
    }
  }

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function intToString(list) {
    return list.map(String);
  }

  function undefToEmpty(value) {
    return value ?? [];
  }

  const handleSubmit = () => {
    console.log(formValues);
    var dataFrame = Object.fromEntries(
      Object.entries(formValues).map(([key, value]) => {
        return [
          key,
          Array.isArray(value) ? intToString(value) : undefToEmpty(value),
        ];
      })
    );

    dataFrame.benchmarkTS = formValues.benchmarkTS.split(",");
    dataFrame.benchmarkCT = dataFrame.benchmarkCT.split(",");
    let values = dataFrame.well;
    let valueToWid = Object.fromEntries(
      wellsplaceholder.map((item) => [item.value, item.wid])
    );
    dataFrame.well = values.map((value) => valueToWid[value]).map(String);
    let valueToRid = Object.fromEntries(
      rigsplaceholder.map((item) => [item.value, item.rid])
    );
    dataFrame.rig = values.map((value) => valueToRid[value]).map(String);
    console.log("Params : ", dataFrame);
    getWeeklyData(dataFrame);
  };

  function populateWellRigPickers() {
    const path = "api/reports/getwells";
    getData(API_URL, path, formValues).then((res) => {
      let wells = res.result["wells"].map((item, index) => ({
        label: item["well"],
        wid: item["wid"],
        value: index,
      }));
      let rigs = res.result["wells"].map((item, index) => ({
        label: item["rig"],
        rid: item["rid"],
        value: index,
      }));
      setWellsplaceholder(wells || []);
      setRigsplaceholder(rigs || []);
    });
  }

  const getWeeklyData = (params) => {
    const path = "api/reports/weekly_performance_oilport";
    getData(API_URL, path, params).then((res) => {
      let data = res.result;
      console.log(data);
      console.log(setWeeklyPerformanceData);
      setWeeklyPerformanceData(data || {});
      setEventsKPI(data["events_data"] || {});
      setDrillState(data['drill_state_CT'] || {});
      setTrippingSpeed(data["events_data"] || {});
      setMonitoringKPI(data["monitoring_kpi"] || {});
      setNPTAnalysis(data["NPT_analysis"] || {});
    });
  };

  function WellRigConnection(values) {
    if (values) {for (let value of values) {
      const well = wellsplaceholder.find((well) => well.value === value);
      if (well) {
        setFormValues((prevState) => ({
          ...prevState,
          well: values,
        }));
      }

      const rig = rigsplaceholder.find((rig) => rig.value === value);
      if (rig) {
        setFormValues((prevState) => ({
          ...prevState,
          rig: values,
        }));
      }
    }}
  };

  const handleRigClean = () => {
    setFormValues((prevState) => ({
      ...prevState,
      rig: [],
      well: []
    })); // clear the value of rig
  };
  
  const handleWellClean = () => {
    setFormValues((prevState) => ({
      ...prevState,
      rig: [],
      well: []
    })); // clear the value of well
  };

  return (
    <div
      className={`flex flex-col bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}
    >
      <header
        className={`flex flex-col bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed text-white text-3xl justify-center items-center`}
      >
        <div
          className={`sticky rounded-xl bg-gray-200 dark:bg-stone-700 duration-1000 transform transition-all ease-out ${
            animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="flex justify-center items-center">
            <div className="py-2 md:py-9">
              <h1
                className={`text-zinc-500 dark:text-black text-xl md:text-2xl text-center delay-200 duration-1000 relative transform transition-all ease-out
            ${
              // hiding components when they first appear and then applying a translate effect gradually
              animation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
              >
                Weekly Performance
              </h1>
            </div>
          </div>
          <Form onSubmit={handleSubmit}>
            <div
              className={`flex duration-1000 relative transform transition-all ease-out
            ${
              // hiding components when they first appear and then applying a translate effect gradually
              animation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            >
              <TagPicker
                name="rig"
                placeholder="Rig (ALL)"
                data={rigsplaceholder}
                value={formValues.rig}
                onChange={(value) => {
                  handleChange(value, "rig");
                  WellRigConnection(value);
                }}
                loading={rigsplaceholder ? false : true}
                style={{
                  width: 250,
                  marginLeft: 10,
                  marginRight: 10,
                  color: "#000",
                }}
                onClean={handleRigClean} // use the custom function for onClean
              />
              <TagPicker
                name="well"
                placeholder="Well (ALL)"
                data={wellsplaceholder}
                value={formValues.well}
                onChange={(value) => {
                  handleChange(value, "well");
                  WellRigConnection(value);
                }}
                loading={wellsplaceholder ? false : true}
                style={{
                  width: 250,
                  marginLeft: 10,
                  marginRight: 10,
                  color: "#000",
                }}
                onClean={handleWellClean} // use the custom function for onClean
              />
              <TagPicker
                name="pole"
                placeholder="Pole (ALL)"
                data={pole_placeHolder}
                defaultValue={formValues.pole}
                onChange={(value) => handleChange(value, "pole")}
                style={{
                  width: 250,
                  marginLeft: 10,
                  marginRight: 10,
                }}
              />
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
              <TagPicker
                name="contractor"
                placeholder="Contractor (ALL)"
                data={contractor_placeHolder}
                defaultValue={formValues.contractor}
                onChange={(value) => handleChange(value, "contractor")}
                style={styles.wide}
              />
              <TagPicker
                name="section"
                placeholder="Section (ALL)"
                data={section_placeHolder}
                defaultValue={formValues.section}
                onChange={(value) => handleChange(value, "section")}
                style={styles.wide}
              />
              <TagPicker
                name="pipeSize"
                placeholder="Pipe Size (ALL)"
                data={drillString_placeHolder}
                defaultValue={formValues.pipeSize}
                onChange={(value) => handleChange(value, "pipeSize")}
                style={styles.wide}
              />
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
              <Input
                name="benchmarkTS"
                placeholder="Benchmark TS"
                value={formValues.benchmarkTS}
                style={{
                  height: 35,
                  width: 250,
                  marginLeft: 10,
                  marginRight: 10,
                  marginTop: 25,
                }}
                disabled
              />
              <Input
                name="benchmarkCT"
                placeholder="Benchmark CT"
                value={formValues.benchmarkCT}
                style={{
                  height: 35,
                  width: 250,
                  marginLeft: 10,
                  marginRight: 10,
                  marginTop: 25,
                }}
                disabled
              />
              <DateRangePicker
                ranges={predefinedRanges}
                name="daterange"
                format="dd/MM/yyyy"
                defaultValue={formValues.daterange}
                onChange={(value) => handleChange(value, "daterange")}
                style={styles.wide}
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
                  marginTop: 20,
                  marginBottom: 20,
                }}
                loading={loadingValue}
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
        <div
          className={`flex items-center justify-center mt-6 md:mt-10 duration-1000 relative transform transition-all ease-out md:pb-8
            ${
              // hiding components when they first appear and then applying a translate effect gradually
              animation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
        ></div>
      </header>
    </div>
  );
};
