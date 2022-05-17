import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const MainPage = () => {
    return(
        <div>
            <Header></Header>
            <Outlet/>
        </div>
    )
}

export default MainPage