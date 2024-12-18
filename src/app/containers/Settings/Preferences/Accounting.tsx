import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Form, Typography } from "antd";
import { Labels } from "static";
import { capitalize } from "utils";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { Breadcrumbx, Buttonx, Selectx, Spinner, Toast } from "app/shared";
import MapOldAccounts from "app/containers/chartOfAccounts/MappingOldAccounts";

const initialState = {
  sales_shipping: null,
  account_payable: null,
  discount_account: null,
  accounts_receivable: null,
  opening_balance_equity: null,
};

export const Accounting = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { checkPermission, permissions } = usePermissions();
  const [mapModal, setMapModal] = useState(false);
  const [accountMapping, setAccountMapping] = useState<any>();
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const { has_AccountsCreate_permission } = checkPermission("AccountsCreate");
  const { has_AccountsPreferenceEdit_permission } = checkPermission("AccountsPreferenceEdit");

  useEffect(() => {
    callAxios({
      url: `/accounts_mapping`,
    }).then((res) => {
      setAccountMapping(res);
      setHasContentLoading(false);
    });
  }, []);

  const toggleMapModal = () => setMapModal(!mapModal);
  const onSubmit = (values) => {
    const accounts = {
      ...values,
    };
    toggle();
    callAxios({
      method: "put",
      url: `/accounts_mapping/update`,
      data: { accounts },
    }).then((res) => {
      toggle();
      if (res) {
        Toast({ message: res?.message || "" });
      }
    });
  };

  //@ts-ignore
  const GenaricSelectX = ({ accounts, options }) => {
    return (
      <div className="form_group flex-47">
        <Selectx
          size="large"
          loading={false}
          options={options}
          allowClear={false}
          name={accounts?.slug}
          label={accounts.name}
          className="input_field"
          initialValue={accounts?.selected_value}
          placeholder={`Select ${accounts.slug}`}
          disabled={accounts?.disabled_for_organization}
          popupClassName="dropdown--scroll"
        />
      </div>
    );
  };
  return (
    <>
      {hasContentLoading ? (
        <Spinner directionSize={"90vh"} />
      ) : (
        <>
          <div className="main_wrapper">
            <Breadcrumbx
              setting={true}
              name="Accounting"
              className="navigate"
              toggleMapModal={toggleMapModal}
              seconderyBtn={
                permissions?.superAccess && accountMapping?.show_old_account_mapping_button
              }
            />
            <div className="_container">
              <Typography.Title level={4} className="form_heading">
                Account Mapping
              </Typography.Title>
              <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                name="create-role-form"
                initialValues={initialState}
              >
                <div className="form-row-container">
                  {accountMapping?.title.map((accountTitle, index) => (
                    <div key={index} className="form_box">
                      <div className="switch_group">
                        <Typography.Text strong className="switch-label">
                          {accountTitle === "ar/ap" ? "AR/AP" : capitalize(accountTitle)}
                        </Typography.Text>
                      </div>
                      <div className="flexbox justify_between">
                        {accountMapping?.mapping_accounts?.map(
                          //@ts-ignore
                          (accounts) =>
                            accounts.type === accountTitle && (
                              <GenaricSelectX accounts={accounts} options={accounts?.options} />
                            )
                        )}
                      </div>
                    </div>
                  ))}

                  {has_AccountsPreferenceEdit_permission ? (
                    <div className="form_box">

                    
                    <div className="button_flexbox mt-33">
                      <Buttonx
                        htmlType="button"
                        btnText={Labels.CANCEL}
                        clickHandler={() => navigate(-1)}
                        className="btn-default btn-form-size cate_cancel_btn mr-20"
                      />
                      <Buttonx
                        block
                        loading={bool}
                        btnText={Labels.SAVE}
                        className="btn-form-size btn-primary"
                      />
                    </div>
                    </div>
                  ) : null}
                </div>
              </Form>
            </div>
          </div>
          {mapModal && (
            <MapOldAccounts
              bool={mapModal}
              toggle={toggleMapModal}
              has_permission={has_AccountsCreate_permission}
            />
          )}
        </>
      )}
    </>
  );
};
