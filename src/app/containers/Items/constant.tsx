/**@format */

import { useState } from "react";
import { Form, Image, Popconfirm, Radio, Typography } from "antd";
import { TooltipX } from "app/shared/ToolTip";
import {
  LockAble,
  ImagePath,
  sort_order,
  ReturnWidth,
  defaultStatus,
  ShowActioncolumn,
  CheckLocakedStatus,
} from "utils";
import { DataSourceProps } from "./Types";
import { filterSort } from "./filterOptions";
import { usePermissions, useStore } from "app/Hooks";
import { ActionMenu, Buttonx, Selectx } from "app/shared";

const { Text } = Typography;

export const Columns = (
  showDetail,
  productStatus,
  listing,
  handleClone,
  handleStatus,
  handleClick,
  handleConfirm,
  base_currency
) => {
  const { created_by_platform } = useStore();
  const { checkPermission } = usePermissions();
  const { has_ItemEdit_permission } = checkPermission("ItemEdit");
  const { has_ItemDelete_permission } = checkPermission("ItemDelete");
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  const ActionMenuColumn = ({ value }) => {
    return (
      <ActionMenu
        product
        showEdit
        data={value}
        handleClone={handleClone}
        handleClick={handleClick}
        handleStatus={handleStatus}
        handleConfirm={handleConfirm}
        active={Boolean(value?.is_active)}
        status={
          (imsEdit === "false" ? value.platform_type === "books" : true) && has_ItemEdit_permission
        }
        canEdit={imsEdit === "false" ? value.platform_type === "books" : true}
        deletePermission={
          (imsEdit === "false" ? value.platform_type === "books" : true)
            ? has_ItemDelete_permission
            : false
        }
        title={
          (imsEdit === "false" ? value.platform_type === "books" : true) &&
          has_ItemDelete_permission
            ? `Delete "${value.name}" Product ?`
            : "Permission Denied"
        }
      />
    );
  };
  return [
    {
      Header: "Product name",
      id: "name",
      accessor: (row) => row,
      Cell: ({ value }: { value: DataSourceProps }) => (
        <div className="action-preference w-100">
          <div className={`product_info ${showDetail ? "image_align" : ""}`}>
            <Image
              preview={false}
              src={
                value?.images.length
                  ? ImagePath(value?.images[0], created_by_platform)
                  : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                      import.meta.env.VITE_ITEM_PLACEHOLDER_SMALL_IMAGE
                    }`
              }
            />
            <div className={`product-title ${showDetail && "item-detail-alignment"}`}>
              <div className={`d-flex justify_between align-center  ${showDetail && "mb-10 "}`}>
                <Text className={`_title ${showDetail && "no-truncate"}`}>{value?.name}</Text>
                {!showDetail && ShowActioncolumn("name", listing.table_setting?.preferences) && (
                  <ActionMenuColumn value={value} />
                )}
                {showDetail && <ActionMenuColumn value={value} />}
              </div>

              {showDetail && (
                <div className="stock_info">
                  <Text className="unit_name">
                    {value.inventory_type === "inventory"
                      ? `${value?.quantity_on_hand} ${value?.unit ? value?.unit + "(s)" : ""}`
                      : "-"}
                  </Text>
                  <Text
                    className="stock-status"
                    style={{
                      color:
                        value.inventory_type === "noninventory"
                          ? "#000"
                          : productStatus(value?.reorder_level, value?.quantity_on_hand) ===
                            "outStock"
                          ? "#B2001E"
                          : productStatus(value?.reorder_level, value?.quantity_on_hand) ===
                            "In stock"
                          ? "#118E03"
                          : "#AD6200",
                    }}
                  >
                    {value.inventory_type === "noninventory"
                      ? "-"
                      : productStatus(value?.reorder_level, value?.quantity_on_hand) === "outStock"
                      ? "Out of Stock"
                      : productStatus(value?.reorder_level, value?.quantity_on_hand) === "In stock"
                      ? "In stock"
                      : "Low stock"}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      minWidth: 200,
      width: showDetail
        ? 350
        : ReturnWidth(
            "name",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("name", listing.table_setting?.preferences),
      default: defaultStatus("name", listing.table_setting?.preferences),
      sort_order: sort_order("name", listing.table_setting?.preferences),
    },
    {
      Header: "SKU",
      id: "sku",
      tooltip_text: "Stock keeping unit",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "sku",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("sku", listing.table_setting?.preferences),
      is_lockable: LockAble("sku", listing.table_setting?.preferences),
      sort_order: sort_order("sku", listing.table_setting?.preferences),
      default: defaultStatus("sku", listing.table_setting?.preferences),
      Cell: ({ value }: { value: DataSourceProps }) => (
        <div className="action-preference w-100">
          {value.sku}
          {ShowActioncolumn("sku", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Type",
      width: showDetail
        ? 0
        : ReturnWidth(
            "inventory_type",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("inventory_type", listing.table_setting?.preferences),
      is_lockable: LockAble("inventory_type", listing.table_setting?.preferences),
      default: defaultStatus("inventory_type", listing.table_setting?.preferences),
      sort_order: sort_order("inventory_type", listing.table_setting?.preferences),
      id: "inventory_type",
      accessor: (row) => row,
      Cell: ({ value }: { value: DataSourceProps }) => (
        <div className="action-preference w-100">
          <div
            className={`generic-badge ${
              value?.inventory_type === "inventory" ? "inventory-badge" : "non-inventory-badge"
            }`}
          >
            {value?.inventory_type === "inventory" ? "Inventory" : "Non Inventory"}
          </div>
          {ShowActioncolumn("inventory_type", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Category",
      id: "category",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "category",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("category", listing.table_setting?.preferences),
      default: defaultStatus("category", listing.table_setting?.preferences),
      is_lockable: LockAble("category", listing.table_setting?.preferences),
      sort_order: sort_order("category", listing.table_setting?.preferences),
      Cell: ({ value }: { value: DataSourceProps }) => (
        <div className="action-preference w-100 category--block">
          {
            //@ts-ignore
            value?.category
          }
          {ShowActioncolumn("category", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Cost",
      width: showDetail
        ? 0
        : ReturnWidth(
            "purchase_unit_price",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("purchase_unit_price", listing.table_setting?.preferences),
      is_lockable: LockAble("purchase_unit_price", listing.table_setting?.preferences),
      default: defaultStatus("purchase_unit_price", listing.table_setting?.preferences),
      sort_order: sort_order("purchase_unit_price", listing.table_setting?.preferences),
      id: "purchase_unit_price",
      accessor: (row) => row,
      Cell: ({ value }: { value: DataSourceProps }) => (
        <div className="action-preference">
          <Typography>
            <TooltipX title={base_currency?.name}>
              <Text code>{base_currency?.symbol}</Text>&nbsp;
            </TooltipX>
            {`${value?.purchase_unit_price?.toFixed(2)}`}
          </Typography>
          {ShowActioncolumn("purchase_unit_price", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "QOH",
      tooltip_text: "Quantity on hand",
      id: "quantity_on_hand",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "quantity_on_hand",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("quantity_on_hand", listing.table_setting?.preferences),
      default: defaultStatus("quantity_on_hand", listing.table_setting?.preferences),
      is_lockable: LockAble("quantity_on_hand", listing.table_setting?.preferences),
      sort_order: sort_order("quantity_on_hand", listing.table_setting?.preferences),
      Cell: ({ value }: { value: DataSourceProps }) => (
        <div className="action-preference w-100">
          {value?.quantity_on_hand}
          {ShowActioncolumn("quantity_on_hand", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Reorder",
      tooltip_text: "Reorder point",
      id: "reorder_level",
      accessor: (row) => row,
      width: showDetail
        ? 0
        : ReturnWidth(
            "reorder_level",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("reorder_level", listing.table_setting?.preferences),
      default: defaultStatus("reorder_level", listing.table_setting?.preferences),
      is_lockable: LockAble("reorder_level", listing.table_setting?.preferences),
      sort_order: sort_order("reorder_level", listing.table_setting?.preferences),
      Cell: ({ value }: { value: DataSourceProps }) => (
        <div className="action-preference w-100">
          {value?.reorder_level}
          {ShowActioncolumn("reorder_level", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Sales Price",
      id: "sales_unit_price",
      accessor: (row) => row,
      Cell: ({ value }: { value: DataSourceProps }) => (
        <div className="action-preference">
          <Typography>
            <TooltipX title={base_currency?.name}>
              <Text code>{base_currency?.symbol}</Text>&nbsp;
            </TooltipX>
            {`${value?.sales_unit_price?.toFixed(2)}`}
          </Typography>
          {ShowActioncolumn("sales_unit_price", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
      width: showDetail
        ? 0
        : ReturnWidth(
            "sales_unit_price",
            listing.table_setting?.preferences,
            listing.table_setting?.freez_table_width
          ),
      locked: CheckLocakedStatus("sales_unit_price", listing.table_setting?.preferences),
      default: defaultStatus("sales_unit_price", listing.table_setting?.preferences),
      is_lockable: LockAble("sales_unit_price", listing.table_setting?.preferences),
      sort_order: sort_order("sales_unit_price", listing.table_setting?.preferences),
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
        <div onClick={(e) => e.stopPropagation()}>
          <Popconfirm
            showCancel
            key="confirm"
            okText={"Yes"}
            cancelText="No"
            placement="right"
            overlayClassName="w-200"
            getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
            title={`Are you sure you want to delete selected product?`}
            onCancel={(e) => {
              const dropdown = document.querySelector(".uniqueDrpdownClose");
              if (dropdown) {
                //@ts-ignore
                dropdown?.click();
              }
              e?.stopPropagation();
            }}
            onConfirm={(e) => {
              e?.stopPropagation();
              handleBulkActions("delete");
            }}
          >
            <label
              style={{ display: "block", width: "100%" }}
              onClick={(e) => e?.stopPropagation()}
            >
              Delete
            </label>
          </Popconfirm>
        </div>
      ),
    },
    ...(categories?.length > 0
      ? [
          {
            key: "4",
            label: "Assign Category",
            popupOffset: [0, 0],
            popupClassName: "overflow-y-auto scroll-bar-width-auto category_list",
            children: categories.map((category) => ({
              key: `4-${category?.id}`,
              label: category?.label,
              onClick: () => handleBulkActions("category_assign", category?.id),
            })),
          },
        ]
      : []),
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
            allowClear={false}
            name="sort_column"
            options={filterSort}
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
