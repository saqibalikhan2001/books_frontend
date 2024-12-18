/** @format */

import { useState, useCallback, useMemo } from "react";
import Cropper from "react-easy-crop";
import { Labels } from "static";
import { useAxios } from "app/Hooks";
import getCroppedImg from "./CropImage";
import { Buttonx, Toast } from "app/shared";
import { Area, ImageCropProps } from "./Types";

export const ImageCrop = ({
  form,
  image,
  itemId,
  refetch,
  handleOk,
  fileList,
  setPrimary,
  handleFileList,
  contact = false,
  orgForm = false,
  detailImage = false,
}: ImageCropProps) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const { callAxios, bool, toggle } = useAxios();
  const [crop, setCrop] = useState({ x: 1, y: 1 });
  const [croppedImage, setCroppedImage] = useState<RequestInfo | null>(null);
  const [flip, setFlipped] = useState({ horizontal: false, vertical: false });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useMemo(async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation, flip);
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation, image, flip]);

  // const onClose = useCallback(() => {
  //   setCroppedImage(null)
  // }, [])

  const handleSaveOriginal = async () => {
    let file = await fetch(image as RequestInfo)
      .then((r) => r.blob())
      .then((blobFile) => {
        const randomName = (Math.random() + 1).toString(36).substring(7);
        const extension = blobFile.type.split("/")[1]; // Extracts the extension from the MIME type

        return new File([blobFile], `${randomName}.${extension}`, {
          type: blobFile.type,
        });
      });
    if (detailImage) {
      const data = new FormData();
      data.append("upload_images[0]", file);
      toggle();
      callAxios({
        url: `/items/${itemId}/images`,
        method: "post",
        data,
      })
        .then((res) => {
          Toast({ message: res?.message });
          refetch?.();
          setPrimary?.(true);
          handleFileList?.([...res?.data?.images] as any);
          handleOk();
        })
        .catch(() => toggle());
    } else if (orgForm) {
      form.setFieldsValue({ logo: file });
      handleOk();
    } else if (contact) {
      form.setFieldsValue({ photo: file });
      handleOk();
    } else {
      handleFileList?.([...(fileList as any), file] as any);
      handleOk();
    }
  };

  const handleSave = async () => {
    let file = await fetch(croppedImage as RequestInfo)
      .then((r) => r.blob())
      .then((blobFile) => {
        const randomName = (Math.random() + 1).toString(36).substring(7);
        const extension = blobFile.type.split("/")[1]; // Extracts the extension from the MIME type

        return new File([blobFile], `${randomName}.${extension}`, {
          type: blobFile.type,
        });
      });
    if (detailImage) {
      const data = new FormData();
      data.append("upload_images[0]", file);
      toggle();
      callAxios({
        url: `/items/${itemId}/images`,
        method: "post",
        data,
      })
        .then((res) => {
          Toast({ message: res?.message });
          refetch?.();
          setPrimary?.(true);
          handleFileList?.([...res?.data?.images] as any);
          handleOk();
        })
        .catch(() => toggle());
    } else if (orgForm) {
      form.setFieldsValue({ logo: file });
      handleOk();
    } else if (contact) {
      form.setFieldsValue({ photo: file });
      handleOk();
    } else {
      handleFileList?.([...(fileList as any), file] as any);
      handleOk();
    }
  };

  const handleReset = () => {
    setRotation(0);
    setZoom(1);
    setFlipped((prevCrop) => ({ ...prevCrop, vertical: false, horizontal: false }));
  };

  return (
    <div className="image_adjustment">
      <div className="image_cropper_wrapper">
        <div className="cropper_side">
          <div className="cropper_box">
            {image && (
              <Cropper
                // transform={}
                crop={crop}
                zoom={zoom}
                image={image}
                aspect={3 / 3}
                rotation={rotation}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    transform: flip.horizontal
                      ? "scaleX(-1)"
                      : flip.vertical
                      ? "scaleY(-1)"
                      : "scale(1)",
                  },
                }}
              />
            )}
            <Buttonx
              btnText=""
              disabled={zoom === 1}
              className="zoom-btn zoom-out btn-default btn-md"
              clickHandler={() => setZoom((prev) => prev - 1)}
              icon={
                <img
                  alt="icon"
                  className="base--line"
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/zoomout.svg`}
                />
              }
            />
            <Buttonx
              btnText=""
              className="zoom-btn zoom-in btn-default btn-md"
              clickHandler={() => setZoom((prev) => prev + 1)}
              icon={
                <img
                  alt="icon"
                  className="base--line"
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/zoomin.svg`}
                />
              }
            />
          </div>
          <div className="cropper_options max-wide">
            <Buttonx
              btnText="Rotate left"
              className="btn-form-size btn-default btn-md"
              clickHandler={() => setRotation((prev) => prev + 90)}
              icon={
                <img
                  className="mr-10"
                  alt="rotate-icon"
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/rotateleft.svg`}
                />
              }
            />
            <Buttonx
              btnText="Rotate right"
              className="btn-form-size btn-default btn-md"
              clickHandler={() => setRotation((prev) => prev - 90)}
              icon={
                <img
                  className="mr-10"
                  alt="rotate-icon"
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/rotateright.svg`}
                />
              }
            />
            <Buttonx
              // disabled
              btnText="Flip horizonal"
              className="btn-form-size btn-default btn-md"
              clickHandler={() =>
                setFlipped((prevCrop) => ({ ...prevCrop, horizontal: !prevCrop.horizontal }))
              }
              icon={
                <img
                  width={16}
                  className="hover-effect"
                  style={{ marginRight: "10px" }}
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/flip_h.svg`}
                />
              }
            />

            <Buttonx
              // disabled
              btnText="Flip vertical"
              icon={
                <img
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/flip_v.svg`}
                  width={16}
                  style={{ marginRight: "10px" }}
                  className="hover-effect"
                />
              }
              className="btn-form-size btn-default btn-md"
              clickHandler={() =>
                setFlipped((prevCrop) => ({ ...prevCrop, vertical: !prevCrop.vertical }))
              }
            />
            <Buttonx
              icon={
                <img
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/imagereset.svg`}
                  className="mr-10"
                  alt="icon"
                />
              }
              btnText="Image reset"
              clickHandler={handleReset}
              className="btn-form-size btn-default btn-md"
            />
            <label
              htmlFor="item_upload"
              style={{ paddingBlock: "3px", paddingInline: "15px" }}
              className="btn-form-size btn-default d-flex align-center cursor btn-md"
            >
              <span>
                <img
                  className="mr-10"
                  alt="change icon"
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/changeimage.svg`}
                />
              </span>
              Change image
            </label>
          </div>
        </div>
      </div>
      <div className="image_adjustment_footer">
        <Buttonx
          disabled={bool}
          htmlType="button"
          btnText={Labels.CANCEL}
          clickHandler={() => {
            if (contact) {
              form.setFieldsValue({ photo: null });
              handleOk();
            } else if (orgForm) {
              form.setFieldsValue({ logo: null });
              handleOk();
            } else {
              handleOk();
            }
          }}
          className="btn-default btn-form-size cate_cancel_btn mr-20"
        />
        <Buttonx
          btnText="Save"
          disabled={bool}
          clickHandler={handleSave}
          className="btn-form-size btn-primary mr-20"
        />
        <Buttonx
          disabled={bool}
          btnText="Save Original"
          clickHandler={handleSaveOriginal}
          className="btn-form-size btn-primary"
        />
      </div>
    </div>
  );
};
