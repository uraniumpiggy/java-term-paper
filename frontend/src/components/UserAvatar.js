import { IconButton, Box, Tooltip, Avatar, Menu, MenuItem, Typography } from "@mui/material";
import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetUpdateInfo } from "../app/postSlice";
import { logOut } from "../app/userSlice";


const UserAvatar = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userId = useSelector(state => state.user.userId)

    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
    
    const navigateToAccount = () => {
      navigate('/account')
      setAnchorElUser(null);
    }

    const navigateToPosts = () => {
      navigate('/myposts')
      setAnchorElUser(null);
    }

    const handleLogOut = () => {
      dispatch(logOut())
      dispatch(resetUpdateInfo())
      navigate('/')
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return(
        <Box>
            <Tooltip title="Открыть настройки">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src={`http://localhost:8080/api/image/user/${userId}`} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem onClick={navigateToAccount}>
                  <Typography textAlign="center">Аккаунт</Typography>
                </MenuItem>
                <MenuItem onClick={navigateToPosts}>
                  <Typography textAlign="center">Мои объявления</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                  handleLogOut()
                  handleCloseUserMenu()
                }}>
                  <Typography textAlign="center">Выйти</Typography>
                </MenuItem>
            </Menu>
        </Box>
    )
}

export default UserAvatar