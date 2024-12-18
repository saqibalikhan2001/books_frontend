/** @format */

import { HTMLProps, useEffect, useRef } from "react";
import { Image, Typography } from "antd";
import { ActionMenu } from "app/shared";
import { usePermissions, useStore } from "app/Hooks";
import { defaultStatus, ImagePath, LockAble, ShowActioncolumn } from "utils";
import { TooltipX } from "app/shared/ToolTip";

// const { AiOutlineUser } = Icons;

const { Text } = Typography;
export const alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "#",
];

export const IndeterminateCheckbox = ({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
  const ref = useRef<any>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
    //eslint-disable-next-line
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer chcekbox-size"}
      {...rest}
    />
  );
};

export const Columns = (
  showDetail,
  handleStatus,
  listing,
  handleClone,
  handleClick,
  handleConfirm,
  supplier,
  ReturnWidth,
  CheckLocakedStatus,
  sendEmail
) => {
  const { created_by_platform } = useStore();
  const { checkPermission } = usePermissions();
  const { has_CustomerDelete_permission } = checkPermission("CustomerDelete");
  const { has_SupplierDelete_permission } = checkPermission("SupplierDelete");
  const { has_SupplierEdit_permission } = checkPermission("SupplierEdit");
  const { has_CustomerEdit_permission } = checkPermission("CustomerEdit");

  const has_delete_permission = supplier
    ? has_SupplierDelete_permission
    : has_CustomerDelete_permission;
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;
  const has_Edit_permission = supplier ? has_SupplierEdit_permission : has_CustomerEdit_permission;
  const ActionMenuColumn = ({ value }) => {
    return (
      <ActionMenu
        className="customers-menu"
        contact
        showEdit
        data={value}
        sendEmail={sendEmail}
        showDetail={showDetail}
        handleClone={handleClone}
        handleStatus={handleStatus}
        handleClick={handleClick}
        handleConfirm={handleConfirm}
        active={Boolean(value?.is_active)}
        status={
          (imsEdit === "false" ? value.platform_type === "books" : true) && has_Edit_permission
        }
        canEdit={imsEdit === "false" ? value.platform_type === "books" : true}
        hasTransaction={value?.has_transaction}
        deletePermission={
          (imsEdit === "false" ? value.platform_type === "books" : true)
            ? has_delete_permission
            : false
        }
        title={
          !value?.has_transaction
            ? (imsEdit === "false" ? value.platform_type === "books" : true) &&
              has_delete_permission
              ? `Are you sure you want to delete "${value.display_name}"?`
              : "Permission Denied"
            : `You cannot delete ${supplier ? "supplier" : "customer"} having transactions`
        }
      />
    );
  };
  return [
    {
      id: "selection",
      Header: (table) => (
        <>
          <IndeterminateCheckbox
            {...{
              checked: table.isAllRowsSelected,
              indeterminate: table?.isAllPageRowsSelected,
              onChange: () => table.toggleAllRowsSelected(),
            }}
          />
        </>
      ),
      Cell: ({ cell }) => (
        <>
          <IndeterminateCheckbox
            {...{
              checked: cell?.row?.isSelected,
              disabled: false,
              indeterminate: cell?.row?.isSomeSelected,
              onChange: () => cell?.row?.toggleRowSelected(),
            }}
          />
        </>
      ),
      width: showDetail ? 40 : 50,
      minWidth: showDetail ? 40 : 50,
      resizable: false,
      isResizing: false,
      disableResizing: true,
      getResizerProps: () => {},
      defaultResizeableColumn: false,
      locked: true,
      icon: false,
    },
    {
      Header: "Display/Company name",
      id: "display_name",
      accessor: (row) => row,
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <div className="product_info big_chill customer_line_clamp">
            {value?.photo ? (
              <Image preview={false} src={ImagePath(value?.photo, created_by_platform)} />
            ) : (
              <div className="default_icon big_chill">
                <span className="user_icon">
                  <img
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                      import.meta.env.VITE_CUSTOMER_PLACEHOLDER_SMALL_IMAGE
                    }`}
                  />
                </span>
              </div>
            )}
            <div className="d-flex justify_between flex-1">
              <div className="product-title">
                <Text className={`${!showDetail ? "customer_name" : "_title line-clamp-one"}`}>
                  {value?.display_name}
                </Text>
                {!showDetail && <Text className="single_line_name">{value?.company_name}</Text>}
                {showDetail && (
                  <div className="stock_info">
                    <Text>{`${listing?.base_currency?.symbol} ${
                      supplier ? value?.payable.toFixed(2) : value?.receivable.toFixed(2)
                    } `}</Text>
                  </div>
                )}
              </div>
              {showDetail && <ActionMenuColumn value={value} />}
            </div>
            {!showDetail && (
              <>
                <div className="dasfafd">
                  {ShowActioncolumn("display_name", listing.table_setting?.preferences) && (
                    <ActionMenuColumn value={value} />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ),
      minWidth: 250,
      width: showDetail ? 332 : ReturnWidth("display_name"),
      locked: CheckLocakedStatus("display_name", listing.table_setting?.preferences),
      default: defaultStatus("display_name", listing.table_setting?.preferences),
    },
    {
      Header: "Phone",
      id: "work_phone",
      accessor: (row) => row,
      disableSortBy: true,
      disabledSort: true,
      // minWidth: showDetail ? 0 : 150,
      width: showDetail ? 0 : ReturnWidth("work_phone"),
      locked: CheckLocakedStatus("work_phone"),
      default: defaultStatus("work_phone", listing.table_setting?.preferences),
      is_lockable: LockAble("work_phone", listing.table_setting?.preferences),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          {value.work_phone}
          {ShowActioncolumn("work_phone", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Email",
      id: "email",
      disableSortBy: true,
      disabledSort: true,
      accessor: (row) => row,
      minWidth: showDetail ? 0 : 150,
      width: showDetail ? 0 : ReturnWidth("email"),
      locked: CheckLocakedStatus("email"),
      default: defaultStatus("email", listing.table_setting?.preferences),
      is_lockable: LockAble("email", listing.table_setting?.preferences),
      Cell: ({ value }: { value: any }) => (
        <div className="action-preference w-100">
          <span className="text_truncate line-clamp-2">{value.email}</span>
          {ShowActioncolumn("email", listing.table_setting?.preferences) && (
            <ActionMenuColumn value={value} />
          )}
        </div>
      ),
    },
    {
      Header: "Current Balance",
      id: supplier ? "payable" : "receivable",
      align: "right",
      accessor: (row) => row,
      disableSortBy: true,
      disabledSort: true,
      // minWidth: showDetail ? 0 : 150,
      width: showDetail
        ? 0
        : ReturnWidth(`${supplier ? "payable" : "receivable"}`)
        ? ReturnWidth(`${supplier ? "payable" : "receivable"}`)
        : 10,
      locked: CheckLocakedStatus(`${supplier ? "payable" : "receivable"}`),
      default: defaultStatus(
        `${supplier ? "payable" : "receivable"}`,
        listing.table_setting?.preferences
      ),
      is_lockable: LockAble(
        `${supplier ? "payable" : "receivable"}`,
        listing.table_setting?.preferences
      ),
      Cell: ({ cell: { value } }: { cell: { value: any } }) => (
        <div className="text-right w-100 pr-10">
          <Typography>
            <TooltipX title={listing?.base_currency?.name}>
              <Text code>{listing?.base_currency?.symbol}</Text>&nbsp;
            </TooltipX>
            {`${supplier ? value?.payable?.toFixed(2) : value?.receivable?.toFixed(2)}`}
            {/* {`${value.toFixed(2)}`} */}
          </Typography>
          {ShowActioncolumn(
            `${supplier ? "payable" : "receivable"}`,
            listing.table_setting?.preferences
          ) && <ActionMenuColumn value={value} />}
        </div>
      ),
    },
  ];
};
