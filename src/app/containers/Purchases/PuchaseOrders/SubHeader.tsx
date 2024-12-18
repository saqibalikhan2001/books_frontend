/** @format */

import { Content, Labels, routeNames } from "static";
import { PageHeaderX } from "app/shared";

const { NEW_PURCHASE_ORDER } = Labels;
const { all_purchase_orders } = Content;
const { ADD_PURCHASE_ORDER } = routeNames;

export const SubHeader = ({ enable = false }: { enable: boolean }) => {
  return (
    <>
      <PageHeaderX.SubHeader
        enabled={enable}
        title={all_purchase_orders}
        btnText={NEW_PURCHASE_ORDER}
        navigateTo={ADD_PURCHASE_ORDER}
      />
    </>
  );
};
