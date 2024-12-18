/** @format */

import { useMemo, useState } from "react";
import { Statistic } from "antd";
import type { TableProps } from "antd/es/table";
import { Labels } from "static";
import { getFullDate } from "utils";
import { AccessDenied, ActionMenu, Tablex } from "app/shared";
import { BillPaymentDataSourceProps, PaymentListingProps } from "./Types";
import { TooltipX } from "app/shared/ToolTip";

const { DELETE } = Labels;

export const PaymentsListing = ({
  url,
  from,
  loading,
  toggle,
  isModal,
  fetchList,
  showButton,
  toggleModal,
  handleConfirm,
  has_permission,
  hasViewPermission,
}: PaymentListingProps) => {
  const [filter, setFilter] = useState<any>({
    sortOrder: "descend",
    columnType: "payment_date",
    resonseLength: 0,
  });
  const handleFilter: TableProps<any>["onChange"] = (_, __, sorter: any) => {
    setFilter({
      ...filter,
      columnType: sorter.columnKey,
      sortOrder: filter.sortOrder === "ascend" ? "descend" : "ascend",
    });
  };
  const Title = ({ type, title }) => {
    return (
      <div className="d-flex">
        {title}
        {filter.resonseLength > 0 && !isModal && filter.columnType === type && (
          <TooltipX title={`Sort by ${filter.sortOrder === "ascend" ? "ascending" : "descending"}`}>
            {filter.sortOrder === "ascend" ? ascendingIcon : descendingIcon}
          </TooltipX>
        )}
      </div>
    );
  };
  const ascendingIcon = (
    <span className="white-circle">
      <img
        alt="ascending order"
        className="ascending order"
        src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-ascending.svg`}
      />
    </span>
  );
  const descendingIcon = (
    <span className="white-circle">
      <img
        alt="descending order"
        className="ascending order"
        src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-descending.svg`}
      />
    </span>
  );
  const memoColumns = useMemo(
    () =>
      [
        {
          title: () => <Title type="payment_date" title="Date" />,
          dataIndex: "payment_date",
          key: "payment_date",
          width: 120,
          ellipsis: true,
          showSorterTooltip: false,
          sorter: filter.resonseLength && !isModal,
          render: (order_date: string) => getFullDate(order_date),
        },
        {
          title: "Bill number",
          dataIndex: "bill_no",
          key: "bill_no",
          width: 130,
          ellipsis: true,
          showSorterTooltip: false,
          sorter: false,
          render: (bill_no: string) => bill_no && bill_no,
        },
        {
          title: () => <Title type="payment_mode" title="Payment method" />,
          dataIndex: "payment_mode",
          key: "payment_mode",
          width: 200,
          ellipsis: true,
          showSorterTooltip: false,
          sorter: filter.resonseLength && !isModal,
        },
        {
          title: () => <Title type="payment_made" title="Amount paid" />,
          key: "payment_made",
          dataIndex: "",
          width: 120,
          className: "text-right justify-flex-end  billdetail-alignments",
          ellipsis: true,
          showSorterTooltip: false,
          sorter: filter.resonseLength && !isModal,
          render: (props: BillPaymentDataSourceProps) => (
            <Statistic
              precision={2}
              prefix={props.currency?.symbol}
              value={props?.payment_made || 0}
              className="text_center no-space"
              valueStyle={{ fontSize: "14px", display: "flex" }}
            />
          ),
        },
        {
          title: "",
          dataIndex: "",
          width: 50,
          key: "x",
          hide: from,
          align: "center" as const,
          render: (props: BillPaymentDataSourceProps) => (
            <ActionMenu
              billPayment
              data={props}
              canEdit={false}
              handleConfirm={handleConfirm}
              deletePermission={has_permission}
              title={
                has_permission ? `${DELETE} "${props.payment_no}" Payments ?` : "Access Denied"
              }
            />
          ),
        },
      ].filter((data) => !data.hide),
    //eslint-disable-next-line
    [handleConfirm, filter, has_permission]
  );

  return (
    <>
      {hasViewPermission ? (
        <Tablex
          from='from--bills'
          BillsPayment
          bool={loading}
          toggle={toggle}
          rowKey="payment_no"
          fetchList={fetchList}
          columns={memoColumns}
          onChange={handleFilter}
          toggleModal={toggleModal}
          setResponseLength={setFilter}
          showButton={showButton && !isModal}
          url={`${url}?sort_by=${filter.columnType}&order_by=${
            filter.sortOrder === "ascend" ? "asc" : "desc"
          }`}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
