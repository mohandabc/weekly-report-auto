import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  MainPage,
  BackOffice,
  FrontOffice,
  DrillingBit,
  TrippingSpeed,
  DrillingState,
  ReamBream,
} from "./pages";
import { BoDailyPage, BoWeeklyPage } from "./pages/BackOffice";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/back-office" element={<BackOffice />} />
          <Route path="/front-office" element={<FrontOffice />} />
          <Route path="/weeklyBo" element={<BoWeeklyPage />} />
          <Route path="/dailyBo" element={<BoDailyPage />} />
          <Route path="/drillingBit" element={<DrillingBit />} />
          <Route path="/trippingSpeed" element={<TrippingSpeed />} />
          <Route path="/drillingState" element={<DrillingState />} />
          <Route path="/reamBream" element={<ReamBream />} />

          {/* Add other rouetes for other pages */}
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
