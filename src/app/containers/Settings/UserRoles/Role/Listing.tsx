/** @format */

import { useMemo } from "react";
import { Table } from "antd";
import { Labels } from "static";
import { roleListingProps } from "../Types";
import { ActionMenu, Spinner } from "app/shared";

const { DELETE, ROLE } = Labels;

const RolesListing = ({
  // total,
  list,
  loading,
  onChange,
  handleClick,
  handleConfirm,
  has_permission,
}: roleListingProps) => {
  const localParams = sessionStorage.getItem("params");
  const parsedparams = JSON.parse(localParams as any);

  const memoColumns: any = useMemo(
    () => [
      {
        title: ({ sortColumns }: any) => {
          const key = sortColumns && sortColumns[0]?.column?.key;
          return (
            <div className="d-flex">
              My Role
              {key === "name" ? (
                parsedparams?.sort === "ascend" ? (
                  <span className="white-circle">
                    <img
                      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-ascending.svg`}
                      alt="ascending order"
                      className="ascending order"
                    />
                  </span>
                ) : parsedparams?.sort === "descend" ? (
                  <span className="white-circle">
                    <img
                      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-descending.svg`}
                      alt="descending order"
                      className="ascending order"
                    />
                  </span>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </div>
          );
        },
        sorter: true,
        dataIndex: "name",
        key: "name",
        width: 200,
        showSorterTooltip: false,
        defaultSortOrder: "ascend",
        sortDirections: ["ascend", "descend", "ascend"],
        onCell: () => {
          return {
            style: {
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: 150,
            },
          };
        },
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 450,
        className: "roles_description"
      },
      {
        title: ({ sortColumns }: any) => {
          const key = sortColumns && sortColumns[0]?.column?.key;
          return (
            <div className="d-flex">
              Users
              {key === "total_users" ? (
                parsedparams?.sort === "ascend" ? (
                  <span className="white-circle">
                    <img
                      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-ascending.svg`}
                      alt="ascending order"
                      className="ascending order"
                    />
                  </span>
                ) : parsedparams?.sort === "descend" ? (
                  <span className="white-circle">
                    <img
                      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-descending.svg`}
                      alt="descending order"
                      className="ascending order"
                    />
                  </span>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </div>
          );
        },
        sorter: true,
        dataIndex: "total_users",
        key: "total_users",
        width: 50,
        showSorterTooltip: false,
        sortDirections: ["ascend", "descend", "ascend"],
      },
      {
        title: "",
        dataIndex: "",
        width: 50,
        key: "x",
        align: "center" as const,
        render: (props: any) => (
          <ActionMenu
            role
            showEdit
            data={props}
            canEdit={props.platform_type === "books"}
            // edit case will handle later
            handleClick={handleClick}
            handleConfirm={handleConfirm}
            deletePermission={props.platform_type === "books" ? has_permission : false}
            title={
              props.platform_type === "books" && has_permission
                ? `${DELETE} ${props.name} ${ROLE} ?`
                : "Permission Denied"
            }
          />
        ),
      },
    ],
    [handleConfirm, has_permission, handleClick, parsedparams?.sort]
  );

  return (
    <>

      <Table
        className="roles-table generic-table pl-10"
        // rowClassName={(_, index) => index % 2 !== 0 ? 'table-row-even' :  'table-row-odd'}
        bordered={false}
        loading={{ spinning: loading, indicator: <Spinner directionSize={'70vh'} />, }}

        onChange={onChange}
        dataSource={list}
        columns={memoColumns}
        // rowSelection={{
        //   type: "checkbox",
        //   ...rowSelection,
        //   columnWidth: 30,
        // }}
        pagination={false}
        rowKey={(record: any) => record.id}
      />
    </>
  );
};

export default RolesListing;
