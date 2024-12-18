/** @format */

import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { endpoints } from "static";
import { ItemForm } from "../ItemForm";
import { AccessDenied, Toast } from "app/shared";
import { WarehouseProps } from "../../Sales/Types";
import { Images, Upload_Images } from "../Types";
import { useAxios, usePermissions } from "app/Hooks";
import type { UploadFile } from "antd/es/upload/interface";
import { getStringValueFromLS, setSessionAndLocalObj, setValueInLS } from "utils";

const { ITEMS: ITEM_URL } = endpoints;

const CloneItems = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clone_id = searchParams.get("id");
  const { checkPermission } = usePermissions();
  const [tracked, setTracked] = useState(false);
  const { callAxios, toggle, bool } = useAxios();
  const [tax_type, setTaxType] = useState<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [attachList, setAttachList] = useState<UploadFile[]>([]);
  const { has_ItemCreate_permission } = checkPermission("ItemCreate");
  const [warehouses, setWarehouses] = useState<WarehouseProps[]>([]);

  const handleTaxType = (taxType: string | null) => setTaxType(taxType);
  const handleTrackInventory = (track: boolean) => setTracked(track);

  const handleImageList = useCallback((images: UploadFile[]) => {
    setFileList(images);
  }, []);

  const handleFileList = useCallback((file: UploadFile[]) => setFileList(file), []);

  const handleImageAttachList = useCallback((images: UploadFile[]) => {
    setAttachList(images);
  }, []);

  const handleWareshouseList = useCallback((wareshouse: WarehouseProps[]) => {
    setWarehouses(wareshouse);
  }, []);

  const onSubmit = (values) => {
    const images: Images[] = [];
    const upload_images: Upload_Images[] = [];
    fileList.forEach((file: any) => {
      if (file.old_image) images.push(file.name);
      else upload_images.push(file);
    });
    const attachments: Upload_Images[] = [];
    const clone_attachments: Upload_Images[] = [];
    attachList.forEach((file: any) => {
      !file.old_image ? attachments.push(file.originFileObj) : clone_attachments.push(file);
    });

    if (values.opening_stock > 0 && values.opening_stock_value <= 0)
      Toast({ message: "Opening stock value field is required", type: "info" });
    else if (values.opening_stock <= 0 && values.opening_stock_value > 0)
      Toast({ message: "Initial quantity on hand field is required", type: "info" });
    else {
      let data = new FormData();
      data.append("sku", values.sku);
      data.append("upc", values.upc);
      data.append("mpn", values.mpn);
      data.append("ean", values.ean);
      data.append("isbn", values.isbn);
      data.append("is_cloned", "true");
      data.append("unit", values.unit);
      data.append("name", values.name);
      data.append("brand", values.brand);
      data.append("weight", values.weight);
      data.append("clone_status", 1 as any);
      data.append("notes", values.notes || "");
      data.append("tax_type", tax_type || null);
      data.append("dimensions", values.dimensions);
      data.append("tax_id", values.tax_id || null);
      data.append("category_id", values.category_id);
      data.append(
        "vendor_id",
        values?.vendor_id !== undefined && values?.vendor_id !== null
          ? typeof values?.vendor_id === "object"
            ? values?.vendor_id?.id
            : values?.vendor_id
          : ""
      );
      data.append("manufacturer", values.manufacturer);
      data.append("description", values.description || "");
      data.append("reorder_level", values.reorder_level || 0);
      data.append("sales_account_id", values.sales_account_id);
      data.append("sales_unit_price", values.sales_unit_price || 0);
      data.append("purchase_account_id", values.purchase_account_id);
      data.append("inventory_account_id", values.inventory_account_id);
      data.append("type", values.type === "Inventory" ? "goods" : "");
      data.append("sales_description", values.sales_description || "");
      data.append("purchase_unit_price", values.purchase_unit_price || 0);
      data.append("opening_stock_value", values.opening_stock_value || 0);
      data.append("purchase_description", values.purchase_description || "");

      data.append(`warehouses[0][id]`, warehouses[0].id as any);
      data.append(`warehouses[0][opening_stock]`, values.opening_stock || 0);
      data.append("inventory_type", tracked ? "inventory" : "noninventory");
      let findFile = fileList.find((_, i) => currentIndex == i);

      for (let [index, value] of Object.entries(upload_images)) {
        //@ts-ignore
        // let fileExistsInUploadImages = findFile.filter(
        //   //@ts-ignore
        //   (fileExist) => fileExist.name === value.name
        // );
        if (findFile.name === value.name) {
          data.append("primary_index", index as any);
        }
        data.append(`upload_images[${index}]`, value as any);
      }

      for (let [index, value] of Object.entries(images)) {
        //@ts-ignore
        if (findFile.name === value) {
          data.append("primary_url", value as any);
        }
        data.append(`images[${index}]`, value as any);
      }
      for (let [index, value] of Object.entries(attachments)) {
        data.append(`attachments[${index}]`, value as any);
      }
      for (let [index, value] of Object.entries(clone_attachments)) {
        data.append(`clone_attachments[${index}]`, JSON.stringify(value) as any);
      }

      toggle();
      callAxios({
        method: "post",
        url: ITEM_URL,
        data,
      }).then(async (res) => {
        if (res) {
          Toast({ message: res.message });
          setSessionAndLocalObj(res?.data?.id, true, "/items");
          const dataFromLS = getStringValueFromLS("params");
          const params = {
            ...dataFromLS,
            sort: "desc",
            sort_column: "created_at",
          };
          await setValueInLS("params", params);
          navigate(-1);
        }
      });
    }
  };
  return (
    <>
      {has_ItemCreate_permission ? (
        <ItemForm
          clone
          loading={bool}
          tracked={tracked}
          onSubmit={onSubmit}
          fileList={fileList}
          attachList={attachList}
          setFileList={setFileList}
          currentIndex={currentIndex}
          setAttachList={setAttachList}
          handleTaxType={handleTaxType}
          handleFileList={handleFileList}
          setCurrentIndex={setCurrentIndex}
          handleImageList={handleImageList}
          url={`${ITEM_URL}/${clone_id}/clone`}
          handleTrackInventory={handleTrackInventory}
          handleWareshouseList={handleWareshouseList}
          handleImageAttachList={handleImageAttachList}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CloneItems;
