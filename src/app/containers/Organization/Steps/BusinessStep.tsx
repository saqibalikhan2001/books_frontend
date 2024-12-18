/**@format */

import { useState } from "react";
import { Col, Row, Form, Checkbox, Modal } from "antd";
import { rules } from "utils";
import { Labels, Content } from "static";
import { InputField, UploadImage } from "app/shared";
import { ImageCrop } from "app/containers/Items/ImageCrop";

const { BUSINESS_NAME, LICENSE_NO } = Labels;

export const BusinessStep = ({ form }: any) => {
  const [cropmodal, setCropModal] = useState(false);

  const image = Form.useWatch("logo", form);

  const handleOkk = () => setCropModal(!cropmodal);
  const openCropModal = () => setCropModal(true);
  return (
    <>
      <Row>
        <Col span={24}>
          <div className="input_field" style={{ marginBottom: 16 }}>
            <InputField
              required
              form={form}
              name="name"
              className="mb-8"
              label={BUSINESS_NAME}
              placeholder="Enter Business name"
              rules={rules({ message: Content.enter_business_name })}
            />
            <Form.Item name="is_legal_business" valuePropName="checked" noStyle>
              <Checkbox>{Content.my_legal_bussiness_name}</Checkbox>
            </Form.Item>
          </div>
        </Col>

        <Col span={24}>
          <InputField
            maxLength={60}
            form={form}
            name="license_no"
            label={LICENSE_NO}
            className="input_field"
            placeholder="Enter License No."
          />
        </Col>

        <Col span={24} style={{ height: "200px" }}>
          <Form.Item name="logo" className="upload_logo" label="Upload logo">
            <UploadImage orgStep form={form} openCropModal={openCropModal} />
          </Form.Item>
          <Modal
            width={940}
            footer={null}
            destroyOnClose
            centered={true}
            open={cropmodal}
            wrapClassName="generic_modal_style adjust_image_modal"
            title={<label className="f--bold">Adjust Image</label>}
            onCancel={() => {
              form.setFieldsValue({ logo: null });
              handleOkk();
            }}
            closeIcon={
              <img
                alt="close Icon"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
              />
            }
          >
            <ImageCrop orgForm form={form} image={image} fileList={[]} handleOk={handleOkk} />
          </Modal>
        </Col>
      </Row>
    </>
  );
};
