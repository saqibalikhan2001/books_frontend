/**@format */

import { useCallback, useState } from "react";
import { endpoints } from "static";
import { Toast } from "app/shared";
import ReceiveModal from "./Modal";
import { useAxios } from "app/Hooks";
import { getFullDateAndTime } from "utils";
import { CreateReceiveProps } from "./Types";

const { PURCHASE_ORDERS, RECEIVES, STORE } = endpoints;

export const CreateReceive = ({
  url,
  bool,
  refetch,
  PODetails,
  closeModal,
  has_permission,
}: CreateReceiveProps) => {
  const [itemsList, setItemsList] = useState([]);
  const { callAxios, toggle: loader, bool: loading } = useAxios();

  const handleItemList = useCallback((items: any) => {
    setItemsList(items);
  }, []);

  const onSubmit = (values: any) => {
    const itemsListPayload = itemsList.map((item: any) => ({
      quantity: item.quantity,
      purchase_order_item_detail_id: item.purchase_order_item_detail_id,
    }));
    loader();
    callAxios({
      method: "post",
      url: `${PURCHASE_ORDERS}/${PODetails?.id}${RECEIVES}${STORE}`,
      data: {
        ...values,
        items: itemsListPayload,
        receive_date: getFullDateAndTime(values.receive_date),
      },
    }).then((res: any) => {
      loader();
      if (res) {
        Toast({ message: res.message });
        closeModal();
        refetch();
      }
    });
  };
  return (
    <>
      <ReceiveModal
        url={url}
        showModal={bool}
        loading={loading}
        onSubmit={onSubmit}
        closeModal={closeModal}
        handleItemList={handleItemList}
        has_permission={has_permission}
      />
    </>
  );
};
