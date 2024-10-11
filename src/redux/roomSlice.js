// roomSlice.js
"use client"
import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: "room",
  initialState: {
    roomData: {}, 
  }, 
  reducers: {
    setRoomData: (state, action) => {
     state.roomData =  action.payload;
    },
  },
});

export const { setRoomData } = roomSlice.actions;

export const selectRoomData = (state) => state.room;

export default roomSlice.reducer;
