/** @format */

import { useMemo } from "react";
import { Tag, Typography } from "antd";
import { Labels } from "static";
import { useStore } from "app/Hooks";
import { capitalize,getOrganizationDate } from "utils";
import { AccessDenied, ActionMenu, Tablex } from "app/shared";
import { BillListingProps, POBillListingProps } from "./Types";

const { Text } = Typography;
const { NAME, CODE, DELETE, BILLS } = Labels;

export const BillListing = ({
  url,
  loading,
  fetchList,
  showButton,
  handleClick,
  toggleModal,
  handleCreate,
  handleConfirm,
  has_permission,
  hasViewPermission,
}: BillListingProps) => {
   const { org_date_format } = useStore();

  const memoColumns = useMemo(
    () => [
      {
        title: "Bill NO.",
        dataIndex: "bill_no",
        key: NAME,
        width: 100,
        ellipsis: true,
      },
      {
        title: "Due Date",
        dataIndex: "due_date",
        key: NAME,
        width: 105,
        ellipsis: true,
        render: (due_date: string) => getOrganizationDate(due_date, org_date_format),
      },

      {
        title: "Vendor",
        dataIndex: "display_name",
        key: NAME,
        width: 100,
        ellipsis: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: NAME,
        ellipsis: true,
        width: 80,
        render: (status: string) => (
          <Tag autoCapitalize="" key={status}>
            {capitalize(status)}
          </Tag>
        ),
      },
      {
        title: "Amount",
        dataIndex: "",
        key: CODE,
        width: 85,
        ellipsis: true,
        render: (props: POBillListingProps) => (
          <Typography>
              <Text code>{props?.currency?.symbol}</Text>
            {`${props.total}`}
          </Typography>
        ),
      },
      {
        title: "Balance Due",
        dataIndex: "",
        key: CODE,
        width: 115,
        ellipsis: true,
        render: (props: POBillListingProps) => (
          <Typography>
              <Text code>{props?.currency?.symbol}</Text>
            {`${props.balance_due}`}
          </Typography>
        ),
      },
      {
        title: "",
        dataIndex: "",
        width: 50,
        key: "x",
        align: "center" as const,
        render: (props: POBillListingProps) => (
          <ActionMenu
            data={props}
            handleClick={handleClick}
            handleConfirm={handleConfirm}
            canEdit={true}
            deletePermission={has_permission ? true : false}
            title={has_permission ? `${DELETE} "${props.bill_no}" ${BILLS} ?` : "Access Denied"}
          />
        ),
      },
    ],
    //eslint-disable-next-line
    [has_permission]
  );

  return (
    <>
      {hasViewPermission ? (
        <Tablex
          url={url}
          bool={loading}
          rowKey="bill_no"
          columns={memoColumns}
          fetchList={fetchList}
          toggleModal={toggleModal}
          showButton={showButton}
          handleCreate={handleCreate}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
