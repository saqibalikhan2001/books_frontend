/** @format */

import { useCallback, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { endpoints, routeNames } from "static";
import { InvoiceForm } from "./InvoiceForm";
import { AccessDenied, Toast } from "app/shared";
import { InvoiceDataSourceProps } from "./Types";
import { SpinnerX } from "app/shared/PageLoader";
import { useAxios, useLoading, usePermissions } from "app/Hooks";
// import { useGetInvoiceTermsListQuery } from "store/query/invoice";
import { convertInNumber, getFullDateAndTime, setKeyInLS, setSessionAndLocalObj } from "utils";
import { useGetPaymentTermsQuery } from "store/query/paymentTerm";

const { INVOICES } = routeNames;
const { INVOICES: INVOICES_URL } = endpoints;

const EditInvoices = ({
  isModal,
  estInvoiceId,
  setEstInvoiceId,
  // invoiceDetail,
  // refetchCreditNotes,
  toggleEstimateInvoiceModal,
}: any) => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [total, setTotal] = useState(0);
  const [loading, toggle] = useLoading();
  const [searchParams] = useSearchParams();
  const [contactObj, setContactObj] = useState<any>();

  const invoice_id = searchParams.get("id");
  const { checkPermission, fetchingRoles } = usePermissions();
  const [item, setItem] = useState<InvoiceDataSourceProps[]>([]);
  const { has_InvoiceEdit_permission } = checkPermission("InvoiceEdit");

  const { data: terms = [] } = useGetPaymentTermsQuery("");
  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: InvoiceDataSourceProps[]) => setItem(items), []);

  const onSubmit = ({ values }) => {
    toggle();
    const itemObj = item?.filter((data) => data.id !== null);
    const newItem = itemObj?.map((item: any) => ({
      ...item,
      item_obj: null,
      amount: 0,
    }));
    const new_values = {
      ...values,
      total: total,
      items: newItem,
      discount_type: values.transaction_level_discount_type,
      adjustment: convertInNumber(values?.adjustment),
      shipping_charge: values?.shipping_charge || 0,
      billing_address_id: values?.billing_address_id?.id,
      discount_transaction_level:
        values?.discount_level === "item"
          ? 0
          : values?.discount_level == null
          ? 0
          : values.discount_transaction_level
          ? values.discount_transaction_level
          : 0,
      invoice_terms:
        typeof values?.invoice_terms !== "object"
          ? terms.find((val: { id: any }) => val.id === values?.invoice_terms) || {}
          : values.invoice_terms,
      due_date: getFullDateAndTime(values?.due_date),
      invoice_date: getFullDateAndTime(values?.invoice_date),
      status: values?.saveAs === "sent" ? "sent" : "draft",
      customer_id: contactObj?.id,
    };
    callAxios({
      method: "put",
      url: `${INVOICES_URL}/${estInvoiceId || invoice_id}/update`,
      data: new_values,
    })
      .then((res) => {
        toggle();
        if (res) {
          Toast({ message: res.message });
          if (values?.saveAs === "email" && !isModal) setKeyInLS("email", true);
          if (isModal) {
            toggleEstimateInvoiceModal();
            // refetchCreditNotes();
            setEstInvoiceId(null);
          }
          !isModal && setSessionAndLocalObj(res?.data?.id, true, INVOICES);
          navigate(-1);
        }
      })
      .catch(() => toggle());
  };
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {has_InvoiceEdit_permission ? (
        <InvoiceForm
          edit
          item={item}
          isModal={isModal}
          loading={loading}
          onSubmit={onSubmit}
          contactObj={contactObj}
          handleTotal={handleTotal}
          setContactObj={setContactObj}
          handleItemList={handleItemList}
          toggleModal={toggleEstimateInvoiceModal}
          url={`${INVOICES_URL}/${estInvoiceId || invoice_id}/edit`}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default EditInvoices;
