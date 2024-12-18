import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { Tabs } from "antd";
import {
  Email,
  Toast,
  Spinner,
  PdfViewer,
  ActivityLog,
  Attachments,
  ContactModal,
  Breadcrumbx,
} from "app/shared";
import { endpoints } from "static";
import { getKeyFromSS } from "utils";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { TooltipX } from "app/shared/ToolTip";
import { DetailTopSection } from "./DetailTopSection";
import { DetailBillPaymentsTable } from "./DetailBillPaymentsTable";
import {
  MAX_FILE_SIZE,
  attachementAllowedFormats,
  attachmentTypeToastMessage,
} from "app/shared/AllowedFormats";

const { ACTIVITY_LOG, BILL_PAYMENTS, BILL_PAYMENTS_RECORDS } = endpoints;

const DetailPage = ({
  detail,
  setFalse,
  isModal = false,
  loading = false,
  refetchBills,
  handleFullScreen,
}: any) => {
  const { callAxios } = useAxios();
  const { bool, setTrue } = useBool();
  const { checkPermission } = usePermissions();
  const [tabKey, setTabKey] = useState("1");
  const [email, setEmail] = useState(false);
  const [loader, setLoader] = useState(true);
  const [isbool, setIsBool] = useState(false);
  const [details, setDetails] = useState<any>();
  const [pdfModal, setPdfModal] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [customerDetail, setCustomerDetail] = useState(false);
  const { bool: fetchList, setTrue: refetchBillPayments, setFalse: billsFalse } = useBool();
  const { has_BillPaymentRecordEdit_permission } = checkPermission("BillPaymentRecordEdit");

  const localObj = JSON.parse(getKeyFromSS("obj"));
  const sessionEmail = JSON.parse(getKeyFromSS("email"));
  const sessionPrint = JSON.parse(getKeyFromSS("print"));

  useEffect(() => {
    if (detail?.id ?? localObj?.curr_id) {
      callAxios({
        url: `${BILL_PAYMENTS_RECORDS}/${detail?.id ?? localObj?.curr_id}`,
        deploymentTime: true,
      }).then((res) => {
        setDetails(res);
        setLoader(false);
        setAttachments(res?.attachments);
        setFalse?.(false);
        billsFalse();
      });
    }
    return () => {
      setTabKey("1");
      setEmail(false);
      setPdfModal(false);
    };
    //eslint-disable-next-line
  }, [detail?.id, localObj?.curr_id, bool]);

  useEffect(() => {
    if (sessionEmail) setEmail(true);
    else setEmail(false);
  }, [sessionEmail]);

  useEffect(() => {
    if (sessionPrint) setPdfModal(true);
    else setPdfModal(false);
  }, [sessionPrint]);

  const handleEmail = () => setEmail(!email);
  const handleTabChange = (key) => setTabKey(key);
  const togglePdfModal = () => setPdfModal(!pdfModal);
  const toggleCustomerDetailModal = () => setCustomerDetail(!customerDetail);

  const pdfDownload = () => {
    setIsBool(true);
    callAxios({
      url: `${BILL_PAYMENTS_RECORDS}/${details?.id}/pdf?download=true`,
    })
      .then((res) => {
        if (res) {
          const element = document.createElement("a");
          element.href = res;
          element.download = `Bill Payment No. ${detail?.bill_no}.pdf`;
          element.click();
          setIsBool(false);
        }
      })
      .catch(() => setIsBool(false));
  };

  const handleImage = (e: any) => {
    setTabKey("2");

    if (e.target.files !== undefined) {
      const file = e.target.files[0];
      const tempSize = file.size; // Get the size of the selected file

      if (file.name.includes(".jfif")) {
        e.target.value = "";
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
      if (tempSize >= MAX_FILE_SIZE) {
        Toast({
          message: "File should be less than the allowed maximum Size i.e 5 MB",
          type: "error",
        });
        e.target.value = "";
        return;
      }
      setIsBool(true);
      const formdata = new FormData();
      formdata.append("subjectId", details?.id as any);
      formdata.append("name", details?.bill?.bill_no as string);
      formdata.append(`files[0]`, file as any);

      callAxios({
        url: `${BILL_PAYMENTS}/attachments`,
        method: "post",
        data: formdata,
      })
        .then((res) => {
          setIsBool(false);
          e.target.value = "";
          if (res) {
            Toast({ message: res?.message });
            setAttachments([...attachments, res?.data[0]] as any);
          }
        })
        .catch((err) => {
          setIsBool(false);
          Toast({ type: "error", message: err?.message });
        });
    }
  };

  const singleAttachmentDelete = (id) => {
    setIsBool(true);
    callAxios({
      url: `${endpoints.BILL_PAYMENTS}${endpoints.ATTACHMENT}/${id}`,
      method: "delete",
    }).then((res) => {
      setIsBool(false);
      Toast({ message: res?.message });
      setAttachments(attachments?.filter((attach: { id: number }) => attach?.id !== id));

      setTrue();
    });
  };
  const multipleDownloads = () => {
    setIsBool(true);
    callAxios({
      url: `${BILL_PAYMENTS}/${details?.id}/download-all`,
    }).then((res) => {
      if (res.name) {
        const element = document.createElement("a");
        element.href = res?.file;
        element.download = `${res?.name}.${res?.type}`;
        element.click();
        setIsBool(false);
        Toast({ message: "Attachment downloaded successfully " });
      } else {
        setIsBool(false);
      }
    });
  };
  const singleAttachmentDownload = (id) => {
    setIsBool(true);
    callAxios({
      url: `${BILL_PAYMENTS}/${id}/download-attachment`,
    }).then((res) => {
      if (res) {
        const element = document.createElement("a");
        element.href = res?.file;
        element.download = `${res?.name}.${res?.type}`;
        element.click();
        setIsBool(false);
        Toast({ message: "Attachment downloaded successfully " });
      } else {
        setIsBool(false);
      }
    });
  };
  const memoizeTabs = useMemo(
    () => [
      {
        key: "1",
        label: "Details",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              <DetailBillPaymentsTable
                details={details.bill_details}
                payment_made={details.payment_made}
              />
            )}
          </>
        ),
      },

      {
        key: "2",
        hide: false,
        label: "Attachments",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              <Attachments
                details={details}
                isModal={isModal}
                setIsBool={setIsBool}
                attachments={attachments}
                handleImage={handleImage}
                multipleDownloads={multipleDownloads}
                singleAttachmentDelete={singleAttachmentDelete}
                hasDelete={has_BillPaymentRecordEdit_permission}
                singleAttachmentDownload={singleAttachmentDownload}
              />
            )}
          </>
        ),
      },
      {
        key: "3",
        label: "History",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              <ActivityLog
                isModal={isModal}
                url={`${BILL_PAYMENTS}/${details?.id}${ACTIVITY_LOG}/bill`}
              />
            )}
          </>
        ),
      },
    ],
    //eslint-disable-next-line
    [details, fetchList, refetchBills, refetchBillPayments, isbool, tabKey]
  );

  const titleElement = (
    <div className="back-to-listing">
      <Breadcrumbx
        name=""
        detailPage
        refetch={refetchBills}
        moduleName="Bill Payments"
        handleFullScreen={handleFullScreen}
      />
      <div className="_no"> {`Bill Payment No. ${details?.payment_no}`}</div>
    </div>
  );

  return (
    <>
      {loader || loading ? (
        <Spinner />
      ) : (
        <>
          <div
            style={
              isModal
                ? {}
                : {
                    animation: "fadeInRight",
                    animationDuration: "0.3s",
                  }
            }
          >
            <div style={{ pointerEvents: isbool ? "none" : "auto" }}>
              <PageHeader
                className=" __items_details_header _bill_details_header "
                title={titleElement}
                extra={
                  isModal
                    ? []
                    : [
                        <>
                          {!email && (
                            <>
                              {!isModal && (
                                <div className="account_receipt d-flex __general_receipt compact--margin">
                                  <TooltipX title="PDF">
                                    <img
                                      alt="Pdf Icon"
                                      onClick={pdfDownload}
                                      className="mr-10 hover-effect"
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/pdf_icon.svg`}
                                    />
                                  </TooltipX>
                                  <TooltipX title="Print">
                                    <img
                                      alt="Print Icon"
                                      onClick={togglePdfModal}
                                      className="mr-10 hover-effect"
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/print.svg`}
                                    />
                                  </TooltipX>{" "}
                                  <TooltipX title="Email">
                                    <img
                                      alt="Email Box Icon"
                                      onClick={handleEmail}
                                      className="mr-5 hover-effect"
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/email.svg`}
                                    />
                                  </TooltipX>
                                  <label
                                    htmlFor="myattachements"
                                    className=""
                                    style={{
                                      cursor: !has_BillPaymentRecordEdit_permission
                                        ? "not-allowed"
                                        : "pointer",
                                    }}
                                  >
                                    <TooltipX placement="bottomRight" title="Attachment">
                                      <img
                                        alt="Attachment Icon"
                                        className="hover-effect"
                                        src={`${
                                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                        }/static/media/attachment.svg`}
                                        style={{
                                          cursor: !has_BillPaymentRecordEdit_permission
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
                                      />
                                    </TooltipX>
                                    <input
                                      type="file"
                                      name="myfile"
                                      id="myattachements"
                                      onChange={handleImage}
                                      style={{ display: "none" }}
                                      accept=".png,.jpg,.jpeg,.pdf,.csv,.doc,.docx"
                                      disabled={!has_BillPaymentRecordEdit_permission}
                                    />
                                  </label>
                                </div>
                              )}
                            </>
                          )}
                        </>,
                      ]
                }
                footer={
                  <>
                    {!email ? (
                      <div className={`__generic_content_side ${isModal ? "vh-0" : ""}`}>
                        <div className="_bill_payment_detial_page">
                          <DetailTopSection
                            details={details}
                            isModal={isModal}
                            setDetails={setDetails}
                            toggleCustomerDetailModal={toggleCustomerDetailModal}
                          />
                          {isbool && (
                            <div className="pdf_spinner">
                              <Spinner />
                            </div>
                          )}
                        </div>
                        <div className="bg-white">
                          <Tabs
                            activeKey={tabKey}
                            items={memoizeTabs}
                            onChange={handleTabChange}
                            className={`__items-details_container __item_details_tab_container res--scroll ${
                              isModal ? "px-0" : ""
                            }`}
                          />
                        </div>
                      </div>
                    ) : (
                      <Email
                        setEmail={setEmail}
                        refetch={refetchBills}
                        handleEmail={handleEmail}
                        emailUrl={`${BILL_PAYMENTS_RECORDS}/${
                          details?.id ?? localObj?.curr_id
                        }/mail`}
                      />
                    )}
                  </>
                }
              />
            </div>
          </div>
          {pdfModal && (
            <PdfViewer
              pdfModal={pdfModal}
              togglePdfModal={togglePdfModal}
              pdfUrl={`${BILL_PAYMENTS_RECORDS}/${details?.id}/pdf`}
            />
          )}
        </>
      )}
      {customerDetail && (
        <ContactModal
          supplier
          bool={customerDetail}
          toggle={toggleCustomerDetailModal}
          detail={{ id: details?.bill?.vendor?.id }}
        />
      )}
    </>
  );
};

export default DetailPage;
