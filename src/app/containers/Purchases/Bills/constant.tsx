/** @format */
import { useState } from "react";
import { Typography, Popconfirm, Form, Radio } from "antd";
import {
  LockAble,
  sort_order,
  ReturnWidth,
  getFullDate,
  defaultStatus,
  ShowActioncolumn,
  CheckLocakedStatus,
  getOrganizationDate,
} from "utils";
import { FilterSort } from "./filterOptions";
import { TooltipX } from "app/shared/ToolTip";
import { ActionMenu, Buttonx, Selectx } from "app/shared";
import { usePermissions, useSharedOrganization, useStore } from "app/Hooks";

const { Text } = Typography;

export const Columns = (
  showDetail,
  _productStatus,
  handleClone,
  listing,
  handlePdf,
  sendEmail,
  handleBillModal,
  handleClick,
  markOpen,
  handleConfirm,
  base_currency
) => {
  const { org_date_format } = useStore();
  const { checkPermission } = usePermissions();
  const { getCurrentModule } = useSharedOrganization();
  const { has_BillDelete_permission } = checkPermission("BillDelete");
  const { status = undefined } = getCurrentModule("bill-payments") || {};
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  const ActionMenuColumn = ({ value }) => (
    <ActionMenu
      bill
      showEdit
      data={value}
      markOpen={markOpen}
      sendEmail={sendEmail}
      handlePdf={handlePdf}
      showDetail={showDetail}
      handleClone={handleClone}
      handleClick={handleClick}
      hasModulePermission={status}
      handleConfirm={handleConfirm}
      currentStatus={value?.status}
      handleBillModal={handleBillModal}
      status={imsEdit === "false" ? value.platform_type === "books" : true}
      canEdit={
        imsEdit === "false"
          ? value.platform_type === "books" && value.status === "draft"
          : value.status === "draft"
      }
      deletePermission={
        (imsEdit === "false" ? value.platform_type === "books" : true) && value.status === "draft"
          ? has_BillDelete_permission
          : false
      }
      title={
        (imsEdit === "false" ? value.platform_type === "books" : true) &&
        has_BillDelete_permission &&
        value.status === "draft"
          ? `Are you sure you want to delete "${value.bill_no}" bill ?`
          : "Permission Denied"
      }
    />
  );

  return [
    {
      id: "bill_date",
      accessor: (row) => row,
      Header: showDetail ? "All Bills" : "Date",
      Cell: ({ value }: { value: any }) => (
        <div className="w-100 py-6 pr-10">
          <div className="action-preference w-100 align-center">
            <div className="product-title mr-10">
              {showDetail && (
                <>
                  <div className="stock_info payment-info">
                    <Text className="w-50 customer_title">{value?.display_name} </Text>
                    <Text className="currency" style={{ marginLeft: "auto" }}>
                      {value?.currency?.symbol}&nbsp;
                      {value?.total.toFixed(2)}
                    </Text>
                  </div>
                </>
              )}
              {!showDetail && (
                <Text className="customer_title">
                  {getOrganizationDate(value?.bill_date, org_date_format)}
                </Text>
              )}
              {showDetail && (
                <>
                  <div className="payment-details-row">
                    <div className="payment-received-info w-67">
                      <Text className="payment-link">{value?.bill_no}</Text>
                      <Text className="payment-received-date">
                        {getOrganizationDate(value?.bill_date, org_date_format)}
                      </Text>
                      <Text className="payment-received-date">
                        {getOrganizationDate(value?.payment_date, org_date_format)}
                      </Text>
                    </div>
                    <Text code className="center-badge">
                      <div
                        className={`generic-badge transparent-bg pr-0  ${
                          value.status && value.status === "partially paid"
                            ? "partially-paid"
                            : value.status
                        }`}
                      >
                        {value.status === "partially paid" ? "Partially paid" : value.status}
                      </div>
                    </Text>
                  </div>
                </>
              )}
            </div>
            {!showDetail && ShowActioncolumn("bill_date", listing.table_setting?.preferences) && (
              <ActionMenuColumn value={value} />
            )}
            {showDetail && <ActionMenuColumn value={value} />}
          </div>
        </div>
      ),
      minWidth: 200,
      width: showDetail
        ? 350
        : ReturnWidth(
            "bill_date",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("bill_date", listing?.table_setting?.preferences),
      default: true,
      sort_order: sort_order("bill_date", listing?.table_setting?.preferences),
    },
    {
      id: "due_date",
      Header: "Due date",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <div className="product_info">
            <Text>{getFullDate(value?.due_date)}</Text>
          </div>
          {ShowActioncolumn("due_date", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      minWidth: 200,
      width: showDetail
        ? 0
        : ReturnWidth(
            "due_date",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("due_date", listing?.table_setting?.preferences),
      default: defaultStatus("due_date", listing?.table_setting?.preferences),
      is_lockable: LockAble("due_date", listing?.table_setting?.preferences),
      sort_order: sort_order("due_date", listing?.table_setting?.preferences),
    },
    {
      id: "bill_no",
      Header: "Bill number",
      accessor: (row) => row,
      locked: CheckLocakedStatus("bill_no", listing?.table_setting?.preferences),
      width: showDetail
        ? 0
        : ReturnWidth(
            "bill_no",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      is_lockable: LockAble("bill_no", listing?.table_setting?.preferences),
      default: defaultStatus("bill_no", listing?.table_setting?.preferences),
      sort_order: sort_order("bill_no", listing?.table_setting?.preferences),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <div className="product_info">
            <Text>{value?.bill_no}</Text>
          </div>
          {ShowActioncolumn("bill_no", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      id: "order_no",
      Header: "Order No",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <div className="product_info">
            <Text>{value?.order_no}</Text>
          </div>
          {ShowActioncolumn("order_no", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      minWidth: 200,
      width: showDetail
        ? 0
        : ReturnWidth(
            "order_no",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("order_no", listing?.table_setting?.preferences),
      default: defaultStatus("order_no", listing?.table_setting?.preferences),
      is_lockable: LockAble("order_no", listing?.table_setting?.preferences),
      sort_order: sort_order("order_no", listing?.table_setting?.preferences),
    },
    {
      Header: "Supplier",
      id: "display_name",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "display_name",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      is_lockable: LockAble("display_name", listing?.table_setting?.preferences),
      sort_order: sort_order("display_name", listing?.table_setting?.preferences),
      default: defaultStatus("display_name", listing?.table_setting?.preferences),
      locked: CheckLocakedStatus("display_name", listing?.table_setting?.preferences),
      Cell: ({ cell: { value } }: { cell: { value: any } }) => (
        <div
          className="action-preference w-100 text_truncate line-clamp-2"
          style={{ display: "-webkit-box" }}
        >
          {value.display_name}
          {ShowActioncolumn("display_name", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      id: "status",
      Header: "Status",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "status",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      default: defaultStatus("status", listing?.table_setting?.preferences),
      sort_order: sort_order("status", listing?.table_setting?.preferences),
      is_lockable: LockAble("status", listing?.table_setting?.preferences),
      locked: CheckLocakedStatus("status", listing?.table_setting?.preferences),
      Cell: ({ cell: { value } }: { cell: { value: any } }) => {
        return (
          <div className="action-preference w-100">
            <div
              className={`generic-badge ${
                value.status && value.status === "partially paid" ? "partially-paid" : value.status
              }`}
            >
              {value.status === "partially paid" ? "Partially paid" : value.status}
            </div>
          </div>
        );
      },
    },
    {
      id: "total",
      Header: "Amount",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "total",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("total", listing?.table_setting?.preferences),
      default: defaultStatus("total", listing?.table_setting?.preferences),
      is_lockable: LockAble("total", listing?.table_setting?.preferences),
      sort_order: sort_order("total", listing?.table_setting?.preferences),
      Cell: ({ cell: { value } }: { cell: { value: any } }) => (
        <div className="action-preference amount-truncation line-clamp-2">
          <div>{`${base_currency?.symbol} ${value.total.toFixed(2)}`}</div>
          {ShowActioncolumn("total", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      id: "balance_due",
      Header: "Balance",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "balance_due",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("balance_due", listing?.table_setting?.preferences),
      default: defaultStatus("balance_due", listing?.table_setting?.preferences),
      is_lockable: LockAble("balance_due", listing?.table_setting?.preferences),
      sort_order: sort_order("balance_due", listing?.table_setting?.preferences),
      Cell: ({ cell: { value } }: { cell: { value: any } }) => (
        <div className="action-preference">
          <Text className="amount-truncation line-clamp-2">{`${
            base_currency?.symbol
          } ${value.balance_due.toFixed(2)}`}</Text>
          {ShowActioncolumn("balance_due", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
  ];
};

export const itemActions = (handleBulkActions, categories) => {
  return [
    {
      key: "1",
      label: "Make Active",
      onClick: () => handleBulkActions("active"),
    },
    {
      key: "2",
      label: "Make Inactive",
      onClick: () => handleBulkActions("inactive"),
    },
    {
      key: "3",
      label: (
        <Popconfirm
          key="confirm"
          placement="left"
          title={`Are you sure you want to delete selected products?`}
          okText={"Yes"}
          cancelText="No"
          showCancel
          onCancel={(e) => e?.stopPropagation()}
          onConfirm={(e) => {
            e?.stopPropagation();
            handleBulkActions("delete");
          }}
        >
          <TooltipX title="Delete">
            <label
              style={{ display: "block", width: "100%" }}
              onClick={(e) => e?.stopPropagation()}
            >
              Delete
            </label>
          </TooltipX>
        </Popconfirm>
      ),
    },
    {
      key: "4",
      label: "Assign Category",
      children: categories.map((category) => ({
        ...category,
        key: `4-${category?.id}`,
        onClick: () => handleBulkActions("category_assign", category?.id),
      })),
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
          sort_column: pagination.sort_column || "bill_date",
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
            className="adjustment-field status-input"
            popupClassName="overlap dropdown--scroll"
            placeholder="Sort by column"
            options={FilterSort}
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
            className="btn-primary w-96px h-36px"
            btnText="Apply"
            disabled={pagination.sort === sort && pagination.sort_column === sort_column}
          />
        </div>
      </Form>
    </div>
  );
};
