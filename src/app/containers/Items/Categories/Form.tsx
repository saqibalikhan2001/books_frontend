/** @format */

import { useEffect } from "react";
import { Form, Input } from "antd";
import { rules } from "utils";
import { Content, Labels } from "static";
import { CategoriesFunctions } from "./Types";
import { Buttonx, InputField, Spinner } from "app/shared";

const { TextArea } = Input;
const { NAME, DESCRIPTION } = Labels;

const initialValues = {
  name: "",
  description: "",
};

export const CategoryForm = ({
  form,
  loading,
  onSubmit,
  current,
  edit = false,
  formLoading = false,
  handleCancel,
}: CategoriesFunctions) => {
  useEffect(() => {
    if (current && Object.keys(current).length) {
      form.setFieldsValue({ ...current });
    }
  }, [current, form]);
  const handleDescription = (e) => {
    let value = e.target.value;
    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");

    form.setFieldValue("description", formattedValue);
  };

  return (
    <>
      {formLoading ? (
        <Spinner directionSize={window.innerWidth >= 1600 ? '340px' : '132px'} size={'50px'} />
      ) : (
        <Form
          form={form}
          layout="vertical"
          className="formin"
          onFinish={onSubmit}
          name="form_in_modal"
          requiredMark={false}
          initialValues={initialValues}
        >
          <InputField
            name="name"
            form={form}
            placeholder="Enter category name"
            disabled={edit && !current?.category_owner}
            className="input_field remove-extra--space new_cate_input"
            rules={rules({ message: Content.enter_name })}
            label={NAME}
            required
            maxLength={50}
          />
          <Form.Item
            className="mb-20"
            name="description"
            label={<label className="form--label_style mb-5">{DESCRIPTION}</label>}
          >
            <TextArea
              rows={4}
              showCount
              maxLength={1000}
              className="h-100"
              onChange={handleDescription}
              placeholder="Enter category description"
            />
          </Form.Item>
          <div className="button_flexbox flex-end  ">
            <Buttonx
              btnText="Cancel"
              htmlType="button"
              clickHandler={handleCancel}
              className="btn-default btn-form-size cate_cancel_btn mr-20"
            />
            <Buttonx loading={loading} className="btn-primary btn-form-size" btnText="Save" />
          </div>
        </Form>
      )}
    </>
  );
};
