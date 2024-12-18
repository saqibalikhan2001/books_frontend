/**@format */

import { useEffect } from "react";
import { Form, Modal, Space } from "antd";
import { rules } from "utils";
import { Labels, Content } from "static";
import { GroupModalProps } from "../Types";
import { TaxGroupList } from "./TaxGroupList";
import { AccessDenied, Buttonx, InputField } from "app/shared";

const initialState = {
  name: "",
};

export const GroupForm = ({
  bool,
  toggle,
  loading,
  listing,
  current,
  onSubmit,
  setSelected,
  currSelected,
  has_permission,
  setCurrSelected,
}: GroupModalProps) => {
  const [form] = Form.useForm();
  let taxList = listing?.filter((tx: any) => !tx.tax_group_details);

  useEffect(() => {
    if (current && Object.keys(current).length) {
      form.setFieldsValue({ ...current });
      setCurrSelected(current?.tax_group_details?.map((tx: any) => tx.tax_id));
      setSelected!(current?.tax_group_details?.map((tx: any) => tx.tax_id));
    }
    //eslint-disable-next-line
  }, [current, form]);

  const handleClose = () => {
    form.resetFields();
    bool && toggle();
    setCurrSelected([]);
  };

  return (
    <Modal
      title={`${current?.name ? Labels.UPDATE : Labels.ENTER} ${Labels.TAX}`}
      open={bool}
      footer={null}
      destroyOnClose
      onCancel={toggle}
      style={{ top: 0 }}
      maskClosable={false}
      afterClose={handleClose}
    >
      {has_permission ? (
        <Form
          name={`${Labels.ENTER}-${Labels.TAX}`}
          initialValues={initialState}
          form={form}
          layout="vertical"
          onFinish={onSubmit}
        >
          <InputField
            name="name"
            size="middle"
            maxLength={80}
            label={Labels.NAME}
            rules={rules({ message: Content.enter_name })}
            placeholder={`${Labels.ENTER} ${Labels.NAME}`}
          />

          <TaxGroupList
            data={taxList}
            setSelected={setSelected}
            currSelected={currSelected}
            setCurrSelected={setCurrSelected}
          />

          <Space className="steps-action">
            <Buttonx
              type="default"
              htmlType="button"
              btnText={Labels.CANCEL}
              clickHandler={handleClose}
            />
            <Buttonx
              loading={loading}
              style={{ width: "120px" }}
              btnText={current?.name ? Labels.UPDATE : Labels.CREATE}
            />
          </Space>
        </Form>
      ) : (
        <AccessDenied />
      )}
    </Modal>
  );
};
