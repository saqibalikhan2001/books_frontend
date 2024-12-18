export type AuthRequest = {
  email: string;
  password: string;
};

export type Tokens = {
  access_token: string;
  expires_in: string;
  id_token: string;
  refresh_token: string;
  token_type: string;
};

export type Loading = {
  loading?: boolean;
  error?: object;
};

export type RolePermissions = {
  name: string;
  type: string;
  id: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  permissions: object;
  platform_type: string;
  deleted_at: string | null;
  organization_id: string | number | null;
};

export type GeneralModules = {
  name: string;
  slug: string;
  status: boolean;
  id: number | null;
  platform_type: string;
  organization_id: number | null;
  general_modules_id: number | null;
}[];

export type UserOrganizations = {
  id: number | null;
  name: string;
  status: boolean;
  owner_id: number;
  is_owner: boolean;
  created_at: string;
  is_active: boolean;
  is_shared: boolean;
  is_default: boolean;
  date_format: string;
  logo: string | null;
  exact_owner: boolean;
  phone: string | null;
  is_unshared: boolean;
  has_contacts: boolean;
  platform_type: string;
  fiscal_year_id: number;
  base_currency_id: number;
  time_zone: string | null;
  license_no: string | null;
  has_items: boolean | null;
  country_id: number | null;
  created_by_platform: string;
  company_city: string | null;
  organization_type_id: number;
  company_street: string | null;
  company_website: string | null;
  time_zone_offset: string | null;
  company_province: string | null;
  company_postal_code: string | null;
  inventory_start_date: string | null;
  primary_contact_name: string | null;
  primary_warehouse_id: number | null;
  primary_contact_email: string | null;
  module_permissions: GeneralModules;
};

export interface AuthSlice {
  token: Tokens;
  details: {
    platform_type: string;
    current_organization_id: number | null;
    id: number | null;
  };
  users_organizations: UserOrganizations[];
  role: RolePermissions;
  organization_id: string;
  loading: boolean;
  error: any;
  modulePermissionModal: boolean;
  drawer: boolean;
}

export interface Navigation {
  open: boolean;
  width: number;
}
