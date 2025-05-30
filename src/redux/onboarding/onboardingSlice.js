import { createSlice } from "@reduxjs/toolkit";
import { RESET_APP } from "../actions";

const initialState = {
  city: "",
  time: "",
  language: "",
  pickPoint: "",
  category: "",
  step: 0,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setCity(state, action) {
      state.city = action.payload;
    },
    setTime(state, action) {
      state.time = action.payload;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
    setPickPoint(state, action) {
      state.pickPoint = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    setStep(state, action) {
      state.step = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_APP, () => initialState);
  },
});

export const {
  setCity,
  setTime,
  setLanguage,
  setPickPoint,
  setCategory,
  setStep,
} = onboardingSlice.actions;
export default onboardingSlice.reducer;
