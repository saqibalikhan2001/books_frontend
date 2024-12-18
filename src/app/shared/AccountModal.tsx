import { useEffect, useState } from "react";
import { Modal, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useAxios } from "app/Hooks";
import { Spinner } from "./PageLoader";

export const AccountModal = ({ bool, toggle, detail }) => {
  const { callAxios } = useAxios();
  const [transaction, setTransaction] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    callAxios({
      url: `/report/account_history/${detail?.id}?date_range=this_year`,
    }).then((res) => {
      setTransaction(res?.data?.transactions);
      setIsLoading(false);
    });
  }, [detail?.id]);

  const columns = [
    {
      title: "DATE",
      dataIndex: "date",
      key: "DATE",
      render: (date: string) => dayjs(date).format("MMM DD, YY"),
    },
    {
      title: "ACCOUNT",
      dataIndex: "title",
      key: "ACCOUNT",
    },
    {
      title: "TRANSACTION DETAILS",
      dataIndex: "transaction_details",
      key: "TRANSACTION DETAILS",
    },
    {
      title: "TRANSACTION TYPE",
      dataIndex: "transaction_type",
      key: "TRANSACTION TYPE",
    },
    {
      title: "TRANSACTION#",
      dataIndex: "transaction_no",
      key: "TRANSACTION#",
    },
    {
      title: (
        <>
          DEBIT
          <Tooltip>
            <img
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/tooltip.svg`}
              alt="tooltip Icon"
              className="hover-effect pl-9"
            />
          </Tooltip>
        </>
      ),
      dataIndex: "debit",
      key: "DEBIT ?",
    },
    {
      title: (
        <>
          CREDIT
          <Tooltip>
            <img
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/tooltip.svg`}
              alt="tooltip Icon"
              className="hover-effect pl-9"
            />
          </Tooltip>
        </>
      ),
      dataIndex: "credit",
      key: "CREDIT ?",
    },
    {
      title: (
        <>
          AMOUNT
          <Tooltip>
            <img
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/tooltip.svg`}
              alt="tooltip Icon"
              className="hover-effect pl-9"
            />
          </Tooltip>
        </>
      ),
      dataIndex: "total_balance",
      key: "AMOUNT ?",
    },
  ];

  return (
    <div>
      <Modal
        open={bool}
        destroyOnClose
        centered={true}
        footer={null}
        width={"80vw"}
        style={{ top: 0 }}
        maskClosable={false}
        onCancel={() => {
          toggle();
        }}
        closeIcon={
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
            alt="close Icon"
            className="close-icon-align"
          />
        }
      >
        <div className="generic_modal px-30">
          {isLoading ? (
            <Spinner />
          ) : (
            <Table
              rowKey="key"
              bordered={false}
              columns={columns}
              pagination={false}
              dataSource={transaction}
              style={{ marginTop: "8px" }}
              className="generic-table no-radius"
            />
          )}
        </div>
      </Modal>
    </div>
  );
};
