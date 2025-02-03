import { createSlice } from "@reduxjs/toolkit";

const contentSlice = createSlice({
  name: "content",
  initialState: {
    contentData: {},
  },
  reducers: {
    setContent(state, action) {
      state.contentData = action.payload;
    },
  },
});

export const { setContent } = contentSlice.actions;
export default contentSlice.reducer;
