import { DateSelector, ActionButton} from '..';


import {dateStartEndState} from '../../shared/globalState';
import {useRecoilValue} from 'recoil';
import home from '../../assets/home.svg';
import {Loader} from '../../components';
import { Link } from 'react-router-dom';
import { useState } from 'react';





export const ConfigBar = ({configBarAction, options})=>{
    const dateRange = useRecoilValue(dateStartEndState);
    const [well, setWell] = useState(0);
    const [rig, setRig] = useState(0);
    const [pole, setPole] = useState(0);
    const [phase, setPhase] = useState(0);

    const params = {
        well : well,
        rig : rig,
        pole : pole,
        phase : phase,
        dates : dateRange,//'2021-09-01 - 2021-09-30',
    }

    return (

        <header className={`flex flex-col bg-header min-h-screen text-white text-3xl align-middle justify-center items-center`}>
            <Loader></Loader>
            <Link className="" to='/'>
                <img src={home}  className="fixed top-5 left-10 w-12 z-50" alt='home'></img>
            </Link>
            <div className= "sticky top-5">


            <div className='flex '>
                {/* @TODO impliment these components */}
                {
                    options.well ? <></>:<></>
                }
                {
                    options.rig ? <></>:<></>
                }
                {
                    options.pole ? <></>:<></>
                }
                {
                    options.phase ? <></>:<></>
                }
                {
                    options.datePicker ==='range' ? 
                    <div className='flex-initial w-64'>
                        <DateSelector></DateSelector>
                    </div>
                    : <>
                    {/* Here goes a single date picker component */}
                    </>
                }
                
                <ActionButton className="bg-blue-500 hover:bg-blue-700 text-black font-bold text-base py-2 px-4 mx-auto  sticky top-5 rounded" 
                            text="Submit" 
                            action={configBarAction} 
                            args={[params]}>
                </ActionButton>
            </div>

            </div>
        </header>


    
    );
}