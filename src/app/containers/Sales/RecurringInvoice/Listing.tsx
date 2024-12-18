/** @format */

import { useMemo } from "react";
import { Tag, Typography, } from "antd";
import { Labels, endpoints } from "static";
import { usePermissions } from "app/Hooks";
import { capitalize, getFullDate } from "utils";
import { ActionMenu, MainTable } from "app/shared";
import { RecurringInvoiceDataSourceProps, RecurringInvoiceListingProps } from "./Types";
import { TooltipX } from "app/shared/ToolTip";

const { Text } = Typography;
const { RECURRING_INVOICE } = endpoints;
const { NAME, CODE, DELETE, _INVOICES } = Labels;

export const InvoiceListing = ({
  refetch,
  loading,
  listing,
  showDetail,
  handleClick,
  handleConfirm,
  bulkDeleteTrue,
  handleViewClick,
}: RecurringInvoiceListingProps) => {
  const { checkPermission } = usePermissions();
  const { has_InvoiceDelete_permission } = checkPermission("InvoiceDelete");

  const memoColumns = useMemo(
    () => [
      {
        title: "Customer Name",
        dataIndex: "display_name",
        key: NAME,
        ellipsis: true,
      },
      {
        title: "Profile Name",
        dataIndex: "profile_name",
        key: NAME,
        ellipsis: true,
        width: showDetail ? 110 : 120,
      },
      {
        title: "Frequency",
        dataIndex: "repeat_duration",
        key: NAME,
        ellipsis: true,
        width: showDetail ? 0 : 120,
      },
      {
        title: "Last Invoice Date",
        dataIndex: "start_date",
        key: NAME,
        ellipsis: true,
        width: showDetail ? 0 : 120,
        render: (date: string) => getFullDate(date),
      },
      {
        title: "Next Invoice Date",
        dataIndex: "next_recurring_inv_date",
        key: NAME,
        ellipsis: true,
        width: showDetail ? 0 : 120,
        // render: (date: string) => getFullDate(date),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: NAME,
        ellipsis: true,
        width: showDetail ? 0 : 110,
        render: (status: string) => (
          <Tag autoCapitalize="" key={status} color={status === "draft" ? "red" : "green"}>
            {capitalize(status)}
          </Tag>
        ),
      },
      {
        title: "Amount",
        dataIndex: "",
        key: CODE,
        width: showDetail ? 85 : 110,
        ellipsis: true,
        render: (props: RecurringInvoiceDataSourceProps) => (
          <Typography>
            <TooltipX title={props?.currency?.name}>
              <Text code>{props?.currency?.symbol}</Text>
            </TooltipX >
            {`${props.total}`}
          </Typography>
        ),
      },

      {
        title: "",
        dataIndex: "",
        width: 40,
        key: "x",
        align: "center" as const,
        render: (props: RecurringInvoiceDataSourceProps) => (
          <ActionMenu
            data={props}
            handleClick={handleClick}
            handleConfirm={handleConfirm}
            canEdit={props.platform_type === "books"}
            deletePermission={
              props.platform_type === "books" ? has_InvoiceDelete_permission : false
            }
            title={
              props.platform_type === "books" && has_InvoiceDelete_permission
                ? `${DELETE} "${props.invoice_no}" ${_INVOICES} ?`
                : "Permisson Denied"
            }
          />
        ),
      },
    ],
    [handleClick, handleConfirm, has_InvoiceDelete_permission, showDetail]
  );

  return (
    <>
      <MainTable
        loading={loading}
        refetch={refetch}
        listing={listing}
        columns={memoColumns}
        url={RECURRING_INVOICE}
        bulkDeleteTrue={bulkDeleteTrue}
        handleViewClick={handleViewClick}
      />
    </>
  );
};
