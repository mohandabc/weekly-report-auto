
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
      <header className="flex flex-col bg-header min-h-screen">
        <div className="flex sticky top-40 justify-center items-center">
        <div class="pt-24">
      <div class="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div class="flex flex-col w-full justify-center items-start text-center md:text-left">
          <h1 class="my-4 text-5xl font-bold leading-tight">
            Welcome {user.name} !
          </h1>
          <p class="leading-normal text-2xl mb-8">
          A set of protocols and tools designed to extract data from your Analytics account into custom reports for more automated and efficient reporting and analysis !
          </p>
        </div>
      </div>
    </div>
        </div>
      </header>
    </div>
    </>

  );
};
