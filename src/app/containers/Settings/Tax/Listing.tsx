/** @format */

import { useMemo } from "react";
import { Table, Space, Typography } from "antd";
import { Labels } from "static";
import { ActionMenu } from "app/shared";
import { TaxListingProps } from "./Types";
import { useSearchParam } from "app/Hooks";
import { TooltipX } from "app/shared/ToolTip";

const { Text } = Typography;
const { NAME, RATE, DELETE, TAX, AUTHORITY } = Labels;

export const TaxListing = ({
  total,
  loading,
  handleClick,
  listing = [],
  handleConfirm,
  has_permission,
}: TaxListingProps) => {
  const { onChange, getParams } = useSearchParam("tab");
  const { page, pageSize } = getParams();

  const memoColumns = useMemo(
    () => [
      {
        key: NAME,
        title: NAME,
        width: 350,
        dataIndex: "name",
      },
      {
        key: AUTHORITY,
        title: AUTHORITY,
        width: 280,
        dataIndex: "authority",
      },
      {
        title: RATE,
        key: RATE,
        dataIndex: "",
        render: (props: any) => (
          <Typography>
            {props && props?.rate
              ? props?.rate
              : props?.tax_group_details?.reduce(
                  (prev: any, curr: any) => prev + curr.tax_details?.rate,
                  0
                ) || 0}
            <TooltipX title="Tax Rate">
              <Text code>%</Text>
            </TooltipX >
          </Typography>
        ),
      },
      {
        key: "x",
        width: 50,
        dataIndex: "",
        title: "",
        align: "center" as const,
        render: (props: any) => (
          <ActionMenu
            data={props}
            handleClick={handleClick}
            handleConfirm={handleConfirm}
            canEdit={props.platform_type === "books"}
            deletePermission={props.platform_type === "books" ? has_permission : false}
            title={
              has_permission && props.platform_type === "books"
                ? `${DELETE} "${props.name}" ${TAX} ?`
                : " Permission Denied"
            }
          />
        ),
      },
    ],
    [handleClick, handleConfirm, has_permission]
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
        rowKey={(record: any) => record.name}
      />
    </>
  );
};
