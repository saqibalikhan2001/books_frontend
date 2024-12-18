import { useEffect, useMemo, useState } from "react";
import { Modal, Table, Typography } from "antd";
import { Spinner } from "./PageLoader";
import { getOrganizationDate } from "utils";
import { useAxios, useStore } from "app/Hooks";

export const PendingBillModal = ({
  url,
  toggle,
  visible = false,
}: {
  url: string;
  visible: boolean;
  toggle: () => void;
}) => {
  return (
    <Modal
      centered
      width={1140}
      footer={null}
      open={visible}
      destroyOnClose
      maskClosable={false}
      title="Pending Bills"
      wrapClassName="generic_modal_style"
      className="estimate_modal estimate_md_modal generic_md_modal  pending_invoice_modal"
      closeIcon={
        <img
          alt="close Icon"
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
        />
      }
      bodyStyle={{
        height: "100%",
      }}
      onCancel={() => {
        toggle();
      }}
    >
      <PendingTable url={url} />
    </Modal>
  );
};
const PendingTable = ({ url }: { url: string }) => {
  const { org_date_format } = useStore();
  const [data, setData] = useState<any>([]);
  const { callAxios, bool, toggle } = useAxios();
  const [customerDetail, setCustomerDetail] = useState<any>();

  useEffect(() => {
    toggle();
    callAxios({
      url: url,
    }).then((res) => {
      setData(res?.bill);
      setCustomerDetail(res?.supplier);
    });
  }, [url]);

  const memoColumns = useMemo(
    () => [
      {
        title: "Bill no.",
        dataIndex: "bill_no",
        ellipsis: true,
        width: 80,
      },
      {
        title: "Status",
        dataIndex: "status",
        ellipsis: true,
        width: 60,
        className: "pending_bill_status",
        render: (value: string) => (
          <div
            className={`generic-badge ${
              value && value === "partially paid" ? "partially-paid" : value
            }`}
          >
            {value === "partially paid" ? "PRTL Paid" : value}
          </div>
        ),
      },
      {
        title: "Issue date",
        dataIndex: "bill_date",
        width: 80,
        ellipsis: true,
        render: (date: string) => getOrganizationDate(date, org_date_format),
      },
      {
        title: "Total",
        dataIndex: "",
        width: 110,
        className: "text-right",
        ellipsis: true,
        render: (render: any) => <>{`${render?.currency_symbol}${render?.total?.toFixed(2)}`}</>,
      },
      {
        title: "Balance",
        dataIndex: "",
        ellipsis: true,
        width: 110,
        className: "text-right",
        render: (render: any) => (
          <>{`${render?.currency_symbol}${render?.balance_due?.toFixed(2)}`}</>
        ),
      },
    ],
    //eslint-disable-next-line
    [data]
  );

  return (
    <>
      {bool ? (
        <Spinner />
      ) : (
        <div className="main_wrapper pending_bill_modal">
          <div className="_container">
            <Typography.Text>
              <b>Supplier :</b> {customerDetail?.display_name}
            </Typography.Text>
            <Table
              dataSource={data}
              pagination={false}
              columns={memoColumns}
              className="generic-table no-radius"
            />
          </div>
        </div>
      )}
    </>
  );
};
