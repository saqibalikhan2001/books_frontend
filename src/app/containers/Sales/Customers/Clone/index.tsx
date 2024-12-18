/** @format */

import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { UploadFile } from "antd/es/upload/interface";
import CustomerTab from "../CustomerTab";
import { Upload_Images } from "../Types";
import { endpoints, routeNames } from "static";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, usePermissions } from "app/Hooks";

const { CUSTOMERS } = routeNames;
const { CUSTOMERS: CUSTOMERS_URL } = endpoints;

const CloneCustomers = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clone_id = searchParams.get("id");
  const [currency, setCurrency] = useState([]);
  const { checkPermission } = usePermissions();
  const { callAxios, toggle, bool } = useAxios();
  const [customeroptions, setCustomerOptions] = useState([]);
  const [attachList, setAttachList] = useState<UploadFile[]>([]);
  const [deleteAttachments, setDeleteAttachments] = useState<any>([]);
  const { has_CustomerCreate_permission } = checkPermission("CustomerCreate");

  const handleImageAttachList = useCallback((images: UploadFile[]) => {
    setAttachList(images);
  }, []);

  const onSubmit = (values) => {
    let res = {};
    const attachments: Upload_Images[] = [];
    const clone_attachments: Upload_Images[] = [];
    attachList.forEach((file: any) => {
      !file.old_image ? attachments.push(file.originFileObj) : clone_attachments.push(file);
    });

    const customername =
      typeof values?.display_name === "string"
        ? values?.display_name
        : values?.display_name >= 0 && values?.display_name < customeroptions.length
        ? //@ts-ignore
          customeroptions[values?.display_name]?.label
        : "";
    let data = new FormData();

    typeof values.photo === "object"
      ? (res = {
          ...values,
          display_name: customername,
        })
      : (res = {
          ...values,
          photo: "",
          cloneUrl: values.photo,
          display_name: customername,
        });

    for (const key in res) {
      data.append(key, res[key] || "");
    }
    data.append("contact_type_id", "2");
    data.append("is_cloned", "true");
    data.append("currency_id", currency as any);
    data.append("tax_exempt", JSON.stringify(Boolean(values.tax_exempt)));
    data.append("same_as_billing", JSON.stringify(values.same_as_billing));
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
    if (deleteAttachments.length > 0) {
      data.append("is_attachment_deleted", JSON.stringify(Boolean(deleteAttachments.length > 0)));
    }
    for (let [index, value] of Object.entries(attachments)) {
      data.append(`attachments[${index}]`, value as any);
    }
    for (let [index, value] of Object.entries(deleteAttachments)) {
      data.append(`deleted_attachments[${index}]`, value as any);
    }
    for (let [index, value] of Object.entries(clone_attachments)) {
      data.append(`clone_attachments[${index}]`, JSON.stringify(value) as any);
    }

    toggle();
    callAxios({
      method: "post",
      url: `${CUSTOMERS_URL}`,
      data,
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        navigate(CUSTOMERS);
      }
    });
  };

  return (
    <>
      {has_CustomerCreate_permission ? (
        <CustomerTab
          edit
          clone
          loading={bool}
          onSubmit={onSubmit}
          attachList={attachList}
          setCurrency={setCurrency}
          setAttachList={setAttachList}
          deleteAttachments={deleteAttachments}
          setCustomerOptions={setCustomerOptions}
          url={`${CUSTOMERS_URL}/${clone_id}/clone`}
          setDeleteAttachments={setDeleteAttachments}
          handleImageAttachList={handleImageAttachList}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CloneCustomers;
