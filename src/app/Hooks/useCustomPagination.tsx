import { useCallback, useEffect, useState } from "react";
import { setKeyInSS } from "utils";

export const Params = (moduleName, params: any) => {
  let paramString = "";
  if (moduleName === "contacts") {
    paramString = `?current=${params.page}&pageSize=${params.pageSize}&sort=${
      params.sort ?? ""
    }&sort_column=${params.sort_column ?? ""}${params.status && `?&status=${params.status}`}${
      params.contact_type && `?&contact_type=${params.contact_type}`
    }${params.searchByAlphabet && `&searchByAlphabet=${params.searchByAlphabet}`}${
      params.current_balance && `&current_balance=${params.current_balance}`
    }${params.start_range && `&start_range=${params.start_range}`}${
      params.end_range && `&end_range=${params.end_range}`
    }${params.is_applied && `&is_applied=${params.is_applied}`}${
      params.search && `&search=${params.search}`
    }`;
  } else if (moduleName === "items") {
    paramString = `?current=${params.page}&pageSize=${params.pageSize}&sort=${
      params.sort ?? ""
    }&sort_column=${params.sort !== undefined ? params.sort_column : ""}${
      params.stock_status && `&stock_status=${params.stock_status}`
    }${params.type && `&type=${params.type}`}${params.status && `&status=${params.status}`}${
      params.category_id && `&category_id=${params.category_id}`
    }${params.is_applied && `&is_applied=${params.is_applied}`}${
      params.search && `&search=${params.search}`
    }`;
  } else if (moduleName === "categories") {
    paramString = `?current=${params.page}&pageSize=${params.pageSize}&sort=${
      params.sort ?? ""
    }&sort_column=${params.sort !== undefined ? params.sort_column : ""}`;
  } else if (moduleName === "estimates") {
    paramString = `?current=${params.page}&pageSize=${params.pageSize}&sort=${
      params.sort ?? ""
    }&sort_column=${params.sort !== undefined ? params.sort_column : ""}${
      params.status && `&status=${params.status}`
    }${params.date_range && `&date_range=${params.date_range}`}${
      params.start_range && `&start_range=${params.start_range}`
    }${params.end_range && `&end_range=${params.end_range}`}${
      params.contactId && `&contactId=${params.contactId}`
    }${params.is_applied && `&is_applied=${params.is_applied}`}${
      params.search && `&search=${params.search}`
    }`;
  } else if (moduleName === "invoices") {
    paramString = `?current=${params.page}&pageSize=${params.pageSize}&sort=${
      params.sort ?? ""
    }&sort_column=${params.sort !== undefined ? params.sort_column : ""}${
      params.status && `&status=${params.status}`
    }${params.date_range && `&date_range=${params.date_range}`}${
      params.start_range && `&start_range=${params.start_range}`
    }${params.end_range && `&end_range=${params.end_range}`}${
      params.contactId && `&contactId=${params.contactId}`
    }${params.is_applied && `&is_applied=${params.is_applied}`}${
      params.search && `&search=${params.search}`
    }`;
  } else if (moduleName === "creditNote") {
    paramString = `?current=${params.page}&pageSize=${params.pageSize}&sort=${
      params.sort ?? ""
    }&sort_column=${params.sort !== undefined ? params.sort_column : ""}${
      params.status && `&status=${params.status}`
    }${params.date_range && `&date_range=${params.date_range}`}${
      params.start_range && `&start_range=${params.start_range}`
    }${params.end_range && `&end_range=${params.end_range}`}${
      params.contactId && `&contactId=${params.contactId}`
    }${params.is_applied && `&is_applied=${params.is_applied}`}${
      params.dashboard && `&dashboard=${params.dashboard}`
    }${params.search && `&search=${params.search}`}`;
  } else if (moduleName === "paymentReceive") {
    paramString = `?current=${params.page}&pageSize=${params.pageSize}&sort=${
      params.sort ?? ""
    }&sort_column=${params.sort !== undefined ? params.sort_column : ""}${
      params.status && `&status=${params.status}`
    }${params.date_range && `&date_range=${params.date_range}`}${
      params.start_range && `&start_range=${params.start_range}`
    }${params.end_range && `&end_range=${params.end_range}`}${
      params.contactId && `&contactId=${params.contactId}`
    }${params.is_applied && `&is_applied=${params.is_applied}`}${
      params.search && `&search=${params.search}`
    }`;
  } else if (moduleName === "bills") {
    paramString = `?current=${params.page}&pageSize=${params.pageSize}&sort=${
      params.sort ?? ""
    }&sort_column=${params.sort !== undefined ? params.sort_column : ""}${
      params.status && `&status=${params.status}`
    }${params.date_range && `&date_range=${params.date_range}`}${
      params.start_range && `&start_range=${params.start_range}`
    }${params.end_range && `&end_range=${params.end_range}`}${
      params.contactId && `&contactId=${params.contactId}`
    }${params.is_applied && `&is_applied=${params.is_applied}`}${
      params.search && `&search=${params.search}`
    }`;
  } else if (moduleName === "billPayments") {
    paramString = `?current=${params.page}&pageSize=${params.pageSize}&sort=${
      params.sort ?? ""
    }&sort_column=${params.sort !== undefined ? params.sort_column : ""}${
      params.filter && `&status=${params.filter}`
    }${params.date_range && `&date_range=${params.date_range}`}${
      params.start_range && `&start_range=${params.start_range}`
    }${params.end_range && `&end_range=${params.end_range}`}${
      params.contactId && `&contactId=${params.contactId}`
    }${params.is_applied && `&is_applied=${params.is_applied}`}${
      params.search && `&search=${params.search}`
    }`;
  } else if (moduleName === "journal") {
    paramString = `?date_range=${params.date_range}${
      params.start_range && `&start_range=${params.start_range}`
    }${params.end_range && `&end_range=${params.end_range}`}`;
  } else if (moduleName === "accounts") {
    paramString = `?current=${params.page}&pageSize=${params.pageSize}&sort=${
      params.sort ?? ""
    }&sort_column=${params.sort && params.sort_column}${
      params.title !== undefined ? `&status=${params.title}` : ""
    }${params.is_applied && `&is_applied=${params.is_applied}`}${
      params.added_by ? `&added_by=${params.added_by}` : ""
    }${params.account_type_id ? `&account_type_id=${params.account_type_id}` : ""}${
      params.account_subtype_id ? `&account_subtype_id=${params.account_subtype_id}` : ""
    }${params.account_category_id ? `&account_category_id=${params.account_category_id}` : ""}${
      params.search && `&search=${params.search}`
    }`;
  } else if (moduleName === "ledger") {
    paramString = `?${params.date_range && `date_range=${params.date_range}`} ${
      params.start_range && `&start_range=${params.start_range}`
    }${params.end_range && `&end_range=${params.end_range}`}`;
  } else if (moduleName === "reports") {
    paramString = `?date_range=${params.date_range}${
      params.start_range && `&start_range=${params.start_range}`
    }${params.end_range && `&end_range=${params.end_range}`}${
      params.pageSize && `&view=${params.pageSize ?? 20}`
    }${params.page && `&page=${params.page ?? 1}`}${
      params.sort &&
      `&order_by=${params.sort ?? "asc"}${params.itemId && `&itemId=${params.itemId}`}`
    }${params.sort_column && `&sort_by=${params.sort_column ?? "created_at"}`}`;
  } else if (moduleName === "report") {
    paramString = `?date_range=${params.date_range}${
      params.start_range && `&start_range=${params.start_range}`
    }${params.end_range && `&end_range=${params.end_range}`}${
      params.status && `&status=${params.status}`
    }`;
  } else if (moduleName === "customerReport") {
    paramString = `?date_range=${params.date_range}${
      params.start_range && `&start_range=${params.start_range}`
    }${params.end_range && `&end_range=${params.end_range}`}${
      params.contactId && `&customer_id=${params.contactId}`
    }`;
  } else if (moduleName === "trialBalance") {
    paramString = `?date_range=${params.date_range}${
      params.start_range && `&start_range=${params.start_range}`
    }${params.end_range && `&end_range=${params.end_range}`}`;
  } else if (moduleName === "araging") {
    paramString = `?date_range=${params.date_range || "this_month"}${
      params.start_range && `&start=${params.start_range}`
    }${params.end_range && `&end=${params.end_range}`}${
      params.contactId && `&customer_id=${params.contactId}`
    }${params.pageSize && `&view=${params.pageSize || 10}`}${
      params.page && `&page=${params.page}`
    }${params.aging_by && `&aging_by=${params.aging_by}`}${
      params.interval_type && `&interval_type=${params.interval_type}`
    }${params.number_of_columns && `&number_of_columns=${params.number_of_columns}`}${
      params.interval_range && `&interval_range=${params.interval_range}`
    }${params.show_by && `&show_by=${params.show_by}`}${
      params.is_include_credit_notes && `&is_include_credit_notes=${params.is_include_credit_notes}`
    }`;
  } else if (moduleName === "taxsummarydetailreport") {
    paramString = `?date_range=${params.date_range ?? "this_year"}${
      params.pageSize && `&view=${params.pageSize ?? 20}`
    }${params.page && `&page=${params.page ?? 1}`}${
      params.sort && `&order_by=${params.sort ?? "asc"}`
    }${params.sort_column && `&sort_by=${params.sort_column ?? "created_at"}`}${
      params.end_range && `&end=${params.end_range}`
    }${params.itemId && `&itemId=${params.itemId}`}`;
  } else if (moduleName === "taxbycustomer") {
    paramString = `?date_range=${params.date_range || "this_year"}${
      params.pageSize && `&view=${params.pageSize || 20}`
    }${params.page && `&page=${params.page || 1}`}${
      params.sort && `&order_by=${params.sort || "asc"}`
    }${params.sort_column && `&sort_by=${params.sort_column || "created_at"}`}`;
  }

  return paramString;
};

export const useCustomPagination = (moduleName?: string) => {
  const localParams = sessionStorage.getItem("params");
  const parsedparams = JSON.parse(localParams as any);
  const [paginate, setPagination] = useState<any>({
    page: parsedparams?.page ?? 1,
    pageSize: parsedparams?.pageSize ?? 20,
    sort:
      parsedparams?.sort ??
      (["items", "contacts", "categories", "accounts"].includes(moduleName!) ? "asc" : "desc"),
    sort_column: ["items", "categories"].includes(moduleName!)
      ? parsedparams?.sort_column || "name"
      : moduleName === "contacts"
      ? parsedparams?.sort_column || "display_name"
      : moduleName === "estimates"
      ? parsedparams?.sort_column || "estimate_date"
      : moduleName === "invoices"
      ? parsedparams?.sort_column || "invoice_date"
      : moduleName === "creditNote"
      ? parsedparams?.sort_column || "credit_note_date"
      : moduleName === "paymentReceive"
      ? parsedparams?.sort_column || "payment_date"
      : moduleName === "bills"
      ? parsedparams?.sort_column || "bill_date"
      : moduleName === "billPayments"
      ? parsedparams?.sort_column || "payment_date"
      : moduleName === "accounts"
      ? parsedparams?.sort_column || "title"
      : parsedparams?.sort_column ?? "",
    filter: parsedparams?.filter ?? "",
    stock_status: parsedparams?.stock_status ?? "",
    type: parsedparams?.type ?? "",
    status: parsedparams?.status ?? "",
    itemId: parsedparams?.itemId ?? "",
    added_by: parsedparams?.added_by ?? "",
    end_range: parsedparams?.end_range ?? "",
    contactId: parsedparams?.contactId ?? "",
    is_applied: parsedparams?.is_applied ?? "",
    search: parsedparams?.search ?? "",
    date_range: [
      "journal",
      "ledger",
      "reports",
      "report",
      "customerReport",
      "trialBalance",
    ].includes(moduleName!)
      ? "this_week"
      : ["taxbycustomer"].includes(moduleName!)
      ? "this_year"
      : parsedparams?.date_range ?? "",
    start_range: parsedparams?.start_range ?? "",
    interval_range: parsedparams?.interval_range ?? "",
    aging_by: parsedparams?.aging_by ?? "",
    is_include_credit_notes: parsedparams?.is_include_credit_notes ?? "",
    interval_type: parsedparams?.interval_type ?? "",
    number_of_columns: parsedparams?.number_of_columns ?? "",
    show_by: parsedparams?.show_by ?? "",
    category_id: parsedparams?.category_id ?? "",
    contact_type: parsedparams?.contact_type ?? "",
    account_type_id: parsedparams?.account_type_id ?? "",
    current_balance: parsedparams?.current_balance ?? "",
    searchByAlphabet: parsedparams?.searchByAlphabet ?? "",
    account_subtype_id: parsedparams?.account_subtype_id ?? "",
    account_category_id: parsedparams?.account_category_id ?? "",
    dashboard: parsedparams?.dashboard ?? "",
  });

  useEffect(() => {
    const params = {
      ...paginate,
      sort_column: paginate.sort !== undefined ? paginate.sort_column : "",
    };
    sessionStorage.setItem("params", JSON.stringify(params));
    const ss = Params(moduleName, params);
    let url = window.location.origin + window.location.pathname + ss;
    //eslint-disable-next-line
    history.pushState(history.state, moduleName ?? "", url);
  }, [paginate, moduleName]);

  const onChange = useCallback(
    //@ts-ignore
    (pagination, filters, sorter) => {
      setPagination({
        ...pagination,
        ...paginate,
        sort: paginate?.sort === "asc" ? "desc" : "asc",
        sort_column: sorter.field || sorter.columnKey,
      });
      setKeyInSS("email", false);
    },
    [paginate]
  );

  const Prev = useCallback(() => {
    setPagination({ ...paginate, page: parseInt(paginate.page) - 1 });
    setKeyInSS("email", false);
  }, [paginate]);

  const Next = useCallback(() => {
    setPagination({ ...paginate, page: parseInt(paginate.page) + 1 });
    setKeyInSS("email", false);
  }, [paginate]);

  const handlePage = useCallback(
    (value: number | null) => {
      if (value) {
        setPagination({
          ...paginate,
          page: value,
        });
        setKeyInSS("email", false);
      }
    },
    [paginate]
  );

  const handleRowSize = useCallback(
    (value) => {
      setPagination({
        ...paginate,
        page: 1,
        pageSize: value,
      });
      setKeyInSS("email", false);
    },
    [paginate]
  );

  const handlePagination = useCallback(
    (value) => {
      setPagination({
        ...paginate,
        page: value.page,
        sort: value.sort,
        type: value?.type,
        itemId: value.itemId,
        filter: value.filter,
        status: value?.status,
        show_by: value?.show_by,
        search: value?.search,
        aging_by: value?.aging_by,
        added_by: value?.added_by,
        dashboard: value.dashboard,
        contactId: value.contactId,
        end_range: value.end_range,
        date_range: value.date_range,
        is_applied: value.is_applied,
        sort_column: value.sort_column,
        start_range: value.start_range,
        category_id: value?.category_id,
        stock_status: value.stock_status,
        contact_type: value?.contact_type,
        interval_type: value?.interval_type,
        interval_range: value?.interval_range,
        current_balance: value.current_balance,
        account_type_id: value?.account_type_id,
        searchByAlphabet: value?.searchByAlphabet,
        number_of_columns: value?.number_of_columns,
        account_subtype_id: value?.account_subtype_id,
        account_category_id: value?.account_category_id,
        is_include_credit_notes: value?.is_include_credit_notes,
      });
      setKeyInSS("email", false);
    },
    [paginate]
  );
  return {
    Next,
    Prev,
    onChange,
    paginate,
    handlePage,
    handleRowSize,
    handlePagination,
  };
};
