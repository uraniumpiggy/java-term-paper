import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

export const ConfirmDialog = ({data, open, setOpen}) => {
    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>
                Подтвердите действие
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {data.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button onClick={data.action}>Подтвердить</Button>
            </DialogActions>
        </Dialog>
    )
}