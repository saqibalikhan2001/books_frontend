/** @format */

import { Button, Col, Form, List, Row, Typography } from "antd";
import { Icons, InputField, Selectx } from "app/shared";
import { TooltipX } from "app/shared/ToolTip";
import { getTotal, getTotalPrice, gettaxlist } from "utils";
import { ExpenseDetailProps } from "../Types";

const { Text, Title } = Typography;
const { RiDeleteBinLine, VscAdd } = Icons;

export const ExpenseDetail = ({ form, taxes, categories }: ExpenseDetailProps) => {
  const tax_inclusive = Form.useWatch("tax_inclusive", form);
  const itemizedData = Form.useWatch("expense_details", form);
  const expensetotal = getTotal(itemizedData);
  const taxlist = gettaxlist(itemizedData, taxes, tax_inclusive);

  return (
    <>
      <table
        style={{
          width: "100%",
          borderSpacing: 0,
          border: "1px solid #ddd",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#d9d9d929" }}>
            {/* <th style={{ textAlign: "left", padding: "8px" }}>Tags</th> */}
            <th style={{ textAlign: "left", padding: "8px" }}>Expense Account</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Description</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Tax</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Amount</th>
          </tr>
        </thead>
        <Form.List name="expense_details">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <tbody>
                  <tr style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)" }}>
                    {/* <td style={{ textAlign: "left", padding: "8px", width: "20%" }}>
                      <div style={{ display: "flex" }}>
                        {tags?.map((tag: any, index: number) => {
                          return (
                            <>
                              <Selectx
                                label={tag.name}
                                className="flex_root"
                                placeholder="Select Tags"
                                options={tag.tag_details}
                                name={[`${name}`, `expense_tags`, `${index}`]}
                                rules={
                                  tag.mandatory ? rules({ message: `Select ${tag?.name}` }) : []
                                }
                                // labelInValue
                              />
                            </>
                          );
                        })}
                      </div>
                    </td> */}
                    <td style={{ textAlign: "left", padding: "8px", width: "15%" }}>
                      <Selectx
                        {...restField}
                        size="large"
                        label="Expense Account"
                        options={categories}
                        className="flex_root"
                        placeholder="Select Account"
                        name={[`${name}`, "category_id"]}
                        rules={[
                          {
                            required: true,
                            message: "please select category",
                          },
                        ]}
                      />
                    </td>
                    <td style={{ textAlign: "left", padding: "8px", width: "20%" }}>
                      <InputField
                        size="large"
                        label="Description"
                        placeholder="Description"
                        name={[`${name}`, "description"]}
                      />
                    </td>
                    <td style={{ textAlign: "left", padding: "8px", width: "20%" }}>
                      <Selectx
                        label="Tax"
                        {...restField}
                        size="large"
                        options={taxes}
                        className="flex_root"
                        name={[`${name}`, "tax_id"]}
                        placeholder="Select Catgeory"
                      />
                    </td>
                    <td style={{ textAlign: "left", padding: "8px", width: "20%" }}>
                      <InputField
                        size="large"
                        type="number"
                        label="Amount"
                        name={[`${name}`, "amount"]}
                        rules={[
                          {
                            required: true,
                            message: "please enter amount",
                          },
                        ]}
                      />
                    </td>
                    <td style={{ textAlign: "left", padding: "8px", width: "5%" }}>
                      <TooltipX title="Delete">
                        <Button
                          shape="circle"
                          onClick={() => remove(name)}
                          icon={<RiDeleteBinLine size={14} color="red" />}
                        />
                      </TooltipX>
                    </td>
                  </tr>
                </tbody>
              ))}

              <Form.Item>
                <Text onClick={() => add()} style={{ color: "blue", cursor: "pointer" }}>
                  <VscAdd color="blue" /> Add Another Line
                </Text>
              </Form.Item>
              {
                <List
                  size="small"
                  dataSource={taxlist as any}
                  renderItem={(item: any) => {
                    return (
                      <Row key={item?.label}>
                        <Col span={12}>
                          <List.Item>{item?.label}</List.Item>
                        </Col>
                        <Col span={12}>
                          <List.Item>{item?.value ? `${item?.value}` : ""}</List.Item>
                        </Col>
                      </Row>
                    );
                  }}
                />
              }
            </>
          )}
        </Form.List>
      </table>
      <Row>
        <Col span={12}>
          <Title level={4}>{`Sub Total ($)`}</Title>
        </Col>
        <Col span={12}>
          <Title level={4}>{expensetotal}</Title>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Title level={4}>Expense Total($)</Title>
        </Col>
        <Col span={9}>
          <Title level={4}>{getTotalPrice(expensetotal, taxlist, tax_inclusive)}</Title>
        </Col>
      </Row>
    </>
  );
};
