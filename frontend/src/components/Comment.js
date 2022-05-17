import React from 'react'
import {
    Card,
    CardHeader,
    Avatar,
    CardContent,
    Typography,
} from '@mui/material'

export const Comment = ({ commentData }) => {
    return (
        <Card
            sx={{minWidth: '300px'}}
        >
            <CardHeader
                avatar={
                    <Avatar
                        alt="User avatar"
                        src={`http://localhost:8080/api/image/user/${commentData.userId}`}
                    >
                        U
                    </Avatar>
                }
                // title={building.header}
                subheader={commentData.nameOfUser}
                sx={{ textAlign: 'left' }}
            />
            <CardContent>
                <Typography variant="body2" textAlign="left">
                    {commentData.text}
                </Typography>
            </CardContent>
        </Card>
    )
}