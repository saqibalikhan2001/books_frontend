/** @format */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Dropdown, Form, Input, Modal, Select, Typography } from "antd";
import { EstimateFormProps } from "./Types";
import { AddressModal } from "./AddressModal";
import {
  Icons,
  Toast,
  Buttonx,
  Selectx,
  ItemTable,
  InputField,
  DatePickerx,
  Breadcrumbx,
  ContactModal,
  PendingInvoiceModal,
} from "app/shared";
import CreateCustomer from "../Customers/Create";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { routeNames, Content, endpoints, Labels } from "static";
import {
  useBool,
  useAxios,
  useStore,
  useTimeZone,
  useCreateFormApi,
  useSharedOrganization,
  usePermissions,
} from "app/Hooks";
import dayjs from "dayjs";
import { NaNull, itemObject } from "utils";
//@ts-ignore
import { validateDiscountInArray, validateQuantityInArray } from "utils/validQuantity";
import { SelectDynamicPaginationField } from "app/Hooks/SelectDynamicPaginationField";
import { SpinnerX } from "app/shared/PageLoader";
import { CreatePaymentTerm } from "app/containers/Settings/Preferences/PaymentTerm/Create";
import { useGetPaymentTermsQuery } from "store/query/paymentTerm";

const { BsPlus } = Icons;
const { TextArea } = Input;
const { add_notes } = Content;
const { ESTIMATES } = routeNames;
const { Text, Title } = Typography;
const { ESTIMATE_CONTACT, ESTIMATE_ITEMS, CUSTOMERS } = endpoints;
var [duration, time] = ["7", "day"];

export const EstimateForm = ({
  url,
  item,
  loading,
  onSubmit,
  contactObj,
  handleTotal,
  edit = false,
  setContactObj,
  handleItemList,
  create = false,
  handleWarehouseId,
  handlePrimaryWarehouse,
}: EstimateFormProps) => {
  const { checkPermission } = usePermissions();
  const { org_date_format, TimeZone, user_id } = useStore();
  const { dateWithOrgTZ } = useTimeZone(`${TimeZone}`);
  const todayDate = dayjs(dateWithOrgTZ(dayjs(new Date())));
  const expiryDate = todayDate.add(7, "day");
  const { has_CustomerEdit_permission } = checkPermission("CustomerEdit");

  const initialState = {
    name: "",
    reference: "",
    adjustment: 0,
    estimate_no: "",
    customer_note: "",
    customer_email: "",
    shipping_charge: 0,
    payment_terms: null,
    expiry_date: expiryDate,
    terms_and_condition: "",
    billing_address_id: null,
    estimate_date: todayDate,
    discount_transaction_level: 0,
    transaction_level_discount_type: "percent",
  };

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setFalse } = useBool(true);
  const { state }: any = useLocation();
  const [loader, setLoader] = useState(true);
  const [billObj, setBillObj] = useState<any>();
  const [hasError, setError] = useState<any>("");
  const [amountError, setAmountError] = useState<any>("");
  const [billing, setBilling] = useState<any>([]);
  const [editBill, setEditBill] = useState(false);
  const [itemList, setitemList] = useState<any>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [createBill, setCreateBill] = useState(false);
  const { getCurrentModule } = useSharedOrganization();
  const [isBillModal, setIsBillModal] = useState(false);
  const [billLoading, setBillLoading] = useState(false);
  const { callAxios, bool, toggle: Toggle } = useAxios();
  const [isCustomerId, setIsCustomerId] = useState<any>();
  const [pendingInv, setPendingInvModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [customerDetail, setCustomerDetail] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>();
  const { status = true } = getCurrentModule("estimates") || {};
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const { data: terms = [], refetch } = useGetPaymentTermsQuery("");

  const {
    taxList,
    warehouses,
    sales_person,
    details: current,
    details: { estimate_no, preference_list, discount_level },
  } = useCreateFormApi(url, Boolean(status));

  const adjustment = Form.useWatch("adjustment", form);
  const estimate_date = Form.useWatch("estimate_date", form);
  const estimate_number = Form.useWatch("estimate_no", form);
  const customerEmail = Form.useWatch("customer_email", form);
  const shipping_charge = Form.useWatch("shipping_charge", form);
  const discount_transaction_level = Form.useWatch("discount_transaction_level", form);
  const transaction_level_discount_type = Form.useWatch("transaction_level_discount_type", form);
  const reference = Form.useWatch("reference", form);

  const toggleBillModal = () => setIsBillModal(!isBillModal);
  const togglePendingInvModal = () => setPendingInvModal(!pendingInv);
  const toggleCustomerDetailModal = () => setCustomerDetail(!customerDetail);
  const toggleCustomerModal = () => setIsCustomerModalOpen(!isCustomerModalOpen);
  const togglePaymentModal = () => setPaymentModal(!paymentModal);

  // const org_terms = terms.filter(({ deletable }: { deletable: number }) => deletable) || [];
  useEffect(() => {
    const error = validateQuantityInArray(item);
    const errorDiscount = validateDiscountInArray(item);

    setError(error);
    setAmountError(errorDiscount);
  }, [item]);
  useEffect(()=>{
    refetch()
  },[])
  useEffect(() => {
    if (estimate_no) {
      form.setFieldsValue({
        estimate_no,
        sales_person_id:
          current.sales_person_user === "sales_person"
            ? sales_person[0].id
            : current.sales_person_user !== "sales_person"
            ? sales_person?.find((p) => p.id === user_id)?.id
            : null,
      });
      form.setFieldValue("terms_and_condition", preference_list?.estimate_preference?.terms);
      setLoader(false);
    }
    //eslint-disable-next-line
  }, [estimate_no, preference_list?.estimate_preference?.terms]);

  useEffect(() => {
    const pref = current?.preference_list?.estimate_preference?.preferences?.estimate_expiry_age;
    [duration, time] = pref ? [pref?.split(" ")?.[0], pref?.split(" ")?.[1]] : [7, "day"];
    form.setFieldsValue({
      expiry_date: pref ? todayDate?.add(Number(duration), time as any) : todayDate?.add(7, "day"),
    });
    //eslint-disable-next-line
  }, [current]);
  useEffect(() => {
    if (state?.itemDetail) {
      setitemList([itemObject(state?.itemDetail)]);
    }
  }, [state?.itemDetail]);
  useEffect(() => {
    if (current?.estimate && Object.keys(current?.estimate).length) {
      const paymentTerm = terms?.find(
        (t) =>
          t?.value === current?.estimate?.payment_term_value &&
          t?.name === current?.estimate?.payment_term_name
      );
      form.setFieldsValue({
        ...current?.estimate,
        payment_terms: paymentTerm,
        estimate_no: current?.estimate?.estimate_no,
        expiry_date: dayjs(current?.estimate?.expiry_date),
        estimate_date: dayjs(current?.estimate?.estimate_date),
        transaction_level_discount_type: current.estimate?.discount_type,
        adjustment: parseFloat(current.estimate.adjustment ?? 0).toFixed(2),
        discount_transaction_level: current.estimate?.discount_transaction_level ?? 0,
        shipping_charge: parseFloat(current.estimate.shipping_charge ?? 0).toFixed(2),
        billing_address_id: current?.estimate?.billing_address
          ? {
              id: current?.estimate?.billing_address?.id,
              label: current?.estimate?.billing_address?.attention
                ? current?.estimate?.billing_address?.attention
                : current?.estimate?.billing_address?.country_name,
            }
          : null,
      });
      const contact_obj = {
        ...current?.estimate?.contact,
        value: current?.estimate?.contact?.id,
        label: current?.estimate?.contact?.display_name,
      };
      setContactObj(contact_obj);
      setBillObj(current?.estimate?.billing_address);
      setitemList(current?.estimate?.estimates_details);
      handlePrimaryWarehouse!(current?.estimate?.warehouse_id);
      setBilling(current?.estimate?.contact?.contact_addresses);
      setFalse();
      setLoader(false);
    }
    //eslint-disable-next-line
  }, [current?.estimate]);

  useEffect(() => {
    handleTotal(totalAmount);
    //eslint-disable-next-line
  }, [totalAmount]);

  useEffect(() => {
    if (isCustomerId) {
      const obj = { ...isCustomerId, value: isCustomerId?.id, label: isCustomerId?.display_name };
      setCurrentCustomer(obj);
      handleCustomerChange(obj);
    }
    //eslint-disable-next-line
  }, [isCustomerId]);

  const getBillLabel = (data) => {
    return (
      <>
        <span className="bill_address_detail cus_name">
          {NaNull(data?.attention) && (
            <>
              {data?.attention}
              <br />
            </>
          )}
        </span>

        <span className="bill_address_detail">
          {NaNull(data?.street) && (
            <>
              {data?.street}
              <br />
            </>
          )}
          {NaNull(data?.street_2) && (
            <>
              {data?.street_2}
              <br />
            </>
          )}
        </span>

        <span className="bill_address_detail">{billAddress3(data)}</span>
      </>
    );
  };
  const billAddress3 = (data) => {
    return `${data?.city ? data?.city + ", " : ""}${data?.state ? data?.state + ", " : ""}${
      data?.zip_code ? data?.zip_code + ", " : ""
    }${data?.country_name ? data?.country_name + "." : ""}`;
  };

  const addBill = () => {
    setCreateBill(true);
    toggleBillModal();
  };

  const handleCustomerChange = (option) => {
    if (option.value === "createNew") {
      toggleCustomerModal();
    } else {
      setContactObj(option);
      Toggle();
      setFalse();
      callAxios({
        method: "get",
        url: `contacts/${option?.id}/addresses`,
      }).then((res) => {
        if (res) {
          setBilling(res);
          form.setFieldsValue({
            payment_terms: option?.payment_terms
              ? {
                  id: option?.payment_terms,
                  label: option?.payment_term_name,
                  payment_term_value: option?.payment_term_value,
                  payment_term_name: option?.payment_term_name,
                }
              : null,
            customer_email: option?.email ? option?.email : null,
          });
          const billing = res?.find((bill) => bill?.address_type === "billing");
          if (billing) {
            setBillObj(billing);
            form.setFieldsValue({
              billing_address_id: {
                id: billing?.id,
                label: billing?.attention ? billing?.attention : billing?.country_name,
              },
            });
          } else if (res?.length) {
            setBillObj(res[0]);
            form.setFieldsValue({
              billing_address_id: {
                id: res[0]?.id,
                label: res[0]?.attention ? res[0]?.attention : res[0]?.country_name,
              },
            });
          } else {
            setBillObj(null);
            form.setFieldsValue({
              billing_address_id: null,
              customer_email: null,
            });
          }
        }
      });
    }
  };

  const SubmitBill = (values) => {
    Toggle();
    callAxios({
      method: editBill ? "put" : "post",
      url: editBill
        ? `${CUSTOMERS}/${contactObj?.id}/addresses/${billObj?.id}`
        : `${CUSTOMERS}/${contactObj?.id}/addresses`,
      data: {
        fax: values.bill_fax,
        city: values.bill_city,
        state: values.bill_state,
        phone: values.bill_phone,
        street: values.bill_street,
        street_2: values.bill_street_2,
        zip_code: values.bill_zip_code,
        attention: values.bill_attention,
        country_id: values.bill_country_id,
        address_type: editBill ? values?.address_type : "additional",
      },
    }).then((res) => {
      if (res) {
        const edit_bill = res?.contact_address?.find((add) => add?.id === billObj?.id);
        let obj = editBill ? edit_bill : res?.data?.at(-1);
        setBillObj(obj);
        toggleBillModal();
        setEditBill(false);
        setCreateBill(false);
        setBillLoading(false);
        setBilling(editBill ? res?.contact_address : res?.data);
        form.setFieldsValue({ billing_address_id: { id: obj?.id, label: obj.attention } });
        Toast({ message: res.message });
      }
    });
  };

  const handleBillEdit = () => {
    toggleBillModal();
    setEditBill(true);
  };

  const handleBillChange = (value) => {
    const filteredBills = billing?.find((bill) => bill.id === value);
    setBillObj(filteredBills);
    form.setFieldsValue({
      billing_address_id: {
        id: value,
        label: filteredBills?.attention ? filteredBills?.attention : filteredBills.country_name,
      },
    });
  };

  const saveButtons: ItemType[] = [
    {
      key: "1",
      label: current?.estimate?.status === "sent" ? "Save as sent" : "Save as sent",
      disabled: loading,
      onClick: () =>
        create
          ? onSubmit({
              values: {
                ...form.getFieldsValue(),
                discount_level: current?.discount_level,
                saveAs: "sent",
              },
            } as any)
          : onSubmit({
              values: {
                ...form.getFieldsValue(),
                discount_level: current?.estimate?.discount_level,
                saveAs: "sent",
              },
            } as any),
    },
    {
      key: "2",
      label: current?.estimate?.status === "sent" ? "Save and Email" : "Save and Email",
      disabled: loading,
      onClick: () =>
        create
          ? onSubmit({
              values: {
                ...form.getFieldsValue(),
                discount_level: current?.discount_level,
                saveAs: "email",
              },
            } as any)
          : onSubmit({
              values: {
                ...form.getFieldsValue(),
                discount_level: current?.estimate?.discount_level,
                saveAs: "email",
              },
            } as any),
    },
  ];
  const disableButton =
    !item[0]?.id ||
    !contactObj?.id ||
    totalAmount < 0 ||
    hasError ||
    amountError ||
    reference?.length > 50;
  return (
    <>
      {Boolean(status) ? (
        <>
          {loader ? (
            <SpinnerX />
          ) : (
            <div className="estimate_product_listing bill_form create_new_estimate_form">
              <PendingInvoiceModal
                module={ESTIMATES}
                visible={pendingInv}
                toggle={togglePendingInvModal}
                url={`/invoices/unpaid/${contactObj?.id}`}
              />
              <CreatePaymentTerm
                paymentModal={paymentModal}
                handleToggle={togglePaymentModal}
                refetch={refetch}
                setPaymentData={(data) => {
                  form.setFieldValue("payment_terms", {
                    id: data?.id,
                    label: data?.name,
                    payment_term_value: data?.value,
                    payment_term_name: data?.name,
                  });
                }}
              />
              <ContactModal
                bool={customerDetail}
                toggle={toggleCustomerDetailModal}
                detail={{ id: contactObj?.id }}
              />

              <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                //@ts-ignore
                onFinish={(values) =>
                  create
                    ? onSubmit({
                        values: { ...values, discount_level: current?.discount_level },
                      } as any)
                    : onSubmit({
                        values: { ...values, discount_level: current?.estimate?.discount_level },
                      } as any)
                }
                name="estimate-form"
                requiredMark={false}
                className="adjust-tbl-main"
                initialValues={initialState}
              >
                <Modal
                  centered
                  width={940}
                  destroyOnClose
                  footer={false}
                  style={{ top: 0 }}
                  open={isBillModal}
                  closeIcon={
                    <img
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/close-modal.svg`}
                      alt="close Icon"
                    />
                  }
                  title={`${editBill ? "Edit Address" : "Add New Address"}`}
                  onCancel={() => {
                    toggleBillModal();
                    setEditBill(false);
                    setCreateBill(false);
                  }}
                  wrapClassName="generic_modal_style address_modal"
                  bodyStyle={{
                    height: "100%",
                  }}
                  className="estimate_modal estimate_md_modal"
                >
                  <AddressModal
                    bool={bool}
                    billing={billing}
                    editBill={editBill}
                    loading={billLoading}
                    onSubmit={SubmitBill}
                    createBill={createBill}
                    setEditBill={setEditBill}
                    setCreateBill={setCreateBill}
                    handleCancel={toggleBillModal}
                    setBillLoading={setBillLoading}
                    url={`${CUSTOMERS}/${contactObj?.id} /addresses/${billObj?.id}`}
                  />
                </Modal>
                <Modal
                  centered
                  width={940}
                  footer={false}
                  destroyOnClose
                  style={{ top: 0 }}
                  title="Add Customer"
                  wrapClassName="generic_modal_style form_generic_modal form---symmetical-gap"
                  open={isCustomerModalOpen}
                  onCancel={toggleCustomerModal}
                  closeIcon={
                    <img
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/close-modal.svg`}
                      alt="close Icon"
                    />
                  }
                  className="estimate_modal estimate_lg_modal"
                >
                  <CreateCustomer
                    isModal
                    isCustomerModalOpen
                    setIsCustomerId={setIsCustomerId}
                    setIsCustomerModalOpen={toggleCustomerModal}
                  />
                </Modal>

                <div className="main_wrapper container-1280">
                  <Breadcrumbx
                    name={edit ? current?.estimate?.estimate_no : "Create New Estimate"}
                    className="item_name"
                  />

                  <div className="_container">
                    <Title level={4} className="form_heading">
                      {!edit ? "New Estimate" : ""}
                    </Title>
                    <div className="flexbox form-row-container justify-content-between left_spacing--req">
                      <div className="estimate_customer form_group flex-47 ">
                        <label className="_for_inline--mb7">
                          Customer<span className="staric">*</span>
                        </label>
                        <SelectDynamicPaginationField
                          required
                          addButton
                          error={""}
                          id="contactId"
                          clearable={false}
                          name="Customer Name"
                          editCust={contactObj}
                          api={ESTIMATE_CONTACT}
                          value={contactObj?.id}
                          newCust={currentCustomer}
                          placeholder={"Select customer"}
                          handleChange={(option) => handleCustomerChange(option)}
                        />
                        <div className="invoice_btn">
                          <div>
                            {contactObj && contactObj?.pending_invoices > 0 && (
                              <Buttonx
                                type="link"
                                htmlType="button"
                                btnText="Pending invoices"
                                className="pending_invoice"
                                clickHandler={togglePendingInvModal}
                              />
                            )}
                          </div>
                          {contactObj && (
                            <Buttonx
                              type="link"
                              htmlType="button"
                              btnText="View details"
                              className="view_detail"
                              clickHandler={toggleCustomerDetailModal}
                            />
                          )}
                        </div>
                      </div>
                      <div className="form_group flex-47 ">
                        {billObj && has_CustomerEdit_permission && (
                          <img
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/edit_profile.svg`}
                            alt="edit icon"
                            className="edit_bill edit--style"
                            onClick={handleBillEdit}
                          />
                        )}
                        <div className="mb-25">
                          <Form.Item
                            label={<span className="_for_inline--mb7">Billing address</span>}
                            className="mb-5"
                            name="billing_address_id"
                          >
                            <Select
                              size="large"
                              disabled={!contactObj}
                              onChange={handleBillChange}
                              placeholder="Select billing address"
                              // className="input_field"
                              getPopupContainer={(trigger) => trigger.parentElement}
                              popupClassName="item_dropdown estimate_biling_list dropdown--scroll flex-unset"
                              options={billing?.map((data) => {
                                return {
                                  label: getBillLabel(data),
                                  value: data?.id,
                                };
                              })}
                              suffixIcon={
                                <img
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/dropdown.svg`}
                                  alt="arrow icon"
                                />
                              }
                              dropdownRender={(menu: any) => (
                                <>
                                  {billing?.length < 6 && (
                                    <Buttonx
                                      type="text"
                                      size="small"
                                      htmlType="button"
                                      btnText="Add new"
                                      disabled={!has_CustomerEdit_permission}
                                      clickHandler={addBill}
                                      icon={<BsPlus size={25} />}
                                      className="btn-form-size btn-primary d-flex justify-center align-center w-100"
                                    />
                                  )}
                                  {menu}
                                </>
                              )}
                            />
                          </Form.Item>
                          {billObj && (
                            <>
                              <span className="bill_address_detail cus_name">
                                {`${
                                  NaNull(billObj?.attention) && NaNull(billObj?.attention) + ","
                                }`}
                              </span>
                              <span className="bill_address_detail">
                                {`${NaNull(billObj?.street) || ""}${
                                  NaNull(billObj?.street_2) ? `, ${NaNull(billObj?.street_2)}` : ""
                                }`}
                              </span>
                              <span className="bill_address_detail">{billAddress3(billObj)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="form_group flex-47 ">
                        <Form.Item
                          name="customer_email"
                          className="input_field"
                          label={<label>Email</label>}
                        >
                          <Text className="text_dark">{customerEmail}</Text>
                        </Form.Item>
                      </div>
                      <div className="form_group flex-47 item-adj">
                        <Selectx
                          showButton
                          loading={false}
                          options={terms}
                          name="payment_terms"
                          label={Labels.PAYMENT_TERMS}
                          handleAddNew={togglePaymentModal}
                          placeholder={Content.payment_terms}
                          className="flex_root input_field gray_border"
                          popupClassName="payment-terms dropdown--scroll"
                        />
                      </div>
                      <div className="form_group flex-47 ">
                        <Form.Item
                          name="estimate_no"
                          className=" input_field estimate_form_estimat_number"
                          label={<label>{Labels.ESTIMATE_NO}</label>}
                        >
                          <Text>{estimate_number}</Text>
                        </Form.Item>
                      </div>
                      <div className="form_group flex-47">
                        <InputField
                          form={form}
                          size="large"
                          name="reference"
                          className="input_field form_reference"
                          label={Labels.REFERENCE_NO}
                          placeholder={Content.reference_number}
                          rules={[
                            { message: "No more than 50 Characters.", max: 50, type: "string" },
                          ]}
                        />
                      </div>
                      <div className="form_group flex-47 cursor_pointer">
                        <DatePickerx
                          isRequired
                          size="large"
                          inputReadOnly
                          allowClear={false}
                          name="estimate_date"
                          label="Estimate date"
                          // disableDate={(current) =>
                          //   current && current < dayjs(todayDate).startOf("day")
                          // }
                          onChange={(date) => {
                            // allowClear;
                            form.setFieldsValue({
                              expiry_date: date.add(Number(duration), time as any),
                            });
                          }}
                          format={org_date_format}
                        />
                      </div>
                      <div className="form_group flex-47 cursor_pointer">
                        <DatePickerx
                          isRequired
                          size="large"
                          label={"Expiry date"}
                          inputReadOnly
                          allowClear={false}
                          name="expiry_date"
                          disableDate={(current) =>
                            current && current < dayjs(estimate_date).startOf("day")
                          }
                          format={org_date_format}
                        />
                      </div>
                      <div className="form_group flex-47 ">
                        <Selectx
                          loading={false}
                          options={sales_person}
                          name="sales_person_id"
                          label={Labels.SALESPERSON}
                          disabled={current?.sales_person_user}
                          placeholder={Content.select_salesperson}
                          className="flex_root input_field gray_border"
                          allowClear={current?.sales_person_user === "sales_manager" ? false : true}
                        />
                      </div>
                      <div className="form_group flex-47 ">
                        <Form.Item
                          label={Labels.NOTES}
                          name="customer_note"
                          className="flex_root text_field form_notes_field"
                        >
                          <TextArea
                            showCount
                            maxLength={1000}
                            rows={4}
                            placeholder={add_notes}
                            onChange={(e: any) => {
                              const { value } = e.target;
                              const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                              form.setFieldValue("customer_note", formattedValue);
                            }}
                          />
                        </Form.Item>
                      </div>
                      <div className="form_group flex-47 ">
                        <Form.Item
                          className="flex_root text_field terms_condition_field"
                          name="terms_and_condition"
                          label={Labels.TERMS_AND_CONDITIONS}
                        >
                          <TextArea
                            showCount
                            rows={4}
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
                    </div>
                    <Title level={4} className="form_heading">
                      Select products/services
                    </Title>
                    <div className="table_outer_container table__hover--feature table-container">
                      <div className="generic-table estimate-table overflow-set ">
                        <ItemTable
                          sales
                          showButton
                          form={form}
                          taxes={taxList}
                          itemList={itemList}
                          itemUrl="/estimates"
                          url={ESTIMATE_ITEMS}
                          ModuleName="Estimate"
                          warehouses={warehouses}
                          adjustment={adjustment}
                          customer_id={contactObj}
                          totalAmount={totalAmount}
                          handleItemList={handleItemList}
                          setTotalAmount={setTotalAmount}
                          shipping_charge={shipping_charge}
                          handleWarehouseId={handleWarehouseId}
                          currency={current?.base_currency?.symbol}
                          edit={current && Object.keys(current).length}
                          handlePrimaryWarehouse={handlePrimaryWarehouse}
                          discount_transaction_level={discount_transaction_level}
                          discount_level={discount_level || current?.estimate?.discount_level}
                          transaction_level_discount_type={transaction_level_discount_type}
                        />
                      </div>

                      <div className="button_flexbox flex-end ">
                        <Buttonx
                          type="default"
                          btnText="Cancel"
                          htmlType="button"
                          className="btn-default btn-form-size cate_cancel_btn"
                          clickHandler={() => (state ? navigate(-1) : navigate(ESTIMATES))}
                        />
                        <div className="d-flex align-center new_prod_btn">
                          <Buttonx
                            block
                            loading={loading}
                            disabled={disableButton || loading}
                            btnText={
                              current?.estimate?.status === "sent" ? "Save as draft" : Labels.SAVE
                            }
                            className={`btn-primary btn-form-size ${
                              !item[0]?.id || !contactObj?.id || totalAmount < 0
                                ? "disabled-save-btn"
                                : ""
                            }`}
                          />
                          <Dropdown
                            placement="topRight"
                            trigger={["click"]}
                            disabled={disableButton}
                            menu={{ items: saveButtons }}
                            className="h-36px p-5 "
                            overlayClassName="dropdown-alignment-generic left-6px"
                          >
                            <span
                              className={`generic-dropdown-icon ${
                                disableButton ? "disabled-svg" : "bg-blue cursor"
                              }`}
                            >
                              <img
                                className="rotate-180deg"
                                src={`${
                                  import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                }/static/media/dropdown.svg`}
                                alt="dropdown"
                              />
                            </span>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
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
    </>
  );
};
