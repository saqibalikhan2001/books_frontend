/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "app/Hooks";
import { AdjusmentModal } from "./DetailPage";
import { PageHeaderX, Toast } from "app/shared";
import { Content, Labels, routeNames } from "static";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { getStringValueFromSS, setKeyInSS } from "utils";

const { NEW_PRODUCT } = Labels;
const { ADD_ITEM } = routeNames;
const { product_and_services } = Content;

export const SubHeader = ({
  enable = false,
  noData = false,
  refetch,
}: {
  enable: boolean;
  noData?: boolean;
  refetch?: any;
}) => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [modal, setModal] = useState(false);

  const exportItems = () => {
    callAxios({
      method: "post",
      url: `/items/export`,
      data: { filter: "all" },
    }).then((res) => {
      let csvFile = "data:text/csv;charset=utf-8," + res;
      let encodedUri = encodeURI(csvFile);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `products.csv`);
      document.body.appendChild(link);
      link.click();
      Toast({ message: "Products exported successfully" });
    });
  };

  const toggleModal = () => setModal(!modal);

  const items: ItemType[] = [
    {
      key: "1",
      label: "Categories",
      onClick: async () => {
        const dataFromLS: any = getStringValueFromSS("params");
        const params = {
          ...dataFromLS,
          page: 1,
        };
        await setKeyInSS("params", params);
        navigate("/categories");
      },
    },
    {
      key: "2",
      label: "Adjust quantity",
      onClick: toggleModal,
    },
    {
      key: "3",
      label: "Export products",
      onClick: exportItems,
    },
  ];
  const product_items: ItemType[] = [
    {
      key: "1",
      label: "Inventory",
      onClick: () => navigate("/items-new"),
    },
    {
      key: "2",
      label: "Non-Inventory",
      disabled: true,
    },
    {
      key: "3",
      label: "Service",
      disabled: true,
    },
    {
      key: "4",
      label: "Bundle",
      disabled: true,
    },
    {
      key: "5",
      label: "Import Products",
      disabled: true,
    },
  ];

  return (
    <>
      <PageHeaderX.SubHeader
        dropDownBtn
        show={!noData}
        enabled={enable}
        itemsMore={items}
        itemdetails={true}
        btnText={NEW_PRODUCT}
        navigateTo={ADD_ITEM}
        items={product_items}
        title={product_and_services}
      />
      <AdjusmentModal handleCancel={toggleModal} open={modal} refetch={refetch} />
    </>
  );
};
