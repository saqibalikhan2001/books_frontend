/**@format */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { UploadFile } from "antd/es/upload/interface";
import { endpoints } from "static";
import { AccessDenied, Toast } from "app/shared";
import CustomerTab from "../Customers/CustomerTab";
import { useAxios, usePermissions } from "app/Hooks";
import { setKeyInSS, getStringValueFromSS, setSessionAndLocalObj } from "utils";
import { SpinnerX } from "app/shared/PageLoader";
import { removeNewlines } from "app/shared/RemoveSpace";

const { SUPPLIERS, CREATE } = endpoints;

const CreateSupplier = ({
  isModal = false,
  setIsCustomerId,
  isCustomerModalOpen,
  setIsCustomerModalOpen,
}: any) => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState([]);
  const { callAxios, toggle, bool } = useAxios();
  const [customeroptions, setCustomerOptions] = useState([]);
  const { checkPermission, fetchingRoles } = usePermissions();
  const [attachList, setAttachList] = useState<UploadFile[]>([]);
  const { has_SupplierCreate_permission } = checkPermission("SupplierCreate");

  const handleImageAttachList = useCallback((images: UploadFile[]) => {
    setAttachList(images);
  }, []);

  const onSubmit = (values) => {
    const note = removeNewlines(values?.note);

    const customername =
      values?.display_name >= 0 && values?.display_name < customeroptions.length
        ? //@ts-ignore
          customeroptions[values?.display_name]?.label
        : "";
    let data = new FormData();
    const res = {
      ...values,
    };

    for (const key in res) {
      if (key !== "same_as_billing") {
        data.append(key, res[key] || "");
      }
    }
    data.append("display_name", customername);
    data.append("salutation", values?.salutation || "");
    data.append("note", note || "");
    data.append("contact_type_id", "1");
    data.append("currency_id", currency as any);
    data.append("tax_exempt", JSON.stringify(Boolean(values.tax_exempt)));
    data.append("same_as_billing", JSON.stringify(values.same_as_billing || false));
    data.append("isContactImageDeleted", JSON.stringify(!Boolean(values.photo)));
    data.append(
      "bill_country_id",
      typeof values.bill_country_id === "object"
        ? values.bill_country_id?.id
        : values.bill_country_id || ""
    );
    data.append(
      "ship_country_id",
      typeof values.ship_country_id === "object"
        ? values.ship_country_id?.id
        : values.ship_country_id || ""
    );
    data.append(
      "payment_terms",
      typeof values.payment_terms === "object"
        ? values?.payment_terms?.id
        : values?.payment_terms ?? ""
    );

    for (let [index, value] of Object.entries(attachList)) {
      data.append(`attachments[${index}]`, value.originFileObj as any);
    }

    toggle();
    callAxios({
      method: "post",
      url: SUPPLIERS,
      data,
    }).then(async (res) => {
      if (res) {
        Toast({ message: res.message });
        if (!isModal) {
          setSessionAndLocalObj(res?.data?.id, true, "/suppliers");
          const dataFromLS: any = getStringValueFromSS("params");
          const params = {
            ...dataFromLS,
            sort: "desc",
            sort_column: "created_at",
            filter: "",
            end_range: "",
            start_range: "",
            current_balance: "",
            searchByAlphabet: "",
          };
          await setKeyInSS("params", params);
          navigate(-1);
        } else {
          setIsCustomerModalOpen(false);
          setIsCustomerId(res?.data);
        }
      }
    });
  };
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {has_SupplierCreate_permission ? (
        <CustomerTab
          create
          supplier
          loading={bool}
          isModal={isModal}
          onSubmit={onSubmit}
          attachList={attachList}
          setCurrency={setCurrency}
          setAttachList={setAttachList}
          url={`${SUPPLIERS}${CREATE}`}
          setCustomerOptions={setCustomerOptions}
          isCustomerModalOpen={isCustomerModalOpen}
          handleImageAttachList={handleImageAttachList}
          setIsCustomerModalOpen={setIsCustomerModalOpen}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CreateSupplier;
