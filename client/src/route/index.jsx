import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import Pratice from "../pages/Pratice";
import TestPage from "../pages/TestPage";
import Dashboard from "../layout/Dashboard";
import Profile from "../pages/Profile";
import Performance from "../pages/Performance";
import LeaderBoard from "../pages/LeaderBoard";
import ShowProfile from "../pages/ShowProfile";
import ReplyMail from "../pages/ReplyMail";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path:"/search",
                element:<SearchPage/>
            },
            {
                path:"/contact-us",
                element:<Contact/>
            },
            {
                path:"/login",
                element:<Login/>
            },
            {
                path:"/register",
                element:<Register/>
            },
            {
                path:"/Practice",
                element:<Pratice/>
            },
            {
                path:"/leaderBoard",
                element:<LeaderBoard/>
            },
            {
                path:"/showProfile",
                element:<ShowProfile/>
            },
            {
                path:"/dashboard",
                element:<Dashboard/>,
                children:[
                    {
                        path:"profile",
                        element:<Profile/>
                    },
                    {
                        path:"performance",
                        element:<Performance/>
                    },
                    {
                        path:"reply-mail",
                        element:<ReplyMail/>
                    },
                ]
            },  
        ],
    },
    {
        path:"/verify-email",
        element:<VerifyEmail/>
    },
    {
        path:"/test",
        element:<TestPage/>
    },
    
]);

export default router;