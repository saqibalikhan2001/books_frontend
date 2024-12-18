/** @format */

import { Content, Labels, routeNames } from "static";
import { Icons, PageHeaderX } from "app/shared";
import { ItemType } from "antd/es/menu/hooks/useItems";

const { NEW_SALE_ORDER } = Labels;
const { all_sale_orders } = Content;
const { ADD_SALES_ORDER } = routeNames;
const { VscAdd } = Icons;

const items: ItemType[] = [
  {
    key: "filters",
    type: "group",
    label: "DEFAULT FILTERS",
    children: [
      {
        key: "1",
        label: "All",
      },
      {
        key: "2",
        label: "Draft",
      },
      {
        key: "3",
        label: "Pending Approval",
      },
      {
        key: "4",
        label: "Approved",
      },
      {
        key: "5",
        label: "Client Viewed",
      },
      {
        key: "6",
        label: "Accepted",
      },
      {
        key: "7",
        label: "Invoiced",
      },
      {
        key: "8",
        label: "Declined",
      },
      {
        key: "9",
        label: "Expired",
      },
    ],
  },
  {
    type: "divider",
  },
  {
    key: "10",
    label: "New Custom View",
    icon: <VscAdd />,
  },
];

export const SubHeader = ({ enable = false }: { enable: boolean }) => {
  return (
    <>
      <PageHeaderX.SubHeader
        items={items}
        enabled={enable}
        title={all_sale_orders}
        btnText={NEW_SALE_ORDER}
        navigateTo={ADD_SALES_ORDER}
      />
    </>
  );
};
