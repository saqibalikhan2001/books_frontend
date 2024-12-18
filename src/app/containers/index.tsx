/** @format */

import { lazy } from "react";

export const EditItem = lazy(() => import(/* webpackChunkName: 'Item_Edit' */ "./Items/Edit"));
export const CreateItem = lazy(
  () => import(/* webpackChunkName: 'Item_Create' */ "./Items/Create")
);
export const CloneItem = lazy(() => import(/* webpackChunkName: 'Item_Clone' */ "./Items/Clone"));
export const Items = lazy(() => import(/* webpackChunkName: 'Item_Listing' */ "./Items"));
export const ItemDetail = lazy(
  () => import(/* webpackChunkName: 'Item_Listing' */ "./Items/ItemDetail")
);
export const CustomerDetail = lazy(
  () => import(/* webpackChunkName: 'Item_Listing' */ "./Sales/Customers/CustomerDetail/index")
);
export const SupplierDetail = lazy(
  () => import(/* webpackChunkName: 'Item_Listing' */ "./Sales/Customers/CustomerDetail/index")
);
export const Currency = lazy(
  () => import(/* webpackChunkName: 'Currency' */ "./Settings/Currency")
);
export const Customers = lazy(
  () => import(/* webpackChunkName: 'Customer_Listing' */ "./Sales/Customers")
);
export const EditCustomer = lazy(
  () => import(/* webpackChunkName: 'Customer_Edit' */ "./Sales/Customers/Edit")
);
export const CreateCustomer = lazy(
  () => import(/* webpackChunkName: 'Customer_Create' */ "./Sales/Customers/Create")
);
export const CloneCustomer = lazy(
  () => import(/* webpackChunkName: 'Customer_clone' */ "./Sales/Customers/Clone")
);
export const Suppliers = lazy(
  () => import(/* webpackChunkName: 'Customer_Listing' */ "./Sales/Suppliers")
);
export const EditSupplier = lazy(
  () => import(/* webpackChunkName: 'Customer_Edit' */ "./Sales/Suppliers/Edit")
);
export const CreateSupplier = lazy(
  () => import(/* webpackChunkName: 'Customer_Create' */ "./Sales/Suppliers/Create")
);
export const CloneSupplier = lazy(
  () => import(/* webpackChunkName: 'Supplier_Clone' */ "./Sales/Suppliers/Clone")
);

import Dashboard from /* webpackChunkName: 'Dashboard' */ "./Dashboard";
// export const Dashboard = lazy(() => import(/* webpackChunkName: 'Dashboard' */ "./Dashboard"));

export const Warehouse = lazy(
  () => import(/* webpackChunkName: 'Warehouse' */ "./Settings/Warehouse")
);

export const Invoices = lazy(
  () => import(/* webpackChunkName: 'Invoice_Listing' */ "./Sales/Invoices")
);
export const InvoiceDetails = lazy(
  () => import(/* webpackChunkName: 'Invoice_Listing' */ "./Sales/Invoices/InvoiceDetail")
);
export const EditInvoices = lazy(
  () => import(/* webpackChunkName: 'Invoice_Edit' */ "./Sales/Invoices/Edit")
);
export const CreateInvoice = lazy(
  () => import(/* webpackChunkName: 'Invoice_Create' */ "./Sales/Invoices/Create")
);

export const UserRoles = lazy(
  () => import(/* webpackChunkName: 'UserRoles' */ "./Settings/UserRoles/Tab")
);

export const Register = lazy(() => import(/* webpackChunkName: 'Organization' */ "./Organization"));
export const Organizations = lazy(
  () => import(/* webpackChunkName: 'Organization_Listing' */ "./Organization/Listing")
);
export const EditOrganization = lazy(
  () => import(/* webpackChunkName: 'Organization_Edit' */ "./Organization/Edit")
);
export const CreateOrganization = lazy(
  () => import(/* webpackChunkName: 'Organization_Create' */ "./Organization/Create")
);
export const OrganizationViewDetail = lazy(
  () =>
    import(
      /* webpackChunkName: 'Organization_View_Detail' */ "./Organization/ListingView/DetailPage"
    )
);

export const Estimates = lazy(
  () => import(/* webpackChunkName: 'Estimate_Listing' */ "./Sales/Estimates")
);
export const EditEstimates = lazy(
  () => import(/* webpackChunkName: 'Estimate_Edit' */ "./Sales/Estimates/Edit")
);
export const CreateEsitmate = lazy(
  () => import(/* webpackChunkName: 'Estimate_Create' */ "./Sales/Estimates/Create")
);
export const EsitmateDetails = lazy(
  () => import(/* webpackChunkName: 'Estimate_Create' */ "./Sales/Estimates/EstimateDetails/index")
);
export const CloneEstimate = lazy(
  () => import(/* webpackChunkName: 'Estimate_Clone' */ "./Sales/Estimates/Clone")
);

export const Tax = lazy(() => import(/* webpackChunkName: 'Tax' */ "./Settings/Tax"));

export const CreditNotes = lazy(
  () => import(/* webpackChunkName: 'Credit_Listing' */ "./Sales/CreditNotes")
);
export const CreateCreditNote = lazy(
  () => import(/* webpackChunkName: 'Credit_Create' */ "./Sales/CreditNotes/Create")
);
export const EditCreditNotes = lazy(
  () => import(/* webpackChunkName: 'Credit_Create' */ "./Sales/CreditNotes/Edit")
);
export const CreditNoteDetails = lazy(
  () => import(/* webpackChunkName: 'Credit_Create' */ "./Sales/CreditNotes/CreditNoteDetails")
);
export const Accounts = lazy(() => import(/* webpackChunkName: 'Accounts' */ "./chartOfAccounts"));
export const AddAccounts = lazy(
  () => import(/* webpackChunkName: 'Accounts' */ "./chartOfAccounts/MappingOldAccounts")
);

export const Email = lazy(() => import(/* webpackChunkName: 'Email' */ "../shared/Email"));

export const PaymentMethods = lazy(
  () => import(/* webpackChunkName: 'Payment_Methods' */ "./Settings/PaymentMethods")
);

export const PaymentsReceived = lazy(
  () => import(/* webpackChunkName: 'PaymentReceived_Listing' */ "./Sales/PaymentsReceived")
);
export const EditPaymentReceived = lazy(
  () => import(/* webpackChunkName: 'PaymentReceived_Edit' */ "./Sales/PaymentsReceived/Edit")
);
export const CreatePaymentReceived = lazy(
  () => import(/* webpackChunkName: 'PaymentReceived_Create' */ "./Sales/PaymentsReceived/Create")
);
export const PaymentReceivedDetails = lazy(
  () =>
    import(
      /* webpackChunkName: 'PaymentReceived_Create' */ "./Sales/PaymentsReceived/PaymentReceivedDetails"
    )
);

export const PurchaseOrders = lazy(
  () => import(/* webpackChunkName: 'PurchaseOrders_Listing' */ "./Purchases/PuchaseOrders")
);
export const CreatePurchaseOrder = lazy(
  () => import(/* webpackChunkName: 'PurchaseOrders_Create' */ "./Purchases/PuchaseOrders/Create")
);
export const EditPurchaseOrder = lazy(
  () => import(/* webpackChunkName: 'EditPurchaseOrder_Edit' */ "./Purchases/PuchaseOrders/Edit")
);

export const Preferences = lazy(
  () => import(/* webpackChunkName: 'PaymentReceived_Create' */ "./Settings/Preferences")
);

export const TablePreferences = lazy(
  () => import(/* webpackChunkName: 'PaymentReceived_Create' */ "./Settings/TablePreference")
);
export const PdfPreferences = lazy(
  () => import(/* webpackChunkName: 'PaymentReceived_Create' */ "./Settings/PdfPreference")
);

export const Bills = lazy(
  () => import(/* webpackChunkName: 'Bills_Listing' */ "./Purchases/Bills")
);
export const BillsDetail = lazy(
  () => import(/* webpackChunkName: 'Bills_Listing' */ "./Purchases/Bills/BillDetails")
);
export const CreateBill = lazy(
  () => import(/* webpackChunkName: 'Bills_Create' */ "./Purchases/Bills/Create")
);
export const EditBill = lazy(
  () => import(/* webpackChunkName: 'Bills_Edit' */ "./Purchases/Bills/Edit")
);
export const CloneBill = lazy(
  () => import(/* webpackChunkName: 'Bills_Edit' */ "./Purchases/Bills/Clone")
);
export const SalesOrder = lazy(
  () => import(/* webpackChunkName: 'SaleOrders_Listing' */ "./Sales/SaleOrders")
);
export const CreateSaleOrder = lazy(
  () => import(/* webpackChunkName: 'SaleOrders_Create' */ "./Sales/SaleOrders/Create")
);
export const EditSaleOrder = lazy(
  () => import(/* webpackChunkName: 'SaleOrders_Edit' */ "./Sales/SaleOrders/Edit")
);
export const Packages = lazy(() => import(/* webpackChunkName: 'Packages_Listing' */ "./Packages"));
export const CreatePackage = lazy(
  () => import(/* webpackChunkName: 'Package_Create' */ "./Packages/Create")
);
export const EditPackage = lazy(
  () => import(/* webpackChunkName: 'Package_Edit' */ "./Packages/Edit")
);

export const ImsOrganizations = lazy(
  () => import(/* webpackChunkName: 'Ims_Organizations' */ "./Organization/ImsOrganizaiton")
);

export const RecurringBills = lazy(
  () => import(/* webpackChunkName: 'RecurringBills_Listing' */ "./Purchases/RecurringBills")
);
export const EditRecurringBill = lazy(
  () => import(/* webpackChunkName: 'RecurringBill_Edit' */ "./Purchases/RecurringBills/Edit")
);
export const CreateRecurringBill = lazy(
  () => import(/* webpackChunkName: 'RecurringBill_Create' */ "./Purchases/RecurringBills/Create")
);

export const RecurringInvoices = lazy(
  () => import(/* webpackChunkName: 'RecurringBills_Listing' */ "./Sales/RecurringInvoice")
);
export const EditRecurringInvoices = lazy(
  () => import(/* webpackChunkName: 'RecurringBill_Edit' */ "./Sales/RecurringInvoice/Edit")
);
export const CreateRecurringInvoices = lazy(
  () => import(/* webpackChunkName: 'RecurringBill_Create' */ "./Sales/RecurringInvoice/Create")
);
export const CreateRole = lazy(
  () => import(/* webpackChunkName: 'Role_Create' */ "./Settings/UserRoles/Role/Create")
);
export const EditRole = lazy(
  () => import(/* webpackChunkName: 'Role_Edit' */ "./Settings/UserRoles/Role/Edit")
);

// export const CustomTable = lazy(
//   () => import(/* webpackChunkName: 'Role_Edit' */ "../shared/CustomTable")
// );
export const Categories = lazy(
  () => import(/* webpackChunkName: 'Categories' */ "./Items/Categories")
);
export const CloneInvoice = lazy(
  () => import(/* webpackChunkName: 'INvoice_Clone' */ "./Sales/Invoices/Clone")
);

export const Expenses = lazy(() => import(/* webpackChunkName: 'Expense' */ "./Expenses"));
export const CreateExpense = lazy(
  () => import(/* webpackChunkName: 'Expense' */ "./Expenses/Create")
);
export const EditExpense = lazy(() => import(/* webpackChunkName: 'Expense' */ "./Expenses/Edit"));

export const BillPayments = lazy(
  () => import(/* webpackChunkName: 'Bills_Payments_Listing' */ "./Purchases/BillsPayments")
);

export const Journals = lazy(() => import(/* webpackChunkName: 'Journals' */ "./Journal"));
export const PAYMENTMADE = lazy(
  () => import(/* webpackChunkName: 'Paymentmade' */ "./Reports/Paymentmade")
);
export const BILL_PAYMENT_BY_VENDOR_REPORT = lazy(
  () =>
    import(
      /* webpackChunkName: 'BILL_PAYMENT_BY_VENDOR_REPORT' */ "./Reports/Paymentmade/BillPaymentByVendor"
    )
);

export const SALESBYCUSTOMER = lazy(
  () => import(/* webpackChunkName: 'SalesByCustomer' */ "./Reports/SalesByCustomer")
);
export const INVOICEREPORT = lazy(
  () => import(/* webpackChunkName: 'InvoiceReports' */ "./Reports/InvoiceReports")
);
export const INVOICEBYCUSTOMERREPORT = lazy(
  () =>
    import(
      /* webpackChunkName: 'InvoiceReports' */ "./Reports/InvoiceReports/InvoiceByCustomerReport"
    )
);
export const ESTIMATEBYCUSTOMERREPORT = lazy(
  () =>
    import(
      /* webpackChunkName: 'ESTIMATEBYCUSTOMERREPORT' */ "./Reports/Estimates/EstimateByCustomerReport"
    )
);
export const CREDITNOTESBYCUSTOMERREPORT = lazy(
  () =>
    import(
      /* webpackChunkName: 'CREDITNOTESBYCUSTOMERREPORT' */ "./Reports/CreditNoteReports/CreditNotesByCustomerReport"
    )
);
export const REFUNDBYCUSTOMERREPORT = lazy(
  () =>
    import(
      /* webpackChunkName: 'REFUNDBYCUSTOMERREPORT' */ "./Reports/RefundReports/RefundByCustomerReport"
    )
);
export const SALESBYSALESPERSON = lazy(
  () => import(/* webpackChunkName: 'SalesByPerson' */ "./Reports/SalesByPerson")
);
export const ESTIMATEREPORT = lazy(
  () => import(/* webpackChunkName: 'Estimates' */ "./Reports/Estimates")
);
export const CUSTOMERBALANCE = lazy(
  () => import(/* webpackChunkName: 'CustomerBalance' */ "./Reports/CustomerBalance")
);
export const SALESBYITEMS = lazy(
  () => import(/* webpackChunkName: 'SalesByItems' */ "./Reports/SalesByItems")
);
export const BILLREPORT = lazy(
  () => import(/* webpackChunkName: 'BillReport' */ "./Reports/BillReport")
);
export const BILL_BY_VENDOR_REPORT = lazy(
  () =>
    import(
      /* webpackChunkName: 'BILL_BY_VENDOR_REPORT' */ "./Reports/BillReport/BillByVendorReport"
    )
);
export const Ledger = lazy(() => import(/* webpackChunkName: 'Ledgers' */ "./Ledger"));
export const TRIALBALANCE = lazy(
  () => import(/* webpackChunkName: 'TRIALBALANCE' */ "./TiralBalance")
);
export const REPORTS = lazy(() => import(/* webpackChunkName: 'Reports' */ "./Reports"));
export const RefundReport = lazy(
  () => import(/* webpackChunkName: 'RefundReports' */ "./Reports/RefundReports")
);

export const PAYMENTREPORT = lazy(
  () => import(/* webpackChunkName: 'PaymentReceipt' */ "./Reports/PaymentReceipt")
);
export const PAYMENTBYCUSTOMERREPORT = lazy(
  () =>
    import(
      /* webpackChunkName: 'PaymentReceipt' */ "./Reports/PaymentReceipt/PaymentByCustomerReport"
    )
);
export const LEDGERREPORT = lazy(
  () => import(/* webpackChunkName: 'LedgerReport' */ "./Reports/LedgerReport")
);
export const RECEIVABLESUMMARREPORT = lazy(
  () => import(/* webpackChunkName: 'receiveable_summary_report' */ "./Reports/ReceivableSummary")
);
export const RECEIVABLEDETAILREPORT = lazy(
  () => import(/* webpackChunkName: 'ReceieveAble_detail_report' */ "./Reports/ReceivableDetails")
);
export const CREDITNOTESREPORT = lazy(
  () => import(/* webpackChunkName: 'CreditNote_report' */ "./Reports/CreditNoteReports")
);
export const ArAgingSummary = lazy(
  () => import(/* webpackChunkName: 'BillReport' */ "./Reports/ArAgingSummary")
);
export const ArAgingDetails = lazy(
  () => import(/* webpackChunkName: 'BillReport' */ "./Reports/ArAgingDetails")
);
export const TaxSummary = lazy(
  () => import(/* webpackChunkName: 'TaxSummary' */ "./Reports/TaxSummary")
);
export const TaxSummaryDetails = lazy(
  () => import(/* webpackChunkName: 'TaxSummary' */ "./Reports/TaxSummaryDetail")
);
export const TaxSummaryTimeDuration = lazy(
  () => import(/* webpackChunkName: 'TaxSummary' */ "./Reports/TaxSummaryTimeDuration")
);
export const TaxSummaryDetailsTimeDuration = lazy(
  () => import(/* webpackChunkName: 'TaxSummary' */ "./Reports/TaxSummaryDetailTimeDuration")
);
export const TaxSummaryDetailsCustomer = lazy(
  () => import(/* webpackChunkName: 'TaxSummary' */ "./Reports/TaxSummaryDetailsCustomer")
);
export const TaxSummaryDetailsSupplier = lazy(
  () => import(/* webpackChunkName: 'TaxSummary' */ "./Reports/TaxSummaryDetailsSupplier")
);
export { Dashboard };
