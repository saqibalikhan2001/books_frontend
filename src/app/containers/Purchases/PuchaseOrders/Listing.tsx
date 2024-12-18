/** @format */

import { useMemo } from "react";
import { Tag, Typography } from "antd";
import { Labels, endpoints } from "static";
import { usePermissions,useStore } from "app/Hooks";
import { capitalize ,getOrganizationDate} from "utils";
import { ActionMenu, MainTable } from "app/shared";
import { PurshaseOrderListingProps } from "./Types";

const { PURCHASE_ORDERS } = endpoints;
const { Text } = Typography;
const { NAME, SYMBOL, CODE, DELETE, _PURCHSE_ORDERS } = Labels;

export const PurchaseOrderListing = ({
  loading,
  listing,
  refetch,
  showDetail,
  handleClick,
  handleConfirm,
  bulkDeleteTrue,
  handleViewClick,
}: PurshaseOrderListingProps) => {
  const { checkPermission } = usePermissions();
  const { org_date_format } = useStore();
  const { has_PurchaseOrderDelete_permission } = checkPermission("PurchaseOrderDelete");

  const memoColumns = useMemo(
    () => [
      {
        title: "Date",
        dataIndex: "order_date",
        key: NAME,
        width: 120,
        ellipsis: true,
        render: (order_date: string) => getOrganizationDate(order_date, org_date_format),
      },
      {
        title: "Purchase Order#",
        dataIndex: "purchase_order_no",
        key: SYMBOL,
        width: 150,
        ellipsis: true,
      },
      {
        title: "Refrence#",
        dataIndex: "reference",
        key: CODE,
        width: showDetail ? 0 : 120,
        ellipsis: true,
      },
      {
        title: "Vendor",
        dataIndex: "display_name",
        key: NAME,
        ellipsis: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: NAME,
        ellipsis: true,
        width: showDetail ? 0 : 120,
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
        width: showDetail ? 0 : 150,
        ellipsis: true,
        render: (props: any) => (
          <Typography>
              <Text code>{props?.currency?.symbol}</Text>
            {`${props.total}`}
          </Typography>
        ),
      },
      {
        title: "",
        dataIndex: "",
        width: 50,
        key: "x",
        align: "center" as const,
        render: (props: any) => (
          <ActionMenu
            data={props}
            handleClick={handleClick}
            handleConfirm={handleConfirm}
            canEdit={props.platform_type === "books"}
            deletePermission={
              props.platform_type === "books" ? has_PurchaseOrderDelete_permission : false
            }
            title={
              props.platform_type === "books" && has_PurchaseOrderDelete_permission
                ? `${DELETE} "${props.invoice_no}" ${_PURCHSE_ORDERS} ?`
                : "Permisson Denied"
            }
          />
        ),
      },
    ],
    [handleClick, handleConfirm, has_PurchaseOrderDelete_permission, showDetail]
  );

  return (
    <>
      <MainTable
        refetch={refetch}
        loading={loading}
        listing={listing}
        url={PURCHASE_ORDERS}
        columns={memoColumns}
        bulkDeleteTrue={bulkDeleteTrue}
        handleViewClick={handleViewClick}
      />
    </>
  );
};
