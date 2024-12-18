/** @format */

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import {
  FLUSH,
  PAUSE,
  PURGE,
  PERSIST,
  REGISTER,
  REHYDRATE,
  persistStore,
  persistReducer,
} from "reduxjs-toolkit-persist";
import storage from "reduxjs-toolkit-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authSlice from "./slices/authSlice";
import accountsSlice from "./slices/accountsSlice";
import { loginAPI } from "../services/auth";
import sidebarSlice from "./slices/sidebarSlice";
import { unauthenticatedMiddleware } from "middleware";
import { RESET_STATE_ACTION_TYPE } from "./action/resetState";
// import OrganizationSlice from "./slices/OrganizationSlice";
import {
  roleQuery,
  UserQuery,
  ItemsQuery,
  BillsQuery,
  InvoiceQuery,
  JournalQuery,
  AccountsQuery,
  CategoryQuery,
  CustomerQuery,
  PackagesQuery,
  TablePrefQuery,
  warehouseQuery,
  EstimatesQuery,
  inviteUserQuery,
  CreditNotesQuery,
  SalesOrdersQuery,
  BillPaymentsQuery,
  organizationQuery,
  PurchaseOrdersQuery,
  PaymentReceivedQuery,
  LedgerQuery,
  SalesCustomerQuery,
  SalesBySalesPersonQuery,
  TrialBalanceQuery,
  InvoiveReportQuery,
  SalesItemsQuery,
  BillReportsQuery,
  RefundReportQuery,
  estimateReportQuery,
  LedgerReportsQuery,
  PaymentMadeReportQuery,
  PaymentReceiptReportQuery,
  CustomerBalanceReportQuery,
  ReceivableSummaryReportsQuery,
  ReceivableDetailReportsQuery,
  CreditNotesReportsQuery,
  ArAgingSummaryReport,
  ArAgingDetails,
  TaxSummaryReportsQuery,
  TaxSummaryDetailsReportsQuery,
} from "./query";
import { ExpenseQuery } from "./query/expense";
import loadingSlice from "./slices/loadingSlice";
import { RolepermissionQuery } from "./query/permissions";
import { PaymentTermsQuery } from "./query/paymentTerm";
import { TaxSummaryTimeDurationQuery } from "./query/taxSummaryTimeDuration";
import { TaxSummaryDetailTimeDurationQuery } from "./query/taxSummaryDetailTimeDuration";
import { TaxSummaryDetailsCutomerQuery } from "./query/taxSummaryDetailsCustomer";
import { TaxSummaryDetailsSupplierQuery } from "./query/taxSummaryDetailsSupplier";
// import { Toast } from "app/shared";
// import { ssoLogoutPath } from "utils";
// import { endpoints } from "static";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authReducer"],
};

// export const rtkQueryErrorLogger: Middleware = (api: any) => (next) => (action) => {
//   const sso_logout_url = ssoLogoutPath();
//   if (isRejected(action)) {
//     if (action.payload?.status === 403) {
//       if (action.payload?.data?.status === "access_denied") {
//         Toast({
//           message:
//             "Admin has changed the permissions. Forcefully Refreshing to load latest set permissions for you.",
//           type: "info",
//         });
//         api?.dispatch(currentUserRole({ url: endpoints.CURRENT_USER_ROLE }));

//         setTimeout(() => {
//           location.reload();
//         }, 3000);
//       } else if (action.payload?.data?.status === "logout") {
//         if (import.meta.env.VITE_SSO_ENABLE === "true") {
//           setTimeout(function () {
//             window.location.href = sso_logout_url;
//           }, 100);
//         } else {
//           api?.dispatch(Logout({ url: endpoints.LOGOUT }));
//           localStorage.clear();
//         }
//       }
//     }
//   }

//   return next(action);
// };

const reducers = {
  loader: loadingSlice,
  authReducer: authSlice,
  sidebarReducer: sidebarSlice,
  accountRedecer: accountsSlice,
  // organizationData: OrganizationSlice,
  [loginAPI.reducerPath]: loginAPI.reducer,
  [roleQuery.reducerPath]: roleQuery.reducer,
  [UserQuery.reducerPath]: UserQuery.reducer,
  [ItemsQuery.reducerPath]: ItemsQuery.reducer,
  [BillsQuery.reducerPath]: BillsQuery.reducer,
  [JournalQuery.reducerPath]: JournalQuery.reducer,
  [InvoiceQuery.reducerPath]: InvoiceQuery.reducer,
  [ExpenseQuery.reducerPath]: ExpenseQuery.reducer,
  [AccountsQuery.reducerPath]: AccountsQuery.reducer,
  [PackagesQuery.reducerPath]: PackagesQuery.reducer,
  [RolepermissionQuery.reducerPath]: RolepermissionQuery.reducer,
  [PaymentTermsQuery.reducerPath]: PaymentTermsQuery.reducer,
  [CategoryQuery.reducerPath]: CategoryQuery.reducer,
  [CustomerQuery.reducerPath]: CustomerQuery.reducer,
  [TablePrefQuery.reducerPath]: TablePrefQuery.reducer,
  [warehouseQuery.reducerPath]: warehouseQuery.reducer,
  [EstimatesQuery.reducerPath]: EstimatesQuery.reducer,
  [inviteUserQuery.reducerPath]: inviteUserQuery.reducer,
  [CreditNotesQuery.reducerPath]: CreditNotesQuery.reducer,
  [SalesOrdersQuery.reducerPath]: SalesOrdersQuery.reducer,
  [BillPaymentsQuery.reducerPath]: BillPaymentsQuery.reducer,
  [organizationQuery.reducerPath]: organizationQuery.reducer,
  [PurchaseOrdersQuery.reducerPath]: PurchaseOrdersQuery.reducer,
  [PaymentReceivedQuery.reducerPath]: PaymentReceivedQuery.reducer,
  [ArAgingDetails.reducerPath]: ArAgingDetails.reducer,

  [LedgerQuery.reducerPath]: LedgerQuery.reducer,
  [InvoiveReportQuery.reducerPath]: InvoiveReportQuery.reducer,
  [SalesItemsQuery.reducerPath]: SalesItemsQuery.reducer,
  [SalesCustomerQuery.reducerPath]: SalesCustomerQuery.reducer,
  [SalesBySalesPersonQuery.reducerPath]: SalesBySalesPersonQuery.reducer,
  [TrialBalanceQuery.reducerPath]: TrialBalanceQuery.reducer,
  [BillReportsQuery.reducerPath]: BillReportsQuery.reducer,
  [RefundReportQuery.reducerPath]: RefundReportQuery.reducer,
  [estimateReportQuery.reducerPath]: estimateReportQuery.reducer,
  [PaymentMadeReportQuery.reducerPath]: PaymentMadeReportQuery.reducer,
  [PaymentReceiptReportQuery.reducerPath]: PaymentReceiptReportQuery.reducer,
  [LedgerReportsQuery.reducerPath]: LedgerReportsQuery.reducer,
  [CustomerBalanceReportQuery.reducerPath]: CustomerBalanceReportQuery.reducer,
  [ReceivableSummaryReportsQuery.reducerPath]: ReceivableSummaryReportsQuery.reducer,
  [ReceivableDetailReportsQuery.reducerPath]: ReceivableDetailReportsQuery.reducer,
  [CreditNotesReportsQuery.reducerPath]: CreditNotesReportsQuery.reducer,
  [ArAgingSummaryReport.reducerPath]: ArAgingSummaryReport.reducer,
  [TaxSummaryReportsQuery.reducerPath]: TaxSummaryReportsQuery.reducer,
  [TaxSummaryTimeDurationQuery.reducerPath]: TaxSummaryTimeDurationQuery.reducer,
  [TaxSummaryDetailsReportsQuery.reducerPath]: TaxSummaryDetailsReportsQuery.reducer,
  [TaxSummaryDetailTimeDurationQuery.reducerPath]: TaxSummaryDetailTimeDurationQuery.reducer,
  [TaxSummaryDetailsCutomerQuery.reducerPath]: TaxSummaryDetailsCutomerQuery.reducer,
  [TaxSummaryDetailsSupplierQuery.reducerPath]: TaxSummaryDetailsSupplierQuery.reducer,
};

const combinedReducer = combineReducers<typeof reducers>(reducers);

export const rootReducer: Reducer<RootState> = (state, action) => {
  if (action.type === RESET_STATE_ACTION_TYPE) {
    state = {} as RootState;
  }

  return combinedReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          "meta.arg",
          "payload.timestamp",
          "meta.baseQueryMeta.request",
          "meta.baseQueryMeta.response",
        ],
        // Ignore these paths in the state
        // ignoredPaths: ["items.dates"],
      },
    }).concat(
      // import.meta.env.NODE_ENV === "development"
      // ?
      [
        // rtkQueryErrorLogger,
        UserQuery.middleware,
        roleQuery.middleware,
        BillsQuery.middleware,
        ItemsQuery.middleware,
        ExpenseQuery.middleware,
        InvoiceQuery.middleware,
        CustomerQuery.middleware,
        CategoryQuery.middleware,
        PackagesQuery.middleware,
        warehouseQuery.middleware,
        TablePrefQuery.middleware,
        EstimatesQuery.middleware,
        unauthenticatedMiddleware,
        inviteUserQuery.middleware,
        CreditNotesQuery.middleware,
        SalesOrdersQuery.middleware,
        organizationQuery.middleware,
        BillPaymentsQuery.middleware,
        PurchaseOrdersQuery.middleware,
        PaymentReceivedQuery.middleware,
        JournalQuery.middleware,
        ArAgingDetails.middleware,
        AccountsQuery.middleware,
        LedgerQuery.middleware,
        SalesCustomerQuery.middleware,
        SalesBySalesPersonQuery.middleware,
        SalesItemsQuery.middleware,
        InvoiveReportQuery.middleware,
        TrialBalanceQuery.middleware,
        BillReportsQuery.middleware,
        RefundReportQuery.middleware,
        estimateReportQuery.middleware,
        PaymentMadeReportQuery.middleware,
        PaymentReceiptReportQuery.middleware,
        CustomerBalanceReportQuery.middleware,
        LedgerReportsQuery.middleware,
        ReceivableSummaryReportsQuery.middleware,
        ReceivableDetailReportsQuery.middleware,
        CreditNotesReportsQuery.middleware,
        ArAgingSummaryReport.middleware,
        TaxSummaryReportsQuery.middleware,
        TaxSummaryTimeDurationQuery.middleware,
        TaxSummaryDetailsReportsQuery.middleware,
        TaxSummaryDetailTimeDurationQuery.middleware,
        RolepermissionQuery.middleware,
        PaymentTermsQuery.middleware,
        TaxSummaryDetailsCutomerQuery.middleware,
        TaxSummaryDetailsSupplierQuery.middleware,
      ]
      // : [unauthenticatedMiddleware]
    ),
  // devTools: import.meta.env.NODE_ENV === "development",
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof combinedReducer>;
export const useTypedDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
