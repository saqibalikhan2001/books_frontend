import { Button, Modal, Row, Space, Typography } from "antd";
import { Labels } from "static";
import { ConfirmProps } from "./types";

export const ConfirmPopup = ({ text, isModalOpen, handleConfirm, toggleModal }: ConfirmProps) => {
  return (
    <Modal
      centered
      width={400}
      footer={null}
      destroyOnClose
      closable={false}
      open={isModalOpen}
      maskClosable={false}
      className="radius-5 default_modal"
    >
      <Space>
        <Typography.Text>{text ? text : "Do you really want to confirm this?"}</Typography.Text>
      </Space>
      <Row justify="center">
          <Button className="btn-form-size btn-default mr-20" onClick={toggleModal}>
            {Labels.NO}
          </Button>
          <Button className="btn-form-size btn-primary" onClick={handleConfirm}>
            {Labels.YES}
          </Button>
      </Row>
    </Modal>
  );
};
