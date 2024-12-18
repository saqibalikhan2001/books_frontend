export const generateRoleOptions = (list: string[]) => {
  const updatedList = list.map((title) =>
    ["View", "Create", "Edit", "Delete"].map((opt) => `${title}${opt}`)
  );
  return updatedList.flatMap((flat) => flat);
};

const accountsPermissionTypes = ["Accounts", "Journal", "Ledger", "TrialBalance"];
const actions = ["View", "Create", "Edit", "Delete"];
const contactPermissionTypes = ["Customer", "Supplier"];
const settingsPermissionTypes = ["Role", "User", "Tax", "Invite"];
const purchasesPermissionTypes = ["Bill", "BillPaymentRecord"];
const inventoryPermissionTypes = ["Item", "Category", "ItemAdjustment"];
const salesPermissionTypes = [
  "Estimates",
  "Invoice",
  "InvoicePaymentRecord",
  "CreditNote",
  "PaymentReceipts",
];

const dashboardPermissionTypes = [
  "DashboardEstimateInformation",
  "DashboardPurchaseInformation",
  "DashboardReceivables",
  "DashboardPayable",
  "DashboardTopSellingItems",
  "DashboardTopCustomers",
  "DashboardOrderDetails",
  "DashboardSalesVsPurchase",
  "DashboardEstimateSummary",
];

const preferencesPermissionTypes = [
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
  "CreditNotePreference",
  "AccountsPreference",
  "GeneralCategoryPreference",
];

const tablePreferencesPermissionTypes = [
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
];
const reportspermissionsTypes = [
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
];

export const filterRolePermissions = (itemPermissions: object) => {
  let sales = [];
  let contact = [];
  let accounts = [];
  let settings = [];
  let inventory = [];
  let dashboard = [];
  let purchases = [];
  let preferences = [];
  let tablepreferences = [];
  let reports = [];
  for (let [key, value] of Object.entries(itemPermissions)) {
    if (key === "settings") {
      settings = value.filter((item: any) => {
        return settingsPermissionTypes.some((type) => {
          return actions.some((action) => item.includes(`${type}${action}`));
        });
      });
    }
    if (key === "reports") {
      reports = value.filter((item: any) => {
        return reportspermissionsTypes.some((type) => {
          return actions.some((action) => item.includes(`${type}${action}`));
        });
      });
    }
    if (key === "inventory") {
      inventory = value.filter((item: any) => {
        return inventoryPermissionTypes.some((type) => {
          return actions.some((action) => item.includes(`${type}${action}`));
        });
      });
    }
    if (key === "contact") {
      contact = value.filter((item: any) => {
        return contactPermissionTypes.some((type) => {
          return actions.some((action) => item.includes(`${type}${action}`));
        });
      });
    }
    if (key === "sales") {
      sales = value.filter((item: any) => {
        return salesPermissionTypes.some((type) => {
          return actions.some((action) => item.includes(`${type}${action}`));
        });
      });
    }
    if (key === "purchases") {
      purchases = value.filter((item: any) => {
        return purchasesPermissionTypes.some((type) => {
          return actions.some((action) => item.includes(`${type}${action}`));
        });
      });
    }
    if (key === "accounts") {
      accounts = value.filter((item: any) => {
        return accountsPermissionTypes.some((type) => {
          return actions.some((action) => item.includes(`${type}${action}`));
        });
      });
    }
    if (key === "preferences") {
      preferences = value.filter((item: any) => {
        return preferencesPermissionTypes.some((type) => {
          return actions.some((action) => item.includes(`${type}${action}`));
        });
      });
    }
    if (key === "tablepreferences") {
      tablepreferences = value.filter((item: any) => {
        return tablePreferencesPermissionTypes.some((type) => {
          return actions.some((action) => item.includes(`${type}${action}`));
        });
      });
    }
    if (key === "dashboard") {
      dashboard = value.filter((item: any) => {
        return dashboardPermissionTypes.some((type) => {
          return actions.some((action) => item.includes(`${type}${action}`));
        });
      });
    }
  }
  const newArray = [].concat.apply(
    [],
    [
      settings,
      inventory,
      sales,
      purchases,
      accounts,
      preferences,
      tablepreferences,
      reports,
      contact,
      dashboard,
    ]
  );
  return newArray;
};
