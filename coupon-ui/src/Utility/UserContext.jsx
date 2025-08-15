import { createContext } from "react";

const userContext = createContext({
    user: null,
    setUser: () => {},
    isLoggedIn: false,
});

export default userContext;