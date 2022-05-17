import React from "react";
import { Grid, Box } from "@mui/material";
import Announcement from "../components/Announcement";
import { useGetSortedBuildingsQuery } from "../app/apiSlice";
import { useSelector } from "react-redux";

export const MainGrid = () => {
    const {isSuccess} = useGetSortedBuildingsQuery({
        maxCost: -1,
        minCost: -1,
        type: -1
    })

    const buildings = useSelector(state => state.posts.currentPosts)

    let content

    if (isSuccess) {
        if (buildings.length === 0) {
            content = (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'cneter',
                        alignItems: 'cneter',
                        height: '50vh',
                        width: '100%',
                    }}
                >
                    <h1>Объявления не найдены</h1>
                </Box>   
            )
        } else {
            content = buildings.map((singleBuilding, index) => {
                return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Announcement building={singleBuilding}/>
                    </Grid>
                )
            })
        }
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