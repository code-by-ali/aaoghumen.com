import { createSlice } from "@reduxjs/toolkit";

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: {
    city: "",
    time: "",
    language: "",
    pickPoint: "",
    step: 0,
  },
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
    setStep(state, action) {
      state.step = action.payload;
    },
  },
});

export const { setCity, setTime, setLanguage, setPickPoint, setStep } =
  onboardingSlice.actions;
export default onboardingSlice.reducer;
