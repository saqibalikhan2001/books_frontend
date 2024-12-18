/** @format */
import { useCallback, useState } from "react";
import { Toast } from "app/shared";
import { endpoints } from "static";
import InvoiceModal from "./Modal";
import { useAxios } from "app/Hooks";
import { getFullDateAndTime } from "utils";
import { EditInvoiceProps, SOInvoiceItemObjProps, SOInvoiceSubmitProps } from "./Types";

const { INVOICES } = endpoints;

export const EditInvoice = ({
  bool,
  SOdetails,
  refetchSO,
  toggleModal,
  InvoiceDetail,
  has_permission,
  refetchInvoices,
}: EditInvoiceProps) => {
  const [total, setTotal] = useState(0);
  const { callAxios, toggle, bool: loading } = useAxios();
  const [contactObj, setContactObj] = useState<any>();
  const [itemsList, setItemsList] = useState<SOInvoiceItemObjProps[]>([]);

  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: SOInvoiceItemObjProps[]) => setItemsList(items), []);

  const onSubmit = (values: SOInvoiceSubmitProps) => {
    const itemsListPayload = itemsList.map((item: SOInvoiceItemObjProps) => ({
      ...item,
      sales_order_id: SOdetails?.id,
    }));
    toggle();
    callAxios({
      method: "put",
      url: `${INVOICES}/${InvoiceDetail?.id}/update`,
      data: {
        ...values,
        total,
        discount_type: "",
        items: itemsListPayload,
        discount_transaction_level: 0,
        due_date: getFullDateAndTime(values.due_date),
        invoice_date: getFullDateAndTime(values.invoice_date),
      },
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        toggleModal();
        refetchInvoices();
        refetchSO();
      }
    });
  };
  return (
    <>
      <InvoiceModal
        edit
        showModal={bool}
        loading={loading}
        onSubmit={onSubmit}
        SOdetails={SOdetails}
        contactObj={contactObj}
        toggleModal={toggleModal}
        handleTotal={handleTotal}
        setContactObj={setContactObj}
        handleItemList={handleItemList}
        has_permission={has_permission}
        url={`${INVOICES}/${InvoiceDetail?.id}/edit`}
      />
    </>
  );
};
