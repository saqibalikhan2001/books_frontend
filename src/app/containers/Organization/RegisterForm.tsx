/**@format */

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Space, Form, Progress, Typography, Image, Row, Col, Divider } from "antd";
import dayjs from "dayjs";
import { useTypedDispatch } from "store";
import { RegisterFormProps } from "./Types";
import { Buttonx, Spinner, Toast } from "app/shared";
import { Logout } from "store/slices/authSlice";
import { ImagePath, ssoLogoutPath } from "utils";
import { endpoints, Labels, routeNames } from "static";
import { RESET_STATE_ACTION_TYPE } from "store/action/resetState";
import { useAxios, useGetSearchParam, useListing, useStore } from "app/Hooks";
import { BusinessStep, ContactStep, BusinessType, BusinessStepTwo } from "./Steps";

import { LoadingStep } from "./Steps/LoadingStep";
import OrganizationForm from "./OrganizationForm";

const dateformat = dayjs(new Date());

const { Text } = Typography;
const { LOGIN } = routeNames;
const { LOGOUT, ORGANIZATIONS } = endpoints;

const steps = 5;

const initialState = {
  name: "",
  logo: "",
  phone: "",
  is_llc: "",
  tax_form: "",
  license_no: "",
  number_type: 1,
  country_id: null,
  number_value: "",
  legal_address: "",
  company_email: "",
  company_street: "",
  company_province: "",
  business_type: null,
  customer_address: "",
  fiscal_year_id: null,
  is_legal_name: false,
  base_currency_id: null,
  is_legal_business: false,
  organization_type_id: null,
  inventory_start_date: null,
  time_zone: "America/Los_Angeles",
  date_format: `MMM DD, YY [${dateformat.format("MMM DD, YY")}]`,
};

export const RegisterForm = ({
  prev,
  edit,
  current,
  loading,
  onSubmit,
  getGlobalCurrencyId,
}: RegisterFormProps) => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const sso_logout = ssoLogoutPath();
  const dispatch = useTypedDispatch();
  const [show, setShow] = useState(false);
  const [option, setOption] = useState("");
  const { users_organizations } = useStore();
  const { param } = useGetSearchParam("org");
  const [formLoading, setFormLoading] = useState(true);
  const {
    isLoading,
    country_list,
    currncy_list,
    business_type,
    fiscal_year_list,
    organization_type_list,
  } = useListing();

  useEffect(() => {
    if (edit) {
      callAxios({ url: `${ORGANIZATIONS}/${param}/edit` })
        .then((res) => {
          let logo_image = res.organization.logo
            ? ImagePath(res.organization.logo, res.organization.created_by_platform)
            : null;
          setShow(res?.disabled_currency);
          getGlobalCurrencyId(res?.organization?.global_currency_id);
          form.setFieldsValue({
            ...res.organization,
            date_format: `MMM DD, YY [${dateformat.format("MMM DD, YY")}]`,
            base_currency_id: res.organization.global_currency_id,
            business_type: res.organization.llc_type,
            img_logo: logo_image,
            is_legal_name: res?.organization?.name === res?.organization?.legal_name,
            companyaddres: res?.organization?.company_address === res?.organization?.legal_address,
          });
          setFormLoading(false);
        })
        .catch(() => setFormLoading(false));
    } else {
      form.setFieldsValue({
        time_zone: "America/Los_Angeles",
      });
      setFormLoading(false);
    }
    //eslint-disable-next-line
  }, [edit]);
  const RegisterBussinessSteps = {
    1: <BusinessStep form={form} />,
    2: (
      <ContactStep form={form} step={current.step} isLoading={isLoading} ctry_list={country_list} />
    ),
    3: (
      <ContactStep form={form} step={current.step} isLoading={isLoading} ctry_list={country_list} />
    ),
    4: (
      <BusinessType
        form={form}
        option={option}
        setOption={setOption}
        isLoading={isLoading}
        business_type={business_type}
        org_list={organization_type_list}
      />
    ),
    5: (
      <BusinessStepTwo
        show={show}
        isLoading={isLoading}
        currncy_list={currncy_list}
        fiscle_list={fiscal_year_list}
      />
    ),
  };

  const memoizeRegister = useMemo(
    () => RegisterBussinessSteps,
    //eslint-disable-next-line
    [current.step, RegisterBussinessSteps, option]
  );

  const logout = () => {
    if (import.meta.env.VITE_SSO_ENABLE === "false") {
      dispatch(Logout({ url: LOGOUT }))
        .unwrap()
        .then((res) => {
          if (res) {
            dispatch({ type: RESET_STATE_ACTION_TYPE });
            localStorage.clear();
            navigate(LOGIN, { replace: true });
            Toast({ message: res.message });
          }
        });
    } else {
      window.location.href = sso_logout;
    }
  };

  return (
    <>
      {location.state && (
        <Buttonx type="link" btnText="Logout" clickHandler={logout} style={{ display: "none" }} />
      )}

      {users_organizations.length === 0 ? (
        <Row className="authwrapper">
          <Col span={24}>
            <div className="authcontainer sign_up_form">
              <div className="signup-logo d-flex justify-center">
                <Image preview={false} alt="Books" width={120} src="/Img/logo.png" />
              </div>

              {loading ? (
                <LoadingStep />
              ) : (
                <>
                  <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    scrollToFirstError
                    onFinish={onSubmit}
                    requiredMark={false}
                    className="stepscontent"
                    initialValues={initialState}
                    name={Labels.REGISTER_ORGANIZATION}
                  >
                    <div style={{ justifyContent: "center", display: "flex" }}>
                      <Typography.Text>Welcome | </Typography.Text>
                      <Typography.Link style={{ marginLeft: "5px" }} onClick={logout}>
                        {" "}
                        Logout
                      </Typography.Link>
                    </div>
                    <Space
                      className="form_progress"
                      direction="vertical"
                      style={{ width: "100%" }}
                      size={0}
                    >
                      <Text className="stepslabel color-1616">{`Step ${current.step} Of 5`}</Text>
                      <Progress
                        className="form-progress-bar"
                        strokeWidth={6}
                        showInfo={false}
                        trailColor={"#e2e2e2"}
                        strokeColor={"#0061dd"}
                        percent={current.percent}
                      />
                      {memoizeRegister[current.step]}
                    </Space>
                    <Space className="steps-action d-flex flex-end" size={0}>
                      {current.step !== 1 && (
                        <Buttonx
                          className="btn-default btn-form-size"
                          size="middle"
                          type="default"
                          htmlType="button"
                          clickHandler={prev}
                          btnText={Labels.BACK}
                          style={{ marginBottom: 0 }}
                        />
                      )}
                      {current.step < steps && (
                        <Buttonx
                          className="btn-primary btn-form-size ml-10"
                          style={{ marginBottom: 0 }}
                          btnText={Labels.NEXT}
                        />
                      )}

                      {current.step === steps && (
                        <Buttonx
                          className="btn-primary btn-form-size ml-10"
                          style={{ marginBottom: 0 }}
                          loading={false}
                          btnText={edit ? Labels.UPDATE : Labels.CREATE}
                        />
                      )}
                    </Space>
                  </Form>

                  {/* <Space direction="vertical" style={{ width: "100%" }} size={0}>
                  <Text className={stepslabel}>{`Step ${current.step} Of 5`}</Text>
                  <Progress
                    strokeWidth={6}
                    showInfo={false}
                    trailColor={"#e2e2e2"}
                    strokeColor={"#0061dd"}
                    percent={current.percent}
                  />
                  {memoizeRegister[current.step]}
                </Space> */}
                </>
              )}
              <Space
                direction="vertical"
                align="center"
                size={0}
                className="footer_area"
                style={{ marginTop: 24, marginBottom: 8 }}
              >
                <Text className="footertext">
                  {" "}
                  Copyright ©{new Date().getFullYear()} SeeBiz Inc.
                </Text>
                <Space direction="horizontal" size={0}>
                  <a href="https://www.seebiz.cloud/page/terms" className="footertext">
                    Terms & Conditions
                  </a>
                  <Divider style={{ borderColor: "#161616" }} type="vertical" />
                  <a href="https://www.seebiz.cloud/page/privacy" className="footertext">
                    Privacy Policy
                  </a>
                  <Text className="footertext">
                    <Divider style={{ borderColor: "#161616" }} type="vertical" />
                    +1 212 986 9911
                    <Divider style={{ borderColor: "#161616" }} type="vertical" />
                    support@seebiz-books.com
                  </Text>
                </Space>
              </Space>
            </div>
          </Col>
        </Row>
      ) : (
        <>
          {formLoading ? (
            <Spinner />
          ) : (
            <OrganizationForm
              show={show}
              edit={edit}
              form={form}
              loading={loading}
              onSubmit={onSubmit}
              initialState={initialState}
            />
          )}
        </>
      )}
    </>
  );
};
