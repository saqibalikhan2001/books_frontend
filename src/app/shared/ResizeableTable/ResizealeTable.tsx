/** @format */
import { useState, useEffect, useCallback, useMemo, Fragment } from "react";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useColumnOrder,
  useBlockLayout,
  useResizeColumns,
} from "react-table";
import { useAxios } from "app/Hooks";
import {
  debounce,
  LockColumns,
  hideColumns,
  sortColumnArray,
  handleColumnWidth,
} from "../../../utils";
import { isEqual } from "lodash";
import { TooltipX } from "../ToolTip";
import { TableModalForResizing } from "app/containers/Items/DetailPlusListingHeader";

const ResizeableTable = (props) => {
  const { callAxios, toggle } = useAxios();
  const {
    data = [],
    check,
    refetch,
    colsHeader,
    table_slug,
    pagination,
    preferences,
    tableSetting,
    setcolsheader,
    sidebarPosition,
    handleViewClick,
    setColumnHideRef,
    setColumnOrderRef,
    setSelectedProducts,
    setparam = () => null,
    colsHeaderForlockedCols,
    paymentReceive = false,
    defaultUnFreezTableWidth,
    handleTableFilterslockedcols,
    setcustomLoading = () => null,
  } = props;

  const params = JSON.parse(sessionStorage.getItem("params") as any);
  const columns = useMemo(
    () => props.columns,
    //eslint-disable-next-line
    [colsHeaderForlockedCols]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suitAbleWidth, setSuitableWidth] = useState();

  const {
    rows,
    state,
    prepareRow,
    allColumns,
    headerGroups,
    getTableProps,
    setColumnOrder,
    setHiddenColumns,
    selectedFlatRows,
    getTableBodyProps,
  } = useTable(
    {
      columns,
      data: data || [],
      manualSortBy: true,
      defaultColumn: defaultUnFreezTableWidth,
      initialState: {
        hiddenColumns: hideColumns(preferences),
        columnOrder: sortColumnArray(preferences),
      },
    },
    useSortBy,
    useRowSelect,
    useColumnOrder,
    useBlockLayout,
    useResizeColumns
  );

  useEffect(() => {
    setColumnOrderRef(() => setColumnOrder);
    setColumnHideRef(() => setHiddenColumns);
    //eslint-disable-next-line
  }, []);

  const {
    columnResizing: { columnWidths, isResizingColumn },
    selectedRowIds,
  } = state;

  useEffect(() => {
    const record = selectedFlatRows.map((d) => d.original);
    setSelectedProducts(record);
    //eslint-disable-next-line
  }, [selectedRowIds]);

  useEffect(() => {
    setColumnOrder(sortColumnArray(preferences));
    //eslint-disable-next-line
  }, [preferences]);

  const allcol = allColumns.map((all) => all.Header);
  const allhead = colsHeader.map((all) => all.Header);
  const checkEquality = Boolean(isEqual(allcol, allhead));
  useEffect(() => {
    if (!checkEquality) {
      setcolsheader(allColumns);
    }
    //eslint-disable-next-line
  }, [check]);

  //eslint-disable-next-line
  const handleresizng = useCallback(
    debounce((payload) => {
      toggle();
      callAxios({
        method: "post",
        url: `/table-setting`,
        data: payload,
      });
    }, 400),
    []
  );
  useEffect(() => {
    handleColumnWidth(
      columnWidths,
      isResizingColumn,
      preferences,
      handleresizng,
      table_slug,
      tableSetting,
      sidebarPosition
    );
    //eslint-disable-next-line
  }, [columnWidths]);

  const handleSort = (id) => {
    setparam({
      ...pagination,
      page: 1,
      sort: params.sort === "asc" ? "desc" : "asc",
      sort_column: id,
    });
  };

  const handleSubmitSuitableWidth = () => {
    //@ts-ignore
    const { data } = suitAbleWidth;
    let payload = {
      slug: table_slug,
      freez_table_width_px: tableSetting?.freez_table_width_px,
      preferences: data,
    };
    callAxios({
      method: "post",
      url: `/locked-columns`,
      data: payload,
    }).then(() => refetch());
  };

  return (
    <Fragment>
      <table {...getTableProps()} id="resizeabletable">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th
                  {...column.getHeaderProps({
                    title: column?.tooltip_text,
                    // params && params?.sort && params.sort_column === column.id
                    //   ? `Sort by ${params.sort}`
                    //   : "toggle sortby",
                  })}
                  className={`th ${column.isResizing ? "--resizing" : ""} 
                ${
                  params &&
                  params.sort &&
                  params.sort_column === column.id &&
                  (params.sort === "asc" || params.sort === "desc")
                    ? "bg-color "
                    : ""
                }
                  ${
                    column.Header === "Sales Price" || column.Header === "Cost" ? "right-align" : ""
                  }
                ${
                  column.Header === "Quantity on hand" || column.Header === "Reorder level"
                    ? "justify-center"
                    : ""
                }
                ${column.Header === "Amount" ? "flex-end" : ""}
                ${column.Header === "Balance" ? "flex-end" : ""}
                ${column.Header === "Credit" ? "flex-end" : ""}
                ${column.Header === "Customer" || "Payment No" ? "justify_between" : ""}
                `}
                >
                  <span
                    // {...column.getSortByToggleProps({
                    //   title:
                    //     params && params?.sort && params.sort_column === column.id
                    //       ? `Sort by ${params.sort}`
                    //       : "toggle sortBy",
                    // })}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSort(column?.id);
                    }}
                  >
                    {column.render("Header")}
                    <span>
                      {params && params?.sort && params.sort_column === column.id ? (
                        params?.sort === "asc" ? (
                          <TooltipX title="Sort by ascending" placement="bottom">
                            <span className="white-circle">
                              <img
                                src={`${
                                  import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                }/static/media/sort-ascending.svg`}
                                alt="ascending order"
                                className="ascending order"
                              />
                            </span>
                          </TooltipX>
                        ) : (
                          <TooltipX title="Sort by descending" placement="bottom">
                            <span className="white-circle">
                              <img
                                src={`${
                                  import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                }/static/media/sort-descending.svg`}
                                alt="descending order"
                                className="ascending order"
                              />
                            </span>
                          </TooltipX>
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </span>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    {...column.getResizerProps({ style: { userSelect: "none" } })}
                    className={`${
                      column.resizable === undefined ? "resizer isResizing" : "no-resize"
                    }`}
                  />
                  {column.is_lockable && (
                    <span
                      title=""
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setcustomLoading(true);
                        LockColumns(
                          column.id,
                          preferences,
                          colsHeader,
                          setcolsheader,
                          callAxios,
                          refetch,
                          handleTableFilterslockedcols,
                          colsHeaderForlockedCols,
                          setColumnOrder,
                          table_slug,
                          toggle,
                          setcustomLoading,
                          setIsModalOpen,
                          setSuitableWidth
                        );
                      }}
                    >
                      <img
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/Unlock-new.svg`}
                        style={{ marginLeft: "10px" }}
                        className="unlock"
                      />
                    </span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            //@ts-ignore
            rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  className={`${
                    !Boolean(row?.original.is_active) && table_slug === "item" ? "inactive_row" : ""
                  } `}
                  {...row.getRowProps()}
                  // onMouseEnter={() => props.onRowHover(i)}
                  // onMouseLeave={() => props.onRowHover(null)}
                  onClick={() => handleViewClick(row?.original, props.data, paymentReceive)}
                  style={{
                    backgroundColor:
                      table_slug !== "item" && table_slug !== "accounts"
                        ? 1
                        : Boolean(row?.original.is_active)
                        ? 1
                        : "#F6F6F6",
                  }}
                >
                  {row.cells.map(
                    (cell) =>
                      cell.column.locked === false && (
                        <td
                          {...cell.getCellProps()}
                          valign="middle"
                          className={`${
                            cell.column.Header === "Sales Price" || cell.column.Header === "Cost"
                              ? "right-align"
                              : ""
                          }
                        ${
                          cell.column.Header === "Quantity on hand" ||
                          cell.column.Header === "Reorder level"
                            ? "justify-center quantity_on_hand"
                            : ""
                        }
                        ${cell.column.Header === "Amount" ? "flex-end pr-10" : ""}
                        ${cell.column.Header === "Balance" ? "flex-end pr-10" : ""}
                        ${cell.column.Header === "Credit" ? "flex-end pr-10" : ""}
                        
                        `}
                        >
                          {cell.render("Cell")}
                        </td>
                      )
                  )}
                </tr>
              );
            })
          }
        </tbody>
      </table>
      <TableModalForResizing
        //@ts-ignore
        content={suitAbleWidth?.message}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSubmitSuitableWidth={handleSubmitSuitableWidth}
      />
    </Fragment>
  );
};

export default ResizeableTable;
