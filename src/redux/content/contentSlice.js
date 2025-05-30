import { createSlice } from "@reduxjs/toolkit";
import { RESET_APP } from "../actions";
const initialState = {
  contentData: {},
};
const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setContent(state, action) {
      state.contentData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_APP, () => initialState);
  },
});

export const { setContent } = contentSlice.actions;
export default contentSlice.reducer;
