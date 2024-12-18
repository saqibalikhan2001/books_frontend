/**@format */

import { useCallback, useState } from "react";

import { Toast } from "app/shared";
import BillModal from "./Modal";
import { endpoints } from "static";
import { useAxios } from "app/Hooks";
import { getFullDateAndTime } from "utils";
import { POItemDetailProps } from "../Types";
import { BillItemDetailProps, CreateBillProps, ValuesProps } from "./Types";

const { BILLS } = endpoints;

export const CreateBill = ({
  url,
  bool,
  POdetail,
  refetchPO,
  toggleModal,
  refetchBills,
  has_permission,
}: CreateBillProps) => {
  const [total, setTotal] = useState(0);
  const { callAxios, toggle, bool: loading } = useAxios();
  const [itemsList, setItemsList] = useState<BillItemDetailProps[]>([]);

  const handleTotal = useCallback((total: number) => {
    setTotal(total);
  }, []);
  const handleItemList = useCallback((items: BillItemDetailProps[]) => {
    setItemsList(items);
  }, []);

  const onSubmit = (values: ValuesProps) => {
    const itemsPayload = itemsList.map((item: BillItemDetailProps) => ({
      ...item,
      purchase_order_item_detail_id: POdetail?.purchase_order_item_details?.find(
        (poitem: POItemDetailProps) => poitem.item_id === item.item_id
      )?.id,
    }));
    toggle();
    callAxios({
      method: "post",
      url: BILLS,
      data: {
        ...values,
        total: total,
        items: itemsPayload,
        bill_date: getFullDateAndTime(values.bill_date),
        due_date: getFullDateAndTime(values.due_date),
      },
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        toggleModal();
        refetchBills();
        refetchPO();
      }
    });
  };

  return (
    <>
      <BillModal
        create
        url={url}
        showModal={bool}
        loading={loading}
        POdetail={POdetail}
        onSubmit={onSubmit}
        toggleModal={toggleModal}
        handleTotal={handleTotal}
        handleItemList={handleItemList}
        has_permission={has_permission}
      />
    </>
  );
};
