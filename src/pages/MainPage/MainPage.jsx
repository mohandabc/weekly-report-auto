import React, { useState, useEffect } from "react";
import { useAuth } from "../../api/useAuth";
import "./mainPage.css";

export const MainPage = () => {
  const { user } = useAuth();

  return (
    <>
      <div className={`sticky top-0 z-30 w-full dark:bg-black`} />
      <header className={`flex flex-col h-72 bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed header`}>
        <div className="flex sticky top-40 justify-center items-center">
          <div className="py-12 px-48 bg-gradient-to-b from-sky-900 to-transparent rounded-lg shadow-lg mx-9">
            <h1 className="my-4 text-4xl font-bold leading-tight text-white animate__animated animate__fadeInUp">
              <span className="text-4xl text-sky-400">
                Welcome {user.name}!
              </span>
            </h1>
            <p className="leading-normal text-2xl mb-8 text-white px-16 animate__animated animate__fadeInUp">
              <span className="text-2xl font-semibold">OilPort:</span> Your Gateway to Oil Field Data and Analytics
              <br />
              <span className="text-2xl font-semibold">Unlock</span> the power of data-driven insights with our reporting app.
              <br /> OilPort provides a comprehensive portal to oil field data and analytics,
              <br /> offering you the tools and protocols needed to extract and analyze data efficiently.
              <br /> Discover automated reporting and gain valuable insights for your operations.
            </p>
          </div>
        </div>
      </header>
      <section id="stats" className="h-full pt-10 bg-gradient-to-b from-cyan-900 to-blue-900 dark:from-black dark:to-indigo-400 bg-cover bg-center hidden">
        <section id="main" className={`grid grid-col-1 xl:grid-cols-3 gap-4 place-items-top px-2 pb-4`}>
          {/* Place your content here */}
        </section>
      </section>
    </>
  );
};

