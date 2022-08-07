
import {dateStartEndState} from '../../shared/globalState';
import {useRecoilState} from 'recoil';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

import DateRangePicker from 'react-bootstrap-daterangepicker';


export const DateSelector = ()=>{
    const [dateStartEnd, setDateStartEnd] = useRecoilState(dateStartEndState);
    
    const editDates = (e)=>{
        setDateStartEnd(e.target.value);
    }

    return (
            <DateRangePicker onEvent={editDates} initialSettings={{ startDate: dateStartEnd.split(' - ')[0], endDate: dateStartEnd.split(' - ')[1] }}>
                <input type="text" className="form-control " />
            </DateRangePicker>
        );}