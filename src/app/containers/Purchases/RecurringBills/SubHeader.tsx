/** @format */

import { PageHeaderX } from "app/shared";
import { Content, Labels, routeNames } from "static";

const { NEW_RECURRING_BILL } = Labels;
const { all_recurring_bills } = Content;
const { ADD_RECURRING_BILL } = routeNames;

export const SubHeader = ({ enable = false }: { enable: boolean }) => {
  return (
    <>
      <PageHeaderX.SubHeader
        enabled={enable}
        title={all_recurring_bills}
        btnText={NEW_RECURRING_BILL}
        navigateTo={ADD_RECURRING_BILL}
      />
    </>
  );
};
