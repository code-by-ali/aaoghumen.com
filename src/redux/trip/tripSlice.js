import { createSlice } from "@reduxjs/toolkit";
import { RESET_APP } from "../actions";

const initialState = {
  preTrips: [],
  planTrips: [],
  activeTab: "preTrip",
  cart: {
    selectedTrips: [],
    selectedCategory: "",
    dropLocation: "",
    selectedTime: "",
  },
  generatedTrip: {
    selectedTrips: [],
    dropLocation: "",
    data: [],
    generatedAt: "",
    paymentId: "",
    selectedTime: "",
  },
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
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
    setPreTripTime(state, action) {
      state.cart.selectedTime = action.payload;
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
      state.cart.selectedTime = "";
    },
    setGeneratedTripFromCart(state, action) {
      const currentDateTime = new Date();
      state.generatedTrip.selectedTrips = action.payload.selectedTrips;
      state.generatedTrip.dropLocation = action.payload.dropLocation;
      state.generatedTrip.generatedAt = currentDateTime.toISOString();
      state.generatedTrip.paymentId = action.payload.paymentId;
      state.generatedTrip.selectedTime = action.payload.selectedTime;
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
      state.generatedTrip.selectedTime = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_APP, () => initialState);
  },
});

export const {
  setPreTripTime,
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
