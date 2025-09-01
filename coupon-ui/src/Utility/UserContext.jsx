import { createContext } from "react";

const UserContext = createContext({
    user: null,
    setUser: () => {},
    isLoggedIn: false,
    token: null,
    refreshToken: null,
    setToken: () => { },
    setRefreshToken: () => { },
    details: null,
    setDetails: () => { },
});

export default UserContext;