// import { useState } from 'react'
import {createBrowserRouter,RouterProvider,} from "react-router-dom";


import Home from "./pages/home";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Student from "./pages/Student";
import Teacher from "./pages/Teacher";
import Admin from "./pages/admin";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
    {
      path:"/login",
      element:<Login/>
    },
    {
      path:"/sighup",
      element:<Signup/>
    },
    {
      path:"/student",
      element:<Student/>
    },
    {
      path:"/teacher",
      element:<Teacher/>
    },
    {
      path:"/admin",
      element:<Admin/>
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
