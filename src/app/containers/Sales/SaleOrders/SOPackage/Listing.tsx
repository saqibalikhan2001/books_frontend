/** @format */

import { useMemo } from "react";
import { Table, Tag } from "antd";
import { Labels } from "static";
import { ActionMenu } from "app/shared";
import { PackageListingProps } from "./Types";
import { capitalize, getFullDate } from "utils";

const { NAME, SYMBOL, DELETE, _PACKAGES } = Labels;

export const PackagesListing = ({
  loading,
  listing = [],
  handleClick,
  handleConfirm,
  has_permission,
}: // handleShipment,
PackageListingProps) => {
  const memoColumns = useMemo(
    () => [
      {
        title: "Package No.",
        dataIndex: "package_no",
        key: SYMBOL,
        width: 130,
        ellipsis: true,
      },
      {
        title: "Date",
        dataIndex: "package_date",
        key: NAME,
        width: 120,
        ellipsis: true,
        render: (order_date: string) => getFullDate(order_date),
      },
      {
        title: "Customer Name",
        dataIndex: "customer_name",
        key: NAME,
        ellipsis: true,
        width: 200,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: NAME,
        ellipsis: true,
        width: 120,
        render: (status: string) => (
          <Tag
            autoCapitalize=""
            key={status}
            color={status === "draft" ? "red" : "green"}>
            {capitalize(status)}
          </Tag>
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
            shipment
            data={props}
            handleClick={handleClick}
            handleConfirm={handleConfirm}
            // handleShipment={handleShipment}
            canEdit={props.platform_type === "books"}
            deletePermission={
              props.platform_type === "books" ? has_permission : false
            }
            title={
              props.platform_type === "books" && has_permission
                ? `${DELETE} "${props.package_no}" ${_PACKAGES} ?`
                : "Access Denied"
            }
          />
        ),
      },
    ],
    //eslint-disable-next-line
    [has_permission]
  );

  return (
    <>
      <Table
        loading={loading}
        dataSource={listing}
        columns={memoColumns}
        pagination={false}
        rowKey={(record: any) => record.package_no}
      />
    </>
  );
};
