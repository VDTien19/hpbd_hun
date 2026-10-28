import { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import { publicRoutes } from '@/routes';
import Layout from '@/components/Layout';
import MusicPlayer from '@/components/MusicPlayer';
import { sendSessionStarted } from '@/services/birthdayEventService';

function App() {
    useEffect(() => {
        void sendSessionStarted();
    }, []);
    
    return (
        <>
            <Router>
                <MusicPlayer />
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let LayoutComponent = Layout;
                        if (route.layout) {
                            LayoutComponent = route.layout;
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <LayoutComponent>
                                        <Page />
                                    </LayoutComponent>
                                }
                            />
                        );
                    })}
                </Routes>
            </Router>
        </>
    );
}

export default App;
