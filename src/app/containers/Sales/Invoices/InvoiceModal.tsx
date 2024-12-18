/**@format */

import { Form, Input, InputNumber, Modal } from "antd";
import { Content, endpoints } from "static";
import { useAxios } from "app/Hooks";
import { Buttonx, Icons } from "app/shared";
import { InvoiceModalProps, InvoiceTermSubmitProps } from "./Types";

const { INVOICE_TERMS } = endpoints;
const { BsPlus, MdOutlineRemoveCircleOutline } = Icons;

export const InvoiceModal = ({
  visible,
  org_terms,
  refetch,
  toggle,
  estimate_form,
  invoice_form,
}: InvoiceModalProps) => {
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
        const last = values?.invoice_terms?.at(-1);
        toggle();
        refetch();
        estimate_form?.setFieldsValue({
          payment_terms: last
            ? {
                id: last?.value,
                label: last?.name,
                payment_term_value: last?.value,
                payment_term_name: last?.name,
              }
            : null,
        });
        invoice_form?.setFieldsValue({
          invoice_terms: last
            ? {
                id: last?.value,
                label: last?.name,
                invoice_term_value: last?.value,
                invoice_term_name: last?.name,
              }
            : null,
        });
      }
    });
  };
  return (
    <>
      <Modal
        footer={null}
        open={visible}
        destroyOnClose
        width={540}
        onCancel={toggle}
        title="Payment Terms"
        wrapClassName="generic_modal_style"
        maskClosable={false}
      >
        <Form
          form={form}
          name="dynamic_form_nest_item"
          className="generic_modal"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.List name="invoice_terms" initialValue={org_terms}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div className="flexbox align-center custom_invoice_modal" key={key}>
                    <Form.Item
                      className="form-group flex-47 mr-5"
                      {...restField}
                      name={[name, "name"]}
                      rules={[
                        {
                          required: true,
                          message: Content.enter_name,
                        },
                      ]}
                    >
                      <Input placeholder="Enter Term Name" />
                    </Form.Item>
                    <Form.Item
                      className="form-group flex-47"
                      {...restField}
                      name={[name, "value"]}
                      rules={[
                        {
                          required: true,
                          message: Content.enter_value,
                        },
                      ]}
                    >
                      <InputNumber
                        controls={false}
                        min={1}
                        placeholder="Enter Value"
                        className="Input_Num"
                      />
                    </Form.Item>
                    <MdOutlineRemoveCircleOutline
                      className="delete_tool"
                      size={20}
                      onClick={() => remove(name)}
                    />
                  </div>
                ))}
                <div className="mb-0">
                  <Buttonx
                    size="middle"
                    type="ghost"
                    icon={<BsPlus size={25} />}
                    btnText="Add New"
                    clickHandler={() => add()}
                    className="btn-form-size btn-primary d-flex align-center justify-center"
                  />
                </div>
              </>
            )}
          </Form.List>

          {/* <Divider /> */}

          <div className="button_flexbox  flex-end">
            <Buttonx
              size="middle"
              type="default"
              btnText="Cancel"
              className="btn-form-size btn-default mr-20"
              htmlType="button"
              clickHandler={() => {
                toggle();
                form.resetFields();
              }}
            />
            <Buttonx
              className="btn-form-size btn-primary"
              size="middle"
              btnText="Save"
              loading={bool}
            />
          </div>
        </Form>
      </Modal>
    </>
  );
};
