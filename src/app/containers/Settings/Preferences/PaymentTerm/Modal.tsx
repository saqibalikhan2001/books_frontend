import { Form, Modal } from "antd";
import { PaymentTermsProps } from "./types";
import { PaymentForm } from "./Form";

export const PaymentTermModal = ({
  bool,
  current,
  onFinish,
  handleToggle,
  edit = false,
  paymentModal,
  setPaymentData,
}: PaymentTermsProps) => {
  const [form] = Form.useForm();

  const handleClose = () => {
    form.resetFields();
    edit && setPaymentData?.();
  };

  return (
    <Modal
      centered
      width={600}
      footer={null}
      destroyOnClose
      open={paymentModal}
      maskClosable={false}
      onCancel={handleClose}
      afterClose={handleClose}
      wrapClassName="generic_modal_style"
      title={edit ? "Edit payment term" : "Add payment term"}
      closeIcon={
        <img
          onClick={handleToggle}
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          alt="close Icon"
        />
      }
    >
      <PaymentForm
        edit={edit}
        bool={bool}
        form={form}
        current={current}
        onFinish={onFinish}
        handleToggle={handleToggle}
      />
    </Modal>
  );
};
