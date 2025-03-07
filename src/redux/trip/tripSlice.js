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
      dropLocation: "",
    },
    generatedTrip: {
      selectedTrips: [],
      dropLocation: "",
      data: [],
      generatedAt: "",
      paymentId: "",
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
    setDropLocation(state, action) {
      state.cart.dropLocation = action.payload;
    },
    setEmptyCart(state) {
      state.cart.selectedTrips = [];
      state.cart.selectedCategory = "";
      state.cart.dropLocation = "";
    },
    setGeneratedTripFromCart(state, action) {
      const currentDateTime = new Date();
      state.generatedTrip.selectedTrips = action.payload.selectedTrips;
      state.generatedTrip.dropLocation = action.payload.dropLocation;
      state.generatedTrip.generatedAt = currentDateTime.toISOString();
      state.generatedTrip.paymentId = action.payload.paymentId;
    },
    setGeneratedTripData(state, action) {
      state.generatedTrip.data = action.payload;
    },
    setEmptyGeneratedTrip(state) {
      state.generatedTrip.selectedTrips = [];
      state.generatedTrip.data = [];
      state.generatedTrip.dropLocation = "";
      state.generatedTrip.generatedAt = "";
      state.generatedTrip.paymentId = "";
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
  setGeneratedTripData,
  setDropLocation,
  setEmptyGeneratedTrip,
  setGeneratedTripFromCart,
} = tripSlice.actions;
export default tripSlice.reducer;
