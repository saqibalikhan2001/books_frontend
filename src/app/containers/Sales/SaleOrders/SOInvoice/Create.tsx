/**@format */

import { useCallback, useState } from "react";
import { endpoints } from "static";
import { Toast } from "app/shared";
import InvoiceModal from "./Modal";
import { useAxios } from "app/Hooks";
import { getFullDateAndTime } from "utils";
import { useGetInvoiceTermsListQuery } from "store/query/invoice";
import { CreateInvoiceProps, SOInvoiceItemObjProps } from "./Types";

const { INVOICES } = endpoints;

export const CreateInvoice = ({
  url,
  bool,
  refetchSO,
  SOdetails,
  toggleModal,
  has_permission,
  refetchInvoices,
}: CreateInvoiceProps) => {
  const [total, setTotal] = useState(0);
  const [contactObj, setContactObj] = useState<any>();
  const { data: terms = [] } = useGetInvoiceTermsListQuery("");

  const { callAxios, toggle: loader, bool: loading } = useAxios();
  const [itemsList, setItemsList] = useState<SOInvoiceItemObjProps[]>([]);

  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: SOInvoiceItemObjProps[]) => setItemsList(items), []);
  const onSubmit = ({ values }) => {
    const itemObj = itemsList.filter((data) => data.id !== null);
    const newItem = itemObj.map((item: any) => ({
      ...item,
      item_obj: null,
      amount: 0,
      sales_order_id: SOdetails?.id,
    }));

    const payload = {
      ...values,
      total: total,
      items: newItem,
      customer_id: contactObj?.id,
      discount_type: values.transaction_level_discount_type,
      adjustment: values?.adjustment || 0,
      shipping_charge: values?.shipping_charge || 0,
      billing_address_id: values?.billing_address_id?.id,
      discount_transaction_level:
        values?.discount_level === "item" ? 0 : values.discount_transaction_level,
      invoice_terms:
        typeof values?.invoice_terms !== "object"
          ? terms.find((val: { id: any }) => val.id === values?.invoice_terms) || {}
          : values.invoice_terms,
      due_date: getFullDateAndTime(values?.due_date),
      invoice_date: getFullDateAndTime(values?.invoice_date),
      status: values?.saveAs === "sent" ? "sent" : "draft",
    };
    loader();
    callAxios({
      method: "post",
      url: INVOICES,
      data: payload,
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
        url={url}
        item={itemsList}
        showModal={bool}
        loading={loading}
        contactObj={contactObj}
        setContactObj={setContactObj}
        onSubmit={onSubmit}
        SOdetails={SOdetails}
        toggleModal={toggleModal}
        handleTotal={handleTotal}
        handleItemList={handleItemList}
        has_permission={has_permission}
      />
    </>
  );
};
