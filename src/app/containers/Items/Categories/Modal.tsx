/** @format */

import { Form, Modal } from "antd";
import { Labels } from "static";
import { CategoryForm } from "./Form";
import { ModalFunctions } from "./Types";

const { CREATE_CATEGORY, UPDATE_CATEGORY } = Labels;

export const CategoryModal = ({
  current,
  loading,
  onSubmit,
  isModalOpen,
  edit = false,
  setIsModalOpen,
  formLoading = false,
}: ModalFunctions) => {
  const [form] = Form.useForm();
  const handleClose = () => form.resetFields();

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        centered
        width={540}
        footer={null}
        destroyOnClose
        open={isModalOpen}
        onCancel={handleCancel}
        afterClose={handleClose}
        className="category_modal minimum-height"
        wrapClassName="generic_modal_style"
        title={edit ? UPDATE_CATEGORY : CREATE_CATEGORY}
        closeIcon={
          <img
            alt="close Icon"
            className="btn-close"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          />
        }
      >
        <CategoryForm
          form={form}
          edit={edit}
          loading={loading}
          current={current}
          onSubmit={onSubmit}
          formLoading={formLoading}
          handleCancel={handleCancel}
        />
      </Modal>
    </>
  );
};
