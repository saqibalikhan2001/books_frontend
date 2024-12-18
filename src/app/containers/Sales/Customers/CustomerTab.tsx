/** @format */
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
//@ts-ignore
import { Form, Typography, Checkbox, Alert, Modal, Space, Image } from "antd";
import type { InputRef } from "antd";
import dayjs from "dayjs";
import { Payments } from "./Payments";
import { CustomerTabProps } from "./Types";
import { Labels, routeNames } from "static";
import { CustomerForm } from "./CustomerForm";
import { SpinnerX } from "app/shared/PageLoader";
import { AddressForm } from "./Address/AddressForm";
import { NotesAndAttachments } from "./NotesAttachments";
import { generateDisplayNameOptions, ImagePath } from "utils";
import {
  useStore,
  useCreateFormApi,
  useDefaultOrganization,
  useSharedOrganization,
} from "app/Hooks";
import {
  Buttonx,
  InputField,
  Breadcrumbx,
  DatePickerx,
  UploadImage,
  InputNumberX,
} from "app/shared";
import { ImageCrop } from "app/containers/Items/ImageCrop";

const todayDate = dayjs(new Date());
const { CUSTOMERS, SUPPLIERS } = routeNames;

const initialState = {
  salutation: null,
  company_name: "",
  mobile: "",
  first_name: "",
  last_name: "",
  email: "",
  photo: "",
  display_name: null,
  currency_id: null,
  attention: "",
  zip_code: "",
  street: "",
  country_id: null,
  city: "",
  fax: "",
  state: "",
  phone: "",
  bill_attention: "",
  bill_phone: "",
  bill_street: "",
  bill_street_2: "",
  bill_city: "",
  bill_state: "",
  bill_zip_code: "",
  bill_fax: "",
  bill_country_id: null,
  ship_attention: "",
  ship_phone: "",
  ship_street: "",
  ship_street_2: "",
  ship_city: "",
  ship_state: "",
  ship_zip_code: "",
  ship_fax: "",
  ship_country_id: null,
  same_as_billing: false,
  facebook: "",
  twitter: "",
  skype: "",
  instagram: "",
  note: "",
  language: "english",
  billing_per_hour: "",
  social_security_no: "",
  as_of_date: todayDate,
  primary_payment_id: null,
  terms: null,
  tax_exempt: false,
};

const CustomerTab = ({
  url,
  create,
  loading,
  onSubmit,
  setCurrency,
  clone = false,
  edit = false,
  setAttachList,
  isModal = false,
  attachList = [],
  supplier = false,
  deleteAttachments,
  setCustomerOptions,
  setDeleteAttachments,
  handleImageAttachList,
  setIsCustomerModalOpen,
}: CustomerTabProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [formValues, setValues] = useState();
  const [current, setCurrent] = useState("0");
  const { getCurrentModule } = useSharedOrganization();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cropmodal, setCropModal] = useState(false);
  const [updateOverAll, setupdateOverAll] = useState(false);
  const { created_by_platform, org_date_format } = useStore();
  const { country_id, country_name } = useDefaultOrganization();
  const { status = true } = getCurrentModule("contact") || {};
  const { details, formLoading } = useCreateFormApi(url, Boolean(status));
  const firstNameRef = useRef<InputRef>(null);
  const displayNameRef = useRef<any>(null);

  const tax_rate = Form.useWatch("tax_rate", form);
  const first_name = Form.useWatch("first_name", form);
  const last_name = Form.useWatch("last_name", form);
  const salutation = Form.useWatch("salutation", form);
  const company = Form.useWatch("company_name", form);
  const tax_exempt = Form.useWatch("tax_exempt", form);
  const display_name = Form.useWatch("display_name", form);
  const image = Form.useWatch("photo", form);

  const display_names = generateDisplayNameOptions(salutation, first_name, last_name);
  const base_currency = details?.currencies?.find((currency) => currency?.basic_currency_status);

  company &&
    display_names.push({
      label: company,
      id: display_names.length,
    });

  const createShippingAndBillingObjs = (obj1, obj2) => {
    const newObj1 = {
      ship_attention: obj1?.attention,
      ship_phone: obj1?.phone,
      ship_street: obj1?.street,
      ship_street_2: obj1?.street_2,
      ship_city: obj1?.city,
      ship_state: obj1?.state,
      ship_zip_code: obj1?.zip_code,
      ship_fax: obj1?.fax,
      ship_country_id: { id: obj1?.country_id, label: obj1?.country_name },
    };
    const newObj2 = {
      bill_attention: obj2?.attention,
      bill_phone: obj2?.phone,
      bill_street: obj2?.street,
      bill_street_2: obj2?.street_2,
      bill_city: obj2?.city,
      bill_state: obj2?.state,
      bill_fax: obj1?.fax,
      bill_zip_code: obj2?.zip_code,
      bill_country_id: { id: obj2?.country_id, label: obj2?.country_name },
    };
    return [newObj1, newObj2];
  };

  useEffect(() => {
    setCustomerOptions(display_names);
    if (display_names?.length > 0 && typeof display_name == "string" && details) {
      form.setFieldValue(
        "display_name",
        display_names.findIndex((element) => element.label === details?.contact?.display_name)
      );
    }
  }, [details]);

  useEffect(() => {
    setCustomerOptions(display_names);
    if (!edit) {
      form.setFieldValue("opening_balance", 0);
      if (display_names?.length > 0) {
        const index = display_names.findIndex((element) => element.id === display_name);
        //@ts-ignore
        if (index === -1 && !display_name >= display_names.length) {
          form.setFieldValue("display_name", display_names?.[0]?.id);
        }
      } else {
        form.setFieldValue("display_name", null);
      }
    }
  }, [first_name, last_name, salutation, company, edit]);

  useEffect(() => {
    if (create) {
      setCurrency(base_currency?.id);
      form.setFieldsValue({
        currency_id: base_currency?.name,
        bill_country_id: { id: country_id, label: country_name },
        ship_country_id: { id: country_id, label: country_name },
      });
    }
    //eslint-disable-next-line
  }, [create, base_currency]);

  useEffect(() => {
    if (details?.contact && Object.keys(details?.contact).length) {
      const shipping_address = createShippingAndBillingObjs(
        details?.contact?.contact_addresses[1],
        details?.contact?.contact_addresses[0]
      );
      const attachImages = details?.contact?.attachments.map((image) => ({
        ...image,
        uid: image?.id,
        status: "done",
        old_image: true,
        editAttach: true,
        name: image?.attachment,
        url: ImagePath(image?.attachment, created_by_platform),
      }));
      let logo_image = details?.contact?.photo
        ? ImagePath(details?.contact?.photo, created_by_platform)
        : null;

      edit
        ? form.setFieldsValue({
            ...details?.contact,
            ...shipping_address[0],
            ...shipping_address[1],
            img_logo: logo_image,
            as_of_date: dayjs(todayDate, org_date_format),
            currency_id: details?.contact?.global_currency_id,
          })
        : form.setFieldsValue({
            ...details?.contact,
            ...shipping_address[0],
            ...shipping_address[1],
            display_name: "",
            img_logo: logo_image,
            as_of_date: dayjs(todayDate, org_date_format),
            currency_id: details?.contact?.global_currency_id,
          });

      setCurrency(details?.contact?.currency_id);
      handleImageAttachList(attachImages);
    }
    //eslint-disable-next-line
  }, [details?.contact, base_currency?.id]);

  const handleErrorSubmit = (err) => {
    if (+current) setCurrent("0");
    if (err.errorFields.length) {
      if (firstNameRef.current !== null && err.values.first_name === "") {
        firstNameRef.current.focus();
      } else if (displayNameRef.current !== null && err.values.display_name === null) {
        displayNameRef.current.focus();
      }
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    //@ts-ignore
    onSubmit({ ...formValues, updateOverAll });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOkk = () => setCropModal(!cropmodal);
  const openCropModal = () => setCropModal(true);

  //@ts-ignore

  const DisplaynameConformationModal = () => {
    return (
      <>
        <Modal
          okText="Save"
          title="Confirmation"
          className="confirmation_name_modal"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          closeIcon={
            <img
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
              alt="close Icon"
            />
          }
        >
          <Checkbox
            value={updateOverAll}
            onChange={(e) => {
              setupdateOverAll(e?.target?.checked);
            }}
            style={{ paddingInlineEnd: "0" }}
          >
            Do you want to update below fields for previous records?
          </Checkbox>
          <div className="name_heading" style={{ paddingLeft: "26px" }}>
            Display Name
          </div>
          <div className="text_area">
            <span>*</span>
            <i>This will effect only un-processed records</i>
          </div>
        </Modal>
      </>
    );
  };
  return (
    <>
      {DisplaynameConformationModal()}
      {Boolean(status) ? (
        <>
          {formLoading ? (
            <SpinnerX />
          ) : (
            <div className="main_wrapper customer_breadcrumb ">
              {!isModal && (
                <Breadcrumbx
                  name={
                    !create
                      ? details?.contact?.display_name
                      : `Create ${supplier ? "Supplier" : "New Customer"}`
                  }
                  className="item_name"
                />
              )}
              <div
                className={`_container adjusting customer-add-form  ${
                  isModal ? "px-30 pb-20 modal-form" : ""
                }`}
              >
                <Form
                  form={form}
                  layout="vertical"
                  autoComplete="off"
                  name="contact-form"
                  requiredMark={false}
                  initialValues={initialState}
                  onFinishFailed={handleErrorSubmit}
                  onFinish={(values) => {
                    if (
                      edit &&
                      !clone &&
                      details?.contact?.has_transaction &&
                      display_name !== details?.contact?.display_name
                    ) {
                      showModal();
                      setValues(values);
                    } else {
                      onSubmit({ ...values, updateOverAll });
                    }
                  }}
                >
                  <Typography.Title level={4} className="h4 mb-18 form_heading">
                    {`${supplier ? "Supplier" : "Customer"} Image`}
                  </Typography.Title>

                  <div className="form_box">
                    <div className="upload_box  flex_unset">
                      <Form.Item name="photo">
                        <UploadImage contact src={""} form={form} openCropModal={openCropModal} />
                      </Form.Item>
                      <Modal
                        width={940}
                        footer={null}
                        destroyOnClose
                        centered={true}
                        onCancel={() => {
                          form.setFieldsValue({ photo: null });
                          handleOkk();
                        }}
                        open={cropmodal}
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
                          contact
                          form={form}
                          image={image}
                          fileList={[]}
                          handleOk={handleOkk}
                        />
                      </Modal>
                    </div>
                  </div>
                  <CustomerForm
                    form={form}
                    isModal={isModal}
                    supplier={supplier}
                    firstNameRef={firstNameRef}
                    display_names={display_names}
                    base_currency={base_currency}
                    displayNameRef={displayNameRef}
                  />
                  <AddressForm customerForm form={form} isModal={isModal} />
                  <NotesAndAttachments
                    edit={edit}
                    form={form}
                    attachList={attachList}
                    setAttachList={setAttachList}
                    deleteAttachments={deleteAttachments}
                    setDeleteAttachments={setDeleteAttachments}
                    handleImageAttachList={handleImageAttachList}
                  />
                  <Payments
                    form={form}
                    isModal={isModal}
                    supplier={supplier}
                    terms={details?.invoice_terms || []}
                    paymentMode={details?.payment_mode || []}
                  />
                  {!supplier && (
                    <>
                      <Typography.Title level={4} className="h4  form_heading">
                        Taxes
                      </Typography.Title>
                      <div className="form_box checked_clr">
                        <div className="flexbox form-row-container justify-content-between">
                          <div className="form_group flex-47 mb-10">
                            <label>
                              <Form.Item name="tax_exempt" valuePropName="checked" noStyle>
                                <Checkbox className="mt-3">This customer is tax exempted</Checkbox>
                              </Form.Item>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="form_box taxes_bg">
                        <div className="flexbox form-row-container justify-content-between">
                          <div className="form_group flex-47 color-6e6e6e">
                            <InputField
                              form={form}
                              size="middle"
                              disabled={!tax_exempt}
                              className="input_field"
                              name="reason_exemption"
                              label={"Reasons for exemption"}
                              placeholder="Enter reasons for exemption"
                            />
                          </div>
                          <div className="form_group flex-47 color-6e6e6e">
                            <InputField
                              form={form}
                              size="middle"
                              disabled={!tax_exempt}
                              className="input_field"
                              name="exemption_details"
                              label={"Exemption details"}
                              placeholder="Enter exemption details"
                            />
                          </div>

                          <div className="form_group flex-47">
                            <Form.Item
                              colon={false}
                              name="tax_rate"
                              className="input_field btn-tax"
                              label={<span className="form--label_style mb-5">Tax rate</span>}
                            >
                              <InputNumberX
                                id="tax_rate"
                                value={tax_rate}
                                disabled={tax_exempt}
                                placeholder="Enter tax rate"
                                addonAfter={<label>%</label>}
                                onBlur={() => {
                                  if (tax_rate > 100) form.setFieldValue("tax_rate", 100);
                                }}
                                onChange={(value) => form.setFieldValue("tax_rate", value)}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <Typography.Title level={4} className="h4 mb-28 form_heading">
                    Opening Balance
                  </Typography.Title>
                  <div className="form_box">
                    <div className="flexbox form-row-container justify-content-between customers-actions-top">
                      <div className="form_group flex-47">
                        <Form.Item
                          colon={false}
                          name="opening_balance"
                          className="input_field btn-tax"
                          label={<span className="form--label_style mb-5">Opening balance</span>}
                        >
                          <InputNumberX
                            allowDecimal
                            size="middle"
                            className="input_field"
                            placeholder="Enter opening balance"
                            onBlur={(e) => {
                              if (e.target.value) {
                                form.setFieldValue(
                                  "opening_balance",
                                  parseFloat(e.target.value).toFixed(2)
                                );
                              }
                            }}
                            disabled={edit && details?.contact?.has_transaction}
                          />
                        </Form.Item>
                      </div>
                      <div className="form_group flex-47 mb--30">
                        <DatePickerx
                          inputReadOnly
                          name="as_of_date"
                          label={"As of date"}
                          format={org_date_format}
                          popupClassName={isModal ? "overlap" : ""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`${!isModal && "main-wrapper custom_blocklevel m--unset"}`}>
                    <div className="form-action-btn __popup-actions form_box">
                      <Buttonx
                        htmlType="button"
                        btnText={Labels.CANCEL}
                        className="btn-default btn-form-size btn-cancel"
                        clickHandler={() =>
                          !isModal
                            ? supplier
                              ? navigate(SUPPLIERS)
                              : navigate(CUSTOMERS)
                            : setIsCustomerModalOpen?.(false)
                        }
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
    </>
  );
};
export default CustomerTab;
