import { Add, Delete, Remove } from "@mui/icons-material"
import { 
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer, 
    TableHead,
    TableRow,
    Button,
    Box,
    ButtonGroup
} from "@mui/material"
import React, {useEffect, useState} from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { 
    useDeleteUserMutation, 
    useGetAllBuildingsQuery, 
    useGetUsersQuery, 
    useRemoveAdminMutation, 
    useSetAdminMutation,
    useDeleteBuildingByIdMutation 
} from "../app/apiSlice"
import { AdminDialog } from "../components/AdminDilog"

export const AdminPage = () => {
    const navigate = useNavigate()

    const roles = useSelector(state => state.user.roles)
    const userId = useSelector(state => state.user.userId)
     
    const [selectedSection, setSelectedSection] = useState(1)
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogData, setDialogData] = useState({})

    const {data: users, isSuccess} = useGetUsersQuery()
    const {data: buildings, isSuccess: isBuildingsSuccess} = useGetAllBuildingsQuery()
    const [setAdmin, {isSuccess: successAddAdmin, isLoading: adminLoading, isError: adminError}] = useSetAdminMutation()
    const [removeAdmin, {isSuccess: successRemoveAdmin, isLoading: removeAdminLoading, isError: removeAdminError}] = useRemoveAdminMutation()
    const [deleteUser, {isSuccess: sccessDelete, isLoading: deleteUserLoading, isError: deleteUserError}] = useDeleteUserMutation()
    const [deletePost, {isSuccess: sccessPostDelete, isLoading: delPostLoading, isError: deletePostError}] = useDeleteBuildingByIdMutation()
    
    useEffect(() => {
        if (!roles.includes("ROLE_ADMIN")) {
            navigate('/')
        }
    }, [roles])
    
    let userContent
    let buildingContent

    const handleDeleteBuilding = (id) => {
        setDialogData({
            message: `Вы уверены что хотите удалить это объявление?`,
            action: function () {
                deletePost(id)
                setOpenDialog(false)
            },
        })
        setOpenDialog(true)
    }

    const handleSetUserAdmin = (id, username) => {
        setDialogData({
            message: `Вы уверены что хотите предоставить пользователю ${username} права администратора?`,
            action: function () {
                setAdmin(id)
                setOpenDialog(false)
            },
        })
        setOpenDialog(true)
    }

    const handleUnsetUserAdmin = (id, username) => {
        setDialogData({
            message: `Вы уверены что хотите лишить пользователя ${username} прав администратора?`,
            action: function () {
                removeAdmin(id)
                setOpenDialog(false)
            },
        })
        setOpenDialog(true)
    }

    const handleDeleteUser = (id, username) => {
        setDialogData({
            message: `Вы уверены что хотите удалить аккаунт пользователя ${username}?`,
            action: function () {
                deleteUser(id)
                setOpenDialog(false)
            },
        })
        setOpenDialog(true)
    }

    const isUserAdmin = (user) => {
        for (const item of user.roles) {
            if (item.name === "ROLE_ADMIN") {
                return true
            }
        }
        return false
    }

    if (isSuccess) {
        userContent = (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Имя пользователя</TableCell>
                            <TableCell align="left">Посты</TableCell>
                            <TableCell align="left">Роли</TableCell>
                            <TableCell align="left">Расширить права</TableCell>
                            <TableCell align="left">Убрать роль админа</TableCell>
                            <TableCell align="left">Удалить пользователя</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell align="left">{user.id}</TableCell>
                                    <TableCell align="left">{user.name}</TableCell>
                                    <TableCell align="left">{user.buildings.length}</TableCell>
                                    <TableCell align="left">{user.roles.map((role) => role.name.substring(5) + " ")}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            disabled={isUserAdmin(user) || user.id === userId} 
                                            onClick={() => {
                                                handleSetUserAdmin(user.id, user.name)
                                            }}
                                        >
                                            <Add/>
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton 
                                            disabled={!isUserAdmin(user) || user.id === userId}
                                            onClick={() => {
                                                handleUnsetUserAdmin(user.id, user.name)
                                            }}
                                        >
                                            <Remove/>
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            disabled={user.id === userId} 
                                            onClick={() => {
                                                handleDeleteUser(user.id, user.name)
                                            }}
                                        >
                                            <Delete/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )   
    }

    if (isBuildingsSuccess) {
        buildingContent = (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Название</TableCell>
                            <TableCell align="left">Тип</TableCell>
                            <TableCell align="left">Цена</TableCell>
                            <TableCell align="left">Имя автора</TableCell>
                            <TableCell align="left">Комментраии</TableCell>
                            <TableCell align="left">Удалить объявление</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {buildings.map((building, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell align="left">{building.id}</TableCell>
                                    <TableCell align="left">{building.header}</TableCell>
                                    <TableCell align="left">{building.type === 0 ? 'Продается' : 'Сдается в аренду'}</TableCell>
                                    <TableCell align="left">{building.price}</TableCell>
                                    <TableCell align="left">{building.userName}</TableCell>
                                    <TableCell align="left">{building.comments.length}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => {
                                            handleDeleteBuilding(building.id)
                                        }}>
                                            <Delete/>
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => {
                                            navigate(`/posts/${building.id}`)
                                        }}>Перейти к посту</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    return (
        <Box p={3}>
            <AdminDialog open={openDialog} setOpen={setOpenDialog} data={dialogData}/>
            <Box sx={{display: 'flex', padding: '20px'}}>
                <ButtonGroup>
                    <Button onClick={() => {setSelectedSection(1)}}>Пользователи</Button>
                    <Button onClick={() => {setSelectedSection(2)}}>Объявления</Button>
                </ButtonGroup>
            </Box>
            {selectedSection === 1 ? userContent : buildingContent}
        </Box>       
    )
}