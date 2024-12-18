import { Form } from "antd";
import { endpoints } from "static";
import { useAxios } from "app/Hooks";
import { Buttonx, InputNumberX, Selectx, Toast } from "app/shared";

const { FILTER_PREFERENCE } = endpoints;

export const FilterContent = ({
  form,
  refetch,
  supplier,
  setparam,
  pagination,
  setPopOver,
  filterPreference,
}: {
  form: any;
  pagination: any;
  supplier: boolean;
  refetch: () => void;
  filterPreference: any;
  setparam: (pagination: any) => void;
  setPopOver: (popover: boolean) => void;
}) => {
  const { callAxios } = useAxios();
  const status = Form.useWatch("status", form);
  const end_range = Form.useWatch("end_range", form);
  const start_range = Form.useWatch("start_range", form);
  const current_balance = Form.useWatch("current_balance", form);

  let status_options = [...filterPreference?.status?.options];
  let current_balance_options = [...filterPreference?.current_balance?.options];

  const handleSave = () => {
    const values = form.getFieldsValue();
    const payload = {
      slug: supplier ? "supplier" : "customer",
      preferences: [
        {
          slug: "status",
          id: values.status,
        },
        {
          slug: "current_balance",
          id: values.current_balance,
          start_range: values.start_range || "",
          end_range: values.end_range || "",
        },
      ],
    };
    callAxios({
      method: "post",
      url: FILTER_PREFERENCE,
      data: payload,
    }).then((res) => {
      if (res) {
        Toast({ message: res?.message || "" });
        refetch();
      }
    });
  };

  const handleApply = () => {
    const values = form.getFieldsValue();
    setparam({
      ...pagination,
      page: 1,
      status: values.status,
      current_balance: values.current_balance,
      start_range: values.start_range || 0,
      end_range: values.end_range || 0,
      is_applied: "true",
    });
    setPopOver(false);
  };

  return (
    <div className="_generic_popupover_main">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: pagination.status || filterPreference?.status?.id || "all",
          current_balance:
            pagination.current_balance || filterPreference?.current_balance?.id || "all",
          start_range:
            pagination.start_range || filterPreference?.current_balance?.start_range || "",
          end_range: pagination.end_range || filterPreference?.current_balance?.end_range || "",
        }}
      >
        <div className="form_group  mb-30">
          {/* <label>{filterPreference?.status?.label}</label> */}
          {/* <Form.Item name="status" className="adjustment-field status-input"> */}
          <Selectx
            valueLabel
            size="middle"
            name="status"
            allowClear={false}
            handleSort={false}
            popupClassName="overlap"
            placeholder="Select status"
            className="adjustment-field"
            label={filterPreference?.status?.label}
            options={status_options.sort((a, b) => a.key - b.key)}
          />
        </div>
        <div className="form_group  mb-30">
          <Selectx
            valueLabel
            size="middle"
            allowClear={false}
            handleSort={false}
            name="current_balance"
            className="adjustment-field"
            placeholder="Select current balance "
            popupClassName="overlap no-height-scroll"
            label={filterPreference?.current_balance?.label}
            options={current_balance_options.sort((a, b) => a.key - b.key)}
          />
        </div>
        {current_balance && (
          <>
            <div className="form_group  mb-30">
              {current_balance !== "all" && (
                <Form.Item colon={false} name="start_range" className="input_field">
                  <InputNumberX
                    allowDecimal
                    id="start_range"
                    value={start_range}
                    onBlur={() => {
                      if (!start_range) form.setFieldValue("start_range", 0.0);
                      else form.setFieldValue("start_range", parseFloat(start_range).toFixed(2));
                    }}
                    onChange={(value) => form.setFieldValue("start_range", value)}
                  />
                </Form.Item>
              )}
            </div>
            <div className="form_group  mb-30">
              {current_balance === "in_between" && (
                <Form.Item colon={false} name="end_range" className="input_field">
                  <InputNumberX
                    allowDecimal
                    id="end_range"
                    value={end_range}
                    onBlur={() => {
                      if (!end_range) form.setFieldValue("end_range", 0.0);
                      else form.setFieldValue("end_range", parseFloat(end_range).toFixed(2));
                    }}
                    onChange={(value) => form.setFieldValue("end_range", value)}
                  />
                </Form.Item>
              )}
            </div>
          </>
        )}
        <div className="d-flex _generic_popupover_actions ">
          {import.meta.env.VITE_SHOW_SAVE === "true" && (
            <Buttonx
              btnText="Save"
              clickHandler={handleSave}
              className="btn-default space-right w-86px h-36px mr-10"
            />
          )}
          <Buttonx
            type="text"
            btnText="Reset"
            disabled={status === "all" && current_balance === "all"}
            clickHandler={() => {
              form.setFieldsValue({
                status: "all",
                current_balance: "all",
                start_range: null,
                end_range: null,
              });
            }}
            className="btn-default mr-10 w-96px h-36px"
          />
          <Buttonx
            btnText="Apply"
            clickHandler={handleApply}
            className="btn-primary w-96px h-36px"
            disabled={
              pagination.status === status &&
              pagination.end_range === end_range &&
              pagination.start_range === start_range &&
              pagination.current_balance === current_balance
            }
          />
        </div>
      </Form>
    </div>
  );
};
