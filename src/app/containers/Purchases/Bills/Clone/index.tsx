/** @format */

import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AccessDenied, Toast } from "app/shared";
import { usePermissions, useAxios } from "app/Hooks";
import { Content, endpoints, routeNames } from "static";
import {
  setKeyInLS,
  setValueInLS,
  convertInNumber,
  getFullDateAndTime,
  getStringValueFromLS,
  setSessionAndLocalObj,
} from "utils";
import { BillForm } from "../BillForm";
import { BillItemObjProps } from "../Types";
import { SpinnerX } from "app/shared/PageLoader";
import { useGetPaymentTermsQuery } from "store/query/paymentTerm";

const { BILLS: BILLS_URL } = endpoints;
const { BILLS, ADD_BILLS } = routeNames;

const CreateBill = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();
  const bill_id = searchParams.get("id");
  const { callAxios, toggle, bool } = useAxios();
  const [contactObj, setContactObj] = useState<any>();
  const [item, setItem] = useState<BillItemObjProps[]>([]);
  const { data: terms = [] } = useGetPaymentTermsQuery("");
  const { checkPermission, fetchingRoles } = usePermissions();
  const { has_BillCreate_permission } = checkPermission("BillCreate");

  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: BillItemObjProps[]) => setItem(items), []);

  const handleListingParams = () => {
    const dataFromLS = getStringValueFromLS("params");
    const params = {
      ...dataFromLS,
      search: "",
      filter: "",
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
        is_cloned: true,
        cloned_id: bill_id,
        vendor_id: contactObj.id,
        adjustment: convertInNumber(values?.adjustment),
        due_date: getFullDateAndTime(values.due_date),
        bill_date: getFullDateAndTime(values.bill_date),
        discount_level: "transaction",
        status: values?.saveAs === "open" ? "open" : "draft",
        discount_type: values.transaction_level_discount_type,
        discount_transaction_level: values.discount_transaction_level,
        bill_terms:
          typeof values?.bill_terms !== "object"
            ? terms.find((val: { id: any }) => val.id === values?.bill_terms) || {}
            : values.bill_terms,
      };
      toggle();
      callAxios({
        method: "post",
        url: BILLS_URL,
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
            navigate(BILLS);
          } else if (values?.saveAs === "print") {
            setKeyInLS("print", true);
            setKeyInLS("email", false);
            setSessionAndLocalObj(res?.data?.id, true, "bills");
            await handleListingParams();
            navigate(BILLS);
          } else if (values?.saveAs === "new") {
            setSessionAndLocalObj(res?.data?.id, true, "bills");
            await handleListingParams();
            navigate(ADD_BILLS);
          } else {
            setSessionAndLocalObj(res?.data?.id, true, "bills");
            await handleListingParams();
            navigate(BILLS);
          }
        }
      });
    }
  };
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {has_BillCreate_permission ? (
        <BillForm
          items={item}
          loading={bool}
          onSubmit={onSubmit}
          contactObj={contactObj}
          handleTotal={handleTotal}
          setContactObj={setContactObj}
          handleItemList={handleItemList}
          url={`${BILLS_URL}/${bill_id}/clone`}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CreateBill;
