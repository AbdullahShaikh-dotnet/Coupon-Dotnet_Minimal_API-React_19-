import Header from "./Header";
import { useState, useEffect } from "react";
import UserContext from "../Utility/UserContext";
import { Outlet } from "react-router";

const AppLayout = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <>
            <UserContext value={{ user, setUser, isLoggedIn: !!user }}>
                <Header className="fixed top-0 left-0 w-full h-16 bg-gray-800 text-white flex items-center px-4" />
                <Outlet />
            </UserContext>
        </>
    );
};


export default AppLayout;