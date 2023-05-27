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
  EOWR,
  RunDeliverable,
  DataUploader,
  LoginPage,
  LogoutPage
} from "./pages";
import { BoDailyPage, BoWeeklyPage } from "./pages/BackOffice";
import { ProtectedRoute } from "./components";
import { AuthProvider } from "./api/useAuth";
import { TopMenu } from "./components/TopMenu";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* TODO: Dont forget to remove the strict mode when doployin because the strict mode renders everything twice */}
    <RecoilRoot>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<ProtectedRoute><TopMenu /><MainPage /></ProtectedRoute>} />
            <Route path="/back-office" element={<ProtectedRoute><TopMenu /><BackOffice /></ProtectedRoute>} />
            <Route path="/front-office" element={<ProtectedRoute><TopMenu /><FrontOffice /></ProtectedRoute>} />
            <Route path="/weeklyBo" element={<ProtectedRoute><TopMenu /><BoWeeklyPage /></ProtectedRoute>} />
            <Route path="/dailyBo" element={<ProtectedRoute><TopMenu /><BoDailyPage /></ProtectedRoute>} />
            <Route path="/eowr" element={<ProtectedRoute><TopMenu /><EOWR /></ProtectedRoute>} />
            <Route path="/run" element={<ProtectedRoute><TopMenu /><RunDeliverable /></ProtectedRoute>} />
            <Route path="/data" element={<ProtectedRoute><TopMenu /><DataUploader /></ProtectedRoute>} />
            <Route path="/logout" element={<ProtectedRoute><TopMenu /><LogoutPage /></ProtectedRoute>} />

            {/* No top menu needed here in login page */}
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
