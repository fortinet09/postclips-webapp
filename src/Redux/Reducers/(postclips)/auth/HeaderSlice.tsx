import { createSlice } from "@reduxjs/toolkit";

type HeaderState = {
  currentPage: string;
  currentStep: number;
  totalSteps: number;
  steps: string[];
};

const initialState: HeaderState = {
  currentPage: "",
  currentStep: 1,
  totalSteps: 3, // Now 3 steps
  steps: ["Campaign Details", "Upload Media", "Review & Publish"],
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeaderState(state, action) {
      state.currentPage = action.payload;
    },
    setStep(state, action) {
      state.currentStep = action.payload;
    },
    setSteps(state, action) {
      state.steps = action.payload;
      state.totalSteps = action.payload.length;
    },
  },
});

export const { setHeaderState, setStep, setSteps } = headerSlice.actions;
export default headerSlice.reducer;
