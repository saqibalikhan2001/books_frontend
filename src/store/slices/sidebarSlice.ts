import { createSlice } from "@reduxjs/toolkit";
import { Navigation } from "store/types";

const initialState: Navigation = {
  open: true,
  width: 0,
};
const sidebarSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    sidebarPosition: (state, { payload }) => {
      state.open = payload;
    },
    sidebarWidth: (state, { payload }) => {
      state.width = payload;
    },
  },
});

export const { sidebarPosition, sidebarWidth } = sidebarSlice.actions;

export default sidebarSlice.reducer;
