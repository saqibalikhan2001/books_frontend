/** @format */

import { ItemType } from "antd/lib/menu/hooks/useItems";
import { useAxios } from "app/Hooks";
import { PageHeaderX, Toast } from "app/shared";
import { Content, Labels, routeNames } from "static";

const { NEW_BILL } = Labels;
const { all_bills } = Content;
const { ADD_BILLS } = routeNames;

export const SubHeader = ({
  enable = false,
  noData = false,
}: {
  enable: boolean;
  noData?: boolean;
}) => {
  const { callAxios } = useAxios();

  const exportAllEstimates = () => {
    callAxios({
      method: "post",
      url: `/bills/export`,
      data: { filter: "all", starting_date: "", ending_date: "" },
    }).then((res) => {
      let csvFile = "data:text/csv;charset=utf-8," + res;
      let encodedUri = encodeURI(csvFile);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `all_bills.csv`);
      document.body.appendChild(link);
      link.click();
      Toast({ message: "All bills exported successfully" });
    });
  };

  const items: ItemType[] = [
    {
      key: "1",
      label: "Export bills",
      disabled: noData,
      onClick: exportAllEstimates,
    },
  ];
  return (
    <>
    <PageHeaderX.SubHeader
        dropDownBtn
        items={items}
        enabled={enable}
        title={all_bills}
        btnText={NEW_BILL}
        navigateTo={ADD_BILLS}
      />
    </>
  );
};
