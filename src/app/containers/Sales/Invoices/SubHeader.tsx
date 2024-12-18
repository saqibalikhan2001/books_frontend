/** @format */

import { ItemType } from "antd/es/menu/hooks/useItems";
import { useAxios } from "app/Hooks";
import { PageHeaderX, Toast } from "app/shared";
import { Content, Labels, routeNames } from "static";

const { NEW_INVOICE } = Labels;
const { all_invoices } = Content;
const { ADD_INVOICE } = routeNames;

export const SubHeader = ({
  enable = false,
  noData = false,
}: {
  enable: boolean;
  noData?: boolean;
}) => {
  const { callAxios } = useAxios();

  const exportAllInvoices = () => {
    callAxios({
      method: "post",
      url: `/invoices/export`,
      data: { filter: "all", starting_date: "", ending_date: "" },
    }).then((res) => {
      let csvFile = "data:text/csv;charset=utf-8," + res;
      let encodedUri = encodeURI(csvFile);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `all_invoices.csv`);
      document.body.appendChild(link);
      link.click();
      Toast({ message: "All invoices exported successfully" });
    });
  };

  const items: ItemType[] = [
    {
      key: "1",
      label: "Export invoices",
      onClick: exportAllInvoices,
      disabled: noData,
    },
  ];

  return (
    <>
      <PageHeaderX.SubHeader
        dropDownBtn
        items={items}
        enabled={enable}
        title={all_invoices}
        btnText={NEW_INVOICE}
        navigateTo={ADD_INVOICE}
      />
    </>
  );
};
