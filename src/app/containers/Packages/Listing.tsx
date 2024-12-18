/** @format */

import { useMemo } from "react";
import { Space, Table, Tag, Typography } from "antd";
import { Labels } from "static";
import { ActionMenu } from "app/shared";
import { PackageListingProps } from "./Types";
import { capitalize, getFullDate } from "utils";
import { usePermissions, useSearchParam } from "app/Hooks";

const { NAME, SYMBOL, CODE, DELETE, _PACKAGES } = Labels;

export const PackagesListing = ({
  total,
  loading,
  showDetail,
  handleClick,
  listing = [],
  handleConfirm,
  handleViewClick,
}: PackageListingProps) => {
  const { checkPermission } = usePermissions();
  const { onChange, getParams } = useSearchParam("");
  const { page, pageSize } = getParams();
  const { has_PackageDelete_permission } = checkPermission("PackageDelete");
  const memoColumns = useMemo(
    () => [
      {
        title: "Date",
        dataIndex: "package_date",
        key: NAME,
        width: showDetail ? 95 : 120,
        ellipsis: true,
        render: (order_date: string) => getFullDate(order_date),
      },
      {
        title: "Package#",
        dataIndex: "package_no",
        key: SYMBOL,
        width: showDetail ? 0 : 130,
        ellipsis: true,
      },
      {
        title: "SalesOrder#",
        dataIndex: "sales_order_no",
        key: CODE,
        width: showDetail ? 0 : 120,
        ellipsis: true,
      },
      {
        title: "Customer Name",
        dataIndex: "display_name",
        key: NAME,
        ellipsis: true,
        width: showDetail ? 130 : 400,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: NAME,
        ellipsis: true,
        width: showDetail ? 95 : 120,
        render: (status: string) => (
          <Tag autoCapitalize="" key={status} color={status === "draft" ? "red" : "green"}>
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
            data={props}
            handleClick={handleClick}
            handleConfirm={handleConfirm}
            canEdit={props.platform_type === "books"}
            deletePermission={
              props.platform_type === "books" ? has_PackageDelete_permission : false
            }
            title={
              props.platform_type === "books" && has_PackageDelete_permission
                ? `${DELETE} "${props.package_no}" ${_PACKAGES} ?`
                : "Access Denied"
            }
          />
        ),
      },
    ],
    [handleClick, handleConfirm, has_PackageDelete_permission, showDetail]
  );

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    getCheckboxProps: (record: any) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <>
      <Table
        bordered
        loading={loading}
        dataSource={listing}
        columns={memoColumns}
        scroll={{ ...(Number(total) > 10 && { y: 600 }) }}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        pagination={{
          total: total,
          current: page, //Current page number
          pageSize: pageSize, //Number of data items per page
          size: "small",
          showTotal: () => (
            <Space>
              <Typography.Title level={5} code>{`Total:  ${total}`}</Typography.Title>
            </Space>
          ),
          showLessItems: true,
          position: ["topRight"],
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", "50"],
        }}
        onChange={onChange}
        rowKey={(record: any) => record.package_no}
        onRow={(record) => {
          return {
            onClick: (event) => {
              event.stopPropagation();
              handleViewClick(record);
            },
          };
        }}
      />
    </>
  );
};
