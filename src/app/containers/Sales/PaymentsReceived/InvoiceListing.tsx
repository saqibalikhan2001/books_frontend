/** @format */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Input, Table, Button, Tag, Popover, Statistic, TableProps, Form } from "antd";
import { endpoints, Content } from "static";
import { InvoiceListingProps } from "./Types";
import { TooltipX } from "app/shared/ToolTip";
import { useAxios, useStore } from "app/Hooks";
import { InvoiceByDate } from "./InvoiceByDate";
import { InvoiceDetailModal } from "../Invoices/InvoiceDetailModal";
import { capitalize, debounce, getFullDate, getOrganizationDate } from "utils";
import { Spinner } from "app/shared";

const filterObj = {
  showBtn: false,
  status: null,
  end_date: null,
  start_date: null,
  invoice_no: null,
};

export const InvoiceListing = ({
  loading,
  customer,
  currency,
  setListing,
  invoiceData,
  listing = [],
  handlePayment,
  handlePayInFull,
  hasModulePermission,
}: InvoiceListingProps) => {
  const [form] = Form.useForm();
  const { org_date_format } = useStore();
  const [isDate, setIsDate] = useState(false);
  const { callAxios, toggle, bool } = useAxios();
  const [inputValue, setInputValue] = useState("");
  const [fiters, setFilters] = useState<any>(filterObj);
  const [invoiceDetail, setInvoiceDetail] = useState<any>();
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [filter, setFilter] = useState<any>({
    sortOrder: "descend",
    columnType: "invoice_no",
  });
  const PrevInvoice = invoiceData.filter((item: { payment: number }) => {
    return item.payment;
  });
  const handleDateFilter = () => setIsDate(!isDate);
  const toggleInvoiceModal = (status) => setIsInvoiceModalOpen(status);
  function removeDuplicateObjects(array) {
    return array.filter((item, index, self) => {
      return (
        index === self.findIndex((obj) => obj.id === item.id && obj.invoice_no === item.invoice_no)
      );
    });
  }
  const removeEmojis = (input) => {
    return input.replace(/[^\x00-\x7F]/g, "");
  };

  useEffect(() => {
    setInputValue("");
  }, [customer]);
  const searchData = useCallback(
    debounce((value) => {
      toggle();
      setFilters({
        ...fiters,
        invoice_no: value.length ? value.toUpperCase() : "",
      });

      callAxios({
        url: `${
          endpoints.ADVANCE_PAYMENT
        }/search?customer_id=${customer}&start=&end=&invoice_no=${value.toUpperCase()}`,
      }).then((res) => {
        setListing(removeDuplicateObjects([...PrevInvoice, ...res]));
      });
    }, 500),
    [customer] // Add necessary dependencies
  );

  useEffect(() => {
    //@ts-ignore
    searchData(inputValue);
  }, [inputValue, searchData]);

  const handleChange = (e) => {
    const value = removeEmojis(e.target.value);
    setInputValue(value);
  };

  const handleInvoice = (data) => {
    if (hasModulePermission) {
      toggleInvoiceModal(true);
      setInvoiceDetail(data);
    }
  };
  const onSubmit = (value) => {
    toggle();
    callAxios({
      url: `${endpoints.ADVANCE_PAYMENT}/search?customer_id=${customer}&status=${
        value.status ?? "all"
      }&start=${value?.custom_ranges ? getFullDate(value.custom_ranges[0]) : ""}&end=${
        value?.custom_ranges ? getFullDate(value.custom_ranges[1]) : ""
      }&invoice_no=${fiters.invoice_no ? fiters.invoice_no : ""}`,
    }).then((res) => {
      if (res) {
        setListing(removeDuplicateObjects([...PrevInvoice, ...res]));
        setFilters({
          ...fiters,
          showBtn: true,
          status: value.status,
          start_date: value.custom_ranges ? (getFullDate(value.custom_ranges[0]) as any) : "",
          end_date: value.custom_ranges ? (getFullDate(value.custom_ranges[1]) as any) : "",
        });
      }
      handleDateFilter();
    });
  };
  const onClear = () => {
    setFilters(filterObj);
    toggle();
    callAxios({
      url: `${endpoints.PAYMENT_RECEIVED_CREATE}?customer_id=${customer}`,
    }).then((res) => {
      setListing(removeDuplicateObjects([...PrevInvoice, ...res.invoices]));
      // setListing();
      form.resetFields();
    });
  };

  const handleFilter: TableProps<any>["onChange"] = (_, __, sorter: any, data) => {
    toggle();
    if (sorter.column && sorter.order) {
      setFilter({
        ...filter,
        columnType: sorter.columnKey,
        sortOrder: filter.sortOrder === "ascend" ? "descend" : "ascend",
      });
      setListing(data.currentDataSource);
      toggle();
    }
  };
  const Title = ({ type, title }) => {
    return (
      <div className="d-flex">
        {title}
        {filter.columnType === type && (
          <TooltipX title={`Sort by ${filter.sortOrder === "ascend" ? "ascending" : "descending"}`}>
            {filter.sortOrder === "ascend" ? ascendingIcon : descendingIcon}
          </TooltipX>
        )}
      </div>
    );
  };

  const memoColumns: any = useMemo(
    () => [
      {
        title: () => <Title type="invoice_no" title="Transaction no." />,
        width: 100,
        dataIndex: "",
        ellipsis: true,
        key: "invoice_no",
        showSorterTooltip: false,
        defaultSortOrder: "ascend",
        sortDirections: ["ascend", "descend", "ascend"],
        sorter: (a, b) => a.invoice_no.localeCompare(b.invoice_no),
        render: (invoice) =>
          invoice?.invoice_no && (
            <TooltipX
              title={
                hasModulePermission
                  ? `${invoice?.invoice_no}`
                  : "Enable module permission for invoice to see details"
              }
            >
              <span
                className="payment_transaction_num"
                style={{ cursor: !hasModulePermission ? "not-allowed" : "pointer" }}
                onClick={() => handleInvoice(invoice)}
              >
                {invoice?.invoice_no}
              </span>
            </TooltipX>
          ),
      },
      {
        title: () => <Title type="due_date" title="Due date" />,
        width: 120,
        ellipsis: true,
        key: "due_date",
        dataIndex: "due_date",
        showSorterTooltip: false,
        defaultSortOrder: "ascend",
        sortDirections: ["ascend", "descend", "ascend"],
        sorter: (a, b) => a.due_date.localeCompare(b.due_date),
        render: (date: string) => date && getOrganizationDate(date, org_date_format),
      },
      {
        title: () => <Title type="status" title="Status" />,
        dataIndex: "",
        key: "status",
        ellipsis: true,
        width: 100,
        showSorterTooltip: false,
        sortDirections: ["ascend", "descend", "ascend"],
        sorter: (a, b) => a.original_status.localeCompare(b.original_status),
        render: (value: any) => (
          <>
            <div className="status">
              {value.status === value.original_status ? (
                <Tag className={`status_value ${value.status}`}>{capitalize(value.status)}</Tag>
              ) : (
                <>
                  <Tag className={`status_value ${value.original_status}`}>
                    {capitalize(value.original_status)}
                  </Tag>
                  <Tag className={`status_value status_custom_style ${value.status}`}>
                    {capitalize(value.status)}
                  </Tag>
                </>
              )}
            </div>
          </>
        ),
      },
      {
        title: () => <Title type="orignal_amount" title="Original amount" />,
        width: 100,
        ellipsis: true,
        dataIndex: "",
        key: "orignal_amount",
        showSorterTooltip: false,
        sorter: (a, b) => a.total - b.total,
        sortDirections: ["ascend", "descend", "ascend"],
        render: (value: any) =>
          value?.total && (
            <Statistic
              precision={2}
              value={value?.total}
              prefix={currency}
              className="no-space"
              valueStyle={{ fontSize: "14px" }}
            />
          ),
      },
      {
        title: () => <Title type="payment_due" title="Open balance" />,
        width: 100,
        ellipsis: true,
        key: "payment_due",
        dataIndex: "payment_due",
        showSorterTooltip: false,
        defaultSortOrder: "ascend",
        sortDirections: ["ascend", "descend", "ascend"],
        sorter: (a, b) => a.payment_due - b.payment_due,
        render: (value: string) =>
          value && (
            <Statistic
              precision={2}
              value={value}
              prefix={currency}
              className="no-space"
              valueStyle={{ fontSize: "14px" }}
            />
          ),
      },
      {
        title: "Payment",
        dataIndex: "payment",
        ellipsis: false,
        width: 180,
        render: (payment: any, row: any, index) => {
          return (
            <div className="flex_root perfect--alignments">
              <Input
                type="number"
                name="payment"
                value={parseFloat(payment) || "0"}
                id={`payment${index}`}
                placeholder={`${currency}0`}
                onChange={(e) => {
                  handlePayment(e, row);
                }}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (
                    e.key === "ArrowDown" ||
                    (e.key === "ArrowUp" && index === 0) ||
                    e.keyCode === 69
                  ) {
                    e.preventDefault();
                  }
                  let element;
                  if (e.key === "ArrowDown" && index + 1 < listing.length - 1) {
                    e.preventDefault();
                    element = document.getElementById(`payment${String(index + 1)}`);
                  } else if (e.key === "ArrowUp" && index - 1 >= 0) {
                    e.preventDefault();
                    element = document.getElementById(`payment${String(index - 1)}`);
                  }
                  setTimeout(() => {
                    element?.select();
                    element?.scrollIntoView({ block: "nearest", inline: "nearest" });
                  }, 100);
                }}
              />
              <Button
                type="link"
                className={payment ? "payment" : ""}
                onClick={(e) => handlePayInFull(e, row)}
              >
                <span>Pay in Full</span>
              </Button>
            </div>
          );
        },
      },
    ],
    [handlePayment, handlePayInFull, filter]
  );
  return (
    <>
      <div className="flexbox form-row-container justify-content-between">
        <div className="form_group flex-47 invoice_item_search_box ">
          <Input
            className="search_box_input search_box invoice_list_search value_clr"
            name="search"
            allowClear
            value={inputValue}
            suffix={
              <img
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/search.svg`}
                alt="search icon"
              />
            }
            placeholder="Filter by invoice number"
            onChange={handleChange}
            onInput={(e) => {
              //@ts-ignore
              e.target.value = removeEmojis(e.target.value);
            }}
          />
        </div>
        <div className="form_group flex-47 invoice_item_clear_filter ">
          <TooltipX
            title={Content.paymentFilterPop}
            overlayStyle={{ minWidth: "445px" }}
            placement="right"
          >
            <img
              className="ml-20 mr-20 hover-effect"
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/tooltip.svg`}
              alt="tooltip Icon"
            />
          </TooltipX>
          <div
            className={`invoice_filter_popup ${
              fiters.start_date && fiters.end_date ? "filter_applied" : ""
            }`}
          >
            <TooltipX title="Filter" placement="right">
              <Popover
                title=""
                open={isDate}
                trigger="click"
                content={<InvoiceByDate onSubmit={onSubmit} form={form} />}
                onOpenChange={handleDateFilter}
                overlayClassName="custom-dropdown width_px payment_calendar"
              >
                <img
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/filters.svg`}
                  alt="filter icon"
                  className="popup-over hover-effect "
                />
              </Popover>
            </TooltipX>
          </div>
          <div className="filter_date">
            <span>
              {fiters.start_date
                ? `${getOrganizationDate(fiters.start_date, org_date_format)}-`
                : ""}
            </span>
            <span>
              {fiters.end_date ? `${getOrganizationDate(fiters.end_date, org_date_format)},` : ""}
              &nbsp;
            </span>
            <span>
              {fiters.status === "overdue"
                ? "Overdue"
                : fiters.status === "partially paid"
                ? "PRTL Paid"
                : fiters.status === "sent"
                ? "Sent"
                : fiters.status === "all"
                ? "All"
                : ""}
            </span>
          </div>

          {fiters.showBtn && (
            <Button className="p-0" type="link" onClick={onClear}>
              Clear filters
            </Button>
          )}
        </div>
      </div>
      <div className="table_outer_container">
        {bool || loading ? (
          <div className="d-flex justify-center align-center" style={{ minHeight: "205px" }}>
            <Spinner />
          </div>
        ) : (
          <Table
            rowKey="id"
            pagination={false}
            onChange={handleFilter}
            dataSource={listing}
            columns={memoColumns}
            className="generic-table bulk_items_col_two payment_invoice_table no-radius"
          />
        )}
      </div>
      <InvoiceDetailModal
        isModal
        bool={isInvoiceModalOpen}
        toggle={toggleInvoiceModal}
        detail={invoiceDetail}
      />
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
// useEffect(() => {
//   callAxios({
//     url: `${endpoints.PAYMENT_RECEIVED_CREATE}?sort_by=${filter.columnType}&order_by=${
//       filter.sortOrder === "ascend" ? "asc" : "desc"
//     }&customer_id=${customer}`,
//   }).then((res) => {
//     setListing(removeDuplicateObjects([...PrevInvoice, ...res.invoices]));
//   });
// }, [filter]);
