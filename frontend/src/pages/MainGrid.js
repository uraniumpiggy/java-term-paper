import React from "react";
import { Grid, Box } from "@mui/material";
import Announcement from "../components/Announcement";
import { useGetSortedBuildingsQuery } from "../app/apiSlice";
import { useSelector } from "react-redux";

export const MainGrid = () => {
    const {data, isSuccess, isError, isLoading} = useGetSortedBuildingsQuery({
        maxCost: -1,
        minCost: -1,
        type: -1
    })

    const buildings = useSelector(state => state.posts.currentPosts)

    let content

    if (isSuccess) {
        content = buildings.map((singleBuilding, index) => {
            return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Announcement building={singleBuilding}/>
                </Grid>
            )
        })
    } 

    return (
        <Box
            sx={{padding: '10px 4%'}}
        >
            <Grid container spacing={2}>
                {content}
            </Grid>
        </Box>
    )
}