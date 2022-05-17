import React from "react";
import { Button, Card, CardActions, CardContent, CardMedia, Typography, IconButton, CardHeader, Avatar, Chip } from "@mui/material";
import { Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Announcement = ({building}) => {
    const navigate = useNavigate()

    const navigateToPostPage = () => {
        navigate(`/posts/${building.id}`)
    }

    return(
        <Card>
            <CardHeader
                avatar={
                    <Avatar
                        alt="User avatar"
                        src={`http://localhost:8080/api/image/user/${building.userId}`}
                    >
                        U
                    </Avatar>
                }
                title={building.header}
                subheader={"Автор: " + building.userName}
                sx={{ textAlign: 'left' }}
            />
            <CardMedia
                component="img"
                height="140"
                image={`http://localhost:8080/api/image/download/${building.imageIds[0]}`}
                alt="Building"
            />
            <CardContent>
            <Typography variant="body2" color="text.secondary" align="left">
                Местоположение: {building.location}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="left" sx={{marginTop: '15px'}}>
                Цена: {building.price} ₽
            </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={navigateToPostPage}>
                    Подробнее
                </Button>
                <Chip
                    label={building.type === 0 ? 'Продается' : 'Сдается в аренду'}
                    color={building.type === 0 ? "primary" : "success"}
                    sx={{ marginLeft: 'auto' }}
                />
            </CardActions>
        </Card>
    )
}

export default Announcement