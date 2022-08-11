import { Link } from "react-router-dom";

export const MainPage = () =>{
    return (
        <div className="App">
            <header className="flex flex-col bg-header min-h-screen text-white text-3xl align-middle justify-center items-center">
                <h1 className="text-green-400">RTOM Dashboards</h1>
                <div>
                    <Link to="daily">Daily</Link>
                </div>
                <div>
                    <Link to="weekly">Weekly</Link>
                </div>
            </header>
        </div>
        
    );
}