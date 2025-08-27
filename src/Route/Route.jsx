import { createBrowserRouter } from "react-router-dom";
import Root from "../Layouts/Root";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import NotFound from "../Pages/NotFound/NotFound";
import Register from "../Pages/Login/Register";


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
                path: '*',
                Component: NotFound
            }
        ]
    }
])