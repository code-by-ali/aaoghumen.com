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
      state.cart.selectedTrips = [...state.cart.selectedTrips, action.payload];
      state.cart.selectedCategory = "planTrip";
    },
    setTripRemove(state, action) {
      state.cart.selectedTrips = state.cart.selectedTrips.filter(
        (obj) => obj.code !== action.payload
      );
    },
    setEmptyCart(state) {
      state.cart.selectedTrips = [];
      state.cart.selectedCategory = "";
    },
  },
});

export const {
  setActiveTab,
  setPreTrips,
  setPlanTrips,
  setCart,
  setPreTripCart,
  setPlanTripCart,
  setEmptyCart,
  setTripRemove,
} = tripSlice.actions;
export default tripSlice.reducer;
