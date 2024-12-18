import { useCallback, useEffect, useState } from "react";

export const useCustomParams = (moduleName: string, tab: string = "1") => {
  const localParams = sessionStorage.getItem("params");
  const parsedparams = JSON.parse(localParams as any);
  const [sorting, setSorting] = useState<any>({
    sort: parsedparams?.sort ?? "",
    sort_column: parsedparams?.sort_column ?? "",
    filter: parsedparams?.filter ?? "",
  });

  useEffect(() => {
    const params = {
      ...sorting,
      sort_column: sorting.sort !== undefined ? sorting.sort_column : "",
    };
    sessionStorage.setItem("params", JSON.stringify(params));
    const ss = `?tab=${tab}&sort=${params.sort ?? ""}&sort_column=${
      params.sort !== undefined ? params.sort_column : ""
    }&filter=${params.filter ?? ""}`;
    let url = window.location.origin + window.location.pathname + ss;
    //eslint-disable-next-line
    history.pushState(history.state, moduleName, url);
  }, [sorting, tab, moduleName]);

  const onChange = useCallback(
    (_pagination, _filters, sorter) => {
      setSorting({
        ...sorting,
        sort: sorter.order,
        sort_column: sorter.field || sorter.columnKey,
      });
    },
    [sorting]
  );

  const handleParams = useCallback(
    (value) => {
      setSorting({
        ...sorting,
        sort: value.sort,
        sort_column: value.sort_column,
        filter: value.filter,
      });
    },
    [sorting]
  );

  return {
    onChange,
    sorting,
    handleParams,
  };
};
