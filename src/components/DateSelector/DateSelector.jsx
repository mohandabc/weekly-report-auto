
import React, { useEffect} from 'react';
import {dateStartState, dateEndState} from '../../shared/globalState';
import {useRecoilState} from 'recoil';
import Datepicker from 'flowbite-datepicker/Datepicker';
import DateRangePicker from 'flowbite-datepicker/DateRangePicker';

// import CalendarIcon from '../../assets/cal.svg';

export const DateSelector = ()=>{
    const [dateStart, setDateStart] = useRecoilState(dateStartState);
    const [dateEnd, setDateEnd] = useRecoilState(dateEndState);
    

    const editInputStart = ({target}) =>{
        setDateStart(target.value);
    }

    const editInputEnd = ({target}) =>{
        setDateEnd(target.value);
    }
    useEffect(()=>{

        const datepickerEl = document.getElementById('datepickerId');
        new DateRangePicker(datepickerEl, {
            // options
        });
        

    },[]);

    return (<div id="datepickerId">

    </div>);
    // return (
    //     <div data="date-rangepicker" className="flex items-center">
    //         <div className="relative">
    //             <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
    //                 <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
    //             </div>
    //             <input value = {dateStart} onChange={editInputStart} name="start" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start"/>
    //         </div>
    //         <span className="mx-4 text-gray-500">to</span>
    //         <div className="relative">
    //             <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
    //                 <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
    //             </div>
    //             <input value = {dateEnd} onChange={editInputEnd} name="end" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end"/>
    //         </div>
    //     </div>



    // );
}




//<input id='daterange-btn-range' type="text" onChange={editInput} value={dateStartEnd} >
