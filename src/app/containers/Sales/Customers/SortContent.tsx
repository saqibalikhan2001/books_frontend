import { useState } from "react";
import { Form, Radio } from "antd";
import { Buttonx, Selectx } from "app/shared";

export const SortContent = ({
  setparam,
  pagination,
  handleSortPopOver,
}: {
  pagination: any;
  setparam: (pagination: any) => void;
  handleSortPopOver: (popover: boolean) => void;
}) => {
  const [form] = Form.useForm();
  const [radioOption, setRadioOption] = useState<string>("asc");

  const sort = Form.useWatch("sort", form);
  const sort_column = Form.useWatch("sort_column", form);
  const onChange = (e) => setRadioOption(e.target.value);

  return (
    <div className="_generic_popupover_main">
      <Form
        form={form}
        className="inner_spacing"
        initialValues={{
          sort: pagination.sort || "asc",
          sort_column: pagination.sort_column || null,
        }}
        onFinish={(values) => {
          setparam({
            ...pagination,
            sort: values.sort,
            sort_column: values?.sort_column,
          });
          handleSortPopOver(false);
        }}
        style={{ maxWidth: 600 }}
      >
        <div className="form_group  mb-30">
          <Selectx
            label={""}
            size="middle"
            name="sort_column"
            allowClear={false}
            className="adjustment-field status-input"
            placeholder="Sort by column"
            options={[
              { id: "created_at", label: "Sort by latest" },
              { id: "display_name", label: "Sort by display name" },
            ]}
            popupClassName="overlap"
          />
        </div>
        <div className="form_group  mb-30">
          <label>Sort order</label>
          <Form.Item name="sort">
            <Radio.Group value={radioOption} onChange={onChange} className="important-block">
              <Radio value="asc" className="block">
                Ascending
              </Radio>
              <Radio value="desc" className="block">
                Descending
              </Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <div className="d-flex justify-center">
          <Buttonx
            className="btn-primary w-96px h-36px"
            btnText="Apply"
            disabled={pagination.sort === sort && pagination.sort_column === sort_column}
          />
        </div>
      </Form>
    </div>
  );
};
