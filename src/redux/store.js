// store.js
"use client"
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import audioReducer from "./audioSlice";
import thunk from "redux-thunk";
import timerSlice from "./timerSlice";
import roomSlice from "./roomSlice";
import friendSlice from "./friendSlice";
import quizSlice from "./quizSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  audio: audioReducer,
  timer: timerSlice,
  room: roomSlice,
  friend: friendSlice,
  quiz: quizSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export default store;

