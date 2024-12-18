import { useEffect, useMemo, useState } from "react";
import { Modal, Table } from "antd";
import { routeNames } from "static";
import { Spinner } from "./PageLoader";
import { getOrganizationDate } from "utils";
import { useAxios, useStore } from "app/Hooks";

export const PendingInvoiceModal = ({
  url,
  toggle,
  module,
  visible = false,
}: {
  url: string;
  module?: any;
  visible: boolean;
  toggle: () => void;
}) => {
  const [customerDetail, setCustomerDetail] = useState<any>();
  return (
    <Modal
      centered
      width={1140}
      footer={null}
      destroyOnClose
      open={visible}
      maskClosable={false}
      wrapClassName="generic_modal_style"
      title={customerDetail ? `${customerDetail?.display_name} Pending Invoices` : ""}
      className="estimate_modal estimate_md_modal pending_invoice_modal pending-invoice"
      closeIcon={
        <img
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          alt="close Icon"
        />
      }
      bodyStyle={{
        height: "100%",
      }}
      onCancel={() => {
        toggle();
        setCustomerDetail(null);
      }}
    >
      <PendingTable
        url={url}
        setCustomerDetail={setCustomerDetail}
        // toggleModal={toggle}
        module={module}
      />
    </Modal>
  );
};

const PendingTable = ({
  url,
  module,
  setCustomerDetail,
}: // toggleModal = () => null,
{
  url: string;
  module?: any;
  setCustomerDetail: any;
  // toggleModal: any;
}) => {
  const { EMAIL } = routeNames;
  const { org_date_format } = useStore();
  const [data, setData] = useState<any>([]);
  const { callAxios, bool, toggle } = useAxios();

  useEffect(() => {
    toggle();
    callAxios({
      url: url,
    }).then((res) => {
      setData(res);
      setCustomerDetail(res?.customer);
    });
  }, [url]);

  const handleSend = (value) => {
    // toggleModal();
    window.open(`${module}${EMAIL}?idd=${value?.id}`);
    // toggle();
    // navigate(`${EMAIL}?id=${value.id}`);
  };

  const memoColumns = useMemo(
    () => [
      {
        title: "Invoice No.",
        dataIndex: "invoice_no",
        ellipsis: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        ellipsis: true,
        width: 130,
        className: "text-center",
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
        title: "Invoice date",
        dataIndex: "invoice_date",
        ellipsis: true,
        className: "text-left",
        render: (date: string) => getOrganizationDate(date, org_date_format),
      },

      {
        title: "Amount",
        dataIndex: "total",
        ellipsis: true,
        render: (total: number) => <>{`${data?.invoices[0]?.symbol}${total.toFixed(2)}`}</>,
      },
      {
        title: "Amount due",
        dataIndex: "payment_due",
        ellipsis: true,
        render: (payment_due: number) => (
          <>{`${data?.invoices[0]?.symbol}${payment_due.toFixed(2)}`}</>
        ),
      },
      {
        title: "Intimation",
        dataIndex: "",
        ellipsis: true,
        render: (invoice) => (
          <button
            onClick={() => {
              handleSend(invoice);
            }}
            className="btn-primary btn-form-size cursor-pointer"
            // style={{
            //   padding: "7px 20px",
            //   backgroundColor: "green",
            //   color: "white",
            //   border: "none",
            //   borderRadius: "4px",
            //   cursor: "pointer",
            // }}
          >
            Send
          </button>
        ),
      },
    ],
    //eslint-disable-next-line
    [data]
  );

  return (
    <>
      {bool ? (
        <Spinner directionSize={"42vh"} />
      ) : (
        <div className="main_wrapper mx-0">
          <div className="_container px-30">
            <Table
              pagination={false}
              columns={memoColumns}
              dataSource={data?.invoices}
              className="generic-table no-radius generic_invoice_modal_table mh-405"
            />
          </div>
        </div>
      )}
    </>
  );
};
