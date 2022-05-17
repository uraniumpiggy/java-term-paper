import { 
    Box, Grid, 
} from "@mui/material";
import React from "react";
import { useGetUserBuildingsQuery } from "../app/apiSlice"
import { AddNewPostForm } from "../components/AddNewPostForm";
import { UserPost } from "../components/UserPost";

export const CreatePostPage = () => {
    const {data: buildings, isSuccess} = useGetUserBuildingsQuery()

    let content

    if (isSuccess) {
        content = buildings.map((image, index) => {
            return (
                <Grid item xs={6} key={index}>
                    <UserPost building={image}/>
                </Grid>
            ) 
        })
    }

    return (
        <Box p={2}>
            <AddNewPostForm isUpdate={false}/>
            <Grid container sx={{marginTop: '20px'}} spacing={2}>
                {content}
            </Grid>
        </Box>
    )
}