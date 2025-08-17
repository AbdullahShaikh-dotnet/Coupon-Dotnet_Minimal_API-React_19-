import { createContext } from "react";

const UserContext = createContext({
    user: null,
    setUser: () => {},
    isLoggedIn: false,
});

export default UserContext;