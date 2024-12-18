/**@format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Row, Col, Form, Space, Checkbox, Typography, Input } from "antd";
import { Content, Labels, routeNames } from "static";
import { RoleCheckBox } from "./RoleCheckBox";
import { generateRoleOptions } from "utils";
import { setPermissionsList, systemModules } from "./roles";
import { Buttonx, InputField, Breadcrumbx, Spinner, Selectx } from "app/shared";

const { Text } = Typography;
const { USERS } = routeNames;

const initialState = {
  name: "",
  sales_person: false,
};

export const RoleForm = ({
  create,
  loading,
  current,
  details,
  onSubmit,
  dispatch,
  // roleAlert,
  // setAlert,
  // handleCancel,
  customLoading,
  setCustomLodaing,
  itemPermissions,
  setSalesPerson,
}: any) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [sales, setSales] = useState(false);

  useEffect(() => {
    const list: string[] = [];
    if (current && Object.keys(current).length)
      form.setFieldsValue({
        name: current.name,
        description: current.description,
        sales_person: current?.type === "sales",
      });
    if (current?.name) {
      for (const [key, value] of Object.entries(current.permissions)) {
        if (value) list.push(`${key}`);
      }
      dispatch({ type: "clear", payload: list });
    }
    if (current?.type === "sales") {
      setSales(true);
      setSalesPerson(true);
    }

    //eslint-disable-next-line
  }, [current, form]);

  useEffect(() => {
    setTimeout(() => {
      setCustomLodaing(false);
    }, 3000);
  }, []);

  const handleSalesPerson = (e: any) => {
    const { checked } = e.target;
    if (checked) {
      // setAlert(false);
      setSalesPerson(true);

      const list = systemModules.find((list) => list.title === "Sales");
      const newlist = generateRoleOptions(list?.permissions as string[]);
      setPermissionsList(newlist);
      setSales(list?.title === "Sales" ? true : false);
      dispatch({ type: list?.title.toLowerCase() as string, payload: newlist });
    } else {
      dispatch({ type: "sales", payload: [] });
      setSales(false);
      setSalesPerson(false);
      setPermissionsList([]);
    }
  };
  const handleDescription = (e) => {
    let value = e.target.value;
    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");

    form.setFieldValue("description", formattedValue);
  };
  return (
    <>
      {customLoading ? (
        <Spinner />
      ) : (
        <div className="main_wrapper add_role_form">
          {current?.name ? (
            <Breadcrumbx name="Update Role" className="navigate" />
          ) : (
            <Breadcrumbx name="Add New Role" className="navigate" />
          )}
          <div className="_container">
            <Form
              form={form}
              layout="vertical"
              onFinish={onSubmit}
              requiredMark={false}
              name="create-role-form"
              initialValues={initialState}
            >
              <Typography.Title level={5} className="form_heading f-16">
                Role Info
              </Typography.Title>
              <div className="form_box">
                <div className="role_form  flexbox form-row-container justify-content-between">
                  <div className="role_field flex-47 mb-20">
                    <InputField
                      form={form}
                      size="middle"
                      name="name"
                      // maxLength={50}
                      label={
                        <label>
                          {`${Labels.ROLE} ${Labels.NAME}`}
                          <span className="staric">*</span>
                        </label>
                      }
                      placeholder={Content.enter_role_name}
                      rules={[{ message: "No more than 50 Characters.", max: 50, type: "string" }]}
                    />
                    <Form.Item
                      className="sale_person"
                      name="sales_person"
                      valuePropName="checked"
                      wrapperCol={{ span: 16 }}
                      style={{ marginBottom: 20 }}
                    >
                      <div className="sale_checkbox">
                        <Checkbox checked={sales} onChange={handleSalesPerson}>
                          <label>{Labels.IS_SALES_PERSON}</label>
                        </Checkbox>
                        <span className="info_circle">
                          <AiOutlineInfoCircle size={18} />
                          <p>
                          Click here to make this role only for sales persons. Can only view his own
                          data regarding sales.
                          </p>
                        </span>
                      </div>
                    </Form.Item>
                    <p>
                      (if you want to display admin related sales data to this role, then visit
                      "Sales Person" settings in "Settings{">"}Preferences{">"}Sale Order" &
                      "Settings{">"}Preferences{">"}Invoice"; after configuring this role.)
                    </p>
                    {sales && (
                      <Selectx
                        required
                        valueLabel
                        name="slug"
                        size="large"
                        initialValue={
                          create
                            ? details?.role_preferences?.find(
                                (opt) => opt.status === "active" && opt.slug === "sales_person"
                              ).slug
                            : current?.role_preferences?.find(
                                (opt) =>
                                  opt.status === "active" &&
                                  opt.slug ===
                                    (current?.slug === null ? "sales_person" : current?.slug)
                              ).slug
                        }
                        label="Sales Role"
                        allowClear={false}
                        className="input_field"
                        placeholder="Select Sales Role"
                        popupClassName={"dropdown--scroll Category_field"}
                        options={
                          create
                            ? details?.role_preferences
                                ?.filter((opt) => opt.status === "active")
                                .map((opt) => ({ label: opt.name, value: opt.slug }))
                            : current?.role_preferences
                                ?.filter((opt) => opt.status === "active")
                                .map((opt) => ({ label: opt.name, value: opt.slug }))
                        }
                      />
                    )}
                    {/* {(!!roleAlert) &&
                    Toast({
                      message: Content.permissions_required,
                      type:"error"
                    }) */}

                    {/* } */}
                  </div>
                  <div className="role_box flex-47">
                    <Form.Item
                      name="description"
                      className="flex_root"
                      label={<label className="form--label_style mb-5">{Labels.DESCRIPTION}</label>}
                    >
                      <Input.TextArea
                        rows={4}
                        showCount
                        maxLength={1000}
                        onChange={handleDescription}
                        placeholder="Enter description"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <h5 className="access_heading"> Access Rights</h5>
              <Row className="access_table_header access-rights-container roles-bottom">
                <Col span={7} offset={1}>
                  {/* <Checkbox value="All"> */}
                  <Text strong className="header_heading left ">
                    Module
                  </Text>
                  {/* </Checkbox> */}
                </Col>

                <Col span={9} offset={6}>
                  <Row gutter={[10, 0]}>
                    <Col span={6}>
                      <Text strong className="header_heading">
                        {Labels.View}
                      </Text>
                    </Col>
                    <Col span={6}>
                      <Text strong className="header_heading">
                        {Labels.CREATE}
                      </Text>
                    </Col>
                    <Col span={6}>
                      <Text strong className="header_heading">
                        {Labels.EDIT}
                      </Text>
                    </Col>
                    <Col span={6}>
                      <Text strong className="header_heading">
                        {Labels.DELETE}
                      </Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {systemModules.map((md: { title: string; permissions: string[] }) => {
                const field = md.title.toLowerCase() as keyof typeof itemPermissions;
                return (
                  <RoleCheckBox
                    key={md.title}
                    title={md.title}
                    setSales={setSales}
                    dispatch={dispatch}
                    list={md.permissions}
                    is_sales_person={sales}
                    itemPermissions={itemPermissions[field]}
                  />
                );
              })}
              <div className="form_box pt-30">
                <Space>
                  <Buttonx
                    htmlType="button"
                    className="btn_cancel"
                    btnText={Labels.CANCEL}
                    clickHandler={() => navigate(`${USERS}?tab=2`)}
                  />
                  <Buttonx
                    block
                    loading={loading}
                    className="btn_create"
                    btnText={current?.name ? Labels.UPDATE : Labels.CREATE}
                  />
                </Space>
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
