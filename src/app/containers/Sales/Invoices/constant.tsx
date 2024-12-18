//@ts-nocheck

import { useState } from "react";
import {
  LockAble,
  sort_order,
  capitalize,
  ReturnWidth,
  CheckLocakedStatus,
  getOrganizationDate,
  ShowActioncolumn,
} from "utils";
import { Typography, Form, Radio } from "antd";
import { FilterSort } from "./filterOption";
import { usePermissions, useStore } from "app/Hooks";
import { ActionMenu, Buttonx, Selectx } from "app/shared";

const { Text } = Typography;

export const Columns = (
  showDetail,
  listing,
  handleClone,
  handlePdf,
  //@ts-ignore
  handleStatus,
  handleClick,
  handleConfirm,
  convertToInvoice,
  handleReceivePaymentModal,
  sentMark,
  sendEmail
) => {
  const { org_date_format } = useStore();
  const { checkPermission } = usePermissions();
  const { has_InvoiceDelete_permission } = checkPermission("InvoiceDelete");
  const { has_InvoiceEdit_permission } = checkPermission("InvoiceEdit");
  const { has_InvoicePaymentRecordCreate_permission } = checkPermission(
    "InvoicePaymentRecordCreate"
  );

  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;
  const ActionMenuColumn = ({ value }) => (
    <ActionMenu
      invoice
      showEdit
      data={value}
      sentMark={sentMark}
      sendEmail={sendEmail}
      showDetail={showDetail}
      handlePdf={handlePdf}
      handleClick={handleClick}
      handleClone={handleClone}
      currentStatus={value?.status}
      handleConfirm={handleConfirm}
      canMarkSent={!has_InvoiceEdit_permission}
      hasModulePermission={!has_InvoicePaymentRecordCreate_permission}
      // active={Boolean(value?.is_active)}
      convertToInvoice={convertToInvoice}
      handleReceivePaymentModal={handleReceivePaymentModal}
      // status={value.platform_type === "books"}
      canEdit={
        imsEdit === "false"
          ? value.platform_type === "books" && value?.status === "draft"
          : value?.status === "draft"
      }
      deletePermission={
        (
          imsEdit === "false"
            ? value.platform_type === "books" && value.status === "draft"
            : value.status === "draft"
        )
          ? has_InvoiceDelete_permission
          : false
      }
      title={
        (imsEdit === "false" ? value.platform_type === "books" : true) &&
        has_InvoiceDelete_permission &&
        value.status === "draft"
          ? `Are you sure you want to delete "${value.invoice_no}"?`
          : "Permission Denied"
      }
    />
  );
  return [
    {
      Header: showDetail ? "All Invoices" : "Date",
      id: "invoice_date",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100 mr-10">
          <div className="product_info align-center">
            <div className="product-title">
              <Text>{getOrganizationDate(value?.invoice_date, org_date_format)}</Text>
              {showDetail && (
                <>
                  <div className="stock_info">
                    <Text>{value?.display_name} </Text>
                  </div>
                  {/* <ActionMenuColumn value={value} /> */}
                </>
              )}
            </div>

            {showDetail && (
              <Text code className="center-badge mr-10">
                <div
                  className={
                    value
                      ? `generic-badge  ${
                          value?.status && value?.status === "partially paid"
                            ? "partially-paid"
                            : value?.status
                        }`
                      : ""
                  }
                >
                  {capitalize(
                    value?.status && value?.status === "partially paid"
                      ? "PRTL Paid"
                      : value?.status
                  )}
                </div>
              </Text>
            )}
            {showDetail && (
              <>
                <ActionMenuColumn value={value} />
              </>
            )}
          </div>
          {!showDetail && ShowActioncolumn("invoice_date", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      width: showDetail
        ? 332
        : ReturnWidth(
            "invoice_date",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("invoice_date", listing.table_setting?.preferences),
      default: true,
      sort_order: sort_order("invoice_date", listing.table_setting?.preferences),
    },

    {
      Header: "Invoice number",
      id: "invoice_no",
      accessor: (row) => row,
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
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          {value.invoice_no}
          {ShowActioncolumn("invoice_no", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Customer",
      id: "display_name",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <span className="single_line_name">{value.display_name}</span>
          {ShowActioncolumn("display_name", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),

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
      Header: "Amount",
      id: "total",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "total",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      // minWidth: showDetail ? 0 : 150,
      locked: CheckLocakedStatus("total", listing.table_setting?.preferences),
      is_lockable: LockAble("total", listing.table_setting?.preferences),
      sort_order: sort_order("total", listing.table_setting?.preferences),
      Cell: ({ cell: { value } }: { cell: { value: any } }) => (
        <div className="action-preference">
          <Typography className="amount-truncation line-clamp-2">{`${
            value?.currency?.symbol
          } ${value.total.toFixed(2)}`}</Typography>
          {ShowActioncolumn("total", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Balance",
      id: "payment_due",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "payment_due",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      // minWidth: showDetail ? 0 : 150,
      locked: CheckLocakedStatus("payment_due", listing.table_setting?.preferences),
      is_lockable: LockAble("payment_due", listing.table_setting?.preferences),
      sort_order: sort_order("payment_due", listing.table_setting?.preferences),
      Cell: ({ cell: { value } }: { cell: { value: any } }) => (
        <div className="action-preference">
          <Typography className="amount-truncation line-clamp-2">{`${
            value?.currency?.symbol
          } ${value.payment_due.toFixed(2)}`}</Typography>
          {ShowActioncolumn("payment_due", listing.table_setting?.preferences) && (
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
      Cell: ({ cell: { value } }: { cell: { value: string } }) => (
        <div className="action-preference w-100">
          <div
            className={`generic-badge ${
              value.status && value.status === "partially paid" ? "partially-paid" : value.status
            }`}
          >
            {value.status === "partially paid" ? "PRTL Paid" : value.status}
          </div>
          {/* {value.sku} */}
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
