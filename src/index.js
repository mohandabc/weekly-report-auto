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
  RunDeliverable,
  DataUploader,
  LoginPage,
  LogoutPage
} from "./pages";
import { BoDailyPage, BoWeeklyPage } from "./pages/BackOffice";
import { ProtectedRoute } from "./components";
import { AuthProvider } from "./services/useAuth";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* TODO: Dont forget to remove the strict mode when doployin because the strict mode renders everything twice */}
    <RecoilRoot>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/back-office" element={<ProtectedRoute><BackOffice /></ProtectedRoute>} />
            <Route path="/front-office" element={<ProtectedRoute><FrontOffice /></ProtectedRoute>} />
            <Route path="/weeklyBo" element={<ProtectedRoute><BoWeeklyPage /></ProtectedRoute>} />
            <Route path="/dailyBo" element={<ProtectedRoute><BoDailyPage /></ProtectedRoute>} />
            <Route path="/run" element={<ProtectedRoute><RunDeliverable /></ProtectedRoute>} />
            <Route path="/data" element={<ProtectedRoute><DataUploader /></ProtectedRoute>} />
            <Route path="/logout" element={<ProtectedRoute><LogoutPage /></ProtectedRoute>} />
            <Route path="*" element={<LoginPage />} />

            {/* Add other rouetes for other pages */}
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
