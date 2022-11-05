
import { SideBar } from "../../components/SideBar";
import React from "react";
import { useAuth } from "../../services/useAuth";

export const MainPage = () => {
  const { user }  = useAuth()
  return (
    <>
    <div className="App">
      <div className="sticky top-0 z-30 w-full">
        <SideBar />
      </div>
      <header className="flex flex-col h-72 bg-reporting_image min-h-screen bg-no-repeat bg-cover bg-center bg-fixed">
        <div className="flex sticky top-40 justify-center items-center">
        <div className="pt-24">
      <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
      <div className="sticky rounded-xl bg-gray-400 w-audo h-auto ">
        <div className="flex flex-col animate-pulse w-full justify-center items-start text-zinc-800 text-center md:text-left">
          <h1 className="my-4 mx-9 text-2xl font-bold leading-tight">
            Welcome {user.name} !
          </h1>
          <p className="leading-normal text-2xl mb-8">
          Here is a set of protocols and tools designed to extract data into custom reports for more automated and efficient reporting and analysis !
          </p>
        </div>
        </div>
      </div>
    </div>
        </div>
      </header>
    </div>
    </>

  );
};
