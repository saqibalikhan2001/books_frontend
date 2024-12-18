/**@format */

import { Tabs } from "antd";
import { Bill } from "./Bill";
import Modules from "./Modules";
import { General } from "./General";
import { Invoice } from "./Invoice";
import { Estimate } from "./Estimate";
import { Prefixes } from "./Prefixes";
import { PrintsPdf } from "./PrintsPdf";
import { Inventory } from "./Inventory";
import { Dashboard } from "./Dashboard";
import { CreditNote } from "./CreditNote";
import { Accounting } from "./Accounting";
import { AccessDenied } from "app/shared";
import { usePermissions } from "app/Hooks";
import { PreferenceTabsProps } from "./Types";
import { NetworkPreference } from "./Network";
import "assets/scss/shared/_preferenceTab.scss";
import { SpinnerX } from "app/shared/PageLoader";
import { DiscountPreference } from "./DiscountPreference";
import { PaymentTerm } from "./PaymentTerm/index";

// const tabChildren = [
//   // {
//   //   key: "9",
//   //   label: "Dashboard",
//   //   children: <Dashboard />,
//   // },
//   {
//     key: "1",
//     label: "General",
//     children: <General />,
//   },
//   {
//     key: "2",
//     label: "Sales Order",
//     children: <SalesOrder />,
//   },
//   {
//     key: "3",
//     label: "Estimate",
//     children: <Estimate />,
//   },
//   {
//     key: "4",
//     label: "Invoice",
//     children: <Invoice />,
//   },
//   {
//     key: "5",
//     label: "Purchase Order",
//     children: <PurchaseOrder />,
//   },
//   {
//     key: "6",
//     label: "Bill",
//     children: <Bill />,
//   },
//   {
//     key: "7",
//     label: "Credit note",
//     children: <CreditNote />,
//   },
//   {
//     key: "8",
//     label: "Module Permissions",
//     children: <Modules />,
//   },
// ];

export const PreferenceTabs = ({ current, handleChange }: PreferenceTabsProps) => {
  const { checkPermission, fetchingRoles } = usePermissions();
  const { has_BillPreferenceView_permission } = checkPermission("BillPreferenceView");
  const { has_PrintPreferenceView_permission } = checkPermission("PrintPreferenceView");
  const { has_PrefixPreferenceView_permission } = checkPermission("PrefixPreferenceView");
  const { has_ModulePreferenceView_permission } = checkPermission("ModulePreferenceView");
  const { has_GeneralPreferenceView_permission } = checkPermission("GeneralPreferenceView");
  const { has_InvoicePreferenceView_permission } = checkPermission("InvoicePreferenceView");
  const { has_EstimatePreferenceView_permission } = checkPermission("EstimatePreferenceView");
  const { has_DiscountPreferenceView_permission } = checkPermission("DiscountPreferenceView");
  const { has_DashboardPreferenceView_permission } = checkPermission("DashboardPreferenceView");
  const { has_InventoryPreferenceView_permission } = checkPermission("InventoryPreferenceView");
  const { has_CreditNotePreferenceView_permission } = checkPermission("CreditNotePreferenceView");
  const { has_AccountsPreferenceView_permission } = checkPermission("AccountsPreferenceView");

  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      <div className="preferance-left-tab">
        <Tabs
          type="card"
          tabBarGutter={0}
          tabPosition="left"
          activeKey={current}
          onChange={handleChange}
          className="preference_tab"
          // items={tabChildren}
        >
          <Tabs.TabPane key="1" tab={<label>Dashboard</label>}>
            {has_DashboardPreferenceView_permission ? <Dashboard /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab={<label>General</label>}>
            {has_GeneralPreferenceView_permission ? <General /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab={<label>Inventory</label>}>
            {has_InventoryPreferenceView_permission ? <Inventory /> : <AccessDenied />}
          </Tabs.TabPane>
          {/* <Tabs.TabPane key="4" tab={<label>Sales order</label>}>
          <SalesOrder />
        </Tabs.TabPane> */}
          {/* <Tabs.TabPane key="5" tab={<label>Purchase order</label>}>
          <PurchaseOrder />
        </Tabs.TabPane> */}
          <Tabs.TabPane key="6" tab={<label>Estimate</label>}>
            {has_EstimatePreferenceView_permission ? <Estimate /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="7" tab={<label>Invoice & Sale receipt</label>}>
            {has_InvoicePreferenceView_permission ? <Invoice /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="8" tab={<label>Bill & Expense</label>}>
            {has_BillPreferenceView_permission ? <Bill /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="9" tab={<label>Credit note</label>}>
            {has_CreditNotePreferenceView_permission ? <CreditNote /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="10" tab={<label>Prefixes</label>}>
            {has_PrefixPreferenceView_permission ? <Prefixes /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="11" tab={<label>Prints & PDF</label>}>
            {has_PrintPreferenceView_permission ? <PrintsPdf /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="12" tab={<label>Modules</label>}>
            {has_ModulePreferenceView_permission ? <Modules seting /> : <AccessDenied />}
          </Tabs.TabPane>
          {/* <Tabs.TabPane key="13" tab={<label>General categories</label>}>
            <GeneralCategories />
          </Tabs.TabPane> */}
          {/* <Tabs.TabPane key="14" tab={<label>Tags</label>}>
            <Tags />
          </Tabs.TabPane> */}
          <Tabs.TabPane key="15" tab={<label>Discount preference</label>}>
            {has_DiscountPreferenceView_permission ? <DiscountPreference /> : <AccessDenied />}
          </Tabs.TabPane>
          {import.meta.env.VITE_ADD_ACCOUNTS === "true" && (
            <Tabs.TabPane key="16" tab={<label>Accounting</label>}>
              {has_AccountsPreferenceView_permission ? <Accounting /> : <AccessDenied />}
            </Tabs.TabPane>
          )}
          {/* this tab permissions will be handled in future when we start working on it */}
          {!window?.location?.href?.includes("books.seebiz.cloud") && (
            <Tabs.TabPane key="17" tab={<label>Network preference</label>}>
              <NetworkPreference />
            </Tabs.TabPane>
          )}
          <Tabs.TabPane key="18" tab={<label>Payment Term preference</label>}>
            <PaymentTerm />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};
