import React from 'react';
import './layoutStyles.css';
import Toolbar from '../toolbar/Toolbar';
import Footer from '../footer/Footer';

const DefaultLayout = ({ children }) => {
    return (
        <>
            <Toolbar />
            <main style={{ minHeight: '100vh' }}>{children}</main>
            <Footer/>
        </>
    )
}

export default DefaultLayout;