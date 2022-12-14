import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';

import { BrowserRouter, Routes, Route,} from "react-router-dom";

import {DailyPage, MainPage, WeeklyPage} from './pages';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
      <Routes>
        <Route index element={<MainPage />} />
        <Route path="weekly" element={<WeeklyPage />}/>
        <Route path="daily" element={<DailyPage />}/>
          
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
