import { 
    Typography, 
    Box, 
    Alert, 
    AlertTitle, 
    Paper,
    Chip,
    TextField,
    Button,
    Grid,
    Avatar,
} from "@mui/material";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAddCommentMutation, useGetBuildingByIdQuery } from "../app/apiSlice";
import { Comment } from "../components/Comment";
import { Slider } from "../components/Slider";

export const PostPage = () => {
    const params = useParams()
    const {data: building, isSuccess, isError} = useGetBuildingByIdQuery(params.id)
    const [addComment, {isSuccess: commentAdded, isError: errorAddingComment, isLoading}] = useAddCommentMutation()
    const userId = useSelector(state => state.user.userId)
    const commentInputRef = useRef()

    const headers = ['Контакные данные', 'Местоположение', 'Цена']

    const handleSubmit = async (event) => {
        event.preventDefault()
        
        const commentData = new FormData(event.currentTarget);
        const postData = {
            buildingId: building.id,
            userId: userId,
            text: commentData.get("text")
        }
        try {
            await addComment(postData).unwrap()
            commentInputRef.current.value = ""
        } catch (error) {
            console.log(error)
        }
    }
    
    let content
    
    if (isSuccess) {
        const text = [building.contacts, building.location, building.price + ' ₽']
        content = (
            <Box sx={{padding: '20px 5%', display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px'}}>
                    <Avatar
                        sx={{width: '50px', height: '50px'}}
                        alt="User avatar"
                        src={`http://localhost:8080/api/image/user/${building.userId}`}
                    >
                        U
                    </Avatar>    
                    <Typography variant="h5">{building.userName}</Typography>
                </Box>

                <Typography variant="h4" textAlign="left">{building.header}</Typography>

                <Slider pictures={building.imageIds}/>

                <Grid container spacing={3} sx={{marginTop: "20px"}}>
                    <Grid item xs={6} sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
                        <Typography variant="h5"><strong>Описание</strong></Typography>
                        <Paper elevation={2} sx={{ margin: '10px 0', padding: '0.5rem 1rem' }}>
                            <Typography>{building.description}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
                        {headers.map((value, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <Typography variant="h5"><strong>{value}</strong></Typography>
                                    <Paper elevation={2} sx={{ margin: '10px 0', padding: '0.5rem 1rem' }}>
                                        <Typography>{text[index]}</Typography>
                                    </Paper>
                                </React.Fragment>
                            )
                        })}
                    </Grid>
                </Grid>

                <Chip
                    style={{ padding: '.5rem 1rem', marginTop: '10px' }}
                    label={building.type === 0 ? 'Продается' : 'Сдается в аренду'}
                    color={building.type === 0 ? "primary" : "success"}
                />
                <Typography variant="h5" sx={{ margin: '10px 0', marginTop: '30px' }}><strong>Оставить комментарий или задать вопрос</strong></Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        gap: '30px',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        marginTop: '20px',
                    }}
                >
                    <TextField
                        required
                        multiline
                        rows={4}
                        autoComplete="off"
                        id="text"
                        name="text"
                        sx={{ width: '40%' }}
                        inputRef={commentInputRef}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                    >Отправить</Button>
                </Box>
                <Box
                    sx={{
                        display: 'flex', 
                        gap: '20px',
                        flexDirection: 'column',
                        marginTop: '20px'
                    }}
                >
                    {building.comments.map((comment, index) => {
                        return (
                            <Comment commentData={comment} key={index}/>
                        )
                    })}
                </Box>
            </Box>
        )
    } else if (isError) {
        content = (
            <Box
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
                <Alert severity="error">
                    <AlertTitle>Ошибка</AlertTitle>
                    Данное объявление не найдено
                </Alert>
            </Box>
        )
    }

    return (
        <div>
            {content}
        </div>
    )
}