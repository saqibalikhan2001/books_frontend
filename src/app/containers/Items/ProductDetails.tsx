/**@format */

import { useEffect, useState } from "react";
import { Divider, Typography } from "antd";
import { useAxios, usePermissions } from "app/Hooks";
import { detailPage } from "./Types";
import { NaNull } from "utils/antiNull";
import { Attachments, Toast } from "app/shared";
import { attachementAllowedFormats, attachmentTypeToastMessage } from "app/shared/AllowedFormats";

const { Title, Text, Paragraph } = Typography;

//@ts-ignore
export const ProductDetail = ({ data, setUploading, isModal = false }: detailPage) => {
  const { callAxios } = useAxios();
  const [attachments, setAttachments] = useState([]);
  const { checkPermission } = usePermissions();
  const { has_ItemEdit_permission } = checkPermission("ItemEdit");
  useEffect(() => {
    setAttachments(data?.attachments);
  }, [data]);

  const singleAttachmentDelete = (id) => {
    setUploading(true);
    callAxios({
      url: `/items/attachment/${id}`,
      method: "delete",
    }).then((res) => {
      Toast({ message: res?.message });
      setAttachments(attachments?.filter((attach: { id: number }) => attach?.id !== id));
      setUploading(false);
    });
  };
  const singleAttachmentDownload = (id) => {
    setUploading(true);
    callAxios({
      url: `/items/${id}/download-attachment`,
    }).then((res) => {
      if (res) {
        const element = document.createElement("a");
        element.href = res?.file;
        element.download = `${res?.name}.${res?.type}`;
        element.click();
        setUploading(false);
        Toast({ message: "Attachment downloaded successfully " });
      } else {
        setUploading(false);
      }
    });
  };
  const multipleDownloads = () => {
    setUploading(true);
    callAxios({
      url: `/items/${data?.id}/download-all`,
    }).then((res) => {
      if (res.name) {
        const element = document.createElement("a");
        element.href = res?.file;
        element.download = `${res?.name}.${res?.type}`;
        element.click();
        setUploading(false);
        Toast({ message: "Attachment downloaded successfully " });
      } else {
        setUploading(false);
      }
    });
  };

  const handleImage = (e) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    if (e.target.files !== undefined) {
      const file = e.target.files[0];

      if (file.type.includes("video")) {
        e.target.value = "";
        Toast({ message: "Video can't be attached", type: "error" });
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
      if (attachments.length === 10) {
        e.target.value = "";
        Toast({
          message: "Only  allowed quantity (i.e 10 attachments) are allowed to be uploaded.",
          type: "error",
        });
        return;
      }
      if (!attachementAllowedFormats.includes(file.type!)) {
        e.target.value = "";
        Toast({
          message: attachmentTypeToastMessage,
          type: "error",
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        e.target.value = "";
        Toast({
          message: "File should be less than the allowed maximum Size i.e 5 MB",
          type: "error",
        });
        return;
      }

      setUploading(true);
      const formdata = new FormData();
      formdata.append("subjectId", data?.id);
      formdata.append("name", data?.name);
      formdata.append(`files[0]`, file);

      callAxios({
        url: "/items/attachments",
        method: "post",
        data: formdata,
      })
        .then((res) => {
          setUploading(false);
          e.target.value = "";
          if (res) {
            Toast({ message: res?.message });
            setAttachments([...attachments, res?.data[0]] as any);
          }
        })
        .catch((err) => {
          setUploading(false);
          Toast({ type: "error", message: err?.message });
        });
    }
  };

  return (
    <>
      <div className="product_details res-d-block px-16">
        <div className="product_details-left">
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Name</Title>
            </div>
            <div className="product_value product-name--main">
              <Text className="product_name">{NaNull(data?.name)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>SKU</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data?.sku)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Type</Title>
            </div>
            <div className="product_value">
              <Text
                className={` ${data?.inventory_type === "inventory" ? "" : "non-inventory-badge"}`}
              >
                {data?.inventory_type === "inventory" ? "Inventory" : "Non Inventory"}
              </Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Category</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data?.category)}</Text>
            </div>
          </div>
          {/* static data to be chnaged in future */}
          <div className="product_row mb-40 res--adj">
            <div className="product_key">
              <Title level={5}>Returnable</Title>
            </div>
            <div className="product_value">
              <Text>yes</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Unit</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data?.unit)}</Text>
            </div>
          </div>
          {/* static data to be chnaged in future */}
          {/* <div className="product_row ">
            <div className="product_key">
              <Title level={5}>Size</Title>
            </div>
            <div className="product_value">
              <Text>Medium</Text>
            </div>
          </div> */}
          {/* static data to be chnaged in future */}
          {/* <div className="product_row ">
            <div className="product_key">
              <Title level={5}>Color</Title>
            </div>
            <div className="product_value">
              <Text>Black</Text>
            </div>
          </div> */}
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Weight per unit</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data?.weight)}</Text>
            </div>
          </div>

          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Dimensions</Title>
            </div>
            <div className="product_value">
              <Paragraph>{NaNull(data?.dimensions)}</Paragraph>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Brand</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data?.brand)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Manufacturer</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data?.manufacturer)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Description</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data?.description)}</Text>
            </div>
          </div>
        </div>
        <div className="product_details-right">
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>UPC/Barcode</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data.upc)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>MPN</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data.mpn)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>EAN</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data.ean)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>ISBN</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data.isbn)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Initial quantity on hand</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data?.oppeningStock)}</Text>
            </div>
          </div>
          {/* static data to be chnaged in future */}
          {/* <div className="product_row ">
            <div className="product_key">
              <Title level={5}>As of date</Title>
            </div>
            <div className="product_value">
              <Text>2023/1/1</Text>
            </div>
          </div> */}
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Reorder point</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data.reorder_level)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Preferred supplier</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data?.vendor?.display_name)}</Text>
            </div>
          </div>
          {/* static data to be chnaged in future */}
          {import.meta.env.VITE_ADD_ACCOUNTS === "true" && (
            <div className="product_row res--adj">
              <div className="product_key">
                <Title level={5}>Inventory asset account</Title>
              </div>
              <div className="product_value">
                <Text> {NaNull(data?.inventory_account?.title)}</Text>
              </div>
            </div>
          )}
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Income account</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(data?.sales_account?.title)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Expense account</Title>
            </div>
            <div className="product_value no-cap">
              <Text>{NaNull(data?.purchase_account?.title)}</Text>
            </div>
          </div>
        </div>
      </div>
      <Divider style={{ margin: 0 }} />
      <Attachments
        details={data}
        isModal={isModal}
        setIsBool={setUploading}
        attachments={attachments}
        handleImage={handleImage}
        hasDelete={has_ItemEdit_permission}
        showUpload={has_ItemEdit_permission}
        multipleDownloads={multipleDownloads}
        singleAttachmentDelete={singleAttachmentDelete}
        singleAttachmentDownload={singleAttachmentDownload}
      />
    </>
  );
};
