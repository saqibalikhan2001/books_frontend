/**@format */

import { CheckboxValueType } from "antd/es/checkbox/Group";

export interface DefaultState {
  sales: CheckboxValueType[];
  contact: CheckboxValueType[];
  settings: CheckboxValueType[];
  accounts: CheckboxValueType[];
  inventory: CheckboxValueType[];
  purchases: CheckboxValueType[];
  dashboard: CheckboxValueType[];
  preferences: CheckboxValueType[];
  tablepreferences: CheckboxValueType[];
  reports: CheckboxValueType[];
}

export const reducer = (
  state: DefaultState,
  action: { type: string; payload: CheckboxValueType[] }
) => {
  const { type, payload } = action;
  switch (type) {
    case "settings":
      return { ...state, settings: payload };
    case "inventory":
      return { ...state, inventory: payload };
    case "sales":
      return { ...state, sales: payload };
    case "contact":
      return { ...state, contact: payload };
    case "purchases":
      return { ...state, purchases: payload };
    case "accounts":
      return { ...state, accounts: payload };
    case "dashboard":
      return { ...state, dashboard: payload };
    case "preferences":
      return { ...state, preferences: payload };
    case "tablepreferences":
      return { ...state, tablepreferences: payload };
    case "reports":
      return { ...state, reports: payload };
    case "clear":
      return {
        sales: payload,
        contact: payload,
        accounts: payload,
        settings: payload,
        reports: payload,
        purchases: payload,
        inventory: payload,
        dashboard: payload,
        preferences: payload,
        tablepreferences: payload,
      };
    default:
      return state;
  }
};
