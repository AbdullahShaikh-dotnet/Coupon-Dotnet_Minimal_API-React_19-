import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
    createBrowserRouter,
    RouterProvider,
    Outlet
} from "react-router";
import Login from './Components/Login';
import Register from './Components/Register';

// eslint-disable-next-line react-refresh/only-export-components
const AppLayout = () => {
    return <>
        <h1>Main</h1>
        <Outlet />
    </>
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "/Login",
                element: <Login />,
            },

            {
                path: "/Register",
                element: <Register />,
            },
        ]
    },
]);

const root = createRoot(document.getElementById('root'));

root.render(
    <RouterProvider router={router} />
)
