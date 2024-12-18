/** @format */

import { ItemType } from "antd/es/menu/hooks/useItems";
import { useAxios } from "app/Hooks";
import { PageHeaderX, Toast } from "app/shared";
import { Content, Labels, routeNames } from "static";

const { NEW_ESTIMATE } = Labels;
const { all_estimates } = Content;
const { ADD_ESTIMATE } = routeNames;

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
      url: `/estimates/export`,
      data: { filter: "all", starting_date: "", ending_date: "" },
    }).then((res) => {
      let csvFile = "data:text/csv;charset=utf-8," + res;
      let encodedUri = encodeURI(csvFile);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `all_estimates.csv`);
      document.body.appendChild(link);
      link.click();
      Toast({ message: "All estimates exported successfully" });
    });
  };

  const items: ItemType[] = [
    {
      key: "1",
      label: "Export estimates",
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
        title={all_estimates}
        btnText={NEW_ESTIMATE}
        navigateTo={ADD_ESTIMATE}
      />
    </>
  );
};
