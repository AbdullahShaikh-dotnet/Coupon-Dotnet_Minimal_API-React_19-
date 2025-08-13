import { useContext, useEffect, useState } from "react";
import userContext from "../Utility/UserContext";
import { useNavigate } from "react-router";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const { user, setUser } = useContext(userContext);
    let navigate = useNavigate();

    useEffect(() => {
        // Validate if user is already logged in by using token saved in localStorage
        // const token = localStorage.getItem('token');
        // if (token) {
        //     navigate("/main");
        // } else {
        //     setUser(null);
        // }

    }, []);


    const handleLogin = async (e) => {
        e.preventDefault();

        const loginRequest = async (url) => {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            return res.ok ? res.json() : null;
        };

        let data = await loginRequest('/API/Login') || await loginRequest('/api/login');
        
        if (!data || data.isSuccess === false) {
            alert(data?.errorMessages?.join(', ') || 'Login failed');
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            return;
        }

        setUser(data.result);
        
        
        if (rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('token', data.result.token);
        }

        localStorage.setItem('isLoggedIn', true);
        setUsername('');
        setPassword('');
        setRememberMe(false);
        navigate("/main");
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                {/* Card Header */}
                <div className="h-28 flex items-center justify-center">
                    <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            onKeyUp={(e) => { setUsername(e.target.value) }}
                            type="text"
                            placeholder="Enter your username"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-700 focus:border-gray-700 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            onKeyUp={(e) => { setPassword(e.target.value) }}
                            type="password"
                            placeholder="Enter your password"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-700 focus:border-gray-700 outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                            <input
                                onChange={(e) => { setRememberMe(e.target.checked) }}
                                type="checkbox"
                                className="peer hidden"
                            />
                            <span className="w-5 h-5 mr-2 flex items-center justify-center border border-gray-400 rounded-md peer-checked:bg-gray-800 peer-checked:border-gray-800 transition">
                                <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            Remember me
                        </label>
                        <a
                            href="#"
                            className="text-sm text-gray-700 hover:underline"
                        >
                            Forgot password?
                        </a>
                    </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6">
                    <button onClick={(e) => handleLogin(e)}
                        type="submit"
                        className="cursor-pointer w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 rounded-lg hover:opacity-90 transition"
                    >
                        Sign In
                    </button>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Don&apos;t have an account?{" "}
                        <a
                            href="#"
                            className="text-gray-900 font-medium hover:underline"
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
