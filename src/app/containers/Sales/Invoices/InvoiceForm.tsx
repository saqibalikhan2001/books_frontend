/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Divider, Typography, Modal, Select, Dropdown, Alert } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import Title from "antd/es/typography/Title";
import dayjs, { Dayjs } from "dayjs";
import {
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
import { SpinnerX } from "app/shared/PageLoader";
import { AddressModal } from "../Estimates/AddressModal";
import { CustomTermProps, InvoiceFormProps } from "./Types";
import { Content, endpoints, Labels, routeNames } from "static";
import {
  useBool,
  useStore,
  useAxios,
  useTimeZone,
  usePermissions,
  useCreateFormApi,
  useSharedOrganization,
} from "app/Hooks";
import { NaNull, itemObject, optimizeValues, validateQuantityInArray } from "utils";
import { SelectDynamicPaginationField } from "app/Hooks/SelectDynamicPaginationField";
import { CreatePaymentTerm } from "app/containers/Settings/Preferences/PaymentTerm/Create";
import { useGetPaymentTermsQuery } from "store/query/paymentTerm";

const { TextArea } = Input;
const { Text } = Typography;
const { add_notes } = Content;
const { INVOICES } = routeNames;
const { INVOICE_CONTACTS, INVOICE_ITEMS, CUSTOMERS } = endpoints;

export const InvoiceForm = ({
  edit,
  url,
  item,
  loading,
  onSubmit,
  contactObj,
  handleTotal,
  setContactObj,
  toggleModal,
  handleItemList,
  isModal = false,
  discount_level = "",
  customerFromCustomer,
}: InvoiceFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setFalse } = useBool(true);
  const { state }: any = useLocation();
  const [hasError, setError] = useState("");
  const [loader, setLoader] = useState(true);
  const { checkPermission } = usePermissions();
  const [billObj, setBillObj] = useState<any>();
  const { callAxios, bool, toggle } = useAxios();
  const [billing, setBilling] = useState<any>([]);
  const [editBill, setEditBill] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [itemList, setitemList] = useState<any>([]);
  const [createBill, setCreateBill] = useState(false);
  const { getCurrentModule } = useSharedOrganization();
  const [billLoading, setBillLoading] = useState(false);
  const [isBillModal, setIsBillModal] = useState(false);
  const [isCustomerId, setIsCustomerId] = useState<any>();
  const [paymentModal, setPaymentModal] = useState(false);
  const [pendingInv, setPendingInvModal] = useState(false);
  const [customerDetail, setCustomerDetail] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>();
  const [isItemModalOpen, setisItemModalOpen] = useState(false);
  const { status = true } = getCurrentModule("invoices") || {};
  const { data: terms = [], refetch } = useGetPaymentTermsQuery("");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const { has_CustomerEdit_permission } = checkPermission("CustomerEdit");
  const { primary_organization, org_date_format, TimeZone, user_id } = useStore();
  const reference = Form.useWatch("reference", form);
  const term = Form.useWatch("invoice_terms", form);
  const adjustment = Form.useWatch("adjustment", form);
  const invoice_number = Form.useWatch("invoice_no", form);
  const invoice_date = Form.useWatch("invoice_date", form);
  const customerEmail = Form.useWatch("customer_email", form);
  const shipping_charge = Form.useWatch("shipping_charge", form);
  const discount_transaction_level = Form.useWatch("discount_transaction_level", form);
  const transaction_level_discount_type = Form.useWatch("transaction_level_discount_type", form);

  const { handleDate } = useTimeZone(primary_organization?.time_zone || "");
  const {
    taxList,
    warehouses,
    sales_person,
    // formLoading,
    details: current,
    details: { invoice_no, invoice_preference },
  } = useCreateFormApi(url, Boolean(status));
  const { dateWithOrgTZ } = useTimeZone(`${TimeZone}`);
  const todayDate = dayjs(dateWithOrgTZ(dayjs(new Date())));
  const defaultTerm = terms?.find((t) => t?.value === "custom");

  const disableButton = !item[0]?.id || !contactObj?.id || hasError || reference?.length > 50;

  const initialState = {
    note: "",
    terms: null,
    order_no: "",
    adjustment: { sign: "+", value: 0 },
    reference: "",
    invoice_no: null,
    warehouse_id: null,
    shipping_charge: 0,
    customer_email: "",
    invoice_terms: null,
    sales_person_id: null,
    terms_and_condition: "",
    invoice_date: todayDate,
    discount_transaction_level: 0,
    due_date: todayDate.add(7, "day"),
    transaction_level_discount_type: "percent",
  };

  const memoizeFilter = useMemo(
    () =>
      terms.filter(
        (val: { id: number }) => val.id === (typeof term === "object" ? term?.id : term)
      )[0] || {},
    [terms, term]
  );
  const customDate = handleDate(memoizeFilter.value, invoice_date);
  useEffect(() => {
    const error = validateQuantityInArray(item);
    //@ts-ignore
    setError(error);
  }, [item]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (customDate && customDate.isValid()) form.setFieldsValue({ due_date: customDate });
    // else if (memoizeFilter.value) form.setFieldsValue({ due_date: invoice_date });
  }, [customDate, invoice_date]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (invoice_no) {
      form.setFieldsValue({
        invoice_no,
        sales_person_id:
          current.sales_person_user === "sales_person"
            ? sales_person[0].id
            : current.sales_person_user !== "sales_person"
            ? sales_person?.find((p) => p.id === user_id)?.id
            : null,
      });
      form.setFieldValue("terms_and_condition", invoice_preference?.terms);
      setLoader(false);
    }
  }, [invoice_no, current?.invoice_preference?.terms, terms]);

  useEffect(() => {
    if (state?.itemDetail) {
      setitemList([itemObject(state?.itemDetail)]);
    }
  }, [state?.itemDetail]);

  useEffect(() => {
    if (isModal && current?.estimates && Object.keys(current?.estimates).length) {
      const paymentTerm = terms?.find(
        (t) =>
          t?.value === current?.estimates?.payment_term_value &&
          t?.name === current?.estimates?.payment_term_name
      );
      form.setFieldsValue({
        ...current,
        ...current?.estimates,
        order_no: current?.estimates?.estimate_no,
        invoice_date: dayjs(current?.estimates?.estimate_date),
        discount_transaction_level: current.estimates?.discount_transaction_level,
        transaction_level_discount_type: current.estimates?.discount_type,
        shipping_charge: parseFloat(current.estimates.shipping_charge ?? 0).toFixed(2),
        adjustment: optimizeValues(current.estimates.adjustment),
        billing_address_id: current?.estimates?.billing_address
          ? {
              id: current?.estimates?.billing_address?.id,
              label: current?.estimates?.billing_address?.attention
                ? current?.estimates?.billing_address?.attention
                : current?.estimates?.billing_address?.country_name,
            }
          : null,
        invoice_terms:
          paymentTerm ??
          terms.find(
            (val: { name: string }) => val.name === current?.estimates?.payment_term_value
          ),
      });
      const contact_obj = {
        ...current?.estimates?.contact,
        value: current?.estimates?.contact?.id,
        label: current?.estimates?.contact?.display_name,
      };
      setContactObj(contact_obj);
      setBillObj(current?.estimate?.billing_address);
      setBilling(current?.customers?.contact_addresses);
      setitemList(current?.estimates?.estimates_details);
      setFalse();
      setLoader(false);
    }
  }, [current?.estimates, isModal]);

  useEffect(() => {
    if (isModal && current?.sales_order && Object.keys(current?.sales_order).length) {
      form.setFieldsValue({
        ...current,
        ...current?.sales_order,

        invoice_terms: terms.filter((val: { name: string }) => val.name === "Net 30")[0] || {},
      });
      setitemList(current?.sales_order?.sales_order_item_details);
      setFalse();
      setLoader(false);
    }
  }, [current?.sales_order, isModal]);

  useEffect(() => {
    if (current?.invoice_info && Object.keys(current?.invoice_info).length) {
      const paymentTerm = terms?.find(
        (t) =>
          t?.value === current?.invoice_info?.invoice_term_value &&
          t?.name === current?.invoice_info?.invoice_term_name
      );
      form.setFieldsValue({
        ...current.invoice_info,
        invoice_no: current?.invoice_info?.invoice_no,
        invoice_date: dayjs(current?.invoice_info?.invoice_date),
        due_date: dayjs(current?.invoice_info?.due_date),
        invoice_terms: paymentTerm,
        discount_transaction_level: current.invoice_info?.discount_transaction_level,
        transaction_level_discount_type: current.invoice_info?.discount_type,
        shipping_charge: parseFloat(current.invoice_info.shipping_charge ?? 0).toFixed(2),
        adjustment: optimizeValues(current.invoice_info.adjustment),
        billing_address_id: current?.invoice_info?.billing_address
          ? {
              id: current?.invoice_info?.billing_address?.id,
              label: current?.invoice_info?.billing_address?.attention
                ? current?.invoice_info?.billing_address?.attention
                : current?.invoice_info?.billing_address?.country_name,
            }
          : null,
        customer_email: current?.invoice_info?.customer?.email,
      });
      const contact_obj = {
        ...current?.invoice_info?.customer,
        pending_invoices: current?.customers[0]?.pending_invoices,
        value: current?.invoice_info?.customer?.id,
        label: current?.invoice_info?.customer?.display_name,
      };
      setContactObj(contact_obj);
      setBillObj(current?.invoice_info?.billing_address);
      setitemList(current?.invoice_info?.invoice_details);
      setBilling(current?.invoice_info?.customer?.contact_addresses);
      setFalse();
      setLoader(false);
    }
  }, [current?.invoice_info, form]);

  useEffect(() => {
    handleTotal(totalAmount);
  }, [totalAmount]);
  useEffect(() => {
    if (isCustomerId) {
      const obj = { ...isCustomerId, value: isCustomerId?.id, label: isCustomerId?.display_name };
      setCurrentCustomer(obj);
      handleCustomerChange(obj);
    }
    //eslint-disable-next-line
  }, [isCustomerId]);

  useEffect(() => {
    if (customerFromCustomer && Object.keys(customerFromCustomer).length) {
      const obj = {
        ...customerFromCustomer,
        value: customerFromCustomer?.id,
        label: customerFromCustomer?.display_name,
      };
      setCurrentCustomer(obj);
      handleCustomerChange(obj);
    }
    //eslint-disable-next-line
  }, [customerFromCustomer]);

  const custom =
    terms.filter(
      (val: CustomTermProps) =>
        val.id === (typeof term === "object" ? term?.id : term) && val.label === "Custom"
    )[0] || {};

  // const org_terms = terms.filter(({ deletable }: { deletable: number }) => deletable) || [];
  const toggleCustomerModal = () => setIsCustomerModalOpen(!isCustomerModalOpen);

  const handleCustomerChange = (option) => {
    if (option.value === "createNew") {
      toggleCustomerModal();
    } else {
      setContactObj(option);
      toggle();
      setFalse();
      callAxios({
        url: `contacts/${option.id}/addresses`,
      }).then((res) => {
        if (res) {
          setBilling(res);
          form.setFieldsValue({
            invoice_terms: option?.payment_terms
              ? {
                  id: Number(option?.payment_terms),
                  label: option?.payment_term_name,
                  value: option?.payment_term_value,
                  name: option?.payment_term_name,
                }
              : defaultTerm,
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

  const getBillLabel = (data) => {
    return (
      <>
        <span className="bill_address_detail cus_name mb-0">
          {NaNull(data?.attention) && <>{data?.attention}</>}
        </span>

        <span className="bill_address_detail mb-0">
          {NaNull(data?.street) && <>{data?.street}</>}
          {NaNull(data?.street_2) && <>{data?.street_2}</>}
        </span>

        <span className="bill_address_detail mb-0">{billAddress3(data)}</span>
      </>
    );
  };
  const billAddress3 = (data) => {
    return `${data?.city ? data?.city + ", " : ""}${data?.state ? data?.state + ", " : ""}${
      data?.zip_code ? data?.zip_code + ", " : ""
    }${data?.country_name ? data?.country_name + "." : ""}`;
  };

  const SubmitBill = (values) => {
    toggle();
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
        form.setFieldsValue({ billing_address_id: { id: obj?.id, label: obj?.attention } });
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
        label: filteredBills?.attention ? filteredBills?.attention : filteredBills?.country_name,
      },
    });
  };

  const addBill = () => {
    setCreateBill(true);
    toggleBillModal();
  };

  const toggleBillModal = () => {
    return setIsBillModal(!isBillModal);
  };

  const toggleItemModal = () => setisItemModalOpen(!isItemModalOpen);
  const togglePendingInvModal = () => setPendingInvModal(!pendingInv);
  const toggleCustomerDetailModal = () => setCustomerDetail(!customerDetail);
  const togglePaymentModal = () => setPaymentModal(!paymentModal);

  const handleDateChange = (date: Dayjs | null) => {
    form.setFieldsValue({ invoice_date: date });
    if (date && date > form.getFieldValue("due_date")) form.setFieldsValue({ due_date: date });
  };

  const saveButtons: ItemType[] = [
    {
      key: "1",
      label: "Save as sent",
      onClick: () =>
        !edit
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
                discount_level: current?.invoice_info?.discount_level,
                saveAs: "sent",
              },
            } as any),
      disabled: loading,
    },
    {
      key: "2",
      label: "Save and Email",
      onClick: () =>
        !edit
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
                discount_level: current?.invoice_info?.discount_level,
                saveAs: "email",
              },
            } as any),
      disabled: loading,
    },
  ];
  return (
    <>
      {Boolean(status) ? (
        <>
          {loader ? (
            <SpinnerX />
          ) : (
            <div className="estimate_product_listing bill_form create_invoice_form">
              <PendingInvoiceModal
                module={INVOICES}
                visible={pendingInv}
                toggle={togglePendingInvModal}
                url={`/invoices/unpaid/${contactObj?.id}`}
              />
              <CreatePaymentTerm
                refetch={refetch}
                paymentModal={paymentModal}
                handleToggle={togglePaymentModal}
                setPaymentData={(data) => {
                  form.setFieldValue("invoice_terms", {
                    id: data?.id,
                    label: data?.name,
                    value: data?.value,
                    name: data?.name,
                  });
                }}
              />

              <ContactModal
                bool={customerDetail}
                detail={{ id: contactObj?.id }}
                toggle={toggleCustomerDetailModal}
              />

              <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                name="invoice-form"
                requiredMark={false}
                className="adjust-tbl-main"
                initialValues={initialState}
                onFinish={(values) =>
                  !edit
                    ? onSubmit({
                        values: { ...values, discount_level: current?.discount_level },
                      } as any)
                    : onSubmit({
                        values: {
                          ...values,
                          discount_level: current?.invoice_info?.discount_level,
                        },
                      } as any)
                }
              >
                <Modal
                  width={940}
                  footer={false}
                  destroyOnClose
                  centered={true}
                  open={isBillModal}
                  onCancel={toggleBillModal}
                  className="estimate_modal estimate_md_modal"
                  wrapClassName="generic_modal_style address_modal px-30"
                  title={`${editBill ? "Edit Address" : "Add New Address"}`}
                  closeIcon={
                    <img
                      alt="close Icon"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/close-modal.svg`}
                    />
                  }
                  bodyStyle={{
                    height: "100%",
                  }}
                >
                  <AddressModal
                    bool={bool}
                    billing={billing}
                    editBill={editBill}
                    onSubmit={SubmitBill}
                    loading={billLoading}
                    createBill={createBill}
                    setEditBill={setEditBill}
                    setCreateBill={setCreateBill}
                    handleCancel={toggleBillModal}
                    setBillLoading={setBillLoading}
                    url={`${CUSTOMERS}/${contactObj?.id}/addresses/${billObj?.id}`}
                  />
                </Modal>
                <Modal
                  centered
                  width={940}
                  footer={false}
                  destroyOnClose
                  style={{ top: 0 }}
                  title="Add Customer"
                  open={isCustomerModalOpen}
                  onCancel={toggleCustomerModal}
                  wrapClassName=" estimate_modal estimate_lg_modal generic_modal_style form_generic_modal form---symmetical-gap"
                  closeIcon={
                    <img
                      alt="close Icon"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/close-modal.svg`}
                    />
                  }
                  bodyStyle={{
                    height: "100%",
                  }}
                >
                  <CreateCustomer
                    isModal
                    isCustomerModalOpen
                    setIsCustomerId={setIsCustomerId}
                    setIsCustomerModalOpen={toggleCustomerModal}
                  />
                </Modal>
                <div className={`main_wrapper container-1280 ${isModal ? "px-0 mx-0" : ""}`}>
                  {!isModal && (
                    <Breadcrumbx
                      name={edit ? current?.invoice_info?.invoice_no : "Create New Invoice"}
                      className="item_name"
                    />
                  )}
                  <div className="_container">
                    <Title level={4} className="form_heading">
                      {!edit ? "New Invoice" : ""}
                    </Title>
                    <div
                      className={`flexbox form-row-container justify-content-between left_spacing--req ${
                        isModal ? "modal-row-container" : ""
                      }`}
                    >
                      <div className="estimate_customer form_group flex-47 ">
                        <label className="form--label_style mb-5">
                          Customer <span className="staric">*</span>
                        </label>
                        <SelectDynamicPaginationField
                          required
                          addButton
                          error={""}
                          id="contactId"
                          clearable={false}
                          name="Customer Name"
                          editCust={contactObj}
                          api={INVOICE_CONTACTS}
                          value={contactObj?.id}
                          newCust={currentCustomer}
                          disabled={current?.estimates}
                          placeholder={"Select customer"}
                          handleChange={(option) => handleCustomerChange(option)}
                          Icon={
                            <img
                              src={`${
                                import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                              }/static/media/dropdown.svg`}
                            />
                          }
                        />
                        <div className="invoice_btn">
                          <div>
                            {!isModal && contactObj?.pending_invoices > 0 && (
                              <Buttonx
                                type="link"
                                htmlType="button"
                                btnText="Pending invoices"
                                className="pending_invoice"
                                clickHandler={togglePendingInvModal}
                              />
                            )}
                          </div>

                          {contactObj && !isModal && (
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
                      <div className="form_group flex-47">
                        {!isModal && billObj && has_CustomerEdit_permission && (
                          <img
                            alt="edit icon"
                            onClick={handleBillEdit}
                            className="edit_bill edit--style"
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/edit_profile.svg`}
                          />
                        )}
                        <div className="mb-25">
                          <Form.Item
                            className="mb-5"
                            label={
                              <span className="form--label_style" style={{ marginBottom: 7 }}>
                                Billing address
                              </span>
                            }
                            name="billing_address_id"
                          >
                            <Select
                              size="large"
                              disabled={!contactObj}
                              onChange={handleBillChange}
                              // className="input_field"
                              getPopupContainer={(trigger) => trigger.parentElement}
                              suffixIcon={
                                <img
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/dropdown.svg`}
                                />
                              }
                              placeholder="Select billing address"
                              popupClassName={`item_dropdown billing_dropdown dropdown--scroll ${
                                isModal ? "overlap" : ""
                              }`}
                              options={billing?.map((data) => {
                                return {
                                  label: getBillLabel(data),
                                  value: data.id,
                                };
                              })}
                              dropdownRender={(menu) => (
                                <>
                                  {billing?.length < 6 && (
                                    <Buttonx
                                      type="text"
                                      size="small"
                                      htmlType="button"
                                      btnText="Add new"
                                      clickHandler={addBill}
                                      disabled={isModal || !has_CustomerEdit_permission}
                                      className="btn-form-size btn-primary d-flex justify-center align-center w-100"
                                      icon={
                                        <img
                                          src="https://s3.us-west-2.amazonaws.com/ims-development/static/media/plus_2x.svg"
                                          className="brightness mr-10"
                                          alt="plus icon"
                                        />
                                      }
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
                          className="input_field"
                          name="customer_email"
                          label={<label className="form--label_style mb-5">Email</label>}
                        >
                          <Text className="text_dark">{customerEmail}</Text>
                        </Form.Item>
                      </div>
                      <div className="form_group flex-47 item-adj">
                        <Selectx
                          showButton
                          options={terms}
                          loading={false}
                          name="invoice_terms"
                          label={Labels.PAYMENT_TERMS}
                          handleAddNew={togglePaymentModal}
                          className="input_field gray_border"
                          placeholder={Content.payment_terms}
                          popupClassName="payment-terms dropdown--scroll"
                        />
                      </div>
                      <div className="form_group flex-47 ">
                        <DatePickerx
                          isRequired
                          inputReadOnly
                          allowClear={false}
                          name="invoice_date"
                          onChange={handleDateChange}
                          format={org_date_format}
                          label={<label>{Labels.INVOICE_DATE}</label>}
                          popupClassName={`${isModal ? "overlap" : ""}`}
                          disableDate={(curr) =>
                            curr &&
                            current?.estimates?.estimate_date &&
                            curr < dayjs(current?.estimates?.estimate_date).startOf("day")
                          }
                        />
                      </div>
                      <div className="form_group flex-47 ">
                        <DatePickerx
                          inputReadOnly
                          name="due_date"
                          label={Labels.DUE_DATE}
                          format={org_date_format}
                          disabled={!Object.keys(custom).length}
                          popupClassName="generic_item_dropdown overlap"
                          disableDate={(current) =>
                            current && current < dayjs(invoice_date).startOf("day")
                          }
                        />
                      </div>
                      <div className="form_group flex-47">
                        <Form.Item
                          name="invoice_no"
                          className="input_field"
                          label={
                            <label className="form--label_style mb-0">{Labels.INVOICE_NO}</label>
                          }
                        >
                          <Text>{invoice_number}</Text>
                        </Form.Item>
                      </div>
                      <div className="form_group flex-47 ">
                        <InputField
                          form={form}
                          size="large"
                          name="reference"
                          label={Labels.REFERENCE_NO}
                          placeholder={Content.reference_number}
                          className="form_reference input_field"
                          rules={[
                            { message: "No more than 50 Characters.", max: 50, type: "string" },
                          ]}
                        />
                      </div>
                      <div className="form_group flex-47 ">
                        <InputField
                          form={form}
                          size="large"
                          name="order_no"
                          disabled={isModal}
                          label={Labels.ORDER_NO}
                          className="input_field"
                          placeholder="Enter order number"
                        />
                      </div>
                      <div className="form_group flex-47 item-adj">
                        <Selectx
                          loading={false}
                          options={sales_person}
                          name="sales_person_id"
                          label={Labels.SALESPERSON}
                          className="input_field gray_border"
                          disabled={current?.sales_person_user}
                          placeholder={Content.select_salesperson}
                          // popupCl  assName="generic_item_dropdown overlap"
                          allowClear={current?.sales_person_user === "sales_manager" ? false : true}
                        />
                      </div>

                      <div className="form_group flex-47 ">
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
                      <div className="form_group flex-47 ">
                        <Form.Item
                          name="note"
                          className="text_field flex_root"
                          label={<span className="form--label_style mb-5">{Labels.NOTES}</span>}
                        >
                          <TextArea
                            showCount
                            rows={4}
                            maxLength={1000}
                            placeholder={add_notes}
                            onChange={(e: any) => {
                              const { value } = e.target;
                              const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                              form.setFieldValue("note", formattedValue);
                            }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <Title level={4} className="form_heading">
                      Select products/services
                    </Title>
                    <div className="table-container">
                      <div className="generic-table estimate-table table__hover--feature overflow-set ">
                        <ItemTable
                          sales
                          showButton
                          form={form}
                          edit={edit}
                          taxes={taxList}
                          current={current}
                          isModal={isModal}
                          itemList={itemList}
                          itemUrl="/invoices"
                          url={INVOICE_ITEMS}
                          ModuleName="Invoice"
                          adjustment={adjustment}
                          warehouses={warehouses}
                          totalAmount={totalAmount}
                          customer_id={contactObj}
                          handleAddNew={toggleItemModal}
                          handleItemList={handleItemList}
                          setTotalAmount={setTotalAmount}
                          shipping_charge={shipping_charge}
                          currency={current?.base_currency?.symbol}
                          discount_transaction_level={discount_transaction_level}
                          discount_level={isModal ? discount_level : current?.discount_level}
                          transaction_level_discount_type={transaction_level_discount_type}
                        />
                      </div>
                      {!current && <Divider />}
                      <div className="button_flexbox flex-end ">
                        <Buttonx
                          type="default"
                          btnText="Cancel"
                          htmlType="button"
                          className="btn-default btn-form-size cate_cancel_btn mr-20"
                          clickHandler={() =>
                            isModal ? toggleModal?.() : state ? navigate(-1) : navigate(INVOICES)
                          }
                        />
                        <div className="d-flex align-center new_prod_btn">
                          <Buttonx
                            block
                            loading={loading}
                            btnText={Labels.SAVE}
                            //@ts-ignore
                            disabled={disableButton || loading}
                            className={`btn-primary btn-form-size ${
                              disableButton ? "disabled-save-btn" : ""
                            }`}
                          />
                          <Dropdown
                            placement="topRight"
                            trigger={["click"]}
                            className="h-36px p-5 "
                            menu={{ items: saveButtons }}
                            getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                            // overlayClassName="dropdown-alignment-generic left-6px"
                            //@ts-ignore
                            disabled={disableButton || loading}
                            overlayClassName={`dropdown-alignment-generic ${
                              isModal ? "overlap" : " "
                            }`}
                          >
                            <span
                              className={`generic-dropdown-icon ${
                                disableButton ? "disabled-svg" : "bg-blue cursor"
                              }`}
                            >
                              <img
                                alt="arrow icon"
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
