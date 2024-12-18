/**@format */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { UploadFile } from "antd/es/upload/interface";
import { endpoints } from "static";
import CustomerTab from "./CustomerTab";
import { AccessDenied, Toast } from "app/shared";
import { SpinnerX } from "app/shared/PageLoader";
import { useAxios, usePermissions } from "app/Hooks";
import { CreateCustomerTypes } from "app/shared/types";
import { removeNewlines } from "app/shared/RemoveSpace";
import { setKeyInSS, getStringValueFromSS, setSessionAndLocalObj } from "utils";

const { CUSTOMERS: CUSTOMERS_URL, CREATE } = endpoints;

const CreateCustomer = ({
  isModal = false,
  setIsCustomerId,
  isCustomerModalOpen,
  setIsCustomerModalOpen,
}: CreateCustomerTypes) => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState([]);
  const { callAxios, toggle, bool } = useAxios();
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [customeroptions, setCustomerOptions] = useState([]);
  const { checkPermission, fetchingRoles } = usePermissions();
  const [attachList, setAttachList] = useState<UploadFile[]>([]);
  const { has_CustomerCreate_permission } = checkPermission("CustomerCreate");

  // const handleFileList = useCallback((file: UploadFile[]) => setFileList(file), []);

  const handleImageAttachList = useCallback((images: UploadFile[]) => {
    setAttachList(images);
  }, []);

  const onSubmit = (values) => {
    let data = new FormData();
    const note = removeNewlines(values?.note);

    const customername =
      values?.display_name >= 0 && values?.display_name < customeroptions.length
        ? //@ts-ignore
          customeroptions[values?.display_name]?.label
        : "";

    data.append("photo", values?.photo === null ? "" : values?.photo);
    data.append("salutation", values?.salutation || "");
    data.append("first_name", values?.first_name);
    data.append("last_name", values?.last_name);
    data.append("company_name", values?.company_name);
    data.append("display_name", customername);
    data.append("department", values?.department || "");
    data.append("designation", values?.designation || "");
    data.append("license_no", values?.license_no || "");
    data.append("email", values?.email);
    data.append("language", values?.language);
    data.append("work_phone", values?.work_phone || "");
    data.append("work_phone_secondary", values?.work_phone_secondary || "");
    data.append("mobile", values?.mobile);
    data.append("mobile_secondary", values?.mobile_secondary || "");
    data.append("other_contacts", values?.other_contacts || "");
    data.append("website", values?.website || "");
    data.append("facebook", values?.facebook);
    data.append("twitter", values?.twitter);
    data.append("skype", values?.skype);
    data.append("instagram", values?.instagram);
    data.append("bill_attention", values?.bill_attention || "");
    data.append("bill_phone", values?.bill_phone || "");
    data.append("bill_street", values?.bill_street || "");
    data.append("bill_street_2", values?.bill_street_2 || "");
    data.append("bill_city", values?.bill_city || "");
    data.append("bill_state", values?.bill_state || "");
    data.append("bill_zip_code", values?.bill_zip_code || "");
    data.append(
      "bill_country_id",
      typeof values.bill_country_id === "object"
        ? values.bill_country_id?.id
        : values.bill_country_id || ""
    );
    data.append("bill_fax", values?.bill_fax || "");
    data.append("same_as_billing", values?.same_as_billing || false);
    data.append("note", note || "");
    data.append("payment_mode_id", values?.payment_mode_id || "");
    data.append(
      "payment_terms",
      typeof values.payment_terms === "object"
        ? values?.payment_terms?.id
        : values?.payment_terms ?? ""
    );
    data.append("account_no", values?.account_no || "");
    data.append("tax_exempt", values?.tax_exempt || "");
    data.append("reason_exemption", values?.reason_exemption || "");
    data.append("exemption_details", values?.exemption_details || "");
    data.append("tax_rate", values?.tax_rate || "");
    data.append("opening_balance", values?.opening_balance || "");
    data.append("as_of_date", values?.as_of_date || "");
    data.append("ship_attention", values?.ship_attention || "");
    data.append("ship_phone", values?.ship_phone || "");
    data.append("ship_street", values?.ship_street || "");
    data.append("ship_street_2", values?.ship_street_2 || "");
    data.append("ship_city", values?.ship_city || "");
    data.append("ship_state", values?.ship_state || "");
    data.append("ship_zip_code", values?.ship_zip_code || "");
    data.append(
      "ship_country_id",
      typeof values.ship_country_id === "object"
        ? values.ship_country_id?.id
        : values.ship_country_id || ""
    );
    data.append("ship_fax", values?.ship_fax || "");

    data.append("contact_type_id", "2");
    data.append("currency_id", currency as any);
    data.append("tax_exempt", JSON.stringify(Boolean(values.tax_exempt)));
    // data.append("same_as_billing", JSON.stringify(values.same_as_billing));
    data.append("isContactImageDeleted", JSON.stringify(!Boolean(values.photo)));

    for (let [index, value] of Object.entries(attachList)) {
      data.append(`attachments[${index}]`, value.originFileObj as any);
    }

    toggle();
    callAxios({
      method: "post",
      url: CUSTOMERS_URL,
      data,
    }).then(async (res) => {
      if (res) {
        Toast({ message: res.message });
        if (!isModal) {
          setSessionAndLocalObj(res?.data?.id, true, "customers");
          const dataFromLS: any = getStringValueFromSS("params");
          const params = {
            ...dataFromLS,
            page: 1,
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
      {has_CustomerCreate_permission ? (
        <CustomerTab
          create
          loading={bool}
          isModal={isModal}
          onSubmit={onSubmit}
          attachList={attachList}
          setCurrency={setCurrency}
          setAttachList={setAttachList}
          // handleFileList={handleFileList}
          // setCurrentIndex={setCurrentIndex}
          url={`${CUSTOMERS_URL}${CREATE}`}
          isCustomerModalOpen={isCustomerModalOpen}
          setIsCustomerModalOpen={setIsCustomerModalOpen}
          handleImageAttachList={handleImageAttachList}
          setCustomerOptions={setCustomerOptions}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CreateCustomer;
