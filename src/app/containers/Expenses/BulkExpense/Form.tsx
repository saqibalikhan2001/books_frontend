/** @format */

import { Button, Checkbox, Form, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { rules } from "utils";
import { useStore } from "app/Hooks";
import { useTimeZone } from "app/Hooks";
import { Content, routeNames } from "static";
import { TooltipX } from "app/shared/ToolTip";
import { BulkExpenseFormProps } from "../Types";
import { Buttonx, DatePickerx, Icons, InputField, Selectx } from "app/shared";

const { Text } = Typography;
const { EXPENSE } = routeNames;
const { RiDeleteBinLine, VscAdd } = Icons;

export const BulkExpenseForm = ({ loading, onSubmit, createFormData }: BulkExpenseFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { TimeZone } = useStore();
  const { dateWithOrgTZ } = useTimeZone(`${TimeZone}`);
  const todayDate = dayjs(dateWithOrgTZ(dayjs(new Date())));
  const watch = Form.useWatch("bulk_expenses", form);
  const { expense_categories, paid_through_accounts, vendors, customers, taxes, base_currency } =
    createFormData;
  const initialBulkValues = {
    bulk_expenses: [
      {
        date: todayDate,
        tax_id: null,
        tag_id: null,
        description: "",
        total_amount: "",
        category_id: null,
        claim_reimbursement: false,
        currency_id: null,
      },
    ],
  };
  const handleNavigate = () => {
    navigate(EXPENSE);
  };
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        name="expense-form"
        onFinish={onSubmit}
        requiredMark={false}
        initialValues={initialBulkValues}
      >
        <table
          style={{
            width: "100%",
            borderSpacing: 0,
            border: "1px solid #ddd",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#d9d9d929" }}>
              <th style={{ textAlign: "left", padding: "8px", display: "flex" }}>
                EXPENSE DATE <span style={{ color: "red" }}>*</span>
              </th>
              <th style={{ textAlign: "left", padding: "8px" }}>VENDOR</th>
              <th style={{ textAlign: "left", padding: "8px" }}>CUSTOMER</th>
              <th style={{ textAlign: "left", padding: "8px" }}>CATEGORY</th>
              <th style={{ textAlign: "left", padding: "8px" }}>TAX</th>
              <th style={{ textAlign: "left", padding: "8px" }}>AMOUNT</th>
              <th style={{ textAlign: "left", padding: "8px" }}>BILLABLE</th>
              <th style={{ textAlign: "left", padding: "8px" }}>PAID THORUGH</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Projects</th>
            </tr>
          </thead>
          <Form.List name="bulk_expenses">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  return (
                    <tbody>
                      <tr key={key}>
                        <td style={{ textAlign: "left", padding: "8px", width: "10%" }}>
                          <DatePickerx
                            {...restField}
                            name={[`${name}`, "date"]}
                            size="large"
                            hidelabel
                            inputReadOnly
                            rules={rules({ message: Content.select_date })}
                            disableDate={(current: any) => {
                              return current && current.valueOf() > Date.now();
                            }}
                          />
                        </td>
                        <td style={{ textAlign: "left", padding: "8px", width: "10%" }}>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <Selectx
                              {...restField}
                              options={vendors}
                              className="flex_root"
                              placeholder="Select Vendor"
                              name={[`${name}`, "vendor_id"]}
                            />
                          </div>
                        </td>
                        <td style={{ textAlign: "left", padding: "8px", width: "10%" }}>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <Selectx
                              {...restField}
                              options={customers}
                              className="flex_root"
                              placeholder="Select Customer"
                              name={[`${name}`, "customer_id"]}
                            />
                          </div>
                        </td>
                        <td style={{ textAlign: "left", padding: "8px", width: "10%" }}>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <Selectx
                              {...restField}
                              className="flex_root"
                              options={expense_categories}
                              placeholder="Select Category"
                              name={[`${name}`, "category_id"]}
                              rules={rules({ message: Content.select_category })}
                            />
                          </div>
                        </td>
                        <td style={{ textAlign: "left", padding: "8px", width: "10%" }}>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <Selectx
                              {...restField}
                              options={taxes}
                              className="flex_root"
                              placeholder="Select Tax"
                              name={[`${name}`, "tax_id"]}
                              showSearch={false}
                              allowClear={false}
                            />
                          </div>
                        </td>
                        <td style={{ textAlign: "left", padding: "8px", width: "15%" }}>
                          <InputField
                            {...restField}
                            name={[`${name}`, "total_amount"]}
                            rules={rules({ message: Content.select_amount })}
                            placeholder="Enter Amount"
                            addonBefore={base_currency?.symbol}
                            //for future use
                            // addonBefore={
                            //   <Selectx
                            //     {...restField}
                            //     name={[`${name}`, "currency_id"]}
                            //     options={currencies}
                            //     size="small"
                            //     showSearch={false}
                            //     allowClear={false}
                            //     defaultValue={base_currency}
                            //   />
                            // }
                          />
                        </td>

                        <td style={{ textAlign: "left", padding: "8px", width: "5%" }}>
                          <Form.Item
                            {...restField}
                            valuePropName="checked"
                            name={[`${name}`, "billable"]}
                          >
                            <Checkbox></Checkbox>
                          </Form.Item>
                        </td>
                        <td style={{ textAlign: "left", padding: "8px", width: "10%" }}>
                          <Selectx
                            {...restField}
                            placeholder="Select"
                            className="flex_root"
                            options={paid_through_accounts}
                            name={[`${name}`, "paid_through_id"]}
                            disabled={watch && watch.length && watch[key]?.claim_reimbursement}
                          />
                        </td>
                        <td style={{ textAlign: "left", padding: "8px", width: "10%" }}>
                          <Selectx
                            {...restField}
                            placeholder="Select"
                            className="flex_root"
                            options={paid_through_accounts}
                            name={[`${name}`, "projects"]}
                            disabled
                          />
                        </td>
                        <td>
                          <TooltipX title="Delete">
                            <Button
                              shape="circle"
                              onClick={() => remove(name)}
                              style={{ marginBottom: "23px" }}
                              icon={<RiDeleteBinLine size={14} color="red" />}
                            />
                          </TooltipX>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
                <Form.Item>
                  <Text
                    onClick={() => add()}
                    style={{ color: "blue", cursor: "pointer", marginLeft: "20px" }}
                  >
                    <VscAdd color="blue" /> Add Another Line
                  </Text>
                </Form.Item>
              </>
            )}
          </Form.List>
        </table>
        <Space style={{ paddingLeft: "30px" }}>
          <Buttonx btnText="Save" loading={loading} />
          <Buttonx
            type="default"
            btnText="Cancel"
            htmlType="button"
            clickHandler={handleNavigate}
          />
        </Space>
      </Form>
    </>
  );
};
