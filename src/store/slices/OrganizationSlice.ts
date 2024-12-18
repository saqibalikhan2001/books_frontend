import { createSlice, Slice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiCall } from "services";

const initialState = {
  ncx_data: {
    organization_type_list: [],
    country_list: [],
    currency_list: [],
    fiscal_year_list: [],
  },
  listing: {},
  details: {},
  error: {},
  loading: false,
};

export const createOrganization = createAsyncThunk("ncx_data", apiCall);
export const org_listing = createAsyncThunk("listing", apiCall);
export const set_organization = createAsyncThunk("set_organization", apiCall);
export const editOrganization = createAsyncThunk("edit_organization", apiCall);

export const organizationSlice: Slice = createSlice({
  name: "organizationData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createOrganization.rejected, (state, action) => {
      if (action.payload) {
      } else {
        state.error = action.error;
      }
    });

    builder.addCase(createOrganization.fulfilled, (state, { payload = {} }) => {
      state.details = payload.data;
      state.loading = false;
      state.error = {};
    });

    builder.addCase(org_listing.rejected, (state, action) => {
      if (action.payload) {
      } else {
        state.error = action.error;
      }
    });

    builder.addCase(org_listing.fulfilled, (state, { payload }) => {
      state.listing = payload;
      state.loading = false;
      state.error = {};
    });

    builder.addCase(set_organization.rejected, (state, action) => {
      if (action.payload) {
      } else {
        state.error = action.error;
      }
    });

    builder.addCase(set_organization.fulfilled, (state) => {
      // state.listing = payload;
      state.loading = false;
      state.error = {};
    });

    builder.addCase(editOrganization.fulfilled, (state) => {
      // state.listing = payload;
      state.loading = false;
      state.error = {};
    });
  },
});

// export const { setlistingData } = organizationSlice.actions;
export default organizationSlice.reducer;
