import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const initialState = {
    access_token: "",
    refresh_token: "",
    isAuth: false,
    userId: null,
    roles: []
}
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.access_token = action.payload
        },
        setTokens: (state, {payload}) => {
            state.access_token = payload.access_token
            state.refresh_token = payload.refresh_token
        },
        setIsAuth: (state, {payload}) => {
            state.isAuth = payload
        },
        logOut: state => {
            state.access_token = ""
            state.refresh_token = ""
            state.isAuth = false
            state.userId = null
            state.roles = []
        } 
    },
    extraReducers(builder) {
        builder.addMatcher(apiSlice.endpoints.logInUser.matchFulfilled,
            (state, {payload}) => {
                state.access_token = payload.access_token
                state.refresh_token = payload.refresh_token
                state.isAuth = true
            }
        )
        .addMatcher(apiSlice.endpoints.getUser.matchFulfilled,
            (state, {payload}) => {
                state.userId = payload.id
                state.roles = payload.roles.map((item) => item.name)
            }
        )
    }
})

export const { setAccessToken, setTokens, setIsAuth, logOut } = userSlice.actions

export default userSlice.reducer