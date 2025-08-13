import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Login from './Components/Login';
import Register from './Components/Register';
import Error from './Components/Error';
import userContext from '../src/Utility/UserContext'

const AppLayout = () => {
    return <>
        <userContext.Provider value={{ user: null, setUser: () => {}, isLoggedIn: false }}>
            <Outlet />
        </userContext.Provider>
    </>
}


const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
        errorElement: <Error />
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/Register",
        element: <Register />,
    },
    {
        path: "/main",
        element: <AppLayout />,
        children: [
            {
                path: "/main/register",
                element: <Register />,
            },
        ]
    }
]);

const root = createRoot(document.getElementById('root'));

root.render(
    <RouterProvider router={router} />
)
