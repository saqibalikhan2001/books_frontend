import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appLoader: false,
};
const loader = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setAppLoader: (state, { payload }) => {
      state.appLoader = payload;
    },
  },
});

export const { setAppLoader } = loader.actions;

export default loader.reducer;
