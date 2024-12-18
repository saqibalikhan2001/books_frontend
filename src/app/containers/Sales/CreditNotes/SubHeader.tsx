/** @format */

import { ItemType } from "antd/es/menu/hooks/useItems";
import { useAxios } from "app/Hooks";
import { PageHeaderX, Toast } from "app/shared";
import { Content, Labels, routeNames } from "static";

const { NEW_CREDIT_NOTE } = Labels;
const { all_credit_notes } = Content;
const { ADD_CREDIT_NOTE } = routeNames;

export const SubHeader = ({ enable, noData }: any) => {
  const { callAxios } = useAxios();

  const exportCreditNotes = () => {
    callAxios({
      method: "post",
      url: `/creditnotes/export`,
      data: { filter: "all" },
    }).then((res) => {
      if (res) {
        let csvFile = "data:text/csv;charset=utf-8," + res;
        let encodedUri = encodeURI(csvFile);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `all_CreditNotes.csv`);
        document.body.appendChild(link);
        link.click();
        Toast({ message: "Credit Notes exported successfully" });
      }
    });
  };

  const items: ItemType[] = [
    {
      key: "3",
      label: "Export Credit notes",
      onClick: exportCreditNotes,
      disabled: noData,
    },
  ];

  return (
    <>
      <PageHeaderX.SubHeader
        dropDownBtn
        items={items}
        enabled={enable}
        showButton={true}
        title={all_credit_notes}
        btnText={NEW_CREDIT_NOTE}
        navigateTo={ADD_CREDIT_NOTE}
      />
    </>
  );
};
