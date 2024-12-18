/** @@format */

import { Checkbox, Row, Col, Typography, Divider } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { roleLabels, setPermissionsList } from "./roles";
import { RoleCheckboxFormProps } from "../Types";
// import { useBool } from "app/Hooks";
// import { generateRoleOptions } from "utils";
const { Group } = Checkbox;
const { Text } = Typography;

export const RoleCheckBox = ({
  list,
  title,
  // setSales,
  dispatch,
  // is_sales_person,
  itemPermissions,
}: RoleCheckboxFormProps) => {
  // const [checked, setChecked] = useState(false);
  // const { bool: intermediate, setTrue, setFalse } = useBool();
  const handleDependentCheck = (checkedValues: CheckboxValueType[], value: string) => {
    const dependencies: { [key: string]: string[] } = {
      View: [],
      Create: ["View"],
      Edit: ["View", "Create"],
      Delete: ["View", "Create", "Edit"],
    };

    const actions = ["View", "Create", "Edit", "Delete"];

    actions.forEach((action) => {
      if (value.endsWith(action)) {
        dependencies[action].forEach((dependency) => {
          const newValue = value.replace(action, dependency);
          if (!checkedValues.includes(newValue)) {
            checkedValues.push(newValue);
          }
        });
      }
    });

    return checkedValues;
  };

  const onChange = (checkedValues: CheckboxValueType[]) => {
    checkedValues = [...checkedValues];
    list.forEach((title) => {
      ["View", "Create", "Edit", "Delete"].forEach((action) => {
        const value = `${title}${action}`;
        if (checkedValues.includes(value)) {
          checkedValues = handleDependentCheck(checkedValues, value);
        }
      });
    });

    setPermissionsList(checkedValues);
    dispatch({
      type: title.toLowerCase(),
      payload: checkedValues as CheckboxValueType[],
    });
    // if (!checkedValues.length) {
    //   setFalse();
    //   setChecked(false);
    // } else if (checkedValues.length < systemPermissions.length) setTrue();
  };

  // const onTitleChecked = (e: any) => {
  //   if (intermediate) {
  //     setFalse();
  //     dispatch({
  //       type: title.toLowerCase(),
  //       payload: [],
  //     });
  //     setSales(false);
  //     setChecked(false);
  //     setPermissionsList([]);
  //   } else {
  //     const { checked } = e.target;
  //     setChecked(checked);
  //     const permissions = checked ? generateRoleOptions(list) : [];
  //     setPermissionsList(permissions);
  //     setSales(false);
  //     dispatch({
  //       type: title.toLowerCase(),
  //       payload: permissions,
  //     });
  //   }
  // };
  return (
    <div className="__add_role_row">
      <Row>
        <Col span={24}>
          <div className="form_box pt-8 __add_role_title">
            {/* <Checkbox
              value={title}
              checked={checked || (title === "Sales" && is_sales_person)}
              indeterminate={intermediate}
              onChange={onTitleChecked}
            > */}
            <Text strong>{title === "TablePreferences" ? "Table Preferences" : title}</Text>
            {/* </Checkbox> */}
          </div>
        </Col>
      </Row>
      <Divider style={{ margin: 0, border: 0 }} />
      <Group
        onChange={onChange}
        value={itemPermissions}
        style={{ width: "100%", display: "block" }}
      >
        <div className="form_box pl-9">
          {list.map((title: string) => (
            <Row key={title}>
              <Col span={7} style={{ paddingBottom: "3px", paddingTop: "5px" }}>
                <Text>{roleLabels[title]}</Text>
              </Col>
              <Col span={9} offset={8}>
                <Row gutter={[30, 2]} align="middle">
                  <Col span={6}>
                    {title !== "ItemAdjustment" && title !== "Tax" && (
                      <Checkbox value={`${title}View`} />
                    )}
                  </Col>
                  <Col span={6}>
                    {!title.includes("Preference") &&
                      !title.includes("Dashboard") &&
                      !title.includes("Journal") &&
                      !title.includes("Ledger") &&
                      title !== " GeneralLedgerReport" &&
                      title !== "SalesByProductReport" &&
                      title !== "SalesByCustomerReport" &&
                      title !== "SalesBySalesPersonReport" &&
                      title !== "InvoiceReport" &&
                      title !== "EstimateReport" &&
                      title !== "CustomerBalanceReport" &&
                      title !== "ReceivableSummaryReport" &&
                      title !== "ReceivableDetailReport" &&
                      title !== "ArAgingReport" &&
                      title !== "ArAgingDetailsReport" &&
                      // title !== "PurchaseReport" &&
                      title !== "BillReport" &&
                      title !== "BillPaymentReport" &&
                      title !== "RefundReport" &&
                      title !== "PaymentReceiptsReport" &&
                      title !== "CreditNotesReport" &&
                      title !== "TaxSummaryReport" &&
                      title !== "TaxByProductsReport" &&
                      title !== "TaxSummaryTimeDurationReport" &&
                      title !== "TaxByProductsTimeDurationReport" &&
                      title !== "TaxByCustomerReport" &&
                      title !== "TaxBySupplierReport" &&
                      !title.includes("TrialBalance") && <Checkbox value={`${title}Create`} />}
                  </Col>
                  <Col span={6}>
                    {(title === "DashboardPreference" ||
                      (title !== "ItemAdjustment" &&
                        title !== "Tax" &&
                        !title.includes("Dashboard") &&
                        title !== " GeneralLedgerReport" &&
                        title !== "SalesByProductReport" &&
                        title !== "SalesByCustomerReport" &&
                        title !== "SalesBySalesPersonReport" &&
                        title !== "InvoiceReport" &&
                        title !== "EstimateReport" &&
                        title !== "CustomerBalanceReport" &&
                        title !== "ReceivableSummaryReport" &&
                        title !== "ReceivableDetailReport" &&
                        title !== "ArAgingReport" &&
                        title !== "ArAgingDetailsReport" &&
                        // title !== "PurchaseReport" &&
                        title !== "BillReport" &&
                        title !== "BillPaymentReport" &&
                        title !== "RefundReport" &&
                        title !== "PaymentReceiptsReport" &&
                        title !== "CreditNotesReport" &&
                        title !== "TaxSummaryReport" &&
                        title !== "TaxByProductsReport" &&
                        title !== "TaxSummaryTimeDurationReport" &&
                        title !== "TaxByProductsTimeDurationReport" &&
                        title !== "TaxByCustomerReport" &&
                        title !== "TaxBySupplierReport" &&
                        !title.includes("Journal") &&
                        !title.includes("Ledger") &&
                        !title.includes("TrialBalance"))) && <Checkbox value={`${title}Edit`} />}
                  </Col>
                  <Col span={6}>
                    {!title.includes("Preference") &&
                      !title.includes("Dashboard") &&
                      title !== "Tax" &&
                      title !== " GeneralLedgerReport" &&
                      title !== "SalesByProductReport" &&
                      title !== "SalesByCustomerReport" &&
                      title !== "SalesBySalesPersonReport" &&
                      title !== "InvoiceReport" &&
                      title !== "EstimateReport" &&
                      title !== "CustomerBalanceReport" &&
                      title !== "ReceivableSummaryReport" &&
                      title !== "ReceivableDetailReport" &&
                      title !== "ArAgingReport" &&
                      title !== "ArAgingDetailsReport" &&
                      // title !== "PurchaseReport" &&
                      title !== "BillReport" &&
                      title !== "BillPaymentReport" &&
                      title !== "RefundReport" &&
                      title !== "PaymentReceiptsReport" &&
                      title !== "CreditNotesReport" &&
                      title !== "TaxSummaryReport" &&
                      title !== "TaxByProductsReport" &&
                      title !== "TaxSummaryTimeDurationReport" &&
                      title !== "TaxByProductsTimeDurationReport" &&
                      title !== "TaxByCustomerReport" &&
                      title !== "TaxBySupplierReport" &&
                      title !== "ItemAdjustment" &&
                      !title.includes("Journal") &&
                      !title.includes("Ledger") &&
                      !title.includes("TrialBalance") && <Checkbox value={`${title}Delete`} />}
                  </Col>
                </Row>
              </Col>
            </Row>
          ))}
        </div>
      </Group>
    </div>
  );
};
