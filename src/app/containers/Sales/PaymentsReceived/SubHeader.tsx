/** @format */

import { Icons, PageHeaderX } from "app/shared";
import { Content, Labels, routeNames } from "static";
import { ItemType } from "antd/es/menu/hooks/useItems";

const { VscAdd } = Icons;
const { record_payment } = Content;
const { NEW_PAYMENT_RECEIVED } = Labels;
const { ADD_PAYMENTS_RECEIVED } = routeNames;

//@ts-ignore
const items: ItemType[] = [
  {
    key: "filters",
    type: "group",
    label: "DEFAULT FILTERS",
    children: [],
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

export const SubHeader = ({
  enable = false,
}: {
  enable: boolean;
  noData?: boolean;
}) => {
  // const items: ItemType[] = [
  //   {
  //     key: "1",
  //     label: "Export payments receipt",
  //     disabled: true,
  //   },
  // ];
  return (
    <>
      <PageHeaderX.SubHeader
        primaryBtn
        enabled={enable}
        title={record_payment}
        btnText={NEW_PAYMENT_RECEIVED}
        navigateTo={ADD_PAYMENTS_RECEIVED}
      />
    </>
  );
};
