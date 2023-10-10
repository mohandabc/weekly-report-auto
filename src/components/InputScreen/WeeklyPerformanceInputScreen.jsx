import { useState, useEffect } from "react";
import { Button, SelectPicker, Form, Input, DateRangePicker } from "rsuite";
import { getData } from "../../api/api";
import { API_URL } from "../../constants/URI";

const dummyData = [
  { label: "Item 1", value: 1 },
  { label: "Item 2", value: 2 },
];

const styles = {
    wide: { height: 38, width: 250, marginLeft: 10, marginRight: 10 },
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

export const WeeklyPerformanceInputScreen = () => {
  const [animation, setAnimation] = useState(false);
  const [loadingValue, setLoadingValue] = useState(false);
  const [wellsplaceholder, setWellsplaceholder] = useState([]);
  const [rigsplaceholder, setRigsplaceholder] = useState([]);

  const [formValues, setFormValues] = useState({
    well: undefined,
    rig: undefined,
    pole: undefined,
    contractor: undefined,
    section: undefined,
    pipeSize: undefined,
    benchmarkTS: undefined,
    benchmarkCT: undefined,
    daterange: undefined,
  });

  useEffect(() => {
    setAnimation(true);
    populateWellRigPickers();
  }, []);
  useEffect(() => {
    console.log(formValues);
  }, [formValues]);

  const handleChange = (value, name) => {
    setFormValues({ ...formValues, [name]: value });
    if (value === '5"' || value === '5" 1/2') {
      setFormValues({
        ...formValues,
        benchmarkTS: 500,
        benchmarkCT: 3,
        pipeSize: value,
      });
    } else if (value === '3"' || value === '3" 1/2') {
      setFormValues({
        ...formValues,
        benchmarkTS: 600,
        benchmarkCT: 2,
        pipeSize: value,
      });
    }
  };

  const handleSubmit = () => {
    const values = Object.values(formValues);
    console.log(values);
  };

  function populateWellRigPickers() {
    const path = "api/reports/getwells";
    getData(API_URL, path, formValues).then((res) => {
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
      setFormValues((prevState) => ({
        ...prevState,
        well: well.value,
      }));
    }

    const rig = rigsplaceholder.find((rig) => rig.value === event);
    if (rig) {
      setFormValues((prevState) => ({
        ...prevState,
        rig: rig.value,
      }));
    }
  }

  return (
    <div
      className={`flex flex-col bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}
    >
      <header
        className={`flex flex-col bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed text-white text-3xl justify-center items-center`}
      >
        <div
          className={`sticky rounded-xl bg-gray-200 dark:bg-stone-700 w-full max-w-md duration-1000 transform transition-all ease-out ${
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
          <div
            className={`flex flex-wrap items-center justify-center duration-1000 relative transform transition-all ease-out
            ${
              // hiding components when they first appear and then applying a translate effect gradually
              animation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <Form onSubmit={handleSubmit}>
              <SelectPicker
                name="rig"
                placeholder="Rig"
                data={rigsplaceholder}
                value={formValues.rig}
                onChange={WellRigConnection}
                loading={rigsplaceholder ? false : true}
                style={styles.wide}
              />
              <SelectPicker
                name="well"
                placeholder="Well"
                data={wellsplaceholder}
                value={formValues.well}
                onChange={WellRigConnection}
                loading={wellsplaceholder ? false : true}
                style={styles.wide}
              />
              <SelectPicker
                name="pole"
                placeholder="Pole"
                data={dummyData}
                defaultValue={formValues.pole}
                onChange={(value) => handleChange(value, "pole")}
                style={styles.wide}
              />
              <SelectPicker
                name="contractor"
                placeholder="Contractor"
                data={dummyData}
                defaultValue={formValues.contractor}
                onChange={(value) => handleChange(value, "contractor")}
                style={styles.wide}
              />
              <SelectPicker
                name="section"
                placeholder="Section"
                data={section_placeHolder}
                defaultValue={formValues.section}
                onChange={(value) => handleChange(value, "section")}
                style={styles.wide}
              />
              <SelectPicker
                name="pipeSize"
                placeholder="Pipe Size"
                data={drillString_placeHolder}
                defaultValue={formValues.pipeSize}
                onChange={(value) => handleChange(value, "pipeSize")}
                style={styles.wide}
              />
              <Input
                type="number"
                name="benchmarkTS"
                placeholder="Benchmark TS"
                value={formValues.benchmarkTS}
                style={{ height: 35, width: 250, marginLeft: 10, marginRight: 10, marginTop: 8 }}
                disabled
              />
              <Input
                type="number"
                name="benchmarkCT"
                placeholder="Benchmark CT"
                value={formValues.benchmarkCT}
                style={{ height: 35, width: 250, marginLeft: 10, marginRight: 10, marginTop: 5 }}
                disabled
              />
              <DateRangePicker
                name="daterange"
                format="dd/MM/yyyy HH:mm:ss"
                defaultValue={formValues.daterange}
                onChange={(value) => handleChange(value, "daterange")}
                style={styles.wide}
              />
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
        </div>
      </header>
    </div>
  );
};
