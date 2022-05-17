import { ExpandMore } from "@mui/icons-material";
import { 
    Accordion, 
    AccordionDetails, 
    AccordionSummary, 
    Box, 
    Button, 
    Card, 
    CardActions, 
    CardMedia, 
    Grid, 
    InputAdornment, 
    MenuItem, 
    OutlinedInput, 
    Select, 
    TextField,
    Alert,
    AlertTitle, 
    Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAddBuildingMutation, useUpdateBuildingMutation} from "../app/apiSlice"
import { resetUpdateInfo } from "../app/postSlice";

export const AddNewPostForm = () => {
    const [type, setType] = useState(0)
    const [accordionOpen, setAccordionOpen] = useState(false)
    const [errorFiles, setErrorFiles] = useState(false)
    const [prewiewImagesArray, setPrewiewImagesArray] = useState([])
    const [addBuilding] = useAddBuildingMutation()
    const [updateBuilding] = useUpdateBuildingMutation()
    const dispatch = useDispatch()

    const isUpdate = useSelector(state => state.posts.isUpdate)
    const dataToUpdate = useSelector(state => state.posts.dataToUpdate)

    useEffect(() => {
        if (isUpdate) {
            if (document.querySelector('#header').value === dataToUpdate.header) {
                return
            }
            document.querySelector('#header').value = dataToUpdate.header
            document.querySelector('#description').value = dataToUpdate.description
            document.querySelector('#contacts').value = dataToUpdate.contacts
            document.querySelector('#location').value = dataToUpdate.location
            document.querySelector('#price').value = dataToUpdate.price

            setType(dataToUpdate.type)
            
            for (const id of dataToUpdate.imageIds) {
                fetch(`http://localhost:8080/api/image/download/${id}`).then((resp) => {
                    resp.blob().then(blob => setPrewiewImagesArray(prev => [...prev, blob]))
                })
            }

            setAccordionOpen(true)
        }
    }, [isUpdate, dataToUpdate])

    const handleSelectChange = (event) => {
        setType(event.target.value);
    }

    const handleOpnAccordion = () => {
        setAccordionOpen(!accordionOpen)
    }

    const clearForm = () => {
        document.querySelector('#header').value = ''
        document.querySelector('#description').value = ''
        document.querySelector('#contacts').value = ''
        document.querySelector('#location').value = ''
        document.querySelector('#price').value = ''
        setType(0)
        setPrewiewImagesArray([])
    }

    const addImageToPreview = (event) => {
        const file =  event.target.files[0]
        if (file) {
            setPrewiewImagesArray(prev => [...prev, file])
        } 
    }

    const deleteImage = (imageId) => {
        setPrewiewImagesArray(prewiewImagesArray.filter((item, index) => index !== imageId))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        if (prewiewImagesArray.length === 0 || data.get("price") > 2147483647) { // max value of int in Java
            setErrorFiles(true)
            setTimeout(() => {
                setErrorFiles(false)
            }, 5000)
            return
        }

        for (const image of prewiewImagesArray) {
            data.append("files", image)
        }

        try {
            if (isUpdate) {
                const newData = {
                    id: dataToUpdate.id,
                    body: data
                }
                dispatch(resetUpdateInfo())

                await updateBuilding(newData).unwrap()
            } else {

                await addBuilding(data).unwrap()
            }
            clearForm()
        } catch (error) {
            console.log(error)
        }
    }

    const boxFlexRowStyles = {display: 'flex', flexDirection: 'row', gap: '20px', padding: '8px'}
    const typographyStyles = {width: '140px', textAlign: 'left'}

    const errorFilesAlert = (
        <Alert severity="error">
            <AlertTitle>Ошибка</AlertTitle>
            Не выбраны изображения
        </Alert>
    )

    return (
        <Accordion expanded={accordionOpen} onChange={handleOpnAccordion}>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>
                    Создать новое объявление {isUpdate ? <strong>Редактирование</strong> : ''}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box 
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >

                    <Grid container spacing={1}>
                        <Grid item xs={7}>
                            <Box sx={boxFlexRowStyles}>
                                <Typography sx={typographyStyles}>Заголовок</Typography>
                                <TextField
                                    variant="standard"
                                    fullWidth
                                    required
                                    id="header"
                                    name="header"
                                />
                            </Box>
                            <Box sx={boxFlexRowStyles}>
                                <Typography sx={typographyStyles}>Описание</Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    required
                                    id="description"
                                    name="description"
                                />
                            </Box>
                            <Box sx={boxFlexRowStyles}>
                                <Typography sx={typographyStyles}>Контактная информация</Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    required
                                    id="contacts"
                                    name="contacts"
                                />
                            </Box>
                            <Box sx={boxFlexRowStyles}>
                                <Typography sx={typographyStyles}>Цена</Typography>
                                    <OutlinedInput
                                        type="number"
                                        fullWidth
                                        required
                                        id="price"
                                        name="price"
                                        startAdornment={<InputAdornment position="start">₽</InputAdornment>}
                                    />
                            </Box>
                            <Box sx={boxFlexRowStyles}>
                                <Select
                                    id="type"
                                    name="type"
                                    value={type}
                                    onChange={handleSelectChange}
                                >
                                    <MenuItem value={0}>Продать</MenuItem>
                                    <MenuItem value={1}>Сдать в аренду</MenuItem>
                                </Select>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    required
                                    id="location"
                                    name="location"
                                    label="Адрес"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={5}>
                            {errorFiles ? errorFilesAlert : <></>}
                            <Typography textAlign="left" m={1}>Загрузить фотографии</Typography>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{margin: '10px'}}
                            >
                                Добавить изображение
                                <input type="file" multiple onChange={addImageToPreview} hidden/>
                            </Button>
                            <Grid container spacing={2} p={1}>
                                {prewiewImagesArray.map((image, i) => {
                                    const convertedImage = URL.createObjectURL(image)
                                    return (
                                        <Grid item key={i} xs={6} md={4}>
                                            <Card>
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    src={convertedImage}
                                                />
                                                <CardActions>
                                                    <Button size="small" onClick={() => {
                                                        deleteImage(i)
                                                    }}>
                                                        Удалить
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" sx={{marginTop: '10px'}}>
                        {isUpdate ? 'Изменить' : 'Опубликовать'}
                    </Button>
                    {isUpdate ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{marginTop: '10px', marginLeft: '10px'}}
                            onClick={() => {
                                dispatch(resetUpdateInfo())
                                clearForm()
                            }}
                        >
                            Отменить редактирование
                        </Button>
                    ) : <></>}
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}