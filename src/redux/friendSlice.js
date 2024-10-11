// friendSlice.js
"use client";
import { createSlice } from "@reduxjs/toolkit";

const friendSlice = createSlice({
  name: "friend",
  initialState: {
    roomInfo: {},
  },
  reducers: {
    setRoomFriend: (state, action) => {
      state.roomInfo = action.payload;
    },
  },
});

export const { setRoomFriend } = friendSlice.actions;

export const selectRoomFriend = (state) => state.friend;

export default friendSlice.reducer;
