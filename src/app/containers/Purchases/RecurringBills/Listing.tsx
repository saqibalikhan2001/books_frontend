/** @format */

import { useMemo } from "react";
import { Tag, Typography } from "antd";
import { Labels, endpoints } from "static";
import { usePermissions,useStore } from "app/Hooks";
import { capitalize,getOrganizationDate } from "utils";
import { ActionMenu, MainTable } from "app/shared";
import { RecurringBillListingProps, RecurringBillDataSource } from "./Types";

const { Text } = Typography;
const { RECURRING_BILL } = endpoints;
const { NAME, CODE, DELETE, BILLS } = Labels;

export const RecurringBillListing = ({
  refetch,
  loading,
  listing,
  showDetail,
  handleClick,
  handleConfirm,
  bulkDeleteTrue,
  handleViewClick,
}: RecurringBillListingProps) => {
  const { checkPermission } = usePermissions();
  const { org_date_format } = useStore();
  const { has_RecurringBillsDelete_permission } = checkPermission("RecurringBillsDelete");

  const memoColumns = useMemo(
    () => [
      {
        title: "Vendor",
        dataIndex: "display_name",
        width: 150,
        key: NAME,
        ellipsis: true,
      },
      {
        title: "Profile Name",
        dataIndex: "profile_name",
        key: NAME,
        width: 120,
        ellipsis: true,
      },
      {
        title: "Frequency",
        dataIndex: "repeat_duration",
        key: NAME,
        width: 120,
        ellipsis: true,
      },
      {
        title: "Next Bill Date",
        dataIndex: "next_recurring_bills_date",
        key: NAME,
        width: showDetail ? 0 : 150,
        ellipsis: true,
        render: (next_date: string) => getOrganizationDate(next_date, org_date_format),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: NAME,
        ellipsis: true,
        width: showDetail ? 0 : 100,
        render: (status: string) => (
          <Tag autoCapitalize="" key={status} color={status === "draft" ? "red" : "green"}>
            {capitalize(status)}
          </Tag>
        ),
      },
      {
        title: "Amount",
        dataIndex: "",
        key: CODE,
        width: showDetail ? 0 : 150,
        ellipsis: true,
        render: (props: RecurringBillDataSource) => (
          <Typography>
              <Text code>{props?.currency?.symbol}</Text>
            {`${props.total}`}
          </Typography>
        ),
      },
      {
        title: "",
        dataIndex: "",
        width: 50,
        key: "x",
        align: "center" as const,
        render: (props: RecurringBillDataSource) => (
          <ActionMenu
            data={props}
            handleClick={handleClick}
            handleConfirm={handleConfirm}
            canEdit={props.platform_type === "books"}
            deletePermission={
              props.platform_type === "books" ? has_RecurringBillsDelete_permission : false
            }
            title={
              props.platform_type === "books" && has_RecurringBillsDelete_permission
                ? `${DELETE} ${BILLS} ?`
                : "Permission Denied"
            }
          />
        ),
      },
    ],
    [handleClick, handleConfirm, has_RecurringBillsDelete_permission, showDetail]
  );

  return (
    <>
      <MainTable
        refetch={refetch}
        loading={loading}
        listing={listing}
        url={RECURRING_BILL}
        columns={memoColumns}
        bulkDeleteTrue={bulkDeleteTrue}
        handleViewClick={handleViewClick}
      />
    </>
  );
};
