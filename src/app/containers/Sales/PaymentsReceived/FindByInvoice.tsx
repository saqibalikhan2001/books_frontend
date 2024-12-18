import { Buttonx, InputField, Toast } from "app/shared";
import { useAxios } from "app/Hooks";
import { Form } from "antd";
import { rules } from "utils";
import { Content, endpoints } from "static";
import { PaymentFindByInvoiceFormProps } from "./Types";
import { useState } from "react";
import { TooltipX } from "app/shared/ToolTip";

export const FindByInvoice = ({
  handleOpenChange,
  handleCustomerChange,
}: PaymentFindByInvoiceFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { callAxios } = useAxios();

  const onSubmit = (values) => {
    setLoading(true);
    callAxios({
      url: `${endpoints.ADVANCE_PAYMENT}/contact?invoice_no=${values.Invoice_no.toUpperCase()}`,
    }).then((res) => {
      if (res.status === 406) {
        setErrorMessage(res.message);
        setLoading(false);
      } else {
        if (res?.data) {
          handleCustomerChange(res.data[0], values.Invoice_no.toUpperCase());
          handleOpenChange();
          setErrorMessage("");
          setLoading(false);
        } else {
          Toast({ message: "please enter valid invoice number", type: "info" });
          setLoading(false);

        }
      }
    }).catch(()=>{
      Toast({ message: "please enter valid invoice number", type: "info" });
      setLoading(false);
    })
  };

  const hanleCancel = () => {
    handleOpenChange();
    form.resetFields();
    setErrorMessage("");
  };
  return (
    <Form
      form={form}
      layout="vertical"
      name="findbyinvoice"
      onFinish={onSubmit}
      requiredMark={false}
    >
      <InputField
        form={form}
        size="large"
        name="Invoice_no"
        className="input_field mb-10"
        onFocus={() => setErrorMessage("")}
        label={
          <label>
            Invoice No. <span className="staric">*</span>{" "}
            <TooltipX
              title={
                "Please Enter Exact Invoice Number. You can only search for unpaid & partially paid invoices."
              }
            >
              <img
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/tooltip.svg`}
                alt="tooltip Icon"
                className="hover-effect pl-9"
              />
            </TooltipX>
          </label>
        }
        placeholder="Enter invoice number"
        rules={rules({ message: Content.enter_invoice_no })}
      />
      {errorMessage && <div className="mb-5 error-msg">{errorMessage}</div>}
      <div className="button_flexbox flex-end ">
        <Buttonx
          type="default"
          btnText="Cancel"
          htmlType="button"
          clickHandler={hanleCancel}
          className="btn-default btn-form-size cate_cancel_btn"
        />
        <div className="d-flex align-center new_prod_btn">
          <Buttonx block loading={loading} btnText="Find" className="btn-primary btn-form-size" />
        </div>
      </div>
    </Form>
  );
};
