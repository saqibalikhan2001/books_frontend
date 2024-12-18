/** @format */

import { useCallback, useState } from "react";

import BillModal from "./Modal";
import { Toast } from "app/shared";
import { endpoints } from "static";
import { useAxios } from "app/Hooks";
import { BillEditProps, BillItemDetailProps, ValuesProps } from "./Types";
import { getFullDateAndTime } from "utils";
import { POItemDetailProps } from "../Types";

const { BILLS } = endpoints;

export const EditBill = ({
  bool,
  refetchPO,
  POdetail,
  toggleModal,
  BillDetail,
  refetchBills,
  has_permission,
}: BillEditProps) => {
  const { callAxios, toggle, bool: loading } = useAxios();
  const [total, setTotal] = useState(0);
  const [itemsList, setItemsList] = useState<BillItemDetailProps[]>([]);

  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: BillItemDetailProps[]) => setItemsList(items), []);

  const onSubmit = (values: ValuesProps) => {
    const itemsListPayload = itemsList.map((item: BillItemDetailProps) => ({
      ...item,
      purchase_order_item_detail_id: POdetail?.purchase_order_item_details?.find(
        (poitem: POItemDetailProps) => poitem.item_id === item.item_id
      )?.id,
    }));
    toggle();
    callAxios({
      method: "put",
      url: `${BILLS}/${BillDetail?.id}`,
      data: {
        ...values,
        total: total,
        items: itemsListPayload,
        discount_transaction_level: 0,
        due_date: getFullDateAndTime(values.due_date),
        bill_date: getFullDateAndTime(values.bill_date),
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
        edit
        showModal={bool}
        loading={loading}
        POdetail={POdetail}
        onSubmit={onSubmit}
        toggleModal={toggleModal}
        handleTotal={handleTotal}
        handleItemList={handleItemList}
        has_permission={has_permission}
        url={`${BILLS}/${BillDetail?.id}/edit`}
      />
    </>
  );
};
