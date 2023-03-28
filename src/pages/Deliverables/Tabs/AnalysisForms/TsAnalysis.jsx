import React from "react";
import { Table, Button, Checkbox, Pagination } from "rsuite";
import { DatePicker } from "rsuite";
import { TrippingSpeed } from "../..";
import { DELIVERABLE_CONFIG_BAR_OPTIONS } from "../../../../constants/constants";
import { BACK_URL } from "../../../../constants/URI";
import { deleteDoc } from "../../../../api/api";
import "./styles.css";

const { Column, HeaderCell, Cell } = Table;

function minutesToTime(minutes) {
  const date = new Date();
  date.setMinutes(Math.floor(minutes));
  date.setSeconds((minutes % 1) * 60);
  return date;
}

function formatDateString(dateString) {
  let date = new Date(dateString);
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let hours = ("0" + date.getHours()).slice(-2);
  let minutes = ("0" + date.getMinutes()).slice(-2);
  let formattedDateString =
    day + "-" + month + "-" + year + " " + hours + ":" + minutes;
  return formattedDateString;
}

const EditableCell = ({ rowData, dataKey, onChange, ...props }) => {
  const editing = rowData.status === "EDIT";
  return (
    <Cell
      {...props}
      className={editing ? "table-content-editing" : ""}
      style={{ padding: "0px", color: "black", fontSize: "11px" }}
    >
      {editing ? (
        dataKey === "date_to" || dataKey === "date_from" ? (
          <DatePicker
            format="yyyy-MM-dd HH:mm:ss"
            onChange={(date) =>
              onChange(rowData.standNum, dataKey, date.toISOString())
            }
          />
        ) : dataKey === "connection_time" ? (
          <DatePicker
            format="mm:ss"
            defaultValue={minutesToTime(rowData[dataKey])}
            onChange={(date) =>
              onChange(
                rowData.standNum,
                dataKey,
                date.getMinutes() + date.getSeconds() / 60
              )
            }
          />
        ) : dataKey === "abnormal" ? (
          <Checkbox
            checked={rowData[dataKey]}
            onClick={(event) =>
              onChange(rowData.standNum, dataKey, !rowData[dataKey])
            }
          />
        ) : dataKey === "depth_from" || dataKey === "depth_to" ? (
          <input
            type="number"
            className="rs-input"
            defaultValue={rowData[dataKey]}
            onChange={(event) =>
              onChange(rowData.standNum, dataKey, event.target.value)
            }
          />
        ) : (
          <input
            className="rs-input"
            defaultValue={rowData[dataKey]}
            onChange={(event) =>
              onChange(rowData.standNum, dataKey, event.target.value)
            }
          />
        )
      ) : dataKey === "abnormal" ? (
        // <Checkbox defaultChecked={rowData[dataKey]} disabled></Checkbox>
        <Checkbox checked={rowData[dataKey]} disabled />
      ) : dataKey === "connection_time" ? (
        <span className="table-content-edit-span">
          {minutesToTime(rowData[dataKey]).getMinutes() +
            ":" +
            minutesToTime(rowData[dataKey]).getSeconds()}
        </span>
      ) : dataKey === "date_to" || dataKey === "date_from" ? (
        <span className="table-content-edit-span">
          {formatDateString(rowData[dataKey])}
        </span>
      ) : (
        <span className="table-content-edit-span">{rowData[dataKey]}</span>
      )}
    </Cell>
  );
};

const ActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell
      {...props}
      style={{ padding: "0px", color: "black", fontSize: "11px" }}
    >
      <Button
        appearance="link"
        onClick={() => {
          onClick(rowData.standNum);
        }}
      >
        {rowData.status === "EDIT" ? "Save" : "Edit"}
      </Button>
    </Cell>
  );
};

export const TsAnalysis = (TsAnalysisData) => {
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [defData, setdefData] = React.useState(
    TsAnalysisData.TsAnalysisData.standline
  );
  const [showTstab, setShowTstab] = React.useState(false);

  const data = defData.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });

  const handleChange = (standNum, key, value) => {
    const nextData = Object.assign([], defData);
    nextData.find((item) => item.standNum === standNum)[key] = value;
    setdefData(nextData);
  };
  const handleEditState = (standNum) => {
    const nextData = Object.assign([], defData);
    const activeItem = nextData.find((item) => item.standNum === standNum);
    activeItem.status = activeItem.status ? null : "EDIT";
    setdefData(nextData);
  };

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const handleDeleteClick = () => {
    deleteDoc(BACK_URL, "TrippingSpeed/deleteDoc/", TsAnalysisData.doc_id).then(
      (res) => {
        if ("msg" in res && res.status === 200) {
          setShowTstab(true);
          alert("Document deleted successfully");
        }
      }
    );
  };

  const handleSaveClick = () => {
    const updatedData = defData.map(object => {
      const { status, ...otherFields } = object;
      return otherFields;
    });
    TsAnalysisData.TsAnalysisData['standline'] = updatedData;
    console.log("The document that is going to be updated with its new data : ",
    {"document_id":TsAnalysisData.doc_id, "params" : TsAnalysisData.TsAnalysisData});
    alert("Save button function isn't implemented yet !, an update function should be implemented in the back side first !");
  };

  const handleCancelClick = () => {
    setShowTstab(true);
  };

  const [animation, setAnimation] = React.useState(false);

  React.useEffect(() => {
    setAnimation(true);
  },[]);

  return showTstab ? (
    <TrippingSpeed options={DELIVERABLE_CONFIG_BAR_OPTIONS}></TrippingSpeed>
  ) : (
    <div className="py-4 px-4">
      <div
        className={`text-black duration-1000 transition-all ease-out ${
          // hiding components when they first appear and then applying a translate effect gradually
          animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <Table
          bordered
          cellBordered
          rowHeight={30}
          padding={100}
          height={342}
          width={1000}
          data={data}
        >
          <Column width={50}>
            <HeaderCell>N</HeaderCell>
            <EditableCell dataKey="standNum" onChange={handleChange} />
          </Column>
          <Column width={130}>
            <HeaderCell>Start</HeaderCell>
            <EditableCell dataKey="date_from" onChange={handleChange} />
          </Column>

          <Column width={130}>
            <HeaderCell>End</HeaderCell>
            <EditableCell dataKey="date_to" onChange={handleChange} />
          </Column>

          <Column width={90}>
            <HeaderCell>Depth from</HeaderCell>
            <EditableCell dataKey="depth_from" onChange={handleChange} />
          </Column>

          <Column width={80}>
            <HeaderCell>Depth to</HeaderCell>
            <EditableCell dataKey="depth_to" onChange={handleChange} />
          </Column>

          <Column width={105}>
            <HeaderCell>Connection Time</HeaderCell>
            <EditableCell dataKey="connection_time" onChange={handleChange} />
          </Column>

          <Column width={120}>
            <HeaderCell>Tripping Speed</HeaderCell>
            <EditableCell dataKey="tripping_speed" onChange={handleChange} />
          </Column>

          <Column width={72}>
            <HeaderCell>Abnormal</HeaderCell>
            <EditableCell dataKey="abnormal" onChange={handleChange} />
          </Column>

          <Column width={150}>
            <HeaderCell>Description</HeaderCell>
            <EditableCell dataKey="description" onChange={handleChange} />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>-</HeaderCell>
            <ActionCell dataKey="standNum" onClick={handleEditState} />
          </Column>
        </Table>
        <div className="px-5">
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="xs"
            layout={["total", "-", "limit", "|", "pager", "skip"]}
            total={TsAnalysisData.TsAnalysisData.standline.length}
            limitOptions={[10, 20, 30]}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            onChangeLimit={handleChangeLimit}
          />
        </div>
      </div>
      <div
        className={`text-zinc-500 dark:text-black flex justify-between delay-200 duration-1000 transition-all ease-out ${
          // hiding components when they first appear and then applying a translate effect gradually
          animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="float-left p-2 text-sm">
          <div>
            <b>Well :</b> {TsAnalysisData.TsAnalysisData.well}
          </div>
          <div>
            <b>Trip Number : </b> {TsAnalysisData.TsAnalysisData.trip_number}
          </div>
        </div>
        <div className="float-right p-2 text-sm">
          <div>
            <b>CSG Size : </b> {TsAnalysisData.TsAnalysisData.csg_size}
          </div>
          <div>
            <b>Drill Pipe Size : </b>
            {TsAnalysisData.TsAnalysisData.drill_pipe_size}
          </div>
        </div>
      </div>
      <div>
        <div
          className={`flex justify-center my-4 delay-200 duration-1000 transition-all ease-out ${
            // hiding components when they first appear and then applying a translate effect gradually
            animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <Button
            appearance="default"
            className="mx-4"
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button color="blue" appearance="primary" className="mx-4" onClick={handleSaveClick}>
            Save
          </Button>
        </div>
        <div
          className={`flex justify-center delay-200 duration-1000 transition-all ease-out ${
            // hiding components when they first appear and then applying a translate effect gradually
            animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <Button color="red" appearance="primary" onClick={handleDeleteClick}>
            Delete Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};