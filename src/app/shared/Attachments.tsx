import { Image, Typography, Empty } from "antd";
import { useStore } from "app/Hooks";
import { TooltipX } from "./ToolTip";
import { ImagePath, isCsvOrExcelFile, PlatFormType } from "utils";

export const Attachments = ({
  details,
  attachments,
  handleImage,
  isModal = false,
  hasDelete = true,
  multipleDownloads,
  showUpload = false,
  singleAttachmentDelete,
  singleAttachmentDownload,
}: any) => {
  const { Title } = Typography;
  const { created_by_platform } = useStore();
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  return (
    <>
      <div className="attachment_outer_container">
        <div className="attachment_inner">
          {showUpload && (
            <div className="attachment_tittle">
              <Title level={5}>Attachments</Title>
            </div>
          )}
          <div className="attachment_image_btn">
            {showUpload && !isModal && (
              <label
                htmlFor="myattachement"
                style={{ cursor: attachments.length === 10 ? "not-allowed" : "pointer" }}
              >
                <TooltipX title="Upload" className="icon-cursor">
                  <img
                    className="hover-effect"
                    style={{
                      cursor:
                        attachments.length === 10 ||
                        (imsEdit === "false" && details?.platform_type !== "books")
                          ? "not-allowed"
                          : "pointer",
                    }}
                    src={`${
                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                    }/static/media/uploadattachment.svg`}
                  />
                </TooltipX>
                <input
                  type="file"
                  name="myfile"
                  id="myattachement"
                  onChange={handleImage}
                  style={{ display: "none" }}
                  disabled={
                    attachments.length === 10 ||
                    (imsEdit === "false" && details?.platform_type !== "books")
                      ? true
                      : false
                  }
                  accept=".png,.jpg,.jpeg,.pdf,.csv,.doc,.docx"
                />
              </label>
            )}
            {!isModal && attachments?.length > 0 && (
              <>
                {showUpload ? (
                  <TooltipX title="Download all">
                    <img
                      alt="download icon"
                      className="hover-effect"
                      onClick={multipleDownloads}
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/downloadallattachments.svg`}
                    />
                  </TooltipX>
                ) : (
                  <div
                    onClick={multipleDownloads}
                    className="cursor d-flex all-download-attachment"
                  >
                    <img
                      alt="download icon"
                      className="hover-effect"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/downloadallattachments.svg`}
                    />
                    <label className="pl-9 cursor ">Download all</label>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="w-100 attachment_gallery">
          {attachments?.map(
            (
              attach: {
                id: number;
                file_name: string;
                file_size: string;
                attachment: string;
                attachment_type: string;
                file_original_name: string;
              },
              i
            ) => (
              <div key={i} className="generic_attachment_list">
                <div className="attachement_image">
                  <Image
                    className="attachment_file_box"
                    preview={false}
                    src={
                      ["png", "jpg", "jpeg"].includes(attach?.attachment_type)
                        ? ImagePath(attach?.attachment, created_by_platform)
                        : isCsvOrExcelFile(attach?.attachment_type)
                        ? `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/csv.png`
                        : attach?.attachment_type === "pdf"
                        ? `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/pdf.svg`
                        : attach?.attachment_type === "doc"
                        ? `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/docx.svg`
                        : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/docx.svg`
                    }
                  />
                </div>
                <div className="attachment_detail_text">
                  <span className="attachment_name">{getFileNamewithExtention(attach)}</span>
                  <span className="attachment_size">File size: {attach?.file_size}</span>
                  {!isModal && (
                    <div className="image_icon_overlay">
                      <TooltipX title="Download">
                        <img
                          alt="download icon"
                          className="cursor hover-effect"
                          onClick={() => singleAttachmentDownload(attach?.id)}
                          src={`${
                            import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                          }/static/media/downloadallattachments.svg`}
                        />
                      </TooltipX>
                      {PlatFormType(details) && (
                        <TooltipX title="Delete">
                          <img
                            alt="delete icon"
                            className="cursor hover-effect"
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/deleteattachments.svg`}
                            onClick={() => singleAttachmentDelete(attach?.id)}
                            style={{
                              pointerEvents: !hasDelete ? "none" : "auto",
                              opacity: !hasDelete ? 0.5 : 1,
                            }}
                          />
                        </TooltipX>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
        {attachments?.length === 0 && (
          <div>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
      </div>
    </>
  );
};

const getFileNamewithExtention = (attach) => {
  let str;
  if (attach?.file_original_name) str = attach?.file_original_name;
  else str = attach?.file_name + `.${attach?.attachment_type}`;
  return str;
};
