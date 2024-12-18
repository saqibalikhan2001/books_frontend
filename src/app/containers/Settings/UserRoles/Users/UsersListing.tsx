/** @format */

import { useMemo } from "react";
import { Table, Tag, Space, Typography } from "antd";
import { Labels } from "static";
import { ActionMenu } from "app/shared";
import { useSearchParam } from "app/Hooks";
import { UsersListingProps } from "../Types";

const { USER_NAME, EMAIL, ROLE, STATUS, DELETE, USER } = Labels;

const UsersListing = ({
  list,
  total,
  loading,
  handleClick,
  handleConfirm,
  has_permission,
}: UsersListingProps) => {
  const { onChange, getParams } = useSearchParam("tab");
  const { page, pageSize } = getParams();

  const memoColumns = useMemo(
    () => [
      {
        title: USER_NAME,
        dataIndex: "name",
        key: USER_NAME,
        width: 130,
        ellipsis: true,
      },
      {
        title: EMAIL,
        dataIndex: "email",
        key: EMAIL,
        width: 110,
        ellipsis: true,
      },
      {
        title: ROLE,
        dataIndex: "role_name",
        key: ROLE,
        width: 80,
        ellipsis: true,
      },
      {
        title: STATUS,
        dataIndex: "status",
        key: STATUS,
        width: 70,
        ellipsis: true,
        render: (status: number) => <Tag key={status}>{status === 1 ? "active" : "inActive"}</Tag>,
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
            canEdit={props.platform_type === "books" && props.role_type !== "super admin"}
            deletePermission={
              props.platform_type === "books" && props.role_type !== "super admin"
                ? has_permission
                : false
            }
            title={
              props.platform_type === "books" && props.role_type !== "super admin" && has_permission
                ? `${DELETE} "${props.name}" ${USER} ?`
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
        dataSource={list}
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
        rowKey={(record: any) => record?.id}
      />
    </>
  );
};

export default UsersListing;
