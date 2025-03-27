import { createSlice } from "@reduxjs/toolkit";

type HeaderState = {
  mainPage: {
    name: string;
    route: string;
  };
  currentPage: {
    name: string;
    route: string;
  } | null;
};

const initialState: HeaderState = {
  mainPage: {
    name: "",
    route: "",
  },
  currentPage: {
    name: "",
    route: "",
  },
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setCurrentState(state, action) {
      state.mainPage = action.payload.mainPage;
      state.currentPage = action.payload.currentPage;
    },
  },
});

export const { setCurrentState } = headerSlice.actions;
export default headerSlice.reducer;
