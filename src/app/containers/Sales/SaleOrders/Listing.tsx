/** @format */

import { useMemo } from "react";
import { Tag, Typography } from "antd";
import { Labels, endpoints } from "static";
import { usePermissions } from "app/Hooks";
import { capitalize, getFullDate } from "utils";
import { ActionMenu, MainTable } from "app/shared";
import { SalesOrderListingProps, SoDataSourceProps } from "./Types";

const { Text } = Typography;
const { SALES_ORDERS } = endpoints;
const { NAME, SYMBOL, CODE, DELETE, _SALES_ORDERS } = Labels;

export const SalesOrderListing = ({
  loading,
  refetch,
  listing,
  handleClick,
  showDetail,
  handleConfirm,
  bulkDeleteTrue,
  handleViewClick,
}: SalesOrderListingProps) => {
  const { checkPermission } = usePermissions();
  const { has_SalesOrderDelete_permission } = checkPermission("SalesOrderDelete");

  const memoColumns = useMemo(
    () => [
      {
        title: "Date",
        dataIndex: "order_date",
        key: NAME,
        width: 80,
        ellipsis: true,
        render: (order_date: string) => getFullDate(order_date),
      },
      {
        title: "SalesOrder#",
        dataIndex: "sales_order_no",
        key: SYMBOL,
        width: 130,
        ellipsis: true,
      },
      {
        title: "Refrence#",
        dataIndex: "reference",
        key: CODE,
        width: showDetail ? 0 : 100,
        ellipsis: true,
      },
      {
        title: "Customer Name",
        dataIndex: "display_name",
        key: NAME,
        ellipsis: true,
        width: showDetail ? 0 : 200,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: NAME,
        ellipsis: true,
        width: showDetail ? 0 : 70,
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
        ellipsis: true,
        width: showDetail ? 0 : 80,
        render: (props: SoDataSourceProps) => (
          <Typography>
              <Text code>{props?.currency?.symbol}</Text>
            {`${props.total}`}
          </Typography>
        ),
      },
      {
        title: "",
        dataIndex: "",
        width: 30,
        key: "x",
        align: "center" as const,
        render: (props: SoDataSourceProps) => (
          <ActionMenu
            data={props}
            handleClick={handleClick}
            handleConfirm={handleConfirm}
            canEdit={props.platform_type === "books"}
            deletePermission={
              props.platform_type === "books" ? has_SalesOrderDelete_permission : false
            }
            title={
              props.platform_type === "books" && has_SalesOrderDelete_permission
                ? `${DELETE} "${props.sales_order_no}" ${_SALES_ORDERS} ?`
                : "Permission Denied"
            }
          />
        ),
      },
    ],
    [handleClick, handleConfirm, has_SalesOrderDelete_permission, showDetail]
  );

  return (
    <>
      <MainTable
        loading={loading}
        refetch={refetch}
        listing={listing}
        url={SALES_ORDERS}
        columns={memoColumns}
        bulkDeleteTrue={bulkDeleteTrue}
        handleViewClick={handleViewClick}
      />
    </>
  );
};
