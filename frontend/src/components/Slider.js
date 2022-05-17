import { Card, CardMedia, Grid } from "@mui/material";
import React from "react";

export const Slider = ({pictures}) => {


    return (
        <Grid container spacing={2} alignItems="center" sx={{ padding: '20px' }}>
            {pictures.map((id, index) => {
                return (
                    <Grid item xs={3} key={index}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="250px"
                                image={`http://localhost:8080/api/image/download/${id}`}
                            />
                        </Card>
                    </Grid>
                )
            })}
        </Grid>
    )
}