import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../../app/services/userApi";
import type { RootState } from "../../app/store";
import type { User } from "../../app/types";

type InitialState = {
  user: User | null
  isAuthenticated: boolean
  users: User[] | null
  current: User | null
  token?: string
}

const initialState: InitialState = {
  user: null,
  isAuthenticated: false,
  users: null,
  current: null,
}

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: () => initialState,
    resetUser: state => {
      state.user = null
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
        console.log("Login Action Payload:", action.payload);
        //state.token = action.payload.token;  // token is undefined
        state.isAuthenticated = true;
      })
      .addMatcher(userApi.endpoints.current.matchFulfilled, (state, action) => {
        console.log("Current Action Payload:", action.payload);
        state.isAuthenticated = true;
        state.current = action.payload;
      })
      .addMatcher(userApi.endpoints.getUserById.matchFulfilled, (state, action) => {
          console.log("Get Action Payload:", action.payload);
          state.user = action.payload;
        },
      )
  },
})

export const { logout, resetUser } = slice.actions
export default slice.reducer

export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated
export const selectCurrent = (state: RootState) => state.user.current
export const selectUsers = (state: RootState) => state.user.users
export const selectUser = (state: RootState) => state.user.user
