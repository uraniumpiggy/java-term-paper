import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logOut, setAccessToken, setIsAuth, setTokens } from './userSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8080',
    prepareHeaders: (headers, { getState }) => {
        const {
            user: {access_token},
        } = getState()
        if (access_token) {
            headers.set('authorization', `Bearer ${access_token}`)
        }
        return headers
    }
})

const baseQueryWrapper = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        const {
            user: {refresh_token},
        } = api.getState()
        
        api.dispatch(setAccessToken(refresh_token))

        const response = await baseQuery({
            url: '/api/token/refresh',
            method: 'GET',
        }, api, extraOptions);

        if (response.data) {
            api.dispatch(setTokens(response.data))
            api.dispatch(setIsAuth(true))
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut())
            window.location.replace('/')
        }
    }

    return result
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWrapper,
    keepUnusedDataFor: 5,
    tagTypes: ['Post', 'SingleBuilding', 'Users', 'AllBuildings'],
    endpoints: builder => ({
        logInUser: builder.mutation({
            query: credentials => ({
                url: '/api/login',
                method: 'post',
                params: credentials
            }),
        }),
        registerUser: builder.mutation({
            query: userData => ({
                url: '/registration',
                method: 'post',
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: userData
            })      
        }),
        getUsers: builder.query({
            query: () => ({
                url: '/api/users',
            }),
            providesTags: ['Users']
        }),
        getUser: builder.query({
            query: () => ({
                url: '/api/user'
            })
        }),
        addAvatarToUser: builder.mutation({
            query: image => ({
                url: '/api/image/user/set/',
                method: 'post',
                body: image,
            })
        }),
        addBuilding: builder.mutation({
            query: data => ({
                url: '/api/building/set',
                method: 'post',
                body: data
            }),
            invalidatesTags: ['Post']
        }),
        updateBuilding: builder.mutation({
            query: data => ({
                url: `/api/building/${data.id}`,
                method: 'put',
                body: data.body
            }),
            invalidatesTags: ['Post']
        }),
        deleteBuilding: builder.mutation({
            query: id => ({
                url: `/api/building/${id}`,
                method: 'delete',
            }),
            invalidatesTags: ['Post']
        }),
        getUserBuildings: builder.query({
            query: () => ({
                url: '/api/user/buildings'
            }),
            providesTags: ['Post']
        }),
        getAllBuildings: builder.query({
            query: () => ({
                url: '/api/buildings'
            }),
            providesTags: ['AllBuildings']
        }),
        getBuildingById: builder.query({
            query: id => ({
                url: `/api/building/get/${id}`
            }),
            providesTags: ['SingleBuilding']
        }),
        addComment: builder.mutation({
            query: commentData => ({
                url: '/api/building/comment',
                method: 'post',
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: commentData,
            }),
            invalidatesTags: ['SingleBuilding']
        }),
        setAdmin: builder.mutation({
            query: id => ({
                url: `/api/user/set/admin/${id}`,
                method: 'put'
            }),
            invalidatesTags: ['Users']
        }),
        removeAdmin: builder.mutation({
            query: id => ({
                url: `/api/user/remove/admin/${id}`,
                method: 'put'
            }),
            invalidatesTags: ['Users']
        }),
        deleteUser: builder.mutation({
            query: id => ({
                url: `/api/user/delete/${id}`,
                method: 'delete'
            }),
            invalidatesTags: ['Users', 'AllBuildings']
        }),
        deleteBuildingById: builder.mutation({
            query: id => ({
                url: `/api/building/delete/${id}`,
                method: 'delete'
            }),
            invalidatesTags: ['AllBuildings']
        }),
        getSortedBuildings: builder.query({
            query: data => ({
                url: '/api/buildings/sorted',
                params: data,
            }),
            providesTags: ['AllBuildings']
        }),
        selfDeleteUser: builder.mutation({
            query: id => ({
                url: `/api/user/self/delete/${id}`,
                method: 'delete'
            })
        }),
        changePassowrd: builder.mutation({
            query: credentials => ({
                url: '/api/password/change',
                method: 'post',
                params: credentials
            })
        })
    })
})

export const { 
    useLogInUserMutation,
    useRegisterUserMutation,
    useGetUsersQuery,
    useGetUserQuery,
    useAddAvatarToUserMutation,
    useAddBuildingMutation,
    useGetUserBuildingsQuery,
    useUpdateBuildingMutation,
    useDeleteBuildingMutation,
    useGetAllBuildingsQuery,
    useGetBuildingByIdQuery,
    useAddCommentMutation,
    useDeleteUserMutation,
    useRemoveAdminMutation,
    useSetAdminMutation,
    useDeleteBuildingByIdMutation,
    useGetSortedBuildingsQuery,
    useSelfDeleteUserMutation,
    useChangePassowrdMutation,
} = apiSlice