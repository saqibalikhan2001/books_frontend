/** @format */

import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Content, endpoints } from "static";
import { BillForm } from "./BillForm";
import {
  setKeyInLS,
  setValueInLS,
  getFullDateAndTime,
  getStringValueFromLS,
  setSessionAndLocalObj,
  convertInNumber,
} from "utils";
import { BillItemObjProps } from "./Types";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, usePermissions } from "app/Hooks";
// import { useGetInvoiceTermsListQuery } from "store/query/invoice";
import { SpinnerX } from "app/shared/PageLoader";
import { useGetPaymentTermsQuery } from "store/query/paymentTerm";

const { BILLS: BILLS_URL } = endpoints;

const EditBills = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bill_id = searchParams.get("id");
  const { checkPermission, fetchingRoles } = usePermissions();
  const { callAxios, toggle, bool } = useAxios();
  const { has_BillEdit_permission } = checkPermission("BillEdit");

  const [total, setTotal] = useState(0);
  const [contactObj, setContactObj] = useState<any>();
  const [item, setItem] = useState<BillItemObjProps[]>([]);
  const { data: terms = [] } = useGetPaymentTermsQuery("");

  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: BillItemObjProps[]) => setItem(items), []);

  const handleListingParams = () => {
    const dataFromLS = getStringValueFromLS("params");
    const params = {
      ...dataFromLS,
      filter: "",
      search: "",
      sort: "desc",
      end_range: "",
      contactId: "",
      date_range: "",
      start_range: "",
      sort_column: "created_at",
    };
    setValueInLS("params", params);
  };
  const onSubmit = ({ values }: any) => {
    if (!item.length) {
      Toast({ message: Content.select_item, type: "error" });
    } else {
      const itemObj = item.filter((data) => data.id !== null);
      const newItem = itemObj.map((item: any) => ({
        ...item,
        item_obj: null,
        amount: 0,
      }));
      const new_values = {
        ...values,
        total: total,
        items: newItem,
        vendor_id: contactObj.id,
        adjustment: convertInNumber(values?.adjustment),
        due_date: getFullDateAndTime(values.due_date),
        bill_date: getFullDateAndTime(values.bill_date),
        discount_level: "transaction",
        discount_type: values.transaction_level_discount_type,
        discount_transaction_level: values.discount_transaction_level,
        status: values?.saveAs === "open" ? "open" : "draft",
        bill_terms:
          typeof values?.bill_terms !== "object"
            ? terms.find((val: { id: any }) => val.id === values?.bill_terms) || {}
            : values.bill_terms,
      };
      toggle();
      callAxios({
        method: "put",
        url: `${BILLS_URL}/${bill_id}`,
        data: new_values,
      }).then(async (res) => {
        if (res) {
          Toast({ message: res.message });
          toggle();
          if (values?.saveAs === "email") {
            setKeyInLS("email", true);
            setKeyInLS("print", false);
            setSessionAndLocalObj(res?.data?.id, true, "bills");
            await handleListingParams();
            navigate(-1);
          } else if (values?.saveAs === "print") {
            setKeyInLS("print", true);
            setKeyInLS("email", false);
            setSessionAndLocalObj(res?.data?.id, true, "bills");
            await handleListingParams();
            navigate(-1);
          } else {
            setSessionAndLocalObj(res?.data?.id, true, "bills");
            await handleListingParams();
            navigate(-1);
          }
        }
      });
    }
  };
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {has_BillEdit_permission ? (
        <BillForm
          edit
          items={item}
          loading={bool}
          onSubmit={onSubmit}
          contactObj={contactObj}
          handleTotal={handleTotal}
          setContactObj={setContactObj}
          handleItemList={handleItemList}
          url={`${BILLS_URL}/${bill_id}/edit`}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default EditBills;
