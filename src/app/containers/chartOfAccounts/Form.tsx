import { useEffect, useState } from "react";
import { Checkbox, Form, Input, Radio, Statistic, Typography } from "antd";
import dayjs from "dayjs";
import { Content, Labels } from "static";
import { optimizeValues, rules } from "utils";
import {
  Toast,
  Selectx,
  Spinner,
  Buttonx,
  InputField,
  DatePickerx,
  InputNumberX,
} from "app/shared";
import { NegativeNumber } from "app/shared/NegativeNumber";
import { useAxios, useCreateFormApi, useStore } from "app/Hooks";

const todayDate = dayjs(new Date());

const restrictedArray = ["accounts_payable", "accounts_receivable"];

const initialState = {
  title: "",
  tax_id: null,
  currency: null,
  original_cost: null,
  bank_account_no: "",
  account_type_id: null,
  is_sub_account: false,
  account_category_id: 1,
  parent_account_id: null,
  account_subtype_id: null,
  balance_date: todayDate,
  depreciation_date: todayDate,
  is_depreciation_asset: false,
  original_cost_date: todayDate,
  balance: { sign: "+", value: (0).toFixed(2) },
};

export function AccountsForm({
  url,
  toggle,
  loading,
  onSubmit,
  isItemForm,
  edit = false,
  setEditAccount,
  account: accountData,
}) {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const { org_date_format } = useStore();
  const [typeSlug, setTypeSlug] = useState("");
  const [subTypeSlug, setSubTypeSlug] = useState("");
  const [accountTypes, setAccountTypes] = useState<any>([]);
  const [parentAccounts, setParentAccounts] = useState<any>([]);
  const [accountSubTypes, setSubAccountTypes] = useState<any>([]);
  const [isMarkedbalanceSheet, setIsMarkedBalanceSheet] = useState(false);
  const {
    formLoading,
    details: {
      taxes = [],
      account = {},
      currency = {},
      account_no = "",
      account_types = [],
      parent_accounts = [],
      account_subtypes = [],
      account_categories = [],
      selected_category_id = null,
    },
  } = useCreateFormApi(url, true);
  const balance = Form.useWatch("balance", form);
  const original_cost = Form.useWatch("original_cost", form);
  const is_sub_account = Form.useWatch("is_sub_account", form);
  const account_type_id = Form.useWatch("account_type_id", form);
  const account_subtype_id = Form.useWatch("account_subtype_id", form);
  const account_category_id = Form.useWatch("account_category_id", form);
  const depreciation_amount = Form.useWatch("depreciation_amount", form);
  const is_depreciation_asset = Form.useWatch("is_depreciation_asset", form);

  useEffect(() => {
    if (is_sub_account) handleSubAccount();
  }, [account_type_id, account_subtype_id, account_category_id]);

  useEffect(() => {
    if (account_subtypes.length && account_types.length) {
      setAccountTypes(account_types);
      setSubAccountTypes(account_subtypes);
    }
  }, [account_subtypes, account_types]);

  useEffect(() => {
    if (!edit && account_types.length && account_subtypes.length) {
      form.setFieldsValue({
        account_type_id: { id: account_types[0].id, label: account_types[0].label },
        account_subtype_id: account_subtypes[0],
        account_category_id: selected_category_id,
      });
      form.setFieldValue("currency", currency);
      form.setFieldValue("account_no", account_no ? account_no : null);
      setTypeSlug(account_types[0]?.basic_type?.slug);
      setSubTypeSlug(account_subtypes[0]?.basic_sub_type?.slug);
      setIsMarkedBalanceSheet(!!account_categories[isItemForm ? 4 : 0].balance_sheet);
    }
  }, [account_categories, currency, account_no]);
  useEffect(() => {
    if (account && Object.keys(account).length) {
      form.setFieldsValue({
        ...account,
        balance: optimizeValues(account?.balance),
        account_subtype_id: {
          id: account?.account_subtype_id,
          label: account?.account_sub_type.name,
        },
        balance_date: account?.balance_date ? dayjs(account?.balance_date) : todayDate,
        depreciation_date: account?.depreciation_date
          ? dayjs(account?.depreciation_date)
          : todayDate,
        original_cost_date: account?.original_cost_date
          ? dayjs(account?.original_cost_date)
          : todayDate,
      });
      form.setFieldValue("currency", currency);
      setParentAccounts(parent_accounts);
      setTypeSlug(account?.account_type?.basic_type?.slug);
      setSubTypeSlug(account?.account_sub_type?.basic_sub_type?.slug);
      setIsMarkedBalanceSheet(!!account?.account_category?.balance_sheet);
    }
  }, [account, currency]);
  const handleCategories = (e) => {
    const value = e.target.value;
    const current = account_categories.find((cate) => cate.id === value);
    form.setFieldsValue({ parent_account_id: null, is_sub_account: false });

    if (value) {
      setIsMarkedBalanceSheet(!!current.balance_sheet);
      callAxios({
        url: `accounts/types/${value}`,
      })
        .then((res) => {
          if (res) {
            form.setFieldsValue({
              account_subtype_id: res?.account_subtypes[0]?.id,
              account_type_id: res?.account_types[0]?.id,
            });
            setTypeSlug(res?.account_types[0]?.basic_type?.slug);
            setSubTypeSlug(res?.account_subtypes[0]?.basic_sub_type?.slug);
            setAccountTypes(res.account_types || []);
            setSubAccountTypes(res?.account_subtypes || []);
          }
        })
        .catch(() => Toast({ message: "Could not fetch account types" }));
    }
  };
  const handleAccountTypes = (value) => {
    const current = accountTypes.find((type) => type.id === value);

    if (current?.basic_type?.slug !== "depreciable_assets") {
      form.setFieldsValue({ is_depreciation_asset: false });
    }
    setTypeSlug(current?.basic_type?.slug);

    form.setFieldsValue({ parent_account_id: null, is_sub_account: false });
    callAxios({
      url: `accounts/subtypes/${value}`,
    })
      .then((res) => {
        if (res) {
          form.setFieldsValue({ account_subtype_id: res?.account_subtypes[0]?.id });
          setSubAccountTypes(res.account_subtypes || []);
          setSubTypeSlug(res?.account_subtypes[0]?.basic_sub_type?.slug);
        }
      })
      .catch(() => Toast({ message: "Could not fetch account sub types" }));
  };

  const handleAccountSubType = (value) => {
    const current = accountSubTypes.find((type) => type.id === value);
    if (current?.basic_sub_type?.slug !== "depreciable_assets") {
      form.setFieldsValue({ is_depreciation_asset: false });
    }
    setSubTypeSlug(current?.basic_sub_type?.slug);
    form.setFieldsValue({ parent_account_id: null, is_sub_account: false });
    setParentAccounts([]);
  };

  const handleSubAccount = () => {
    const isChecked = form.getFieldValue("is_sub_account");
    if (isChecked) {
      const subtypeId =
        typeof account_subtype_id === "object" ? account_subtype_id.id : account_subtype_id;
      const acctypeId = typeof account_type_id === "object" ? account_type_id.id : account_type_id;
      const url = edit
        ? `accounts/parent/${account_category_id}/${acctypeId}/${subtypeId}${
            edit ? "?account_id=" + accountData.id + "&type=edit" : ""
          }`
        : `accounts/parent/${account_category_id}/${acctypeId}/${subtypeId}`;
      callAxios({
        url,
      })
        .then((res) => {
          if (res && !edit) {
            form.setFieldsValue({ account_sub_type: null, parent_account_id: null });
            setParentAccounts(res.parent_accounts);
          } else {
            setParentAccounts(res.parent_accounts);
          }
        })
        .catch(() => Toast({ message: "Could not fetch parent accounts" }));
    } else {
      form.setFieldsValue({ parent_account_id: null, is_sub_account: false });
      form?.validateFields(["parent_account_id"]);
    }
  };
  return (
    <>
      {formLoading ? (
        <div className="vh-100-275">
          <Spinner />
        </div>
      ) : (
        <div className="_container px-30 create-new-acc">
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            requiredMark={false}
            initialValues={initialState}
            name={`${Labels.ENTER}-${Labels.ACCOUNT}`}
          >
            <div className="d-flex">
              <Form.Item
                colon={false}
                labelAlign="left"
                name="account_category_id"
                label={
                  <label className="d-flex mb-8">
                    Account category
                    <span className="staric">*</span>
                  </label>
                }
                rules={rules({ message: Content.enter_account_category })}
              >
                <Radio.Group
                  onChange={handleCategories}
                  className="d-flex flex-column account_category_list"
                >
                  {account_categories.map((category) => (
                    <Radio
                      key={category?.id}
                      value={category?.id}
                      style={{ width: "fit-content" }}
                      disabled={
                        (edit && (account.is_default === 1 || account.has_child_account)) ||
                        isItemForm
                      }
                    >
                      {category.name}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </div>
            <div className="flexbox justify_between mb-30">
              <div className="form_group flex-47  ">
                <Selectx
                  required
                  size="large"
                  allowClear={false}
                  options={accountTypes}
                  name="account_type_id"
                  label={Labels.ACCOUNT_TYPE}
                  handleChange={handleAccountTypes}
                  placeholder={"Select account type"}
                  popupClassName={"overlap dropdown--scroll"}
                  disabled={
                    !Boolean(account_category_id) ||
                    (edit && (account.is_default === 1 || account.has_child_account)) ||
                    isItemForm
                  }
                />
              </div>
              <div className="form_group flex-47  ">
                <Selectx
                  required
                  size="large"
                  allowClear={false}
                  options={accountSubTypes}
                  name="account_subtype_id"
                  label={Labels.ACCOUNT_SUB_TYPE}
                  placeholder={"Select sub-type"}
                  handleChange={handleAccountSubType}
                  popupClassName={"overlap dropdown--scroll"}
                  disabled={
                    !Boolean(account_type_id) ||
                    (edit && account.is_default === 1) ||
                    account.has_child_account ||
                    isItemForm
                  }
                />
              </div>
            </div>
            <div className="flexbox justify_between mb-30">
              <div className="form_group flex-47  ">
                <InputField
                  required
                  form={form}
                  size="large"
                  name="title"
                  className=""
                  label={Labels._ACCOUNT_NAME}
                  placeholder={`Enter account name`}
                  disabled={edit && !accountData?.can_rename}
                  rules={[
                    ...rules({ message: Content.enter_account_name }),
                    { message: "No more than 100 characters.", max: 100, type: "string" },
                  ]}
                />
              </div>
              <div className="form_group flex-47 ">
                <InputField
                  form={form}
                  className=""
                  size="large"
                  name="account_no"
                  label={Labels.ACCOUNT_NO}
                  placeholder={`Enter account number`}
                  rules={[{ message: "No more than 100 Characters.", max: 100, type: "string" }]}
                />
              </div>
            </div>
            <div className="flexbox justify_between mb-30">
              <div className="form_group flex-47">
                <Form.Item
                  name="description"
                  className="flex_root"
                  label={<span className="form--label_style mb-5">{Labels.DESCRIPTION}</span>}
                >
                  <Input.TextArea
                    rows={4}
                    showCount
                    maxLength={1000}
                    placeholder="Enter account description"
                    onChange={(e: any) => {
                      const { value } = e.target;
                      const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                      form.setFieldValue("description", formattedValue);
                    }}
                  />
                </Form.Item>
              </div>

              <div className="form_group flex-47">
                {typeSlug === "bank_accounts" && (
                  <div className="form_group mb-30">
                    <InputField
                      form={form}
                      size="large"
                      className=""
                      name="bank_account_no"
                      label={Labels.BANK_ACCOUNT_NO}
                      placeholder={`Enter bank account number`}
                      rules={[
                        { message: "No more than 100 Characters.", max: 100, type: "string" },
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flexbox justify_between mb-30">
              <div className="form_group flex-47 ">
                <div className="d-flex">
                  <Form.Item name="is_sub_account" valuePropName="checked" noStyle>
                    <Checkbox
                      onChange={handleSubAccount}
                      className="mt-3 flex-shrink-0"
                      // disabled={!(account_category_id && account_type_id && account_subtype_id)}
                    >
                      Is sub account
                    </Checkbox>
                  </Form.Item>
                  <Selectx
                    size="large"
                    loading={false}
                    allowClear={false}
                    options={parentAccounts}
                    name="parent_account_id"
                    disabled={!is_sub_account}
                    placeholder="Parent account"
                    className="mw-250 minimum--width"
                    popupClassName="overlap dropdown--scroll"
                    rules={rules({
                      message: Content.select_parent_account,
                      required: is_sub_account,
                    })}
                  />
                </div>
              </div>
              <div className="form_group flex-47 ">
                <Selectx
                  disabled
                  required
                  size="large"
                  className=""
                  name="currency"
                  loading={false}
                  allowClear={false}
                  label={Labels.BASE_CURRENCY}
                  placeholder="Select currency"
                  options={[{ id: 21, label: "USD" }]}
                  popupClassName="dropdown--scroll overlap"
                  rules={rules({ message: Content.enter_base_currency })}
                />
              </div>
            </div>
            <div className="flexbox justify_between mb-30">
              <div className="form_group flex-47  ">
                <Selectx
                  size="large"
                  className=""
                  name="tax_id"
                  loading={false}
                  label="Default tax"
                  placeholder="Select default tax"
                  popupClassName="overlap dropdown--scroll"
                  options={taxes?.map((value) => {
                    return { id: value?.id, label: `${value.name} (${value.rate}%)` };
                  })}
                />
              </div>
              <div className="form_group flex-47 ">
                {typeSlug === "depreciable_assets" &&
                  subTypeSlug === "depreciable_assets" &&
                  !edit && (
                    <>
                      <div className="form_group flex-47 mb-5">
                        <Form.Item
                          className=""
                          colon={false}
                          name="original_cost"
                          label="Original cost"
                        >
                          <InputNumberX
                            allowDecimal
                            disabled={edit}
                            id="original_cost"
                            value={original_cost}
                            // onBlur={() => {
                            //   if (!original_cost) form.setFieldValue("original_cost", 0);
                            // }}
                            onChange={(value) => form.setFieldValue("original_cost", value)}
                          />
                        </Form.Item>
                      </div>
                      <div className="form_group mb-10">
                        <DatePickerx
                          disabled
                          popupClassName="overlap"
                          format={org_date_format}
                          name="original_cost_date"
                          label="Original cost as of date"
                        />
                      </div>
                      <div className="form_box checked_clr">
                        <div className="flexbox form-row-container justify-content-between">
                          <div className="form_group flex-47 mb-5">
                            <Form.Item name="is_depreciation_asset" valuePropName="checked" noStyle>
                              <Checkbox className="mt-3">Track depreciation of the asset</Checkbox>
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                      {is_depreciation_asset && (
                        <>
                          <div className="form_group flex-47 mb-5">
                            <Form.Item
                              colon={false}
                              className=""
                              label="Depreciation"
                              name="depreciation_amount"
                            >
                              <InputNumberX
                                disabled={edit}
                                allowDecimal
                                id="depreciation_amount"
                                value={depreciation_amount}
                                // onBlur={() => {
                                //   if (!depreciation_amount) form.setFieldValue("depreciation_amount", 0);
                                // }}
                                onChange={(value) =>
                                  form.setFieldValue("depreciation_amount", value)
                                }
                              />
                            </Form.Item>
                          </div>
                          <div className="form_group mb-10">
                            <DatePickerx
                              disabled
                              format={org_date_format}
                              popupClassName="overlap"
                              name="depreciation_date"
                              label="Depreciation as of date"
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
              </div>
            </div>
            {!edit ? (
              <>
                {isMarkedbalanceSheet &&
                  !restrictedArray.includes(typeSlug) &&
                  subTypeSlug !== "depreciable_assets" && (
                    <>
                      <div className="flexbox justify_between mb-30 balance_field">
                        <>
                          <div className="form_group flex-47 ">
                            <Form.Item
                              className=""
                              colon={false}
                              name="balance"
                              label={<span className="form--label_style mb-5">Balance</span>}
                            >
                              <NegativeNumber
                                form={form}
                                value={balance}
                                disabled={edit}
                                name={"balance"}
                                currency={currency?.symbol}
                              />
                            </Form.Item>
                          </div>
                          <div className="form_group flex-47">
                            <DatePickerx
                              disabled
                              size="large"
                              name="balance_date"
                              format={org_date_format}
                              popupClassName="overlap"
                              label="Balance As of date"
                            />
                          </div>
                        </>
                      </div>
                    </>
                  )}
              </>
            ) : (
              <div>
                <Typography>Current Balance</Typography>
                <Statistic
                  precision={2}
                  className="no-space"
                  prefix={currency?.symbol}
                  valueStyle={{ fontSize: "14px" }}
                  value={account?.account_current_balance || 0}
                />
              </div>
            )}
            <div className="button_flexbox flex-end mb-50">
              <Buttonx
                htmlType="button"
                btnText={Labels.CANCEL}
                clickHandler={() => {
                  setEditAccount?.(null);
                  toggle();
                }}
                className="btn-default btn-form-size cate_cancel_btn mb-30 mr-20"
              />
              <Buttonx
                block
                loading={loading}
                btnText={Labels.SAVE}
                className="btn-form-size btn-primary mb-30"
              />
            </div>
          </Form>
        </div>
      )}
    </>
  );
}
