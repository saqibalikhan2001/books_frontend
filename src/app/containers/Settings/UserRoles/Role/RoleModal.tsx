/** @format */

import { Form, Modal } from "antd";
import { Labels } from "static";
import { RoleForm } from "./RoleForm";
import { RoleFormProps } from "../Types";
import { AccessDenied } from "app/shared";
import { setPermissionsList, resetPermissions } from "./roles";

export const RoleModal = ({
  bool,
  toggle,
  current,
  loading,
  onSubmit,
  setAlert,
  roleAlert,
  dispatch,
  has_permission,
  itemPermissions,
}: RoleFormProps) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    toggle?.();
    setPermissionsList([]);
    dispatch({ type: "clear", payload: [] });
    setAlert(false);
    resetPermissions();
    form.resetFields();
  };

  return (
    <>
      <Modal
        // title={`${current?.name ? Labels.UPDATE : Labels.CREATE} ${Labels.ROLE}`}
        title={Labels.ROLE_INFO}
        bodyStyle={{
          top: 0,
          maxHeight: "600px",
          paddingLeft: "24px",
          paddingRight: "24px",
          overflowY: "scroll",
        }}
        width={1000}
        footer={null}
        open={bool}
        destroyOnClose
        maskClosable={false}
        onCancel={handleCancel}
      >
        {has_permission ? (
          <RoleForm
            loading={loading}
            current={current}
            dispatch={dispatch}
            onSubmit={onSubmit}
            roleAlert={roleAlert}
            handleCancel={handleCancel}
            itemPermissions={itemPermissions}
          />
        ) : (
          <AccessDenied />
        )}
      </Modal>
    </>
  );
};
