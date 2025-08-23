import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Error from "./Components/Error";
import Home from "./Components/Home";
import About from "./Components/About";
import AppLayout from "./Components/AppLayout";
import { Toaster } from "@/Components/ui/sonner";
import CouponFields from "./Components/CouponFields";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/main",
    element: <AppLayout />,
    children: [
      {
        path: "/main/register",
        element: <Register />,
      },
      {
        path: "/main/home",
        element: <Home />,
      },
      {
        path: "/main/about",
        element: <About />,
      },
      {
        path: "/main/coupon/:operation/:couponID",
        element: <CouponFields />,
      }
    ],
  },
]);

const root = createRoot(document.getElementById("root"));

root.render(
    <StrictMode>
        <Toaster richColors closeButton />
        <RouterProvider router={router} />
    </StrictMode>
);
