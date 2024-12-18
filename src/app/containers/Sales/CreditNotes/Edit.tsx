/** @format */

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, usePermissions } from "app/Hooks";
import CreditNoteForm from "./CreditNoteForm";
import { setKeyInLS, setSessionAndLocalObj } from "utils";
import { routeNames } from "static";
import { SpinnerX } from "app/shared/PageLoader";

const EditCreditNotes = ({
  isModal,
  creditId,
  setCreditId,
  invoiceDetail,
  refetchCreditNotes,
  toggleCreditNoteModal,
}: any) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkPermission, fetchingRoles } = usePermissions();
  const [item, setItem] = useState<any>([]);
  const [contactObj, setContactObj] = useState<any>();
  const [invoiceId, setInvoiceId] = useState<any>(null);
  const { has_CreditNoteEdit_permission } = checkPermission("CreditNoteEdit");

  const [data, setData] = useState({
    issuedCredits: 0,
    deductions: 0,
  });

  const { callAxios, bool, toggle } = useAxios();

  const credit_Id = searchParams.get("id");

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
      adjustment_amount: item.adjustment_amount ?? 0,
      extra_description: item?.extra_description,
      invoice_id: invoiceDetail?.invoice_info?.id,
      quantity_processed: item?.quantity_processed,
      adjustement_criteria: item?.adjustement_criteria,
      invoice_item_detail_id: item?.invoice_item_details_id,
    }));
    const obj = {
      ...values,
      invoice_id: invoiceDetail?.invoice_info?.id ?? invoiceId,
      items: newItem,

      customer_id: contactObj?.id,

      deductions: data?.deductions,
      issued_credits: data?.issuedCredits,
      sale_order_id: null,

      directly_sold: true,
    };
    const payload = values?.saveAs === "open" ? { ...obj, status: "open" } : obj;
    callAxios({
      url: `creditnotes/${creditId || credit_Id}`,
      method: "put",
      data: payload,
    }).then((res) => {
      if (res) {
        Toast({ message: res?.message });
        !isModal && setSessionAndLocalObj(res?.data?.id, true, "/creditnotes");

        if (values.saveAs === "email") {
          isModal
            ? navigate(`${routeNames.EMAIL}?creditnoteid=${res?.data?.id}`)
            : setKeyInLS("email", true);
        }

        if (isModal) {
          toggleCreditNoteModal();
          refetchCreditNotes();
          setCreditId(null);
        } else navigate(-1);
      }
    });
  };
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {has_CreditNoteEdit_permission ? (
        <CreditNoteForm
          Edit
          data={data}
          items={item}
          loading={bool}
          isModal={isModal}
          setData={setData}
          onSubmit={onSubmit}
          detail={invoiceDetail}
          contactObj={contactObj}
          setCreditId={setCreditId}
          setInvoiceId={setInvoiceId}
          setContactObj={setContactObj}
          handleItemList={handleItemList}
          toggleCreditNoteModal={toggleCreditNoteModal}
          url={`creditnotes/${creditId || credit_Id}/edit`}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default EditCreditNotes;
