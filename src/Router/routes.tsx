/** @format */
import { ReactNode, useEffect } from "react";
import { Navigate, RouteObject, useNavigate, useRoutes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import * as AuthRoutes from "_Auth";
import { ErrorFallback, NotFound } from "app/shared";
// import { PrivateRoute } from "./Private";
import * as AppRoutes from "app/containers";
//@ts-ignore
import { useAxios, useStore } from "app/Hooks";
import {
  getKeyFromLS,
  getKeyFromSS,
  getcookietoken,
  removeCookieToken,
  removeCookies,
  removeKeyFromSS,
  setKeyInSS,
} from "utils/Storage";
import { Dashboard } from "app/containers/index";
import { getAccountStatus } from "store/slices/accountsSlice";
import { useTypedDispatch, useTypedSelector } from "store";
import { Logout } from "store/slices/authSlice";
import { RESET_STATE_ACTION_TYPE } from "store/action/resetState";
import { endpoints, routeNames } from "static";
import { axiosCall } from "services";
import useNetworkStatus from "app/Hooks/useOnlineStatus";
import { Modal, Space, Typography } from "antd";
import { ssoLogoutPath } from "utils";
import { SpinnerX } from "app/shared/PageLoader";

const { LOGIN } = routeNames;
const { LOGOUT } = endpoints;
export const RouterConfig = ({ auth }: { auth: boolean }) => {
  //@ts-ignore
  const accFound = localStorage.getItem("acc_found");

  //@ts-ignore
  const get_acc_status = accFound !== "undefined" ? JSON.parse(accFound) : null;
  const navigate = useNavigate();
  const sso_logout = ssoLogoutPath();

  const dispatch = useTypedDispatch();

  const selector = useTypedSelector((state: any) => state?.accountRedecer);

  const isOnline = useNetworkStatus();
  const {
    users_organizations,
    access_token,
    currentUserOrganization,
    current_organization_id,
    id_token,
  } = useStore();
  // const { callAxios } = useAxios();
  useEffect(() => {
    if (
      import.meta.env.VITE_ADD_ACCOUNTS === "true" &&
      auth &&
      current_organization_id &&
      id_token
    ) {
      if (!location.pathname.includes("preferences")) {
        dispatch(getAccountStatus({ data: {}, method: "get", url: "/old_accounts", isAuth: true }));
      }
    }
    window.addEventListener("storage", listener);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", listener);
      window.removeEventListener("focus", onFocus);
    };
  }, [currentUserOrganization, auth]);

  useEffect(() => {
    if (access_token) {
      axiosCall({
        data: { accessToken: access_token },
        method: "post",
        url: `/auth/accessToken`,
      }).then((res) => {
        if (!res) {
          removeCookieToken();
          removeCookies();
          if (import.meta.env.VITE_SSO_ENABLE === "true") {
            window.location.href = sso_logout;
          }
          dispatch(Logout({ url: LOGOUT }))
            .unwrap()
            .then((res) => {
              if (res) {
                dispatch({ type: RESET_STATE_ACTION_TYPE });
                localStorage.clear();
                navigate(LOGIN, { replace: true });
              }
            });
        }
      });
    }
  }, [access_token]);

  useEffect(() => {
    const token = getcookietoken();
    const sso_check = JSON.parse(localStorage.getItem("sso_check") as any);
    const ssoEnabled = import.meta.env.VITE_SSO_ENABLE;
    //console.log("1");
    if (
      JSON.parse(`${import.meta.env.VITE_SSO_ENABLE}`) &&
      !sso_check &&
      !location.pathname.includes("/invite/accept")
    )
      navigate(routeNames.CHECK_LOGIN);

    //console.log('ssoEnabled ---> ', ssoEnabled)
    if (ssoEnabled === "true") {
      if (users_organizations.length === 0 && token && sso_check === false) {
        navigate(routeNames.CHECK_LOGIN);
      }
    }
    auth && !users_organizations.length && navigate("/register-organization");
  }, [users_organizations.length, auth]);

  const ONlineError = () => {
    return (
      <Modal
        centered
        width={400}
        footer={null}
        destroyOnClose
        closable={false}
        open={!isOnline}
        maskClosable={false}
        className="radius-5 default_modal"
      >
        <Space>
          <Typography.Title level={3}> OOPS !</Typography.Title>
        </Space>
        <br />
        <Space>
          <Typography.Text>It seems that you have unstable internet connection.</Typography.Text>
        </Space>
      </Modal>
    );
  };

  // const Fallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  //   return (
  //     <div role="alert">
  //       <p>Something went wrong:</p>
  //       <pre>{error.message}</pre>
  //       <button onClick={resetErrorBoundary}>Try again</button>
  //     </div>
  //   );
  // }

  const listener = () => {
    let vl = JSON.parse(getKeyFromLS("switch_org"));

    if (vl) {
      setKeyInSS("switch_org", JSON.stringify(vl));
      localStorage.setItem("switch_org", JSON.stringify(false));
      setKeyInSS("checking", true);
    }
  };

  const onFocus = () => {
    let val = getKeyFromSS("checking");
    let stat = JSON.parse(getKeyFromSS("switch_org"));

    if (val && stat) {
      window.location.reload();
      val && removeKeyFromSS("checking");
      val && removeKeyFromSS("switch_org");
    }
  };

  const AuthRoute = ({ component }: { component: ReactNode }) =>
    auth ? (
      <>
        {
          //@ts-ignore
          ONlineError()
        }
        {import.meta.env.VITE_ADD_ACCOUNTS === "true" &&
        // currentUserOrganization?.platform_type === "ims,books" &&
        get_acc_status &&
        selector?.status &&
        !location?.pathname?.includes("/add-accounts") &&
        !location?.pathname?.includes("/organization") ? (
          <Navigate to={routeNames.ADDACCOUNTS} />
        ) : (
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => null}>
            {selector?.isLoading ? <SpinnerX /> : component}
          </ErrorBoundary>
        )}
      </>
    ) : (
      <Navigate to={routeNames.LOGIN} />
    );
  const CheckAuth = ({ children }: { children: ReactNode }) =>
    auth && users_organizations.length && !location.pathname.includes("/invite/accept") ? (
      <Navigate to={routeNames.DASHBOARD} />
    ) : (
      <>{children}</>
    );

  const publicRoutes: RouteObject[] = [
    {
      path: routeNames.CHECK_LOGIN,
      element: (
        <CheckAuth>
          <AuthRoutes.CheckLogin />
        </CheckAuth>
      ),
    },
    {
      path: routeNames.LOGIN,
      element: (
        <CheckAuth>
          <AuthRoutes.Login />
        </CheckAuth>
      ),
    },
    {
      path: routeNames.SINGUP,
      element: (
        <CheckAuth>
          <AuthRoutes.SignUp />
        </CheckAuth>
      ),
    },
    {
      path: routeNames.LOGIN,
      element: (
        <CheckAuth>
          <AuthRoutes.Login />
        </CheckAuth>
      ),
    },
    {
      path: routeNames.FORGET_PASSWORD,
      element: (
        <CheckAuth>
          <AuthRoutes.ForgetPassword />
        </CheckAuth>
      ),
    },
    {
      path: routeNames.RESET_PASSWORD,
      element: (
        <CheckAuth>
          <AuthRoutes.ResetPassword />
        </CheckAuth>
      ),
    },
    {
      path: routeNames.VERIFY,
      element: (
        <CheckAuth>
          <AuthRoutes.Verification />
        </CheckAuth>
      ),
    },
    {
      path: routeNames.INVITE_CONFIRM,
      element: <AuthRoutes.InviteConfirmation />,
    },
    // {
    //   path: routeNames.SSO,
    //   element: <AuthRoutes.Sso />,
    // },
    {
      path: "/",
      element: (
        <CheckAuth>
          <AuthRoutes.LandingPage />
        </CheckAuth>
      ),
    },
    {
      path: "/accountAuthenticate",
      element: (
        <CheckAuth>
          <AuthRoutes.AuthenticateAccount />
        </CheckAuth>
      ),
    },
  ];

  const routes = useRoutes([
    ...publicRoutes,
    {
      path: routeNames.DASHBOARD,
      element: <AuthRoute component={<Dashboard />} />,
    },

    /** Organizations Routes */
    {
      path: routeNames.REGISTER_ORGANIZATION,
      element: <AuthRoute component={<AppRoutes.Register />} />,
    },
    {
      path: routeNames.ORGANIZATION_LISTING,
      element: <AuthRoute component={<AppRoutes.Organizations />} />,
    },
    {
      path: routeNames.ORGANIZATION_PROFILE,
      element: <AuthRoute component={<AppRoutes.EditOrganization />} />,
    },
    {
      path: routeNames.ORGANIZATION_CREATE,
      element: <AuthRoute component={<AppRoutes.CreateOrganization />} />,
    },
    {
      path: routeNames.ORGANIZATION_DETAIL,
      element: <AuthRoute component={<AppRoutes.OrganizationViewDetail />} />,
    },
    {
      path: routeNames.TAX,
      element: <AuthRoute component={<AppRoutes.Tax />} />,
    },

    /** Accounts Routes */
    {
      path: routeNames.ACCOUNTS,
      element: <AuthRoute component={<AppRoutes.Accounts />} />,
    },
    {
      path: routeNames.ADDACCOUNTS,
      element: <AuthRoute component={<AppRoutes.AddAccounts />} />,
    },
    {
      path: routeNames.PAYMENT_METHODS,
      element: <AuthRoute component={<AppRoutes.PaymentMethods />} />,
    },
    {
      path: routeNames.ITEMS,
      element: <AuthRoute component={<AppRoutes.Items />} />,
    },
    {
      path: routeNames.ITEM_DETAILS,
      element: <AuthRoute component={<AppRoutes.ItemDetail />} />,
    },
    {
      path: routeNames.CURRENCY,
      element: <AuthRoute component={<AppRoutes.Currency />} />,
    },
    {
      path: routeNames.EDIT_ITEM,
      element: <AuthRoute component={<AppRoutes.EditItem />} />,
    },
    {
      path: routeNames.WAREHOUSE,
      element: <AuthRoute component={<AppRoutes.Warehouse />} />,
    },
    {
      path: routeNames.ADD_ITEM,
      element: <AuthRoute component={<AppRoutes.CreateItem />} />,
    },
    {
      path: routeNames.ITEM_CLONE,
      element: <AuthRoute component={<AppRoutes.CloneItem />} />,
    },
    {
      path: routeNames.EMAIL,
      element: <AuthRoute component={<AppRoutes.Email />} />,
    },
    {
      path: routeNames.ESTIMATEEMAIL,
      element: <AuthRoute component={<AppRoutes.Email />} />,
    },
    {
      path: routeNames.INVOICEEMAIL,
      element: <AuthRoute component={<AppRoutes.Email />} />,
    },

    /** Expense Routes */
    {
      path: routeNames.EXPENSE,
      element: <AuthRoute component={<AppRoutes.Expenses />} />,
    },
    {
      path: routeNames.ADD_EXPENSE,
      element: <AuthRoute component={<AppRoutes.CreateExpense />} />,
    },
    {
      path: routeNames.EDIT_EXPENSE,
      element: <AuthRoute component={<AppRoutes.EditExpense />} />,
    },
    /** Customers Routes */
    {
      path: routeNames.CUSTOMERS,
      element: <AuthRoute component={<AppRoutes.Customers />} />,
    },
    {
      path: routeNames.CUSTOMER_DETAILS,
      element: <AuthRoute component={<AppRoutes.CustomerDetail />} />,
    },
    {
      path: routeNames.ADD_CUSTOMER,
      element: <AuthRoute component={<AppRoutes.CreateCustomer />} />,
    },
    {
      path: routeNames.EDIT_CUSTOMER,
      element: <AuthRoute component={<AppRoutes.EditCustomer />} />,
    },
    {
      path: routeNames.CUSTOMER_CLONE,
      element: <AuthRoute component={<AppRoutes.CloneCustomer />} />,
    },

    /** Suppliers Routes */
    {
      path: routeNames.SUPPLIERS,
      element: <AuthRoute component={<AppRoutes.Suppliers />} />,
    },
    {
      path: routeNames.SUPPLIER_DETAILS,
      element: <AuthRoute component={<AppRoutes.SupplierDetail />} />,
    },
    {
      path: routeNames.EDIT_SUPPLIER,
      element: <AuthRoute component={<AppRoutes.EditSupplier />} />,
    },
    {
      path: routeNames.ADD_SUPPLIER,
      element: <AuthRoute component={<AppRoutes.CreateSupplier />} />,
    },
    {
      path: routeNames.SUPPLIER_CLONE,
      element: <AuthRoute component={<AppRoutes.CloneSupplier />} />,
    },

    /** Inovices Routes */
    {
      path: routeNames.INVOICES,
      element: <AuthRoute component={<AppRoutes.Invoices />} />,
    },
    {
      path: routeNames.INVOICE_DETAILS,
      element: <AuthRoute component={<AppRoutes.InvoiceDetails />} />,
    },
    {
      path: routeNames.ADD_INVOICE,
      element: <AuthRoute component={<AppRoutes.CreateInvoice />} />,
    },
    {
      path: routeNames.EDIT_INVOICE,
      element: <AuthRoute component={<AppRoutes.EditInvoices />} />,
    },
    {
      path: routeNames.INVOICE_ClONE,
      element: <AuthRoute component={<AppRoutes.CloneInvoice />} />,
    },

    /** Estimates Routes */
    {
      path: routeNames.ESTIMATES,
      element: (
        <AuthRoute
          component={
            //@ts-ignore
            // <ErrorBoundary FallbackComponent={Fallback} onReset={() => null}>
            <AppRoutes.Estimates />
            // </ErrorBoundary>
          }
        ></AuthRoute>
      ),
    },
    {
      path: routeNames.ADD_ESTIMATE,
      element: <AuthRoute component={<AppRoutes.CreateEsitmate />}></AuthRoute>,
    },
    {
      path: routeNames.ESTIMATES_DETAILS,
      element: <AuthRoute component={<AppRoutes.EsitmateDetails />}></AuthRoute>,
    },
    {
      path: routeNames.EDIT_ESTIMATE,
      element: <AuthRoute component={<AppRoutes.EditEstimates />}></AuthRoute>,
    },
    {
      path: routeNames.ESTIMATES_ClONE,
      element: <AuthRoute component={<AppRoutes.CloneEstimate />} />,
    },
    // /** Credit Notes Routes */
    {
      path: routeNames.CREDIT_NOTES,
      element: <AuthRoute component={<AppRoutes.CreditNotes />}></AuthRoute>,
    },
    {
      path: routeNames.CREDIT_NOTES_DETAILS,
      element: <AuthRoute component={<AppRoutes.CreditNoteDetails />}></AuthRoute>,
    },
    {
      path: routeNames.ADD_CREDIT_NOTE,
      element: <AuthRoute component={<AppRoutes.CreateCreditNote />}></AuthRoute>,
    },
    {
      path: routeNames.EDIT_CREDIT_NOTE,
      element: <AuthRoute component={<AppRoutes.EditCreditNotes />}></AuthRoute>,
    },
    /** Payments Received Routes */
    {
      path: routeNames.PAYMENTS_RECEIVED,
      element: <AuthRoute component={<AppRoutes.PaymentsReceived />}></AuthRoute>,
    },
    {
      path: routeNames.ADD_PAYMENTS_RECEIVED,
      element: <AuthRoute component={<AppRoutes.CreatePaymentReceived />}></AuthRoute>,
    },
    {
      path: routeNames.EDIT_PAYMENTS_RECEIVED,
      element: <AuthRoute component={<AppRoutes.EditPaymentReceived />}></AuthRoute>,
    },
    {
      path: routeNames.PAYMENTS_RECEIVED_DETAILS,
      element: <AuthRoute component={<AppRoutes.PaymentReceivedDetails />}></AuthRoute>,
    },
    /** PurchaseOrders Routes */
    {
      path: routeNames.PURCHASE_ORDERS,
      element: <AuthRoute component={<AppRoutes.PurchaseOrders />}></AuthRoute>,
    },
    {
      path: routeNames.ADD_PURCHASE_ORDER,
      element: <AuthRoute component={<AppRoutes.CreatePurchaseOrder />}></AuthRoute>,
    },
    {
      path: routeNames.EDIT_PURCHASE_ORDER,
      element: <AuthRoute component={<AppRoutes.EditPurchaseOrder />}></AuthRoute>,
    },
    /** Bills Routes */
    {
      path: routeNames.BILLS,
      element: <AuthRoute component={<AppRoutes.Bills />}></AuthRoute>,
    },
    {
      path: routeNames.BILLSDetail,
      element: <AuthRoute component={<AppRoutes.BillsDetail />}></AuthRoute>,
    },
    {
      path: routeNames.ADD_BILLS,
      element: <AuthRoute component={<AppRoutes.CreateBill />} />,
    },
    {
      path: routeNames.EDIT_BILLS,
      element: <AuthRoute component={<AppRoutes.EditBill />} />,
    },
    {
      path: routeNames.CLONE_BILLS,
      element: <AuthRoute component={<AppRoutes.CloneBill />} />,
    },
    /*bills payments*/
    {
      path: routeNames.BILL_PAYMENTS,
      element: <AuthRoute component={<AppRoutes.BillPayments />} />,
    },
    // /** SalesOrder Routes */
    // {
    //   path: routeNames.SALES_ORDERS,
    //   element: <AuthRoute component={<AppRoutes.SalesOrder />}></AuthRoute>,
    // },
    // {
    //   path: routeNames.ADD_SALES_ORDER,
    //   element: <AuthRoute component={<AppRoutes.CreateSaleOrder />}></AuthRoute>,
    // },
    // {
    //   path: routeNames.EDIT_SALES_ORDER,
    //   element: <AuthRoute component={<AppRoutes.EditSaleOrder />}></AuthRoute>,
    // },
    // /** Packages Routes */
    // {
    //   path: routeNames.PACKAGES,
    //   element: <AuthRoute component={<AppRoutes.Packages />}></AuthRoute>,
    // },
    // {
    //   path: routeNames.ADD_PACKAGE,
    //   element: <AuthRoute component={<AppRoutes.CreatePackage />}></AuthRoute>,
    // },
    // {
    //   path: routeNames.EDIT_PACKAGE,
    //   element: <AuthRoute component={<AppRoutes.EditPackage />}></AuthRoute>,
    // },

    /** Recurring Bills Routes */
    {
      path: routeNames.EDIT_RECURRING_BILL,
      element: <AuthRoute component={<AppRoutes.EditRecurringBill />}></AuthRoute>,
    },
    {
      path: routeNames.ADD_RECURRING_BILL,
      element: <AuthRoute component={<AppRoutes.CreateRecurringBill />}></AuthRoute>,
    },
    {
      path: routeNames.RECURRING_BILLS,
      element: <AuthRoute component={<AppRoutes.RecurringBills />}></AuthRoute>,
    },
    {
      path: routeNames.IMS_ORGANIZATION,
      element: <AuthRoute component={<AppRoutes.ImsOrganizations />}></AuthRoute>,
    },
    /** Recurring Inovices Routes */
    {
      path: routeNames.RECURRING_INVOICES,
      element: <AuthRoute component={<AppRoutes.RecurringInvoices />} />,
    },
    {
      path: routeNames.ADD_RECURRING_INVOICES,
      element: <AuthRoute component={<AppRoutes.CreateRecurringInvoices />} />,
    },
    {
      path: routeNames.EDIT_RECURRING_INVOICES,
      element: <AuthRoute component={<AppRoutes.EditRecurringInvoices />} />,
    },
    {
      path: routeNames.ADD_CUSTOMER,
      element: <AuthRoute component={<AppRoutes.CreateCustomer />} />,
    },
    //** Roles Routes */
    {
      path: routeNames.ADD_ROLE,
      element: <AuthRoute component={<AppRoutes.CreateRole />} />,
    },
    {
      path: routeNames.EDIT_ROLE,
      element: <AuthRoute component={<AppRoutes.EditRole />} />,
    },
    {
      path: routeNames.USERS,
      element: <AuthRoute component={<AppRoutes.UserRoles />} />,
      // children: [
      //   {
      //     index: true,
      //     element: <AuthRoute component={<Users />} />,
      //   },
      //   {
      //     path: ROLES,
      //     element: <AuthRoute component={<Roles />} />,
      //   },
      // ],
    },
    {
      path: routeNames.PREFERENCES,
      element: <AuthRoute component={<AppRoutes.Preferences />} />,
    },
    {
      path: routeNames.TABLE_PREFERENCES,
      element: <AuthRoute component={<AppRoutes.TablePreferences />} />,
    },
    {
      path: routeNames.PDF_PREFERENCES,
      element: <AuthRoute component={<AppRoutes.PdfPreferences />} />,
    },
    {
      path: routeNames.Categories,
      element: <AuthRoute component={<AppRoutes.Categories />} />,
    },
    /** Journal Routes */

    {
      path: routeNames.JOURNAL,
      element: <AuthRoute component={<AppRoutes.Journals />} />,
    },
    {
      path: routeNames.SALES_BY_CUSTOMER,
      element: <AuthRoute component={<AppRoutes.SALESBYCUSTOMER />} />,
    },
    {
      path: routeNames.PAYMENT_MADE,
      element: <AuthRoute component={<AppRoutes.PAYMENTMADE />} />,
    },
    {
      path: routeNames.BILL_PAYMENT_BY_VENDOR,
      element: <AuthRoute component={<AppRoutes.BILL_PAYMENT_BY_VENDOR_REPORT />} />,
    },
    {
      path: routeNames.INVOICE_REPORT,
      element: <AuthRoute component={<AppRoutes.INVOICEREPORT />} />,
    },
    {
      path: routeNames.INVOICE_REPORT_BY_CUSTOMER,
      element: <AuthRoute component={<AppRoutes.INVOICEBYCUSTOMERREPORT />} />,
    },
    {
      path: routeNames.ESTIMATES_BY_CUSTOMER_REPORT,
      element: <AuthRoute component={<AppRoutes.ESTIMATEBYCUSTOMERREPORT />} />,
    },
    {
      path: routeNames.CREDIT_NOTES_BY_CUSTOMER_REPORT,
      element: <AuthRoute component={<AppRoutes.CREDITNOTESBYCUSTOMERREPORT />} />,
    },
    {
      path: routeNames.REFUND_BY_CUSTOMER_REPORT,
      element: <AuthRoute component={<AppRoutes.REFUNDBYCUSTOMERREPORT />} />,
    },
    {
      path: routeNames.SALES_BY_SALESPERSON,
      element: <AuthRoute component={<AppRoutes.SALESBYSALESPERSON />} />,
    },
    {
      path: routeNames.ESTIMATES_REPORT,
      element: <AuthRoute component={<AppRoutes.ESTIMATEREPORT />} />,
    },
    {
      path: routeNames.CUSTOMER_BALANCE,
      element: <AuthRoute component={<AppRoutes.CUSTOMERBALANCE />} />,
    },
    {
      path: routeNames.SALES_BY_ITEMS,
      element: <AuthRoute component={<AppRoutes.SALESBYITEMS />} />,
    },
    {
      path: routeNames.BILL_REPORTS,
      element: <AuthRoute component={<AppRoutes.BILLREPORT />} />,
    },
    {
      path: routeNames.BILL_BY_VENDOR,
      element: <AuthRoute component={<AppRoutes.BILL_BY_VENDOR_REPORT />} />,
    },
    {
      path: routeNames.PAYMENT_REPORT,
      element: <AuthRoute component={<AppRoutes.PAYMENTREPORT />} />,
    },
    {
      path: routeNames.PAYMENT_BY_CUSTOMER_REPORT,
      element: <AuthRoute component={<AppRoutes.PAYMENTBYCUSTOMERREPORT />} />,
    },
    {
      path: routeNames.LEDGER_REPORTS,
      element: <AuthRoute component={<AppRoutes.LEDGERREPORT />} />,
    },
    {
      path: routeNames.RECEIVABLE_SUMMARY,
      element: <AuthRoute component={<AppRoutes.RECEIVABLESUMMARREPORT />} />,
    },
    {
      path: routeNames.RECEIVABLE_DETAIL,
      element: <AuthRoute component={<AppRoutes.RECEIVABLEDETAILREPORT />} />,
    },
    {
      path: routeNames.CREDIT_NOTES_REPORTS,
      element: <AuthRoute component={<AppRoutes.CREDITNOTESREPORT />} />,
    },
    {
      path: routeNames.TAX_SUMMARY,
      element: <AuthRoute component={<AppRoutes.TaxSummary />} />,
    },
    {
      path: routeNames.TAX_SUMMARY_DETAIL,
      element: <AuthRoute component={<AppRoutes.TaxSummaryDetails />} />,
    },
    {
      path: routeNames.TAX_SUMMARY_TIMEDURATION,
      element: <AuthRoute component={<AppRoutes.TaxSummaryTimeDuration />} />,
    },
    {
      path: routeNames.TAX_SUMMARY_DETAIL_TAX_SUMMARY_TIMEDURATION,
      element: <AuthRoute component={<AppRoutes.TaxSummaryDetailsTimeDuration />} />,
    },
    {
      path: routeNames.TAX_SUMMARY_DETAILS_CUSTOMER,
      element: <AuthRoute component={<AppRoutes.TaxSummaryDetailsCustomer />} />,
    },
    {
      path: routeNames.TAX_SUMMARY_DETAILS_SUPPLIER,
      element: <AuthRoute component={<AppRoutes.TaxSummaryDetailsSupplier />} />,
    },
    /** Ledger Routes */

    {
      path: routeNames.LEDGER,
      element: <AuthRoute component={<AppRoutes.Ledger />} />,
    },
    /** Trial balance Routes */

    {
      path: routeNames.TRIAL_BALANCE,
      element: <AuthRoute component={<AppRoutes.TRIALBALANCE />} />,
    },
    /** Reports Routes */

    {
      path: routeNames.REPORTS,
      element: <AuthRoute component={<AppRoutes.REPORTS />} />,
    },
    {
      path: routeNames.REPORT_REFUND,
      element: <AuthRoute component={<AppRoutes.RefundReport />} />,
    },
    {
      path: routeNames.AR_AGING_SUMMARY,
      element: <AuthRoute component={<AppRoutes.ArAgingSummary />} />,
    },
    {
      path: routeNames.AR_AGING_DETAILS,
      element: <AuthRoute component={<AppRoutes.ArAgingDetails />} />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
    // {
    //   path: routeNames.CUSTOM_TABLE,
    //   element: <AuthRoute component={<AppRoutes.CustomTable />} />,
    // },
  ]);

  return routes;
};
