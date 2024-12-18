// import { seebizCloudUrl } from '../Helpers/UrlHelper';
const seebizUrl = "seebiz.cloud";
const UserManual = [
  {
    label: "Registration",
    value: "1.",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-register-with-seebiz-inventory/`,
  },
  {
    label: "Managing Businesses",
    value: "2.",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-manage-multiple-businesses-and-warehouses/`,
  },
  {
    label: "Creating Contacts",
    value: "3.",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-a-new-contact/`,
  },
  {
    label: "Import/Export Contacts",
    value: "3.1",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-import-export-contacts/`,
  },
  {
    label: "Managing Contacts",
    value: "3.2",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-manage-contacts/`,
  },
  {
    label: "Vendor Contact Details",
    value: "3.3",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-view-contact-details-for-a-vendor/`,
  },
  {
    label: "Customer Contact Details",
    value: "3.4",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-view-contact-details-for-a-customer/`,
  },
  {
    label: "Creating Items",
    value: "4",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-an-item/`,
  },
  {
    label: "Import/Export Items",
    value: "4.1",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-import-export-items/`,
  },
  {
    label: "Managing Items",
    value: "4.2",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-manage-items/`,
  },
  {
    label: "Vendor Item Details",
    value: "4.3",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-view-items-details/`,
  },
  {
    label: "Creating Item Adjustments",
    value: "5",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-item-adjustments/`,
  },
  {
    label: "Managing Item Adjustments",
    value: "5.1",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-manage-item-adjustment/`,
  },
  {
    label: "Item Adjustment Details",
    value: "5.2",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-view-item-adjustments-details/`,
  },
  {
    label: "Creating Sales Orders",
    value: "6",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-sales-order/`,
  },
  {
    label: "Creating Packages",
    value: "6.1",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-a-package/`,
  },
  {
    label: "Creating Shipments",
    value: "6.2",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-a-shipment/`,
  },
  {
    label: "Managing Sales Orders",
    value: "7",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-manage-sales-order/`,
  },
  {
    label: "Managing Packages",
    value: "7.1",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-manage-packages-export-and-all/`,
  },
  {
    label: "Sales Order Details",
    value: "7.2",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-view-sales-order-details/`,
  },
  {
    label: "Package Details",
    value: "7.3",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-view-package-details/`,
  },
  {
    label: "Create Backorder",
    value: "8",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-a-backorder-for-a-sales-order/`,
  },
  {
    label: "Dropshipping",
    value: "9",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-dropship-a-sales-order/`,
  },
  {
    label: "Creating Invoices",
    value: "10",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-invoices/`,
  },
  {
    label: "Managing Invoices",
    value: "10.1",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-manage-invoices-export-and-all/`,
  },
  {
    label: "Invoice Details",
    value: "10.2",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-view-invoice-details/`,
  },
  {
    label: "Creating Sales Returns",
    value: "11",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-sales-return/`,
  },
  {
    label: "Managing Sales Returns",
    value: "11.1",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-manage-sales-return-export-and-all/`,
  },
  {
    label: "Sales Return Details",
    value: "11.2",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-view-sales-return-details/`,
  },
  {
    label: "Credit Notes",
    value: "12",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-credit-notes/`,
  },
  {
    label: "Manage Credit Notes",
    value: "12.1",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-manage-credit-notes-export-and-all/`,
  },
  {
    label: "Creating Purchase Orders",
    value: "13",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-purchase-order/`,
  },
  {
    label: "Managing Purchase Orders",
    value: "13.1",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-manage-purchase-order/`,
  },
  {
    label: "Purchase Order Details",
    value: "13.2",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-view-purchase-order-details/`,
  },
  {
    label: "Creating Bills",
    value: "14",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-bills/`,
  },
  {
    label: "Managing Bills",
    value: "14.1",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-manage-bills/`,
  },
  {
    label: "Bill Details",
    value: "14.2",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-view-bill-details/`,
  },
  {
    label: "View/Manage Reports",
    value: "15",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-view-and-manage-reports/`,
  },
  {
    label: "Users and Roles",
    value: "16",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-invite-users-and-create-roles-in-settings/`,
  },
  {
    label: "Create/Manage Taxes",
    value: "16.1.1",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-and-manage-taxes/`,
  },
  {
    label: "Delivery Methods",
    value: "16.1.2",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-and-manage-delivery-methods/`,
  },
  {
    label: "Inventory Accounts",
    value: "16.1.4",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-create-and-manage-inventory-account/`,
  },
  {
    label: "Managing Preferences",
    value: "16.1.6",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-manage-preferences/`,
  },
  {
    label: "Navigating SeeBiz Inventory",
    value: "17",
    url: `www.${seebizUrl}/inventory/user-manual/how-to-access-quick-navigations/`,
  },
  {
    label: "Dashboard Overview",
    value: "18",
    url: `www.${seebizUrl}/inventory/user-manual/analyzing-your-inventory-summary-through-dashboard/`,
  },
];
// url: 'https://www.${seebizUrl}/inventory/user-manual/how-to-register-with-seebiz-inventory/' //http included
export default UserManual;
