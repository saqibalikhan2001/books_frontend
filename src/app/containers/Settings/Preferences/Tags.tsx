/**@format */

import { useEffect, useState } from "react";
import { Form, Typography, Radio, Button, Input } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { rules } from "utils";
import { useAxios } from "app/Hooks";
import { Content, Labels, endpoints } from "static";
import { InputField, Spinner, Buttonx, Toast, Breadcrumbx } from "app/shared";

const { TAGS } = endpoints;

const initialState = {
  name: "",
  mandatory: "yes",
};

export const Tags = () => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [hasContentLoading, setHasContentLoading] = useState(true);

  const onSubmit = (values) => {
    callAxios({
      method: "post",
      url: `${TAGS}`,
      data: { ...values },
    }).then((res) => {
      if (res) {
        Toast({ message: res?.message || "" });
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setHasContentLoading(false);
    }, 1000);
  });

  return (
    <>
      {hasContentLoading ? (
        <Spinner directionSize={"80vh"}/>
      ) : (
        <div className="main_wrapper">
          <Breadcrumbx name="Tags" className="navigate" setting={true} show />
          <div className="_container">
            <Typography.Title level={4} className="form_heading">
              Tags
            </Typography.Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={onSubmit}
              requiredMark={false}
              name="create-role-form"
              initialValues={initialState}
            >
              <div className="form_box">
                <div className="flexbox form-row-sm-container justify-content-between">
                  <div className="form_group flex-46 mb-30">
                    <InputField
                      name="name"
                      size="middle"
                      className="input_field"
                      label={
                        <label>
                          {Labels.TAG_NAME} <span className="staric">*</span>
                        </label>
                      }
                      rules={rules({ message: Content.enter_name })}
                    />
                  </div>
                </div>
                <div className="flexbox form-row-sm-container justify-content-between flex-column">
                  <Form.Item
                    colon={false}
                    name="mandatory"
                    labelAlign="left"
                    label={<label>Mandatory</label>}
                  >
                    <Radio.Group className="mb-30">
                      <div className="radio_group">
                        <Radio value="no">No</Radio>
                      </div>
                      <div className="radio_group">
                        <Radio value="yes">Yes</Radio>
                      </div>
                    </Radio.Group>
                  </Form.Item>
                </div>
                <div className="flexbox form-row-sm-container justify-content-between">
                  <div className="form_group w-50 mb-40">
                    <label className="mb-10 d-flex">Options</label>
                    <Form.Item
                      name="tag_options"
                      rules={[{ required: true, message: Content.enter_options }]}
                    >
                      <Form.List name="tag_options">
                        {(fields, { add, remove }, { errors }) => (
                          <>
                            {fields.map(({ key, name, ...restField }) => (
                              <div className="d-flex justify-content-between mb-30">
                                <Form.Item {...restField} name={[name, "name"]}>
                                  <Input
                                    placeholder="Options"
                                    className="h-40 extend_field"
                                    style={{ minWidth: "232px" }}
                                  />
                                </Form.Item>

                                <MinusCircleOutlined onClick={() => remove(name)} />
                              </div>
                            ))}
                            <Form.Item>
                              <Button
                                block
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                                className="h-40 extend_field"
                              >
                                Add field
                              </Button>
                              <Form.ErrorList errors={errors} />
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Form.Item>
                  </div>
                </div>
                <div className="button_flexbox">
                  <Form.Item>
                    <Buttonx
                      type="default"
                      btnText="Cancel"
                      htmlType="button"
                      className="btn-form-size btn-default mr-20"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button className="btn-form-size btn-primary" type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
