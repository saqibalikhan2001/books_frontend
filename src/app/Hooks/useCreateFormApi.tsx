/**@format */

import { useEffect, useReducer, useState } from "react";
import { useAxios } from "app/Hooks";
import { reducer } from "./CreateFormReducer";
import { createTaxList } from "utils";

const reducerState = {
  roles: [],
  vendors: [],
  taxList: [],
  invoices: [],
  itemUnits: [],
  warehouses: [],
  salesPerson: [],
  paymentModes: [],
  account_groups: {},
  purchaseAccount: [],
  sales_order_list: [],
  details: {
    bill_no: "",
    package_no: "",
    invoice_no: "",
    payment_no: "",
    sales_order_no: "",
    purchase_order_no: "",
  },
};

export const useCreateFormApi = (url: string, has_permission?: boolean) => {
  const { callAxios } = useAxios();
  const [isError, setIsError] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [response, dispatch] = useReducer(reducer, reducerState);

  useEffect(() => {
    if (has_permission !== false) {
      callAxios({
        url: url,
      })
        .then((res: any) => {
          if (res) {
            setFormLoading(false);
            const taxList = createTaxList(res?.taxes || res?.tax_list);
            // in edit currency is used in which currency invoice is saved
            res.base_currency = res?.base_currency
              ? res?.base_currency
              : res?.invoice_info?.base_currency;
            const sales_person = res?.sales_person?.map((person) => ({
              id: person?.user_id,
              label: person?.users?.name,
            }));

            dispatch({
              type: "all",
              payload: {
                ...res,
                taxList,
                sales_person,
                details: { ...res },
                vendors: res.vendors,
                itemUnits: res.item_units,
                roles: res.data || res.roles,
                paymentModes: res.payment_methods,
                expenseAccounts: res.expense_accounts,
                sales_order_list: res.sales_order_list,
                inventoryAccounts: res.inventory_accounts,
                warehouses: res.warehouses || res.warehouse_list,
                purchaseAccount: res.purchase_account_group || res.account_groups,
              },
            });
          }
        })
        .catch((err) => {
          if (err) {
            setIsError(true);
          }
        });
    }
    //eslint-disable-next-line
  }, [url, has_permission, callAxios]);
  return {
    details: { ...response },
    ...response,
    formLoading,
    error: isError,
  };
};
