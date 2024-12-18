/** @format */

import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { InvoiceForm } from "./InvoiceForm";
import {
  setKeyInLS,
  setKeyInSS,
  convertInNumber,
  getFullDateAndTime,
  getStringValueFromSS,
  setSessionAndLocalObj,
} from "utils";
import { AccessDenied, Toast } from "app/shared";
import { SpinnerX } from "app/shared/PageLoader";
import { endpoints, Content, routeNames } from "static";
import { useLoading, useAxios, usePermissions } from "app/Hooks";
import { useGetPaymentTermsQuery } from "store/query/paymentTerm";
import { CreateInvoiceProps, InvoiceDataSourceProps } from "./Types";

const { INVOICES, EMAIL } = routeNames;
const { INVOICES: INVOICES_URL, INVOICE_CREATE } = endpoints;

const CreateInvoice = ({
  url,
  isModal,
  toggleModal,
  estimateDetails,
  refetchEstimates,
}: CreateInvoiceProps) => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { state }: any = useLocation();
  const [total, setTotal] = useState(0);
  const [loading, toggle] = useLoading();
  const [contactObj, setContactObj] = useState<any>();
  const { data: terms = [] } = useGetPaymentTermsQuery("");
  const { checkPermission, fetchingRoles } = usePermissions();
  const [item, setItem] = useState<InvoiceDataSourceProps[]>([]);
  const { has_InvoiceCreate_permission } = checkPermission("InvoiceCreate");
  const handleItemList = useCallback((items: InvoiceDataSourceProps[]) => setItem(items), []);
  const handleTotal = useCallback((total: number) => setTotal(total), []);

  const InvoicePayload = (values, newItem) => {
    const payload = {
      ...values,
      total: total,
      items: newItem,
      customer_id: contactObj?.id,
      discount_type: values.transaction_level_discount_type,
      adjustment: convertInNumber(values?.adjustment),
      shipping_charge: values?.shipping_charge || 0,
      billing_address_id: values?.billing_address_id?.id,
      discount_transaction_level:
        values?.discount_level === "item"
          ? 0
          : values?.discount_level == null
          ? 0
          : values.discount_transaction_level,
      invoice_terms:
        typeof values?.invoice_terms !== "object"
          ? terms.find((val: { id: any }) => val.id === values?.invoice_terms) || {}
          : values.invoice_terms,
      due_date: getFullDateAndTime(values?.due_date),
      invoice_date: getFullDateAndTime(values?.invoice_date),
      status: values?.saveAs === "sent" ? "sent" : "draft",
    };
    return payload;
  };

  const handleListingParams = () => {
    const dataFromLS: any = getStringValueFromSS("params");
    const params = {
      ...dataFromLS,
      sort: "desc",
      sort_column: "created_at",
      search: "",
      filter: "",
      date_range: "",
      start_range: "",
      end_range: "",
      contactId: "",
    };
    setKeyInSS("params", params);
  };
  const onSubmit = ({ values }: any) => {
    if (!item?.length) {
      Toast({ message: Content.select_item, type: "error" });
    } else {
      toggle();
      const itemObj = item.filter((data) => data.id !== null);
      const newItem = itemObj.map((item: any) => ({
        ...item,
        item_obj: null,
        amount: 0,
      }));
      const estimateItems = itemObj.map((item: any) => ({
        ...item,
        item_obj: null,
        amount: 0,
        estimate_item_detail_id: item?.unique_id,
      }));
      const payload = InvoicePayload(values, newItem);
      const data =
        isModal && estimateDetails
          ? {
              ...payload,
              items: estimateItems,
              estimate_id: estimateDetails?.id,
            }
          : payload;

      callAxios({
        method: "post",
        url: INVOICES_URL,
        data,
      })
        .then(async (res) => {
          toggle();
          if (res) {
            Toast({ message: res.message });
            if (values?.saveAs === "email" && !isModal) {
              setKeyInLS("email", true);
              setSessionAndLocalObj(res?.data?.id, true, "invoices");
              await handleListingParams();
              navigate(INVOICES);
            } else if (values?.saveAs !== "email" && !isModal) {
              setSessionAndLocalObj(res?.data?.id, true, "invoices");
              await handleListingParams();
              navigate(INVOICES);
            } else if (values?.saveAs === "email" && isModal && estimateDetails) {
              isModal ? navigate(`${EMAIL}?id=${res?.data.id}`) : navigate(INVOICES);
            } else if (values?.saveAs !== "email" && isModal && estimateDetails) {
              setKeyInLS("tabKey", "4");
              toggleModal();
              refetchEstimates();
            }
          }
        })
        .catch(() => toggle());
    }
  };
  if (fetchingRoles) return <SpinnerX />;
  return (
    <>
      {has_InvoiceCreate_permission ? (
        <InvoiceForm
          create
          item={item}
          isModal={isModal}
          loading={loading}
          onSubmit={onSubmit}
          contactObj={contactObj}
          toggleModal={toggleModal}
          handleTotal={handleTotal}
          setContactObj={setContactObj}
          handleItemList={handleItemList}
          customerFromCustomer={state?.customerDetail}
          url={
            estimateDetails
              ? url
              : state?.customerDetail
              ? `${INVOICE_CREATE}?customer_id=${state?.customerDetail?.id}`
              : INVOICE_CREATE
          }
          discount_level={estimateDetails?.discount_level || ""}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default CreateInvoice;
