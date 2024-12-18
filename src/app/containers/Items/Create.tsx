/** @format */

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemForm } from "./ItemForm";
import { endpoints } from "static";
import { CreateItemProps } from "./Types";
import { WarehouseProps } from "../Sales/Types";
import { AccessDenied, Toast } from "app/shared";
import { SpinnerX } from "app/shared/PageLoader";
import { useAxios, usePermissions } from "app/Hooks";
import { removeNewlines } from "app/shared/RemoveSpace";
import type { UploadFile } from "antd/es/upload/interface";
import { getStringValueFromSS, setKeyInSS, setSessionAndLocalObj } from "utils";

const { ITEMS: ITEM_URL, ITEMS_CREATE } = endpoints;

const CreateItem = ({ isModal = false, toggleItemModal, itemObj, setItemObj }: CreateItemProps) => {
  const navigate = useNavigate();
  const [tracked, setTracked] = useState(true);
  const { callAxios, toggle, bool } = useAxios();
  const [tax_type, setTaxType] = useState<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { checkPermission, fetchingRoles } = usePermissions();
  const [attachList, setAttachList] = useState<UploadFile[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseProps[]>([]);
  const { has_ItemCreate_permission } = checkPermission("ItemCreate");

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

  const handleTrackInventory = (track: boolean) => setTracked(track);
  const handleTaxType = (taxType: string | null) => setTaxType(taxType);
  const onSubmit = (values) => {
    // const warehousePayload = warehouses?.map((ware: WarehouseProps, index: number) => ({
    //   index: index,
    //   id: ware.id,
    //   opening_stock: ware.opening_stock || 0,
    // }));
    const description = removeNewlines(values?.description);
    const salesDescription = removeNewlines(values?.sales_description);
    const purchaseDescription = removeNewlines(values?.purchase_description);
    const notesDescription = removeNewlines(values?.notes);
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
      data.append("name", values.name);
      data.append("unit", values.unit);
      data.append("brand", values.brand);
      data.append("weight", values.weight);
      data.append("notes", notesDescription || "");
      data.append("tax_type", tax_type || null);
      data.append("dimensions", values.dimensions);
      data.append("manufacturer", values.manufacturer);
      data.append("category_id", values.category_id === undefined ? null : values.category_id);
      data.append(
        "vendor_id",
        values?.vendor_id !== undefined && values?.vendor_id !== null
          ? typeof values?.vendor_id === "object"
            ? values?.vendor_id?.id
            : values?.vendor_id
          : ""
      );
      data.append("description", description || "");
      data.append("reorder_level", values.reorder_level || 0);
      data.append("sales_unit_price", values.sales_unit_price || 0);
      data.append("type", values.type === "Inventory" ? "goods" : "");
      data.append("sales_description", salesDescription || "");
      data.append("purchase_unit_price", values.purchase_unit_price || 0);
      data.append("opening_stock_value", values.opening_stock_value || 0);
      data.append("inventory_type", tracked ? "inventory" : "noninventory");
      data.append("purchase_description", purchaseDescription || "");
      // data.append("purchase_unit_price", values.purchaseUnitPrice || 0);
      // values.salesUnitPrice && data.append('sales_unit_price', values.sales_unit_price || 0)
      //for (let { index, id, opening_stock } of warehouses) {
      data.append(`warehouses[0][id]`, warehouses[0].id as any);
      data.append(`warehouses[0][opening_stock]`, values.opening_stock);
      data.append(
        "tax_id",
        typeof values.tax_id === "object" ? values.tax_id?.id : values.tax_id || null
      );
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
      //}
      for (let [index, value] of Object.entries(fileList)) {
        if (currentIndex == (index as any)) {
          data.append("primary_index", currentIndex as any);
        }
        data.append(`upload_images[${index}]`, value as any);
      }
      for (let [index, value] of Object.entries(attachList)) {
        data.append(`attachments[${index}]`, value.originFileObj as any);
      }

      toggle();
      callAxios({
        method: "post",
        url: ITEM_URL,
        data,
      }).then(async (res) => {
        if (res) {
          Toast({ message: res.message });
          if (!isModal) {
            setSessionAndLocalObj(res?.data?.id, true, "/items");
            const dataFromLS: any = getStringValueFromSS("params");
            const params = {
              ...dataFromLS,
              sort: "desc",
              sort_column: "created_at",
              type: "",
              status: "",
              filter: "",
              category_id: "",
            };
            await setKeyInSS("params", params);
            navigate(-1);
          } else {
            toggleItemModal?.();
            setItemObj({ ...itemObj, ...res?.data, value: res?.data?.id, label: res?.data?.name });
          }
        }
      });
    }
  };

  if (fetchingRoles) return <SpinnerX />;
  return (
    <>
      {has_ItemCreate_permission ? (
        <ItemForm
          create
          loading={bool}
          isModal={isModal}
          tracked={tracked}
          url={ITEMS_CREATE}
          fileList={fileList}
          onSubmit={onSubmit}
          attachList={attachList}
          setFileList={setFileList}
          currentIndex={currentIndex}
          setAttachList={setAttachList}
          handleTaxType={handleTaxType}
          handleFileList={handleFileList}
          handleImageList={handleImageList}
          setCurrentIndex={setCurrentIndex}
          toggleItemModal={toggleItemModal}
          handleTrackInventory={handleTrackInventory}
          handleWareshouseList={handleWareshouseList}
          handleImageAttachList={handleImageAttachList}
          tooltipOverlayClass={`${isModal ? "overlay--fix" : ""}`}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CreateItem;
