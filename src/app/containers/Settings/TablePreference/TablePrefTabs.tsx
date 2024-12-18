/**@format */

import { Tabs } from "antd";
import { BillsList } from "./BillsList";
import { AccessDenied } from "app/shared";
import { usePermissions } from "app/Hooks";
import { InvoiceList } from "./InvoiceList";
import { SupplierList } from "./SuplierList";
import { ProductList } from "./ProductsList";
import { CustomerList } from "./CustomerList";
import { EstimateList } from "./EstimateList";
import "assets/scss/shared/_preferenceTab.scss";
import { SpinnerX } from "app/shared/PageLoader";
import { CreditNoteList } from "./CreditNoteList";
import { BillPaymentsList } from "./BillPaymentsList";
import { ChartOFAccountsList } from "./ChartOfAccounts";
import { PreferenceTabsProps } from "../Preferences/Types";
import { PaymentReceivedList } from "./PaymentReceivedList";

export const TablePrefTabs = ({ current, handleChange }: PreferenceTabsProps) => {
  const { checkPermission, fetchingRoles } = usePermissions();
  const { has_CNTablePreferenceView_permission } = checkPermission("CNTablePreferenceView");
  const { has_PRTablePreferenceView_permission } = checkPermission("PRTablePreferenceView");
  const { has_ESTTablePreferenceView_permission } = checkPermission("ESTTablePreferenceView");
  const { has_INVTablePreferenceView_permission } = checkPermission("INVTablePreferenceView");
  const { has_ItemTablePreferenceView_permission } = checkPermission("ItemTablePreferenceView");
  const { has_BillTablePreferenceView_permission } = checkPermission("BillTablePreferenceView");
  const { has_CustomerTablePreferenceView_permission } = checkPermission(
    "CustomerTablePreferenceView"
  );
  const { has_SupplierTablePreferenceView_permission } = checkPermission(
    "SupplierTablePreferenceView"
  );
  const { has_BillPaymentTablePreferenceView_permission } = checkPermission(
    "BillPaymentTablePreferenceView"
  );
  const { has_AccountsTablePreferenceView_permission } = checkPermission(
    "AccountsTablePreferenceView"
  );

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
        >
          <Tabs.TabPane key="1" tab={<label>Products & Services</label>}>
            {has_ItemTablePreferenceView_permission ? <ProductList /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab={<label>Customers</label>}>
            {has_CustomerTablePreferenceView_permission ? <CustomerList /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab={<label>Suppliers</label>}>
            {has_SupplierTablePreferenceView_permission ? <SupplierList /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="4" tab={<label>Estimates</label>}>
            {has_ESTTablePreferenceView_permission ? <EstimateList /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="5" tab={<label>Invoices</label>}>
            {has_INVTablePreferenceView_permission ? <InvoiceList /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="6" tab={<label>Payment receipts</label>}>
            {has_PRTablePreferenceView_permission ? <PaymentReceivedList /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="7" tab={<label>Credit notes</label>}>
            {has_CNTablePreferenceView_permission ? <CreditNoteList /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="8" tab={<label>Bills</label>}>
            {has_BillTablePreferenceView_permission ? <BillsList /> : <AccessDenied />}
          </Tabs.TabPane>
          <Tabs.TabPane key="9" tab={<label>Bill payments</label>}>
            {has_BillPaymentTablePreferenceView_permission ? (
              <BillPaymentsList />
            ) : (
              <AccessDenied />
            )}
          </Tabs.TabPane>
          <Tabs.TabPane key="10" tab={<label>Chart of accounts</label>}>
            {has_AccountsTablePreferenceView_permission ? (
              <ChartOFAccountsList />
            ) : (
              <AccessDenied />
            )}
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};
