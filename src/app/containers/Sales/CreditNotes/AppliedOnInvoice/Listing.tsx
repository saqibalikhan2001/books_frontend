/** @format */

import { useMemo, useState } from "react";
import { Statistic, TableProps, Tag } from "antd";
import { Labels } from "static";
import { useStore } from "app/Hooks";
import { AppliedListingProps } from "./Types";
import { ActionMenu, Tablex } from "app/shared";
import { capitalize, getOrganizationDate } from "utils";
import { TooltipX } from "app/shared/ToolTip";

export const AppliedListing = ({
  url,
  detail,
  loading,
  fetchList,
  toggle,
  from,
  toggleModal,
  handleConfirm,
  has_permission,
  isModal = false,
}: AppliedListingProps) => {
  const { org_date_format } = useStore();
  const [filter, setFilter] = useState({
    sortOrder: "descend",
    columnType: "credit_utilize_date",
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

  const memoColumns = useMemo(
    () =>
      [
        {
          title: () => <Title type="credit_utilize_date" title="Date" />,
          dataIndex: "",
          showSorterTooltip: false,
          key: "credit_utilize_date",
          defaultSortOrder: "descend",
          sortDirections: ["ascend", "descend"],
          sorter: filter.resonseLength && !isModal,
          render: (props: any) => getOrganizationDate(props?.credit_utilize_date, org_date_format),
        },
        {
          title: () => <Title type="invoice_no" title="Invoice number" />,
          key: "invoice_no",
          dataIndex: "invoice",
          showSorterTooltip: false,
          sorter: filter.resonseLength && !isModal,
          render: (value: any) => <>{value.invoice_no}</>,
        },
        {
          title: () => <Title type="invoice_total" title="Invoice total" />,
          dataIndex: "invoice",
          key: "invoice_total",
          className: "text-right",
          showSorterTooltip: false,
          sorter: filter.resonseLength && !isModal,
          render: (value: any) => (
            <Statistic
              precision={2}
              className="no-space"
              value={value.total || 0}
              valueStyle={{ fontSize: "14px" }}
              prefix={detail?.base_currency?.symbol}
            />
          ),
        },
        {
          title: () => <Title type="used_credits" title="Amount applied" />,
          key: "used_credits",
          className: "text-right",
          showSorterTooltip: false,
          sorter: filter.resonseLength && !isModal,
          render: (value: any) => (
            <Statistic
              precision={2}
              className="no-space"
              value={value.used_credits || 0}
              valueStyle={{ fontSize: "14px" }}
              prefix={detail?.base_currency?.symbol}
            />
          ),
        },
        {
          title: () => <Title type="invoice_status" title="Status" />,
          dataIndex: "invoice",
          key: "invoice_status",
          showSorterTooltip: false,
          sorter: filter.resonseLength && !isModal,
          render: (value: any) => (
            <Tag className={`generic-badge ${value.status && value.status}`}>
              {capitalize(value.status)}
            </Tag>
          ),
        },
        {
          title: "",
          key: "x",
          width: 20,
          dataIndex: "",
          hide: from,
          align: "center" as const,
          render: (props) => (
            <ActionMenu
              data={props}
              invoicePayment
              handleConfirm={handleConfirm}
              deletePermission={has_permission}
              title={
                has_permission
                  ? `${Labels.DELETE} "${props.invoice_no}" Payments ?`
                  : "Access Denied"
              }
            />
          ),
        },
      ].filter((data) => !data.hide),
    //eslint-disable-next-line
    [has_permission, detail?.base_currency?.symbol, filter]
  );
  return (
    <>
      <Tablex
        AppliedOnInvoice
        bool={loading}
        toggle={toggle}
        rowKey="package_no"
        isModal={isModal}
        fetchList={fetchList}
        columns={memoColumns}
        onChange={handleFilter}
        toggleModal={toggleModal}
        btnText="Apply on Invoice"
        setResponseLength={setFilter}
        url={`${url}?sort_by=${filter.columnType}&order_by=${
          filter.sortOrder === "ascend" ? "asc" : "desc"
        }`}
        from="__applied-invoices--tbl"
      />
    </>
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
