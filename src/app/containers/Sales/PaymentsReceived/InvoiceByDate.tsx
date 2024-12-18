import { useStore } from "app/Hooks";
import { DatePicker, Form } from "antd";
import { Buttonx, Selectx } from "app/shared";

const { RangePicker } = DatePicker;

export const status = [
  { id: "all", label: "All" },
  { id: "partially paid", label: "PRTL Paid" },
  { id: "overdue", label: "Overdue" },
  { id: "sent", label: "Sent" },
];

export const InvoiceByDate = ({ onSubmit, form }) => {
  const { org_date_format } = useStore();

  return (
    <Form form={form} layout="vertical" name="invoicebydate" onFinish={onSubmit}>
      <label>Date Range</label>
      <Form.Item name="custom_ranges">
        <RangePicker
          size="small"
          inputReadOnly
          format={org_date_format}
          popupClassName="overlap"
          separator={<label>-</label>}
          placeholder={[org_date_format, org_date_format]}
        />
      </Form.Item>
      <Selectx
        label="Status"
        name="status"
        options={status}
        className="flex_root"
        popupClassName="overlap"
        placeholder="Select status"
      />
      <div className="button_flexbox flex-end ">
        <Buttonx
          type="default"
          btnText="Reset"
          htmlType="button"
          clickHandler={() => {
            form.resetFields();
          }}
          className="btn-default btn-form-size cate_cancel_btn"
        />
        <div className="d-flex align-center new_prod_btn">
          <Buttonx block loading={false} btnText="Save" className="btn-primary btn-form-size" />
        </div>
      </div>
    </Form>
  );
};
