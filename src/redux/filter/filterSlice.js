import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: {
    cities: [],
    hours: [],
    categories: [],
  },
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
  },
});

export const { setCityList, setHourList, setCategoryList } =
  filterSlice.actions;
export default filterSlice.reducer;
