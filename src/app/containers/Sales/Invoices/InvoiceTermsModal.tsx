/**@format */
//@ts-nocheck
import { Button, Form, Input, Modal, Space } from "antd";
import { Content, endpoints } from "static";
import { useAxios } from "app/Hooks";
import { Buttonx, Icons, InputNumberX, Toast } from "app/shared";
import { InvoiceModalProps, InvoiceTermSubmitProps } from "./Types";

const { INVOICE_TERMS } = endpoints;
const { BsPlus, MdOutlineRemoveCircleOutline } = Icons;

export const InvoiceTermsModal = ({
  visible,
  org_terms,
  refetch,
  toggle,
  bill_form,
  estimate_form,
  invoice_form,
}: InvoiceModalProps) => {
  const [form] = Form.useForm();
  const { callAxios, bool, toggle: toggleLoad } = useAxios();
  const invoice_terms = Form.useWatch("invoice_terms", form);
  const onFinish = (values: InvoiceTermSubmitProps) => {
    if (invoice_terms?.length === 0) {
      Toast({ type: "error", message: "You can not delete all payment terms" });
      return;
    }
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
        Toast({ message: res.message });
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
                name: last?.name,
                value: last?.value,
              }
            : null,
        });
        bill_form?.setFieldsValue({
          bill_terms: last
            ? {
                id: last?.value,
                label: last?.name,
                payment_term_value: last?.value,
                payment_term_name: last?.name,
              }
            : null,
        });
      }
    });
  };
  //@ts-ignore
  const handleInputChange = (e, index, key) => {
    const value = e.target.value.replace(/[^\x00-\x7F]/g, "");
    const data = form.getFieldValue("invoice_terms");
    data[index] = { ...data[index], [key]: value };
    form.setFieldsValue({ invoice_terms: data });
  };
  const removeEmojis = (input) => {
    return input.replace(/[^\x00-\x7F]/g, "");
  };
  return (
    <>
      <Modal
        footer={null}
        open={visible}
        destroyOnClose
        onCancel={toggle}
        width={540}
        title="Payment Terms"
        wrapClassName="generic_modal_style"
        closeIcon={
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
            alt="close icon"
          />
        }
        maskClosable={false}
      >
        <Form
          name="dynamic_form_item"
          className="generic_modal"
          form={form}
          onFinish={onFinish}
          requiredMark={false}
          initialValues={{ invoice_terms: org_terms }}
        >
          <Form.List name="invoice_terms">
            {(fields, { add, remove }) => (
              <>
                {invoice_terms?.length !== 0 && (
                  <>
                    <label className="_for_inline--mb7 mr-10" style={{ width: "178px" }}>
                      Term name<span className="staric">*</span>
                    </label>
                    <label className="_for_inline--mb7">
                      Value<span className="staric">*</span>
                    </label>
                  </>
                )}
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Name is Required" }]}
                      onInput={(e) => {
                        //@ts-ignore
                        e.target.value = removeEmojis(e.target.value);
                      }}
                    >
                      <Input placeholder="Name" maxLength={25} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      rules={[{ required: true, message: "Value is Required" }]}
                      onInput={(e) => {
                        //@ts-ignore
                        e.target.value = removeEmojis(e.target.value);
                      }}
                    >
                      <Input placeholder="Value" maxLength={5} />
                    </Form.Item>
                    <MdOutlineRemoveCircleOutline size={25} onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    className="btn-form-size btn-primary d-flex align-center justify-center"
                    icon={<BsPlus size={25} />}
                  >
                    Add New
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <div className="button_flexbox flex-end ">
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
