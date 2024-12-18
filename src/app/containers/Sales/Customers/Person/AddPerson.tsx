/** @format */

import { useEffect } from "react";
import { Form, Modal, Space } from "antd";
import { Labels } from "static";
import { Buttonx } from "app/shared";
import { AddPersonProps } from "../Types";
import { CustomerForm } from "../CustomerForm";

const initialState = {
  email: "",
  mobile: "",
  last_name: "",
  work_phone: "",
  first_name: "",
  department: "",
  designation: "",
  salutation: null,
};

const AddPerson = ({
  bool,
  onSubmit,
  current,
  modalOpen,
  handleModal,
  handleClose,
}: AddPersonProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (current && Object.keys(current).length) {
      form.setFieldsValue({ ...current });
    }
  }, [current, form]);

  return (
    <>
      <Modal
        width={1100}
        footer={null}
        destroyOnClose
        open={modalOpen}
        onCancel={handleModal}
        afterClose={handleClose}
        title="Add Contact Person"
      >
        <Form
          form={form}
          name={"Person"}
          layout="vertical"
          onFinish={onSubmit}
          initialValues={initialState}
        >
          <CustomerForm isModal={true} />
          <Space className="steps-action" style={{ paddingLeft: "10px" }}>
            <Buttonx
              type="default"
              htmlType="button"
              btnText={Labels.CANCEL}
              clickHandler={handleModal}
            />
            <Buttonx
              block
              loading={bool}
              style={{ width: "120px" }}
              btnText={current?.first_name ? Labels.UPDATE : Labels.CREATE}
            />
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default AddPerson;
