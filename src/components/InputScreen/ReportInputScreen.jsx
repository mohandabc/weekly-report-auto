import { darkModeState } from "../../shared/globalState";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { TopMenu } from "../TopMenu";
import { Loader } from "../Loader";
import { DateRangePicker } from "rsuite";
import { ActionButton } from "../ActionButton";
import { dateStartEndState } from "../../shared/globalState";



export const ReportInputScreen = ({ title, configBarAction, options }) => {
    const dateStartEnd = useRecoilValue(dateStartEndState);
    const [value, setValue] = React.useState([
      new Date(dateStartEnd.split(" - ")[0]),
      new Date(dateStartEnd.split(" - ")[1]),
    ]);
  
    const params = {
      dates: value
        ? formatDate(value[0]) + " - " + formatDate(value[1])
        : dateStartEnd,
    };
  
    function formatDate(date) {
      if (date)
        return [
          padTo2Digits(date.getMonth() + 1),
          padTo2Digits(date.getDate()),
          date.getFullYear(),
        ].join("/");
    }
  
    function padTo2Digits(num) {
      return num.toString().padStart(2, "0");
    }
  
    const [animation, setAnimation] = useState(false);
    const darkMode = useRecoilValue(darkModeState);
  
    useEffect(() => {
      setAnimation(true);
    },[]);
  
    return (
      <div className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}>
          <TopMenu appearance={`${darkMode ? "subtle": "default"}`}/>
       
          <header
            className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed text-white text-3xl ${
              options.option === "Reporting" ? "justify-center" : ""
            } items-center`}
          >
            <>
              <div className="absolute mt-56 z-50">
                <Loader></Loader>
              </div>
              <div className={`sticky rounded-xl bg-gray-200 dark:bg-stone-700 w-1/4 h-1/3 duration-1000 transform transition-all ease-out ${
                                animation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>

                <div className="flex justify-center items-center">
                  <div className="py-9">
                    <h1 className={`text-zinc-500 dark:text-black text-3xl text-center delay-200 duration-1000 relative transform transition-all ease-out
                      ${
                        // hiding components when they first appear and then applying a translate effect gradually
                        animation
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-12"
                      }`}>
                      {title}
                    </h1>
                  </div>
                </div>

                <div className={`flex items-center justify-center duration-1000 relative transform transition-all ease-out
                      ${
                        // hiding components when they first appear and then applying a translate effect gradually
                        animation
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-12"
                      }`}
                >
                  <DateRangePicker
                    value={value}
                    onChange={setValue}
                    format="dd-MM-yyyy"
                    style={{
                      width: 257,
                    }}
                  />
                </div>
                <div
                  className={`flex items-center justify-center m-11 duration-1000 relative transform transition-all ease-out
                      ${
                        // hiding components when they first appear and then applying a translate effect gradually
                        animation
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-12"
                      }`}
                >
                  <ActionButton
                    className="bg-blue-500 hover:bg-blue-700 text-black font-bold text-base py-2 px-4 rounded "
                    text="Submit"
                    action={configBarAction}
                    args={[params]}
                  ></ActionButton>
                </div>
              </div>
            </>
          
        </header>
      </div>
    );
  };
  