/**@format */

import { useMemo } from "react";
import { Space, Table, Typography } from "antd";
import { SortOrder } from "antd/es/table/interface";
import { Labels } from "static";
import { ActionMenu } from "app/shared";
import { useSearchParam } from "app/Hooks";
import { PaymentMethodDataSourceProps, PaymentMethodListingProps } from "./Types";

const { NAME, DELETE, _PAYMENT_METHOD } = Labels;

export const PaymentMethodListing = ({
  total,
  loading,
  listing = [],
  handleClick,
  handleConfirm,
  has_permission,
}: PaymentMethodListingProps) => {
  const { onChange, getParams } = useSearchParam("");
  const { page, pageSize } = getParams();

  const memoColumns = useMemo(
    () => [
      {
        key: NAME,
        title: NAME,
        sorter: true,
        dataIndex: "name",
        sortDirections: ["descend", "ascend"] as SortOrder[],
      },
      {
        key: "x",
        width: 50,
        dataIndex: "",
        title: "",
        align: "center" as const,
        render: (props: PaymentMethodDataSourceProps) =>
          props.deletable === 1 && (
            <ActionMenu
              data={props}
              handleClick={handleClick}
              handleConfirm={handleConfirm}
              canEdit={props.platform_type === "books"}
              deletePermission={props.platform_type === "books" ? has_permission : false}
              title={
                has_permission && props.platform_type === "books"
                  ? `${DELETE} "${props.name}" ${_PAYMENT_METHOD} ?`
                  : "Permission Denied"
              }
            />
          ),
      },
    ],
    [handleClick, handleConfirm, has_permission]
  );

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    getCheckboxProps: (record: PaymentMethodDataSourceProps) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <>
      <Table
        bordered
        loading={loading}
        onChange={onChange}
        dataSource={listing}
        columns={memoColumns}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
          columnWidth: 30,
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
        rowKey={(record: any) => record.id}
      />
    </>
  );
};
