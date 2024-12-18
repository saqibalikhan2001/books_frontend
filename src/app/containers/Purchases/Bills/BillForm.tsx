/** @format */

import { useEffect, useMemo, useState } from "react";
import { Alert, Dropdown, Form, Input, Modal, Typography } from "antd";
import {
  Icons,
  Buttonx,
  Selectx,
  ItemTable,
  InputField,
  DatePickerx,
  Breadcrumbx,
  ContactModal,
  PendingBillModal,
} from "app/shared";
import dayjs from "dayjs";
import { BillFormProps } from "./Types";
import { TooltipX } from "app/shared/ToolTip";
import { CreateSupplier } from "app/containers";
import { SpinnerX } from "app/shared/PageLoader";
import { itemObject, optimizeValues } from "utils";
import { useLocation, useNavigate } from "react-router-dom";
import { validateQuantityInArray } from "utils/validQuantity";
import { Content, Labels, endpoints, routeNames } from "static";
import { useGetPaymentTermsQuery } from "store/query/paymentTerm";
import { SelectDynamicPaginationField } from "app/Hooks/SelectDynamicPaginationField";
import { useCreateFormApi, useSharedOrganization, useStore, useTimeZone } from "app/Hooks";
import { CreatePaymentTerm } from "app/containers/Settings/Preferences/PaymentTerm/Create";

const { TextArea } = Input;
const { BILLS } = routeNames;
const { Text, Title } = Typography;
const { BILL_CONTACT, BILL_ITEMS } = endpoints;

var [duration, time] = ["7", "day"];

export const BillForm = ({
  url,
  close,
  items,
  loading,
  onSubmit,
  POdetails,
  contactObj,
  handleTotal,
  edit = false,
  setContactObj,
  handleItemList,
  create = false,
  isModal = false,
  supplierFromSupplier,
}: BillFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [hasError, setError] = useState("");
  const [loader, setLoader] = useState(true);
  const [itemList, setitemList] = useState<any>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { getCurrentModule } = useSharedOrganization();
  const [isBillModal, setIsBillModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [isSupplierId, setIsSupplierId] = useState<any>();
  const [supplierDetail, setSupplierDetail] = useState(false);
  const [isItemModalOpen, setisItemModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<any>();
  const { status = true } = getCurrentModule("bills") || {};
  const { data: terms = [], refetch } = useGetPaymentTermsQuery("");
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const { primary_organization, org_date_format, TimeZone } = useStore();
  // const { bool: invoiceModal, toggle: toggleInvoiceModal, setFalse } = useBool(false);
  const {
    taxList,
    warehouses,
    expenseAccounts,
    inventoryAccounts,
    details: current,
    details: { bill_no },
  } = useCreateFormApi(url, Boolean(status));

  const billNo = Form.useWatch("bill_no", form);
  const term = Form.useWatch("bill_terms", form);
  const bill_date = Form.useWatch("bill_date", form);
  const venderEmail = Form.useWatch("vendor_email", form);
  const adjustment = Form.useWatch("adjustment", form) || 0;
  const discount_transaction_level = Form.useWatch("discount_transaction_level", form) || 0;
  const transaction_level_discount_type = Form.useWatch("transaction_level_discount_type", form);

  const { handleDate } = useTimeZone(primary_organization?.time_zone || "");
  const { dateWithOrgTZ } = useTimeZone(`${TimeZone}`);
  const todayDate = dayjs(dateWithOrgTZ(dayjs(new Date())));
  const due_Date = todayDate.add(7, "day");

  const initialState = {
    note: "",
    bill_no: "",
    reference: "",
    order_no: "",
    bill_terms: null,
    vendor_id: null,
    due_date: due_Date,
    bill_date: todayDate,
    terms_and_condition: "",
    discount_transaction_level: 0,
    adjustment: { sign: "+", value: 0 },
    transaction_level_discount_type: "percent",
  };
  const toggleBillModal = () => setIsBillModal(!isBillModal);
  const togglePaymentModal = () => setPaymentModal(!paymentModal);
  const toggleItemModal = () => setisItemModalOpen(!isItemModalOpen);
  const toggleSupplierDetailModal = () => setSupplierDetail(!supplierDetail);
  const toggleSupplierModal = () => setIsSupplierModalOpen(!isSupplierModalOpen);
  // const org_terms = terms.filter(({ org_id }: { org_id: number }) => org_id) || [];
  const reference = Form.useWatch("reference", form);
  const custom =
    terms.filter(
      (val) => val.id === (typeof term === "object" ? term?.id : term) && val.label === "Custom"
    )[0] || {};
  const memoizeFilter = useMemo(
    () =>
      terms.filter(
        (val: { id: number }) => val.id === (typeof term === "object" ? term?.id : term)
      )[0] || {},
    [terms, term]
  );
  const customDate = handleDate(memoizeFilter.value, bill_date);
  const defaultTerm = terms?.find((t) => t?.value === "custom");

  useEffect(() => {
    const error = validateQuantityInArray(items);
    //@ts-ignore
    setError(error);
  }, [items]);
  useEffect(()=>{
    refetch()
  },[])
  useEffect(() => {
    if (customDate && customDate.isValid()) form.setFieldsValue({ due_date: customDate });
  }, [customDate, bill_date]);

  useEffect(() => {
    handleTotal(totalAmount);
  }, [totalAmount]);

  useEffect(() => {
    //use effect for discount preference fields
    form.setFieldsValue({
      field2: "No tax",
      field1: "No discount",
      field3: "Items are exclusive of tax",
      field4: "Apply tax before discount",
    });
  }, []);
  useEffect(() => {
    if (supplierFromSupplier && Object.keys(supplierFromSupplier).length) {
      const obj = {
        ...supplierFromSupplier,
        value: supplierFromSupplier?.id,
        label: supplierFromSupplier?.display_name,
      };
      setCurrentSupplier(obj);
      handleSupplierChange(obj);
    }
    //eslint-disable-next-line
  }, [supplierFromSupplier]);
  useEffect(() => {
    if (bill_no) {
      form.setFieldsValue({
        bill_no,
        terms_and_condition: current?.bill_preference?.terms,
        bill_terms: current?.bill_preference?.preferences?.payment_terms_id,
      });
      setLoader(false);
    }
  }, [bill_no, current?.bill_preference?.terms]);

  useEffect(() => {
    if (isSupplierId) {
      const obj = { ...isSupplierId, value: isSupplierId?.id, label: isSupplierId?.display_name };
      setCurrentSupplier(obj);
      handleSupplierChange(obj);
    }
  }, [isSupplierId]);

  useEffect(() => {
    if (create && isModal && current && Object.keys(current).length) {
      form.setFieldsValue({
        ...current,
      });
      setitemList(current?.bill_details);
      setLoader(false);
    }
  }, [current, isModal, create]);

  useEffect(() => {
    if (state?.itemDetail) {
      setitemList([itemObject(state?.itemDetail)]);
    }
  }, [state?.itemDetail]);

  useEffect(() => {
    if (!create && current?.bill_details && Object.keys(current?.bill_details).length) {
      const values = current?.bill_details?.bill_info;
      form.setFieldsValue({
        ...values,
        due_date: dayjs(values?.due_date),
        bill_date: dayjs(values?.bill_date),
        vendor_email: values?.vendor?.email,
        bill_terms: values?.invoice_term_id,
        transaction_level_discount_type: values?.discount_type,
        adjustment: optimizeValues(values?.adjustment),
      });
      const contact_obj = {
        ...values?.vendor,
        value: values?.vendor?.id,
        label: values?.vendor?.display_name,
      };
      setContactObj(contact_obj);
      setitemList(values?.bill_item_details);
      setLoader(false);
    }
  }, [current?.bill_details, create]);

  const handleSupplierChange = (option) => {
    if (option.value === "createNew") {
      toggleSupplierModal();
    } else {
      setContactObj(option);
      form.setFieldsValue({
        bill_terms: option?.payment_terms
          ? {
              id: Number(option?.payment_terms),
              label: option?.payment_term_name,
              value: option?.payment_term_value,
              name: option?.payment_term_name,
            }
          : defaultTerm,
        vendor_email: option?.email ? option?.email : null,
      });
    }
  };
  const saveButtons: any[] = [
    {
      key: "1",
      label: "Save as open",
      disabled: loading,
      onClick: () =>
        onSubmit({
          values: {
            ...form.getFieldsValue(),
            saveAs: "open",
          },
        } as any),
    },
    {
      key: "2",
      label: "Save and email",
      disabled: loading,
      onClick: () =>
        onSubmit({
          values: {
            ...form.getFieldsValue(),
            saveAs: "email",
          },
        } as any),
    },
    {
      key: "3",
      label: "Save and new",
      disabled: loading,
      hidden: edit,
      onClick: () =>
        onSubmit({
          values: {
            ...form.getFieldsValue(),
            saveAs: "new",
          },
        } as any),
    },
    {
      key: "4",
      label: "Save and print",
      disabled: loading,
      onClick: () =>
        onSubmit({
          values: {
            ...form.getFieldsValue(),
            saveAs: "print",
          },
        } as any),
    },
  ].filter((col) => !col.hidden);
  const disableButton =
    !items[0]?.id || !contactObj?.id || hasError || reference?.length > 50 ? true : false;

  return (
    <>
      {Boolean(status) ? (
        <>
          {loader ? (
            <SpinnerX />
          ) : (
            <>
              <div className="estimate_product_listing bill_form create_new_bill_form">
                <Form
                  form={form}
                  name="item-form"
                  layout="vertical"
                  autoComplete="off"
                  requiredMark={false}
                  initialValues={initialState}
                  onFinish={(values) =>
                    onSubmit({
                      values: {
                        ...values,
                      },
                    } as any)
                  }
                >
                  <div className="main_wrapper container-1280">
                    {!isModal && (
                      <Breadcrumbx
                        name={!edit ? "Create New Bill" : billNo}
                        className="item_name"
                      />
                    )}
                    <div className="_container">
                      <Title level={4} className="form_heading">
                        {!edit ? "New Bill" : ""}
                      </Title>
                      <div className="form_box">
                        <div className="flexbox form-row-container justify-content-between">
                          <div className="estimate_customer supplier_list form_group flex-47 mb-30">
                            <label className="form--label_style mb-5">
                              Supplier<span className="staric">*</span>
                            </label>
                            <SelectDynamicPaginationField
                              required
                              addButton
                              error={""}
                              id="contactId"
                              clearable={false}
                              api={BILL_CONTACT}
                              name="Supplier Name"
                              editCust={contactObj}
                              disabled={isModal}
                              value={contactObj?.id}
                              newCust={currentSupplier}
                              placeholder="Select supplier"
                              handleChange={(option) => handleSupplierChange(option)}
                            />
                            <div className="invoice_btn">
                              {contactObj && !isModal && (
                                <>
                                  <div>
                                    {contactObj?.pending_bills > 0 && (
                                      <Buttonx
                                        type="link"
                                        htmlType="button"
                                        btnText="Pending bills"
                                        className="view_detail"
                                        clickHandler={toggleBillModal}
                                      />
                                    )}
                                  </div>
                                  <Buttonx
                                    type="link"
                                    htmlType="button"
                                    btnText="View details"
                                    className="view_detail"
                                    clickHandler={toggleSupplierDetailModal}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                          <div className="form_group flex-47">
                            <div className="input_field">
                              <Form.Item
                                name="vendor_email"
                                label={<label className="form--label_style mb-5">Email</label>}
                              >
                                <Text className="text_dark">{venderEmail}</Text>
                              </Form.Item>
                            </div>
                          </div>
                          <div className="form_group flex-47 mb--30">
                            <DatePickerx
                              isRequired
                              inputReadOnly
                              name="bill_date"
                              allowClear={false}
                              format={org_date_format}
                              label={"Transaction date"}
                              onChange={(date) => {
                                form.setFieldsValue({
                                  due_date: date.add(Number(duration), time as any),
                                });
                              }}
                            />
                          </div>
                          <div className="form_group flex-47">
                            <Form.Item
                              name="bill_no"
                              className="input_field"
                              label={<label className="form--label_style mb-5">Bill number</label>}
                            >
                              <Text>{billNo}</Text>
                            </Form.Item>
                          </div>
                          <div className="form_group flex-47">
                            <InputField
                              form={form}
                              size="large"
                              name="order_no"
                              className="input_field"
                              label={Labels.ORDER_NO}
                              placeholder="Enter order number"
                              rules={[
                                { message: Content.character_length, max: 15, type: "string" },
                              ]}
                            />
                          </div>
                          <div className="form_group flex-47">
                            <InputField
                              form={form}
                              size="large"
                              name="reference"
                              label={Labels.REFERENCE_NO}
                              className="input_field form_reference"
                              placeholder={Content.reference_number}
                              rules={[
                                { message: "No more than 50 Characters.", max: 50, type: "string" },
                              ]}
                            />
                          </div>
                          <div className="form_group flex-47">
                            <Selectx
                              showButton
                              loading={false}
                              options={terms}
                              name="bill_terms"
                              label={Labels.PAYMENT_TERMS}
                              handleAddNew={togglePaymentModal}
                              placeholder={Content.payment_terms}
                              className="flex_root gray_border input_field dropdown--scroll"
                              popupClassName="payment-terms  item_dropdown scroll_visible"
                            />
                          </div>
                          <div className="form_group flex-47 due_date mb--30">
                            <DatePickerx
                              isRequired
                              name="due_date"
                              label={Labels.DUE_DATE}
                              format={org_date_format}
                              style={{ marginBottom: "0" }}
                              disabled={!Object.keys(custom).length}
                              disableDate={(current) =>
                                current && current < dayjs(bill_date).startOf("day")
                              }
                            />
                          </div>
                          <div className="form_group flex-47">
                            <Form.Item
                              name="terms_and_condition"
                              className="flex_root text_field"
                              label={
                                <span className="form--label_style mb-5">
                                  {Labels.TERMS_AND_CONDITIONS}
                                </span>
                              }
                            >
                              <TextArea
                                rows={4}
                                showCount
                                maxLength={1000}
                                placeholder={Content.enter_terms_conditions}
                                onChange={(e: any) => {
                                  const { value } = e.target;
                                  const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                                  form.setFieldValue("terms_and_condition", formattedValue);
                                }}
                              />
                            </Form.Item>
                          </div>
                          <div className="form_group flex-47">
                            <Form.Item
                              name="note"
                              className="flex_root input_field"
                              label={<span className="form--label_style mb-5">{Labels.NOTES}</span>}
                            >
                              <TextArea
                                rows={4}
                                placeholder="Add notes"
                                onChange={(e: any) => {
                                  const { value } = e.target;
                                  const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                                  form.setFieldValue("note", formattedValue);
                                }}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                      {/*static fields for discount */}
                      {/* <DiscountPreference /> */}
                      <Title level={4} className="form_heading">
                        Select products/services
                      </Title>
                      <div className="table_outer_container table__hover--feature table-container">
                        <div className="generic-table estimate-table bill-table overflow-set">
                          <ItemTable
                            showButton
                            form={form}
                            taxes={taxList}
                            url={BILL_ITEMS}
                            ModuleName="Bill"
                            current={current}
                            isModal={isModal}
                            itemList={itemList}
                            warehouses={warehouses}
                            adjustment={adjustment}
                            customer_id={contactObj}
                            totalAmount={totalAmount}
                            discount_level="transaction"
                            handleAddNew={toggleItemModal}
                            handleItemList={handleItemList}
                            setTotalAmount={setTotalAmount}
                            PO_Warehouse_Id={POdetails?.warehouse_id}
                            currency={current?.base_currency?.symbol}
                            purchaseAccount={{ expenseAccounts, inventoryAccounts }}
                            edit={
                              current?.bill_details?.bill_info &&
                              Object.keys(current?.bill_details?.bill_info).length
                            }
                            discount_transaction_level={discount_transaction_level}
                            transaction_level_discount_type={transaction_level_discount_type}
                          />
                          <div className="button_flexbox flex-end ">
                            <Buttonx
                              type="default"
                              btnText="Cancel"
                              htmlType="button"
                              className="btn-default btn-form-size cate_cancel_btn"
                              clickHandler={() =>
                                isModal ? close?.() : state ? navigate(-1) : navigate(BILLS)
                              }
                            />
                            <div className="d-flex align-center new_prod_btn">
                              <Buttonx
                                block
                                loading={loading}
                                btnText={Labels.SAVE}
                                disabled={disableButton || loading}
                                className={`btn-primary btn-form-size ${
                                  !items[0]?.id || !contactObj?.id ? "disabled-save-btn" : ""
                                }`}
                              />
                              <Dropdown
                                trigger={["click"]}
                                placement="topRight"
                                disabled={disableButton}
                                menu={{ items: saveButtons }}
                                className="h-36px p-5 icon-radius"
                              >
                                <span
                                  className={`generic-dropdown-icon ${
                                    disableButton ? "disabled-svg" : "btn-primary cursor"
                                  }`}
                                >
                                  <img
                                    alt="dropdown"
                                    className="rotate-180deg"
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/dropdown.svg`}
                                  />
                                </span>
                              </Dropdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
                <CreatePaymentTerm
                  refetch={refetch}
                  paymentModal={paymentModal}
                  handleToggle={togglePaymentModal}
                  setPaymentData={(data) => {
                    form.setFieldValue("bill_terms", {
                      id: data?.id,
                      label: data?.name,
                      value: data?.value,
                      name: data?.name,
                    });
                  }}
                />
              </div>
              <Modal
                centered
                width={1000}
                footer={false}
                destroyOnClose
                style={{ top: 0 }}
                title="Add Supplier"
                open={isSupplierModalOpen}
                onCancel={toggleSupplierModal}
                wrapClassName="generic_modal_style"
                className="estimate_modal estimate_lg_modal form_generic_modal"
                bodyStyle={{
                  height: "100%",
                }}
                closeIcon={
                  <img
                    alt="close Icon"
                    src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/close-modal.svg"
                  />
                }
              >
                <CreateSupplier
                  isModal
                  setIsCustomerId={setIsSupplierId}
                  isCustomerModalOpen={isSupplierModalOpen}
                  setIsCustomerModalOpen={toggleSupplierModal}
                />
              </Modal>

              <ContactModal
                supplier
                bool={supplierDetail}
                detail={{ id: contactObj?.id }}
                toggle={toggleSupplierDetailModal}
              />
              <PendingBillModal
                visible={isBillModal}
                toggle={toggleBillModal}
                url={`/bills/unpaid/${contactObj?.id}`}
              />
            </>
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
    </>
  );
};
//@ts-ignore
const DiscountPreference = () => {
  const [discountPreference, setDiscountPreference] = useState(false);

  const toggleDiscountPrefernce = () => setDiscountPreference(!discountPreference);
  return (
    <>
      <div className="d-flex flex-column form_box tax-discount-preferences">
        <TooltipX
          className="d-flex align-center mb-30 ml-auto"
          title={"changing the preference will change the tax and discount fields in the tables."}
        >
          <Icons.MdOutlineSettings
            size={20}
            className="mr-5"
            style={{ cursor: "pointer" }}
            onClick={toggleDiscountPrefernce}
          />
          <span className="tax_discount">Tax and discount preferences</span>
        </TooltipX>
        {discountPreference ? (
          <div className="flexbox justify-content-between mb-30">
            <div className="form_group flex-25 mb-5">
              <Selectx
                size="large"
                name="field1"
                allowClear={false}
                options={[
                  { id: "1", label: "No discount" },
                  { id: "2", label: "Discount on line items" },
                  { id: "3", label: "Discount on subtotal" },
                ]}
                disabled
              />
            </div>
            <div className="form_group flex-25 mb-5">
              <Selectx
                size="large"
                name="field2"
                allowClear={false}
                options={[
                  { id: "1", label: "No tax" },
                  { id: "2", label: "Tax on line items" },
                  { id: "3", label: "Tax on subtotal" },
                ]}
                disabled
              />
            </div>

            <div className="form_group flex-25 mb-5">
              <Selectx
                size="large"
                name="field3"
                allowClear={false}
                options={[
                  { id: "1", label: "Items are exclusive of tax" },
                  { id: "2", label: "Items are inclusive of tax" },
                ]}
                disabled
              />
            </div>

            <div className="form_group flex-25 mb-5">
              <Selectx
                size="large"
                name="field4"
                allowClear={false}
                options={[
                  { id: "1", label: "Apply tax before discount" },
                  { id: "2", label: "Apply tax after discount" },
                ]}
                disabled
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};
