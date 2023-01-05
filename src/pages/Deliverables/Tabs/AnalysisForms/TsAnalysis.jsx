import React from 'react';

import { Table, Button, Checkbox } from 'rsuite';
import { DatePicker } from 'rsuite';


const { Column, HeaderCell, Cell } = Table;

function minutesToTime(minutes) {
    const date = new Date();
    date.setMinutes(Math.floor(minutes));
    date.setSeconds((minutes % 1) * 60);
    return date;
  }

const EditableCell = ({ rowData, dataKey, onChange, ...props }) => {
    const editing = rowData.status === 'EDIT';
    return (
      <Cell {...props} className={editing ? 'table-content-editing' : ''} style={{ color: 'black', fontSize: '11px' }}>
        {editing ? (
          dataKey === 'date_to' || dataKey === 'date_from' ? (
            <DatePicker
              format="yyyy-MM-dd HH:mm:ss"
              defaultValue={new Date(rowData[dataKey])}
              onChange={(date) => onChange(rowData.id, dataKey, date.toLocaleString())}
            />
          ) : dataKey === 'connection_time' ? (
            <DatePicker
              format="mm:ss"
              defaultValue={minutesToTime(rowData[dataKey])}
              onChange={(date) => onChange(rowData.id, dataKey, date.getMinutes()+ date.getSeconds() / 60)}
            />
          ) : dataKey === 'abnormal' ? (
            <Checkbox
              defaultChecked={rowData[dataKey]}
              onChange={(value) => onChange(rowData.id, dataKey, value)}
            />
          ) : (
            <input
              className="rs-input"
              defaultValue={rowData[dataKey]}
              onChange={(event) => onChange(rowData.id, dataKey, event.target.value)}
            />
          )
        ) : (dataKey === 'abnormal' ? 
            <Checkbox defaultChecked={rowData[dataKey]} disabled></Checkbox>
                :
                <span className="table-content-edit-span">{rowData[dataKey]}</span>
            
        )}
      </Cell>
    );
  };

const ActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: '6px' }}>
      <Button
        appearance="link"
        onClick={() => {
          onClick(rowData.id);
        }}
      >
        {rowData.status === 'EDIT' ? 'Save' : 'Edit'}
      </Button>
    </Cell>
  );
};

export const TsAnalysis = (TsAnalysisData) => {
  const [data, setData] = React.useState(TsAnalysisData.TsAnalysisData);

  const handleChange = (id, key, value) => {
    const nextData = Object.assign([], data);
    nextData.find(item => item.id === id)[key] = value;
    setData(nextData);
  };
  const handleEditState = id => {
    const nextData = Object.assign([], data);
    const activeItem = nextData.find(item => item.id === id);
    activeItem.status = activeItem.status ? null : 'EDIT';
    setData(nextData);
  };

  return (
    <Table padding={100} height={420} width={900}  data={data}>
      <Column width={40}>
        <HeaderCell>standNum</HeaderCell>
        <EditableCell dataKey="standNum" onChange={handleChange} />
      </Column>
      <Column width={150}>
        <HeaderCell>date_from</HeaderCell>
        <EditableCell dataKey="date_from" onChange={handleChange} />
      </Column>

      <Column width={150}>
        <HeaderCell>date_to</HeaderCell>
        <EditableCell dataKey="date_to" onChange={handleChange} />
      </Column>

      <Column width={100}>
        <HeaderCell>depth_from</HeaderCell>
        <EditableCell dataKey="depth_from" onChange={handleChange} />
      </Column>
      
      <Column width={100}>
        <HeaderCell>depth_to</HeaderCell>
        <EditableCell dataKey="depth_to" onChange={handleChange} />
      </Column>

      <Column width={100}>
        <HeaderCell>connection_time</HeaderCell>
        <EditableCell dataKey="connection_time" onChange={handleChange} />
      </Column>

      <Column width={100}>
        <HeaderCell>abnormal</HeaderCell>
        <EditableCell dataKey="abnormal" onChange={handleChange} />
      </Column>

      <Column width={100}>
        <HeaderCell>description</HeaderCell>
        <EditableCell dataKey="description" onChange={handleChange} />
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>-</HeaderCell>
        <ActionCell dataKey="standNum" onClick={handleEditState} />
      </Column>
    </Table>
  );
};