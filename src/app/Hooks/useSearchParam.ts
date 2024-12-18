/**@format */

import { useCallback, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import qs from "query-string";
import { TablePaginationConfig } from "antd";
import { SearchParamsTypes } from "./Types";

export const useSearchParam = (
  name: string,
  no_pagination?: boolean,
  handleParams?: (params) => void
) => {
  const location = useLocation();
  const [total, setTotal] = useState<number>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("current");
  const param: string = searchParams.get(name) ?? "";

  useEffect(() => {
    if (!page && !no_pagination) {
      setSearchParams({
        ...(param && { tab: param }),
        sort: "",
        current: 1,
        pageSize: 10,
        sort_column: "",
      } as any);
    }
    //eslint-disable-next-line
  }, [page, param, no_pagination]);

  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const onChange = (pagination: TablePaginationConfig, _: any, sorter: any) => {
    const param: SearchParamsTypes = {
      sort: searchParams.get("sort") || "",
      sort_column: searchParams.get("sort_column") || "",
      ...(searchParams.get(name) && { tab: searchParams.get(name) }),
    };
    const { field = "", order = "" } = sorter;
    const { current = 1, pageSize = 10 } = pagination;

    param.sort = order;
    param.sort_column = field;
    param.current = current;
    param.pageSize = pageSize;
    if (!order.length) param.sort_column = "";
    handleParams?.(param as any);

    const stringified = qs.stringify(param);
    location.search = `?${stringified}`;
    let url = window.location.origin + window.location.pathname + location.search;
    //eslint-disable-next-line
    history.pushState(history.state, "items", url);
  };

  const getParams = () => {
    const page = searchParams.get("current") || 1;
    const pageSize = searchParams.get("pageSize") || 10;
    const sort = searchParams.get("sort") || "asc";
    const sort_column = searchParams.get("sort_column") || "display_name";
    const tab = searchParams.get(name) || "1";

    return { page: +page, pageSize: +pageSize, sort, sort_column, tab };
  };

  const setParams = ({ current_page, per_page, total, sort, sort_column }: any) => {
    const param = getParams();
    setSearchParams({
      ...param,
      pageSize: per_page,
      current: current_page,
      sort,
      sort_column,
    } as any);
    setTotal(total);
  };

  return {
    total,
    param,
    onChange,
    setTotal,
    getParams,
    setParams,
    handleTotal,
    searchParams,
    setSearchParams,
  };
};
