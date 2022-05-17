import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const MainPage = () => {
    return(
        <div>
            <Header></Header>
            <Outlet/>
            <Box
                sx={{height: '100px'}}
            ></Box>
        </div>
    )
}

export default MainPage