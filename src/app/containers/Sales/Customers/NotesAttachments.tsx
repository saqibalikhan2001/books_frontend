/** @format */

import { Form, Image, Input, Space, Typography, Upload } from "antd";
import type { UploadProps } from "antd/es/upload";
import { Labels } from "static";
import { Icons, Toast } from "app/shared";
import { TooltipX } from "app/shared/ToolTip";
import {
  MAX_FILE_SIZE,
  attachementAllowedFormats,
  attachmentTypeToastMessage,
} from "app/shared/AllowedFormats";
import { isCsvOrExcelFile } from "utils";

const { RiDeleteBinLine } = Icons;

export const NotesAndAttachments = ({
  edit,
  form,
  setAttachList,
  attachList = [],
  deleteAttachments,
  setDeleteAttachments,
  handleImageAttachList,
}: any) => {
  const handleAttachImage = (files) => {
    if (edit && files.old_image) {
      setDeleteAttachments([...deleteAttachments, files?.uid]);
    }
    setAttachList(attachList.filter((file) => file.uid !== files.uid));
  };

  const handleImageAttachChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const tempSize = newFileList[newFileList.length - 1].size;
    const type = newFileList[newFileList.length - 1].type;
    if (tempSize !== undefined) {
      if (!attachementAllowedFormats.includes(type!)) {
        Toast({
          message: attachmentTypeToastMessage,
          type: "error",
        });
        return;
      }
      if (newFileList[newFileList.length - 1].name.includes(".jfif")) {
        Toast({
          message:
            "The selected image format is not allowed. Please upload an allowed format. i.e .JPG, .JPEG, .PNG and .webP",
          type: "error",
        });
        return;
      }
      if (tempSize >= MAX_FILE_SIZE) {
        Toast({
          message: "File should be less than the allowed maximum Size i.e 5 MB",
          type: "error",
        });
        return;
      }
      handleImageAttachList?.(newFileList);
    }
  };

  return (
    <>
      <Typography.Title level={4} className="h4  form_heading">
        Notes and Attachments
      </Typography.Title>
      <div className="form_box">
        <div className="flexbox form-row-container justify-content-between">
          <div className="form_group flex-47">
            <Form.Item
              name="note"
              label={<label className="form--label_style mb-5">Notes</label>}
              className="mb text_field flex_root"
            >
              <Input.TextArea
                showCount
                rows={4}
                maxLength={1000}
                placeholder="Add notes"
                onChange={(e: any) => {
                  const { value } = e.target;
                  const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                  form.setFieldValue("note", formattedValue);
                }}
              />
            </Form.Item>
          </div>
        </div>
      </div>
      {/* <div className="form_box">
        <div className="flexbox form-row-container justify-content-between">
          <div className="form_group flex-47 mb-30">
            <label>Attchments</label>
          </div>
        </div>
      </div> */}
      {!edit && (
        <div className="form_box mb-15">
          <label className="mb-5 form--label_style">{Labels.Attachment}</label>
          <div
            style={{ display: "flex" }}
            className={`upload-wrapper-master ${attachList.length ? "upload_image" : ""}`}
          >
            <div className="upload-wrapper-inner space--adjust" style={{ alignSelf: "flex-start" }}>
              {/* <div className="upload_box mb-30"> */}
              <Upload
                maxCount={5}
                fileList={attachList}
                showUploadList={false}
                listType="picture-card"
                disabled={attachList.length >= 5}
                onChange={handleImageAttachChange}
                accept=".png,.jpg,.jpeg,.pdf,.csv,.doc,.docx"
                beforeUpload={() => {
                  return false;
                  // if (file?.name && attachList.length === 5) {
                  //   Toast({
                  //     message:
                  //       "Only  allowed quantity (i.e 5 attachments) are allowed to be uploaded.",
                  //     type: "error",
                  //   });
                  // }
                }}
              >
                <div className="optimistic">
                  <div className="ant-upload-drag-icon" style={{ marginBottom: "20px" }}>
                    <Image
                      preview={false}
                      className="logo"
                      alt="attach-logo"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/add_product.png`}
                    />
                  </div>
                  <p className="ant-upload-text drag-text">Drag or Upload your attachment</p>
                  <p className="ant-upload-hint">
                    Only .JPG, .JPEG, .PNG, .DOC, .CSV and .PDF format supported
                  </p>
                  <p className="ant-upload-hint">Maximum size: 5 MB</p>
                </div>
              </Upload>
              {/* </div> */}
            </div>
            <div className="flex_master">
              {attachList.map((file) => (
                <Space className="upload-wrapper image-container" style={{ marginLeft: 15 }}>
                  <Space className="anticon overlay">
                    <Space className="anticon">
                      <TooltipX title="Delete">
                        <RiDeleteBinLine
                          className="crossIcon"
                          onClick={() => handleAttachImage(file)}
                        />
                      </TooltipX>
                    </Space>
                  </Space>
                  <Image
                    width={100}
                    height={100}
                    preview={false}
                    alt=""
                    className="img_logo"
                    src={
                      file?.editAttach
                        ? ["png", "jpg", "jpeg", "jpg"].includes(
                            file?.attachment_type.toLowerCase()
                          )
                          ? file?.url
                          : file?.attachment_type === "pdf"
                          ? `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/pdf.svg`
                          : isCsvOrExcelFile(file?.attachment_type)
                          ? `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/csv.png`
                          : file?.attachment_type === "doc"
                          ? `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/docx.svg`
                          : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/docx.svg`
                        : ["image/png", "image/jpg", "image/jpeg"].includes(file?.type)
                        ? URL.createObjectURL(file?.originFileObj)
                        : file?.type === "application/pdf"
                        ? `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/pdf.svg`
                        : isCsvOrExcelFile(file?.type)
                        ? `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/csv.png`
                        : file?.type === "text/doc"
                        ? `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/docx.svg`
                        : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/docx.svg`
                    }
                  />
                </Space>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
