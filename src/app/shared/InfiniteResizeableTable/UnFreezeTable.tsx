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
import {
  debounce,
  hideColumns,
  LockColumns,
  sortColumnArray,
  handleColumnWidth,
  // ReturnWidth,
  // defaultFixedColumn,
  // defaultResizeableColumn,
} from "utils";
import { isEqual } from "lodash";
import { useAxios } from "app/Hooks";
import { TableModalForResizing } from "app/containers/Items/DetailPlusListingHeader";
import { TooltipX } from "../ToolTip";

export const InfiniteUnFreezeTable = (props) => {
  const { callAxios, toggle } = useAxios();
  const {
    data,
    check,
    refetch,
    // loader,
    colsHeader,
    table_slug,
    // pagination,
    preferences,
    tableSetting,
    // showDetail,
    sidebarPosition,
    handleViewClick,
    freezeTableWidth,
    setColumnHideRef,
    setColumnOrderRef,
    // setparam = () => null,
    colsHeaderForlockedCols,
    defaultUnFreezTableWidth,
    handleTableFilterslockedcols,
    setcustomLoading = () => null,
  } = props;

  const columns = useMemo(
    () => props.columns,
    //eslint-disable-next-line
    [colsHeaderForlockedCols]
  );

  const { setcolsheader } = props;

  const params = JSON.parse(sessionStorage.getItem("params") as any);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suitAbleWidth, setSuitableWidth] = useState();

  const {
    getTableProps,
    getTableBodyProps,
    state,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    setColumnOrder,
    setHiddenColumns,
    // selectedFlatRows,
  } = useTable(
    {
      columns,
      data: data || [],
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
  } = state;

  useEffect(() => {
    setColumnOrderRef(() => setColumnOrder);
    setColumnHideRef(() => setHiddenColumns);
    //eslint-disable-next-line
  }, []);

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
      tableSetting,
      sidebarPosition
    );
    //eslint-disable-next-line
  }, [columnWidths]);

  // const handleSort = (id) => {
  //   setparam({
  //     ...pagination,
  //     page: 1,
  //     sort: params.sort === "asc" ? "desc" : "asc",
  //     pageSize: 30,
  //     sort_column: id,
  //   });
  // };

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
      {freezeTableWidth !== 100 && (
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
                    className={`th ${column.isResizing ? "--resizing" : ""} ${column.id !== "receivable"
                      ? "justify_between"
                      : column.id === "receivable"
                        ? "justify_end"
                        : ""
                      } ${column.id == "payable" ? "justify_end" : ""}`}
                  >
                    <span {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      <span>
                        {params && params?.sort && params.sort_column === column.id ? (
                          params?.sort === "asc" ? (
                            <TooltipX title="Sort by ascending" placement="bottom">
                              <span className="white-circle">
                                <img
                                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-ascending.svg`}
                                  alt="ascending order"
                                  className="ascending order"
                                />
                              </span>
                            </TooltipX>
                          ) : (
                            <TooltipX title="Sort by descending" placement="bottom">
                              <span className="white-circle">
                                <img
                                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-descending.svg`}
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
                      className={`${column.resizable === undefined ? "resizer isResizing" : "no-resize"
                        }`}
                    />
                    {column.is_lockable && (
                      <span
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
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
                            setcustomLoading,
                            setIsModalOpen,
                            setSuitableWidth
                          );
                        }}
                      >
                        <img
                          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/Unlock-new.svg`}
                          style={{ marginLeft: "10px" }}
                          className="unlock"
                          alt="unlock"
                        />
                        {/* <CiUnlock size={18} style={{ marginLeft: "10px" }} /> */}{" "}
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
                    {...row.getRowProps()}
                    onMouseEnter={() => props.onRowHover(i)}
                    onMouseLeave={() => props.onRowHover(null)}
                    onClick={() => handleViewClick(row?.original, props.data)}
                    style={{ backgroundColor: Boolean(row?.original.is_active) ? 1 : "#F6F6F6" }}
                  >
                    {/* <div className="no-sticky"> */}
                    {row.cells.map(
                      (cell) =>
                        cell.column.locked === false && (
                          <td
                            {...cell.getCellProps()}
                            valign="middle"
                            className={
                              cell.column.id === "receivable" ? "justify_end pl-0 pr-10" : ""
                            }
                          >
                            {cell.render("Cell")}
                          </td>
                        )
                    )}
                  </tr>
                );
              })
            }
            {/* {loader && (
              <div>
                <Spinner />
              </div>
            )} */}
          </tbody>

          {/* <tfoot className="listing-count">
            <tr>
              <td className="w-100">
                <div className="listing-count">
                  Total Contacts : 309
                </div>
              </td>
            </tr>
          </tfoot> */}
        </table>
      )}
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
