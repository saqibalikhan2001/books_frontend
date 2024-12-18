export type SharedPopupProps = {
  info: string;
  value: string;
  title: string;
  onConfirm: () => void;
};

export type PreferenceTabsProps = {
  current: string;
  handleChange: (curr: string) => void;
};

export type POSubmitProps = {
  terms: object;
  po: string;
};
export type SOSubmitProps = {
  terms: object;
  so: string;
  E_time: Number;
  E_duration: string;
  time: Number;
  duration: string;
  show_admin_records: boolean;
  estimate_to_invoice_status: any;
  estimate_to_saleorders_status: any;
};
