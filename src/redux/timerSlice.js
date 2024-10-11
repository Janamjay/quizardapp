// timerSlice.js
"use client"
import { createSlice } from "@reduxjs/toolkit";

const timerSlice = createSlice({
  name: "timer",
  initialState: {
    quizData: {},
  },
  reducers: {
    setQuizData: (state, action) => {
      state.quizData = action.payload;
    },
  },
});

export const { setQuizData } = timerSlice.actions;

export const selectQuizData = (state) => state.timer.quizData;

export default timerSlice.reducer;
