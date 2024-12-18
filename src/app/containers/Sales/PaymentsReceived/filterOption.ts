export const status = [
  { id: "all", label: "All" },
  { id: "applied", label: "Applied" },
  { id: "unapplied", label: "Unapplied" },
  { id: "prtl-applied", label: "Partially applied" },
];

export const date_range = [
  {
    key: 1,
    value: "custom",
    label: "Custom",
  },
  {
    key: 2,
    value: "today",
    label: "Today",
  },
  {
    key: 3,
    value: "yesterday",
    label: "Yesterday",
  },
  {
    key: 4,
    value: "this_week",
    label: "This week",
  },
  {
    key: 5,
    value: "this_month",
    label: "This month",
  },
  {
    key: 6,
    value: "this_quarter",
    label: "This Quarter",
  },
  {
    key: 7,
    value: "this_year",
    label: "This Year",
  },
  {
    key: 8,
    value: "last_week",
    label: "Last week",
  },
  {
    key: 9,
    value: "last_month",
    label: "Last month",
  },
  {
    key: 10,
    value: "last_quarter",
    label: "Last Quarter",
  },
  {
    key: 11,
    value: "last_year",
    label: "Last Year",
  },
  {
    key: 12,
    value: "last_365_days",
    label: "Last 365 days",
  },
];

export const FilterSort = [
  { id: "status", label: "Sort by status" },
  { id: "payment_date", label: "Sort by date" },
  { id: "created_at", label: "Sort by latest" },
  { id: "payment_mode", label: "Sort by mode" },
  { id: "due_date", label: "Sort by due date" },
  { id: "payment_made", label: "Sort by amount" },
  { id: "unused_amount", label: "Sort by credit" },
  { id: "display_name", label: "Sort by customer" },
  { id: "payment_no", label: "Sort by payment number" },
  { id: "invoice_no", label: "Sort by invoice number" },
  { id: "reference", label: "Sort by reference number" },
];
