import { DateSelector, ActionButton} from '..';
import { getData } from '../../api/getData';

import gear from '../../assets/gear.svg';
import { generatePDF } from '../../utils';

import {chartsToPrintState, dateStartEndState} from '../../shared/globalState';
import {useRecoilValue} from 'recoil';


export const ConfigBar = ()=>{
    const chartsToPrint = useRecoilValue(chartsToPrintState);
    const dateRange = useRecoilValue(dateStartEndState);

    const params = {
        dates : dateRange
    }

    const test = ()=>console.log('helo');

    return (
    <div className='flex '>
        <div className='flex-initial w-64'>
            <DateSelector></DateSelector>
        </div>
        <ActionButton text="Submit" action={getData} args={['reports/daily_report', params]}></ActionButton>
        <ActionButton text="PDF" action={generatePDF} args={[chartsToPrint]}></ActionButton>
    </div>
    );
}