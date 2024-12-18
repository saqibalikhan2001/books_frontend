/** @format */

import { useMemo } from "react";
import { Table } from "antd";
import { Labels } from "static";
import { useStore } from "app/Hooks";
import { ActionMenu } from "app/shared";
import { ReceiveListingProps } from "./Types";
import { getOrganizationDate } from "utils";

const { NAME, SYMBOL, DELETE, _INVOICES } = Labels;

export const ReceiveListing = ({
  loading,
  listing = [],
  handleConfirm,
  has_permission,
}: ReceiveListingProps) => {
  const { org_date_format } = useStore();

  const memoColumns = useMemo(
    () => [
      {
        title: "Receive No.",
        dataIndex: "receive_no",
        key: SYMBOL,
        width: 130,
        ellipsis: true,
      },
      {
        title: "Vendor Name",
        dataIndex: "vendor_name",
        key: NAME,
        ellipsis: true,
        width: 200,
      },
      {
        title: "Receive Date",
        dataIndex: "receive_date",
        key: NAME,
        width: 120,
        ellipsis: true,
        render: (order_date: string) => getOrganizationDate(order_date, org_date_format),
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
            handleConfirm={handleConfirm}
            canEdit={false}
            deletePermission={has_permission ? true : false}
            title={
              has_permission
                ? `${DELETE} "${props.receive_no}" ${_INVOICES} ?`
                : "Access Denied"
            }
          />
        ),
      },
    ],
    //eslint-disable-next-line
    [has_permission]
  );

  return (
    <>
      <Table
        loading={loading}
        dataSource={listing}
        columns={memoColumns}
        pagination={false}
        rowKey={(record: any) => record.invoice_no}
      />
    </>
  );
};
