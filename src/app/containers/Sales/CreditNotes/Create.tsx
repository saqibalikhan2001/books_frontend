/** @format */

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routeNames } from "static";
import CreditNoteForm from "./CreditNoteForm";
import { CreateCreditNoteProps } from "./Types";
import { AccessDenied, Toast } from "app/shared";
import { SpinnerX } from "app/shared/PageLoader";
import { useAxios, usePermissions } from "app/Hooks";
import { setKeyInSS, getStringValueFromSS, setSessionAndLocalObj, setKeyInLS } from "utils";

const { CREDIT_NOTES, EMAIL, INVOICES } = routeNames;

const CreateCreditNote = ({
  creditModal,
  invoiceDetail,
  isModal = false,
  refetchInvoices,
  toggleCreditNoteModal,
}: CreateCreditNoteProps) => {
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [item, setItem] = useState<any>([]);
  const { callAxios, bool, toggle } = useAxios();
  const [contactObj, setContactObj] = useState<any>();
  const [invoiceId, setInvoiceId] = useState<any>(null);
  const { checkPermission, fetchingRoles } = usePermissions();
  const { has_CreditNoteCreate_permission } = checkPermission("CreditNoteCreate");
  const [data, setData] = useState({
    issuedCredits: 0,
    deductions: 0,
  });
  const handleItemList = (items: any) => setItem(items);

  const onSubmit = ({ values }: any) => {
    toggle();
    const result = item.filter((obj) => obj.id !== null);
    const newItem = result.map((item: any) => ({
      item_id: item?.id,
      sale_order_id: null,
      sale_return_id: null,
      return_receive_id: null,
      credits: item?.adjustment ?? 0,
      adjustment: item?.adjustment ?? 0,
      return_type: item?.return_type,
      warehouse_id: item?.warehouse_id,
      invoice_item_detail_id: item?.unique_id,
      adjustment_amount: item.adjustment_amount ?? 0,
      extra_description: item?.extra_description,
      invoice_id: invoiceDetail?.invoice_info?.id,
      quantity_processed: item?.quantity_processed,
      adjustement_criteria: item?.adjustement_criteria,
    }));
    const obj = {
      ...values,
      items: newItem,
      sale_order_id: null,
      directly_sold: true,
      customer_id: contactObj?.id,
      issued_credits: data?.issuedCredits,
      invoice_id: invoiceDetail?.invoice_info?.id ?? invoiceId,
      deductions: item.length ? data?.deductions : 0,
    };
    const payload = values?.saveAs === "open" ? { ...obj, status: "open" } : obj;


    callAxios({
      url: `/creditnotes`,
      method: "post",
      data: payload,
    }).then(async (res) => {
      if (res) {
        Toast({ message: res?.message });
        if (values.saveAs === "email") {
          if (isModal) {
            navigate(`${EMAIL}?creditnoteid=${res?.data?.id}`);
          } else {
            setKeyInLS("email", true);
            setSessionAndLocalObj(res?.data?.id, true, "/creditnotes");
            const dataFromLS: any = getStringValueFromSS("params");
            const params = {
              ...dataFromLS,
              sort: "desc",
              sort_column: "created_at",
              filter: "",
              search: "",
              date_range: "",
              start_range: "",
              end_range: "",
              contactId: "",
            };
            await setKeyInSS("params", params);
            navigate(CREDIT_NOTES);
          }
        } else if (isModal) {
          setKeyInLS("tabKey", "3");
          toggleCreditNoteModal();
          refetchInvoices?.();
          navigate(INVOICES);
        } else {
          setSessionAndLocalObj(res?.data?.id, true, "/creditnotes");
          const dataFromLS: any = getStringValueFromSS("params");
          const params = {
            ...dataFromLS,
            sort: "desc",
            sort_column: "created_at",
            filter: "",
            search: "",
            date_range: "",
            start_range: "",
            end_range: "",
            contactId: "",
          };
          await setKeyInSS("params", params);
          navigate(CREDIT_NOTES);
        }
      }
    });
  };
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {has_CreditNoteCreate_permission ? (
        <CreditNoteForm
          create
          data={data}
          items={item}
          loading={bool}
          setData={setData}
          isModal={isModal}
          onSubmit={onSubmit}
          detail={invoiceDetail}
          contactObj={contactObj}
          creditModal={creditModal}
          setInvoiceId={setInvoiceId}
          setContactObj={setContactObj}
          handleItemList={handleItemList}
          customerFromCustomer={state?.customerDetail}
          toggleCreditNoteModal={toggleCreditNoteModal}
          url={
            isModal
              ? `/creditnotes/create?invoice_id=${invoiceDetail?.invoice_info?.id}&first_time=false`
              : state?.customerDetail
              ? `/creditnotes/create?customer_id=${state?.customerDetail?.id}`
              : `/creditnotes/create`
          }
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CreateCreditNote;
