/** @format */

import { useEffect, useState } from "react";
import { Divider, Typography } from "antd";
import { useAxios } from "app/Hooks";
import { NaNull } from "utils/antiNull";
import {
  MAX_FILE_SIZE,
  attachementAllowedFormats,
  attachmentTypeToastMessage,
} from "app/shared/AllowedFormats";
import { endpoints } from "static";
import { Attachments, Toast } from "app/shared";

const { Title, Text } = Typography;
const { CUSTOMERS, SUPPLIERS } = endpoints;

const Overview = ({ details, setUploading, supplier = false, isModal = false }: any) => {
  const { callAxios } = useAxios();
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    setAttachments(details?.attachments);
  }, [details]);

  const singleAttachmentDelete = (id) => {
    setUploading(true);
    callAxios({
      url: `${supplier ? SUPPLIERS : CUSTOMERS}/attachment/${id}`,
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
      url: `${supplier ? SUPPLIERS : CUSTOMERS}/${id}/download-attachment`,
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
      url: `${supplier ? SUPPLIERS : CUSTOMERS}/${details?.id}/download-all`,
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

  const handleImage = (e: any) => {
    if (e.target.files !== undefined) {
      const file = e.target.files[0];
      if (file.name.includes(".jfif")) {
        Toast({
          message:
            "The selected image format is not allowed. Please upload an allowed format. i.e .JPG, .JPEG, .PNG and .webP",
          type: "error",
        });
        return;
      }
      if (file.type.includes("video")) {
        e.target.value = "";
        Toast({ message: "Video can't be attached", type: "error" });
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
      if (!attachementAllowedFormats.includes(file.type)) {
        Toast({
          message: attachmentTypeToastMessage,
          type: "error",
        });
        return;
      }
      if (file.size >= MAX_FILE_SIZE) {
        Toast({
          message: "File should be less than the allowed maximum Size i.e 5 MB",
          type: "error",
        });
        e.target.value = "";
        return;
      }
      setUploading(true);

      const data = new FormData();
      data.append("subjectId", details?.id);
      data.append("name", details?.display_name);
      data.append(`files[0]`, file as any);

      callAxios({
        url: `${supplier ? SUPPLIERS : CUSTOMERS}/attachments`,
        method: "post",
        data,
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
              <Title level={5}>{supplier ? "Supplier" : "Customer"}</Title>
            </div>
            <div className="product_value">
              <Text>{details?.display_name}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Email</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(details?.email)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Phone</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(details?.work_phone)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Mobile</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(details?.mobile)}</Text>
            </div>
          </div>

          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Website</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(details?.website)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Other</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(details?.other_contacts)}</Text>
            </div>
          </div>
        </div>

        <div className="product_details-right">
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Company Name</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(details?.company_name)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Payment method</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(details?.payment_mode_name)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Payment terms</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(details?.platform_type==="ims" ? details?.invoice_terms?.name:details?.payment_term_name)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>{supplier ? "Supplier language" : "Customer language"}</Title>
            </div>
            <div className="product_value">
              <Text>English (US)</Text>
            </div>
          </div>
          {!supplier && (
            <div className="product_row res--adj">
              <div className="product_key">
                <Title level={5}>Tax exemption</Title>
              </div>
              <div className="product_value  d-flex align-center">
                <Text className="tax_exemption_icon">
                  {NaNull(
                    details?.tax_exempt ? (
                      <div>
                        <img
                          width={18}
                          alt="tick Icon"
                          src={`${
                            import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                          }/static/media/tick.svg`}
                        />
                      </div>
                    ) : (
                      <div>
                        <img
                          alt="cross Icon"
                          src={`${
                            import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                          }/static/media/cross.svg`}
                        />
                      </div>
                    )
                  )}
                </Text>
              </div>
            </div>
          )}
        </div>
        {/* <div className="product_row w-48">
          <div className="product_key">
            <Title level={5}>Fax</Title>
          </div>
          <div className="product_value">
            <Text>{details?.fax}</Text>
          </div>
        </div> */}
      </div>
      <Title level={4} className="ml-15">
        <b>Social media</b>
      </Title>
      <div className="product_details res-d-block px-16">
        <div className="product_details-left">
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Facebook</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(details?.facebook)}</Text>
            </div>
          </div>
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Skype</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(details?.skype)}</Text>
            </div>
          </div>
        </div>

        <div className="product_details-right">
          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Instagram</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(details?.instagram)}</Text>
            </div>
          </div>

          <div className="product_row res--adj">
            <div className="product_key">
              <Title level={5}>Twitter</Title>
            </div>
            <div className="product_value">
              <Text>{NaNull(details?.twitter)}</Text>
            </div>
          </div>
        </div>
      </div>

      <Divider style={{ margin: 0 }} />
      <Attachments
        showUpload
        isModal={isModal}
        details={details}
        setIsBool={setUploading}
        attachments={attachments}
        handleImage={handleImage}
        multipleDownloads={multipleDownloads}
        singleAttachmentDelete={singleAttachmentDelete}
        singleAttachmentDownload={singleAttachmentDownload}
      />
    </>
  );
};

export default Overview;
