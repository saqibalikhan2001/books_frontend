import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Alert, Form, Typography, Modal, Space, Row, Button } from "antd";
import { rules } from "utils";
import { Labels, routeNames } from "static";
import { useAxios, useBool, useStore } from "app/Hooks";
import { useTypedDispatch, useTypedSelector } from "store";
import { Buttonx, Selectx, Spinner, Toast } from "app/shared";
import { getAccountStatus } from "store/slices/accountsSlice";

const MAPAccountsForm = ({
  data = [],
  modal = false,
  hasContentLoading,
  handleClose = () => {},
}: any) => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const dispatch = useTypedDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { created_by_platform, current_organization_id } = useStore();
  const { account_options = [], accounts = [] } = data;
  const [disabledOption, setDisabledoption] = useState<any>([]);
  const selector = useTypedSelector((state: any) => state?.accountRedecer);

  useEffect(() => {
    if (selector?.status === false) navigate(routeNames.DASHBOARD, { replace: true });
  }, []);
  const confirmSubmit = () => {
    setIsModalOpen(true);
  };
  const handleModalConfirm = () => {
    const values = form.getFieldsValue();
    onSubmit(values);
    setIsModalOpen(false);
  };
  const onSubmit = (values) => {
    toggle();
    callAxios({
      method: "put",
      url: `/old_accounts/update`,
      data: { value: values },
    }).then((res) => {
      toggle();
      if (res) {
        Toast({ message: res?.message || "" });
        if (!res.status && location?.pathname?.includes("/add-accounts")) {
          dispatch(
            getAccountStatus({ data: {}, method: "get", url: "/old_accounts", isAuth: true })
          ).then(() => {
            navigate("/dashboard");
          });
        }
        handleClose();
      }
    });
  };
  const handleDisableOption = () => {
    const formValues = form.getFieldsValue();
    const ids = Object.values(formValues) ?? [];
    const result = ids.filter((item) => !!item);
    setDisabledoption(result);
  };
  const handleCreate = () => {
    if (current_organization_id) navigate(`${routeNames.ORGANIZATION_CREATE}?org=create`);
  };
  return (
    <>
      {hasContentLoading ? (
        <Spinner directionSize={"91.6vh"} />
      ) : (
        <div className="main_wrapper">
          <div className="_container">
            {location?.pathname?.includes("add-accounts") && (
              <>
                <Alert
                  showIcon
                  type="info"
                  message="Informational Notes"
                  description="Kindly map IMS accounts with BMS accounts to proceed further."
                />
                <Typography.Title level={2}>
                  Map {`${created_by_platform == "books" ? "Books" : "IMS"}`} Accounts{" "}
                </Typography.Title>
              </>
            )}
            <Form
              form={form}
              layout="vertical"
              onFinish={confirmSubmit} // Use confirmSubmit instead of directly onSubmit
              requiredMark={false}
              name="map-account-form"
              onFieldsChange={handleDisableOption}
            >
              <div className="flexbox form-row-container justify-content-between flex-start">
                <div className="form_group flex-47">
                  {accounts?.map((oldAcc) => {
                    return (
                      <div key={oldAcc.id}>
                        <div className="form_group">
                          <Selectx
                            size="large"
                            loading={false}
                            allowClear={false}
                            label={oldAcc.title}
                            className="input_field"
                            options={account_options}
                            name={oldAcc?.id}
                            popupClassName={"color_class"}
                            disabledOption={disabledOption}
                            initialValue={oldAcc?.selected_id}
                            placeholder={`Select ${oldAcc.label}`}
                            rules={rules({
                              message: `${oldAcc.label} is required`,
                              required: true,
                            })}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="button_flexbox flex-end mb-30">
                {modal && (
                  <Buttonx
                    htmlType="button"
                    btnText={Labels.CANCEL}
                    clickHandler={handleClose}
                    className="btn-default btn-form-size cate_cancel_btn"
                  />
                )}
                <Buttonx
                  clickHandler={handleCreate}
                  htmlType="button"
                  btnText={"Create organization"}
                  className="btn-form-size btn-primary"
                />
                &nbsp; &nbsp; &nbsp;
                <Buttonx
                  block
                  loading={bool}
                  htmlType="submit"
                  btnText={Labels.SAVE}
                  className="btn-form-size btn-primary"
                />
              </div>
            </Form>
          </div>
        </div>
      )}
      <Modal
        centered
        footer={null}
        destroyOnClose
        closable={false}
        open={isModalOpen}
        maskClosable={false}
        width={400}
        className="radius-5 default_modal"
      >
        <Space>
          <Typography.Text>
            Are you sure you want to save the changes? If organization is shared, This will also
            affect IMS organization and cannot be reverted.
          </Typography.Text>
        </Space>
        <Row justify="center">
          <Space>
            <Button className="btn-form-size btn-default" onClick={() => setIsModalOpen(false)}>
              {Labels.CANCEL}
            </Button>
            <Button className="btn-form-size btn-primary" onClick={handleModalConfirm}>
              {Labels.SAVE}
            </Button>
          </Space>
        </Row>
      </Modal>
    </>
  );
};
export default MAPAccountsForm;
