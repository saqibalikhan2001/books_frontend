/** @format */

export const routeNames = {
  /** public route names */
  SINGUP: "/register",
  LOGIN: "/login",
  CHECK_LOGIN: "/authentication",
  FORGET_PASSWORD: "/forget-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY: "/account/confirm",
  INVITE_CONFIRM: "/invite/accept/:token",
  DASHBOARD: "/dashboard",
  SSO: "/books_sso",

  /** settings route names */
  REGISTER_ORGANIZATION: "/register-organization",
  ORGANIZATION_PROFILE: "/organization-profile",
  ORGANIZATION_CREATE: "/organization-create",
  ORGANIZATION_LISTING: "/organizations",
  ORGANIZATION_DETAIL: "/organization-detail",

  WAREHOUSE: "/warehouses",
  SETTING: "/settings",
  CURRENCY: "/currencies",
  TAX: "/taxes",
  USERS: "/users",
  ROLES: "/roles",
  ACCOUNTS: "/accounts",
  ADDACCOUNTS: "/add-accounts",
  Categories: "/categories",
  EMAIL: "/email",
  ESTIMATEEMAIL: "/estimate/email",
  INVOICEEMAIL: "/invoice/email",

  /** Items route names */
  ITEMS: "/items",
  ADD_ITEM: "/items-new",
  EDIT_ITEM: "/item-edit",
  ITEM_CLONE: "/items/clone",
  ITEM_DETAILS: "/items/:id",

  /* Customers route names */
  CUSTOMERS: "/customer",
  ADD_CUSTOMER: "/new-customer",
  EDIT_CUSTOMER: "/customer-edit",
  CUSTOMER_CLONE: "/customer/clone",
  CUSTOMER_DETAILS: "/customer/:id",

  /* Suppliers route names */
  SUPPLIERS: "/supplier",
  ADD_SUPPLIER: "/new-supplier",
  EDIT_SUPPLIER: "/supplier-edit",
  SUPPLIER_CLONE: "/supplier/clone",
  SUPPLIER_DETAILS: "/supplier/:id",

  /**Estimates route names */
  ESTIMATES: "/estimate",
  ADD_ESTIMATE: "/estimates-new",
  EDIT_ESTIMATE: "/estimate-edit",
  ESTIMATES_DETAILS: "/estimate/:id",
  ESTIMATES_ClONE: "/estimate/clone",

  /**Invoice route names */
  INVOICES: "/invoice",
  ADD_INVOICE: "/invoice-new",
  EDIT_INVOICE: "/invoice-edit",
  INVOICE_ClONE: "/invoice/clone",
  INVOICE_DETAILS: "/invoice/:id",
  RECURRING_INVOICES: "/recurring-invoices",
  ADD_RECURRING_INVOICES: "/recurring-invoice-new",
  EDIT_RECURRING_INVOICES: "/recurring-invoice-edit",

  /**Credit Notes route names */
  CREDIT_NOTES: "/creditnotes",
  ADD_CREDIT_NOTE: "/new-credit-note",
  EDIT_CREDIT_NOTE: "/creditnotes-edit",
  CREDIT_NOTES_DETAILS: "/creditnotes/:id",

  /** PaymentMethods route names*/
  PAYMENT_METHODS: "/paymentmethods",

  /** Payments Received route names*/
  PAYMENTS_RECEIVED: "/paymentsreceived",
  ADD_PAYMENTS_RECEIVED: "/new-paymentreceived",
  EDIT_PAYMENTS_RECEIVED: "/payment-received-edit",
  PAYMENTS_RECEIVED_DETAILS: "/paymentsreceived/:id",

  /** Puchase Orders route names*/
  PURCHASE_ORDERS: "/purchaseorders",
  ADD_PURCHASE_ORDER: "/new-purchaseorder",
  EDIT_PURCHASE_ORDER: "/edit-purchaseorder",

  PREFERENCES: "/preferences",
  TABLE_PREFERENCES: "/table-preferences",
  PDF_PREFERENCES: "/pdf-preferences",

  /**Bills route names */
  BILLS: "/bills",
  ADD_BILLS: "/new-bill",
  EDIT_BILLS: "/bill-edit",
  CLONE_BILLS: "/clone-bill",
  BILLSDetail: "/bills/:id",

  /**SaleOrders route names */
  SALES_ORDERS: "/salesorders",
  ADD_SALES_ORDER: "/salesorder-new",
  EDIT_SALES_ORDER: "/salesorder-edit",

  /**Packages route names */
  PACKAGES: "/packages",
  ADD_PACKAGE: "/package-new",
  EDIT_PACKAGE: "/package-edit",

  IMS_ORGANIZATION: "/ims-organizations",

  /**Recurring Bill route names */
  RECURRING_BILLS: "/recurring-bills",
  ADD_RECURRING_BILL: "/recurring-bill-new",
  EDIT_RECURRING_BILL: "/recurring-bill-edit",

  /**Recurring Bill route names */
  ADD_ROLE: "/role-new",
  EDIT_ROLE: "/role-edit",

  /**Expense route names */
  EXPENSE: "/expense",
  ADD_EXPENSE: "/new-expense",
  EDIT_EXPENSE: "/edit-expense",

  /** custom table route dummy */
  CUSTOM_TABLE: "/custom-table",
  BILL_PAYMENTS: "/bill-payments",
  JOURNAL: "/journal",
  LEDGER: "/ledger",
  TRIAL_BALANCE: "/trial-balance",

  /** Reports Routes */

  REPORTS: "/reports",
  BILL_REPORTS: "/reports/bill",
  LEDGER_REPORTS: "/reports/ledger",
  REPORT_REFUND: "/reports/refund",
  PAYMENT_MADE: "/reports/payments-made",
  SALES_BY_ITEMS: "/reports/salebyitems",
  INVOICE_REPORT: "/reports/invoice-report",
  INVOICE_REPORT_BY_CUSTOMER: "/reports/invoice-by-customer-report",
  ESTIMATES_BY_CUSTOMER_REPORT: "/reports/estimate-by-customer-report",
  PAYMENT_BY_CUSTOMER_REPORT: "/reports/payment-by-customer-report",
  PAYMENT_REPORT: "/reports/payment-report",
  ESTIMATES_REPORT: "/reports/estimate-report",
  SALES_BY_CUSTOMER: "/reports/salebycustomers",
  CUSTOMER_BALANCE: "/reports/customerbalance",
  RECEIVABLE_SUMMARY: "/reports/receivablesummary",
  RECEIVABLE_DETAIL: "/reports/receivabledetails",
  SALES_BY_SALESPERSON: "/reports/salesbysales-person",
  CREDIT_NOTES_REPORTS: "/reports/creditnotes-report",
  CREDIT_NOTES_BY_CUSTOMER_REPORT: "/reports/creditnotes-by-customer-report",
  REFUND_BY_CUSTOMER_REPORT: "/reports/refund-by-customer-report",
  AR_AGING_SUMMARY: "/reports/ar-aging-report",
  AR_AGING_DETAILS: "/reports/ar-aging-detail",
  TAX_SUMMARY: "/reports/taxsummary",
  TAX_SUMMARY_DETAIL: "/reports/taxsummarydetails",
  TAX_SUMMARY_TIMEDURATION: "/reports/taxsummary-timeduration",
  TAX_SUMMARY_DETAIL_TAX_SUMMARY_TIMEDURATION: "/reports/taxsummarydetails-timeduration",
  TAX_SUMMARY_DETAILS_CUSTOMER: "/reports/taxsummarydetails-customer",
  TAX_SUMMARY_DETAILS_SUPPLIER: "/reports/taxsummarydetails-supplier",
  BILL_BY_VENDOR: "/reports/bill-by-vendor",
  BILL_PAYMENT_BY_VENDOR: "/reports/bill-payment-by-vendor",
};
