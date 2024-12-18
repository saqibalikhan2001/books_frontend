/** @format */

import { useEffect, useState } from "react";
import { Form } from "antd";
import { endpoints } from "static";
import { useAxios } from "app/Hooks";
import { Buttonx, Selectx, Spinner, Toast } from "app/shared";

const { FILTER_PREFERENCE } = endpoints;

export const AccountFilters = ({
  form,
  refetch,
  popOver,
  setparam,
  pagination,
  handleOpenChange,
  filterPreference,
}) => {
  const { callAxios, bool, toggle } = useAxios();
  const [account, setAccount] = useState<any>({
    account_types: [],
    account_subtypes: [],
  });
  let added_by_options = filterPreference?.added_by?.options || [];
  let categories_options = filterPreference?.account_category_id?.options || [];
  const category_id = Form.useWatch("account_category_id", form);

  useEffect(() => {
    handleCategories(pagination.account_category_id, "category");
  }, [popOver]);
  const handleCategories = (value, from) => {
    if (value) {
      toggle();

      callAxios({
        url: `accounts/types/${value}`,
      })
        .then((res) => {
          if (res) {
            setAccount({
              account_types: res?.account_types || [],
              account_subtypes: res?.account_subtypes || [],
            });
            if (from) {
              const acctype =
                filterPreference?.account_type_id?.options?.map((opt) => ({
                  id: opt?.id,
                  label: opt?.name,
                })) || [];

              const subtype =
                filterPreference?.account_subtype_id?.options?.map((opt) => ({
                  id: opt?.id,
                  label: opt?.name,
                })) || [];
              setAccount({
                account_types: acctype,

                account_subtypes: subtype,
              });
              handleAccount(pagination.account_subtype_id, "type");
              form.setFieldsValue({
                account_type_id: pagination.account_type_id,
              });
            } else
              form.setFieldsValue({
                account_type_id: res?.account_types[0],
                account_subtype_id: res?.account_subtypes[0],
              });
          }
        })
        .catch(() => Toast({ message: "Could not fetch account types" }));
    }
  };
  const handleAccount = (value, type) => {
    if (value) {
      callAxios({
        url: `accounts/subtypes/${value}`,
      })
        .then((res) => {
          toggle();
          if (res) {
            setAccount({
              ...account,
              account_subtypes: res?.account_subtypes || [],
            });
            if (type) {
              form.setFieldsValue({
                account_subtype_id: pagination.account_subtype_id,
              });
            } else {
              form.setFieldsValue({
                account_subtype_id: res?.account_subtypes[0],
              });
            }
          }
        })
        .catch(() => Toast({ message: "Could not fetch account types" }));
    }
  };
  const handleSave = () => {
    const values = form.getFieldsValue();
    const payload = {
      slug: "accounts",
      preferences: [
        {
          slug: "account_category_id",
          id: values?.account_category_id,
        },
        {
          slug: "account_type_id",
          id:
            typeof values?.account_type_id === "object"
              ? values?.account_type_id?.id
              : values?.account_type_id ?? "",
        },
        {
          slug: "account_subtype_id",
          id:
            typeof values?.account_subtype_id === "object"
              ? values?.account_subtype_id?.id
              : values?.account_subtype_id ?? "",
        },

        {
          slug: "added_by",
          id: values?.added_by,
        },
      ],
    };

    callAxios({
      method: "post",
      url: FILTER_PREFERENCE,
      data: payload,
    }).then((res) => {
      if (res) {
        Toast({ message: res?.message || "" });
        refetch();
      }
    });
  };
  const handleApply = () => {
    const values = form.getFieldsValue();
    setparam({
      ...pagination,
      added_by: values?.added_by ?? "",
      account_type_id:
        typeof values?.account_type_id === "object"
          ? values?.account_type_id?.id
          : values?.account_type_id ?? "",
      account_subtype_id:
        typeof values?.account_subtype_id === "object"
          ? values?.account_subtype_id?.id
          : values?.account_subtype_id ?? "",
      account_category_id: values?.account_category_id ?? "",
      is_applied: "true",
    });
    refetch();
    handleOpenChange(false);
  };
  return (
    <div className="_generic_popupover_main date_seprator_gap--fix">
      {bool ? (
        <div className="filter_loader">
          <Spinner />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 600 }}
          initialValues={{
            added_by: pagination.added_by || null,
            account_type_id: pagination.account_type_id || null,
            account_subtype_id: pagination.account_subtype_id || null,
            account_category_id: pagination.account_category_id || null,
          }}
        >
          <div className="form_group  mb-20">
            <Selectx
              valueLabel
              size="large"
              allowClear={false}
              handleSort={false}
              name="account_category_id"
              className="adjustment-field"
              options={categories_options}
              handleChange={handleCategories}
              placeholder="Select Account Category"
              popupClassName="overlap dropdown--scroll"
              label={filterPreference?.account_category_id?.label}
            />
          </div>
          <div className="form_group  mb-20">
            <Selectx
              size="large"
              loading={bool}
              handleSort={false}
              allowClear={false}
              name="account_type_id"
              disabled={!category_id}
              handleChange={handleAccount}
              className="adjustment-field"
              placeholder="Select Account Type"
              options={account?.account_types || []}
              popupClassName="overlap dropdown--scroll"
              label={filterPreference?.account_type_id?.label}
              value={form.getFieldValue("account_type_id") || undefined}
            />
          </div>
          <div className="form_group  mb-20">
            <Selectx
              size="large"
              handleSort={false}
              allowClear={false}
              disabled={!category_id}
              name="account_subtype_id"
              className="adjustment-field"
              placeholder="Select Account Subtype"
              popupClassName="overlap dropdown--scroll"
              label={filterPreference?.account_subtype_id?.label}
              // value={form.getFieldValue("account_subtype_id") || undefined}
              options={account?.account_subtypes?.sort((a, b) => a?.key - b?.key)}
            />
          </div>
          <div className="form_group  mb-20">
            <Selectx
              valueLabel
              size="large"
              name="added_by"
              handleSort={false}
              allowClear={false}
              options={added_by_options}
              className="adjustment-field"
              placeholder="Select Added By"
              popupClassName="overlap dropdown--scroll"
              label={filterPreference?.added_by?.label}
            />
          </div>
          <div className="d-flex _generic_popupover_actions">
            {import.meta.env.VITE_SHOW_SAVE === "true" && (
              <Buttonx
                btnText="Save"
                clickHandler={handleSave}
                className="btn-default space-right w-86px h-36px mr-10"
              />
            )}
            <Buttonx
              type="text"
              btnText="Reset"
              className="btn-default mr-10 w-96px h-36px"
              clickHandler={() => {
                form.setFieldsValue({
                  added_by: null,
                  account_type_id: null,
                  account_subtype_id: null,
                  account_category_id: null,
                });
              }}
            />
            <Buttonx
              btnText="Apply"
              clickHandler={handleApply}
              className="btn-primary w-96px h-36px"
            />
          </div>
        </Form>
      )}
    </div>
  );
};
