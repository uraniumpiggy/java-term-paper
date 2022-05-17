import { Avatar, Box, Typography, Button, CircularProgress, TextField } from "@mui/material";
import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { useAddAvatarToUserMutation, useGetUserQuery, useChangePassowrdMutation, useSelfDeleteUserMutation } from "../app/apiSlice";
import { logOut } from '../app/userSlice'
import { ConfirmDialog } from "../components/ConfirmDialog";

export const AccountPage = () => {
    const [passError, setPassError] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogData, setDialogData] = useState({})
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const userId = useSelector(state => state.user.userId)
    

    const {data: user, isLoading, isSuccess} = useGetUserQuery()
    const [sendImage, {isLoading: isLoadingSendImage}] = useAddAvatarToUserMutation()
    const [changePassword, {isLoading: isChangePasswordLoading}] = useChangePassowrdMutation()
    const [deleteUser, {isLoading: isDeleteLoading}] = useSelfDeleteUserMutation()

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

    const handleDeleteUser = () => {
        setDialogData({
            message: 'Вы уверены что хотите удалить свой аккаунт?',
            action: async function () {
                try {
                    await deleteUser(userId).unwrap()    
                    dispatch(logOut())
                    navigate("/")
                } catch (error) {
                    console.log(error)
                }
                setOpenDialog(false)
            },
        })
        setOpenDialog(true)
    }

    const handlePasswordChange = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)

        if (data.get("newPassword1") !== data.get("newPassword2")) {
            setPassError(true)
            setTimeout(() => {
                setPassError(false)
            }, 5000)
            return
        }

        const credentials = {
            newPass: data.get("newPassword1")
        }

        setDialogData({
            message: 'Вы уверены что хотите изменить пароль?',
            action: async function () {
                try {        
                    await changePassword(credentials).unwrap()    
                } catch (error) {
                    console.log(error)
                }
                setOpenDialog(false)
            },
        })
        setOpenDialog(true)
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
                <ConfirmDialog open={openDialog} setOpen={setOpenDialog} data={dialogData}/>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
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
                    <Box
                        sx={{
                            flexGrow: '1', 
                            pt: 2,
                            pl: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}
                    >
                        <Typography textAlign="left">Имя пользователя: <strong>{user.name}</strong></Typography>
                        <Typography textAlign="left">Логин: <strong>{user.username}</strong></Typography>
                        <Typography textAlign="left">Объявления: <strong>{user.buildings.length}</strong></Typography>
                        <Typography textAlign="left">Комментраии: <strong>{user.buildings.map((item) => item.comments.length).reduce((a, b) => a + b, 0)}</strong></Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}
                    >
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
                        <Button
                            variant="contained"
                            color="error"
                            disabled={isDeleteLoading}
                            onClick={handleDeleteUser}
                        >
                            Удалить аккаунт
                        </Button>
                    </Box>
                </Box>
                <Box pt={1} pl={4}>
                    <Typography textAlign="left">Сменить пароль</Typography>
                </Box>
                <Box
                    component="form"
                    onSubmit={handlePasswordChange}
                    sx={{
                        display: 'flex',
                        gap: '20px',
                        pl: 4,
                        pt: 2,
                    }}
                >
                    <TextField
                        variant="filled"
                        autoComplete="off"
                        error={passError}
                        label="Новый пароль"
                        name="newPassword1"
                    />
                    <TextField
                        variant="filled"
                        autoComplete="off"
                        error={passError}
                        label="Повторите новый пароль"
                        name="newPassword2"
                    />
                    <Button
                        color="success"
                        variant="contained"
                        type="submit"
                    >
                        Сменить пароль
                    </Button>
                </Box>
            </div>
            
        )
    }

    return (
        <div>{content}</div>
    )
}