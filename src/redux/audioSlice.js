// audioSlice.js
"use client"
import { createSlice } from "@reduxjs/toolkit";

const audioSlice = createSlice({
  name: "audio",
  initialState: {
    quizSound: [], 
  },
  reducers: {
    setQuizSound: (state, action) => {
      state.quizSound = action.payload;
    },
  },
});

export const { setQuizSound } = audioSlice.actions;

export const selectQuizSound = (state) => state.audio.quizSound;

export default audioSlice.reducer;
