// quizSlice.js
"use client"
import { createSlice } from "@reduxjs/toolkit";

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    quizInfo: {},
  },
  reducers: {
    setquizInfo: (state, action) => {
      state.quizInfo = action.payload;
    },
  },
});

export const { setquizInfo } = quizSlice.actions;

export const selectQuizInfo = (state) => state.quiz;

export default quizSlice.reducer;
