import { Avatar, Box, Typography, Button, CircularProgress } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useAddAvatarToUserMutation, useGetUserQuery } from "../app/apiSlice";

export const AccountPage = () => {
    const {data: user, isLoading, isSuccess} = useGetUserQuery()

    const userId = useSelector(state => state.user.userId)

    const [sendImage] = useAddAvatarToUserMutation()

    const handleImageUpload = (event) => {
        const image = new FormData()
        image.append("file", event.target.files[0])

        try {
            sendImage(image).unwrap()
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    let content

    if (isLoading) {
        content = (
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    height: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <CircularProgress />
            </Box>
        )
    } else if (isSuccess) {
        content = (
            <div>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                    p={3}
                >
                    <Avatar
                        alt="User Avatar"
                        src={`http://localhost:8080/api/image/user/${userId}`}
                        sx={{
                            width: {xs: '300px', md: '200px'},
                            height: {xs: '300px', md: '200px'},
                        }}
                    />
                    <Box>
                        <Typography textAlign="left">Имя пользователя {user.name}</Typography>
                        <Typography textAlign="left">Логин {user.username}</Typography>
                    </Box>
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Выбрать фотографию
                        <input
                            type="file"
                            onChange={handleImageUpload}
                            hidden
                        />
                    </Button>
                </Box>
            </div>
            
        )
    }

    return (
        <div>{content}</div>
    )
}