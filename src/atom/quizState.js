"use client";
import { atom } from "recoil";
import Cookies from "js-cookie";

const score = Cookies.get("score");
export const quizResultsState = atom({
  key: "quizResultsState",
  default: {
    scoreCounting: score,
    totalQuestions: 0,
  },
});

export const reRender = atom({
  key: "reRender",
  default: false,
});
