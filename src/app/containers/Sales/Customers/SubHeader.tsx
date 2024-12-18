/** @format */

import { ItemType } from "antd/es/menu/hooks/useItems";
import { useAxios } from "app/Hooks";
import { endpoints, routeNames } from "static";
import { PageHeaderX, Toast } from "app/shared";

const { ADD_CUSTOMER, ADD_SUPPLIER } = routeNames;

export const SubHeader = ({
  enable = false,
  supplier = false,
  noData,
}: {
  enable: boolean;
  supplier?: boolean;
  noData?: boolean;
}) => {
  const { callAxios } = useAxios();

  const exportAll = () => {
    callAxios({
      method: "post",
      url: `${supplier ? endpoints.SUPPLIERS : endpoints.CUSTOMERS}/export?contact_type=${supplier ? "supplier" : "customer"}`,
      data: {
        contact_type: `${supplier ? "supplier" : "customer"}`,
        filter: "all",
        starting_date: "",
        ending_date: "",
      },
    }).then((res) => {
      if (res) {
        let csvFile = "data:text/csv;charset=utf-8," + res;
        let encodedUri = encodeURI(csvFile);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${supplier ? "all_suppiers" : "all_customers"}.csv`);
        document.body.appendChild(link);
        link.click();
        Toast({ message: `All ${supplier ? "suppliers" : "customers"} exported successfully` });
      }
    });
  };

  const items: ItemType[] = [
    {
      key: "1",
      label: `Export customers`,
      onClick: exportAll,
      disabled: noData,
    },
  ];
  const supplierItems: ItemType[] = [
    {
      key: "1",
      label: `Export suppliers`,
      onClick: exportAll,
      disabled: noData,
    },
  ];
  return (
    <>
      <PageHeaderX.SubHeader
        dropDownBtn
        enabled={enable}
        items={supplier ? supplierItems : items}
        title={supplier ? "Suppliers" : "Customers"}
        btnText={supplier ? "New supplier" : "New customer"}
        navigateTo={supplier ? ADD_SUPPLIER : ADD_CUSTOMER}
      />
    </>
  );
};
