/** @format */

import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { endpoints } from "static";
import { ItemForm } from "./ItemForm";
import { WarehouseProps } from "../Sales/Types";
import { AccessDenied, Toast } from "app/shared";
import { Images, Upload_Images } from "./Types";
import { SpinnerX } from "app/shared/PageLoader";
import { useAxios, usePermissions } from "app/Hooks";
import { removeNewlines } from "app/shared/RemoveSpace";
import type { UploadFile } from "antd/es/upload/interface";

const { ITEMS: ITEM_URL } = endpoints;

const EditItems = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const item_id = searchParams.get("id");
  const [tracked, setTracked] = useState(false);
  const { callAxios, toggle, bool } = useAxios();
  const [tax_type, setTaxType] = useState<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { checkPermission, fetchingRoles } = usePermissions();
  const [attachList, setAttachList] = useState<UploadFile[]>([]);
  const { has_ItemEdit_permission } = checkPermission("ItemEdit");
  const [warehouses, setWarehouses] = useState<WarehouseProps[]>([]);
  const [deleteAttachments, setDeleteAttachments] = useState<any>([]);

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
    attachList.forEach((file: any) => {
      !file.old_image ? attachments.push(file.originFileObj) : (null as any);
    });
    // const warehousePayload = warehouses.map((ware: WarehouseProps, index: number) => ({
    //   index: index,
    //   id: ware.id,
    //   opening_stock: ware?.opening_stock || 0,
    // }));
    const description = removeNewlines(values?.description);
    const salesDescription = removeNewlines(values?.sales_description);
    const purchaseDescription = removeNewlines(values?.purchase_description);
    const notesDescription = removeNewlines(values?.notes);
    if (values.opening_stock > 0 && values.opening_stock_value <= 0)
      Toast({ message: "Opening stock value is required", type: "info" });
    else if (values.opening_stock <= 0 && values.opening_stock_value > 0)
      Toast({ message: "Initial quantity on hand field is required", type: "info" });
    else {
      let data = new FormData();
      data.append("name", values.name);
      data.append("sku", values.sku);
      data.append("upc", values.upc);
      data.append("mpn", values.mpn);
      data.append("ean", values.ean);
      data.append("isbn", values.isbn);
      data.append("unit", values.unit);
      data.append("brand", values.brand);
      data.append("weight", values.weight);
      data.append("notes", notesDescription || "");
      data.append("tax_type", tax_type || null);
      data.append("dimensions", values.dimensions);
      data.append(
        "tax_id",
        typeof values.tax_id === "object" ? values.tax_id?.id ?? null : values.tax_id || null
      );
      data.append("dimensions", values.dimensions);
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
      data.append("description", description || "");
      data.append("reorder_level", values.reorder_level || 0);
      data.append("sales_unit_price", values.sales_unit_price || 0);
      data.append("type", values.type === "Inventory" ? "goods" : "");
      data.append("sales_description", salesDescription || "");
      data.append("purchase_unit_price", values.purchase_unit_price || 0);
      data.append("opening_stock_value", values.opening_stock_value || 0);
      data.append("purchase_description", purchaseDescription || "");
      data.append(
        "sales_account_id",
        typeof values.sales_account_id === "object"
          ? values.sales_account_id?.id
          : values.sales_account_id
      );
      data.append(
        "purchase_account_id",
        typeof values.purchase_account_id === "object"
          ? values.purchase_account_id?.id
          : values.purchase_account_id
      );

      data.append(
        "inventory_account_id",
        typeof values.inventory_account_id === "object"
          ? values.inventory_account_id?.id
          : values.inventory_account_id
      );
      if (deleteAttachments.length > 0) {
        data.append("is_attachment_deleted", JSON.stringify(Boolean(deleteAttachments.length > 0)));
      }
      let findFile = fileList.find((_, i) => currentIndex == i);
      // for (let { index, id, opening_stock } of warehousePayload) {
      data.append(`warehouses[0][id]`, warehouses[0].id as any);
      data.append(`warehouses[0][opening_stock]`, values.opening_stock || 0);
      // }
      data.append("inventory_type", tracked ? "inventory" : "noninventory");

      for (let [index, value] of Object.entries(upload_images)) {
        //@ts-ignore
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
      for (let [index, value] of Object.entries(deleteAttachments)) {
        data.append(`deleted_attachments[${index}]`, value as any);
      }
      toggle();
      callAxios({
        method: "post",
        url: `${ITEM_URL}/${item_id}`,
        data,
      }).then((res: any) => {
        if (res) {
          Toast({ message: res.message });
          navigate(-1);
        }
      });
    }
  };
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {has_ItemEdit_permission ? (
        <ItemForm
          edit
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
          handleImageList={handleImageList}
          setCurrentIndex={setCurrentIndex}
          url={`${ITEM_URL}/${item_id}/edit`}
          deleteAttachments={deleteAttachments}
          setDeleteAttachments={setDeleteAttachments}
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
export default EditItems;
