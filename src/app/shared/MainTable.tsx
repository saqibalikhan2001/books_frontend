/**@format */

import { Key, useState } from "react";
import { Space, Table, Typography } from "antd";
import { Buttonx, Icons, Toast } from ".";
import { useAxios, useSearchParam } from "app/Hooks";

const { RiDeleteBinLine } = Icons;

interface IPropsTypes<T> {
  className?: string;
  url: string;
  columns: T[];
  loading: boolean;
  refetch: () => void;
  paymentReceived?: boolean;
  handleParams?: (params) => void;
  bulkDeleteTrue?: () => void;
  listing: { total: number; data: T[] };
  handleViewClick: (dt: any, listing: any, paymentReceived?: boolean) => void;
}

const MainTable = <T extends object>({
  url,
  refetch,
  loading,
  columns,
  listing,
  handleParams,
  bulkDeleteTrue,
  handleViewClick,
  className,
  paymentReceived = false,
}: IPropsTypes<T>) => {
  const { callAxios, bool, toggle } = useAxios();
  const [selectedIds, setSelectedIds] = useState<Key[]>([]);
  const { onChange, getParams } = useSearchParam("", false, handleParams);
  const { page, pageSize } = getParams();

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: Key[]) => {
      if (selectedRowKeys.length) !bool && toggle();
      else if (!selectedRowKeys.length) bool && toggle();
      setSelectedIds(selectedRowKeys);
    },
    // getCheckboxProps: (record: { name: string }) => ({
    //   disabled: record.name === "Disabled User", // Column configuration not to be checked
    //   name: record.name,
    // }),
  };
  const handleBulkDelete = () => {
    callAxios({
      method: "delete",
      url,
      data: { ids: selectedIds },
    })
      .then((res) => {
        if (res) {
          Toast({ message: res?.message });
          refetch();
          bulkDeleteTrue?.();
        }
      })
      .catch((err) =>
        Toast({
          message: err?.response?.data?.message || err?.response?.message || err?.message,
          type: "error",
        })
      );
  };

  return (
    <>
      <Table
        showHeader
        bordered={false}
        columns={columns}
        loading={loading}
        onChange={onChange}
        className={className}
        dataSource={listing.data || []}
        scroll={{ ...(Number(listing.total) > 10 && { y: 600 }) }}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
          columnWidth: 30,
        }}
        pagination={{
          total: listing.total,
          current: page, //Current page number
          pageSize: pageSize, //Number of data items per page
          size: "small",
          showTotal: () => (
            <Space style={{ height: "50px" }}>
              {bool && (
                <Buttonx
                  danger
                  size="middle"
                  type="primary"
                  btnText="Delete"
                  clickHandler={handleBulkDelete}
                  icon={<RiDeleteBinLine size={15} style={{ marginRight: "10px" }} />}
                />
              )}
              <Space style={{ marginBottom: "40px" }}>
                <Typography.Title level={5} code>
                  {`Total:  ${listing.total}`}
                </Typography.Title>
              </Space>
            </Space>
          ),
          showLessItems: true,
          position: ["topRight"],
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", "50"],
        }}
        rowKey={(record: any) => record.id || record.payment_no}
        onRow={(record) => {
          return {
            onClick: (event) => {
              event.stopPropagation();
              handleViewClick(record, listing.data, paymentReceived);
            },
          };
        }}
      />
    </>
  );
};
export default MainTable;
