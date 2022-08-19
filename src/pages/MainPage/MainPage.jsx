import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import gear from '../../assets/gear.svg';
import { darkMode } from "../../shared/globalState";

export const MainPage = () =>{
    const [isdarkMode, setIsDarkMode] = useRecoilState(darkMode);
    const toggleDarkMode = ()=>{
        setIsDarkMode(!isdarkMode);
        isdarkMode ? document.documentElement.classList.add('dark')
        : document.documentElement.classList.remove('dark')
    }

    return (
        <div className="App">
            <header className="flex flex-col bg-gray-200 dark:bg-header min-h-screen">

                <div className="py-5">
                    <img src={gear} className="absolute mx-4 w-8" onClick={toggleDarkMode} alt="..."/>
                    <h1 className="dark:text-white text-3xl text-center">RTOM Dashboards</h1>
                </div>

                <div className="flex flex-wrap">

                    <div className="w-1/4 px-8">
                        <Link className="no-underline text-header" to="daily">
                            <div className="bg-header dark:bg-gray-200 text-white dark:text-header h-60 w-full p-4 text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg">
                                <h3>BO Daily Report</h3>
                                <p>Automaticall Generates a back office daily report for a specific day</p>
                            </div>
                        </Link>
                    </div>

                    <div className="w-1/4 px-8 ">
                        <Link className="no-underline text-header" to="weekly">
                            <div className="bg-header dark:bg-gray-200 dark:text-black text-white h-60 w-full py-4 text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg">
                                <h3>BO Weekly Report</h3>
                                <p>Automaticall Generates a back office weekly report for a specific week</p>
                            </div>
                        </Link>
                    </div>


                    <div className="w-1/4 px-8">
                        <Link className="no-underline text-header" to="">
                            <div className="bg-gray-400 h-60 w-full p-4 text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg">
                                <h3>FO Daily Report</h3>
                                <p>Automaticall Generates a front office daily report for a specific day</p>
                            </div>
                        </Link>
                    </div>

                    <div className="w-1/4 px-8">
                        <Link className="no-underline text-header" to="">
                            <div className="bg-gray-400 h-60 w-full py-4 text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg">
                                <h3>FO Weekly Report</h3>
                                <p>Automaticall Generates a front office weekly report for a specific week</p>
                            </div>
                        </Link>
                    </div>

                </div>

            </header>
        </div>
        
    );
}