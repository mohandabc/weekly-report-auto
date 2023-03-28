import { useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";
import { TopMenu } from "../TopMenu";

export const NotAllowed = () => {
    const darkMode = useRecoilValue(darkModeState);
    return (
        <div className="App">
        <TopMenu appearance={`${darkMode ? "subtle": "default"}`}/>
        <div className="flex flex-col bg-slate-400 dark:bg-slate-600 dark:text-white items-center justify-center relative text-3xl h-screen">
            You are not allowed to access this resource
        </div>
        </div>
    );
}