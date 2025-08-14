import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Login from './Components/Login';
import Register from './Components/Register';
import Error from './Components/Error';
import userContext from '../src/Utility/UserContext'
import Home from './Components/Home';
import Header from './Components/Header';

const AppLayout = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return <>
        <userContext.Provider value={{ user, setUser, isLoggedIn: !!user }}>
            <Header/>
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
            {
                path: "/main/home",
                element: <Home />,
            },
        ]
    }
]);

const root = createRoot(document.getElementById('root'));

root.render(
    <RouterProvider router={router} />
)
