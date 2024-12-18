/** @format */

import { useMemo, useState } from "react";
import { Statistic, TableProps } from "antd";
import { Labels } from "static";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";
import { TooltipX } from "app/shared/ToolTip";
import { ActionMenu, Tablex } from "app/shared";
import { RefundDetailModal } from "./RefundDetailModal";
import { RefundDSProps, RefundListingProps } from "./Types";

const { DELETE } = Labels;

export const RefundsListing = ({
  url,
  toggle,
  loading,
  PRdetail,
  fetchList,
  toggleModal,
  handleConfirm,
  has_permission,
  isModal = false,
  PaymentRefund = false,
}: RefundListingProps) => {
  const { org_date_format } = useStore();
  const [refund, setRefund] = useState();
  const [refundDetail, setRefundDetail] = useState(false);
  const [filter, setFilter] = useState({
    sortOrder: "descend",
    columnType: "refund_date",
    resonseLength: 0,
  });
  const toggleRefundDetailModal = (id) => {
    let refund = PaymentRefund
      ? PRdetail?.refunds?.find((refId) => refId.id === id)
      : PRdetail?.creditNote?.credit_refunds.find((refId) => refId.id === id);
    setRefund(refund);
    setRefundDetail(!refundDetail);
  };

  const handleFilter: TableProps<any>["onChange"] = (_, __, sorter: any) => {
    setFilter({
      ...filter,
      columnType: sorter.columnKey,
      sortOrder: filter.sortOrder === "ascend" ? "descend" : "ascend",
    });
  };
  const Title = ({ type, title }) => {
    return (
      <div className={` ${title === "Payment" ? " payment-title" : ""}`}>
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
          title: () => <Title type="refund_date" title="Date" />,
          width: 130,
          ellipsis: true,
          key: "refund_date",
          dataIndex: "",
          showSorterTooltip: false,
          defaultSortOrder: "descend",
          sortDirections: ["ascend", "descend"],
          sorter: filter.resonseLength && !isModal,
          render: (props: any) => getOrganizationDate(props?.refund_date, org_date_format),
        },
        {
          title: () => (
            <Title title={"Payment Mode"} type={PaymentRefund ? "mode" : "refund_mode"} />
          ),
          width: 200,
          ellipsis: true,
          showSorterTooltip: false,
          key: PaymentRefund ? "mode" : "refund_mode",
          sorter: filter.resonseLength && !isModal,
          render: (props) => (
            <span
              className={`${!isModal && "_display_name cursor-pointer"}`}
              onClick={() => !isModal && toggleRefundDetailModal(props?.id)}
            >
              {PaymentRefund ? props?.mode : props?.refund_mode}
            </span>
          ),
        },
        {
          title: () => (
            <Title
              type={PaymentRefund ? "amount" : "refund_credits"}
              title={PaymentRefund ? "Amount" : "Payment"}
            />
          ),
          width: 100,
          ellipsis: true,
          key: PaymentRefund ? "amount" : "refund_credits",
          className: "text-right justify-flex-end",
          showSorterTooltip: false,
          sorter: filter.resonseLength && !isModal,
          render: (value: any) => (
            <Statistic
              precision={2}
              className="no-space"
              value={value.refund_credits || value.amount || 0}
              valueStyle={{ fontSize: "14px" }}
              prefix={PRdetail?.base_currency?.symbol || PRdetail?.currency?.symbol}
            />
          ),
        },
        {
          title: "",
          dataIndex: "",
          width: 50,
          key: "x",
          hide: isModal,
          align: "center" as const,
          render: (props: RefundDSProps) => (
            <ActionMenu
              refunds
              data={props}
              canEdit={false}
              handleConfirm={handleConfirm}
              deletePermission={has_permission}
              title={has_permission ? `${DELETE} Refund ?` : "Access Denied"}
            />
          ),
        },
      ].filter((show) => !show.hide),
    //eslint-disable-next-line
    [has_permission, filter]
  );
  const CreditRefund = !PaymentRefund;
  const conditionalProps = PaymentRefund ? { PaymentRefund } : { CreditRefund };

  return (
    <>
      <Tablex
        isModal={isModal}
        {...conditionalProps}
        bool={loading}
        rowKey="package_no"
        fetchList={fetchList}
        toggle={toggle}
        columns={memoColumns}
        btnText="Create Refund"
        onChange={handleFilter}
        toggleModal={toggleModal}
        setResponseLength={setFilter}
        url={`${url}?sort_by=${filter.columnType}&order_by=${
          filter.sortOrder === "ascend" ? "asc" : "desc"
        }`}
      />
      {refundDetail && (
        <RefundDetailModal
          refundTab
          detail={refund}
          bool={refundDetail}
          PaymentRefund={PaymentRefund}
          toggle={toggleRefundDetailModal}
          currency={PRdetail?.base_currency?.symbol || PRdetail?.currency?.symbol}
        />
      )}
    </>
  );
};

const ascendingIcon = (
  <span className="white-circle">
    <img
      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-ascending.svg`}
      alt="ascending order"
      className="ascending order"
    />
  </span>
);
const descendingIcon = (
  <span className="white-circle">
    <img
      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-descending.svg`}
      alt="descending order"
      className="ascending order"
    />
  </span>
);
