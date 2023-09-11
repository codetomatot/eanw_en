import React from 'react';
import App from "./App";
import { createBrowserRouter, createRoutesFromElements, Route, Link, Outlet } from 'react-router-dom';
import Landing from './Landing';

export default function MainRoutes(props) {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<App />}>
                <Route index element={<Landing />} />
            </Route>
        )
    );
    return router;
}