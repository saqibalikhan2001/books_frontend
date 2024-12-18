/**@format */

import { useState } from "react";
import {
  LockAble,
  sort_order,
  capitalize,
  ReturnWidth,
  ShowActioncolumn,
  CheckLocakedStatus,
  getOrganizationDate,
} from "utils";
import { Typography, Form, Radio } from "antd";
import { FilterSort } from "./filterOption";
import { usePermissions, useStore } from "app/Hooks";
import { ActionMenu, Buttonx, Selectx } from "app/shared";

const { Text } = Typography;

export const Columns = (showDetail, listing, handleClick, handleConfirm, sendEmail) => {
  const { org_date_format } = useStore();
  const { checkPermission } = usePermissions();
  const { has_PaymentReceiptsDelete_permission } = checkPermission("PaymentReceiptsDelete");
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  const ActionMenuColumn = ({ value }) => {
    return (
      <ActionMenu
        showEdit
        paymentReceive
        data={value}
        sendEmail={sendEmail}
        showDetail={showDetail}
        handleClick={handleClick}
        handleConfirm={handleConfirm}
        canEdit={
          (imsEdit ? value.platform_type === "books" : true) &&
          value.payment_type !== "invoice_payment"
        }
        deletePermission={
          (imsEdit ? value.platform_type === "books" : true)
            ? has_PaymentReceiptsDelete_permission
            : false
        }
        title={
          (imsEdit ? value.platform_type === "books" : true) && has_PaymentReceiptsDelete_permission
            ? `Are you sure you want to delete "${value.payment_no}"?`
            : "Permission Denied"
        }
      />
    );
  };

  return [
    {
      Header: showDetail ? "All Payment receipts" : "Date",
      id: "payment_date",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="w-100">
          <div className="action-preference w-100 pr-10 align-center">
            <div className={`product-title ${showDetail ? "mr-10" : ""}`}>
              {showDetail && (
                <>
                  <div className="stock_info payment-info">
                    <Text className="w-50 customer_title">{value?.display_name} </Text>
                    <Text className="currency" style={{ marginLeft: "auto" }}>
                      {value?.currency?.symbol}
                      {value?.payment_made}
                    </Text>
                  </div>
                </>
              )}
              {!showDetail && (
                <Text className="customer_title">
                  {getOrganizationDate(value?.payment_date, org_date_format)}
                </Text>
              )}
              {showDetail && (
                <>
                  <div className="payment-details-row">
                    <div className="payment-received-info">
                      <Text className="payment-link">{value?.payment_no}</Text>
                      <Text className="payment-received-date">
                        {getOrganizationDate(value?.payment_date, org_date_format)}
                      </Text>
                    </div>

                    <Text code className="center-badge">
                      <div className={`generic-badge transparent-bg pr-0  ${value?.status}`}>
                        {capitalize(
                          value?.status && value?.status === "prtl-applied"
                            ? "Partially applied"
                            : value?.status
                        )}
                      </div>
                    </Text>
                  </div>
                </>
              )}
            </div>
            {!showDetail &&
              ShowActioncolumn("payment_date", listing.table_setting?.preferences) && (
                <ActionMenuColumn value={value} />
              )}
            {showDetail && <ActionMenuColumn value={value} />}
          </div>
        </div>
      ),
      width: showDetail
        ? 332
        : ReturnWidth(
            "payment_date",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("payment_date", listing.table_setting?.preferences),
      default: true,
      sort_order: sort_order("payment_date", listing.table_setting?.preferences),
    },
    {
      Header: "Payment number",
      accessor: (row) => row,
      id: "payment_no",
      width: showDetail
        ? 0
        : ReturnWidth(
            "payment_no",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("payment_no", listing.table_setting?.preferences),
      is_lockable: LockAble("payment_no", listing.table_setting?.preferences),
      sort_order: sort_order("payment_no", listing.table_setting?.preferences),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <div>{value.payment_no}</div>
          <div>
            {ShowActioncolumn("payment_no", listing.table_setting?.preferences) && (
              <ActionMenuColumn value={value} />
            )}
          </div>
        </div>
      ),
    },
    {
      Header: "Reference  No",
      accessor: (row) => row,
      id: "reference",
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <span className="single_line_name">{value.reference}</span>
          {ShowActioncolumn("reference", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      width: showDetail
        ? 0
        : ReturnWidth(
            "reference",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("reference", listing.table_setting?.preferences),
      is_lockable: LockAble("reference", listing.table_setting?.preferences),
      sort_order: sort_order("reference", listing.table_setting?.preferences),
    },
    {
      Header: "Customer",
      id: "display_name",
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <span className="single_line_name">{value.display_name}</span>
          {ShowActioncolumn("display_name", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "display_name",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      // minWidth: showDetail ? 0 : 150,
      locked: CheckLocakedStatus("display_name", listing.table_setting?.preferences),
      is_lockable: LockAble("display_name", listing.table_setting?.preferences),
      sort_order: sort_order("display_name", listing.table_setting?.preferences),
    },
    {
      Header: "Invoice No",
      id: "invoice_no",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <span className="single_line_name">{value.invoice_no}</span>
          {ShowActioncolumn("invoice_no", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      width: showDetail
        ? 0
        : ReturnWidth(
            "invoice_no",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("invoice_no", listing.table_setting?.preferences),
      is_lockable: LockAble("invoice_no", listing.table_setting?.preferences),
      sort_order: sort_order("invoice_no", listing.table_setting?.preferences),
    },
    {
      Header: "Mode",
      id: "payment_mode",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <span className="single_line_name">{value.payment_mode}</span>
          {ShowActioncolumn("payment_mode", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      width: showDetail
        ? 0
        : ReturnWidth(
            "payment_mode",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("payment_mode", listing.table_setting?.preferences),
      is_lockable: LockAble("payment_mode", listing.table_setting?.preferences),
      sort_order: sort_order("payment_mode", listing.table_setting?.preferences),
    },
    {
      Header: "Amount",
      id: "payment_made",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "payment_made",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      // minWidth: showDetail ? 0 : 150,
      locked: CheckLocakedStatus("payment_made", listing.table_setting?.preferences),
      is_lockable: LockAble("payment_made", listing.table_set8ting?.preferences),
      sort_order: sort_order("payment_made", listing.table_setting?.preferences),
      Cell: ({ cell: { value } }: { cell: { value: any } }) => (
        <div className="action-preference">
          <Typography className="amount-truncation line-clamp-2">{`${
            value?.currency?.symbol
          } ${value.payment_made.toFixed(2)}`}</Typography>
          {ShowActioncolumn("payment_made", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Credit",
      id: "unused_amount",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "unused_amount",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      // minWidth: showDetail ? 0 : 150,
      locked: CheckLocakedStatus("unused_amount", listing.table_setting?.preferences),
      is_lockable: LockAble("unused_amount", listing.table_set8ting?.preferences),
      sort_order: sort_order("unused_amount", listing.table_setting?.preferences),
      Cell: ({ cell: { value } }: { cell: { value: any } }) => (
        <div className="action-preference">
          <Typography className="amount-truncation line-clamp-2">{`${
            value?.currency?.symbol
          } ${value.unused_amount.toFixed(2)}`}</Typography>
          {ShowActioncolumn("unused_amount", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Status",
      id: "status",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "status",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      // minWidth: showDetail ? 0 : 150,
      locked: CheckLocakedStatus("status", listing.table_setting?.preferences),
      is_lockable: LockAble("status", listing.table_setting?.preferences),
      sort_order: sort_order("status", listing.table_setting?.preferences),
      Cell: ({ cell: { value } }: { cell: { value: any } }) => (
        <div className="action-preference w-100">
          <div className={`generic-badge ${value.status}`}>
            {value.status === "prtl-applied" ? "Partially applied" : value.status}
          </div>
          {ShowActioncolumn("status", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Due date",
      id: "due_date",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "due_date",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("due_date", listing.table_setting?.preferences),
      is_lockable: LockAble("due_date", listing.table_setting?.preferences),
      sort_order: sort_order("due_date", listing.table_setting?.preferences),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <Text>{getOrganizationDate(value?.due_date, org_date_format)}</Text>
          {ShowActioncolumn("due_date", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
  ];
};

export const SortContent = ({ pagination, setparam, handleSortPopOver }) => {
  const [form] = Form.useForm();
  const sort = Form.useWatch("sort", form);
  const sort_column = Form.useWatch("sort_column", form);
  const [radioOption, setRadioOption] = useState<string>("asc");

  const onChange = (e) => {
    setRadioOption(e.target.value);
  };

  return (
    <div className="_generic_popupover_main">
      <Form
        className="inner_spacing"
        form={form}
        initialValues={{
          sort: pagination.sort || "asc",
          sort_column: pagination.sort_column || "name",
        }}
        onFinish={(values) => {
          setparam({
            ...pagination,
            sort: values.sort,
            sort_column: values?.sort_column,
          });
          handleSortPopOver(false);
        }}
        style={{ maxWidth: 600, minWidth: 250 }}
      >
        <div className="form_group  mb-20">
          <Selectx
            label={""}
            size="middle"
            name="sort_column"
            allowClear={false}
            className="adjustment-field status-input"
            popupClassName="overlap"
            placeholder="Sort by column"
            options={FilterSort}
          />
        </div>
        <div className="form_group  mb-20">
          <label>Sort order</label>
          <Form.Item name="sort">
            <Radio.Group value={radioOption} onChange={onChange} className="important-block">
              <Radio value="asc" className="block">
                Ascending
              </Radio>
              <Radio value="desc" className="block">
                Descending
              </Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <div className="d-flex  pb-8 justify-center">
          <Buttonx
            className="btn-primary w-96px h-36px"
            btnText="Apply"
            disabled={pagination.sort === sort && pagination.sort_column === sort_column}
          />
        </div>
      </Form>
    </div>
  );
};

export const statusDraft = [{ value: "sent", label: "Sent" }];
export const statusSent = [
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
];
