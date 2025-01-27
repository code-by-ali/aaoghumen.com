import { createSlice } from "@reduxjs/toolkit";

const tripSlice = createSlice({
  name: "trip",
  initialState: {
    preTrips: [],
    planTrips: [],
    activeTab: "preTrip",
  },
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setPreTrips(state, action) {
      state.preTrips = action.payload;
    },
    setPlanTrips(state, action) {
      state.planTrips = action.payload;
    },
  },
});

export const { setActiveTab, setPreTrips, setPlanTrips } = tripSlice.actions;
export default tripSlice.reducer;
