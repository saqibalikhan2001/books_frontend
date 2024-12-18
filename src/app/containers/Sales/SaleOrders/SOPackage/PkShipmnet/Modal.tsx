/** @format */

import { Modal } from "antd";
import { ShipmentForm } from "./Form";

export const ShipmentModal = ({ url, loading, onSubmit, showModal, toggleModal }: any) => {
  return (
    <>
      <Modal
        title="Create Shipment"
        width={1000}
        open={showModal}
        style={{ top: 0 }}
        destroyOnClose
        onOk={toggleModal}
        maskClosable={false}
        onCancel={toggleModal}
        footer={null}
      >
        <ShipmentForm onSubmit={onSubmit} loading={loading} toggleModal={toggleModal} url={url} />
      </Modal>
    </>
  );
};
