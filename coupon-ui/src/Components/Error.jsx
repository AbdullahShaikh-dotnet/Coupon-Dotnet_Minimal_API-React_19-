import { Link, useRouteError } from "react-router";

const Error = () => {
    const Errors = useRouteError();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-600">
            <div className="p-8 flex flex-col items-center max-w-md w-full">
                <h1 className="text-9xl font-bold text-white mb-4">{Errors.status}</h1>
                <p className="text-3xl text-white mb-2">{Errors.statusText || "Something went wrong."}</p>
                <p className="text-white font-semibold text-xl">Please check the URL or try again later.</p>
            </div>

            <Link to={"/main/home"}>
                <div className="bg-white p-1 rounded-md px-4 text-md font-semibold text-gray-600">Back to Home</div>
            </Link>
        </div>
    )
}

export default Error;