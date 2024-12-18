import { Toast } from "app/shared";
import { isEqual } from "lodash";

export const GetDateString = () => {
  //@ts-ignore
  return `id${Date.parse(new Date())}${Math.floor(Math.random() * 10000)}`.toString();
};

//@ts-ignore
export const ReturnWidth = (name = "", listing = [], width?: number) => {
  const filteredData = listing.find((val: any) => val.slug === name);
  //@ts-ignore
  const width_without_pixel = Boolean(Number(parseFloat(filteredData?.width_px)))
    ? //@ts-ignore
      Number(parseFloat(filteredData?.width_px))
    : width === 100
    ? NaN
    : 120;
  return width_without_pixel;
};

export const ShowActioncolumn = (name = "", listing = []) => {
  const filteredData = listing.find((val: any) => val.slug === name);
  //@ts-ignore
  // console.log({ show: filteredData?.hasOwnProperty("show_action") });
  //@ts-ignore
  return filteredData?.hasOwnProperty("show_action");
};

export const defaultStatus = (name = "", listing = []) => {
  const filteredData = listing.find((val: any) => val.slug === name);

  //@ts-ignore
  return filteredData?.default || false;
};

export const LockAble = (name = "", listing = []) => {
  const filteredData = listing.find((val: any) => val.slug === name);
  //@ts-ignore0;
  return filteredData?.is_lockable;
};

export const CheckLocakedStatus = (name = "", listing = []) => {
  const filteredData = listing.find((val: any) => val.slug === name);
  //@ts-ignore
  return filteredData?.locked;
};

export const hideColumns = (preferences) => {
  const h_cols = preferences?.map((val) => {
    if (val.show_status === false) return val.slug;
  });
  const data = h_cols?.filter((item) => !!item);
  return data;
};

export const sortColumnArray = (preferences) => {
  const r_cols = preferences?.map((val: any, index) => {
    if (val.sort_order === index) return val.slug;
  });
  return r_cols;
};

export const sort_order = (name, preferences) => {
  const sortOrder = preferences?.find((val: any) => val.slug === name);
  return sortOrder?.sort_order;
};

export const handleColumnWidth = (
  columnWidths,
  isResizingColumn,
  preferences,
  handleresizng,
  table_slug,
  tableSetting,
  sidebarPosition?: any
) => {
  const key = Object.keys(columnWidths);
  const width: any = Object.values(columnWidths);
  const index = key.indexOf(isResizingColumn);
  let payload = {};
  const resizeTableWidth = document.getElementById("resizeabletable");
  if (key.length && width.length && index !== -1) {
    const defaultValues = preferences?.find((pref) => pref.slug === key[index]);
    let resolution: number;
    sidebarPosition?.open
      ? (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10))
      : (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10));
    payload = {
      slug: table_slug,
      freez_table_width_px:
        table_slug === "supplier" || (table_slug === "customer" && !resizeTableWidth?.clientWidth)
          ? `${tableSetting?.freez_table_width_px + 30}`
          : tableSetting?.freez_table_width_px ?? null,
      unfreez_table_width_px: resizeTableWidth?.clientWidth || null,
      screen_resolution: resolution,
      preferences: {
        name: key[index]
          ? preferences?.find((pref) => pref.slug === key[index])?.name
          : defaultValues?.name,
        width: width[index] <= 175 ? 175 : width[index],
        slug: key[index] || defaultValues?.slug,
      },
    };
    handleresizng(payload);
  }
  return payload;
};

const lockedColumns = (preferences) => {
  const arr = preferences.map((val: any) => {
    if (val.locked === true) return val.slug;
  });
  const locked_cols = arr.filter(function (element) {
    return element !== undefined;
  });

  return locked_cols;
};
export const LockColumns = (
  slug,
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
  setcustomLoading?: any,
  setIsModalOpen?: any,
  setSuitableWidth?: any
) => {
  const lockcolsarray = lockedColumns(preferences);
  const exist = lockcolsarray.includes(slug);
  const copylock = [...colsHeaderForlockedCols];
  const copyUnlock = [...colsHeader];
  if (exist) {
    const index = copylock.findIndex((x) => x.id === slug);
    const filter = copylock.filter((x) => x.id === slug);

    if (copylock && copylock.length) copylock[index].locked = false;
    copylock.splice(index, 1);
    const copyfilter = filter;
    //@ts-ignore
    if (copyfilter && copyfilter.length) copyfilter[0].locked = false;
    handleTableFilterslockedcols(copylock);
    const joinArray = copyUnlock.concat(copyfilter);

    joinArray.sort((a: any, b: any) => a.sort_order - b.sort_order);

    setcolsheader(joinArray);
  } else {
    const index = copyUnlock.findIndex((x) => x.id === slug);
    const filter = copyUnlock.filter((x) => x.id === slug);
    copyUnlock[index].locked = true;
    copyUnlock.splice(index, 1);
    const copyfilter = filter;
    copyfilter[0].locked = true;
    handleTableFilterslockedcols(copylock.concat(copyfilter));
    setcolsheader(copyUnlock);
  }
  if (!exist) {
    //@ts-ignore
    lockcolsarray.push(slug);
  } else {
    //@ts-ignore
    const pos = lockcolsarray.indexOf(slug);
    lockcolsarray.splice(pos, 1);
  }
  //@ts-ignore
  const paylod = {
    slug: table_slug,
    lock_status: true,
    lock_column: lockcolsarray,
    reorder_status: false,
    hide_status: false,
  };
  callAxios({
    method: "post",
    url: `/reorder`,
    data: paylod,
  })
    .then((res) => {
      setcustomLoading(false);
      if (res.status === 403 && res.message) {
        setIsModalOpen(true);
        setSuitableWidth(res);
        Toast({ type: "error", message: res?.message });
        refetch();
      } else {
        Toast({ message: res?.message });
        setColumnOrder(sortColumnArray(preferences));
        refetch();
      }
    })
    .catch(() => {
      toggle();
      setcustomLoading(false);
    });
};

export const handleSorting = (sortBy, setparam, setLoader = () => null) => {
  const sort_column = sortBy.length && sortBy[0]?.id;
  const sort = sortBy.length && sortBy[0]?.desc;
  if (sort !== 0 && sort_column !== 0) {
    //@ts-ignore
    setLoader(true);
    setparam({
      page: 1,
      pageSize: 10,
      sort: sort === 0 ? "asc" : sort === false ? "asc" : "desc",
      sort_column: sort_column === 0 ? "" : sort_column,
    });
  }
};

export const handleSubmitFilters = (
  reorderCols,
  h_cols_name,
  callAxios,
  setColumnOrder,
  refetch,
  preferences,
  table_slug,
  toggle,
  tableSetting?: any
) => {
  toggle();
  const default_hide = hideColumns(preferences);
  const checkEquality = Boolean(isEqual(default_hide, h_cols_name));

  const paylod = {
    slug: table_slug,
    lock_status: false,
    lock_column: [],
    reorder_status: reorderCols.length ? true : false,
    reorder_column: reorderCols,
    hide_status: !checkEquality,
    hide_column: h_cols_name,
  };
  callAxios({
    method: "post",
    url: `/reorder`,
    data: paylod,
  }).then((res) => {
    if (res) {
      !tableSetting?.change_auto && Toast({ message: res.message });
      //@ts-ignore
      reorderCols.length && setColumnOrder(reorderCols);

      //@ts-ignore
      !tableSetting?.change_auto && refetch();
    }
  });
  return;
};

export const handleSelectColumn = (
  slug,
  h_cols_name,
  setcolname,
  colsHeader,
  setcolsheader,
  //@ts-ignore
  columns,
  ColumnhideRef?: any,
  //@ts-ignore
  freeze_table_width?: any,

  tableSetting?: any,
  reorderCols?: any,
  callAxios?: any,
  ColumnOrderRef?: any,
  refetch?: any,
  preferences?: any,
  table_slug?: any,
  toggle?: any
) => {
  let copyArray = [...h_cols_name];
  //@ts-ignore
  const exist = copyArray.includes(slug);
  if (!exist) {
    //@ts-ignore
    setcolname([...copyArray, slug]);
    copyArray = [...copyArray, slug];
    ColumnhideRef([...copyArray, slug]);
  } else {
    //@ts-ignore
    const pos = copyArray.indexOf(slug);
    copyArray.splice(pos, 1);
    setcolname(copyArray);
    ColumnhideRef(copyArray);
  }
  const index = colsHeader.findIndex((x: any) => x.id === slug);
  //@ts-ignore
  const newArray = [...colsHeader];
  //@ts-ignore
  const showHideFlag = newArray[index].isVisible;
  //@ts-ignore
  if (showHideFlag) newArray[index].isVisible = false;
  //@ts-ignore
  else newArray[index].isVisible = true;
  setcolsheader(newArray);
  if (tableSetting?.change_auto) {
    handleSubmitFilters(
      reorderCols,
      copyArray,
      callAxios,
      ColumnOrderRef,
      refetch,
      preferences,
      table_slug,
      toggle,
      tableSetting
    );
  }
};

export const handleResetColsFilter = (callAxios, refetch, handleSetCheck, toggle, url) => {
  const payload = {
    module: url,
  };
  toggle();
  callAxios({
    method: "put",
    url: `/reset`,
    data: payload,
  })
    .then((res) => {
      if (res) {
        Toast({ message: res.message });
        refetch();
        handleSetCheck();
        // setTimeout(() => {
        //   navigate(0);
        // }, 500);
      }
    })
    .catch(() => toggle());
};

export const handleActionpref = (actionpref, length) => {
  const action_pref =
    actionpref === "1" ? 2 : actionpref === "2" ? 3 : actionpref === "last" ? length + 1 : 2;

  return action_pref;
};

export const handleStockColors = (reorder, stock) => {
  if (reorder > 0) {
    // in stock
    if (stock > reorder) return "In stock";
    // low stock
    else if (stock <= reorder && stock > 0) return "low_stock";
    // out of stock
    else if (stock <= 0) return "outStock";
  } else {
    // in stock
    if (stock > 0) return "In stock";
    // out of stock
    else return "outStock";
  }

  return "";
};

//@ts-ignore
export const defaultFreezTableWidth = (width) => {
  return {
    minWidth: 195,
    maxWidth: 2000,
  };
};
//@ts-ignore
export const defaultResizeableTableWidth = (width) => {
  return {
    minWidth: 195,
    maxWidth: 1300,
  };
};
