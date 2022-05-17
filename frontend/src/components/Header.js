import React, { useState, useRef, useEffect } from "react";
import { AppBar, Button, IconButton, InputBase, SwipeableDrawer, Toolbar, ToggleButtonGroup, ToggleButton, TextField } from '@mui/material';
import { AdminPanelSettings, Home, Menu } from '@mui/icons-material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Box } from "@mui/system";
import { styled, alpha } from '@mui/material/styles';
import { Link, useNavigate } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import { useSelector } from "react-redux";
import { useGetSortedBuildingsQuery } from "../app/apiSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";

const Header = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const isAdmin = useSelector(state => state.user.roles).includes("ROLE_ADMIN")
    const navigate = useNavigate()
    const [alignment, setAlignment] = useState('Все объявления')
    const [filterParams, setFilterParams] = useState(skipToken)
    const {data: result, isSuccess} = useGetSortedBuildingsQuery(filterParams)

    const maxValueRef = useRef(null)
    const minValueRef = useRef(null)

    const handleChange = (event, newAlignment) => {
      setAlignment(newAlignment)
    }

    // Drawer

    const [drawerOpen, setdrawerOpen] = useState(false)
    const [inputError, setInputError] = useState(false)

    const toggleDrawer = (open) => (event) => {
      if (
        event &&
        event.type === 'keydown' &&
        (event.key === 'Tab' || event.key === 'Shift')
      ) {
        return
      }
  
      setdrawerOpen(open)
    }

    useEffect(() => {
      console.log(result)
    }, [isSuccess])

    const handleApllyFilters = (event) => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)

      let max = parseInt(data.get("maxValue"), 10)
      let min = parseInt(data.get("minValue"), 10)
      
      if ((max <= min || min < 0 || max < 0) && !(isNaN(max) || isNaN(min))) {
        setInputError(true)
        setTimeout(() => {
          setInputError(false)
        }, 5000)
        return
      }

      if (isNaN(max)) {
        max = -1
      }

      if (isNaN(min)) {
        min = -1
      }

      const filters = {
        maxCost: max,
        minCost: min,
        type: alignment === 'Все объявления' ? -1 : alignment === 'Снять' ? 1 : 0
      }

      setFilterParams(filters)
      navigate("/")
    }

    const clearFilters = () => {
      setAlignment('Все объявления')
      maxValueRef.current.value = ""
      minValueRef.current.value = ""
    }

    return(
        <AppBar position='sticky'>
        <Toolbar>
          <Box
              sx={{ 
                mr: 2,
                cursor: 'pointer',
              }}
            >
            <SearchIcon
              onClick={toggleDrawer(true)}
            />
            <SwipeableDrawer
                open={drawerOpen}
                onOpen={() => {}}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{ 
                      width: {xs: '200px', md: '300px'}, 
                      padding: '10px', 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '20px'
                    }}
                    role="presentation"
                    component="form"
                    onSubmit={handleApllyFilters}
                >
                    <ToggleButtonGroup 
                      size="small" 
                      sx={{ margin: '40px auto 0' }}
                      color="primary"
                      value={alignment}
                      exclusive
                      onChange={handleChange}
                    >
                      <ToggleButton value="Все объявления">Все объявления</ToggleButton>
                      <ToggleButton value="Снять">Снять</ToggleButton>
                      <ToggleButton value="Купить">Купить</ToggleButton>
                    </ToggleButtonGroup>
                    <Box sx={{display: 'flex', gap: '10px', padding: '10px'}}>
                      <TextField
                        variant="standard"
                        label="Цена от"
                        type="number"
                        name="minValue"
                        inputRef={minValueRef}
                        error={inputError}
                      />
                      <TextField
                        variant="standard"
                        label="Цена до"
                        type="number"
                        name="maxValue"
                        inputRef={maxValueRef}
                        error={inputError}
                      />
                    </Box>
                    <Button onClick={clearFilters}>Сбросить фильтры</Button>
                    <Button variant="contained" type="submit">Показать результаты</Button>
                </Box>
            </SwipeableDrawer>
          </Box>
          {isAdmin ? 
            <IconButton
              size='large'
              color='inherit'
              aria-label='admin-panel'
              sx={{ mr: 2 }}
              onClick={() => {
                navigate('admin')
              }}
            >
              <AdminPanelSettings/>
            </IconButton>
          : <></>}
          <Link 
            to="/" 
            style={{ textDecoration: 'none', color: 'inherit' }} 
            sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Home/>
          </Link>
          <Box
            sx={{display: 'flex', 
                flexGrow: '1',
            }}
          >
          </Box>
          {!isAuth ?
              <Button
                  color='inherit'
                  onClick={() => {
                    navigate('/auth')
                  }}
              >Войти</Button>
          : 
            <UserAvatar></UserAvatar>
          }
        </Toolbar>
      </AppBar>
    )
}

export default Header