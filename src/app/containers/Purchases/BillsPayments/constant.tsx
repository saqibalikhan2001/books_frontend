/** @format */

import { useState } from "react";
import { Typography, Popconfirm, Form, Radio } from "antd";
import {
  LockAble,
  sort_order,
  ReturnWidth,
  defaultStatus,
  ShowActioncolumn,
  CheckLocakedStatus,
  getOrganizationDate,
} from "utils";
import { TooltipX } from "app/shared/ToolTip";
import { FilterSort } from "./filtersOptions";
import { usePermissions, useStore } from "app/Hooks";
import { ActionMenu, Buttonx, Selectx } from "app/shared";

const { Text } = Typography;

export const Columns = (
  showDetail,
  listing,
  handlePdf,
  handleClick,
  handleConfirm,
  pdfDownload,
  sendEmail
) => {
  const { org_date_format } = useStore();

  const ActionMenuColumn = ({ value }) => {
    const { checkPermission } = usePermissions();
    const { has_BillPaymentRecordEdit_permission } = checkPermission("BillPaymentRecordEdit");
    const { has_BillPaymentRecordDelete_permission } = checkPermission("BillPaymentRecordDelete");
    const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

    return (
      <ActionMenu
        billPayments
        data={value}
        sendEmail={sendEmail}
        handlePdf={handlePdf}
        showDetail={showDetail}
        handleClick={handleClick}
        currentStatus={value?.status}
        handleConfirm={handleConfirm}
        handlePdfDownload={pdfDownload}
        active={Boolean(value?.is_active)}
        status={imsEdit === "false" ? value.platform_type === "books" : true}
        canEdit={
          (imsEdit === "false" ? value.platform_type === "books" : true)
            ? has_BillPaymentRecordEdit_permission
            : false
        }
        deletePermission={
          (imsEdit === "false" ? value.platform_type === "books" : true)
            ? has_BillPaymentRecordDelete_permission
            : false
        }
        title={
          (imsEdit === "false" ? value.platform_type === "books" : true) &&
          has_BillPaymentRecordDelete_permission
            ? `Are you sure you want to delete "${value.payment_no}" bill payment ?`
            : "Permission Denied"
        }
      />
    );
  };

  return [
    {
      Header: showDetail ? "All Bill payments" : "Date",
      id: "payment_date",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => {
        return (
          <div className="w-100 pr-10">
            <div className={`action-preference w-100 align-center ${showDetail ? "py_4" : ""}`}>
              <div className="product-title mr-10">
                {showDetail && (
                  <>
                    <div className="stock_info payment-info">
                      <Text className="w-50 customer_title">{value?.display_name} </Text>
                      <Text className="currency " style={{ marginLeft: "auto" }}>
                        {value?.currency?.symbol}&nbsp;
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
                      </div>
                      <Text code className="center-badge">
                        <Text className="payment-received-date">
                          {getOrganizationDate(value?.payment_date, org_date_format)}
                        </Text>
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
        );
      },
      minWidth: 200,
      width: showDetail
        ? 350
        : ReturnWidth(
            "payment_date",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("payment_date", listing?.table_setting?.preferences),
      default: true,
      sort_order: sort_order("payment_date", listing?.table_setting?.preferences),
    },
    {
      Header: "Payment number",
      id: "id",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference">
          <Typography>{value?.payment_no}</Typography>
          {ShowActioncolumn("id", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      minWidth: 200,
      width: showDetail
        ? 0
        : ReturnWidth(
            "id",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("id", listing?.table_setting?.preferences),
      default: defaultStatus("id", listing?.table_setting?.preferences),
      is_lockable: LockAble("id", listing?.table_setting?.preferences),
      sort_order: sort_order("id", listing?.table_setting?.preferences),
    },
    {
      Header: "Amount",
      id: "payment_made",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "payment_made",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference">
          <Typography className="amount-truncation line-clamp-2">
            {value?.currency?.symbol}&nbsp;
            {value?.payment_made?.toFixed(2)}
          </Typography>
          {ShowActioncolumn("payment_made", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      locked: CheckLocakedStatus("payment_made", listing?.table_setting?.preferences),
      default: defaultStatus("payment_made", listing?.table_setting?.preferences),
      is_lockable: LockAble("payment_made", listing?.table_setting?.preferences),
      sort_order: sort_order("payment_made", listing?.table_setting?.preferences),
    },
    {
      Header: "Supplier",
      accessor: "display_name",
      width: showDetail
        ? 0
        : ReturnWidth(
            "display_name",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("display_name", listing?.table_setting?.preferences),
      is_lockable: LockAble("display_name", listing?.table_setting?.preferences),
      default: defaultStatus("display_name", listing?.table_setting?.preferences),
      sort_order: sort_order("display_name", listing?.table_setting?.preferences),
      minWidth: 200,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference single_line_name">
          <Typography>{value}</Typography>
          {ShowActioncolumn("display_name", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Bill number",
      id: "bill_no",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "bill_no",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference">
          <Typography>{value?.bill_no}</Typography>
          {ShowActioncolumn("bill_no", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      locked: CheckLocakedStatus("bill_no", listing?.table_setting?.preferences),
      default: defaultStatus("bill_no", listing?.table_setting?.preferences),
      is_lockable: LockAble("bill_no", listing?.table_setting?.preferences),
      sort_order: sort_order("bill_no", listing?.table_setting?.preferences),
    },
    {
      Header: "Reference",
      id: "reference",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "reference",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference">
          <Typography className="single_line_name">{value?.reference}</Typography>
          {ShowActioncolumn("reference", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      locked: CheckLocakedStatus("reference", listing?.table_setting?.preferences),
      default: defaultStatus("reference", listing?.table_setting?.preferences),
      is_lockable: LockAble("reference", listing?.table_setting?.preferences),
      sort_order: sort_order("reference", listing?.table_setting?.preferences),
    },
  ];
};

export const itemActions = (handleBulkActions) => [
  {
    key: "1",
    label: (
      <Popconfirm
        showCancel
        key="confirm"
        placement="left"
        okText="Yes"
        cancelText="No"
        title={`Are you sure you want to delete selected bill payments?`}
        onCancel={(e) => e?.stopPropagation()}
        onConfirm={(e) => {
          e?.stopPropagation();
          handleBulkActions("delete");
        }}
      >
        <TooltipX title="Delete">
          <label style={{ display: "block", width: "100%" }} onClick={(e) => e?.stopPropagation()}>
            Delete
          </label>
        </TooltipX>
      </Popconfirm>
    ),
  },
];

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
        initialValues={{
          sort: pagination.sort || "asc",
          sort_column: pagination.sort_column || "payment_date",
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
            options={FilterSort}
            popupClassName="overlap"
            placeholder="Sort by column"
            className="adjustment-field status-input"
            allowClear={false}
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
            className="btn-primary w-96px h-36px"
            disabled={pagination.sort === sort && pagination.sort_column === sort_column}
          />
        </div>
      </Form>
    </div>
  );
};
