/** @format */

import { Form } from "antd";
import { endpoints } from "static";
import { useAxios } from "app/Hooks";
import { Buttonx, Selectx, Toast } from "app/shared";

const { FILTER_PREFERENCE } = endpoints;

export const ItemFilters = ({
  form,
  refetch,
  setparam,
  pagination,
  categories,
  filterPreference,
  handleOpenChange,
}) => {
  const { callAxios } = useAxios();
  const type = Form.useWatch("type", form);
  const filterstatus = Form.useWatch("status", form);
  const category_id = Form.useWatch("category_id", form);
  const stock_status = Form.useWatch("stock_status", form);
  let type_options = [...filterPreference?.type.options];
  let status_options = [...filterPreference?.status.options];
  let stock_status_options = [...filterPreference?.stock_status.options];
  const handleSave = () => {
    const values = form.getFieldsValue();
    const payload = {
      slug: "item",
      preferences: [
        {
          slug: "category_id",
          id: values.category_id,
        },
        {
          slug: "stock_status",
          id: values.stock_status,
        },
        {
          slug: "type",
          id: values.type,
        },
        {
          slug: "status",
          id: values.status,
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
      type: values?.type,
      is_applied: "true",
      status: values?.status,
      stock_status: values.stock_status,
      category_id: values?.category_id,
    });
    handleOpenChange(false);
  };

  return (
    <div className="_generic_popupover_main">
      <Form
        form={form}
        className="item--filter__popover"
        initialValues={{
          type: pagination.type || filterPreference?.type.id || "all",
          stock_status: pagination?.filter || filterPreference?.stock_status.id || "all",
          status: pagination.status || filterPreference?.status.id || "all",
          category_id: pagination.category_id || filterPreference?.category_id.id || "all",
        }}
        style={{ maxWidth: 600 }}
      >
        <div className="form_group  mb_30">
          <Selectx
            size="large"
            name="category_id"
            allowClear={false}
            handleSort={false}
            popupClassName="overlap dropdown--scroll"
            className="adjustment-field status-input"
            label={filterPreference?.category_id?.label}
            options={[{ id: "all", label: "All" }, ...(categories as any)]}
          />
        </div>
        <div className="form_group  mb-20">
          <Selectx
            valueLabel
            size="large"
            name="stock_status"
            allowClear={false}
            handleSort={false}
            label={filterPreference?.stock_status.label}
            popupClassName="overlap"
            className="adjustment-field status-input"
            options={stock_status_options.sort((a, b) => a.key - b.key)}
          />
        </div>
        <div className="form_group  mb-20">
          <Selectx
            valueLabel
            name="type"
            size="large"
            allowClear={false}
            placeholder="Type"
            handleSort={false}
            popupClassName="overlap"
            className="adjustment-field status-input"
            label={filterPreference?.type.label}
            options={type_options.sort((a, b) => a.key - b.key)}
          />
        </div>
        <div className="form_group  mb-20">
          <Selectx
            valueLabel
            size="large"
            name="status"
            handleSort={false}
            allowClear={false}
            label={filterPreference?.status.label}
            placeholder="Status"
            popupClassName="overlap"
            className="adjustment-field status-input"
            options={status_options.sort((a, b) => a.key - b.key)}
          />
        </div>
        <div className="d-flex _generic_popupover_actions">
          {import.meta.env.VITE_SHOW_SAVE === "true" && (
            <Buttonx
              btnText="Save"
              clickHandler={handleSave}
              className="btn-default space-right w-86px h-36px  mr-10"
            />
          )}
          <Buttonx
            className="btn-default space-right w-36px h-36px mr-10"
            type="text"
            disabled={
              stock_status === "all" &&
              category_id === "all" &&
              filterstatus === "all" &&
              type === "all"
            }
            clickHandler={() => {
              form.setFieldsValue({
                type: "all",
                stock_status: "all",
                status: "all",
                category_id: "all",
              });
            }}
            btnText="Reset"
          />
          <Buttonx
            btnText="Apply"
            disabled={
              pagination.stock_status === stock_status &&
              pagination.status === filterstatus &&
              pagination.category_id === category_id &&
              pagination.type === type
            }
            clickHandler={handleApply}
            className="btn-primary w-96px h-36px"
          />
        </div>
      </Form>
    </div>
  );
};
