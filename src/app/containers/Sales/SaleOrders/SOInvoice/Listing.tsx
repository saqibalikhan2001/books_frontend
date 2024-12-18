/** @format */

import { useMemo } from "react";
import { Tag } from "antd";
import { Labels } from "static";
import { InvoiceListingProps } from "./Types";
import { capitalize, getFullDate } from "utils";
import { AccessDenied, ActionMenu, Tablex } from "app/shared";

const { NAME, SYMBOL, DELETE, _INVOICES } = Labels;

export const InvoicesListing = ({
  url,
  loading,
  fetchList,
  handleClick,
  handleCreate,
  toggleModal,
  handleConfirm,
  has_permission,
  hasViewPermission,
}: InvoiceListingProps) => {
  const memoColumns = useMemo(
    () => [
      {
        title: "Invoice",
        dataIndex: "invoice_no",
        key: SYMBOL,
        width: 130,
        ellipsis: true,
      },
      {
        title: "Customer Name",
        dataIndex: "customer_name",
        key: NAME,
        ellipsis: true,
        width: 200,
      },
      {
        title: "Date",
        dataIndex: "invoice_date",
        key: NAME,
        width: 120,
        ellipsis: true,
        render: (order_date: string) => getFullDate(order_date),
      },
      {
        title: "Due Date",
        dataIndex: "due_date",
        key: NAME,
        width: 120,
        ellipsis: true,
        render: (order_date: string) => getFullDate(order_date),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: NAME,
        ellipsis: true,
        width: 120,
        render: (status: string) => (
          <Tag autoCapitalize="" key={status} color={status === "draft" ? "red" : "green"}>
            {capitalize(status)}
          </Tag>
        ),
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
            canEdit={true}
            handleClick={handleClick}
            handleConfirm={handleConfirm}
            deletePermission={has_permission}
            title={
              has_permission ? `${DELETE} "${props.invoice_no}" ${_INVOICES} ?` : "Access Denied"
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
      {hasViewPermission ? (
        <Tablex
          invoice
          url={url}
          showButton
          bool={loading}
          rowKey="invoice_no"
          fetchList={fetchList}
          columns={memoColumns}
          toggleModal={toggleModal}
          handleCreate={handleCreate}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
