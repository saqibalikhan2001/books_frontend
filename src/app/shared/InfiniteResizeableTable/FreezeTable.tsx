/** @format */
import { useState, useCallback, useEffect, useMemo, Fragment } from "react";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useColumnOrder,
  useBlockLayout,
  useResizeColumns,
} from "react-table";
import { useAxios } from "app/Hooks";
import { Spinner } from "../PageLoader";
import { LockColumns, debounce, handleColumnWidth } from "utils";
import { TableModalForResizing } from "app/containers/Items/DetailPlusListingHeader";
import { TooltipX } from "../ToolTip";

export const InfiniteFreezeTable = (props) => {
  const { callAxios, toggle } = useAxios();
  const {
    data,
    total,
    loader,
    refetch,
    setparam,
    colsHeader,
    table_slug,
    showDetail,
    pagination,
    preferences,
    tableSetting,
    // actionPref,
    setcolsheader,
    handleViewClick,
    sidebarPosition,
    // rowSelection,
    detailPageColumns,
    // setRowSelection,
    defaultFreezTableWidth,
    colsHeaderForlockedCols,
    handleTableFilterslockedcols,
    setcustomLoading = () => null,
  } = props;

  const columns = useMemo(
    () => props.columns,
    //eslint-disable-next-line
    [preferences, colsHeaderForlockedCols, showDetail]
  );
  const obj = JSON.parse(localStorage.getItem("obj") as any);
  const params = JSON.parse(sessionStorage.getItem("params") as any);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suitAbleWidth, setSuitableWidth] = useState();

  const {
    rows,
    state,
    // allColumns,
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
      // onRowSelectionChange: setRowSelection,
    },
    useSortBy,
    useBlockLayout,
    useResizeColumns,
    useRowSelect,
    useColumnOrder
  );

  const {
    columnResizing: { columnWidths, isResizingColumn, headerIdWidths },
    selectedRowIds,
    // columnOrder,
    //@ts-ignore
    columnOrder,
  } = state;

  useEffect(() => {
    let result = document.getElementsByClassName("active_row");
    if (result[0]) result[0].scrollIntoView({ block: "center", inline: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obj?.curr_id]);

  useEffect(() => {
    if (showDetail) setColumnOrder(detailPageColumns);
    //eslint-disable-next-line
  }, [showDetail, detailPageColumns]);

  // useEffect(() => {
  //   actionColumnindex = columnOrder.indexOf("action");
  // }, [columnOrder]);

  useEffect(() => {
    const { setSelectedProducts } = props;
    setSelectedProducts(selectedFlatRows);
    //eslint-disable-next-line
  }, [selectedRowIds]);
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
          res.show_popup && setIsModalOpen(true);
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
      refetch();

      // callAxios({
      //   method: "post",
      //   url: `/table-setting`,
      //   data: payload,
      // }).then(() => {
      // });
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
      sort: params.sort === "asc" ? "desc" : "asc",
      pageSize: 30,
      sort_column: id,
    });
  };

  return (
    <Fragment>
      <table
        // style={{ opacity: loader ? 0.5 : 1 }}
        {...getTableProps()}
        className={showDetail ? "hide_shadow" : ""}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
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
                        className={
                          params &&
                          params?.sort &&
                          params.sort_column === column.id &&
                          (params.sort === "asc" || params.sort === "desc")
                            ? "bg-color"
                            : ""
                        }
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
                            // if (column.id !== "selection" && column.id !== "action") {
                            //   handleSort(column?.id);
                            // }
                            if (column.id === "display_name") {
                              handleSort(column?.id);
                            }
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
                        {column.id === "selection" || column.id === "action" ? (
                          ""
                        ) : (
                          <span
                            style={{
                              cursor: column.default ? "not-allowed" : "pointer",
                            }}
                            onClick={() => {
                              if (column.default) {
                                return;
                              } else {
                                setcustomLoading?.(true);
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
                            <img
                              src={`${
                                import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                              }/static/media/Lock-new.svg`}
                              className="lock"
                              width={14}
                              style={{ marginLeft: "10px" }}
                            />
                            {/* <Icons.CiLock size={20} className="lock" /> */}
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
        <tbody {...getTableBodyProps()}>
          {
            //@ts-ignore
            rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  onMouseEnter={() => props.onRowHover(i)}
                  onMouseLeave={() => props.onRowHover(null)}
                  style={{ backgroundColor: Boolean(row?.original.is_active) ? 1 : "#F6F6F6" }}
                  className={row?.original.id === obj?.curr_id && showDetail ? "active_row" : ""}
                >
                  {/* <div className="stickey-cols"> */}
                  {!showDetail &&
                    row.cells.map(
                      (cell) =>
                        cell.column.locked === true && (
                          <td
                            onClick={() =>
                              cell.column.id !== "selection" && handleViewClick(row?.original, data)
                            }
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
                            onClick={() =>
                              cell.column.id !== "selection" && handleViewClick(row?.original, data)
                            }
                            {...cell.getCellProps()}
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
          <>
            {loader && <Spinner size={"small"} />}
            <tfoot className="listing-count simple_visible">
              <tr>
                <td className="w-100">
                  <div className="listing-count-inner  total_receipt">
                    {table_slug === "supplier"
                      ? `Total Suppliers : ${total}`
                      : `Total Contacts : ${total}`}
                  </div>
                </td>
              </tr>
            </tfoot>
          </>
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
