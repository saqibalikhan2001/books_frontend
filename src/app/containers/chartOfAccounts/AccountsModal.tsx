/** @format */

import { Modal } from "antd";
import { Labels } from "static";
import { AccountsForm } from "./Form";
import { removeKeyFromSS } from "utils";
import { AccessDenied } from "app/shared";
import { AccountFormProps } from "./types";

export const AccountsModal = ({
  edit,
  url,
  bool,
  toggle,
  loading,
  account,
  onSubmit,
  isItemForm,
  setEditAccount,
  has_permission,
}: AccountFormProps) => {
  return (
    <Modal
      centered
      open={bool}
      width={940}
      footer={null}
      destroyOnClose
      style={{ top: 0 }}
      maskClosable={false}
      className="create-account-modal"
      wrapClassName="generic_modal_style"
      afterClose={() => removeKeyFromSS("accountModal")}
      title={edit ? Labels?.EDIT_ACCOUNT : Labels.CREATE_ACCOUNT}
      closeIcon={
        <img
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          alt="close Icon"
        />
      }
      onCancel={() => {
        toggle();
        setEditAccount(null);
        removeKeyFromSS("accountModal");
      }}
    >
      {has_permission ? (
        <AccountsForm
          url={url}
          edit={edit}
          toggle={toggle}
          account={account}
          loading={loading}
          onSubmit={onSubmit}
          isItemForm={isItemForm}
          setEditAccount={setEditAccount}
        />
      ) : (
        <AccessDenied />
      )}
    </Modal>
  );
};
