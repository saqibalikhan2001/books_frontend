/** @format */

import { Modal, Typography } from "antd";
import { ModalFunctions } from "./Types";

export const CategoryView = ({ isModalOpen, setIsModalOpen, modalData }: ModalFunctions) => {
  return (
    <>
      <Modal
        footer={null}
        destroyOnClose
        open={isModalOpen}
        onCancel={() => setIsModalOpen(!isModalOpen)}
        centered
        className="category_modal"
        width={540}
        wrapClassName="generic_modal_style"
        title={`Category`}
        closeIcon={
          <img
            alt="close Icon"
            className="btn-close"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          />
        }
      >
        <div className=" d-flex justify_between flex-md-column-reverse res-gap">
          <div className="product_note">
            <Typography.Title level={5} className="fw-md f--bold">
              Category Name:
            </Typography.Title>
          </div>
          <Typography.Text className="text mb-20">{modalData?.name}</Typography.Text>
        </div>
        <div className=" d-flex justify_between flex-md-column-reverse res-gap">
          <div className="product_note">
            <Typography.Title level={5} className="fw-md f--bold">
              Total Products:
            </Typography.Title>
          </div>
          <Typography.Text className="text mb-20">{modalData?.item_count}</Typography.Text>
        </div>
        <div className=" justify_between flex-md-column-reverse res-gap">
          <div className="product_note">
            <Typography.Title level={5} className="fw-md f--bold">
              Category Description:
            </Typography.Title>
          </div>
          <Typography.Text className="text mb-20">{modalData?.description}</Typography.Text>
        </div>
      </Modal>
    </>
  );
};
