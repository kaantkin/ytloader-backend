import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import YTLoader from './Pages/ytloader';
import Download from './Pages/download';
import Navbar from './Navbar/navbar';

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<YTLoader />} />
        <Route path='/download' element={<Download />} />
      </Routes>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </React.StrictMode>
);