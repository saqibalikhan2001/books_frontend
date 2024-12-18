import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiCall } from "services";
import { AuthSlice } from "store/types";

const initialState: AuthSlice = {
  token: {
    access_token: "",
    expires_in: "",
    id_token: "",
    refresh_token: "",
    token_type: "",
  },
  details: {
    platform_type: "",
    current_organization_id: null,
    id: null,
  },
  users_organizations: [],
  role: {
    id: null,
    name: "",
    type: "",
    created_by: "",
    created_at: "",
    updated_at: "",
    deleted_at: "",
    permissions: {},
    platform_type: "",
    organization_id: null,
  },
  organization_id: "",
  loading: false,
  error: {},
  modulePermissionModal: false,
  drawer: false,
};

export const apiService = createAsyncThunk("login", apiCall);
export const Logout = createAsyncThunk("logout", apiCall);
export const currentUserRole = createAsyncThunk("currentUser/role", apiCall);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => state,
    setOrganization: (state, action: any) => {
      state.organization_id = action.payload;
    },
    setDetails: (state, { payload }) => {
      state.details = payload || {};
      state.organization_id = payload?.current_organization_id || "";
      state.users_organizations = payload?.users_organizations || [];
    },
    setModulePermissionModal: (state, { payload }) => {
      state.modulePermissionModal = payload || false;
    },
    setDrawer: (state, { payload }) => {
      state.drawer = payload || false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(apiService.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(apiService.fulfilled, (state, { payload = {} }) => {
      if (payload) {
        state.token = payload;
        state.loading = false;
        state.details = payload?.user || {};
        state.organization_id = payload?.user?.current_organization_id || "";
        state.users_organizations = payload?.user?.users_organizations || [];
      }
    });
    builder.addCase(apiService.rejected, (state, action) => {
      state.loading = false;
      Promise.reject(action);
    });

    builder.addCase(Logout.rejected, (state, action) => {
      if (action.payload) {
      } else {
        state.error = action.error;
      }
    });

    builder.addCase(currentUserRole.fulfilled, (state, { payload }) => {
      state.role = payload;
      state.loading = false;
    });
    builder.addCase(currentUserRole.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default authSlice.reducer;
export const { setOrganization, setDetails, setModulePermissionModal, setDrawer } =
  authSlice.actions;
