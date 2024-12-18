import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiCall } from "services";

const initialState = {
  status: false,
  isLoading: false,
};

export const getAccountStatus = createAsyncThunk("getAccountStatus", apiCall);

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAccountStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAccountStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = action?.payload?.data?.status;
        localStorage.setItem("acc_found", action?.payload?.data?.status);
      })
      .addCase(getAccountStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export default accountsSlice.reducer;
