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
        <Header />
        <Outlet />
      </UserContext>
    </>
  );
};


export default AppLayout;