/** @format */

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image, Space, Progress, Form } from "antd";
import { Icons, Toast } from "app/shared";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_USER_BUSINESS, allowedFormats } from "./AllowedFormats";
import { useStore } from "app/Hooks";
import { ImagePath } from "utils";

const {} = Icons;

export const UploadImage = ({
  form,
  src,
  fileList,
  contact = false,
  orgStep = false,
  prodcutImage = false,
  multipleImage = false,
  organizationForm = false,
  openCropModal = () => null,
}: any) => {
  const [a, setA] = useState(50);
  const [loading, setloading] = useState(false);
  const { created_by_platform } = useStore();
  // const logo = form.getFieldValue("img_logo");
  const logo = Form.useWatch("img_logo", form);
  const photoFile = Form.useWatch("photo", form) ?? null;
  const logoFile = Form.useWatch("logo", form) ?? null;

  const orgPhoto =
    logoFile instanceof File
      ? URL.createObjectURL(logoFile)
      : logoFile && !logoFile?.includes("blob")
      ? ImagePath(logoFile, created_by_platform)
      : logoFile;
  const contactPhoto =
    photoFile instanceof File
      ? URL.createObjectURL(photoFile)
      : photoFile && !photoFile?.includes("blob")
      ? ImagePath(photoFile, created_by_platform)
      : photoFile;

  const onDrop = useCallback(
    (files) => {
      if (!files.length) {
        Toast({ message: "invalid file/file size", type: "error" });
      } else {
        const file = files[0];

        if (!allowedFormats.includes(file.type)) {
          Toast({
            message:
              "The selected image format is not allowed. Please upload an allowed format. i.e .JPG, .JPEG, .PNG and .webP",
            type: "error",
          });
          return;
        }
        if (file.name.includes(".jfif")) {
          Toast({
            message:
              "The selected image format is not allowed. Please upload an allowed format. i.e .JPG, .JPEG, .PNG and .webP",
            type: "error",
          });
          return;
        }
        if ((organizationForm || contact || orgStep) && file.size > MAX_FILE_SIZE_USER_BUSINESS) {
          Toast({
            message: "Image should be less than the allowed maximum Size i.e 1 MB",
            type: "error",
          });
          return;
        }
        if (prodcutImage && file.size >= MAX_FILE_SIZE) {
          Toast({
            message: "Image should be less than the allowed maximum Size i.e 5 MB",
            type: "error",
          });
          return;
        }
        if (orgStep) {
          setloading(true);
          setTimeout(() => {
            setA(a * 2);
          }, 2000);
          setTimeout(() => {
            // form.setFieldsValue({ logo: file });
            form.setFieldsValue({ logo: URL.createObjectURL(file) });
            form.setFieldsValue({ img_logo: URL.createObjectURL(file) });
            form.setFieldsValue({ upload_images: URL.createObjectURL(file) });
            setloading(false);
            setA(50);
            openCropModal();
          }, 3000);
        } else if (prodcutImage) {
          if (fileList.length === 5) {
            Toast({
              type: "error",
              message: "Maximum of 5 images can be uploaded, remove any one in order to add.",
            });
          } else {
            const file = files[0];
            // form.setFieldsValue({ photo: file });
            form.setFieldsValue({ photo: URL.createObjectURL(file) });
            form.setFieldsValue({ upload_images: URL.createObjectURL(file) });
          }
        } else {
          const file = files[0];
          // form.setFieldsValue({ photo: file });
          form.setFieldsValue({ photo: URL.createObjectURL(file) });
          // form.setFieldsValue({ logo: file });
          form.setFieldsValue({ logo: URL.createObjectURL(file) });
          form.setFieldsValue({ img_logo: URL.createObjectURL(file) });
          if (contact) openCropModal();
          if (organizationForm) openCropModal();
        }
      }
    },
    //eslint-disable-next-line
    [form, fileList, orgStep, prodcutImage, contact]
  );

  const removeImage = () => {
    form.setFieldsValue({ logo: null, img_logo: null, photo: null, upload_images: null });
  };
  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    accept: "image/png, image/webp, image/jpeg",
    // maxSize,
    multiple: multipleImage,
    // maxSize: 5 * 1000 * 1000, // 5MB max size
    onDrop,
  });

  return (
    <>
      {!prodcutImage && (
        <div {...getRootProps({})}>
          <input {...getInputProps()} accept=".png,.jpg,.jpeg,.webp" />
          {!logo && !contactPhoto && !orgPhoto ? (
            <div onClick={() => open()}>
              {orgStep ? (
                <div className="signup-upload-wrapper  cursor">
                  <div>
                    {loading ? (
                      <>
                        <div className="loader-default-img">
                          <img
                            alt=""
                            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                              import.meta.env.VITE_ORGANIZATION_PLACEHOLDER_IMAGE
                            }`}
                          />
                          <Progress
                            percent={a}
                            size="small"
                            status="active"
                            style={{ width: "100px", margin: "0 auto" }}
                            strokeColor={{ "#005FDB": "#005FDB" }}
                            success={{ strokeColor: "#005FDB" }}
                          />
                          <p className="mb-0">processing...</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="org_img">
                          <Image
                            alt="logo"
                            preview={false}
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/add_product.png`}
                          />
                        </div>
                        <div className="upload-hint">
                          <p className="color-1616">Drag or Upload your business logo</p>
                          <p className="img-format-hint color-999">
                            Only .JPG, .JPEG, .PNG and .webP format supported{" "}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : !contact ? (
                <Space className="upload_img">
                  <img src={src} alt="" />
                  <div className="">
                    <span className="plus_icon">
                      <img
                        alt="plus icon"
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/plus_1x.svg`}
                      />
                    </span>
                  </div>
                  <p className=" upload-text">Your company logo</p>
                </Space>
              ) : (
                <Space className="upload_img customer_upload_img">
                  <div className="image_upload">
                    <span className="user_icon">
                      <img
                        alt="user icon"
                        className="user_profile_icon"
                        src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                          import.meta.env.VITE_CUSTOMER_PLACEHOLDER_IMAGE
                        }`}
                      />
                    </span>
                    <span className="plus_icon">
                      <img
                        alt="plus icon"
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/plus_1x.svg`}
                      />
                    </span>
                  </div>
                </Space>
              )}
            </div>
          ) : orgStep ? (
            <div className="upload-wrapper-signup">
              <div className="circle_image">
                <div>
                  <Image
                    src={orgPhoto ?? logo}
                    preview={false}
                    alt="logo here"
                    className="img_logo"
                  />
                </div>
              </div>
              <div className="close_btn" onClick={removeImage}>
                {/* <VscClose className="crossIcon" /> */}
                <span>Delete</span>
              </div>
            </div>
          ) : (
            //this is for customer
            <div className="upload-wrapper-customer">
              <div className="anticon" onClick={removeImage}>
                <img
                  alt="close Icon"
                  className="crossIcon close_icon"
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
                />
              </div>
              <div>
                <Image
                  src={contactPhoto ?? orgPhoto ?? logo}
                  preview={false}
                  alt="logo here"
                  className="img_logo"
                />
              </div>
            </div>
          )}
        </div>
      )}
      {prodcutImage && (
        <div
          {...getRootProps({})}
          style={{
            cursor: fileList.length === 5 ? "not-allowed" : "pointer",
          }}
        >
          <input {...getInputProps()} accept=".png,.jpg,.jpeg,.webp" id="item_upload" />
          <div onClick={() => fileList.length !== 5 && open()}>
            <div className="org_img">
              <Image
                alt="logo"
                preview={false}
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/add_product.png`}
              />
            </div>
            <div className="upload-hint">
              <p className="color-1616">Drag or Upload your product images</p>
              <p className="img-format-hint color-999">
                Only .JPG, .JPEG, .PNG and .webP format supported
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
