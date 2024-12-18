import { ActionTypes, initialState } from "./Types";

export const reducer = (state: initialState, action: ActionTypes) => {
  const { type, payload } = action;

  switch (type) {
    case "roles":
      return { ...state, roles: payload };
    case "details":
      return { ...state, details: payload };
    case "vendors":
      return { ...state, vendors: payload };
    case "taxList":
      return { ...state, taxList: payload };
    case "itemUnits":
      return { ...state, itemUnits: payload };
    case "warehouses":
      return { ...state, warehouses: payload };
    case "invoices":
      return { ...state, invoices: payload };
    case "salesPerson":
      return { ...state, salesPerson: payload };
    case "paymentModes":
      return { ...state, paymentModes: payload };
    case "base_currency":
      return { ...state, base_currency: payload };
    case "account_groups":
      return { ...state, account_groups: payload };
    case "purchaseAccount":
      return { ...state, purchaseAccount: payload };
    case "sales_order_list":
      return { ...state, sales_order_list: payload };
    case "all":
      return { ...state, ...payload };
    default:
      return state;
  }
};
