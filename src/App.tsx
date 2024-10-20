import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import NoPage from './pages/NoPage/NoPage';
import DefaultLayout from './layout/DefaultLayout/DefaultLayout';
import Venue from './pages/Venue/Venue';
import { useAppSelector } from './redux/hooks/hook';
import BookingHistory from './pages/BookingHistory/BookingHistory';
import 'mapbox-gl/dist/mapbox-gl.css';
import Opinions from './pages/Opinions/Opinions';
import Stadistics from './pages/Stadistics/Stadistics';

function App() {
  const userData = useAppSelector((state) => state.userData.data)
  return (
    <Router >
      <DefaultLayout>
        <Routes>
          <Route index path='/home' element={<Home />} />
          {userData&&<Route path='/venue' element={<Venue/>} />}
          {userData&&<Route path='/bookings' element={<BookingHistory/>} />}
          {userData&&<Route path='/opinions' element={<Opinions/>}/>}
          {userData&&<Route path='/stadistics' element={<Stadistics/>}/>}
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </DefaultLayout>
    </Router>
  );
}

export default App;
