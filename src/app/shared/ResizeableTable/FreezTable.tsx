/** @format */
import { useEffect, useCallback, useMemo, useState, Fragment } from "react";
import { Checkbox } from "antd";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useColumnOrder,
  useBlockLayout,
  useResizeColumns,
} from "react-table";
import { useAxios } from "app/Hooks";
import { TooltipX } from "../ToolTip";
import { debounce, LockColumns, handleColumnWidth, handleStockColors } from "utils";
import { TableModalForResizing } from "app/containers/Items/DetailPlusListingHeader";

// let actionColumnindex;

const FreezTable = (props) => {
  const { callAxios, toggle } = useAxios();
  const { setparam = () => null } = props;
  const {
    data = [],
    total,
    showDetail,
    colsHeader,
    pagination,
    preferences,
    tableSetting,
    setcolsheader,
    handleViewClick,
    sidebarPosition,
    detailPageColumns,
    paymentReceive = false,
    defaultFreezTableWidth,
    colsHeaderForlockedCols,
    totalCountName,
    setcustomLoading = () => null,
  } = props;
  const columns = useMemo(
    () => props.columns,
    //eslint-disable-next-line
    [preferences, colsHeaderForlockedCols, showDetail]
  );
  4;
  //@ts-ignore
  const { handleTableFilterslockedcols, refetch, table_slug, actionPref } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suitAbleWidth, setSuitableWidth] = useState();

  //@ts-ignore
  const obj = JSON.parse(localStorage.getItem("obj"));
  const params = JSON.parse(sessionStorage.getItem("params") as any);

  const {
    rows,
    state,
    //@ts-ignore
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
      data: data || [],
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
          //@ts-ignore
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <Checkbox className="tile_checkbox" {...getToggleAllRowsSelectedProps()} />
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
        ...columns,
      ]);
    }
  );

  const {
    columnResizing: { columnWidths, isResizingColumn, headerIdWidths },
    selectedRowIds,
    //@ts-ignore
    columnOrder,
  } = state;

  useEffect(() => {
    let result = document.getElementsByClassName("active_row");
    if (result[0]) result[0].scrollIntoView({ block: "center", inline: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (showDetail) setColumnOrder(detailPageColumns);

    //eslint-disable-next-line
  }, [showDetail, detailPageColumns]);

  //@ts-ignore
  useEffect(() => {
    const { setSelectedProducts } = props;
    setSelectedProducts(selectedFlatRows);

    //eslint-disable-next-line
  }, [selectedRowIds]);

  // useEffect(() => {
  //   actionColumnindex = columnOrder?.indexOf("action");
  // }, [columnOrder]);

  // const move = (from, to, arr) => {
  //   const newArr = [...arr];

  //   const item = newArr.splice(from, 1)[0];
  //   newArr.splice(to, 0, item);

  //   return newArr;
  // };
  // useEffect(() => {
  //   handleTableFilterslockedcols(allColumns);
  //   const freezcolumnsname = allColumns.map((col: any) => col.id);
  //   const actionColIndex = freezcolumnsname.indexOf("action");

  //   const reorderArray = move(actionColIndex, actionPref, freezcolumnsname);
  //   setColumnOrder(reorderArray);
  //   //eslint-disable-next-line
  // }, [preferences]);

  //eslint-disable-next-line
  const handleresizng = useCallback(
    debounce((payload) => {
      toggle();
      callAxios({
        method: "post",
        url: `/table-setting`,
        data: payload,
      }).then((res) => {
        if (res.status === 403) {
          if (res.show_popup) {
            setIsModalOpen(true);
          }
          setSuitableWidth(res);
        }
      });
    }, 400),
    []
  );

  const handleSubmitSuitableWidth = () => {
    const resizeTableWidth = document.getElementById("resizeabletable");
    const key = Object.keys(columnWidths);
    const width: any = Object.values(columnWidths);
    const index = key.indexOf(headerIdWidths?.[0]?.[0]);
    //@ts-ignore
    let payload = {};
    if (key.length && width.length && index !== -1) {
      let resolution: number;
      sidebarPosition?.open
        ? (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10))
        : (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10));
      payload = {
        slug: table_slug,
        freez_table_width_px: tableSetting?.freez_table_width_px || null,
        unfreez_table_width_px: resizeTableWidth?.clientWidth || null,
        screen_resolution: resolution,
        preferences: {
          name: key[index],
          //@ts-ignore
          width: parseFloat(suitAbleWidth?.data?.suitable_width_px).toFixed(0),
          slug: key[index],
        },
      };
      // callAxios({
      //   method: "post",
      //   url: `/table-setting`,
      //   data: payload,
      // }).then(() => {
      // });
      refetch();
    }
  };

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
      sort: params?.sort === "asc" ? "desc" : "asc",
      sort_column: id,
    });
  };

  return (
    <Fragment>
      <table {...getTableProps()} className={showDetail ? "hide_shadow" : ""}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps({
                style: {
                  background: table_slug === "item" && showDetail ? "#e2e2e2" : "#fff",
                },
              })}
            >
              {/* <div className="stickey-cols"> */}
              {!showDetail &&
                headerGroup.headers.map(
                  (column: any) =>
                    column.locked &&
                    column.id !== "action" && (
                      <th
                        {...column.getHeaderProps({
                          // style: {
                          //   width:
                          //     column.id === columnOrder[actionColumnindex - 1]
                          //       ? column.width + 30
                          //       : column.width,
                          // },
                          title: column?.tooltip_text,
                          // params && params?.sort && params.sort_column === column.id
                          //   ? `Sort by ${params.sort}`
                          //   : "toggle sortby",
                        })}
                        className={`${
                          params &&
                          params?.sort &&
                          params.sort_column === column.id &&
                          (params.sort === "asc" || params.sort === "desc")
                            ? "bg-color"
                            : ""
                        }
                       
                    `}
                        // colSpan={`${column.id === columnOrder[actionColumnindex - 1] && 2}`}
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
                            if (column.id !== "selection" && column.id !== "action") {
                              handleSort(column?.id);
                            }
                          }}
                        >
                          <>{column.render("Header")}</>
                          <span>
                            {params && params?.sort && params.sort_column === column.id ? (
                              params?.sort === "asc" ? (
                                // <BsArrowUpCircle className="ml-10" size={15} />
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
                                // <BsArrowDownCircle className="ml-10" size={15} />
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
                        {column.id === "selection" || column.id === "action" ? (
                          ""
                        ) : (
                          <span
                            title=""
                            style={{
                              cursor: column.default ? "not-allowed" : "pointer",
                            }}
                            //@ts-ignore
                            onClick={() => {
                              if (column.default) {
                                return;
                              } else {
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
                                  setcustomLoading
                                );
                              }
                            }}
                          >
                            {/* <CiLock size={20} className="lock" /> */}
                            <img
                              src={`${
                                import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                              }/static/media/Lock-new.svg`}
                              className="lock"
                              width={14}
                            />
                          </span>
                        )}
                      </th>
                    )
                )}
              {showDetail &&
                headerGroup.headers.slice(0, 2).map(
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
              {/* </div> */}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className={showDetail && totalCountName === "Total Products" ? "detail-body" : ""}
        >
          {
            //@ts-ignore
            rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  // onMouseEnter={() => props.onRowHover(i)}
                  // onMouseLeave={() => props.onRowHover(null)}
                  onClick={() => handleViewClick(row?.original, data, paymentReceive)}
                  className={`
                    ${
                      (paymentReceive ? row?.original.payment_no : row?.original.id) ===
                        obj?.curr_id && showDetail
                        ? "active_row"
                        : "" + table_slug === "item" &&
                          !showDetail &&
                          row?.original?.inventory_type === "inventory" &&
                          handleStockColors(
                            row?.original?.reorder_level,
                            row?.original?.quantity_on_hand
                          )
                    }
                      
                      ${
                        !Boolean(row?.original.is_active) && table_slug === "item"
                          ? "inactive_row"
                          : ""
                      }
                      `}
                  style={{
                    backgroundColor:
                      table_slug !== "item" && table_slug !== "accounts"
                        ? 1
                        : Boolean(row?.original.is_active)
                        ? 1
                        : "#F6F6F6",
                  }}
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
                    row.cells.slice(0, 2).map(
                      (cell) =>
                        cell.column.locked === true && (
                          <td
                            {...cell.getCellProps()}
                            className={cell.column.id === "action" ? "action-ellipses" : ""}
                          >
                            {cell.render("Cell")}
                          </td>
                        )
                    )}
                  {/* </div> */}
                </tr>
              );
            })
          }
        </tbody>
        {showDetail && (
          <tfoot className="listing-count">
            <tr>
              <td className="w-100">
                <div className="listing-count-inner color-1616 total_receipt">
                  {`${totalCountName} : ${total}`}
                </div>
              </td>
            </tr>
          </tfoot>
        )}
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

export default FreezTable;
