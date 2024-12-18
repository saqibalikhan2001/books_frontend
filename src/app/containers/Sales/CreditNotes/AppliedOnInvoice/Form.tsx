/**@format */

import { useEffect, useState } from "react";
import { Typography, Statistic, Table, Tag, Input } from "antd";
import { Labels } from "static";
import { AppliedModalProps } from "./Types";
import { Buttonx, Spinner } from "app/shared";
import { useCreateFormApi, useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";

const { Text } = Typography;

export const AppliedInvoiceForm = ({ loading, onSubmit, url, toggleModal }: AppliedModalProps) => {
  const { org_date_format } = useStore();
  const [credits, setCredits] = useState(0);
  const [loader, setLoader] = useState(true);
  const { invoices, creditNote } = useCreateFormApi(url);

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
    if (invoices?.length) {
      setIsData([...invoices]);
      setCredits(creditNote?.balance);

      setLoader(false);
    }
  }, [invoices, creditNote]);

  const handleNumberChange = (_, index: number) => (event) => {
    let characterLength = event.target.value;
    const newNumber = characterLength.length <= 10 ? characterLength : characterLength.slice(0, 10);
    const values = creditNote?.balance - newNumber;
    const newData = [...isData];
    newData[index] = {
      ...newData[index],

      used_credits: newNumber,
    };

    setIsData(newData);
    setCredits(values || 0);
  };
  const onConfirm = () => {
    onSubmit({ invoices: isData });
  };
  const TableColumns = [
    {
      title: "Invoice Date",
      dataIndex: "invoice_date",
      render: (value: any) => <>{getOrganizationDate(value, org_date_format)}</>,
    },
    {
      title: "Invoice No",
      dataIndex: "invoice_no",
    },
    {
      title: "Status abc",
      dataIndex: "status",
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
      title: "Amount",
      dataIndex: "total",
      className: "text-right",
      render: (value: any) => (
        <Statistic
          precision={2}
          value={value || 0}
          className="no-space"
          prefix={creditNote.symbol}
          valueStyle={{ fontSize: "14px" }}
        />
      ),
    },
    {
      title: "Balance Due",
      dataIndex: "due",
      className: "text-right",
      render: (value: any) => (
        <Statistic
          precision={2}
          value={value || 0}
          className="no-space"
          prefix={creditNote.symbol}
          valueStyle={{ fontSize: "14px" }}
        />
      ),
    },
    {
      title: "Amount To Credit",
      dataIndex: "used_credits",
      render: (value: number | any, row: any, index: number) => (
        <Input
          min={0}
          name="rate"
          step="0.01"
          type="number"
          value={parseFloat(value)}
          maxLength={10}
          className={`rate_box no-transition ${row.id && value !== null ? "no-border" : ""}`}
          onBlur={() => {
            if (value) {
              const newData = [...isData];
              newData[index] = {
                ...newData[index],
                used_credits: parseFloat(value).toFixed(2) as any,
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
              {creditNote?.symbol}
            </span>
          }
          onChange={handleNumberChange(row, index)}
          onFocus={(e) => e.target.select()}
        />
      ),
    },
  ];
  if (loader) return <Spinner directionSize={"41vh"} />;
  return (
    <div className="main_wrapper px-20">
      <div className="_container">
        <div className="flexbox invoice_sub_heading justify-content-between">
          <div className="form_group flex-47 ">
            <Text className="credit-label">{Labels.CREDIT_NOTE}</Text>
            <Text className="credit-note-no">{creditNote?.credit_note_no}</Text>
          </div>
          <div className="form_group flex-47 ">
            <Text className="credit-label">Total available credits</Text>
            <Text className="available-credits">
              {creditNote?.symbol}
              {creditNote?.balance.toFixed(2)}
            </Text>
          </div>
        </div>
        <Table
          pagination={false}
          columns={TableColumns}
          dataSource={isData || []}
          rowKey={(record) => record.id}
          className="generic-table generic_invoice_modal_table credit-note-table"
        />
        <div className="bill_box justify_end">
          <div className="final_payment">
            <div className="d-flex align-center justify_between">
              <Typography.Title level={5}>Remaining Credits</Typography.Title>
              <Statistic
                precision={2}
                value={credits}
                prefix={creditNote?.symbol}
                className="no-space remaining-credits"
              />
            </div>
          </div>
        </div>
        <div className="button_flexbox flex-end 121212">
          <Buttonx
            type="default"
            btnText="Cancel"
            htmlType="button"
            clickHandler={toggleModal}
            className="btn-default btn-form-size cate_cancel_btn mr-20"
          />
          <div className="d-flex align-center new_prod_btn">
            <Buttonx
              block
              loading={loading}
              btnText={Labels.SAVE}
              disabled={credits < 0 || isData.every((item) => item.used_credits <= 0)}
              clickHandler={onConfirm}
              className={`btn-primary btn-form-size ${credits < 0 ? "disabled-save-btn" : ""}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
