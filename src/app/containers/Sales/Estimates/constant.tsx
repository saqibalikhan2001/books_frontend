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
  sentMark,
  sendEmail
) => {
  const { org_date_format } = useStore();
  const { checkPermission } = usePermissions();
  const { has_EstimatesDelete_permission } = checkPermission("EstimatesDelete");
  const { has_EstimatesEdit_permission } = checkPermission("EstimatesEdit");

  const ActionMenuColumn = ({ value }) => {
    return (
      <ActionMenu
        estimate
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
        canMarkSent={!has_EstimatesEdit_permission}
        // active={Boolean(value?.is_active)}
        convertToInvoice={convertToInvoice}
        // status={value.platform_type === "books"}
        canEdit={
          value.platform_type === "books" && (value.status === "sent" || value.status === "draft")
        }
        deletePermission={
          value.platform_type === "books" && value.status === "draft"
            ? has_EstimatesDelete_permission
            : false
        }
        title={
          value.platform_type === "books" &&
          value.status === "draft" &&
          has_EstimatesDelete_permission
            ? `Are you sure you want to delete "${value.estimate_no}"?`
            : "Permission Denied"
        }
      />
    );
  };
  return [
    {
      Header: showDetail ? "All Estimates" : "Date",
      id: "estimate_date",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <div className="product_info align-center">
            <div className="product-title">
              <Text>{getOrganizationDate(value?.estimate_date, org_date_format)}</Text>
              {showDetail && (
                <div className="stock_info">
                  <Text>{value?.display_name} </Text>
                </div>
              )}
            </div>
            {!showDetail &&
              ShowActioncolumn("estimate_date", listing.table_setting?.preferences) && (
                <ActionMenuColumn value={value} />
              )}
            {showDetail && (
              <Text code className="center-badge mr-10">
                <div className={value ? ` generic-badge ${value?.status && value?.status}` : ""}>
                  {capitalize(value?.status)}
                </div>
              </Text>
            )}
            {showDetail && <ActionMenuColumn value={value} />}
          </div>
        </div>
      ),
      width: showDetail
        ? 332
        : ReturnWidth(
            "estimate_date",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("estimate_date", listing.table_setting?.preferences),
      default: true,
      sort_order: sort_order("estimate_date", listing.table_setting?.preferences),
    },
    {
      Header: "Estimate number",
      id: "estimate_no",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          {value.estimate_no}
          {!showDetail && ShowActioncolumn("estimate_no", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      width: showDetail
        ? 0
        : ReturnWidth(
            "estimate_no",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),

      locked: CheckLocakedStatus("estimate_no", listing.table_setting?.preferences),
      is_lockable: LockAble("estimate_no", listing.table_setting?.preferences),
      sort_order: sort_order("estimate_no", listing.table_setting?.preferences),
    },
    {
      Header: "Customer",
      id: "display_name",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <span className="single_line_name">{value?.display_name}</span>
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
      locked: CheckLocakedStatus("display_name", listing.table_setting?.preferences),
      is_lockable: LockAble("display_name", listing.table_setting?.preferences),
      sort_order: sort_order("display_name", listing.table_setting?.preferences),
    },
    {
      Header: "Expiry date",
      id: "expiry_date",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <Text>{getOrganizationDate(value?.expiry_date, org_date_format)}</Text>
          {ShowActioncolumn("expiry_date", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      width: showDetail
        ? 0
        : ReturnWidth(
            "expiry_date",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("expiry_date", listing.table_setting?.preferences),
      is_lockable: LockAble("expiry_date", listing.table_setting?.preferences),
      sort_order: sort_order("expiry_date", listing.table_setting?.preferences),
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
      locked: CheckLocakedStatus("total", listing.table_setting?.preferences),
      is_lockable: LockAble("total", listing.table_set8ting?.preferences),
      sort_order: sort_order("total", listing.table_setting?.preferences),
      Cell: ({ cell: { value } }: { cell: { value: any } }) => (
        <div className="action-preference">
          <Typography className="amount-truncation line-clamp-2">{`${value?.currency?.symbol} ${value.total.toFixed(2)}`}</Typography>
          {ShowActioncolumn("total", listing.table_setting?.preferences) && (
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
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <div className={`generic-badge ${value?.status}`}>
            {value === "prtl-applied" ? "PRTL Applied" : value?.status}
          </div>
          {ShowActioncolumn("status", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Sending date",
      id: "sending_date",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "sending_date",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("sending_date", listing.table_setting?.preferences),
      is_lockable: LockAble("sending_date", listing.table_setting?.preferences),
      sort_order: sort_order("sending_date", listing.table_setting?.preferences),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <Text>{getOrganizationDate(value?.sending_date, org_date_format)}</Text>
          {ShowActioncolumn("sending_date", listing.table_setting?.preferences) && (
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
            placeholder="Sort by column"
            popupClassName="overlap"
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
        <div className="d-flex  justify-center">
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
