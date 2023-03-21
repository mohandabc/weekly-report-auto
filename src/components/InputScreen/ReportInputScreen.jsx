import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { Loader } from "../Loader";
import { DateRangePicker, SelectPicker} from "rsuite";
import { ActionButton } from "../ActionButton";
import { dateStartEndState } from "../../shared/globalState";
import { getData } from "../../api/api";
import { API_URL} from "../../constants/URI";
import { predefinedRanges } from "../../constants/constants";


export const ReportInputScreen = ({ title, configBarAction, options }) => {
    const dateStartEnd = useRecoilValue(dateStartEndState);
    const [animation, setAnimation] = useState(false);
    const [wellsplaceholder, setWellsplaceholder] = useState([]);
    const [value, setValue] = useState([
      new Date(dateStartEnd.split(" - ")[0]),
      new Date(dateStartEnd.split(" - ")[1]),
    ]);
    const [wid, setWid] = useState(null)

    const params = {
      wid :wid,
      dates: value
        ? formatDate(value[0]) + " - " + formatDate(value[1])
        : dateStartEnd,
      startDate:formatDate(value[0], true, "-"),
      endDate:formatDate(value[1], true, "-")
    };
    
    function formatDate(date, dayFirst=false, separater="/") {
      if (date){
        let formattedDate = [
          padTo2Digits(date.getMonth() + 1),
          padTo2Digits(date.getDate()),
          date.getFullYear(),
        ]
        if (dayFirst===true){
          formattedDate.unshift(formattedDate.pop());
        }
        return formattedDate.join(separater);
      }
    }
  
    function padTo2Digits(num) {
      return num.toString().padStart(2, "0");
    }
  
  
    useEffect(() => {
      setAnimation(true);
    },[]);
  
    useEffect(() => {
      const path = 'api/reports/getwells';
      getData(API_URL, path, {})
      .then(res=> {
        let data = res.result['wells'].map((item) => ({ label: item['name'], value: item['wid'] }));
        setWellsplaceholder(data || []) 
      });
    },[]);



    let inputScreenContent = [];
    

    if(options.well === true){
      inputScreenContent.push(<SelectPicker
        onChange={setWid}
        placeholder="Well"
        data={wellsplaceholder}
      
      />)
    }
    if (options.datePicker===true){
      inputScreenContent.push(<DateRangePicker
        ranges={predefinedRanges}
        value={value}
        onChange={setValue}
        format="dd-MM-yyyy"
        style={{
          width: 257,
        }}
        />
                                ) 
      }
      
    
    
  
    return (
      <div className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}>
          
       
          <header className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed text-white text-3xl justify-center items-center`}>
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
                  
                 {inputScreenContent}
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
        </header>
      </div>
    );
  };
  