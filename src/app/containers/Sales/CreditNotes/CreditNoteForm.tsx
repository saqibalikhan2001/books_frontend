/** @format */

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Drawer, Dropdown, Form, Input, Modal, Radio, Select, Typography } from "antd";
import dayjs from "dayjs";
import { InvoiceList } from "./Drawer";
import { CreditNoteFormProps } from "./Types";
import CreateCustomer from "../Customers/Create";
import { Content, Labels, endpoints } from "static";
import { CredititemTable } from "./Credititemtable";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { AddressModal } from "../Estimates/AddressModal";
import {
  Toast,
  Icons,
  Buttonx,
  InputField,
  Breadcrumbx,
  DatePickerx,
  ContactModal,
} from "app/shared";
import { SpinnerX } from "app/shared/PageLoader";
import { NaNull, validateQuantityInArray } from "utils";
import { SelectDynamicPaginationField } from "app/Hooks/SelectDynamicPaginationField";
import { useAxios, useCreateFormApi, useStore, useSharedOrganization } from "app/Hooks";

const { TextArea } = Input;
const { Text, Title } = Typography;
const todayDate = dayjs(new Date());
const { CREDIT_NOTE_CONTACTS } = endpoints;

const { BsPlus } = Icons;

const initialState = {
  name: "",
  note: "",
  reference: "",
  adjustment: 0,
  customer_id: null,
  shipping_charge: 0,
  customer_email: "",
  credit_note_no: "",
  terms_and_condition: "",
  type: "linked_invoices",
  billing_address_id: null,
  credit_note_date: todayDate,
};

const CreditNoteForm = ({
  url,
  Edit,
  data,
  items,
  setData,
  loading,
  onSubmit,
  contactObj,
  setCreditId,
  setContactObj,
  setInvoiceId,
  create = false,
  handleItemList,
  isModal = false,
  customerFromCustomer,
  toggleCreditNoteModal,
}: CreditNoteFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { org_date_format } = useStore();
  const [hasError, setError] = useState("");
  const [loader, setLoader] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [billObj, setBillObj] = useState<any>();
  const [billing, setBilling] = useState<any>([]);
  const [editBill, setEditBill] = useState(false);
  const [billLoader, setBillLoader] = useState(false);
  const [createBill, setCreateBill] = useState(false);
  const { getCurrentModule } = useSharedOrganization();
  const [isBillModal, setIsBillModal] = useState(false);
  const [billLoading, setBillLoading] = useState(false);
  const [isCustomerId, setIsCustomerId] = useState<any>();
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [customerDetail, setCustomerDetail] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>();
  const [selectedInvoices, setSelectedInvoices] = useState<any>([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const { status = true } = getCurrentModule("credit-notes") || {};
  const {
    warehouse_list,
    details: current,
    details: { credit_note_no },
    invoice,
    error,
  } = useCreateFormApi(url, Boolean(status));
  const reference = Form.useWatch("reference", form);
  const customerEmail = Form.useWatch("customer_email", form);
  const credit_note_number = Form.useWatch("credit_note_no", form);
  useEffect(() => {
    if (error) {
      toggleCreditNoteModal();
    }
  }, [error]);
  useEffect(() => {
    const handleClick = (event) => {
      if (event) {
        setDrawer(false);
      }
    };
    const captureClick = document.getElementById("captureClick");
    captureClick?.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (drawer) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.removeAttribute("style");
    }
  }, [drawer]);

  useEffect(() => {
    const error: any = validateQuantityInArray(items);
    setError(error);
  }, [items]);

  useEffect(() => {
    if (credit_note_no && !isModal) {
      form.setFieldsValue({ credit_note_no });
      setLoader(false);
    }
  }, [isModal, credit_note_no]);

  useEffect(() => {
    if (current?.invoice && Object.keys(current?.invoice).length) {
      form.setFieldsValue({
        ...current?.invoice?.creditNote,
        credit_note_no: create
          ? current?.credit_note_no
          : current?.invoice?.creditNote?.credit_note_no,
        invoice_no: current?.invoice?.invoice_no,
        billing_address_id: current.invoice?.billing_address
          ? {
              ...current.invoice?.billing_address,
              id: current.invoice?.billing_address?.id,
              label: current.invoice?.billing_address?.attention
                ? current.invoice?.billing_address?.attention
                : current.invoice?.billing_address?.country_name,
            }
          : null,
        credit_note_date: dayjs(current?.invoice?.creditNote?.credit_note_date),
        customer_email: current?.invoice?.customer?.email,
      });
      setInvoiceId(current?.invoice?.id);
      const contact_obj = {
        ...current?.invoice?.customer,
        value: current?.invoice?.customer?.id,
        label: current?.invoice?.customer?.display_name,
      };
      setCurrentCustomer(contact_obj);
      setContactObj(contact_obj);
      setLoader(false);
    }
  }, [current?.invoice, form]);

  useEffect(() => {
    if (isCustomerId && Object.keys(isCustomerId).length) {
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

  useEffect(() => {
    if (selectedInvoices?.length) {
      setData?.({
        ...data,
        deductions: 0,
        issuedCredits: selectedInvoices[0]?.total_issue_able_credits,
      });
      setInvoiceId?.(selectedInvoices[0]?.id);
      setBillObj(selectedInvoices[0]?.billing_address);
    }
  }, [selectedInvoices]);

  const toggleDrawer = () => setDrawer(!drawer);
  const toggleBillModal = () => setIsBillModal(!isBillModal);
  const toggleCustomerDetailModal = () => setCustomerDetail(!customerDetail);
  const toggleCustomerModal = () => setIsCustomerModalOpen(!isCustomerModalOpen);
  const handleSelectedInvoices = useCallback(
    (invoices: any) => setSelectedInvoices([invoices]),
    []
  );

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

  const handleCustomerChange = (option) => {
    setData?.({ issuedCredits: 0, deductions: 0 });
    setSelectedInvoices([]);
    if (option.value === "createNew") {
      toggleCustomerModal();
    } else {
      setContactObj(option);
      if (!isModal) toggleDrawer();

      form.setFieldsValue({ customer_email: option?.email });
      form.setFieldsValue({ billing_address_id: null });
      setBillObj(null);
    }
  };

  const SubmitBill = (values) => {
    setBillLoader(true);
    callAxios({
      method: editBill ? "put" : "post",
      url: editBill
        ? `${endpoints.SUPPLIERS}/${contactObj?.id}/addresses/${billObj?.id}`
        : `${endpoints.SUPPLIERS}/${contactObj?.id}/addresses`,
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
    })
      .then((res) => {
        if (res) {
          Toast({ message: res.message });
          const edit_bill = res?.contact_address?.find((add) => add?.id === billObj?.id);
          let obj = editBill ? edit_bill : res?.data?.at(-1);
          setBillObj(obj);
          toggleBillModal();
          setEditBill(false);
          setCreateBill(false);
          setBillLoader(false);
          setBillLoading(false);
          setBilling(editBill ? res?.contact_address : res?.data);
          form.setFieldsValue({ billing_address_id: { id: obj?.id, label: obj.attention } });
        }
      })
      .catch(() => setBillLoader(false));
  };
  const addBill = () => {
    setCreateBill(true);
    toggleBillModal();
  };

  //@ts-ignore
  const handleBillEdit = () => {
    toggleBillModal();
    setEditBill(true);
  };
  const saveButtons: ItemType[] = [
    {
      key: "1",
      label: "Save as open",
      // hidden: current?.creditNote?.status ? current?.creditNote?.status !== "open" : false,
      onClick: () => {
        handleInvoice.length > 0 && items[0]?.id === null
          ? Toast({ message: "Please select at least one product", type: "info" })
          : onSubmit({
              values: {
                ...form.getFieldsValue(),
                saveAs: "open",
                deduction_status: current?.preferences?.status,
              },
            } as any);
      },
      disabled: Edit && invoice?.creditNote?.status === "open",
    },
    {
      key: "2",
      label: "Save and Email",
      onClick: () => {
        handleInvoice.length > 0 && items[0]?.id === null
          ? Toast({ message: "Please select at least one product", type: "info" })
          : onSubmit({
              values: {
                ...form.getFieldsValue(),
                saveAs: "email",
                deduction_status: current?.preferences?.status,
              },
            } as any);
      },
    },
  ];
  // .filter((col) => !col.hidden);
  const handleDeduction = selectedInvoices.length
    ? selectedInvoices[0]?.total_issue_able_credits < (data?.deductions as any)
    : current?.invoice?.total_issue_able_credits < (data?.deductions as any);
  const handleInvoice = create
    ? selectedInvoices.length
      ? selectedInvoices[0]?.invoice_details
      : current?.invoice?.invoice_details
    : current?.invoice?.creditNote?.credit_note_details;
  const handleDisable =
    (isModal ? create && selectedInvoices.length : create && !selectedInvoices.length) ||
    !contactObj?.id ||
    !!hasError ||
    data.issuedCredits === 0 ||
    (handleInvoice.length > 0 && items[0]?.id === null) ||
    handleDeduction ||
    reference?.length > 50
      ? true
      : false;

  return (
    <>
      {Boolean(status) ? (
        <>
          {loader ? (
            <SpinnerX />
          ) : (
            <>
              <ContactModal
                bool={customerDetail}
                detail={{ id: contactObj?.id }}
                toggle={toggleCustomerDetailModal}
              />
              <Modal
                centered
                width={940}
                destroyOnClose
                footer={false}
                style={{ top: 0 }}
                open={isBillModal}
                className="estimate_modal estimate_md_modal"
                wrapClassName="generic_modal_style address_modal px-30"
                title={`${editBill ? "Edit Address" : "Add New Address"}`}
                onCancel={() => {
                  toggleBillModal();
                  setEditBill(false);
                  setCreateBill(false);
                }}
                bodyStyle={{
                  height: "100%",
                }}
              >
                <AddressModal
                  bool={billLoader}
                  billing={billing}
                  editBill={editBill}
                  loading={billLoading}
                  onSubmit={SubmitBill}
                  createBill={createBill}
                  setEditBill={setEditBill}
                  setCreateBill={setCreateBill}
                  handleCancel={toggleBillModal}
                  setBillLoading={setBillLoading}
                  url={`contacts/${contactObj?.id}/addresses/${billObj?.id}`}
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
                className="estimate_modal estimate_lg_modal form_generic_modal"
                wrapClassName="generic_modal_style form_generic_modal form---symmetical-gap"
                closeIcon={
                  <img
                    alt="close Icon"
                    src={`${
                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                    }/static/media/close-modal.svg`}
                  />
                }
              >
                <CreateCustomer
                  isModal
                  isCustomerModalOpen
                  setIsCustomerId={setIsCustomerId}
                  setIsCustomerModalOpen={toggleCustomerModal}
                />
              </Modal>

              <div className="main_wrapper customer_breadcrumb credit-note-form">
                {contactObj && !isModal && create && (
                  <div className="linked-invoice-btn">
                    <Buttonx
                      btnText=""
                      className="drawer-btn"
                      clickHandler={toggleDrawer}
                      icon={
                        <img
                          className="hover-effect"
                          src={`${
                            import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                          }/static/media/sidenav_collapse.svg`}
                        />
                      }
                    />
                  </div>
                )}
                {!isModal && (
                  <Breadcrumbx
                    className="item_name"
                    name={
                      create
                        ? "Create New Credit note"
                        : current?.invoice?.creditNote?.credit_note_no
                    }
                  />
                )}
                <div>
                  <Drawer
                    // destroyOnClose
                    zIndex={100}
                    placement="right"
                    closable={false}
                    title="Link invoices"
                    onClose={() => {
                      toggleDrawer();
                      // setCreateWithCustomer(null);
                    }}
                    open={!isModal && drawer}
                    getContainer={false}
                  >
                    <InvoiceList
                      form={form}
                      customerId={contactObj?.id}
                      selectedInvoices={selectedInvoices}
                      setLoadingInvoice={setLoadingInvoice}
                      handleSelectedInvoices={handleSelectedInvoices}
                    />
                  </Drawer>
                  <Form
                    form={form}
                    name="item-form"
                    layout="vertical"
                    autoComplete="off"
                    requiredMark={false}
                    initialValues={initialState}
                    onFinish={(values) => {
                      if (handleInvoice.length > 0 && items[0]?.id === null) {
                        Toast({ message: "Please select at least one product", type: "error" });
                      } else {
                        onSubmit({
                          values: { ...values, deduction_status: current?.preferences?.status },
                        });
                      }
                    }}
                  >
                    <div className={`_container  ${isModal ? "px-30" : ""}`}>
                      <Title level={4} className="form_heading">
                        {create ? "New Credit note" : ""}
                      </Title>
                      <div className="flexbox form-row-sm-container justify-content-between flex-column left-gap mb-20">
                        <Form.Item
                          name="type"
                          colon={false}
                          labelAlign="left"
                          label={<label className="credit-note-label">Credit note type</label>}
                        >
                          <Radio.Group>
                            <div className="radio_group">
                              <Radio disabled value="new">
                                New
                              </Radio>
                            </div>
                            <div className="radio_group">
                              <Radio value="linked_invoices">Link invoices</Radio>
                            </div>
                            <div className="radio_group">
                              <Radio disabled value="without_item">
                                Without items
                              </Radio>
                            </div>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                      <div
                        className={`flexbox  justify-content-between form-row-container  ${
                          isModal ? "modal-row-container" : " left-gap"
                        }`}
                      >
                        <div className="estimate_customer form_group flex-47 mb-25 border-clr">
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
                            value={contactObj?.id}
                            newCust={currentCustomer}
                            api={CREDIT_NOTE_CONTACTS}
                            disabled={isModal || !create}
                            placeholder={"Select customer"}
                            handleChange={(option) => handleCustomerChange(option)}
                            // onBlur={() => {
                            //   setFieldTouched('contactId', true);
                            // }}
                          />
                          <div className="invoice_btn">
                            <div>
                              {!isModal && contactObj && selectedInvoices?.length > 0 && (
                                <Buttonx
                                  type="link"
                                  htmlType="button"
                                  className="pending_invoice"
                                  clickHandler={toggleDrawer}
                                  btnText={`${selectedInvoices?.length} linked transaction`}
                                />
                              )}
                            </div>
                            {!isModal && contactObj && (
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
                        <div className="form_group flex-47 border-clr">
                          {/* {billObj && (
                            <FaEdit
                              className="edit_bill"
                              // onClick={handleBillEdit}
                              style={{ cursor: "not-allowed" }}
                            />
                          )} */}
                          <div className="input_field">
                            <Form.Item
                              className="mb-0"
                              name="billing_address_id"
                              label={
                                <span className="form--label_style mb-5"> Billing address</span>
                              }
                            >
                              <Select
                                disabled
                                size="large"
                                // disabled={!contactObj || !create}
                                onChange={handleBillChange}
                                popupClassName="item_dropdown"
                                placeholder="Select billing address"
                                getPopupContainer={(trigger) => trigger.parentElement}
                                suffixIcon={
                                  <img
                                    alt="arrow icon"
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/dropdown.svg`}
                                  />
                                }
                                options={billing?.map((data) => {
                                  return {
                                    label: getBillLabel(data),
                                    value: data?.id,
                                  };
                                })}
                                dropdownRender={(menu) => (
                                  <>
                                    {billing?.length < 6 && (
                                      <Buttonx
                                        type="text"
                                        size="small"
                                        btnText="Add new"
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
                                    NaNull(billObj?.street_2)
                                      ? `, ${NaNull(billObj?.street_2)}`
                                      : ""
                                  }`}
                                </span>
                                <span className="bill_address_detail">{billAddress3(billObj)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="form_group flex-47">
                          <Form.Item
                            className="input_field"
                            name="customer_email"
                            label={<label className="form--label_style mb-5">Email</label>}
                          >
                            <Text className="text_dark">{customerEmail}</Text>
                          </Form.Item>
                        </div>
                        <div className="form_group flex-47 mb--30">
                          {/* <label className="block mb-10">
                            Credit note date<span className="staric">*</span>
                          </label> */}
                          <DatePickerx
                            isRequired
                            size="small"
                            inputReadOnly
                            allowClear={false}
                            name="credit_note_date"
                            format={org_date_format}
                            label={"Credit note date"}
                            popupClassName="frontend_custom--changes"
                          />
                        </div>
                        <div className="form_group flex-47 credit_note_num">
                          <Form.Item
                            name="credit_note_no"
                            className="input_field"
                            label={
                              <label className="form--label_style mb-5">Credit note number</label>
                            }
                          >
                            <Text>{credit_note_number}</Text>
                          </Form.Item>
                        </div>

                        <div className="form_group flex-47">
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
                        <div className="form_group flex-47">
                          <Form.Item
                            name="customer_note"
                            className="input_field flex_root _txt--Stylecatcher"
                            label={<span className="form--label_style mb-5">{Labels.NOTES}</span>}
                          >
                            <TextArea
                              autoSize={{
                                minRows: 4,
                                maxRows: 4,
                              }}
                              placeholder={Content.add_notes}
                              onChange={(e: any) => {
                                const { value } = e.target;
                                const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                                form.setFieldValue("customer_note", formattedValue);
                              }}
                            />
                          </Form.Item>
                        </div>
                        <div className="form_group flex-47">
                          <Form.Item
                            name="terms_and_condition"
                            className="flex_root text_field _txt--Stylecatcher"
                            label={
                              <span className="form--label_style mb-5">
                                {Labels.TERMS_AND_CONDITIONS}
                              </span>
                            }
                          >
                            <TextArea
                              autoSize={{
                                minRows: 4,
                                maxRows: 4,
                              }}
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
                      </div>
                      <Typography.Title level={4} className="form_heading">
                        Select products/services
                      </Typography.Title>
                      <div className="table_outer_container table__hover--feature table-container">
                        <div className="generic-table estimate-table get-perf-gap overflow-set ">
                          <CredititemTable
                            data={data}
                            create={create}
                            details={current}
                            setData={setData}
                            isModal={isModal}
                            customer_id={contactObj}
                            warehouses={warehouse_list}
                            loadingInvoice={loadingInvoice}
                            handleItemList={handleItemList}
                            currency={current?.currency?.symbol}
                            options={
                              selectedInvoices.length
                                ? selectedInvoices[0]?.invoice_details
                                : current?.invoice?.invoice_details
                            }
                            itemList={
                              create
                                ? selectedInvoices.length
                                  ? selectedInvoices[0]?.invoice_details
                                  : current?.invoice?.invoice_details
                                : current?.invoice?.creditNote?.credit_note_details
                            }
                            payment_due={
                              selectedInvoices.length
                                ? selectedInvoices[0]?.payment_due
                                : current?.invoice?.payment_due
                            }
                            issueableCredits={
                              selectedInvoices.length
                                ? selectedInvoices[0]?.total_issue_able_credits
                                : current?.invoice?.total_issue_able_credits
                            }
                          />
                        </div>
                        <div className="button_flexbox flex-end get-perf-gap">
                          <Buttonx
                            type="default"
                            btnText="Cancel"
                            htmlType="button"
                            className={`btn-default btn-form-size cate_cancel_btn ${
                              isModal ? "mb-20" : ""
                            }`}
                            clickHandler={() => {
                              if (isModal) {
                                toggleCreditNoteModal();
                                if (!create) setCreditId(null);
                              } else navigate(-1);
                            }}
                          />
                          <div className="d-flex align-center new_prod_btn">
                            <Buttonx
                              block
                              loading={loading}
                              btnText={Labels.SAVE}
                              disabled={handleDisable}
                              className={`btn-primary btn-form-size ${
                                handleDisable ? "disabled-save-btn" : ""
                              } ${isModal ? "mb-20" : ""}`}
                            />
                            <Dropdown
                              placement="top"
                              trigger={["click"]}
                              disabled={handleDisable}
                              menu={{ items: saveButtons }}
                              className={`p-5 ${isModal ? "mb-20" : ""} `}
                              overlayClassName={`min-md-120 ${
                                isModal ? "overlap  dropdown-alignment-generic" : ""
                              }`}
                              getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                            >
                              <span
                                className={`generic-dropdown-icon ${
                                  handleDisable ? "disabled-svg" : "bg-blue cursor"
                                }`}
                              >
                                <img
                                  className="rotate-180deg"
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/dropdown.svg`}
                                  alt="arrow icon"
                                />
                              </span>
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
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
export default CreditNoteForm;

/** this will be used in future for linked */

{
  /* <Popover
title=""
trigger="click"
content={
  <table style={{ width: "100%" }}>
    <tr>
      <th>ID</th>
      <th>Date</th>
      <th>open</th>
      <th>Amount applied</th>
<th></th> 
    </tr>
    <tr>
      <td>{selectedInvoices[0]?.invoice_no}</td>
      <td>
        {getOrganizationDate(
          selectedInvoices[0]?.invoice_date,
          org_date_format
        )}
      </td>
      <td>{selectedInvoices[0]?.total}</td>
      <td>{selectedInvoices[0]?.total}</td>
       <td>
        {" "}
        <div className="del_btn text_center"></div>
        <Popconfirm
          key="confirm"
          okText="Yes"
          cancelText="No"
          placement="left"
          title={`delete linked invoice?`}
          onConfirm={() => console.log(" i am deleted!")}
        >
          <Button
            size="small"
            className="no_btn"
            
            key="deletebtn"
            aria-disabled="true"
          >
            <Icons.BiTrash size={15} />
          </Button>
        </Popconfirm>
      </td> 
    </tr>
  </table>
}
placement="rightTop"

>
<Button className="pending_invoice" type="link">
  {`${selectedInvoices?.length} linked transaction`}
</Button>
</Popover> */
}
