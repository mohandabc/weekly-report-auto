import { Link } from "react-router-dom";

export const MainPage = () =>{
    return (
        <div className="App">
            <header className="flex flex-col bg-header min-h-screen">

                <div className="py-5">
                    <h1 className="text-white text-3xl text-center">RTOM Dashboards</h1>
                </div>

                <div className="flex flex-wrap">

                    <div className="w-1/4 px-8">
                        <Link className="no-underline text-header" to="daily">
                            <div className="bg-gray-200 h-60 w-full p-4 text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg">
                                <h3>BO Daily Report</h3>
                                <p>Automaticall Generates a back office daily report for a specific day</p>
                            </div>
                        </Link>
                    </div>

                    <div className="w-1/4 px-8 ">
                        <Link className="no-underline text-header" to="weekly">
                            <div className="bg-gray-200 h-60 w-full py-4 text-center rounded-lg shadow-md mb-3 transform transition duration-200 ease-out hover:scale-105 hover:shadow-lg">
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