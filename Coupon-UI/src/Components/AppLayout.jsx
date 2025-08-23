import Header from "./Header";
import { useState, useEffect } from "react";
import UserContext from "../Utility/UserContext";
import { Outlet, useNavigate } from "react-router";
import { Progress } from "@/Components/ui/progress"; // shadcn progress import
import { OfflineFallback } from "@/Components/offline-fallback"


const AppLayout = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(10);

    // Check if user is stored in localStorage or sessionStorage
    const [user, setUser] = useState(() => {
        const storedUserObject = localStorage.getItem("user");
        return storedUserObject ? JSON.parse(storedUserObject) : null;
    });

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
        }

        const timer = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 10 : prev + 10));
        }, 500);
        return () => clearInterval(timer);

    }, [user, navigate]);

    if (!user) {
        return (
            <div className="flex items-center justify-center w-screen h-screen bg-white">
                <div className="w-64">
                    <Progress value={progress} className="w-full" />
                </div>
            </div>
        );
    }

    return (
        <UserContext.Provider value={{ user, setUser, isLoggedIn: !!user }}>
            <Header className="fixed top-0 left-0 w-full h-16 bg-gray-800 text-white flex items-center px-4" />
            <OfflineFallback>
                <Outlet />
            </OfflineFallback>
        </UserContext.Provider>
    );
};

export default AppLayout;
