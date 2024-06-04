import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import NoPage from './pages/NoPage/NoPage';
import DefaultLayout from './layout/DefaultLayout/DefaultLayout';

function App() {
  return (
    <DefaultLayout>
      <Router >
        <Routes>
          <Route index path='/home' element={<Home />} />
          
          
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Router>
    </DefaultLayout>
  );
}

export default App;
