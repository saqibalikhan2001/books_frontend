/**@format */

import { Divider, Form, Input, Modal, Space } from "antd";
import { endpoints } from "static";
import { useAxios } from "app/Hooks";
import { Buttonx, Icons } from "app/shared";
import { PaymentTermModalProps, InvoiceTermSubmitProps } from "./Types";

const { INVOICE_TERMS } = endpoints;
const { VscAdd, MdOutlineRemoveCircleOutline } = Icons;

export const PaymentTermModal = ({
  visible,
  org_terms,
  refetch,
  toggle,
}: PaymentTermModalProps) => {
  const [form] = Form.useForm();
  const { callAxios, bool, toggle: toggleLoad } = useAxios();

  const onFinish = (values: InvoiceTermSubmitProps) => {
    toggleLoad();
    callAxios({
      method: "put",
      url: INVOICE_TERMS,
      data: values,
    }).then((res) => {
      if (res) {
        toggleLoad();
        refetch();
      }
    });
  };
  return (
    <>
      <Modal
        footer={null}
        destroyOnClose
        open={visible}
        onCancel={toggle}
        title="Payment Terms"
        maskClosable={false}
      >
        <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
          <Form.List name="payment_terms" initialValue={org_terms}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[
                        {
                          required: true,
                          message: "name is required",
                        },
                      ]}
                    >
                      <Input placeholder="Enter Term Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      rules={[
                        {
                          required: true,
                          message: "value is required",
                        },
                      ]}
                    >
                      <Input placeholder="Enter Value" />
                    </Form.Item>
                    <MdOutlineRemoveCircleOutline size={20} onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Buttonx
                    size="middle"
                    type="ghost"
                    icon={<VscAdd />}
                    btnText="Add New"
                    clickHandler={() => add()}
                  />
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider />

          <Space className="steps-action">
            <Buttonx
              size="middle"
              type="default"
              btnText="Cancel"
              htmlType="button"
              clickHandler={toggle}
            />
            <Buttonx size="middle" btnText="Save" loading={bool} />
          </Space>
        </Form>
      </Modal>
    </>
  );
};
