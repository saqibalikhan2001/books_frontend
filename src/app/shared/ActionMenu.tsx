/**@format */
import { useMemo } from "react";
import { Dropdown, MenuProps, Popconfirm, Space } from "antd";
import { Labels } from "static";
import { RenderActionProps } from "./types";

const { YES, NO } = Labels;

export const ActionMenu = ({
  data,
  title,
  sentMark,
  markOpen,
  handlePdf,
  sendEmail,
  className,
  handleClick,
  handleClone,
  handleStatus,
  role = false,
  okText = "OK",
  bill = false,
  user = false,
  handleConfirm,
  currentStatus,
  status = true,
  expense = false,
  active = false,
  account = false,
  canEdit = true,
  invoice = false,
  refunds = false,
  product = false,
  contact = false,
  handleBillModal,
  convertToInvoice,
  estimate = false,
  category = false,
  showEdit = false,
  handlePdfDownload,
  estInvoice = false,
  has_joined = false,
  showDetail = false,
  creditnote = false,
  billPayment = false,
  paymentTerm = false,
  canMarkSent = false,
  hasModulePermission,
  billPayments = false,
  classpicker = "area",
  invoicePayment = false,
  paymentReceive = false,
  hasTransaction = false,
  deletePermission = true,
  InvoiceCreditnote = false,
  handleReceivePaymentModal,
}: RenderActionProps) => {
  const items: MenuProps["items"] = useMemo(
    () =>
      [
        {
          label: "Edit",
          disabled: !canEdit,
          key: "0",
          onClick: () => handleClick!(data),
          show: showEdit,
        },
        {
          key: "1",
          label: `${estimate || invoice || bill ? "Duplicate" : "Clone"}`,
          onClick: () => handleClone?.(data),
          show: product || contact || estimate || invoice || bill,
        },
        {
          key: "2",
          label: "Email",
          onClick: () => sendEmail?.(data),
          show: contact || estInvoice,
          // show: (contact && !showDetail) || estInvoice,
        },
        {
          key: "3",
          label: (
            <Popconfirm
              icon={null}
              key="confirm"
              title={title}
              placement="left"
              cancelText={NO}
              overlayClassName={className}
              onCancel={(e) => e?.stopPropagation()}
              showCancel={!hasTransaction && deletePermission}
              getPopupContainer={(trigger) =>
                paymentTerm ? document.body : (trigger.parentElement as HTMLElement)
              }
              // getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
              okText={!hasTransaction && deletePermission ? YES : okText}
              onConfirm={(e) => {
                e?.stopPropagation();
                !hasTransaction && deletePermission && handleConfirm(data);
              }}
            >
              <label
                style={{ cursor: "pointer", width: "100%", display: "block" }}
                onClick={(e) => e?.stopPropagation()}
              >
                Delete
              </label>
            </Popconfirm>
          ),
          show:
            product ||
            expense ||
            role ||
            user ||
            category ||
            contact ||
            estimate ||
            invoice ||
            estInvoice ||
            refunds ||
            creditnote ||
            bill ||
            invoicePayment ||
            billPayment ||
            paymentReceive ||
            InvoiceCreditnote ||
            billPayments ||
            account ||
            paymentTerm,
        },
        {
          key: "4",
          disabled: !status,
          label: active ? "Make inactive" : "Make active",
          onClick: () => handleStatus?.(data),
          show: product || contact || account || (user && !has_joined),
        },
        // {
        //   key: "5",
        //   // disabled: !status,
        //   label: "Change Status",
        //   children: ["Accepted", "Expired", "Rejected"].map((status) => ({
        //     key: Math.random().toString(),
        //     label: status,
        //     onClick: () => console.log(status),
        //   })),
        //   show: estimate && !showDetail,
        // },
        {
          key: "6",
          // disabled: !status,
          label: "Mark as sent",
          show:
            (estimate && currentStatus === "draft") ||
            (invoice && currentStatus === "draft") ||
            (estInvoice && currentStatus === "draft"),
          onClick: () => sentMark?.(data),
          disabled: canMarkSent,
        },
        {
          key: "7",
          disabled: currentStatus === "expired",
          label: paymentReceive ? "Send" : "Send in email",
          show:
            (estimate || invoice || creditnote || paymentReceive || bill || billPayments) &&
            !showDetail,
          onClick: () => sendEmail?.(data),
        },
        {
          key: "8",
          disabled: currentStatus !== "accepted",
          label: "Convert to invoice",
          show: estimate,
          onClick: () => convertToInvoice?.(data),
        },
        {
          key: "9",
          label: bill || billPayments ? "Print" : "View pdf",
          show: estimate || invoice || estInvoice || creditnote || bill || billPayments,
          onClick: () => handlePdf?.(data),
        },
        {
          key: "10",
          label: "Mark as open",
          // disabled: !status,
          show:
            (creditnote && currentStatus === "draft") ||
            (bill && currentStatus === "draft") ||
            (InvoiceCreditnote && currentStatus === "draft"),
          onClick: () => markOpen?.(data),
        },
        // {
        //   key: "11",
        //   label: "Supplier credit",
        //   disabled: bill,
        //   show: (bill && currentStatus === "draft"),
        //   // onClick: () => markOpen?.(data),
        // },
        {
          key: "12",
          label: invoice ? "Receive payment" : "Make payment",
          disabled: data?.status === "paid" || (data?.total ?? 0) <= 0,
          show:
            (bill && currentStatus === "draft") ||
            (bill && hasModulePermission) ||
            (invoice && currentStatus !== "paid") ||
            (invoice && hasModulePermission),
          onClick: invoice
            ? () => handleReceivePaymentModal?.(data)
            : () => handleBillModal?.(data),
        },
        {
          key: "13",
          label: "Download PDF",
          className: "no-wrap",
          //  disabled: data?.total===0,
          show: billPayments,
          onClick: () => handlePdfDownload?.(data),
        },
        // {
        //   key: "14",
        //   label: "Receive payment",
        //   disabled: data?.status === "paid" || (data?.total ?? 0) <= 0,
        //   show: (invoice && currentStatus !== "paid") || (invoice && hasModulePermission),
        //   onClick: () => handleReceivePaymentModal?.(data),
        // },
      ].filter((arr) => arr.show),
    [
      user,
      role,
      data,
      title,
      status,
      active,
      invoice,
      canEdit,
      product,
      contact,
      category,
      estimate,
      sentMark,
      markOpen,
      sendEmail,
      handlePdf,
      estInvoice,
      showDetail,
      handleClone,
      handleClick,
      handleStatus,
      billPayments,
      currentStatus,
      handleConfirm,
      handleBillModal,
      deletePermission,
      convertToInvoice,
      InvoiceCreditnote,
      hasModulePermission,
    ]
  );
  const rendomClass = (Math.random() + 1).toString(36).substring(7);
  return (
    <Space onClick={(e) => e?.stopPropagation()}>
      <div className={`${classpicker + rendomClass}`}>
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          placement="bottomRight"
          overlayClassName={`elepsis--dropdown ${category ? " category-dropdown" : ""}`}
          //@ts-ignore
          getPopupContainer={() => document.querySelector(`.${classpicker + rendomClass}`)}
        >
          <div className="ellipses_icon" onClick={(e) => e.stopPropagation()}>
            <img
              alt="ellipses Icon"
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/ellipsis.svg`}
            />
          </div>
        </Dropdown>
      </div>
    </Space>
  );
};
