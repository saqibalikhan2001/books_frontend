/** @format */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Popover } from "antd";
import { isEqual } from "lodash";
import { useAxios } from "app/Hooks";
import { Buttonx, Icons, Spinner } from "app/shared";
import { BsArrowDownCircle, BsArrowUpCircle } from "app/shared/Icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// import { useNavigate } from "react-router";
import {
  useBlockLayout,
  useColumnOrder,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import {
  GetDateString,
  LockColumns,
  ReturnWidth,
  debounce,
  handleColumnWidth,
  handleResetColsFilter,
  handleSelectColumn,
  handleSubmitFilters,
  hideColumns,
  sortColumnArray,
} from "utils";
import { TooltipX } from "./ToolTip";
import "./customtable.scss";

const { CiLock, CiUnlock, TfiDownload, MdDragIndicator } = Icons;

export const FixedTable = (props) => {
  const { callAxios, toggle } = useAxios();
  const {
    data,
    total,
    loader,
    refetch,
    setparam,
    colsHeader,
    table_slug,
    pagination,
    showDetail,
    preferences,
    tableSetting,
    setcolsheader,
    handleViewClick,
    defaultFreezTableWidth,
    colsHeaderForlockedCols,
    handleTableFilterslockedcols,
  } = props;

  const columns = useMemo(() => props.columns, [preferences, colsHeaderForlockedCols]);
  const obj = JSON.parse(localStorage.getItem("obj") as any);
  const params = JSON.parse(sessionStorage.getItem("params") as any);

  const {
    rows,
    state,
    allColumns,
    prepareRow,
    headerGroups,
    getTableProps,
    selectedFlatRows,
    getTableBodyProps,
    setColumnOrder,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: defaultFreezTableWidth,
      manualSortBy: true,
    },
    useSortBy,
    useBlockLayout,
    useResizeColumns,
    useRowSelect,
    useColumnOrder,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <Checkbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                {
                  //@ts-ignore
                  ...row.getToggleRowSelectedProps()
                }
              />
            </div>
          ),
          width: ReturnWidth("selection", preferences) ?? 60,
          minWidth: 50,
          resizable: false,
          isResizing: false,
          disableResizing: true,
          getResizerProps: () => {},
          defaultResizeableColumn: false,
          locked: true,
          icon: false,
        },
        ...columns,
      ]);
    }
  );

  const {
    columnResizing: { columnWidths, isResizingColumn },
    selectedRowIds,
  } = state;
  useEffect(() => {
    const { setSelectedProducts } = props;
    const record = selectedFlatRows.map((d) => d.original);
    setSelectedProducts(record);
    //eslint-disable-next-line
  }, [selectedRowIds]);

  useEffect(() => {
    handleTableFilterslockedcols(allColumns);
  }, [preferences]);

  const handleresizng = useCallback(
    debounce((payload) => {
      toggle();
      callAxios({
        method: "post",
        url: `/table-setting`,
        data: payload,
      });
      // .then((res) => {
      //   if (res) {
      //   }
      // });
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
      tableSetting
    );
  }, [columnWidths]);

  const handleSort = (id) => {
    setparam({
      ...pagination,
      page: 1,
      sort: params.sort === "asc" ? "desc" : "asc",
      pageSize: 30,
      sort_column: id,
    });
  };

  return (
    <>
      <table {...getTableProps()} className={showDetail ? "hide_shadow" : ""}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {!showDetail &&
                headerGroup.headers.map(
                  (column: any) =>
                    column.locked && (
                      <th {...column.getHeaderProps()}>
                        <span
                          {...column.getSortByToggleProps()}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (column.id !== "selection" && column.id !== "action") {
                              handleSort(column?.id);
                            }
                          }}
                        >
                          {column.render("Header")}
                          <span className="ml-10">
                            {params && params?.sort && params.sort_column === column.id ? (
                              params?.sort === "asc" ? (
                                <BsArrowUpCircle size={15} />
                              ) : (
                                <BsArrowDownCircle size={15} />
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
                        {column.id === "selection" || column.id === "action" ? (
                          ""
                        ) : (
                          <span
                            style={{
                              cursor: column.default ? "not-allowed" : "pointer",
                            }}
                            onClick={() =>
                              column.default
                                ? null
                                : LockColumns(
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
                                    toggle
                                  )
                            }
                          >
                            <CiLock size={20} className="lock" />
                          </span>
                        )}
                      </th>
                    )
                )}
              {showDetail &&
                headerGroup.headers.slice(0, 3).map(
                  (column: any) =>
                    column.locked && (
                      <th {...column.getHeaderProps()}>
                        <span>
                          {column.render("Header")}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            {...column.getResizerProps({ style: { userSelect: "none" } })}
                          />
                        </span>
                      </th>
                    )
                )}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onMouseEnter={() => props.onRowHover(i)}
                onMouseLeave={() => props.onRowHover(null)}
                onClick={() => handleViewClick(row?.original, data)}
                style={{ opacity: Boolean(row?.original.is_active) ? 1 : 0.5 }}
                className={row?.original.id === obj?.curr_id && showDetail ? "active_row" : ""}
              >
                {!showDetail &&
                  row.cells.map(
                    (cell) =>
                      cell.column.locked === true && (
                        <td
                          {...cell.getCellProps()}
                          className={cell.column.id === "action" ? "action-cell" : ""}
                        >
                          {cell.render("Cell")}
                        </td>
                      )
                  )}
                {showDetail &&
                  row.cells
                    .slice(0, 3)
                    .map(
                      (cell) =>
                        cell.column.locked === true && (
                          <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                        )
                    )}
              </tr>
            );
          })}
        </tbody>
        {showDetail && (
          <>
            {loader && <Spinner size={"small"} />}
            <tfoot className="listing-count">
              <tr>
                <td className="w-100">
                  <div className="listing-count-inner">Total Contacts : {total}</div>
                </td>
              </tr>
            </tfoot>
          </>
        )}
      </table>
    </>
  );
};

export const ReactTable = (props) => {
  // const navigate = useNavigate();
  const { callAxios, toggle, bool } = useAxios();
  const {
    url,
    data,
    check,
    refetch,
    pagination,
    colsHeader,
    table_slug,
    preferences,
    tableSetting,
    handleSetCheck,
    handleViewClick,
    freezeTableWidth,
    setparam = () => null,
    colsHeaderForlockedCols,
    defaultUnFreezTableWidth,
    column_reset_button = false,
    handleTableFilterslockedcols,
  } = props;

  const columns = useMemo(() => props.columns, [colsHeaderForlockedCols]);

  const { setcolsheader } = props;
  const [h_cols_name, setcolname] = useState([]);
  const [reorderCols, setReorderCols] = useState([]);

  const params = JSON.parse(sessionStorage.getItem("params") as any);

  useEffect(() => {
    const h_cols = props.preferences.map((val) => {
      if (val.show_status === false) return val.slug;
    });
    const data = h_cols?.filter((item) => !!item);
    setcolname(data);
    //eslint-disable-next-line
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    state,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    setColumnOrder,
    selectedFlatRows,
    setHiddenColumns,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: defaultUnFreezTableWidth,
      manualSortBy: true,
      initialState: {
        hiddenColumns: hideColumns(preferences),
        columnOrder: sortColumnArray(preferences),
      },
    },
    useSortBy,
    useBlockLayout,
    useResizeColumns,
    useRowSelect,
    useColumnOrder
  );

  const {
    columnResizing: { columnWidths, isResizingColumn },
    selectedRowIds,
    //@ts-ignore
    hiddenColumns,
  } = state;

  //@ts-ignore
  useEffect(() => {
    const { setSelectedProducts } = props;
    const record = selectedFlatRows.map((d) => d.original);
    setSelectedProducts(record);
    //eslint-disable-next-line
  }, [selectedRowIds]);

  useEffect(() => {
    setColumnOrder(sortColumnArray(preferences));
  }, [preferences]);

  const allcol = allColumns.map((all) => all.Header);
  const allhead = colsHeader.map((all) => all.Header);
  const checkEquality = Boolean(isEqual(allcol, allhead));
  useEffect(() => {
    if (!checkEquality) {
      setcolsheader(allColumns);
    }
  }, [check]);

  const handleresizng = useCallback(
    debounce((payload) => {
      toggle();
      callAxios({
        method: "post",
        url: `/table-setting`,
        data: payload,
      });
      // .then((res) => {
      //   if (res) {
      //     Toast({ message: res.message });
      //   }
      // });
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
      tableSetting
    );
  }, [columnWidths]);

  const handleSort = (id) => {
    setparam({
      ...pagination,
      page: 1,
      sort: params.sort === "asc" ? "desc" : "asc",
      pageSize: 30,
      sort_column: id,
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(colsHeader);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    //@ts-ignore
    setcolsheader(items);
    const reorderColsname = items.map((col: any) => col.id);
    //@ts-ignore
    setReorderCols(reorderColsname);
    setColumnOrder(reorderColsname);
  };
  // remove inline style from spinner and run it with listing after chaging listing opacity

  return (
    <>
      <div>
        <div className="customer_filter">
          {!props.selectedProducts?.length && (
            <Popover
              overlayClassName="item_filter"
              placement="bottomRight"
              className="show_customer_list"
              content={
                <div className="product-filters">
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(droppableProvided) => (
                        <div ref={droppableProvided.innerRef}>
                          {colsHeader.map((column: any, index) => {
                            return (
                              <Draggable
                                key={GetDateString()}
                                draggableId={column.id}
                                index={index}
                              >
                                {(draggableProvided) => (
                                  <div
                                    className="col_name"
                                    ref={draggableProvided.innerRef}
                                    {...draggableProvided.draggableProps}
                                    {...draggableProvided.dragHandleProps}
                                  >
                                    <div className="__dragDrop">
                                      <div
                                        {...draggableProvided.dragHandleProps}
                                        className={"__dragDrop_iconParent"}
                                        tabIndex="-1"
                                      >
                                        <MdDragIndicator />
                                      </div>
                                      <div className="__drag-righ">
                                        <label>
                                          <Checkbox
                                            className="custom_checkbox"
                                            {...column.getToggleHiddenProps()}
                                            onChange={() => {
                                              handleSelectColumn(
                                                column.id,
                                                h_cols_name,
                                                setcolname,
                                                colsHeader,
                                                setcolsheader,
                                                columns,
                                                setHiddenColumns
                                              );
                                            }}
                                            value={column.isVisible}
                                            style={{
                                              cursor: column.locked ? "not-allowed" : "pointer",
                                            }}
                                          />{" "}
                                          {column.Header}
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          <>
                            {droppableProvided.placeholder}

                            <div className="button_flexbox">
                              <Buttonx
                                type="default"
                                btnText="Reset"
                                disabled={column_reset_button || bool}
                                htmlType="button"
                                className="btn-default btn-form-size mr-20"
                                clickHandler={() =>
                                  handleResetColsFilter(
                                    callAxios,
                                    refetch,
                                    handleSetCheck,
                                    toggle,
                                    url
                                  )
                                }
                              />
                              <Buttonx
                                btnText="Apply"
                                disabled={bool}
                                className="btn-primary btn-form-size"
                                clickHandler={() => {
                                  handleSubmitFilters(
                                    reorderCols,
                                    h_cols_name,
                                    callAxios,
                                    setColumnOrder,
                                    refetch,
                                    preferences,
                                    table_slug,
                                    toggle
                                  );
                                }}
                              />
                            </div>
                          </>
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              }
              trigger="click"
            >
              <TooltipX title="Show Columns">
                <Button className="customer_filter ">
                  <img
                    alt="show columns"
                    className="hover-effect"
                    src={`${
                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                    }/static/media/showcolumns.svg`}
                  />
                </Button>
              </TooltipX>
            </Popover>
          )}
          <TooltipX title="download">
            <Button disabled className="btn-filter mr-30">
              <TfiDownload />
            </Button>
          </TooltipX>
        </div>
        {freezeTableWidth !== 100 && (
          <table {...getTableProps()} id="resizeabletable">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: any) => (
                    <th
                      {...column.getHeaderProps()}
                      className={`th ${column.isResizing ? "--resizing" : ""}`}
                    >
                      <span
                        {...column.getSortByToggleProps()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSort(column?.id);
                        }}
                      >
                        {column.render("Header")}
                        <span>
                          {params && params?.sort && params.sort_column === column.id ? (
                            params?.sort === "asc" ? (
                              <BsArrowUpCircle />
                            ) : (
                              <BsArrowDownCircle />
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
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() =>
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
                              toggle
                            )
                          }
                        >
                          <CiUnlock size={18} style={{ marginLeft: "10px" }} />{" "}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onMouseEnter={() => props.onRowHover(i)}
                    onMouseLeave={() => props.onRowHover(null)}
                    onClick={() => handleViewClick(row?.original, props.data)}
                    style={{ opacity: Boolean(row?.original.is_active) ? 1 : 0.5 }}
                  >
                    {row.cells.map(
                      (cell) =>
                        cell.column.locked === false && (
                          <td {...cell.getCellProps()} valign="middle">
                            {cell.render("Cell")}
                          </td>
                        )
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};
