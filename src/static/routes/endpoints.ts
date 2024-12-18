export const endpoints = {
  /** ------------- Auth Routes Endpoints--------------- */
  SIGNUP: "/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REGISTER_NEW_USER: "/register/inviteduser",
  FORGET_PASSWORD: "/password/forget",
  RESET_PASSWORD: "/password/forget/reset",
  EMAIL_VERIFIED: "/register/confirm",
  ALL: "/all",
  SKU: "/sku",
  PDF_SETTINGS: "/pdfsettings",
  INVITE_CONFIRMATION: "/invites/accept",
  CURRENT_USER_ROLE: "currentuser/role",
  FILTER_PREFERENCE: "/filter-preferences",
  /** ------------- Auth Routes --------------- */
  /** ------------- category Routes --------------- */
  ADD_CATEGORY: "/category",
  /** ------------- Protected Routes Endpoints--------------- */
  CREATE_ORGANIZATION: "/register/organization",
  ORGANIZATIONS: "/organizations",
  SET_ORGANIZATION: "/organizations/set_default",

  WAREHOUSE: "/warehouses",
  CURRENCY: "/currencies",
  ATTACHMENT: "/attachment",
  TAXES: "/taxes",
  ACTIVITY: "/activity",
  TAX_GROUP: "/taxgroup",
  ACCOUNT_GROUP: "/accountGroups",
  ACCOUNT_NAME: "/accounts",
  PAYMENT_METHOD: "/paymentmethods",
  ROLE: "/roles",
  INVITE_USER: "/invites",
  GET_SKU: "/items/generatesku",
  TERMS: "/invoiceterms",
  ADDRESS: "/addresses",
  PERSONS: "/persons",
  TRANSACTIONS: "/transaction",
  ADVANCE: "/advance",
  ACTIVITY_LOG: "/activity-log",
  INVOICE_PAYMENT: "/invoice_payment",
  RECEIVES: "/receives",
  ADVANCE_REFUND: "/advancerefund",
  STORE: "/store",
  CREATE: "/create",
  USERS: "/users",
  STATUS: "/status",
  ISSUED: "/issued",
  CANCELLED: "/cancelled",
  SENT: "/sent",
  EDIT: "/edit",
  UPDATE: "/update",
  ALL_USERS: "/all-users",
  DELETE_BOOKS_INVITE_USER: "/organizations/users",

  /** ------------- Contact Routes --------------- */

  CUSTOMERS: "/customers",
  SUPPLIERS: "/suppliers",
  ADDRESSES: "/addresses",
  CUSTOMERS_STATEMENT: "/statement",

  /** ------------- Items Routes --------------- */

  ITEMS: "/items",
  ITEMS_CREATE: "/items/create",

  /** ------------- Invoices Routes --------------- */

  INVOICES: "/invoices",
  INVOICES_NOTE: "/note",

  INVOICE_TERMS: "/invoiceterms",
  INVOICE_ITEMS: "/invoices/items",
  INVOICE_CREATE: "/invoices/create",
  INVOICE_CONTACTS: "/invoices/contact",
  INVOICE_PAYMENT_RECEIVED: "/invoicepaymentrecords",

  /** ------------- Estimates Routes --------------- */

  ESTIMATE: "/estimate",
  ESTIMATES: "/estimates",
  ESTIMATE_ITEMS: "/estimates/items",
  ESTIMATE_CREATE: "/estimates/create",
  ESTIMATE_CONTACT: "/estimates/contact",
  ESTIMATE_NOTE: "/note",
  ESTIMATE_SENT: "/sent",
  ESTIMATE_TERMS: "/terms_conditions",
  ESTIMATE_ATTACHMENT: "/estimates/attachments",

  /** ------------- Payment Received Routes --------------- */

  ADVANCE_PAYMENT: "/advancepayment",
  PAYMENT_RECORDS: "/paymentrecords",
  PAYMENT_RECEIVED: "/invoicepaymentrecords",
  PAYMENT_RECEIVED_CREATE: "/advancepayment/invoice/create",
  PAYMENT_RECEIVED_CONTACT: "advancepayment/contact",
  CRETAE_PAYMENT_RECEIVED: "/advancepayment/invoice",

  /** ------------- Purchase Orders Routes --------------- */
  PURCHASE_ORDERS: "/purchaseorders",
  PURCHASE_ORDERS_ITEMS: "/purchaseorders/items",
  PURCHASE_ORDERS_CREATE: "/purchaseorders/create",
  PURCHASE_ORDERS_CONTACTS: "/purchaseorders/contact",

  /** ------------- Bill Routes --------------- */
  BILLS: "/bills",
  BILL_ITEMS: "/bills/items",
  BILL_CREATE: "/bills/create",
  BILL_CONTACT: "/bills/contact",

  /** -------------Recurring Bill Routes --------------- */

  RECURRING_BILL: "/recurring_bill",
  RECURRING_BILL_ITEMS: "/recurring_bill/items",
  RECURRING_BILL_CONTACTS: "/recurring_bill/contact",

  /** -------------Recurring Invoices Routes --------------- */

  RECURRING_INVOICE: "/recurring_invoice",
  RECURRING_INVOICE_ITEMS: "/recurring_invoice/items",
  RECURRING_INVOICE_CREATE: "/recurring_invoice/create",
  RECURRING_INVOICE_CONTACTS: "/recurring_invoice/contact",

  /** ------------- Admin Routes --------------- */

  /** ------------- PREFERENCE Routes --------------- */
  PREFERENCES: "/preferences",
  BILL_PREFERENCE: "/preferences/bill",
  STOCK_PREFERENCE: "/preferences/stock",
  GENERAL_CATEGORY: "/general_categories",
  CATEGORIES_IMPORT: "/import_categories",
  NUMBER_PREFERENCES: "/numberPreferences",
  INVOICE_PREFERENCE: "/preferences/invoice",
  GENERAL_PREFERENCE: "/preferences/general",
  ESTIMATE_PREFERENCE: "/preferences/estimate",
  DISCOUNT_PREFERENCE: "/preferences/discount",
  DASHBOARD_PREFERNCE: "/preferences/dashboard",
  SALES_ORDER_PREFERENCE: "/preferences/salesorder",
  CREDIT_NOTE_PRFERENCE: "/preferences/salereturnpolicy",
  PURCHASE_ORDER_PREFERENCE: "/preferences/purchaseorder",
  SALE_RETURN_PREFERNCE: "/preferences/allsalereturncriteria",
  NETWORK_PREFERENCE: "/preferences/internetconnectivity",

  /** ------------- Sales Orders Routes --------------- */

  SALES_ORDERS: "/salesorders",
  SALES_ORDERS_ITEMS: "/salesorders/items",
  SALES_ORDERS_CREATE: "/salesorders/create",
  SALES_ORDERS_CONTACT: "/salesorders/contact",
  SALESBYCUSTOMER: "/salebycustomers",

  /** ------------- Packages Routes --------------- */
  PACKAGES: "/packages",
  PACKAGE_CREATE: "/packages/create",

  /** ------------- Araging Routes --------------- */

  /** ------------- Araging Routes --------------- */

  REPORT_CONTACT: "/report/contact",

  /** ------------- Tax summary Routes --------------- */
  TAXSUMMARYITEMS: "/report/item",

  /** -------- Ims Organizations Routes ----------- */
  USER_PROFILE: "/auth/user",
  GENREAL_MODULES: "/general_modules",
  IMS_ORGANIZATION: "organizations/ims",
  UNSHARE_ORGANIZATION: "shared/organization",
  IMS_MODULE_INTEGRATIONS: "module_permissions",
  GENERAL_MODULE_PERMISSION: "/preferences/general_modules",
  /** ------------- Owner Routes --------------- */

  /**------------------categories Routes------------------- */
  PRODUCT_CATEGORY: "/category",

  /*------------------item adjustment-----------------*/

  ITEM_ADJUSTMENT: "/itemadjustments",
  /**--------------------Tags Routes------------------------ */
  TAGS: "/tags",
  /**------------------Expenses Routes------------------- */
  EXPENSES: "/expenses",
  CREATE_EXPENSES: "expenses/create",
  BULK_EXPENSES: "/bulkexpenses",

  //----------------- CreditNotes Routes---------------------
  CREDIT_NOTES: "/creditnotes",
  CREDIT_REFUND: "creditrefund",
  CREDIT_UTILIZE: "/creditutilize",
  CREDIT_NOTE_CONTACTS: "/creditnotes/contact",

  //------------------Bills Payments------------------------
  BILL_PAYMENTS: "/advancepayment/bill",
  BILL_PAYMENTS_RECORDS: "/billpaymentrecords",

  //---------------------Dashboard----------------------------
  TOP_ITEMS: "/dashboard/topSellingItems",
  TOP_CUSTOMERS: "/dashboard/topSellingCustomers",
  PURCHASE_INFO: "/dashboard/purchase_information",
  SALES_PURCHASE: "/dashboard/sales_purchase",
};
