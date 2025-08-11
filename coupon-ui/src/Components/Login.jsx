const Login = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-900 h-28 flex items-center justify-center">
                    <h2 className="text-3xl font-bold text-white">Sign In</h2>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
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
                            type="password"
                            placeholder="Enter your password"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-700 focus:border-gray-700 outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                            <input
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
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 rounded-lg hover:opacity-90 transition"
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
