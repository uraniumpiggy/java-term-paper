import React, {useEffect, useState} from "react";
import { Avatar, Box, Button, Grid, TextField, Typography, Alert, AlertTitle, ButtonGroup, IconButton } from "@mui/material";
import { Home, LockOutlined } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom'
import { useRegisterUserMutation } from "../app/apiSlice";


const Register = () => {
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState(false);
    const [passError, setPassError] = useState(false);
    const navigate = useNavigate()

    const [registerUser, {isSuccess, isError}] = useRegisterUserMutation()

    useEffect(() => {
        if (isSuccess) {
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
            }, 5000)
        } else if (isError) {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 5000)
        }
    }, [isSuccess, isError])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name')
        const email = data.get('email')
        const password = data.get('password')
        const password2 = data.get('password2')

        if (password !== password2) {
            setPassError(true)
        }
        
        if (password === password2 && name.trim() && email.trim()) {
            const userData = {
                name: name,
                username: email,
                password: password
            }
            console.log(userData);

            try {
                await registerUser(userData).unwrap()
            } catch (error) {
                console.log(error)
            }

        
        } 
    }

    const alertComponent = 
    (<Box
        sx={{
            marginBottom: '20px'
        }}
    >
        <Alert severity="success">
            <AlertTitle
                sx={{textAlign: 'left'}}
            >Аккаунт создан</AlertTitle>
            <Box
                sx={{display: 'flex',
                    justifyContent: 'flex-start',
                    width: '100%',
                    padding: '10px 0',    
                }}
            >
                <ButtonGroup>
                    <Button
                        onClick={() => {
                            navigate('/auth')
                        }}
                    >
                        Войти
                    </Button>
                    <Button
                        onClick={() => {
                            setAlert(false)
                        }}
                    >
                        Закрыть
                    </Button>
                </ButtonGroup>
            </Box>
        </Alert>
    </Box>)

    const errorAlert = 
    (<Box
        sx={{
            marginBottom: '20px'
        }}
    >
        <Alert severity="error">
            <AlertTitle
                sx={{textAlign: 'left'}}
            >Произошла ошибка</AlertTitle>
        </Alert>
    </Box>)

    return(
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            {alert ? alertComponent : <></>}
            {error ? errorAlert : <></>}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px'
                }}
            >
                <IconButton
                    onClick={() => {
                        navigate('/')
                    }}
                >
                    <Home/>
                </IconButton>
            </Box>
            <Grid item xs={3}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '500px'
                    }}
                    component="form" 
                    onSubmit={handleSubmit} 
                    noValidate
                >   
                    <Avatar
                        sx={{bgcolor: 'red'}}
                    >
                        <LockOutlined/>
                    </Avatar>

                    <Typography>
                        Регистрация
                    </Typography>
                    <TextField
                        label="Имя пользователя"
                        fullWidth
                        variant="standard"
                        margin="normal"
                        required
                        id="name"
                        name="name"
                        autoFocus
                    ></TextField>
                    <TextField
                        label="Email"
                        fullWidth
                        variant="standard"
                        margin="normal"
                        required
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                    ></TextField>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                onFocus={() => {
                                    setPassError(false)
                                }}
                                label="Пароль"
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={passError}
                                helperText={passError ? "Пароли отличаются" : ' '}
                            ></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                onFocus={() => {
                                    setPassError(false)
                                }}
                                label="Повторите пароль"
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                name="password2"
                                type="password"
                                id="password2"
                                autoComplete="current-password"
                                error={passError}
                                helperText={passError ? "Пароли отличаются" : ' '}
                            ></TextField>
                        </Grid>
                    </Grid>

                    <Button
                        sx={{marginTop: '20px'}}
                        variant='outlined'
                        type='submit' 
                    >
                        Зарегистрироваться
                    </Button>

                </Box>
            </Grid>   
            
        </Grid> 
    )
}

export default Register