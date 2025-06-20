import { createSlice } from "@reduxjs/toolkit";
import { RESET_APP } from "../actions";

const initialState = {
  cities: [],
  hours: [],
  categories: [],
  languages: [],
  pickPoints: [],
  selectedFilters: {
    Places: [],
    Languages: [],
    "Traveling Time": [],
    "Current Location": [],
  },
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setCityList(state, action) {
      state.cities = action.payload;
    },
    setHourList(state, action) {
      state.hours = action.payload;
    },
    setCategoryList(state, action) {
      state.categories = action.payload;
    },
    setLanguageList(state, action) {
      state.languages = action.payload;
    },
    setPickPointList(state, action) {
      state.pickPoints = action.payload;
    },
    setSelectedFilters(state, action) {
      state.selectedFilters = action.payload;
    },
    resetFilters(state, action) {
      state.selectedFilters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_APP, () => initialState);
  },
});

export const {
  setCityList,
  setHourList,
  setCategoryList,
  setPickPointList,
  setLanguageList,
  setSelectedFilters,
  resetFilters,
} = filterSlice.actions;
export default filterSlice.reducer;
