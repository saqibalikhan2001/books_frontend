import { CheckboxValueType } from "antd/es/checkbox/Group";
import { generateRoleOptions } from "utils";

export const systemModules = [
  {
    title: "Settings",
    permissions: [
      // "Preference",
      // "Currency",
      // "Warehouse",
      // "Tax",
      // "Account",
      // "PaymentMethod",
      // "PaymentMode",
      "Tax",
      "Role",
      "User",
      // "Invite",
    ],
  },
  {
    title: "Inventory",
    permissions: ["Item", "Category", "ItemAdjustment"],
  },
  {
    title: "Contact",
    permissions: ["Customer", "Supplier"],
  },
  {
    title: "Sales",
    permissions: [
      "Invoice",
      "Estimates",
      "CreditNote",
      "PaymentReceipts",
      // "Package",
      // "SalesOrder",
      // "RecurringInvoices",
      "InvoicePaymentRecord",
    ],
  },
  {
    title: "Purchases",
    permissions: [
      "Bill",
      // "PurchaseOrder",
      "BillPaymentRecord",
      // "RecurringBills",
      // "Receive",
    ],
  },
  {
    title: "Accounts",
    permissions: ["Accounts", "Journal", "Ledger", "TrialBalance"],
  },
  {
    title: "Dashboard",
    permissions: [
      "DashboardEstimateInformation",
      "DashboardPurchaseInformation",
      "DashboardReceivables",
      "DashboardPayable",
      "DashboardTopSellingItems",
      "DashboardTopCustomers",
      "DashboardOrderDetails",
      "DashboardSalesVsPurchase",
      "DashboardEstimateSummary",
    ],
  },
  {
    title: "Preferences",
    permissions: [
      // "TagPreference",
      "BillPreference",
      "PrintPreference",
      "PrefixPreference",
      "InvoicePreference",
      "GeneralPreference",
      "ModulePreference",
      "EstimatePreference",
      "InventoryPreference",
      "DiscountPreference",
      "DashboardPreference",
      // "SaleOrderPreference",
      "CreditNotePreference",
      // "PurchaseOrderPreference",
      "AccountsPreference",
      "GeneralCategoryPreference",
    ],
  },
  {
    title: "TablePreferences",
    permissions: [
      "ItemTablePreference",
      "CustomerTablePreference",
      "SupplierTablePreference",
      "ESTTablePreference",
      "INVTablePreference",
      "CNTablePreference",
      "PRTablePreference",
      "BillTablePreference",
      "BillPaymentTablePreference",
      "AccountsTablePreference",
    ],
  },
  {
    title: "Reports",
    permissions: [
      "GeneralLedgerReport",
      "SalesByProductReport",
      "SalesByCustomerReport",
      "SalesBySalesPersonReport",
      "InvoiceReport",
      "EstimateReport",
      "CustomerBalanceReport",
      "ReceivableSummaryReport",
      "ReceivableDetailReport",
      "ArAgingReport",
      "ArAgingDetailsReport",
      // "PurchaseReport",
      "BillReport",
      "BillPaymentReport",
      "RefundReport",
      "PaymentReceiptsReport",
      "CreditNotesReport",
      "TaxSummaryReport",
      "TaxByProductsReport",
      "TaxSummaryTimeDurationReport",
      "TaxByProductsTimeDurationReport",
      "TaxByCustomerReport",
      "TaxBySupplierReport",
      // "GeneralLedgerReport",
      // "Purchases",
      // "Sales",
    ],
  },
];

const list: string[] = [];
systemModules.forEach((v: any) => {
  list.push(...v.permissions.map((perm: string) => perm));
});

export const systemPermissions = generateRoleOptions(list);
export const allPermissions = systemPermissions.map((val: any) => ({
  id: val,
  [val]: false,
}));

export const setPermissionsList = (permission: CheckboxValueType[]) => {
  allPermissions.forEach((val: any) =>
    permission.forEach((perm: any) => {
      if (val.id === perm) {
        // @ts-ignore
        val[perm] = true;
        return;
      }
    })
  );
};

export const resetPermissions = () => {
  allPermissions.forEach((val: any) => {
    // @ts-ignore
    val[val.id] = false;
  });
};

export const roleLabels = {
  ItemTablePreference: "Product Table Preference",
  CustomerTablePreference: "Customer Table Preference",
  SupplierTablePreference: "Supplier Table Preference",
  ESTTablePreference: "EST Table Preference",
  INVTablePreference: "INV Table Preference",
  CNTablePreference: "CN Table Preference",
  PRTablePreference: "PR Table Preference",
  BillTablePreference: "Bill Table Preference",
  BillPaymentTablePreference: "Bill Payment Table Preference",
  AccountsTablePreference: "Chart Of Accounts Table Preference",
  BillPreference: "Bill Preference",
  PrintPreference: "Print Preference",
  PrefixPreference: "Prefix Preference",
  InvoicePreference: "Invoice Preference",
  GeneralPreference: "General Preference",
  ModulePreference: "Module Preference",
  EstimatePreference: "Estimate Preference",
  InventoryPreference: "Inventory Preference",
  DiscountPreference: "Discount Preference",
  DashboardPreference: "Dashboard Preference",
  // "SaleOrderPreference": "Sale Order Preference",
  CreditNotePreference: "Credit Note Preference",
  // "PurchaseOrderPreference": "Purchase Order Preference",
  GeneralCategoryPreference: "General Category Preference",
  AccountsPreference: "Accounting Preference",
  DashboardEstimateInformation: "Estimates Information",
  // Package&Shipment:"Package & Shipment",
  DashboardPurchaseInformation: "Purchase Information",
  DashboardReceivables: "Receivables",
  DashboardPayable: "Payable",
  DashboardTopSellingItems: "Top Selling Products",
  DashboardTopCustomers: "Top Customers",
  DashboardOrderDetails: "Order Details",
  DashboardSalesVsPurchase: "Sales vs Purchase",
  DashboardEstimateSummary: "Sales Order Summary",
  Bill: "Bill",
  // "PurchaseOrder": "Purchase Order",
  BillPaymentRecord: "Bill Payments",
  // "RecurringBills": "Recurring Bills",
  // "Receive": "Receive",
  Invoice: "Invoice",
  Estimates: "Estimates",
  CreditNote: "Credit Note",
  // "Package": "Package",
  // "SalesOrder": "Sales Order",
  // "RecurringInvoices": "Recurring Invoices",
  InvoicePaymentRecord: "Invoice Payment Record",
  Customer: "Customer",
  Supplier: "Supplier",
  Item: "Product",
  Category: "Services",
  ItemAdjustment: "Product Adjustment",
  Role: "Role",
  Tax: "Tax",
  User: "User",
  Invite: "Invite",
  PaymentReceipts: "Payment receipts",
  Accounts: "Chart Of Accounts",
  Journal: "Journal",
  Ledger: "Ledger",
  TrialBalance: "Trial Balance",
  //repoTS
  TaxesSummary: "Taxes Summary",
  GeneralLedgerReport: "General Ledger",
  SalesByProductReport: "Sales By Product",
  SalesByCustomerReport: "Sales By Customer",
  SalesBySalesPersonReport: "Sales By Sales Person",
  InvoiceReport: "Invoice",
  EstimateReport: "Estimate",
  CustomerBalanceReport: "Customer Balance",
  ReceivableSummaryReport: "Receivable Summary",
  ReceivableDetailReport: "Receivable Detail",
  ArAgingReport: "Ar Aging Summary",
  ArAgingDetailsReport: "Ar Aging Details",
  PurchaseReport: "Purchase",
  BillReport: "Bill",
  BillPaymentReport: "Bill Payment",
  RefundReport: "Refund",
  PaymentReceiptsReport: "Payment Receipts",
  CreditNotesReport: "Credit Notes",
  TaxSummaryReport: "Tax Summary",
  TaxByProductsReport: "Tax By Products",
  TaxSummaryTimeDurationReport: "Tax Summary (Time Duration)",
  TaxByProductsTimeDurationReport: "Tax By Products (Time Duration)",
  TaxByCustomerReport: "Tax By Customer",
  TaxBySupplierReport: "Tax By Supplier",
};
