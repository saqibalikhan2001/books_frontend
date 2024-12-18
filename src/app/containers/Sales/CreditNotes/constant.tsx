/**@format */

import { useState } from "react";
import { Typography, Form, Radio } from "antd";
import {
  LockAble,
  sort_order,
  capitalize,
  ReturnWidth,
  CheckLocakedStatus,
  getOrganizationDate,
  ShowActioncolumn,
} from "utils";
import { useStore } from "app/Hooks";
import { FilterSort } from "./filterOption";
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
  markOpen,
  sendEmail
) => {
  const { org_date_format } = useStore();
  const has_CreditNoteDelete_permission = true;
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  const ActionMenuColumn = ({ value }) => {
    return (
      <ActionMenu
        showEdit
        creditnote
        data={value}
        markOpen={markOpen}
        sendEmail={sendEmail}
        showDetail={showDetail}
        handlePdf={handlePdf}
        handleClick={handleClick}
        handleClone={handleClone}
        currentStatus={value?.status}
        handleConfirm={handleConfirm}
        convertToInvoice={convertToInvoice}
        canEdit={
          (imsEdit === "false" ? value.platform_type === "books" : true) &&
          (value.status === "draft" || value.status === "open")
        }
        deletePermission={
          (imsEdit === "false" ? value.platform_type === "books" : true) && value.status === "draft"
            ? has_CreditNoteDelete_permission
            : false
        }
        title={
          (imsEdit === "false" ? value.platform_type === "books" : true) &&
          has_CreditNoteDelete_permission &&
          value.status === "draft"
            ? `Are you sure you want to delete "${value.credit_note_no}"?`
            : "Permission Denied"
        }
      />
    );
  };

  return [
    {
      Header: showDetail ? "All Credit notes" : "Date",
      id: "credit_note_date",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <div className="product_info align-center adjust-gap">
            <div className="product-title">
              <Text className="_title">
                {getOrganizationDate(value?.credit_note_date, org_date_format)}
              </Text>
              {showDetail && (
                <div className="stock_info">
                  <Text className="">{value?.display_name} </Text>
                </div>
              )}
            </div>
            {showDetail && (
              <>
                <Text code className="center-badge">
                  <div
                    className={
                      value
                        ? `generic-badge ${
                            value?.status && value?.status === "partially applied"
                              ? "partially-paid"
                              : value?.status
                          }`
                        : ""
                    }
                  >
                    {capitalize(
                      value?.status && value?.status === "partially applied"
                        ? "PRTL Applied"
                        : value?.status
                    )}
                  </div>
                </Text>
                <ActionMenuColumn value={value} />
              </>
            )}
            {!showDetail &&
              ShowActioncolumn("credit_note_date", listing.table_setting?.preferences) && (
                <ActionMenuColumn value={value} />
              )}
          </div>
        </div>
      ),
      width: showDetail
        ? 332
        : ReturnWidth(
            "credit_note_date",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("credit_note_date", listing.table_setting?.preferences),
      default: true,
      sort_order: sort_order("credit_note_date", listing.table_setting?.preferences),
    },

    {
      Header: "Credit note number",
      accessor: (row) => row,
      id: "credit_note_no",
      width: showDetail
        ? 0
        : ReturnWidth(
            "credit_note_no",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("credit_note_no", listing.table_setting?.preferences),
      is_lockable: LockAble("credit_note_no", listing.table_setting?.preferences),
      sort_order: sort_order("credit_note_no", listing.table_setting?.preferences),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          {value.credit_note_no}
          {ShowActioncolumn("credit_note_no", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Customer",
      accessor: (row) => row,
      id: "display_name",
      width: showDetail
        ? 0
        : ReturnWidth(
            "display_name",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("display_name", listing.table_setting?.preferences),
      is_lockable: LockAble("display_name", listing.table_setting?.preferences),
      sort_order: sort_order("display_name", listing.table_setting?.preferences),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <span className="single_line_name">{value.display_name}</span>
          {ShowActioncolumn("display_name", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Amount",
      id: "issued_credits",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "issued_credits",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("issued_credits", listing.table_setting?.preferences),
      is_lockable: LockAble("issued_credits", listing.table_set8ting?.preferences),
      sort_order: sort_order("issued_credits", listing.table_setting?.preferences),
      Cell: ({ cell: { value } }: { cell: { value: any } }) => (
        <div className={"action-preference"}>
          <Typography className="amount-truncation line-clamp-2">{`${
            listing?.currency
          } ${value.issued_credits.toFixed(2)}`}</Typography>
          {ShowActioncolumn("issued_credits", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Balance",
      id: "balance",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "balance",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      // minWidth: showDetail ? 0 : 150,
      locked: CheckLocakedStatus("balance", listing.table_setting?.preferences),
      is_lockable: LockAble("balance", listing.table_set8ting?.preferences),
      sort_order: sort_order("balance", listing.table_setting?.preferences),
      Cell: ({ cell: { value } }: { cell: { value: any } }) => (
        <div className="action-preference">
          <Typography className="amount-truncation line-clamp-2">{`${
            listing?.currency
          } ${value.balance.toFixed(2)}`}</Typography>
          {ShowActioncolumn("balance", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Status",
      accessor: (row) => row,
      id: "status",
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
          <div
            className={`generic-badge ${
              value.status && value.status === "partially applied" ? "partially-paid" : value.status
            }`}
          >
            {value.status === "partially applied" ? "PRTL Applied" : value.status}
          </div>
          {ShowActioncolumn("status", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
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
      Cell: ({ cell: { value } }: { cell: { value: any } }) => (
        <div className="action-preference">
          {value.invoice_no}
          {ShowActioncolumn("invoice_no", listing.table_setting?.preferences) && (
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
        form={form}
        className="inner_spacing"
        style={{ maxWidth: 600, minWidth: 250 }}
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
      >
        <div className="form_group  mb-20">
          <Selectx
            label={""}
            size="middle"
            name="sort_column"
            allowClear={false}
            options={FilterSort}
            popupClassName="overlap"
            placeholder="Sort by column"
            className="adjustment-field status-input"
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
            btnText="Apply"
            className={`btn-primary w-96px h-36px ${
              pagination.sort === sort && pagination.sort_column === sort_column
                ? "disabled-button disabled-save-btn"
                : ""
            }`}
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
