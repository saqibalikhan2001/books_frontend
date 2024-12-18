/** @format */

import { useCallback, useEffect, useState } from "react";
import { Image, Modal } from "antd";
import { ImagePath } from "utils";
import { ImageCrop } from "./ImageCrop";
import { Buttonx, Toast } from "app/shared";
import { useAxios, useStore } from "app/Hooks";
import { TooltipX } from "app/shared/ToolTip";
import { MAX_FILE_SIZE } from "app/shared/AllowedFormats";

export const ImageDetails = ({
  Images,
  itemId,
  refetch,
  setPrimary,
  platformType,
  isModal = false,
  primaryImage = {},
  Add_New_button = true,
}: any) => {
  const { callAxios } = useAxios();
  const { created_by_platform } = useStore();
  const [images, setImages] = useState<any>([]);
  const [uploadImage, setUploadImage] = useState<any>();
  const [currentImage, setCurrentImage] = useState<any>("");

  useEffect(() => {
    if (primaryImage && Object.keys(primaryImage).length) {
      setCurrentImage(primaryImage?.image_path);
    } else {
      Images.length > 0 && setCurrentImage(Images[0]);
    }
    setImages(Images);
  }, [Images, primaryImage]);

  const handleOk = () => setUploadImage(null);

  const handleImages = useCallback((imgs) => {
    setImages(imgs);
  }, []);

  const hanldeImage = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
    const fileExtension = file.name.slice(file.name.lastIndexOf("."));
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];
    if (file.name.includes(".jfif")) {
      Toast({
        message:
          "The selected image format is not allowed. Please upload an allowed format. i.e .JPG, .JPEG, .PNG and .webP",
        type: "error",
      });
      return;
    }
    if (file.size > maxSize || !allowedExtensions.includes(fileExtension.toLowerCase())) {
      Toast({ message: "invalid file/Size", type: "error" });
    } else {
      if (file) {
        setUploadImage(URL.createObjectURL(file));
        e.target.value = "";
      } else {
        setUploadImage(null);
        e.target.value = "";
      }
    }
  };

  const defaultImage = () => {
    callAxios({
      url: "/items/primary_image",
      method: "post",
      data: { item_id: itemId, image_path: currentImage },
    }).then((res) => {
      Toast({ message: res?.message });
      setPrimary(true);
      refetch();
    });
  };
  return (
    <>
      <Modal
        width={940}
        footer={null}
        destroyOnClose
        centered={true}
        onCancel={handleOk}
        open={Boolean(uploadImage)}
        title={<label className="f--bold">Adjust Image</label>}
        wrapClassName="generic_modal_style adjust_image_modal"
        closeIcon={
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
            alt="close Icon"
          />
        }
      >
        <ImageCrop
          detailImage
          itemId={itemId}
          fileList={images}
          refetch={refetch}
          handleOk={handleOk}
          image={uploadImage}
          setPrimary={setPrimary}
          handleFileList={handleImages}
        />
      </Modal>

      <div className="image_inner">
        {images.length ? (
          primaryImage?.image_path.includes(currentImage) ? (
            <label>Default</label>
          ) : (
            <Buttonx btnText="set as default" clickHandler={defaultImage} disabled={isModal} />
          )
        ) : null}
        <Image
          preview={false}
          src={
            images.length
              ? ImagePath(currentImage, created_by_platform)
              : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                  import.meta.env.VITE_ITEM_PLACEHOLDER_IMAGE
                }`
          }
        />
      </div>

      <div
        className="image_gallery"
        style={{ marginTop: 10, flexDirection: "row", display: "flex" }}
      >
        {images.map((img, index) => (
          <div
            className={`${"image_list_item"} ${currentImage === img ? "active--border" : ""}`}
            key={index}
            onClick={() => {
              setCurrentImage(img);
            }}
          >
            <Image
              preview={false}
              style={{ width: "100%", height: "100%" }}
              src={ImagePath(img, created_by_platform)}
            />
          </div>
        ))}
        {images.length < 5 && platformType === "books" && !isModal && Add_New_button && (
          <>
            <label htmlFor="item_upload">
              <TooltipX title="Add new image">
                <img
                  className=""
                  alt="plus icon"
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_2x.svg`}
                />
              </TooltipX>
              <input
                type="file"
                name="myfile"
                id="item_upload"
                onChange={hanldeImage}
                accept=".png,.jpg,.jpeg,.webp"
                maxLength={MAX_FILE_SIZE}
                style={{ display: "none" }}
              />
            </label>
          </>
        )}
      </div>
    </>
  );
};
