import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { publicRoutes } from '@/routes';
import Layout from '@/components/Layout';

function App() {
    return (
        <>
            <Router>
                <Routes>
                    {
                        publicRoutes.map((route, index) => {
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
                        })
                    }
                </Routes>
            </Router>
        </>
    );
}

export default App;