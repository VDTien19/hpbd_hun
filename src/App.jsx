import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { publicRoutes } from '@/routes';

function App() {
    return (
        <>
            <Router>
                <Routes>
                    {
                        publicRoutes.map((route, index) => {
                            const Page = route.component;
                            return <Route key={index} path={route.path} element={<Page />} ></Route>
                        })
                    }
                </Routes>
            </Router>
        </>
    );
}

export default App;