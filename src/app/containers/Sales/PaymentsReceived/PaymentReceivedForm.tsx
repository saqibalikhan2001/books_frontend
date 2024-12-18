/** @format */

import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Modal,
  Button,
  Popover,
  Checkbox,
  Dropdown,
  Statistic,
  Typography,
  // AutoComplete,
  Alert,
} from "antd";
import dayjs from "dayjs";
import { TooltipX } from "app/shared/ToolTip";
import { FindByInvoice } from "./FindByInvoice";
import CreateCustomer from "../Customers/Create";
import { SpinnerX } from "app/shared/PageLoader";
import { InvoiceListing } from "./InvoiceListing";
import { calculateAmountReceived, rules } from "utils";
import { ItemType } from "antd/es/menu/hooks/useItems";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { Content, endpoints, Labels, routeNames } from "static";
import { InvoiceDataSourceProps, PaymentReceivedFormProps } from "./Types";
import { SelectDynamicPaginationField } from "app/Hooks/SelectDynamicPaginationField";
import { useBool, useCreateFormApi, useAxios, useStore, useSharedOrganization } from "app/Hooks";
import {
  Buttonx,
  Selectx,
  InputField,
  DatePickerx,
  Breadcrumbx,
  ContactModal,
  InputNumberX,
} from "app/shared";

const { TextArea } = Input;
const { Text, Title } = Typography;
const todayDate = dayjs(new Date());
const { PAYMENTS_RECEIVED } = routeNames;
const { PAYMENT_RECEIVED_CONTACT, PAYMENT_RECEIVED_CREATE } = endpoints;
const { findByInvoicePop, calculatedTranaction, totalChargesPop } = Content;

const initialState = {
  note: "",
  reference: "",
  payment: 0,
  payment_no: null,
  customer_id: null,
  payment_mode: null,
  payment_date: todayDate,
};

export const PaymentReceivedForm = ({
  url,
  edit,
  loading,
  onSubmit,
  UsedAmount,
  contactObj,
  invoiceData,
  setContactObj,
  handlePaymentId,
  handleUsedAmount,
  handleInvoiceList,
}: PaymentReceivedFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setFalse } = useBool();
  const { org_date_format } = useStore();
  const [loader, setLoader] = useState(true);
  const [checked, setChecked] = useState(false);
  const [popOver, setPopOver] = useState(false);
  const { getCurrentModule } = useSharedOrganization();
  const [isCustomerId, setIsCustomerId] = useState<any>();
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [customerDetail, setCustomerDetail] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const { callAxios, bool: invoice_loading, toggle: refetch } = useAxios();
  const { status = true } = getCurrentModule("payment-received") || {};
  const [invoiceListing, setInvoiceListing] = useState<InvoiceDataSourceProps[]>([]);
  const { status: invoicesPermission = undefined } = getCurrentModule("invoices") || {};

  const {
    paymentModes,
    details: current,
    details: { payment_no },
  } = useCreateFormApi(url, Boolean(status));

  const payment = Form.useWatch("payment", form);
  const reference = Form.useWatch("reference", form);
  const payment_number = Form.useWatch("payment_no", form);
  const customerEmail = Form.useWatch("customer_email", form);

  useEffect(() => {
    if (payment_no) {
      form.setFieldsValue({ payment_no, payment_mode: paymentModes[0]?.value });
      setLoader(false);
    }
  }, [payment_no, paymentModes]);

  useEffect(() => {
    if (isCustomerId) {
      const obj = { ...isCustomerId, value: isCustomerId?.id, label: isCustomerId?.display_name };
      setCurrentCustomer(obj);
      handleCustomerChange(obj);
    }
  }, [isCustomerId]);

  useEffect(() => {
    if (current?.advance_payment && Object.keys(current?.advance_payment).length) {
      form.setFieldsValue({
        ...current?.advance_payment,
        payment_date: dayjs(current?.advance_payment?.payment_date),
      });
      const contact_obj = {
        ...current?.customer_list[0],
        value: current?.customer_list[0]?.id,
        label: current?.customer_list[0]?.display_name,
      };
      setContactObj(contact_obj);
      setInvoiceListing(current?.invoices);
      handleInvoiceList(current?.invoices);
      handlePaymentId?.(current?.advance_payment?.id);
      setReceivedAmount(current?.received_full_amount.toFixed(2));
      handleUsedAmount(calculateAmountReceived(current?.invoices));
      form.setFieldsValue({ payment: current?.advance_payment?.payment });
      setFalse();
    }
  }, [current?.advance_payment, form]);

  const handleChangePop = () => setPopOver(!popOver);

  const toggleCustomerModal = () => setIsCustomerModalOpen(!isCustomerModalOpen);
  const toggleCustomerDetailModal = () => setCustomerDetail(!customerDetail);

  const handleCustomerChange = (value: any, inv_no?: any) => {
    if (value.value === "createNew") {
      toggleCustomerModal();
    } else {
      refetch();
      setContactObj(value);
      callAxios({
        url: `${PAYMENT_RECEIVED_CREATE}?customer_id=${value.id}`,
      }).then((res: any) => {
        form.setFieldsValue({
          customer_email: value?.email ? value?.email : null,
        });
        setReceivedAmount(res.received_full_amount.toFixed(2));
        setChecked(false);
        const listing_with_payment = res.invoices?.map((item: any) => ({
          ...item,
          payment: inv_no == item.invoice_no ? item.payment_due : null,
        }));
        if (inv_no) {
          setInvoiceListing(listing_with_payment);
        } else {
          setInvoiceListing(res.invoices);
        }
        handleInvoiceList(listing_with_payment);
      });
      setFalse();
    }
  };
  const saveButtons: ItemType[] = [
    {
      key: "1",
      label: "Save and Email",
      onClick: () => onSubmit({ ...form.getFieldsValue(), saveAs: "email" } as any),
    },
  ];
  const handlePayment = (e: ChangeEvent<HTMLInputElement>, row: any) => {
    const currentIndex = invoiceListing.findIndex((inv) => inv.id === row.id);
    let newNumber = e.target.value;
    if (newNumber.length > 10) {
      newNumber = newNumber?.slice(0, 10);
    }
    const newData = [...invoiceListing];
    newData[currentIndex] = {
      ...newData[currentIndex],
      [e.target.name]:
        Number(newNumber) > Number(row?.payment_due) ? Number(row?.payment_due) : Number(newNumber),
    };
    setInvoiceListing(newData);
    handleInvoiceList(newData);
    handleUsedAmount(calculateAmountReceived(newData));
  };

  const handlePaymentClear = () => {
    const newData = [...invoiceListing];
    newData.forEach((data) => {
      data.payment = null as any;
    });
    setInvoiceListing(newData);
    handleInvoiceList(newData);
    handleUsedAmount(calculateAmountReceived(newData));
  };
  const handlePayInFull = (_: any, { payment_due, id }: { payment_due: number; id: number }) => {
    const currentIndex = invoiceListing.findIndex((inv) => inv.id === id);
    const newData = [...invoiceListing];
    newData[currentIndex] = {
      ...newData[currentIndex],
      payment: payment_due,
    };
    setInvoiceListing(newData);
    handleInvoiceList(newData);
    handleUsedAmount(calculateAmountReceived(newData));
  };

  const handleCheckBox = (e: CheckboxChangeEvent) => {
    const Data = [...invoiceListing];
    setChecked(e.target.checked);
    // form.setFieldsValue({ payment: receivedAmount || current?.received_full_amount });
    form.setFieldsValue({
      payment: !checked
        ? receivedAmount || current?.advance_payment?.payment
        : receivedAmount || current?.advance_payment?.payment,
    });
    handleUsedAmount(!checked ? receivedAmount : 0);
    const newData = Data.map((data: InvoiceDataSourceProps) => ({
      ...data,
      payment: !checked ? data.payment_due : 0,
    }));
    setInvoiceListing(newData);
    handleInvoiceList(newData);
  };
  const handleAmountReceived = (value: any) => {
    value &&
      form.setFieldsValue({
        payment: Number(value),
      });
  };
  const isCustomerSelected = !!contactObj;
  const disableButton = Boolean(payment < UsedAmount) || reference?.length > 50 ? true : false;
  return (
    <>
      {Boolean(status) ? (
        <>
          {loader ? (
            <SpinnerX />
          ) : (
            <div className="create_payment_receipt_form">
              <Form
                form={form}
                name="item-form"
                layout="vertical"
                autoComplete="off"
                onFinish={onSubmit}
                requiredMark={false}
                className="adjust-tbl-main"
                initialValues={initialState}
              >
                <div className="main_wrapper container-1280">
                  <Breadcrumbx
                    name={
                      current.advance_payment
                        ? `Payment receipt No.${form.getFieldValue("payment_no")}`
                        : "Create New Payment receipt"
                    }
                    className="item_name"
                  />

                  <div className="_container payment_receipt_container">
                    <Title level={4} className="form_heading">
                      {current.advance_payment ? "" : "New Payment receipt"}
                    </Title>
                    <p className="left_spacing--req sub_heading_payment d-flex">
                      <span>Amount received:</span>
                      <Statistic
                        precision={2}
                        value={payment}
                        className="no-space"
                        valueStyle={{ fontSize: "14px" }}
                        prefix={current?.base_currency?.symbol}
                      />
                    </p>
                    <div className="flexbox justify-content-between">
                      <div className="flexbox payment_received_form left_spacing--req  form-row-container ">
                        <div className="estimate_customer form_group flex-47">
                          <div className={isCustomerSelected ? "mb-25" : "mb--30"}>
                            <label className="form--label_style mb-5">
                              Customer <span className="staric">*</span>
                            </label>
                            <SelectDynamicPaginationField
                              required
                              addButton
                              error={""}
                              id="contactId"
                              disabled={edit}
                              clearable={false}
                              name="Customer Name"
                              editCust={contactObj}
                              value={contactObj?.id}
                              newCust={currentCustomer}
                              api={PAYMENT_RECEIVED_CONTACT}
                              placeholder={"Select customer"}
                              handleChange={(option) => handleCustomerChange(option)}
                            />
                            <div className="invoice_btn">
                              <span></span>
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
                        </div>
                        <div
                          className={`form_group invoice_number ${
                            isCustomerSelected ? "mb-25" : "mb--30"
                          } flex-47 mt-5`}
                        >
                          <span className="text_area">OR</span>
                          <Popover
                            title=""
                            open={popOver}
                            trigger="click"
                            content={
                              <FindByInvoice
                                handleOpenChange={handleChangePop}
                                handleCustomerChange={handleCustomerChange}
                              />
                            }
                            placement="bottomLeft"
                            onOpenChange={handleChangePop}
                            overlayClassName="custom-dropdown invoice_num_modal width-332 12121"
                            style={{ width: "88%", display: "flex", alignItems: "center" }}
                          ></Popover>
                          <div className="d-flex invoice_popover">
                            <Buttonx
                              disabled={edit}
                              htmlType="button"
                              clickHandler={handleChangePop}
                              btnText="Find by invoice number"
                              className="btn-primary btn-form-size"
                            />
                            <TooltipX
                              placement="right"
                              title={findByInvoicePop}
                              overlayClassName="payment-receipt-tooltip"
                            >
                              <img
                                alt="tooltip Icon"
                                className="hover-effect"
                                src={`${
                                  import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                }/static/media/tooltip.svg`}
                              />
                            </TooltipX>
                          </div>
                        </div>
                        <div
                          className="payment_detail_form flexbox form-row-container justify-content-between"
                          style={{
                            opacity: !contactObj ? 0.5 : 1,
                            pointerEvents: !contactObj ? "none" : "auto",
                          }}
                        >
                          <div className="form_group flex-47 ">
                            <Form.Item
                              name="customer_email"
                              className="input_field"
                              label={<label className="form--label_style mb-5">Email</label>}
                            >
                              <Text className="text_dark">{customerEmail}</Text>
                            </Form.Item>
                          </div>
                          <div className="form_group flex-47 ">
                            {/* <label className="form--label_style mb-5">
                             <span className="staric">*</span>
                          </label> */}
                            <DatePickerx
                              isRequired
                              inputReadOnly
                              size="large"
                              allowClear={false}
                              name="payment_date"
                              label="Payment date"
                              // disableDate={(current) =>
                              //   current && current < dayjs(todayDate).startOf("day")
                              // }
                              format={org_date_format}
                            />
                          </div>

                          <div className="form_group flex-47 ">
                            <Form.Item
                              name="payment_no"
                              className="input_field"
                              label={
                                <label className="form--label_style mb-5">Payment number</label>
                              }
                            >
                              <Text>{payment_number}</Text>
                            </Form.Item>
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
                          <div className="form_group flex-47 ">
                            <Selectx
                              required
                              valueLabel
                              size="large"
                              name="payment_mode"
                              allowClear={false}
                              options={paymentModes}
                              label="Payment method"
                              popupClassName="overlap"
                              placeholder="Select payment method"
                              className="input_field dropdown--scroll"
                              rules={rules({ message: Content.select_payment_method })}
                            />
                          </div>
                          <div className="form_group flex-47 ">
                            <Form.Item
                              name="note"
                              className="mb flex_root input_field italic_font"
                              label={<span className="form--label_style mb-5">{Labels.NOTES}</span>}
                            >
                              <TextArea
                                rows={4}
                                showCount
                                maxLength={1000}
                                placeholder={Content.add_notes}
                                onChange={(e: any) => {
                                  const { value } = e.target;
                                  const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                                  form.setFieldValue("note", formattedValue);
                                }}
                              />
                            </Form.Item>
                          </div>
                          <div className="form_group flex-47">
                            <Form.Item
                              name="terms_and_condition"
                              className="flex_root text_field italic_font"
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

                          <div
                            className={`form_group flex-47 mb--30 ${
                              checked ? "receive-payment-checked" : ""
                            }`}
                          >
                            <div className="amount_received_field">
                              <Form.Item
                                name="payment"
                                className="mb-10  border--onfocuss"
                                label={
                                  <label className="form--label_style mb-5">
                                    Amount received <span className="staric">*</span>
                                  </label>
                                }
                                rules={rules({ message: Content.enter_amount_received })}
                              >
                                <InputNumberX
                                  type="number"
                                  name="payment"
                                  allowDecimal
                                  disabled={checked}
                                  className="amount_received no-transition"
                                  prefix={<span>{current?.base_currency?.symbol}</span>}
                                  onChange={(e) => {
                                    const check = e.target.value;
                                    const shiping_charges_lenght =
                                      check.length <= 10 ? check : check.slice(0, 10);
                                    form.setFieldValue("payment", shiping_charges_lenght);
                                    handleAmountReceived(shiping_charges_lenght);
                                  }}
                                  onBlur={() => {
                                    if (!payment){
                                      form.setFieldValue("payment", 0.0);
                                      form.validateFields(["payment"])
                                    } 
                                    
                                    else
                                      form.setFieldValue(
                                        "payment",
                                        parseFloat(payment as any).toFixed(2)
                                      );
                                  }}
                                  onFocus={(e) => e.target.select()}
                                />
                              </Form.Item>
                            </div>
                            <Checkbox onChange={handleCheckBox} checked={checked}>
                              Received full amount{" "}
                              {`${current?.base_currency?.symbol}${receivedAmount}` || null}
                            </Checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ width: "100%" }}>
                      {contactObj && (
                        <Title level={4} className="form_heading  mb--30  form-row-container">
                          Outstanding Transactions
                        </Title>
                      )}
                      <div
                        style={{
                          opacity: !contactObj ? 0.5 : 1,
                          pointerEvents: !contactObj ? "none" : "auto",
                        }}
                        className="table-container payment_receipt_form_table payment_table_outer"
                      >
                        {contactObj && (
                          <>
                            <InvoiceListing
                              invoiceData={invoiceData}
                              listing={invoiceListing}
                              customer={contactObj?.id}
                              loading={invoice_loading}
                              handlePayment={handlePayment}
                              setListing={setInvoiceListing}
                              handlePayInFull={handlePayInFull}
                              hasModulePermission={invoicesPermission}
                              currency={current?.base_currency?.symbol}
                            />
                            <div className="bill_box justify_between">
                              <div className={`d-flex align-center self-start`}>
                                <Button
                                  onClick={handlePaymentClear}
                                  disabled={!Boolean(parseFloat(UsedAmount as any))}
                                  className="btn-form-size btn-default mr-10 mt-10"
                                >
                                  Clear payment
                                </Button>
                              </div>
                              <div className="final_payment">
                                <div className="d-flex align-center justify_between mb-15">
                                  <Typography.Title level={5} className="final_payment_heading">
                                    Amount received
                                  </Typography.Title>
                                  <Statistic
                                    precision={2}
                                    value={payment}
                                    className="no-space"
                                    valueStyle={{ fontSize: "14px" }}
                                    prefix={current?.base_currency?.symbol}
                                  />
                                </div>
                                <div className="d-flex align-center justify_between final_amount_received mb-15">
                                  <div className="d-flex align-center">
                                    <Typography.Title level={5} className="final_payment_heading">
                                      Total charges
                                    </Typography.Title>
                                    <TooltipX title={totalChargesPop}>
                                      <img
                                        className="ml-10 hover-effect"
                                        src={`${
                                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                        }/static/media/tooltip.svg`}
                                        alt="tooltip Icon"
                                      />
                                    </TooltipX>
                                  </div>
                                  <Statistic
                                    precision={2}
                                    value={UsedAmount}
                                    className="no-space"
                                    prefix={current?.base_currency?.symbol}
                                    valueStyle={{ color: "#cf1322", fontSize: "14px" }}
                                  />
                                </div>
                                <div className="d-flex align-center justify_between credit_amount">
                                  <Typography.Title level={5}>Amount to credit </Typography.Title>
                                  <Statistic
                                    precision={2}
                                    className="no-space"
                                    value={payment - UsedAmount}
                                    valueStyle={{ fontSize: "14px" }}
                                    prefix={current?.base_currency?.symbol}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="d-flex justify_between text_area">
                              <Typography>**List contains only SENT invoices.</Typography>
                              <Typography className="d-flex align-center">
                                {calculatedTranaction}
                                &nbsp;
                                <Statistic
                                  precision={2}
                                  className="no-space"
                                  value={payment - UsedAmount}
                                  valueStyle={{ fontSize: "14px" }}
                                  prefix={current?.base_currency?.symbol}
                                />
                                .
                              </Typography>
                            </div>
                          </>
                        )}
                        <div
                          style={{
                            opacity: !contactObj ? 0.5 : 1,
                            pointerEvents: !contactObj ? "none" : "auto",
                          }}
                          className="left_spacing--req"
                        >
                          <div className="button_flexbox flex-end ">
                            <Buttonx
                              type="default"
                              btnText="Cancel"
                              htmlType="button"
                              clickHandler={() => navigate(PAYMENTS_RECEIVED)}
                              className="btn-default btn-form-size cate_cancel_btn"
                            />
                            <div className="d-flex align-center new_prod_btn">
                              <Buttonx
                                block
                                loading={loading}
                                btnText={Labels.SAVE}
                                className={`btn-primary btn-form-size ${
                                  Boolean(payment < UsedAmount) ? "disabled-save-btn" : ""
                                }`}
                                disabled={disableButton}
                              />
                              <Dropdown
                                placement="topRight"
                                trigger={["click"]}
                                disabled={disableButton}
                                menu={{ items: saveButtons }}
                                className="h-36px p-5 icon-radius"
                                overlayClassName="dropdown-alignment-generic left-6px"
                              >
                                {/* <Icons.IoChevronDownOutline
                            size={25}
                            className={`${
                              Boolean(received < UsedAmount) ? "disabled-svg" : "btn-primary"
                            }`}
                          /> */}
                                <span
                                  className={`${
                                    disableButton
                                      ? "disabled-svg "
                                      : "btn-primary generic-dropdown-icon "
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
                </div>
              </Form>
            </div>
          )}
          <Modal
            centered
            width={940}
            footer={false}
            destroyOnClose
            style={{ top: 0 }}
            title="Add Customer"
            open={isCustomerModalOpen}
            onCancel={toggleCustomerModal}
            wrapClassName="generic_modal_style form---symmetical-gap"
            className="estimate_modal estimate_lg_modal form_generic_modal"
            closeIcon={
              <img
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
                alt="close Icon"
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
          <ContactModal
            bool={customerDetail}
            detail={{ id: contactObj?.id }}
            toggle={toggleCustomerDetailModal}
          />
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
