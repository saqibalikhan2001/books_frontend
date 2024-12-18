/** @format */

import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Statistic, Typography } from "antd";
import { endpoints, routeNames } from "static";
import { capitalize, getOrganizationDate } from "utils";
import { EstimateInvoiceModal } from "./EstimateInvoiceModal";
import { useAxios, usePermissions, useStore } from "app/Hooks";
import { ActionMenu, PdfViewer, Tablex, Toast } from "app/shared";

export const InvoicesList = ({ url, has_permission, refetch, isModal }: any) => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { org_date_format } = useStore();
  const { checkPermission } = usePermissions();
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [estInvoiceId, setEstInvoiceId] = useState<Number>();
  const [estInvoiceModal, setEstInvoiceModal] = useState(false);

  const { has_InvoiceDelete_permission } = checkPermission("InvoiceDelete");

  //   const [filter, setFilter] = useState<any>({
  //     sortOrder: "descend",
  //     columnType: "invoice_date",
  //     resonseLength: 0,
  //   });

  //   const handleFilter: TableProps<any>["onChange"] = (_, __, sorter: any) => {
  //     setFilter({
  //       ...filter,
  //       columnType: sorter.columnKey,
  //       sortOrder: filter.sortOrder === "ascend" ? "descend" : "ascend",
  //     });
  //   };
  //   const Title = ({ type, title }) => {
  //     return (
  //       <div className="">
  //         {title}
  //         {filter.resonseLength > 0 && !isModal && filter.columnType === type && (
  //           <TooltipX
  //             title={`Sort by ${filter.sortOrder === "ascend" ? "asc" : "desc"}`}
  //             placement="bottom"
  //           >
  //             {filter.sortOrder === "ascend" ? ascendingIcon : descendingIcon}
  //           </TooltipX >
  //         )}
  //       </div>
  //     );
  //   };
  // useEffect(() => {
  //   if (!listing?.invoices?.data?.length) {
  //     handletoggle(handleFullScreen);
  //   }
  // }, [listing?.invoices?.data?.length]);

  const togglePdfModal = () => setPdfModal(!pdfModal);

  const handlePdf = (data) => {
    setPdfUrl(`${endpoints.INVOICES}/${data?.id}/pdf`);
    togglePdfModal();
  };
  const sentMark = useCallback(
    (data) =>
      callAxios({
        url: `${endpoints.INVOICES}/${data?.id}${endpoints.SENT}`,
        method: "put",
      }).then((res) => {
        if (res) {
          Toast({ message: res.message });
          refetch();
        }
      }),
    //eslint-disable-next-line
    [refetch]
  );

  const sendEmail = (data) => {
    navigate(`${routeNames?.EMAIL}?id=${data.id}`);
  };

  const handleClick = (data) => {
    setEstInvoiceId(data.id);
    toggleEstimateInvoiceModal();
  };
  const handleConfirm = (data: any) => {
    callAxios({
      method: "delete",
      url: `/invoices/${data.id}`,
    }).then((res: any) => {
      if (res) {
        Toast({ message: res.message });
        refetch();
      }
    });
  };
  const toggleEstimateInvoiceModal = () => setEstInvoiceModal(!estInvoiceModal);

  const memoizeClick = useCallback(handleClick, [navigate, refetch]);
  const memoizeConfirm = useCallback(handleConfirm, [navigate, refetch]);
  const memoColumns = useMemo(
    () => [
      {
        title: "Date",
        width: 50,
        ellipsis: true,
        key: "invoice_date",
        dataIndex: "",
        render: (props: any) => getOrganizationDate(props?.invoice_date, org_date_format),
      },
      {
        title: "Invoice number",
        width: 80,
        dataIndex: "invoice_no",
        ellipsis: true,
        key: "invoice_no",
        render: (invoice_no: any) => <Typography>{invoice_no}</Typography>,
      },
      {
        title: "Amount",
        className:"text-right",
        width: 70,
        ellipsis: true,
        key: "payment_mode",
        dataIndex: "",
        render: (props: any) => (
          <Statistic
            precision={2}
            className="no-space"
            value={props.total}
            prefix={props?.symbol}
            valueStyle={{ fontSize: "14px" }}
          />
        ),
      },
      {
        title: "Status",
        width: 50,
        dataIndex: "status",
        ellipsis: true,
        key: "payment_made",
        render: (status: string) => (
          <span
            className={`generic-badge ${status === "partially paid" ? "partially-paid" : status}`}
          >
            {capitalize(status === "partially paid" ? "PRTL Paid" : status)}
          </span>
        ),
      },
      {
        title: "",
        dataIndex: "",
        width: 50,
        key: "x",
        align: "center" as const,
        render: (props: any) => {
          return !isModal ? (
            <ActionMenu
              showEdit
              estInvoice
              data={props}
              sentMark={sentMark}
              handlePdf={handlePdf}
              sendEmail={sendEmail}
              handleClick={memoizeClick}
              currentStatus={props?.status}
              handleConfirm={memoizeConfirm}
              canEdit={props.platform_type === "books" && props?.status === "draft"}
              deletePermission={
                props.platform_type === "books" && props.status === "draft"
                  ? has_InvoiceDelete_permission
                  : false
              }
              title={
                props.platform_type === "books" &&
                has_InvoiceDelete_permission &&
                props.status === "draft"
                  ? `Are you sure you want to delete "${props.invoice_no}"?`
                  : "Permission Denied"
              }
            />
          ) : null;
        },
      },
    ],
    //eslint-disable-next-line
    [has_permission]
  );

  return (
    <>
      <EstimateInvoiceModal
        estInvoiceId={estInvoiceId}
        setEstInvoiceId={setEstInvoiceId}
        estInvoiceModal={estInvoiceModal}
        toggleEstimateInvoiceModal={toggleEstimateInvoiceModal}
      />
      <Tablex
        url={url}
        estimateInvoices
        rowKey="invoice_no"
        showButton={false}
        columns={memoColumns}
      />
      {pdfModal && (
        <PdfViewer pdfModal={pdfModal} togglePdfModal={togglePdfModal} pdfUrl={pdfUrl} />
      )}
    </>
  );
};
