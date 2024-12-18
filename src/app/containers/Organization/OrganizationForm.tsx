/** @format */

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Radio, Checkbox, Typography, Input, Modal, Space } from "antd";
import type { InputRef } from "antd";
import { rules } from "utils";
import timezone from "moment-timezone";
import { Content, Labels } from "static";
import { useTypedDispatch } from "store";
import { useListing, useStore } from "app/Hooks";
import { setDrawer } from "store/slices/authSlice";
import { Buttonx, InputField, Selectx, UploadImage, Breadcrumbx, TooltipX } from "app/shared";
import { ImageCrop } from "../Items/ImageCrop";
import { BusinessTypeDetails } from "./Types";

const OrganizationForm = ({ initialState, onSubmit, form, loading, edit, show }: any) => {
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const { organization_id } = useStore();
  const [cropmodal, setCropModal] = useState(false);
  const [bool, setBool] = useState(false);
  const handleModal = () => setBool(!bool);
  const {
    isLoading,
    country_list,
    currncy_list,
    organization_type_list,
    fiscal_year_list,
    business_type,
  } = useListing();

  const image = Form.useWatch("logo", form);
  const isLlc = Form.useWatch("is_llc", form);
  const number_type = Form.useWatch("number_type", form);
  const is_legal_name = Form.useWatch("is_legal_name", form);
  const companyaddres = Form.useWatch("companyaddres", form);
  const businesstype = Form.useWatch("business_type", form) ?? form.getFieldValue("business_type");
  const nameRef = useRef<InputRef>(null);
  const phoneRef = useRef<InputRef>(null);
  const countryIdRef = useRef<any>(null);
  const baseCurrencyIdRef = useRef<any>(null);
  const organizationTypeIdRef = useRef<any>(null);
  const handleOkk = () => setCropModal(!cropmodal);
  const openCropModal = () => setCropModal(true);
  const handleBack = () => {
    if (!organization_id) {
      navigate("/dashboard");
      dispatch(setDrawer(true));
    } else navigate(-1);
  };

  const handleIsLegalName = (e) => {
    const { name } = form.getFieldsValue();
    const { checked } = e.target;
    if (checked) {
      form.setFieldsValue({ legal_name: name });
    } else form.setFieldsValue({ legal_name: null });
  };
  const handleCompanyName = (e) => {
    const { value } = e.target;
    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
    form?.setFieldValue?.("name", formattedValue);
    if (is_legal_name) {
      form.setFieldValue("legal_name", formattedValue);
    }
  };

  const handleLegalAddress = (e) => {
    const { company_address } = form.getFieldsValue();
    const formattedValue = company_address.replace(/[^\x00-\x7F]/g, "");

    const { checked } = e.target;
    if (checked) {
      form.setFieldsValue({ legal_address: formattedValue });
    } else form.setFieldsValue({ legal_address: null });
  };

  const handleCompanyAddress = (e) => {
    const { value } = e.target;
    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
    form?.setFieldValue?.("company_address", formattedValue);
    if (companyaddres) {
      form.setFieldValue("legal_address", formattedValue);
    }
  };

  const handleLegalName = (e) => {
    const { name } = form.getFieldsValue();
    const { value } = e.target;
    if (value === name) form.setFieldsValue({ is_legal_name: true });
    else form.setFieldsValue({ is_legal_name: false });
  };

  const handleErrorSubmit = (err) => {
    if (err.errorFields.length) {
      if (nameRef.current !== null && err.values.name === "") {
        nameRef.current.focus();
      } else if (
        organizationTypeIdRef.current !== null &&
        err.values.organization_type_id === null
      ) {
        organizationTypeIdRef.current.focus();
      } else if (baseCurrencyIdRef.current !== null && err.values.base_currency_id === null) {
        baseCurrencyIdRef.current.focus();
      } else if (phoneRef.current !== null && err.values.phone === "") {
        phoneRef.current.focus();
      } else if (countryIdRef.current !== null && err.values.country_id === null) {
        countryIdRef.current.focus();
      }
    }
  };
  const handleCustomelegalraddress = (e, name) => {
    let value = e.target.value;
    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");

    form.setFieldValue(name, formattedValue);
  };
  const handleRadioFocus = (id) => (_) => {
    var tooltip = document.getElementById(`${id}`);
    //@ts-ignore
    var tooltipRect = tooltip.getBoundingClientRect();
    var viewportHeight = window.innerHeight;
    if (tooltipRect.bottom > viewportHeight) {
      //@ts-ignore
      tooltip.style.top = parseInt(tooltip.style.top) - tooltipRect.height + "px";
    }
  };
  const handleCancel = () => {
    handleModal();
    form.setFieldValue("business_type", "");
    form.setFieldValue("is_llc", "");
  };
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        requiredMark={false}
        name="create-role-form"
        initialValues={initialState}
        className="add-organization-form"
        onFinishFailed={handleErrorSubmit}
      >
        <div className="main_wrapper container-1280">
          {edit ? (
            <Breadcrumbx name="Edit Business" className="navigate" />
          ) : (
            <Breadcrumbx name="Create New Business" className="navigate" />
          )}
          <div className="_container">
            <Typography.Title level={4} className="h4 mb-18">
              Company Logo
            </Typography.Title>
            <div className="form_box">
              <div className="upload_box mb-35 flex_unset">
                <Form.Item name="logo">
                  <UploadImage
                    form={form}
                    organizationForm
                    openCropModal={openCropModal}
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                      import.meta.env.VITE_ORGANIZATION_PLACEHOLDER_IMAGE
                    }`}
                  />
                </Form.Item>
                <Modal
                  width={940}
                  footer={null}
                  destroyOnClose
                  centered={true}
                  onCancel={() => {
                    form.setFieldsValue({ logo: null });
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
                  <ImageCrop orgForm form={form} image={image} fileList={[]} handleOk={handleOkk} />
                </Modal>
              </div>
            </div>
            <Typography.Title level={4} className="h4 ">
              Company Name
            </Typography.Title>
            <div className="form_box">
              <div className="flexbox form-row-container justify-content-between">
                <div className="form_group flex-47">
                  <InputField
                    name="name"
                    customChange
                    size="middle"
                    maxLength={100}
                    innerRef={nameRef}
                    className="input_field"
                    onChange={handleCompanyName}
                    placeholder="Enter company name"
                    rules={rules({ message: Content.enter_company_name })}
                    label={
                      <label>
                        {Labels.COMPANY_NAME} <span className="staric">*</span>
                      </label>
                    }
                  />
                </div>
                <div className="form_group flex-47 mb--30">
                  <InputField
                    form={form}
                    name="legal_name"
                    size="middle"
                    disabled={is_legal_name}
                    label={Labels.LEGAL_NAME}
                    onChange={handleLegalName}
                    className="flex_root m--unset legal_name_field"
                    placeholder="Enter company legal name"
                  />
                  <Form.Item name="is_legal_name" valuePropName="checked" noStyle>
                    <Checkbox onChange={handleIsLegalName} className="mt-3">
                      Same as company name
                    </Checkbox>
                  </Form.Item>
                </div>
                <div className="form_group flex-47 number--fields">
                  <Form.Item name="number_type">
                    <Radio.Group className="form--label-mb">
                      <Radio value={1}>EIN</Radio>
                      <Radio value={2}>SSN</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <InputField
                    form={form}
                    size="middle"
                    name="number_value"
                    label=""
                    className="input_field"
                    placeholder={number_type === 1 ? "Enter EIN" : "Enter SSN"}
                  />
                </div>
                <div className="form_group flex-47 license--field">
                  <InputField
                    form={form}
                    size="middle"
                    name="license_no"
                    className="input_field"
                    label={"License number"}
                    placeholder="Enter License number"
                  />
                </div>
              </div>
            </div>
            <Typography.Title level={4} className="h4 ">
              Company Type
            </Typography.Title>
            <div className="form_box">
              <div className="flexbox form-row-container justify-content-between">
                <div className="form_group flex-47">
                  <InputField
                    form={form}
                    size="middle"
                    name="tax_form"
                    className="input_field"
                    label={Labels.TAX_FORM}
                    placeholder="Enter tax form"
                    // rules={rules({ message: Content.enter_com })}
                  />
                </div>
                <div className="form_group flex-47">
                  <Selectx
                    required
                    size="large"
                    allowClear={false}
                    loading={isLoading}
                    label={Labels.INDUSTRY}
                    className="input_field dropdown--scroll"
                    name="organization_type_id"
                    placeholder="Select Industry"
                    options={organization_type_list}
                    rules={rules({ message: Content.enter_organization_type })}
                    innerRef={organizationTypeIdRef}
                  />
                </div>
                <div className="form_group flex-47">
                  <Selectx
                    required
                    className="input_field dropdown--scroll"
                    label={Labels.FISCAL_YEAR}
                    name="fiscal_year_id"
                    options={fiscal_year_list}
                    loading={isLoading}
                    handleSort={false}
                    placeholder="Select the fiscal year"
                    rules={rules({ message: Content.enter_fiscal_year })}
                    allowClear={false}
                  />
                </div>
                <div className="form_group flex-47 business_setup_llc">
                  <Form.Item
                    required
                    name="is_llc"
                    label={
                      <div className="mb-10" style={{ display: "flex", alignItems: "center" }}>
                        <div>
                          <span>Is it LLC?</span>
                          <span className="asterisk">*</span>
                        </div>
                        <div className="d-flex">
                          <TooltipX
                            overlayStyle={{ minWidth: 320 }}
                            placement="rightTop"
                            title="LLCs allow for personal liability protection and allow pass-through taxation. Choose this business type if you’re unsure whether to file taxes as a sole proprietor, partnership, or S-corp"
                          >
                            <img
                              src={`${
                                import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                              }/static/media/tooltip.svg`}
                              alt="tooltip Icon"
                              className="hover-effect pl-9"
                            />
                            {/* <RiQuestionFill className="ml-10" color="#707070" size={14} /> */}
                          </TooltipX>
                        </div>
                      </div>
                    }
                    style={{ marginBottom: 0 }}
                    rules={rules({ message: Content.select_llc })}
                  >
                    <Radio.Group
                      value={null}
                      onChange={(e) => {
                        e.target.value === "yes" && handleModal();
                      }}
                    >
                      <Space direction="horizontal" className="d-flex flex-column" style={{alignItems: "flex-start"}}>
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                        <Radio value="not_sure">I'm not sure</Radio>
                        {isLlc === "yes" && businesstype && (
                          <span
                            className="cursor"
                            style={{ color: "#0061DD" }}
                            onClick={handleModal}
                          >
                            {business_type?.find((a) => a?.id == businesstype)?.name}
                          </span>
                        )}
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
            </div>
            <Typography.Title level={4} className="h4 ">
              Company Info
            </Typography.Title>
            <div className="form_box">
              <div className="flexbox form-row-container justify-content-between">
                <div className="form_group flex-47">
                  <Selectx
                    required
                    size="large"
                    name="time_zone"
                    allowClear={false}
                    label={Labels.TIMEZONE}
                    className="input_field dropdown--scroll"
                    options={timezone.tz.names()}
                    defaultValue="America/Los_Angeles"
                    placeholder="Select your timezone"
                  />
                </div>
                <div className="form_group flex-47">
                  <Selectx
                    required
                    size="large"
                    disabled={show}
                    loading={false}
                    allowClear={false}
                    options={currncy_list}
                    name="base_currency_id"
                    label={Labels.BASE_CURRENCY}
                    className="input_field dropdown--scroll"
                    innerRef={baseCurrencyIdRef}
                    placeholder="Select your home currency"
                    rules={rules({ message: Content.enter_base_currency })}
                  />
                </div>
                <div className="form_group flex-47 ">
                  <InputField
                    form={form}
                    size="middle"
                    className="input_field"
                    label="Contact person name"
                    name="primary_contact_name"
                    placeholder="Enter contact person name"
                  />
                </div>

                <div className="form_group flex-47">
                  <Selectx
                    disabled
                    size="large"
                    loading={false}
                    name="date_format"
                    label={"Date format"}
                    className="input_field"
                    placeholder="Select your date format"
                  />
                </div>
                <div className="form_group flex-47">
                  <InputField
                    form={form}
                    size="middle"
                    rules={rules({
                      name: "email",
                      message: "please enter a valid email",
                      validEmail: true,
                    })}
                    className="input_field"
                    name="primary_contact_email"
                    label={"Customer-facing email"}
                    placeholder="Enter customer-facing email"
                  />
                </div>

                <div className="form_group flex-47">
                  <InputField
                    form={form}
                    size="middle"
                    name="company_email"
                    className="input_field"
                    rules={rules({
                      name: "email",
                      message: "please enter a valid email",
                      validEmail: true,
                    })}
                    label={Labels.COMPANY_EMAIL}
                    placeholder="Enter company email"
                  />
                </div>
                <div className="form_group flex-47">
                  <InputField
                    form={form}
                    size="middle"
                    name="company_website"
                    className="input_field"
                    label={Labels.COMPANY_WEBSITE}
                    placeholder="Enter company website"
                  />
                </div>
                <div className="form_group flex-47">
                  <InputField
                    required
                    customChange
                    size="middle"
                    name="phone"
                    innerRef={phoneRef}
                    className="input_field"
                    label={Labels.COMPANY_PHONE}
                    placeholder="Enter company phone"
                    onChange={(e) => {
                      const next = e.target.value.replace(/[^\x00-\x7F]/g, "");
                      const value = next.length <= 20 ? next : next.slice(0, 20);
                      form?.setFieldValue("phone", value);
                    }}
                    rules={rules({ message: Content.enter_company_phone })}
                  />
                </div>
              </div>
            </div>
            <Typography.Title level={4} className="h4 ">
              Address
            </Typography.Title>
            <div className="form_box">
              <div className="flexbox form-row-container justify-content-between">
                <div className="form_group flex-47">
                  <Selectx
                    required
                    size="large"
                    name="country_id"
                    allowClear={false}
                    loading={isLoading}
                    options={country_list}
                    innerRef={countryIdRef}
                    label={Labels.COUNTRY}
                    className="input_field dropdown--scroll"
                    placeholder="Select country"
                    rules={rules({ message: Content.enter_country_name })}
                  />
                </div>
                <div className="form_group flex-47">
                  <InputField
                    form={form}
                    size="middle"
                    label={Labels.STATE}
                    name="company_province"
                    className="input_field"
                    placeholder="Enter state/province"
                  />
                </div>
                <div className="form_group flex-47">
                  <InputField
                    form={form}
                    size="middle"
                    name="company_street"
                    className="input_field"
                    label={"Street address 1"}
                    placeholder="Enter street address 1"
                  />
                </div>
                <div className="form_group flex-47">
                  <InputField
                    form={form}
                    size="middle"
                    name="company_street_2"
                    className="input_field"
                    label={"Street address 2"}
                    placeholder="Enter street address 2"
                  />
                </div>
                <div className="form_group flex-47">
                  <InputField
                    form={form}
                    size="middle"
                    name="company_city"
                    label={Labels.CITY}
                    className="input_field"
                    placeholder="Enter city"
                  />
                </div>
                <div className="form_group flex-47">
                  <InputField
                    form={form}
                    size="middle"
                    className="input_field"
                    label={Labels.ZIP_CODE}
                    name="company_postal_code"
                    placeholder="Enter zip code"
                  />
                </div>
                <div className="form_group flex-47">
                  <Form.Item
                    className="flex_root text_field"
                    name="company_address"
                    label={<label className="form--label_style mb-5">Company address</label>}
                  >
                    <Input.TextArea
                      rows={3}
                      showCount
                      size="large"
                      maxLength={1000}
                      onChange={handleCompanyAddress}
                      placeholder="Enter company address"
                    />
                  </Form.Item>
                </div>
                <div className="form_group flex-47">
                  <Form.Item
                    className="flex_root text_field"
                    name="customer_address"
                    label={
                      <label className="form--label_style mb-5">Customer-facing address</label>
                    }
                  >
                    <Input.TextArea
                      rows={3}
                      showCount
                      size="large"
                      maxLength={1000}
                      onChange={(e) => handleCustomelegalraddress(e, "customer_address")}
                      placeholder="Enter Customer-facing address"
                    />
                  </Form.Item>
                </div>
                <div className="form_group flex-47 mb-40">
                  <Form.Item
                    name="legal_address"
                    className="flex_root"
                    label={<label className="form--label_style mb-5">Legal address</label>}
                  >
                    <Input.TextArea
                      rows={3}
                      showCount
                      size="large"
                      maxLength={1000}
                      onChange={(e) => handleCustomelegalraddress(e, "legal_address")}
                      placeholder="Enter legal address"
                    />
                  </Form.Item>
                  <Form.Item name="companyaddres" valuePropName="checked" noStyle>
                    <Checkbox onChange={handleLegalAddress}>Same as company address</Checkbox>
                  </Form.Item>
                </div>
              </div>
            </div>
            <Modal
              centered
              open={bool}
              width={500}
              footer={null}
              style={{ top: 0 }}
              maskClosable={false}
              wrapClassName="generic_modal_style business_modal"
              title={"How is the business setup for taxes?"}
              closeIcon={
                <img
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
                  alt="close Icon"
                  onClick={handleCancel}
                />
              }
              okText={"Tha tha"}
              onOk={handleModal}
              onCancel={handleCancel}
            >
              <Form.Item name="business_type">
                <Radio.Group className="ant-space-item" style={{ width: "100%" }}>
                  <div
                    className="business_list"
                    style={{ paddingLeft: "20px", paddingRight: "30px" }}
                  >
                    {business_type.map((val: BusinessTypeDetails) => (
                      <div className="bussiness_setup_sec" key={val.id} style={{ width: "100%" }}>
                        <div
                          id={`${val.id}`}
                          onMouseMoveCapture={handleRadioFocus(val.id)}
                          className={`bussiness_setup_widget ${
                            val.id === businesstype ? "bussiness_setup_widget_active" : ""
                          }`}
                        >
                          <Radio value={val.id} className="business_type">
                            <Typography.Title className="business_title" level={5}>
                              {val.name}
                            </Typography.Title>
                            <Typography.Text className="_type">{`Form ${val.form}`}</Typography.Text>
                          </Radio>
                        </div>

                        <TooltipX
                          overlayStyle={{ minWidth: 320 }}
                          title={val.description}
                          placement="rightTop"
                          overlayClassName="overlap"
                        >
                          <img
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/tooltip.svg`}
                            alt="tooltip Icon"
                            className="hover-effect pl-9 tax_tooltip"
                          />
                        </TooltipX>
                      </div>
                    ))}
                  </div>
                </Radio.Group>
              </Form.Item>
              <div className="button_flexbox ml-20">
                <Buttonx
                  btnText={Labels.CANCEL}
                  clickHandler={handleCancel}
                  className="btn-form-size btn-default mr-20"
                />
                <Buttonx
                  btnText="Save"
                  clickHandler={handleModal}
                  disabled={!businesstype}
                  className="btn-form-size btn-primary"
                />
              </div>
            </Modal>
            <div className="form_box">
              <div className="button_flexbox">
                <Buttonx
                  htmlType="button"
                  btnText={Labels.CANCEL}
                  clickHandler={handleBack}
                  className="btn-form-size btn-default mr-20"
                />
                <Buttonx
                  block
                  btnText="Save"
                  loading={loading}
                  className="btn-form-size btn-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default OrganizationForm;
