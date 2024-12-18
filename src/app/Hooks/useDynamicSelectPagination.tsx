import { useState, useCallback, useMemo } from "react";
import { debounce } from "utils";
// import { Toast } from "app/shared";
import { axiosCall } from "services";
import { SelectOption } from "./Types";
import { useBool, useStore } from "app/Hooks";

export const useDynamicSelectPagination = (
  url: string,
  adjustment: boolean = false,
  showAll: boolean = false,
  selectedIds: any = [],
  contactType?: string
) => {
  const { setTrue } = useBool(true);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const { access_token, organization_id } = useStore();
  const [options, setOptions] = useState<SelectOption>([]);
  const [hasContentLoading, setHasContentLoading] = useState(false);
  const fetchOptions = useCallback(
    async (searchKey: string, page: number): Promise<SelectOption> => {
      const value = searchKey.replace(/[^\x00-\x7F]/g, "");
      let res = [];
      try {
        if (adjustment) {
          const data = await axiosCall({
            url: `${url}?page=${page}&show_all=${showAll}&view=20&search=${value}${
              contactType ? `&contact_type=${contactType}` : ""
            }`,
            headers: { authorization: access_token, organization: organization_id },
          });

          res = data?.data.filter((item: any) => !selectedIds.includes(item.id));
          setTotal(data?.total ?? data?.data.length);
        }
      } catch (error: any) {
        // if (error?.status === 403) {
        // const status = error?.data?.status;
        // if (status === "access_denied") {
        //   Toast({
        //     message:
        //       "Admin has changed the permissions. Forcefully Refreshing to load latest set permissions for you.",
        //     type: "info",
        //   });
        // }
        // }
      }
      return res;
    },
    [url, access_token, organization_id, showAll, selectedIds, adjustment]
  );

  const loadOptions = useCallback(
    async (value: string) => {
      setFetching(true);
      const newOptions = await fetchOptions(value, 1);
      setOptions(newOptions);
      setSearchValue(value);
      setCurrentPage(2); // Start with the next page after the initial load
      setFetching(false);
    },
    [fetchOptions]
  );
  const handleScroll = useCallback(
    async (e: any) => {
      const { target } = e;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight && !hasContentLoading) {
        if (options.length < total) {
          setHasContentLoading(true);
          const newOptions = await fetchOptions(searchValue, currentPage);
          setOptions((prevOptions) => [...prevOptions, ...newOptions]);
          setCurrentPage((prevPage) => prevPage + 1);
          setHasContentLoading(false);
        }
      }
    },
    [hasContentLoading, options.length, total, fetchOptions, searchValue, currentPage]
  );
  const handleOptionDeselect = useCallback(() => {
    setTrue();
    setCurrentPage(1);
    loadOptions("");
  }, [loadOptions, setTrue]);
  const debounceFetcher = useMemo(() => {
    return debounce(loadOptions, 500);
  }, [loadOptions]);
  return {
    fetching,
    options,
    hasContentLoading,
    handleScroll,
    debounceFetcher,
    handleOptionDeselect,
    loadOptions,
    setCurrentPage,
  };
};
