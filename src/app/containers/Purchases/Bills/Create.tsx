/** @format */

import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BillForm } from "./BillForm";
import { BillItemObjProps } from "./Types";
import { AccessDenied, Toast } from "app/shared";
import { usePermissions, useAxios } from "app/Hooks";
import { Content, endpoints, routeNames } from "static";
import {
  setKeyInLS,
  setKeyInSS,
  convertInNumber,
  getFullDateAndTime,
  getStringValueFromSS,
  setSessionAndLocalObj,
} from "utils";
import { SpinnerX } from "app/shared/PageLoader";
import { useGetPaymentTermsQuery } from "store/query/paymentTerm";

const { BILLS, ADD_BILLS } = routeNames;
const { BILLS: BILLS_URL, BILL_CREATE } = endpoints;

const CreateBill = ({ isModal = false }) => {
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [total, setTotal] = useState(0);
  const { callAxios, toggle, bool } = useAxios();
  const [contactObj, setContactObj] = useState<any>();
  const [item, setItem] = useState<BillItemObjProps[]>([]);
  const { data: terms = [] } = useGetPaymentTermsQuery("");
  const { checkPermission, fetchingRoles } = usePermissions();
  const { has_BillCreate_permission } = checkPermission("BillCreate");

  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: BillItemObjProps[]) => setItem(items), []);

  const handleListingParams = () => {
    const dataFromLS: any = getStringValueFromSS("params");
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
    setKeyInSS("params", params);
  };

  const onSubmit = ({ values }: any) => {
    if (!item.length) {
      Toast({ message: Content.select_item, type: "error" });
    } else {
      const itemObj = item.filter((data) => data.id !== null);
      const newItem = itemObj.map((item: any) => ({
        ...item,
        amount: 0,
        item_obj: null,
      }));
      const new_values = {
        ...values,
        total: total,
        items: newItem,
        vendor_id: contactObj.id,
        discount_level: "transaction",
        adjustment: convertInNumber(values?.adjustment),
        due_date: getFullDateAndTime(values.due_date),
        bill_date: getFullDateAndTime(values.bill_date),
        bill_terms:
          typeof values?.bill_terms !== "object"
            ? terms.find((val: { id: any }) => val.id === values?.bill_terms) || {}
            : values.bill_terms,
        status: values?.saveAs === "open" ? "open" : "draft",
        discount_type: values.transaction_level_discount_type,
        discount_transaction_level: values.discount_transaction_level,
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
          if (values?.saveAs === "email" && !isModal) {
            setKeyInLS("email", true);
            setKeyInLS("print", false);
            setSessionAndLocalObj(res?.data?.id, true, "bills");
            await handleListingParams();
            navigate(BILLS);
          } else if (values?.saveAs === "print" && !isModal) {
            setKeyInLS("print", true);
            setKeyInLS("email", false);
            setSessionAndLocalObj(res?.data?.id, true, "bills");
            await handleListingParams();
            navigate(BILLS);
          } else if (values?.saveAs === "new" && !isModal) {
            setSessionAndLocalObj(res?.data?.id, true, "bills");
            await handleListingParams();
            setKeyInLS("print", false);
            navigate(ADD_BILLS);
          } else {
            setSessionAndLocalObj(res?.data?.id, true, "bills");
            setKeyInLS("print", false);
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
          create
          items={item}
          loading={bool}
          url={BILL_CREATE}
          onSubmit={onSubmit}
          contactObj={contactObj}
          handleTotal={handleTotal}
          setContactObj={setContactObj}
          handleItemList={handleItemList}
          supplierFromSupplier={state?.customerDetail}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CreateBill;
