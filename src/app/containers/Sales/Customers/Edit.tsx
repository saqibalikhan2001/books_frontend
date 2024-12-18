/** @format */
import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { UploadFile } from "antd/es/upload/interface";
import { endpoints } from "static";
import CustomerTab from "./CustomerTab";
import { Upload_Images } from "./Types";
import { AccessDenied, Toast } from "app/shared";
import { SpinnerX } from "app/shared/PageLoader";
import { useAxios, usePermissions } from "app/Hooks";
import { getStringValueFromLS, setValueInLS } from "utils";
import { removeNewlines } from "app/shared/RemoveSpace";

const { CUSTOMERS: CUSTOMERS_URL } = endpoints;

const EditCustomers = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customer_id = searchParams.get("id");
  const [currency, setCurrency] = useState([]);
  const { callAxios, toggle, bool } = useAxios();
  const { checkPermission, fetchingRoles } = usePermissions();
  const [customeroptions, setCustomerOptions] = useState([]);
  const [attachList, setAttachList] = useState<UploadFile[]>([]);
  const [deleteAttachments, setDeleteAttachments] = useState<any>([]);
  const { has_CustomerEdit_permission } = checkPermission("CustomerEdit");

  const handleImageAttachList = useCallback((images: UploadFile[]) => {
    setAttachList(images);
  }, []);

  const onSubmit = (values) => {
    const attachments: Upload_Images[] = [];
    attachList.forEach((file: any) => {
      !file.old_image ? attachments.push(file.originFileObj) : (null as any);
    });
    let data = new FormData();
    const note = removeNewlines(values?.note);

    const customername =
      typeof values?.display_name === "string"
        ? values?.display_name
        : values?.display_name >= 0 && values?.display_name < customeroptions.length
        ? //@ts-ignore
          customeroptions[values?.display_name]?.label
        : "";

    const res = {
      ...values,
      currency_id: "",
      isContactImageDeleted: false,
      display_name: customername,
    };
    for (const key in res) {
      if (key !== "same_as_billing") {
        data.append(key, res[key] || "");
      }
    }
    let is_photochange = !!values.photo?.path;
    data.append("contact_type_id", "2");
    data.append("note", note || "");
    data.append("currency_id", currency as any);
    data.append("updateOverAll", values?.updateOverAll);
    data.append("isPhotoChange", JSON.stringify(Boolean(is_photochange)));
    data.append("tax_exempt", JSON.stringify(Boolean(values.tax_exempt)));
    data.append("same_as_billing", JSON.stringify(values.same_as_billing || false));
    data.append(
      "ship_country_id",
      typeof values.ship_country_id === "object"
        ? values.ship_country_id?.id
        : values.ship_country_id || ""
    );
    data.append(
      "bill_country_id",
      typeof values.bill_country_id === "object"
        ? values.bill_country_id?.id
        : values.bill_country_id || ""
    );
    data.append(
      "payment_terms",
      typeof values.payment_terms === "object"
        ? values?.payment_terms?.id
        : values?.payment_terms ?? ""
    );
    data.append("isContactImageDeleted", JSON.stringify(!Boolean(values.photo)));
    if (deleteAttachments.length > 0) {
      data.append("is_attachment_deleted", JSON.stringify(Boolean(deleteAttachments.length > 0)));
    }
    for (let [index, value] of Object.entries(attachments)) {
      data.append(`attachments[${index}]`, value as any);
    }
    for (let [index, value] of Object.entries(deleteAttachments)) {
      data.append(`deleted_attachments[${index}]`, value as any);
    }
    toggle();
    callAxios({
      method: "post",
      url: `${CUSTOMERS_URL}/${customer_id}`,
      data,
    }).then(async (res) => {
      if (res) {
        Toast({ message: res.message });
        const dataFromLS = getStringValueFromLS("params");
        const params = {
          ...dataFromLS,
          page: 1,
          sort: "desc",
          sort_column: "updated_at",
        };
        await setValueInLS("params", params);
        navigate(-1);
      }
    });
  };
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {has_CustomerEdit_permission ? (
        <CustomerTab
          edit
          loading={bool}
          onSubmit={onSubmit}
          attachList={attachList}
          setCurrency={setCurrency}
          setAttachList={setAttachList}
          deleteAttachments={deleteAttachments}
          setDeleteAttachments={setDeleteAttachments}
          url={`${CUSTOMERS_URL}/${customer_id}/edit`}
          handleImageAttachList={handleImageAttachList}
          setCustomerOptions={setCustomerOptions}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default EditCustomers;