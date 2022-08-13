import { DateSelector, ActionButton} from '..';


import {dateStartEndState} from '../../shared/globalState';
import {useRecoilValue} from 'recoil';


export const ConfigBar = ({configBarAction})=>{
    const dateRange = useRecoilValue(dateStartEndState);

    const params = {
        dates : '2021-09-01 - 2021-09-30',
    }

    return (
    <div className='flex '>
        <div className='flex-initial w-64'>
            <DateSelector></DateSelector>
        </div>
        <ActionButton className="bg-blue-500 hover:bg-blue-700 text-black font-bold text-base py-2 px-4 mx-auto  sticky top-5 rounded" 
                    text="Submit" 
                    action={configBarAction} 
                    args={[params]}>
        </ActionButton>
    </div>
    );
}