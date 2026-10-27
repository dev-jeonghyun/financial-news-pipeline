import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import SelectInterest from './components/SelectInterest';
import MainPage from './pages/MainPage';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/interest" element={<SelectInterest />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/chart/:symbol" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
