import { createSlice } from "@reduxjs/toolkit"
import { apiSlice } from "./apiSlice"

const initialState = {
    isUpdate: false,
    dataToUpdate: {},
    currentPosts: [],
}

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setUpdateInfo: (state, action) => {
            state.isUpdate = true
            state.dataToUpdate = action.payload
        },
        resetUpdateInfo: (state) => {
            state.isUpdate = false
            state.dataToUpdate = null
        },
    },
    extraReducers(builder) {
        builder.addMatcher(apiSlice.endpoints.getSortedBuildings.matchFulfilled,
            (state, {payload}) => {
                state.currentPosts = payload
            }
        )
    }
})

export const { setUpdateInfo, resetUpdateInfo } = postSlice.actions

export default postSlice.reducer