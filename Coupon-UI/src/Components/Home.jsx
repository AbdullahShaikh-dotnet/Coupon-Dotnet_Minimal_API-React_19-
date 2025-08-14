


import React, { useContext } from 'react';
import userContext from "../Utility/UserContext";
const Home = () => {
    const { user, setUser } = useContext(userContext);

    console.log("User in Home:", user); 

    return <>
        <h1>Home</h1>
    </>
}

export default Home;