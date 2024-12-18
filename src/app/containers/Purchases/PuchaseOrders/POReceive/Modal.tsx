/** @format */

import { Modal } from "antd";
import { AccessDenied } from "app/shared";
import { ReceiveModalProps } from "./Types";
import { ReceiveForm } from "./ReceiveForm";

const ReceiveModal = ({
  url,
  loading,
  onSubmit,
  showModal,
  closeModal,
  handleItemList,
  has_permission,
}: ReceiveModalProps) => {
  return (
    <>
      <Modal
        title="New Receive"
        width={1100}
        footer={null}
        destroyOnClose
        open={showModal}
        onOk={closeModal}
        maskClosable={false}
        style={{ top: 110 }}
        onCancel={closeModal}
      >
        {has_permission ? (
          <ReceiveForm
            isModal
            url={url}
            loading={loading}
            close={closeModal}
            onSubmit={onSubmit}
            handleItemList={handleItemList}
          />
        ) : (
          <AccessDenied />
        )}
      </Modal>
    </>
  );
};

export default ReceiveModal;
