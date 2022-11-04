
import { SideBar } from "../../components/SideBar";
import React from "react";
import {  Button  } from "rsuite";
import { useAuth } from "../../services/useAuth";

export const MainPage = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
    <div className="App">
      <div className="sticky top-0 z-30 w-full">
        <SideBar />
      </div>
      <header className="flex flex-col bg-header min-h-screen">
        <div className="flex sticky top-40 justify-center items-center">
        </div>
      </header>
    </div>
    </>

  );
};
