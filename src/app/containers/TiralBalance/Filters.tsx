/** @format */

import { Form } from "antd";
import { Buttonx, Selectx } from "app/shared";
import { date_range } from "./filterOptions";

export const TrialBalanceFilters = ({ form, setparam, pagination, handleOpenChange }) => {
  const date = Form.useWatch("date_range", form);

  const handleApply = () => {
    const values = form.getFieldsValue();
    setparam({
      ...pagination,
      date_range: values?.date_range ?? "",
    });
    handleOpenChange(false);
  };

  return (
    <div className="_generic_popupover_main">
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          date_range: pagination?.date_range || "this_week",
        }}
        style={{ maxWidth: 600 }}
      >
        <div className="form_group mb-20">
          <Selectx
            valueLabel
            label="Date"
            allowClear={false}
            name="date_range"
            popupClassName="overlap dropdown--scroll"
            size="large"
            handleSort={false}
            placeholder="Select date"
            options={date_range.sort((a, b) => a.key - b.key)}
          />
        </div>

        <div className="d-flex _generic_popupover_actions">
          {/* {import.meta.env.VITE_SHOW_SAVE === "true" && (
            <Buttonx
              btnText="Save"
              clickHandler={handleSave}
              className="btn-default space-right w-86px h-36px"
            />
          )} */}
          <Buttonx
            className="btn-default mr-15 w-96px h-36px"
            type="text"
            disabled={date === null}
            clickHandler={() => {
              form.setFieldsValue({
                date_range: null,
              });
              sessionStorage.removeItem("contactName");
            }}
            btnText="Reset"
          />
          <Buttonx
            btnText="Apply"
            clickHandler={handleApply}
            disabled={pagination.date_range === date}
            className="btn-primary w-96px h-36px"
          />
        </div>
      </Form>
    </div>
  );
};
