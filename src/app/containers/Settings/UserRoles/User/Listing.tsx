/** @format */

import { useMemo } from "react";
import { Table, Tag, Typography } from "antd";
import { Labels } from "static";
import { useAxios } from "app/Hooks";
import { inviteUserListingProps } from "../Types";
import { ActionMenu, Spinner, Toast } from "app/shared";

const { Text } = Typography;
const { INVITATION, DELETE } = Labels;

const UsersListing = ({
  list,
  loading,
  refetch,
  onChange,
  handleConfirm,
  has_permission,
}: inviteUserListingProps) => {
  const { callAxios } = useAxios();
  const localParams = sessionStorage.getItem("params");
  const parsedparams = JSON.parse(localParams as any);

  const handleStatus = (data) => {
    callAxios({
      method: "put",
      url: data?.status ? `/user/${data?.id}/inactive` : `/user/${data?.id}/active`,
    }).then((res) => {
      Toast({ message: res?.message });
      refetch();
    });
  };

  const memoColumns: any = useMemo(
    () => [
      {
        title: ({ sortColumns }: any) => {
          const key = sortColumns && sortColumns[0]?.column?.key;
          return (
            <div className="d-flex">
              Name
              {key === "name" ? (
                parsedparams?.sort === "ascend" ? (
                  <span className="white-circle">
                    <img
                      alt="ascending order"
                      className="ascending order"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/sort-ascending.svg`}
                    />
                  </span>
                ) : parsedparams?.sort === "descend" ? (
                  <span className="white-circle">
                    <img
                      alt="descending order"
                      className="ascending order"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/sort-descending.svg`}
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
        showSorterTooltip: false,
        defaultSortOrder: "ascend",
        sortDirections: ["ascend", "descend", "ascend"],
        key: "name",
        width: 400,
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
        title: ({ sortColumns }: any) => {
          const key = sortColumns && sortColumns[0]?.column?.key;
          return (
            <div className="d-flex">
              My Role
              {key === "role" ? (
                parsedparams?.sort === "ascend" ? (
                  <span className="white-circle">
                    <img
                      alt="ascending order"
                      className="ascending order"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/sort-ascending.svg`}
                    />
                  </span>
                ) : parsedparams?.sort === "descend" ? (
                  <span className="white-circle">
                    <img
                      alt="descending order"
                      className="ascending order"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/sort-descending.svg`}
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
        dataIndex: "",
        showSorterTooltip: false,
        key: "role",
        sorter: true,
        sortDirections: ["ascend", "descend", "ascend"],
        width: 150,
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
        render: (user) => (
          // <Tag color="blue" key={user?.id}>
          <Text>{user?.role ? user?.role?.name : user?.role_name}</Text>
          // </Tag>
        ),
      },
      {
        title: ({ sortColumns }: any) => {
          const key = sortColumns && sortColumns[0]?.column?.key;
          return (
            <div className="d-flex">
              Email
              {key === "email" ? (
                parsedparams?.sort === "ascend" ? (
                  <span className="white-circle">
                    <img
                      alt="ascending order"
                      className="ascending order"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/sort-ascending.svg`}
                    />
                  </span>
                ) : parsedparams?.sort === "descend" ? (
                  <span className="white-circle">
                    <img
                      alt="descending order"
                      className="ascending order"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/sort-descending.svg`}
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
        dataIndex: "email",
        sorter: true,
        key: "email",
        width: 220,
        showSorterTooltip: false,
        sortDirections: ["ascend", "descend", "ascend"],
      },
      {
        title: ({ sortColumns }: any) => {
          const key = sortColumns && sortColumns[0]?.column?.key;
          return (
            <div className="d-flex">
              Status
              {key === "is_invited" ? (
                parsedparams?.sort === "ascend" ? (
                  <span className="white-circle">
                    <img
                      alt="ascending order"
                      className="ascending order"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/sort-ascending.svg`}
                    />
                  </span>
                ) : parsedparams?.sort === "descend" ? (
                  <span className="white-circle">
                    <img
                      alt="descending order"
                      className="ascending order"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/sort-descending.svg`}
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
        dataIndex: "",
        key: "is_invited",
        sorter: true,
        width: 120,
        showSorterTooltip: false,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (user) => (
          <Tag
            key={user?.id}
            color={user.is_invited ? "orange" : !user.is_invited && user.status ? "green" : "grey"}
          >
            {user.is_invited ? "Invited" : !user.is_invited && user.status ? "Active" : "Inactive"}
          </Tag>
        ),
        ellipsis: true,
      },
      {
        title: "",
        dataIndex: "",
        width: 50,
        key: "x",
        align: "center" as const,
        render: (props: any) => (
          <ActionMenu
            user
            data={props}
            canEdit={false}
            active={props?.status}
            handleStatus={handleStatus}
            handleConfirm={handleConfirm}
            has_joined={props?.is_invited}
            status={props?.role_type === "super admin" ? false : true}
            deletePermission={props?.role_type === "super admin" ? false : true}
            title={
              // props.platform_type === "books" && props?.role_type !== "super admin"
              props?.role_type !== "super admin"
                ? `${DELETE} ${props.name} ${INVITATION} ?`
                : "The Super admin cannot be deleted."
            }
          />
        ),
      },
    ],
    [handleConfirm, has_permission, parsedparams?.sort]
  );

  return (
    <>
      <Table
        bordered={false}
        dataSource={list}
        pagination={false}
        onChange={onChange}
        columns={memoColumns}
        rowKey={(record: any) => record.id}
        className="users-table generic-table pl-10"
        loading={{ spinning: loading, indicator: <Spinner directionSize={"70vh"} /> }}
        // rowClassName={(_, index) => index % 2 !== 0 ? 'table-row-even' :  'table-row-odd'}
        // rowSelection={{
        //   type: "checkbox",
        //   ...rowSelection,
        //   columnWidth: 30,
        // }}
      />
    </>
  );
};
export default UsersListing;
