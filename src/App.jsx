import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';

import { publicRoutes } from '@/routes';

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route element={<Layout />}>
                        {
                            publicRoutes.map((route, index) => {
                                const Page = route.component;
                                return <Route key={index} path={route.path} element={<Page />} ></Route>
                            })
                        }
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;