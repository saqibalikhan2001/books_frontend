/** @format */

import { useMemo } from "react";
import { Tag } from "antd";
import { getFullDate } from "utils";
import { Labels, endpoints } from "static";
import { usePermissions } from "app/Hooks";
import { ExpenseListingProps } from "./Types";
import { ActionMenu, MainTable } from "app/shared";

const { EXPENSES } = endpoints;
const { NAME, CODE } = Labels;

export const ExpenseListing = ({
  loading,
  refetch,
  listing,
  showDetail,
  handleClick,
  handleConfirm,
  bulkDeleteTrue,
  handleViewClick,
}: ExpenseListingProps) => {
  const { checkPermission } = usePermissions();
  const { has_ExpenseDelete_permission } = checkPermission("ExpenseDelete");
  const handleClone = () => {};
  const handleStatus = () => {
    //for future use
    // callAxios({
    //   method: "put",
    //   url: data?.is_active ? `/items/${data?.id}/inactive` : `/items/${data?.id}/active`,
    // }).then((res) => {
    //   Toast({ message: res?.message });
    //   refetch();
    // });
  };

  const memoColumns = useMemo(
    () =>
      [
        {
          title: "Date",
          dataIndex: "date",
          key: CODE,
          //for future use
          // width: showDetail ? 0 : 130,
          show: showDetail,
          ellipsis: true,
          render: (date) => <>{getFullDate(date)}</>,
        },
        {
          title: "Vendor",
          dataIndex: "vendor_name",
          key: CODE,
          show: showDetail && !showDetail,
          //for future use
          // width: showDetail ? 0 : 130,
          ellipsis: true,
        },
        {
          title: "Refference",
          dataIndex: "ref_number",
          key: CODE,
          //for future use
          // width: showDetail ? 0 : 130,
          show: showDetail,
          ellipsis: true,
        },
        {
          title: "Expense account",
          dataIndex: "",
          key: CODE,
          show: showDetail,
          //for future use
          // width: showDetail ? 0 : 130,
          ellipsis: true,
          render: (expense: any) => {
            return expense.itemize === 0 ? (
              <Tag>{expense.expense_details[0].expense_category.name}</Tag>
            ) : (
              <Tag>Itemized</Tag>
            );
          },
        },

        {
          title: "Status",
          dataIndex: "status",
          key: NAME,
          ellipsis: true,
          show: showDetail && !showDetail,
          //for future use
          // width: showDetail ? 0 : 110,
          render: (status: string) => {
            return (
              <Tag autoCapitalize="" key={status} color="blue">
                {status}
              </Tag>
            );
          },
        },
        {
          title: "Amount",
          dataIndex: "total_amount",
          key: NAME,
          ellipsis: true,
          show: showDetail,
          //for future use
          // width: showDetail ? 0 : 130,
        },
        {
          title: "",
          dataIndex: "",
          width: 50,
          key: "x",
          //for future use
          // show: showDetail,
          align: "center" as const,
          render: (props: any) => {
            return (
              <ActionMenu
                expense
                showEdit
                data={props}
                title={"expense"}
                active={props?.isActive}
                handleClone={handleClone}
                handleClick={handleClick}
                handleStatus={handleStatus}
                handleConfirm={handleConfirm}
                status={props.platform_type === "books"}
                canEdit={props.platform_type === "books"}
                deletePermission={
                  props.platform_type === "books" ? has_ExpenseDelete_permission : false
                }
              />
            );
          },
        },
      ].filter((col) => !col?.show),
    [handleConfirm, has_ExpenseDelete_permission, handleClick]
  );
  return (
    <>
      <MainTable
        url={EXPENSES}
        refetch={refetch}
        loading={loading}
        listing={listing}
        columns={memoColumns}
        bulkDeleteTrue={bulkDeleteTrue}
        handleViewClick={handleViewClick}
      />
    </>
  );
};
