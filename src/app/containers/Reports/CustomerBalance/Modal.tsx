import { Modal, Statistic, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAxios, useStore } from "app/Hooks";
import { Spinner } from "app/shared";
import { useEffect, useState } from "react";
import { capitalize, getOrganizationDate } from "utils";

export const BalanceModal = ({ open, handleOpen, data }) => {
  const { callAxios } = useAxios();
  const { org_date_format } = useStore();
  const [value, setValue] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      callAxios({
        url: `/report/customer/balance?date_range=${data?.date}&type=${data?.type}&contact_id=${data?.contactId}`,
      }).then((res) => {
        setValue(res);
        setIsLoading(false);
      });
    }
  }, [data?.date, data.type, data?.contactId]);
  const columns: ColumnsType<any> = [
    {
      title: "Date",
      dataIndex: "transaction_date",
      key: "date",
      width: 120,
      ellipsis: true,
      render: (value) => getOrganizationDate(value, org_date_format),
    },
    {
      title: "Transaction No",
      dataIndex: "transaction_no",
      key: "transaction_no",
      ellipsis: true,
      width: 130,
      className:'text-left',
    },
    {
      title: "Transaction Type",
      dataIndex: "transaction_type",
      key: "transaction_type",
      ellipsis: true,
      width: 150,
      className:'text-left',
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ellipsis: true,
      width: 150,
      className:'text-left',
      render: (value) => (
        <div
          className={`generic-badge balance--badges ${
            value && (value === "partially applied" || value === "prtl-applied")
              ? "partially-paid"
              : value
          }`}
        >
          {capitalize(
            value && (value === "partially applied" || value === "prtl-applied")
              ? "PRTL Applied"
              : value
          )}
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "",
      key: "payment_made",
      ellipsis: true,
      width: 200,
      className:'text-right',
      render: (value) => (
        <Statistic
          precision={2}
          className="no-space truncate_amount"
          value={value?.balance || 0}
          valueStyle={{ fontSize: "14px", fontWeight: "500",justifyContent:"flex-end" }}
          prefix={value?.symbol}
        />
      ),
    },
    {
      title: "Balance",
      dataIndex: "",
      key: "balance",
      ellipsis: true,
      width: 200,
      className:'text-right',
      render: (value) => (
        <Statistic
          precision={2}
          className="no-space truncate_amount"
          value={value?.total_balance || 0}
          valueStyle={{ fontSize: "14px", fontWeight: "500",justifyContent:"flex-end" }}
          prefix={value?.symbol}
        />
      ),
    },
  ];
  return (
    <Modal
      width={1000}
      footer={null}
      destroyOnClose
      centered={true}
      open={open}
      onOk={handleOpen}
      style={{ top: 0 }}
      maskClosable={false}
      closeIcon={
        <img
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          alt="close Icon"
          className="close-icon-align"
        />
      }
      onCancel={handleOpen}
      title="Customer Balance Details"
      wrapClassName="generic_modal_style refund_modal reports--refund-modal"
      className="estimate_modal estimate_md_modal tackle-tracker"
      bodyStyle={{
        height: "100% !important",
      }}
    >
      <div className="generic_modal px-30">
        {isLoading ? (
          <Spinner directionSize={window.innerWidth >= 1600 ? '345px' : '132px'} size={'50px'} />
        ) : (
          <Table
            className="generic-table tax_table data-list"
            columns={columns}
            dataSource={value || []}
            pagination={false}
            loading={{ spinning: isLoading, indicator: <Spinner /> }}
          />
        )}
      </div>
    </Modal>
  );
};
