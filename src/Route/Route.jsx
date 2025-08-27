import { createBrowserRouter } from "react-router-dom";
import Root from "../Layouts/Root";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import NotFound from "../Pages/NotFound/NotFound";
import Register from "../Pages/Login/Register";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../Layouts/DashboardLayout";


export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children : [
            {
                index: true,
                Component: Home
            },
            {
                path: '/login',
                Component : Login
            },
            {
                path: '/register',
                Component : Register
            },
            {
                path: '/about',
                Component : About
            },
            {
                path: '/contact',
                Component : Contact
            },
            {
                path: '*',
                Component: NotFound
            }
        ]
    },

    // Dashboard
    {
        path: "/dashboard",
        element: <PrivateRoute>
            <DashboardLayout></DashboardLayout>
        </PrivateRoute>
    }
])