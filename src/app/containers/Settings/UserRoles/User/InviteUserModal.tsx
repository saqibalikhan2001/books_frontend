/** @format */

import { Form, Modal } from "antd";
// import { Labels } from "static";
import { AccessDenied } from "app/shared";
import { InviteUserModalProps } from "../Types";
import { InviteUserForm } from "./InviteUserForm";
import { removeKeyFromSS } from "utils";

export const InviteUserModal = ({
  url,
  bool,
  toggle,
  isEdit,
  loading,
  onSubmit,
  has_permission,
}: InviteUserModalProps) => {
  const [form] = Form.useForm();

  const handleClose = () => {
    form.resetFields();
  };

  const handleCancel = () => {
    toggle();
    removeKeyFromSS("userModal");
  };

  return (
    <>
      <Modal
        title="Invite User"
        open={bool}
        footer={null}
        destroyOnClose
        onCancel={handleCancel}
        maskClosable={false}
        afterClose={handleClose}
        centered
        closeIcon={
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
            alt="close Icon"
          />
        }
        width={765}
        className="radius-5 "
        wrapClassName="generic_modal_style invite-popup"
      >
        {has_permission ? (
          <InviteUserForm
            url={url}
            isEdit={isEdit}
            loading={loading}
            onSubmit={onSubmit}
            toggle={handleCancel}
          />
        ) : (
          <AccessDenied />
        )}
      </Modal>
    </>
  );
};
