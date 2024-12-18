/** @format */

import { useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Image, Input, Modal, Popover, Space, Typography, Upload } from "antd";
import type { InputRef } from "antd";
import type { UploadProps } from "antd/es/upload";
import {
  useAxios,
  useBool,
  useCreateFormApi,
  usePermissions,
  useSharedOrganization,
  useStore,
} from "app/Hooks";
import {
  Toast,
  Buttonx,
  Selectx,
  InputField,
  Breadcrumbx,
  UploadImage,
  InputNumberX,
  AutoCompletex,
} from "app/shared";
import { SkuForm } from "./SkuForm";
import { ItemFormProps } from "./Types";
import { ImageCrop } from "./ImageCrop";
import { ImagePath, isCsvOrExcelFile, rules } from "utils";
import { TooltipX } from "app/shared/ToolTip";
import { useNavigate } from "react-router-dom";
import { CreateTax } from "../Settings/Tax/Create";
import { CreateAccount } from "../chartOfAccounts/Create";
import { Content, Labels, endpoints, routeNames } from "static";
import { CreateSupplier } from "app/containers";

import {
  MAX_FILE_SIZE,
  attachementAllowedFormats,
  attachmentTypeToastMessage,
} from "app/shared/AllowedFormats";
import { SpinnerX } from "app/shared/PageLoader";
import { CreateCategory } from "./Categories/Create";

const { ITEMS } = routeNames;
const { GET_SKU } = endpoints;

const options = [
  {
    id: "Inventory",
    label: "Inventory",
  },
];

const initialState = {
  sku: "",
  upc: "",
  ean: "",
  mpn: "",
  isbn: "",
  unit: "",
  name: "",
  notes: "",
  brand: "",
  weight: "",
  dimensions: "",
  description: "",
  reorder_level: 0,
  opening_stock: 0,
  vendor_id: null,
  manufacturer: "",
  category_id: null,
  type: "Inventory",
  upload_images: "",
  sales_unit_price: 0,
  sales_description: "",
  sales_account_id: null,
  opening_stock_value: 0,
  purchase_unit_price: 0,
  purchase_description: "",
  purchase_account_id: null,
};

export const ItemForm = ({
  url,
  edit,
  clone,
  create,
  loading,
  onSubmit,
  fileList,
  setFileList,
  currentIndex,
  // handleTaxType,
  setAttachList,
  handleFileList,
  isModal = false,
  setCurrentIndex,
  attachList = [],
  toggleItemModal,
  handleImageList,
  deleteAttachments,
  tooltipOverlayClass,
  handleWareshouseList,
  handleTrackInventory,
  setDeleteAttachments,
  handleImageAttachList,
}: ItemFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const { created_by_platform } = useStore();
  const [taxObj, setTaxObj] = useState<any>();
  const [setting, setSetting] = useState<any>("");
  const [taxModal, setTaxModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const { getCurrentModule } = useSharedOrganization();
  const [isSupplierId, setIsSupplierId] = useState<any>();
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const [popoverVisible, setPopoverVisible] = useState(false);
  const { status = true } = getCurrentModule("item") || {};
  const { bool: sku_bool, toggle: sku_toggle } = useBool(false);
  const { checkPermission } = usePermissions();
  const { has_AccountsCreate_permission } = checkPermission("AccountsCreate");
  const { has_TaxCreate_permission } = checkPermission("TaxCreate");
  const toggleSupplierModal = () => setIsSupplierModalOpen(!isSupplierModalOpen);
  const unitRef = useRef<any>(null);
  const skuRef = useRef<InputRef>(null);
  const nameRef = useRef<InputRef>(null);

  const {
    taxList,
    itemUnits,
    warehouses,
    formLoading,
    base_currency,
    income_account,
    expense_account,
    details: current,
    inventory_account,
  } = useCreateFormApi(url);

  const unit = Form.useWatch("unit", form);
  const image = Form.useWatch("upload_images", form);
  const opening_stock = Form.useWatch("opening_stock", form);
  const reorder_level = Form.useWatch("reorder_level", form);
  const sales_unit_price = Form.useWatch("sales_unit_price", form);
  const purchase_unit_price = Form.useWatch("purchase_unit_price", form);
  const opening_stock_value = Form.useWatch("opening_stock_value", form);
  useEffect(() => {
    if (isSupplierId) {
      const obj = { ...isSupplierId, value: isSupplierId?.id, label: isSupplierId?.display_name };
      form.setFieldValue("vendor_id", obj);
      current?.vendors.push(obj);
    }
  }, [isSupplierId]);
  useEffect(() => {
    if (current?.item_details && Object.keys(current?.item_details).length) {
      const images = current?.item_details?.images.map((image, index) => ({
        uid: index,
        name: image,
        status: "done",
        old_image: true,
        editImage: true,
        url: ImagePath(image, created_by_platform),
      }));
      const attachImages = current?.item_details?.attachments.map((image) => ({
        ...image,
        uid: image?.id,
        status: "done",
        old_image: true,
        editAttach: true,
        name: image?.attachment,
        url: ImagePath(image?.attachment, created_by_platform),
      }));
      let imagePath = current?.item_details?.item_primary_image?.image_path;
      let imgIndex = current?.item_details?.images?.find((data) => imagePath === data);
      if (imgIndex !== undefined) {
        imgIndex = current.item_details.images.indexOf(imgIndex);
        setCurrentIndex(imgIndex);
      }

      form.setFieldsValue({
        ...current?.item_details,
        sku: clone ? current?.clone_sku : current?.item_details?.sku,
        type: current?.item_details?.type === "goods" ? "Inventory" : "",
        currency_code: `${current?.item_details.currency_code} - ${current?.item_details.name}`,
        opening_stock: current?.item_details?.stocks[0]?.opening_quantity,
        opening_stock_value: parseFloat(current?.item_details?.opening_stock_value).toFixed(2),
        sales_unit_price: parseFloat(current?.item_details?.sales_unit_price).toFixed(2),
        purchase_unit_price: parseFloat(current?.item_details?.purchase_unit_price).toFixed(2),
      });
      if (current?.item_details?.tax_group_id) {
        form.setFieldsValue({
          tax_id: current?.item_details?.tax_group_id,
        });
      }
      handleImageList(images);
      handleImageAttachList(attachImages);
      handleWareshouseList(current?.warehouses.filter((ware) => ware.is_primary));
      handleTrackInventory(current?.item_details?.inventory_type === "inventory");
    }
    //eslint-disable-next-line
  }, [current?.item_details]);

  useEffect(() => {
    if (create && current && Object.keys(current).length) {
      const listing = warehouses.filter((ware: { is_primary: boolean }) => ware.is_primary);
      handleWareshouseList(listing);
      form.setFieldsValue({
        sales_account_id: income_account && income_account.length > 0 ? income_account[0].id : null,
        purchase_account_id:
          expense_account && expense_account.length > 0 ? expense_account[0].id : null,
        inventory_account_id:
          inventory_account && inventory_account.length > 0 ? inventory_account[0].id : null,
        // vendor_id: vendors && vendors.length > 0 ? vendors[0].id : null,
      });
    }
    // eslint-disable-next-line
  }, [create, current, warehouses]);

  const handleSku = () => {
    sku_toggle();
    callAxios({
      url: GET_SKU,
    }).then((res) => {
      sku_toggle();
      if (res) form.setFieldsValue({ sku: res.sku || "IMS-100" });
    });
  };

  const handleSkuFormChange = () => setPopoverVisible(!popoverVisible);

  const handleOk = () => form.setFieldsValue({ upload_images: null });

  //@ts-ignore
  const handleDelete = (i: any) => (e: any) => {
    setCurrentIndex((prevIndex) =>
      currentIndex === i ? 0 : prevIndex >= i ? prevIndex - 1 : prevIndex
    );
    const updatedFileList = fileList.filter((_, index) => index !== i);
    setFileList(updatedFileList);
  };

  const handleImageAttachChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const tempSize = newFileList[newFileList.length - 1].size;
    const type = newFileList[newFileList.length - 1].type;
    if (newFileList[newFileList.length - 1].name.includes(".jfif")) {
      Toast({
        message:
          "The selected image format is not allowed. Please upload an allowed format. i.e .JPG, .JPEG, .PNG and .webP",
        type: "error",
      });
      return;
    }
    if (tempSize !== undefined) {
      if (!attachementAllowedFormats.includes(type!)) {
        Toast({
          message: attachmentTypeToastMessage,
          type: "error",
        });
        return;
      }
      if (tempSize >= MAX_FILE_SIZE) {
        Toast({
          message: "File should be less than the allowed maximum Size i.e 5 MB",
          type: "error",
        });
        return;
      }
      handleImageAttachList?.(newFileList);
    }
  };

  // const handleChange = (value: number) => {
  //   const isGroup = taxList.find(
  //     (val: { id: number; isGroup: boolean }) => val.id === value && val.isGroup
  //   );
  //   handleTaxType(isGroup ? "group" : null);
  // };

  const handleAttachImage = (files) => {
    if (edit && files.old_image) {
      setDeleteAttachments([...deleteAttachments, files?.uid]);
    }
    setAttachList(attachList.filter((file) => file.uid !== files.uid));
  };

  const handleSetting = () => {
    const settingBtnPOs = document.getElementById("settingbtnposition");
    //@ts-ignore
    var space = window.innerHeight - settingBtnPOs.getBoundingClientRect().top;
    const element = document.getElementById(`scrollview`);
    if (space <= 406) {
      //@ts-ignore
      element.scrollIntoView({ behavior: "smooth" });
    }
    setSetting(!setting);
  };

  const handleErrorSubmit = (err) => {
    if (err.errorFields.length) {
      if (nameRef.current !== null && err.values.name === "") {
        nameRef.current.focus();
      } else if (skuRef.current !== null && err.values.sku === "") {
        skuRef.current.focus();
      } else if (unitRef.current !== null && err.values.unit === "") {
        unitRef.current.focus();
      }
    }
  };
  const handleAccount = (type, res) => {
    setQuery(type);
    setModal(!modal);
    if (type === "inventory") {
      res && form.setFieldsValue({ inventory_account_id: { id: res?.id, label: res?.title } });
      if (res && !inventory_account.some((obj) => obj.id === res?.id)) {
        inventory_account.push({ id: res?.id, label: res?.title, title: res?.title });
      }
    } else if (type === "expense") {
      res && form.setFieldsValue({ purchase_account_id: { id: res?.id, label: res?.title } });
      if (res && !expense_account.some((obj) => obj.id === res?.id)) {
        expense_account.push({ id: res?.id, label: res?.title, title: res?.title });
      }
    } else if (type === "income") {
      res && form.setFieldsValue({ sales_account_id: { id: res?.id, label: res?.title } });
      if (res && !income_account.some((obj) => obj.id === res?.id)) {
        income_account.push({ id: res?.id, label: res?.title, title: res?.title });
      }
    }
  };
  const handleCategory = (values?: any) => {
    if (values?.id) {
      const update = { id: values.id, name: values.name, label: values.name };
      current?.category.push(update);
      form.setFieldValue("category_id", update.id);
    }
    setCategoryModal(!categoryModal);
  };

  const toggleTax = () => {
    setTaxModal(!taxModal);
  };
  if (taxObj?.id) {
    form.setFieldsValue({
      tax_id: { id: taxObj?.id, label: `${taxObj.name} (${taxObj.rate}%)` },
    });
    if (!taxList.some((obj) => obj.id === taxObj?.id)) {
      taxList.push(taxObj);
    }
  }
  return (
    <>
      {Boolean(status) ? (
        <>
          <CreateAccount
            isItemForm
            bool={modal}
            query={query}
            toggle={handleAccount}
            has_permission={has_AccountsCreate_permission}
            from="items"
          />
          {formLoading && !isModal ? (
            <SpinnerX />
          ) : (
            <div className="main_wrapper container-1280">
              {!isModal && (
                <Breadcrumbx
                  className="item_name"
                  name={!create ? current?.item_details?.name : "Create New Product/Service"}
                />
              )}
              <div className={`_container ${isModal ? "modal-form" : ""}`}>
                <Form
                  className="create_new_product_from"
                  form={form}
                  name="item-form"
                  layout="vertical"
                  autoComplete="off"
                  onFinish={onSubmit}
                  requiredMark={false}
                  initialValues={initialState}
                  onFinishFailed={handleErrorSubmit}
                >
                  <Typography.Title level={4} className="form_heading">
                    Product Type
                  </Typography.Title>
                  <div className="form_box " id="">
                    <div className="flexbox form-row-container justify-content-between">
                      <div className="form_group flex-47">
                        <Selectx
                          name="type"
                          size="large"
                          options={options}
                          allowClear={false}
                          className="input_field"
                          defaultValue="Inventory"
                          label={<label>{Labels.TYPE}</label>}
                          placeholder={Labels.SELECT_PRODUCT_TYPE}
                          popupClassName={isModal ? "overlap" : "product_type_input"}
                        />
                      </div>
                    </div>
                  </div>
                  <Typography.Title level={4} className="form_heading" id="scrollview">
                    Product Image
                  </Typography.Title>
                  <div
                    className={`form_box product_upload_image ${
                      fileList.length >= 1 ? "upload_image_attachment" : ""
                    }`}
                  >
                    <label className=" form--label_style mb-5">{Labels.upload_product_image}</label>
                    <div className="upload-wrapper-main d-flex">
                      <div className="upload-wrapper-inner">
                        <div className="form_box">
                          <div className="upload_box">
                            <Form.Item name="upload_images">
                              <UploadImage fileList={fileList} prodcutImage src="" form={form} />
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                      <div className="upload-wrapper-images">
                        {fileList.map((file, index) => (
                          <Space className="upload-wrapper item-image">
                            {/* {currentIndex !== index && ( */}
                            <Space className="anticon" onClick={handleDelete(index)}>
                              <div>
                                <img
                                  alt="close Icon"
                                  className="sm-size close_icon"
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/close-modal.svg`}
                                />
                              </div>
                            </Space>
                            {/* )} */}
                            <div>
                              <Image
                                preview={false}
                                alt="item here"
                                className="img_logo"
                                rootClassName="product-thumbnail"
                                src={file.editImage ? file?.url : URL.createObjectURL(file)}
                              />
                              {currentIndex === index ? (
                                <label>Default</label>
                              ) : (
                                <Buttonx
                                  btnText="set as default"
                                  clickHandler={() => setCurrentIndex(index)}
                                  // disabled={platformType !== "books" && isModal}
                                />
                              )}
                            </div>
                          </Space>
                        ))}
                        {fileList.length === 5 && (
                          <span className="error-style">
                            Maximum of 5 images can be uploaded, remove any one in order to add.
                          </span>
                        )}
                      </div>
                      <Modal
                        width={940}
                        footer={null}
                        destroyOnClose
                        centered={true}
                        onCancel={handleOk}
                        open={Boolean(image)}
                        wrapClassName="generic_modal_style adjust_image_modal"
                        title={<label className="f--bold">Adjust Image</label>}
                        closeIcon={
                          <img
                            alt="close Icon"
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/close-modal.svg`}
                          />
                        }
                      >
                        <ImageCrop
                          image={image}
                          fileList={fileList}
                          handleOk={handleOk}
                          handleFileList={handleFileList}
                        />
                      </Modal>
                    </div>
                  </div>
                  <Typography.Title level={4} className="form_heading">
                    Product Name
                  </Typography.Title>
                  <div className="form_box">
                    <div className="flexbox form-row-container justify-content-between">
                      <div className="form_group flex-47">
                        <InputField
                          required
                          form={form}
                          name="name"
                          size="middle"
                          maxLength={240}
                          innerRef={nameRef}
                          label={Labels.NAME}
                          className="input_field"
                          placeholder="Enter product name"
                          rules={rules({ message: Content.enter_name })}
                        />
                      </div>

                      <div className="form_group flex-47 button_flexbox product-sku ">
                        <InputField
                          required
                          name="sku"
                          form={form}
                          size="middle"
                          innerRef={skuRef}
                          placeholder="Enter SKU"
                          className="input_field need generate_sku"
                          label={<TooltipX title="Stop keeping unit">{Labels.SKU}</TooltipX>}
                          maxLength={50}
                          addonAfter={
                            <Button
                              loading={sku_bool}
                              onClick={handleSku}
                              id="settingbtnposition"
                              style={{ color: "white" }}
                              className="btn-form-size btn-primary d-flex align-center btn-generate"
                            >
                              Generate SKU
                            </Button>
                          }
                          rules={rules({ message: Content.sku_required })}
                        />
                        <div className="d-flex settings ">
                          <Popover
                            zIndex={100}
                            trigger="click"
                            title="SKU settings"
                            open={popoverVisible}
                            placement="bottomLeft"
                            overlayClassName=" __sku_settings"
                            onOpenChange={handleSkuFormChange}
                            getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                            content={
                              <SkuForm
                                detail={current?.sku_prefrence}
                                handleClose={handleSkuFormChange}
                                tooltipOverlayClass={tooltipOverlayClass}
                              />
                            }
                          >
                            <img
                              src={`${
                                import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                              }/static/media/settings.svg`}
                              onClick={handleSetting}
                              className={`_info_icon--hover cursor sku_icon
${setting === false ? "toggle-false" : setting === true ? "toggle-true" : ""}`}
                            />
                          </Popover>
                        </div>
                      </div>
                      <div className="form_group flex-47">
                        <Form.Item
                          name="description"
                          className="flex_root text_field"
                          label={
                            <label className="form--label_style mb-5">
                              {Labels.PRODUCT_DESCRIPTION}
                            </label>
                          }
                        >
                          <Input.TextArea
                            rows={4}
                            showCount
                            maxLength={1000}
                            style={{
                              overflow: "hidden",
                            }}
                            placeholder="Enter product description"
                            onChange={(e: any) => {
                              const { value } = e.target;
                              const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                              form.setFieldValue("description", formattedValue);
                            }}
                          />
                        </Form.Item>
                      </div>
                      <div className="form_group flex-47 mb--30 expense_account">
                        <Selectx
                          size="large"
                          name="category_id"
                          className="input_field"
                          label={Labels.CATEGORY}
                          options={current?.category}
                          showButton={isModal ? false : true}
                          handleAddNew={handleCategory}
                          placeholder={Labels.SELECT_PRODUCT_CATEGORY}
                          popupClassName={
                            isModal ? "overlap dropdown--scroll" : "dropdown--scroll Category_field"
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <Typography.Title level={4} className="form_heading">
                    Product Info
                  </Typography.Title>
                  <div className="form_box">
                    <div className="flexbox form-row-container justify-content-between">
                      <div className="form_group flex-47">
                        <InputField
                          form={form}
                          name="brand"
                          size="middle"
                          label={Labels.BRAND}
                          className="input_field"
                          placeholder="Enter brand name"
                          rules={[
                            { message: "No more than 200 Characters.", max: 200, type: "string" },
                          ]}
                        />
                      </div>
                      <div className="form_group flex-47">
                        <AutoCompletex
                          required
                          showArrow
                          form={form}
                          name="unit"
                          innerRef={unitRef}
                          allowClear={false}
                          options={itemUnits}
                          defaultValue={unit}
                          label={Labels.SELLING_UNIT}
                          placeholder={Content.select_unit}
                          className="input_field custom_field"
                          rules={rules({ message: Content.select_selling_unit })}
                          popupClassName={
                            isModal ? "overlap dropdown--scroll" : "dropdown--scroll scroll_visible"
                          }
                          filterOption={(inputValue, option: any) =>
                            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                          }
                          handleChange={(value) => {
                            // Limit input to 15 characters
                            if (value.length > 15) {
                              // Update the value in the form
                              value = value.slice(0, 15);
                              form.setFieldsValue({ unit: value });
                            }
                          }}
                        />
                      </div>
                      <div className="form_group flex-47">
                        <InputField
                          form={form}
                          size="middle"
                          name="manufacturer"
                          className="input_field"
                          label={Labels.MANUFACTURER}
                          placeholder="Enter product manufacturer"
                          rules={[
                            { message: "No more than 200 Characters.", max: 200, type: "string" },
                          ]}
                        />
                      </div>
                      <div className="form_group flex-47">
                        <InputField
                          name="upc"
                          form={form}
                          size="middle"
                          className="input_field"
                          label={Labels.UPC_BARCODE}
                          placeholder="Enter product UPC"
                          rules={[
                            { message: "No more than 13 Characters.", max: 13, type: "string" },
                          ]}
                        />
                      </div>
                      <div className="form_group flex-47">
                        <InputField
                          form={form}
                          size="middle"
                          name="weight"
                          label={Labels.WEIGHT}
                          className="input_field"
                          placeholder="Enter product weight"
                          rules={[
                            { message: "No more than 17 Characters.", max: 17, type: "string" },
                          ]}
                        />
                      </div>
                      <div className="form_group flex-47">
                        <InputField
                          name="mpn"
                          form={form}
                          size="middle"
                          label={Labels.MPN}
                          className="input_field"
                          placeholder="Enter product MPN"
                          rules={[
                            { message: "No more than 17 Characters.", max: 17, type: "string" },
                          ]}
                        />
                      </div>
                      <div className="form_group flex-47">
                        <InputField
                          form={form}
                          size="middle"
                          name="dimensions"
                          className="input_field"
                          label={Labels.DIMENSIONS}
                          placeholder="Length x Width x Height"
                          rules={[
                            { message: "No more than 17 Characters.", max: 17, type: "string" },
                          ]}
                        />
                      </div>
                      <div className="form_group flex-47">
                        <InputField
                          name="ean"
                          form={form}
                          size="middle"
                          // maxLength={14}
                          label={Labels.EAN}
                          className="input_field"
                          placeholder="Enter product EAN"
                          rules={[
                            { message: "No more than 14 Characters.", max: 14, type: "string" },
                          ]}
                        />
                      </div>
                      <div className="form_group flex-47">
                        <InputField
                          form={form}
                          name="isbn"
                          size="middle"
                          // maxLength={17}
                          label={Labels.ISBN}
                          className="input_field"
                          placeholder="Enter product ISBN"
                          rules={[
                            { message: "No more than 17 Characters.", max: 17, type: "string" },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                  <Typography.Title level={4} className="form_heading">
                    Product Quantity
                  </Typography.Title>
                  <div className="form_box">
                    <div className="flexbox form-row-container justify-content-between">
                      <div className="form_group flex-47">
                        <Form.Item
                          colon={false}
                          name="opening_stock"
                          className="input_field"
                          label={
                            <span className="form--label_style mb-5">
                              {Labels.INITIAL_QUANTITY}
                            </span>
                          }
                        >
                          <InputNumberX
                            id="opening_stock"
                            value={opening_stock}
                            disabled={!clone && current?.item_details?.transactionInfo}
                            onBlur={() => {
                              if (!opening_stock) form.setFieldValue("opening_stock", 0);
                            }}
                            onChange={(value) => form.setFieldValue("opening_stock", value)}
                          />
                        </Form.Item>
                      </div>
                      <div className="form_group flex-47">
                        <Form.Item
                          colon={false}
                          className="input_field"
                          name="opening_stock_value"
                          label={
                            <span className="form--label_style mb-5">{Labels.STOCK_VALUE}</span>
                          }
                        >
                          <InputNumberX
                            allowDecimal
                            step="0.01"
                            id="opening_stock_value"
                            value={opening_stock_value}
                            placeholder={`${base_currency?.symbol}0`}
                            disabled={!clone && current?.item_details?.transactionInfo}
                            onBlur={() => {
                              if (!opening_stock_value || isNaN(parseFloat(opening_stock_value))) {
                                form.setFieldValue("opening_stock_value", 0.0);
                              } else {
                                form.setFieldValue(
                                  "opening_stock_value",
                                  parseFloat(opening_stock_value).toFixed(2)
                                );
                              }
                            }}
                            onChange={(value) => form.setFieldValue("opening_stock_value", value)}
                          />
                        </Form.Item>
                      </div>
                      <div className="form_group flex-47">
                        <Form.Item
                          colon={false}
                          name="reorder_level"
                          className="input_field"
                          label={
                            <span className="form--label_style mb-5">{Labels.REORDER_POINT}</span>
                          }
                        >
                          <InputNumberX
                            id="reorder_level"
                            name="reorder_level"
                            value={reorder_level}
                            label={Labels.REORDER_POINT}
                            onBlur={() => {
                              if (!reorder_level) form.setFieldValue("reorder_level", 0);
                            }}
                            onChange={(value) => form.setFieldValue("reorder_level", value)}
                          />
                        </Form.Item>
                      </div>
                      {import.meta.env.VITE_ADD_ACCOUNTS === "true" && (
                        <div className="form_group flex-47 mb-30 add-btn-generic">
                          <Selectx
                            required
                            showButton={isModal ? false : true}
                            options={inventory_account?.map((value) => {
                              return { id: value.id, label: value.title };
                            })}
                            allowClear={false}
                            name="inventory_account_id"
                            className="flex_root select_box "
                            popupClassName={
                              isModal ? "overlap dropdown--scroll" : "dropdown--scroll"
                            }
                            placeholder="Select inventory asset"
                            label={<label>Inventory asset account</label>}
                            handleAddNew={() => handleAccount("inventory", null)}
                            rules={rules({ message: Content.select_inventory_account })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <Typography.Title level={4} className="form_heading">
                    Product Sales
                  </Typography.Title>
                  <div className="form_box">
                    <div className="flexbox form-row-container justify-content-between">
                      <div className="form_group flex-47">
                        <Form.Item
                          className="flex_root text_field"
                          name="sales_description"
                          label={
                            <span className="form--label_style mb-5">
                              {Labels.SALES_DESCRIPTION}
                            </span>
                          }
                        >
                          <Input.TextArea
                            rows={4}
                            showCount
                            maxLength={1000}
                            placeholder="Enter sales description"
                            onChange={(e: any) => {
                              const { value } = e.target;
                              const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                              form.setFieldValue("sales_description", formattedValue);
                            }}
                          />
                        </Form.Item>
                      </div>
                      <div className="form_group flex-47">
                        <Form.Item
                          colon={false}
                          name="sales_unit_price"
                          className="input_field"
                          label={
                            <span className="form--label_style mb-5">{Labels.SELLING_PRICE}</span>
                          }
                        >
                          <InputNumberX
                            allowDecimal
                            step="0.01"
                            id="sales_unit_price"
                            name="sales_unit_price"
                            value={sales_unit_price}
                            placeholder={`${base_currency?.symbol}0`}
                            onBlur={() => {
                              if (!sales_unit_price || isNaN(parseFloat(sales_unit_price))) {
                                form.setFieldValue("sales_unit_price", 0.0);
                              } else {
                                form.setFieldValue(
                                  "sales_unit_price",
                                  parseFloat(sales_unit_price).toFixed(2)
                                );
                              }
                            }}
                            onChange={(value) => form.setFieldValue("sales_unit_price", value)}
                          />
                        </Form.Item>
                      </div>
                      <div className="form_group flex-47 income_account">
                        <Selectx
                          required
                          showButton={
                            isModal
                              ? false
                              : import.meta.env.VITE_ADD_ACCOUNTS === "false"
                              ? false
                              : true
                          }
                          options={income_account?.map((value) => {
                            return { id: value.id, label: value.title };
                          })}
                          allowClear={false}
                          name="sales_account_id"
                          label={Labels.INCOME_ACCOUNT}
                          className="flex_root input_field"
                          placeholder={Content.select_sales_account}
                          handleAddNew={() => handleAccount("income", null)}
                          rules={rules({ message: Content.select_income_account })}
                          popupClassName={isModal ? "overlap dropdown--scroll" : "dropdown--scroll"}
                        />
                      </div>
                      <div className="form_group flex-47 tax-group">
                        <Selectx
                          name="tax_id"
                          // allowClear={false}
                          showSearch={false}
                          handleAddNew={toggleTax}
                          placeholder="Select sales tax"
                          className="flex_root input_field"
                          showButton={isModal ? false : true}
                          popupClassName={isModal ? "overlap dropdown--scroll" : "dropdown--scroll"}
                          label={<label>{Labels.SALES_TAX}</label>}
                          options={taxList?.map((value) => {
                            return { id: value?.id, label: `${value.name} (${value.rate}%)` };
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <Typography.Title level={4} className="form_heading">
                    Product Purchases
                  </Typography.Title>
                  <div className="form_box">
                    <div className="flexbox form-row-container justify-content-between">
                      <div className="form_group flex-47">
                        <Form.Item
                          className="flex_root text_field"
                          name="purchase_description"
                          label={
                            <span className="form--label_style mb-5">
                              {Labels.PURCHASE_DESCRIPTION}
                            </span>
                          }
                        >
                          <Input.TextArea
                            showCount
                            rows={4}
                            maxLength={1000}
                            className="select_box"
                            placeholder="Enter purchasing information"
                            onChange={(e: any) => {
                              const { value } = e.target;
                              const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                              form.setFieldValue("purchase_description", formattedValue);
                            }}
                          />
                        </Form.Item>
                      </div>
                      <div className="form_group flex-47">
                        <Form.Item
                          colon={false}
                          className="input_field"
                          name="purchase_unit_price"
                          label={<label className="form--label_style mb-5">{Labels.COST}</label>}
                        >
                          <InputNumberX
                            allowDecimal
                            step="0.01"
                            label={Labels.COST}
                            className="input_field"
                            id="purchase_unit_price"
                            name="purchase_unit_price"
                            value={purchase_unit_price}
                            placeholder={`${base_currency?.symbol}0`}
                            onBlur={() => {
                              if (!purchase_unit_price || isNaN(parseFloat(purchase_unit_price))) {
                                form.setFieldValue("purchase_unit_price", 0.0);
                              } else {
                                form.setFieldValue(
                                  "purchase_unit_price",
                                  parseFloat(purchase_unit_price).toFixed(2)
                                );
                              }
                            }}
                            onChange={(value) => form.setFieldValue("purchase_unit_price", value)}
                          />
                        </Form.Item>
                      </div>
                      <div className="form_group flex-47 mb--30 expense_account">
                        <Selectx
                          required
                          showButton={
                            isModal
                              ? false
                              : import.meta.env.VITE_ADD_ACCOUNTS === "false"
                              ? false
                              : true
                          }
                          options={expense_account?.map((value) => {
                            return { id: value.id, label: value.title };
                          })}
                          allowClear={false}
                          name="purchase_account_id"
                          className="flex_root dropdown--scroll"
                          label={<label>{Labels.EXPENSE_ACCOUNT}</label>}
                          handleAddNew={() => handleAccount("expense", null)}
                          rules={rules({ message: Content.select_expense_account })}
                          popupClassName={isModal ? "overlap dropdown--scroll" : "dropdown--scroll"}
                        />
                      </div>
                      <div className="form_group flex-47 mb--30 expense_account">
                        <Selectx
                          showButton
                          name="vendor_id"
                          handleAddNew={toggleSupplierModal}
                          // allowClear={false}
                          showSearch={false}
                          options={current?.vendors}
                          className="flex_root dropdown--scroll"
                          placeholder="Select preferred supplier"
                          popupClassName={isModal ? "overlap" : ""}
                          label={<label>{Labels.PREFERRED_SUPPLIER}</label>}
                        />
                      </div>
                    </div>
                  </div>
                  <Typography.Title level={4} className="form_heading">
                    Product Notes
                  </Typography.Title>
                  <div className="form_box">
                    <div className="flexbox form-row-container justify-content-between">
                      <div className="form_group flex-47">
                        <Form.Item
                          name="notes"
                          className="flex_root text_field"
                          label={
                            <span className="form--label_style mb-5">{Labels.ADD_NOTES} </span>
                          }
                        >
                          <Input.TextArea
                            showCount
                            rows={4}
                            maxLength={1000}
                            placeholder="Add notes"
                            onChange={(e: any) => {
                              const { value } = e.target;
                              const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                              form.setFieldValue("notes", formattedValue);
                            }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                  {!edit && (
                    <div
                      className={`form_box attachment_gap product_upload_image ${
                        attachList.length >= 1 ? "upload_image_attachment" : ""
                      }`}
                    >
                      <label className="form--label_style mb-5">{Labels.Attachment}</label>
                      <div style={{ display: "flex" }} className=" upload-wrapper-master">
                        <div className="upload-wrapper-inner" style={{ alignSelf: "flex-start" }}>
                          <Upload
                            maxCount={5}
                            fileList={attachList}
                            showUploadList={false}
                            listType="picture-card"
                            disabled={attachList.length >= 5}
                            onChange={handleImageAttachChange}
                            accept=".png,.jpg,.jpeg,.pdf,.csv,.doc,.docx"
                            beforeUpload={() => {
                              return false;
                              // if (file?.name && attachList.length === 5) {
                              //   Toast({
                              //     message:
                              //       "Only  allowed quantity (i.e 5 attachments) are allowed to be uploaded.",
                              //     type: "error",
                              //   });
                              // }
                            }}
                          >
                            <div className="optimistic">
                              <div
                                className="ant-upload-drag-icon"
                                style={{ marginBottom: "20px" }}
                              >
                                <Image
                                  preview={false}
                                  className="logo"
                                  alt="attach-logo"
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/add_product.png`}
                                />
                              </div>
                              <p className="ant-upload-text drag-text color-1616">
                                Drag or Upload your attachment
                              </p>
                              <p className="ant-upload-hint">
                                Only .JPG, .JPEG, .PNG, .DOC, .CSV and .PDF format supported
                              </p>
                              <p className="ant-upload-hint">Maximum size: 5 MB</p>
                            </div>
                          </Upload>
                        </div>
                        <div className="attachment_list">
                          {attachList.map((file) => (
                            <Space className="upload-wrapper image-container">
                              <Space className="anticon overlay">
                                <TooltipX title="Delete">
                                  <img
                                    alt="trash icon"
                                    className="delete_icon"
                                    onClick={() => handleAttachImage(file)}
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/deletesingleattachment.svg`}
                                  />
                                </TooltipX>
                              </Space>

                              <Image
                                width={100}
                                height={100}
                                preview={false}
                                alt=""
                                className="img_logo"
                                src={
                                  file?.editAttach
                                    ? ["png", "jpg", "jpeg"].includes(file?.attachment_type)
                                      ? file?.url
                                      : file?.attachment_type === "pdf"
                                      ? `${
                                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                        }/static/media/pdf.svg`
                                      : isCsvOrExcelFile(file?.attachment_type)
                                      ? `${
                                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                        }/static/media/csv.png`
                                      : file?.attachment_type === "doc"
                                      ? `${
                                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                        }/static/media/docx.svg`
                                      : `${
                                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                        }/static/media/docx.svg`
                                    : ["image/png", "image/jpg", "image/jpeg"].includes(file?.type)
                                    ? URL.createObjectURL(file?.originFileObj)
                                    : file?.type === "application/pdf"
                                    ? `${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/pdf.svg`
                                    : isCsvOrExcelFile(file?.type)
                                    ? `${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/csv.png`
                                    : file?.type === "text/doc"
                                    ? `${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/docx.svg`
                                    : `${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/docx.svg`
                                }
                              />
                            </Space>
                          ))}
                          {attachList.length > 5 && (
                            <span className="error-style">
                              Maximum of 5 images can be uploaded, remove any one in order to add.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="custom_blocklevel form_box">
                    <div className="__popup-actions form-action-btn">
                      <Buttonx
                        htmlType="button"
                        btnText={Labels.CANCEL}
                        className="btn-default btn-form-size"
                        clickHandler={() => (!isModal ? navigate(ITEMS) : toggleItemModal?.())}
                      />
                      <Buttonx
                        block
                        loading={loading}
                        btnText={Labels.SAVE}
                        className="btn-form-size btn-primary"
                      />
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          )}
        </>
      ) : (
        <Alert
          showIcon
          type="info"
          message="Module Permissions"
          description="Please Enable Module Permissions To See Details"
        />
      )}
      <CreateTax
        taxObj={taxObj}
        bool={taxModal}
        refetch={() => null}
        toggle={toggleTax}
        setTaxObj={setTaxObj}
        has_permission={has_TaxCreate_permission}
      />
      <Modal
        wrapClassName="generic_modal_style"
        width={1000}
        style={{ top: 0 }}
        centered
        footer={false}
        destroyOnClose
        title="Add Supplier"
        closeIcon={
          <img
            src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/close-modal.svg"
            alt="close Icon"
          />
        }
        open={isSupplierModalOpen}
        onCancel={toggleSupplierModal}
        className="estimate_modal estimate_lg_modal form_generic_modal"
        bodyStyle={{
          height: "100%",
        }}
      >
        <CreateSupplier
          isModal
          setIsCustomerId={setIsSupplierId}
          isCustomerModalOpen={isSupplierModalOpen}
          setIsCustomerModalOpen={toggleSupplierModal}
        />
      </Modal>
      <CreateCategory
        itemform
        refetch={() => null}
        isModalOpen={categoryModal}
        handleCategory={handleCategory}
        setIsModalOpen={setCategoryModal}
      />
    </>
  );
};

// const getAttachmentUrl =(file) =>{
//   let url = ""
//   if(['png',"jpg","jpeg"].includes(file?.type)){
//     url = file?.url
//   }
//   else if(file?.type.includes('pdf')) url = "https://pdfurl";

// }
