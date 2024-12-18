/**@format */

import { useEffect, useState } from "react";
import { Typography, Statistic, Table, Tag, Input } from "antd";
import { Labels } from "static";
import { convertValues } from ".";
import { AppliedModalProps } from "./Types";
import { Buttonx, Spinner } from "app/shared";
import { useCreateFormApi, useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";

const { Text } = Typography;

export const AppliedInvoiceForm = ({ loading, onSubmit, url, toggleModal }: AppliedModalProps) => {
  const { org_date_format } = useStore();
  const [loader, setLoader] = useState(true);
  const { invoice: invoices, creditNotes: creditNote, currency } = useCreateFormApi(url);

  const [isData, setIsData] = useState<any>([
    {
      invoice_date: "",
      invoice_id: null,
      invoice_no: "",
      status: "",
      total: 0,
      type: "",
      due: 0,
      used_credits: 0,
    },
  ]);

  useEffect(() => {
    if (creditNote?.length) {
      setIsData([...creditNote]);
      setLoader(false);
    }
  }, [invoices, creditNote]);

  const handleNumberChange = (_, index: number) => (event) => {
    let characterLength = event.target.value;
    const newNumber = characterLength.length <= 10 ? characterLength : characterLength.slice(0, 10);
    const newData = [...isData];
    newData[index] = {
      ...newData[index],
      used_credits: newNumber,
    };
    setIsData(newData);
  };

  const onConfirm = () => {
    onSubmit(isData);
  };
  const TableColumns = [
    {
      title: "Issue Date",
      dataIndex: "credit_note_date",
      width: 100,
      render: (value: any) => <>{getOrganizationDate(value, org_date_format)}</>,
    },
    {
      title: "Credit Note No",
      dataIndex: "credit_note_no",
      width: 130,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (status: any) => (
        <Tag
          className={`generic-badge no-break ${
            status && status === "partially applied"
              ? "partially-applied"
              : status === "partially paid"
              ? "partially-paid"
              : status
          }`}
        >
          {status === "partially applied"
            ? "PRTL Applied"
            : status === "partially paid"
            ? "PRTL Paid"
            : status}
        </Tag>
      ),
    },
    {
      title: "Issued Credit",
      dataIndex: "issued_credits",
      width: 150,
      className: "text-right",
      render: (value: any) => (
        <Statistic
          precision={2}
          className="no-space"
          value={value || 0}
          valueStyle={{ fontSize: "14px" }}
          prefix={currency.symbol}
        />
      ),
    },
    {
      title: "Available Credit",
      dataIndex: "balance",
      width: 150,
      className: "text-right",
      render: (value: any) => (
        <Statistic
          precision={2}
          className="no-space"
          value={value || 0}
          valueStyle={{ fontSize: "14px" }}
          prefix={currency.symbol}
        />
      ),
    },
    {
      title: "Amount To Credit",
      dataIndex: "used_credits",
      width: 145,
      render: (value: number | any, row: any, index: number) => {
        return (
          <>
            <Input
              min={0}
              name="rate"
              step="0.01"
              type="number"
              maxLength={10}
              value={value || 0.0}
              status={row?.balance >= value ? "" : "error"}
              className={`rate_box no-transition ${row.id && value !== null ? "no-border" : ""} ${
                row?.balance >= value ? "" : "error-text"
              }`}
              onBlur={() => {
                if (value) {
                  const newData = [...isData];
                  newData[index] = {
                    ...newData[index],
                    used_credits:
                      value >= row?.balance ? row.balance : (parseFloat(value)?.toFixed(2) as any),
                  };
                  setIsData(newData);
                } else {
                  const newData = [...isData];
                  newData[index] = {
                    ...newData[index],
                    used_credits: 0.0,
                  };
                  setIsData(newData);
                }
              }}
              prefix={
                <span
                  style={{
                    lineHeight: "30px",
                  }}
                >
                  {currency?.symbol}
                </span>
              }
              onFocus={(e) => e.target.select()}
              onChange={handleNumberChange(row, index)}
              onWheel={(e) => e.currentTarget.blur()}
              onKeyDown={(e) => {
                if (e.nativeEvent.key === "ArrowDown" || e.nativeEvent.key === "ArrowUp") {
                  e.preventDefault();
                }
              }}
            />

            {/* {value>=row?.balance && (
              <>
                <span style={{ color: "red" }}>Amount is not greater than available credit</span> <br />
              </>
            )} */}
          </>
        );
      },
    },
  ];

  if (loader) return <Spinner directionSize={"40vh"} />;
  return (
    <div className="main_wrapper px-30">
      <div className="_container">
        <div className="flexbox invoice_sub_heading justify-content-between">
          <div className="form_group flex-47 ">
            <Text className="credit-label">Apply Credits</Text>
            <Text className="credit-note-no">{invoices?.invoice_no}</Text>
          </div>
          <div className="form_group flex-47 ">
            <Text className="credit-label">Invoice Balance</Text>
            <Text className="available-credits">
              {currency?.symbol}
              {invoices?.payment_due?.toFixed(2)}
            </Text>
          </div>
        </div>
        <Table
          pagination={false}
          columns={TableColumns}
          dataSource={isData || []}
          rowKey={(record) => record.id}
          className="generic-table generic_invoice_modal_table  credit-note-table no-radius"
        />
        <div className="bill_box justify_end">
          <div className="final_payment">
            <div className="d-flex align-center justify_between">
              <Typography.Title level={5}>Total Credits</Typography.Title>
              <Statistic
                precision={2}
                prefix={currency?.symbol}
                className="no-space remaining-credits"
                value={convertValues(isData, "used_credits")}
              />
            </div>
          </div>
        </div>
        <div className="bill_box justify_end">
          <div className="final_payment">
            <div className="d-flex align-center justify_between">
              <Typography.Title level={5}>Invoice Balance Due</Typography.Title>
              <Statistic
                precision={2}
                prefix={currency?.symbol}
                className="no-space remaining-credits"
                value={invoices?.payment_due - convertValues(isData, "used_credits")}
              />
            </div>
          </div>
        </div>
        <div className="button_flexbox flex-end ">
          <Buttonx
            type="default"
            btnText="Cancel"
            htmlType="button"
            clickHandler={toggleModal}
            className="btn-default btn-form-size cate_cancel_btn mr-20 mb-20"
          />
          <div className="d-flex align-center new_prod_btn">
            <Buttonx
              block
              loading={loading}
              btnText={Labels.SAVE}
              clickHandler={onConfirm}
              className="btn-primary btn-form-size mb-20"
              disabled={
                convertValues(isData, "used_credits") > invoices?.payment_due ||
                convertValues(isData, "used_credits") <= 0
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
