import { DataSourceProps } from "app/shared/types";

export type ItemProps = Omit<DataSourceProps, "item_obj" | "key">;

export type InvoiceTermsProps = {
  value: string;
  org_id: number | null;
} & Pick<WarehouseProps, "id" | "label" | "name">;

export type ValuesProps = {
  payment_terms: any;
  vendor_id: any;
  due_date: string;
  end_date: string;
  reference: string;
  bill_date: string;
  adjustment: number;
  order_date: string;
  start_date: string;
  estimate_date: string;
  estimate_no: string;
  expiry_date: string;
  items: ItemProps[];
  customer_id: any;
  warehouse_id: number;
  invoice_date: string;
  repeat_duration: any;
  customer_note: string;
  sales_order_no: string;
  shipping_charge: number;
  sales_person_id: number;
  billing_address_id: any;
  terms_and_condition: string;
  expected_delivery_date: string;
  expected_shipment_date: string;
  invoice_terms: InvoiceTermsProps;
  discount_transaction_level: number;
};
export type CountryObjProps = {
  id: number;
  is_active: number;
  country_code: string;
  country_name: string;
};

export type BaseCurrecnyProps = {
  id: number;
  name: string;
  symbol: string;
  created_at: string;
  created_by: number;
  updated_at: string;
  platform_type: string;
  currency_code: string;
  exchange_rate: number;
  organization_id: number;
  deleted_at: null | string;
  basic_currency_status: boolean;
};
export type dataCurrency = {
  base_currency: BaseCurrecnyProps;
  data: any | undefined;
};

export type CustomerObjProps = {
  id: number;
  email: string;
  last_name: string;
  first_name: string;
  salutation: string;
  company_name?: string;
  display_name: string;
  contact_type: string;
  country_name?: string;
  payment_mode_name?: string;
  has_transaction: boolean;
  attach_with_item: boolean;
  photo?: string;
};

export interface ItemObjProps {
  id: number;
  sku: string;
  type: string;
  name: string;
  unit: string;
  upc: string;
  ean: string;
  mpn: string;
  isbn: string;
  images: string[];
  is_active: number;
  inventory_type: string;
  stocks: {
    id: number;
    item_id: number;
    warehouse_id: number;
    physical_quantity: number;
    accounting_quantity: number;
  }[];
}

export type WarehouseProps = {
  id: number;
  key?: string;
  name: string;
  city: string;
  label: string;
  state: string;
  phone: string;
  email: string;
  address: string;
  zip_code: string;
  is_active: number;
  country_id: number;
  created_at: string;
  created_by: number;
  deleted_at: string;
  updated_at: string;
  is_primary: boolean;
  platform_type: string;
  organization_id: number;
  country: CountryObjProps;
  opening_stock: number | null;
};

export type ItemTaxProps = {
  id: number;
  rate: number;
  name: string;
  authority: string;
};
