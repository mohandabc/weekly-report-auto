/**********************************************************
 * TODO : FIND SOMETHING THAT SHOULD BE HERE ON MAIN PAGE *
 **********************************************************/

import { TopMenu } from "../../components/TopMenu";
import React from "react";
import { useAuth } from "../../services/useAuth";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../../shared/globalState";

export const MainPage = () => {
  const darkMode = useRecoilValue(darkModeState);
  const { user } = useAuth();
  return (
    <>
      <div
        className={`sticky top-0 z-30 w-full dark:bg-black`}
      >
        <TopMenu
          appearance={`${darkMode ? "subtle": "default"}`}
        />
      </div>
      <header
        className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}
      >
        <div className="flex sticky top-40 justify-center items-center">
          <div className="pt-24">
            <h1 className="my-4 mx-9 text-2xl font-bold leading-tight text-slate-200">
              Welcome {user.name} !
            </h1>
            <p className="leading-normal text-2xl mb-8 text-slate-200">
              Here is a set of protocols and tools designed to extract data into
              custom reports for more automated and efficient reporting and
              analysis !
            </p>
          </div>
        </div>
      </header>
    </>
  );
};
