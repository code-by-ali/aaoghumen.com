import { createSlice } from "@reduxjs/toolkit";

const tripSlice = createSlice({
  name: "trip",
  initialState: {
    preTrips: [],
    planTrips: [],
    activeTab: "preTrip",
    cart: {
      selectedTrips: [],
      selectedCategory: "",
    },
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
    setPreTripCart(state, action) {
      state.cart.selectedTrips = action.payload;
      state.cart.selectedCategory = "preTrip";
    },
    setPlanTripCart(state, action) {
      state.cart.selectedTrips = action.payload;
      state.cart.selectedCategory = "planTrip";
    },
  },
});

export const { setActiveTab, setPreTrips, setPlanTrips, setCart } =
  tripSlice.actions;
export default tripSlice.reducer;
