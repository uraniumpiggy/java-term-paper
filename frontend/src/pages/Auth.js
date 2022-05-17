import { Home, LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Grid, TextField, Typography, Alert, AlertTitle, IconButton } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogInUserMutation, useGetUserQuery } from '../app/apiSlice'

const Auth = () => {
    const [error, setError] = useState(false)
    const navigate = useNavigate()
    const blockWidth = '40vw'

    const [skip, setSkip] = useState(skipToken)
    const { isSuccess: isSuccessGetUser } = useGetUserQuery(skip)

    const [logIn, {data: tokens, isSuccess, isError}] = useLogInUserMutation()

    useEffect(() => {
        if (isSuccess) {
            setSkip(false)
            if (isSuccessGetUser) {
                navigate('/')
            }
        } else if (isError) {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 5000)
        }
    }, [isSuccess, isSuccessGetUser, isError, tokens, navigate, setSkip])

    const boxVerticalStyles = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        width: blockWidth,
        padding: '20px',
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        let params = new URLSearchParams()
        params.append('username', data.get('username'))
        params.append('password', data.get('password'))
        
        try {
            await logIn(params).unwrap()
            
        } catch(error) {
            console.log(error)
        }
    };

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
                    sx={boxVerticalStyles}
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
                        Введите почту и пароль
                    </Typography>
                    <TextField
                        label="Email"
                        variant="standard"
                        error={error}
                        margin="normal"
                        required
                        onFocus={() => setError(false)}
                        fullWidth
                        id="email"
                        name="username"
                        autoComplete="email"
                        autoFocus
                    ></TextField>
                    <TextField
                        label="Пароль"
                        variant="standard"
                        margin="normal"
                        required
                        error={error}
                        onFocus={() => setError(false)}
                        fullWidth
                        name="password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    ></TextField>

                    <Button
                        variant="outlined"
                        sx={{marginTop: '20px'}}
                        type='submit'
                    >
                        Войти
                    </Button>
                    
                    <Typography>
                        Нет аккаунта? <Link to={'/registration'}
                            style={{textDecoration: 'none', color: 'blue'}}
                        >Зарегистрируйтесь</Link>
                    </Typography>

                </Box>
            </Grid>   
            
        </Grid> 
    )
}

export default Auth