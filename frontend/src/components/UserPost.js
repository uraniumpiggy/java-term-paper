import { Delete, Edit } from "@mui/icons-material";
import { Card, CardMedia, Box, CardContent, Typography, CardActions, IconButton } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useDeleteBuildingMutation } from "../app/apiSlice";
import { setUpdateInfo } from "../app/postSlice";

export const UserPost = ({ building }) => {
    const [deleteBuilding] = useDeleteBuildingMutation()
    const dispatch = useDispatch()

    const handleUpdateAction = () => {
        dispatch(setUpdateInfo(building))
    }

    return (
        <Card sx={{ display: 'flex', padding: '8px' }}>
            <CardMedia
                component="img"
                sx={{ width: {xs: 200, sm: 250, md: 300}, maxHeight: 200 }}
                image={`http://localhost:8080/api/image/download/${building.imageIds[0]}`}
                alt="Building picture"
            />
            <CardContent sx={{flexGrow: '1'}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Typography variant="h5" textAlign="left">{building.header}</Typography>
                    <Typography textAlign="left">{building.description}</Typography>
                    <Typography textAlign="left">{building.location}</Typography>
                    <Typography sx={{marginTop: 'auto'}} textAlign="left">{building.price} ₽</Typography>
                </Box>
            </CardContent>
            <CardActions>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'}}>
                    <IconButton onClick={handleUpdateAction}>
                        <Edit/>
                    </IconButton>
                    <IconButton onClick={() => {
                        deleteBuilding(building.id)
                    }}>
                        <Delete/>
                    </IconButton>
                </Box>
            </CardActions>
        </Card>
    )
}