import { createSlice } from "@reduxjs/toolkit";

type HeaderState = {
  currentPage: string;
};

const initialState: HeaderState = {
  currentPage: "",
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeaderState(state, action) {
      state.currentPage = action.payload;
    },
  },
});

export const { setHeaderState } = headerSlice.actions;
export default headerSlice.reducer;
