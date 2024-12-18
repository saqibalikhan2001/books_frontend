/** @format */

import { PageHeaderX } from "app/shared";
import { Content, Labels, routeNames } from "static";

const { NEW_RECURRING_INVOICE } = Labels;
const { all_recurring_invoices } = Content;
const { ADD_RECURRING_INVOICES } = routeNames;

export const SubHeader = ({ enable = false }: { enable: boolean }) => {
  return (
    <>
      <PageHeaderX.SubHeader
        enabled={enable}
        title={all_recurring_invoices}
        btnText={NEW_RECURRING_INVOICE}
        navigateTo={ADD_RECURRING_INVOICES}
      />
    </>
  );
};
