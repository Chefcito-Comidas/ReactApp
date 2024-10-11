/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { UserPost } from '../../models/user.model'

type Model = {
    data:UserPost|null,
}
const initialState:Model = {
    data:null,
}

const UserDataReducer = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: (state, action:PayloadAction<UserPost>) => {
            if (action.payload) {
                state.data = action.payload
            }
        },
        clearUserData: (state) => {
            state.data = null
        },
    },
})
  
// Action creators are generated for each case reducer function
export const { setUserData, clearUserData} = UserDataReducer.actions

export default UserDataReducer.reducer