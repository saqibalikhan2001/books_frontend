/**@format */

import { useState } from "react";
import { Form, Popconfirm, Radio, Typography } from "antd";
import { usePermissions } from "app/Hooks";
import { TooltipX } from "app/shared/ToolTip";
import {
  LockAble,
  sort_order,
  ReturnWidth,
  defaultStatus,
  ShowActioncolumn,
  CheckLocakedStatus,
} from "utils";
import HasChildAccount from "./HasChildAccount";
import { ActionMenu, Buttonx, Selectx } from "app/shared";
import HasOnlyOpeningBalance from "./HasOnlyOpeningBalance";

const { Text } = Typography;

export const Columns = (
  showDetail,
  listing,
  handleStatus,
  handleClick,
  handleConfirm,
  //@ts-ignore
  base_currency
) => {
  const { checkPermission } = usePermissions();
  const { has_AccountsDelete_permission } = checkPermission("AccountsDelete");
  const { has_AccountsEdit_permission } = checkPermission("AccountsEdit");
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;
  const ActionMenuColumn = ({ value }) => {
    const deletePermission =
      (imsEdit === "false" ? value.platform_type === "books" : true) &&
      has_AccountsDelete_permission;
    const getTitle = () => {
      if (!deletePermission) {
        return "Permission denied";
      }
      if (value.is_default === 1) {
        return <Typography>The default account cannot be deleted</Typography>;
      }
      if (value?.has_child_account) {
        return <HasChildAccount data={value} />;
      }
      if (value?.has_transaction) {
        return (
          <Typography>
            You cannot delete this account because it has associated entries in the journal as a
            result of transactions recorded by you. As an alternative you can make this account
            inactive.
          </Typography>
        );
      }
      if (Boolean(value?.has_only_opening_balance)) {
        return <HasOnlyOpeningBalance data={value} />;
      }
      return `Delete "${value.title}" Account ?`;
    };

    const isDeleteAble = () => {
      if (!deletePermission) return false;
      if (value.is_default === 1) return false;
      if (value?.has_child_account) return false;
      if (value?.has_transaction) return false;
      if (Boolean(value?.has_only_opening_balance)) return true;
      return true;
    };

    return (
      <ActionMenu
        account
        showEdit
        data={value}
        title={getTitle()}
        handleClick={handleClick}
        handleStatus={handleStatus}
        handleConfirm={handleConfirm}
        deletePermission={isDeleteAble()}
        active={Boolean(value?.is_active)}
        okText={value?.has_child_account ? "Close" : "OK"}
        className={`${value?.has_transaction && !value.is_default ? "width-400" : ""} 
        ${value?.has_child_account || Boolean(value?.has_only_opening_balance) ? "table-popup" : ""}
        ${value.is_default === 1 ? "w-227" : ""}`}
        canEdit={imsEdit === "false" ? value.platform_type === "books" : true}
        status={
          (imsEdit === "false" ? value.platform_type === "books" : true) &&
          !value?.is_default &&
          has_AccountsEdit_permission
        }
      />
    );
  };
  return [
    {
      Header: "Name",
      id: "title",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <div className="product_info">
            <div className="product-title" style={{ paddingTop: 0 }}>
              <Text className="_title">{`${value?.title}`}</Text>
            </div>
            <div className="">
              {!value?.is_active ? <span className="generic-badge cancelled">inactive</span> : null}
              {ShowActioncolumn("title", listing?.table_setting?.preferences) && (
                <ActionMenuColumn value={value} />
              )}
            </div>
          </div>
        </div>
      ),

      minWidth: 200,
      width: showDetail
        ? 350
        : ReturnWidth(
            "title",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("title", listing?.table_setting?.preferences),
      default: defaultStatus("title", listing?.table_setting?.preferences),
      sort_order: sort_order("title", listing?.table_setting?.preferences),
    },
    {
      Header: "Category",
      id: "account_category_name",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "account_category_name",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("account_category_name", listing?.table_setting?.preferences),
      is_lockable: LockAble("account_category_name", listing?.table_setting?.preferences),
      sort_order: sort_order("account_category_name", listing?.table_setting?.preferences),
      default: defaultStatus("account_category_name", listing?.table_setting?.preferences),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <Text>{value?.account_category?.name}</Text>
          {ShowActioncolumn("account_category_name", listing?.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Account No.",
      width: showDetail
        ? 0
        : ReturnWidth(
            "account_no",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("account_no", listing?.table_setting?.preferences),
      is_lockable: LockAble("account_no", listing?.table_setting?.preferences),
      default: defaultStatus("account_no", listing?.table_setting?.preferences),
      sort_order: sort_order("account_no", listing?.table_setting?.preferences),
      id: "account_no",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <div className="single_line_name">{value?.account_no}</div>
          {ShowActioncolumn("account_no", listing?.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Type",
      id: "account_type_name",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "account_type_name",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("account_type_name", listing?.table_setting?.preferences),
      default: defaultStatus("account_type_name", listing?.table_setting?.preferences),
      is_lockable: LockAble("account_type_name", listing?.table_setting?.preferences),
      sort_order: sort_order("account_type_name", listing?.table_setting?.preferences),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100 single_line_name">
          {
            //@ts-ignore
            value?.account_type?.name
          }
          {ShowActioncolumn("account_type_name", listing?.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Sub type",
      width: showDetail
        ? 0
        : ReturnWidth(
            "account_subtype_name",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("account_subtype_name", listing?.table_setting?.preferences),
      is_lockable: LockAble("account_subtype_name", listing?.table_setting?.preferences),
      default: defaultStatus("account_subtype_name", listing?.table_setting?.preferences),
      sort_order: sort_order("account_subtype_name", listing?.table_setting?.preferences),
      id: "account_subtype_name",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference">
          <Text className="single_line_name">{`${value?.account_sub_type?.name}`}</Text>
          {ShowActioncolumn("account_subtype_name", listing?.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Parent account",
      id: "parent_account_name",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "parent_account_name",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("parent_account_name", listing?.table_setting?.preferences),
      default: defaultStatus("parent_account_name", listing?.table_setting?.preferences),
      is_lockable: LockAble("parent_account_name", listing?.table_setting?.preferences),
      sort_order: sort_order("parent_account_name", listing?.table_setting?.preferences),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <Text className="single_line_name">{value?.parent_account_name}</Text>
          {ShowActioncolumn("parent_account_name", listing?.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Currency",
      id: "currency",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "currency",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("currency", listing?.table_setting?.preferences),
      default: defaultStatus("currency", listing?.table_setting?.preferences),
      is_lockable: LockAble("currency", listing?.table_setting?.preferences),
      sort_order: sort_order("currency", listing?.table_setting?.preferences),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <Text>{value?.account_currency?.currency_code}</Text>
          {ShowActioncolumn("currency", listing?.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Balance",
      id: "balance",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100" style={{ justifyContent: "right" }}>
          <Typography>
            <TooltipX title={value?.account_currency?.name}>
              <Text code>{value?.account_currency?.symbol}</Text>
            </TooltipX>
            {`${value?.account_current_balance.toFixed(2) || 0.0}`}
          </Typography>
          {ShowActioncolumn("balance", listing?.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      width: showDetail
        ? 0
        : ReturnWidth(
            "balance",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("balance", listing?.table_setting?.preferences),
      default: defaultStatus("balance", listing?.table_setting?.preferences),
      is_lockable: LockAble("balance", listing?.table_setting?.preferences),
      sort_order: sort_order("balance", listing?.table_setting?.preferences),
    },
    {
      Header: "Bank account number",
      id: "bank_account_no",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <div className="single_line_name">{value?.bank_account_no} </div>
          {ShowActioncolumn("bank_account_no", listing?.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      minWidth: 215,
      width: showDetail
        ? 0
        : ReturnWidth(
            "bank_account_no",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("bank_account_no", listing?.table_setting?.preferences),
      default: defaultStatus("bank_account_no", listing?.table_setting?.preferences),
      is_lockable: LockAble("bank_account_no", listing?.table_setting?.preferences),
      sort_order: sort_order("bank_account_no", listing?.table_setting?.preferences),
    },
    {
      Header: "Default tax",
      id: "tax_name",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <Typography>{value?.account_tax?.name}</Typography>
          {ShowActioncolumn("tax_name", listing?.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      width: showDetail
        ? 0
        : ReturnWidth(
            "tax_name",
            listing?.table_setting?.preferences,
            listing?.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("tax_name", listing?.table_setting?.preferences),
      default: defaultStatus("tax_name", listing?.table_setting?.preferences),
      is_lockable: LockAble("tax_name", listing?.table_setting?.preferences),
      sort_order: sort_order("tax_name", listing?.table_setting?.preferences),
    },
  ];
};

export const itemActions = (handleBulkActions) => {
  return [
    // {
    //   key: "1",
    //   label: "Make Active",
    //   onClick: () => handleBulkActions("active"),
    // },
    // {
    //   key: "2",
    //   label: "Make Inactive",
    //   onClick: () => handleBulkActions("inactive"),
    // },
    {
      key: "3",
      label: (
        <Popconfirm
          showCancel
          key="confirm"
          okText={"Yes"}
          cancelText="No"
          placement="right"
          overlayClassName="w-200"
          onCancel={(e) => e?.stopPropagation()}
          getPopupContainer={() => document.body}
          title={`Are you sure you want to delete selected account?`}
          onConfirm={(e) => {
            e?.stopPropagation();
            handleBulkActions("delete");
          }}
        >
          <label style={{ display: "block", width: "100%" }} onClick={(e) => e?.stopPropagation()}>
            Delete
          </label>
        </Popconfirm>
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
            options={[]}
            size="middle"
            allowClear={false}
            name="sort_column"
            placeholder="Sort by column"
            popupClassName="overlap py-10"
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
            className="btn-primary w-96px h-36px"
            disabled={pagination.sort === sort && pagination.sort_column === sort_column}
          />
        </div>
      </Form>
    </div>
  );
};
