import { Table } from "antd";
import { ActionMenu, Spinner } from "app/shared";

export const Listing = ({ data, handleClick, isFetching, handleConfirm }) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Rate/Terms",
      dataIndex: "value",
      key: "age",
    },
    {
      title: "Action",
      key: "action",
      render: (props: any) => {
        return (
          <ActionMenu
            paymentTerm
            showEdit
            className={"width-400 payment-preference-actions"}
            handleConfirm={handleConfirm}
            handleClick={handleClick}
            canEdit={props.deletable && !props.has_transactions}
            deletePermission={!!props.deletable && !props.has_transactions}
            title={
              props.deletable && !props?.has_transactions
                ? `Are you sure you want to delete "${props.name}"?`
                : "Permission Denied"
            }
            data={props}
          />
        );
      },
    },
  ];
  return (
    <div>
      {isFetching ? (
        <Spinner directionSize={"90vh"} />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="generic-table payment-preference--tbl "
        />
      )}
    </div>
  );
};
