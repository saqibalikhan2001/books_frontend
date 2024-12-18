/** @format */

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { Tag, Tabs, Form, Input, Image, Divider, Dropdown, Popconfirm, Typography } from "antd";
import { endpoints } from "static";
import { useNavigate } from "react-router";
import { HistoryTable } from "./Historytable";
import { DetailPayments } from "./Detailpayments";
import { DetailLinkedInvoices } from "./Linkedinvoices";
import { PaymentsReceivedDetailPageProps } from "./Types";
import {
  Toast,
  Email,
  Buttonx,
  Spinner,
  PdfViewer,
  Attachments,
  ContactModal,
  Breadcrumbx,
  AccessDenied,
} from "app/shared";
import { Refund } from "../Refund/Refund";
import { TooltipX } from "app/shared/ToolTip";
import { useAxios, useStore, usePermissions, useBool } from "app/Hooks";
import { ImagePath, capitalize, getKeyFromSS, getOrganizationDate, removeKeyFromSS } from "utils";
import {
  MAX_FILE_SIZE,
  attachementAllowedFormats,
  attachmentTypeToastMessage,
} from "app/shared/AllowedFormats";
import { SpinnerX } from "app/shared/PageLoader";

const { TextArea } = Input;
const { ADVANCE_PAYMENT } = endpoints;

const DetailPage = ({
  detail,
  PRdetail,
  setFalse,
  detailpage,
  handleConfirm,
  loading = false,
  isModal = false,
  handleFullScreen,
  refetchPaymentReceived,
}: PaymentsReceivedDetailPageProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const Note = Form.useWatch("notes", form);
  const [notes, setNotes] = useState(false);
  const [tabKey, setTabKey] = useState("1");
  const [email, setEmail] = useState(false);
  const [isbool, setIsBool] = useState(false);
  const [loader, setLoader] = useState(true);
  const [details, setDetails] = useState<any>();
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [attachments, setAttachments] = useState<any>([]);
  const [customerDetail, setCustomerDetail] = useState(false);
  const { created_by_platform, org_date_format } = useStore();
  const { checkPermission, fetchingRoles } = usePermissions();
  const { bool: fetchList, setTrue: refetchRefund } = useBool();
  const tabkey = getKeyFromSS("tabKey");
  const localObj = JSON.parse(getKeyFromSS("obj"));
  const sessionEmail = JSON.parse(getKeyFromSS("email"));
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  const { has_PaymentReceiptsView_permission } = checkPermission("PaymentReceiptsView");
  const { has_PaymentReceiptsEdit_permission } = checkPermission("PaymentReceiptsEdit");
  const { has_PaymentReceiptsDelete_permission } = checkPermission("PaymentReceiptsDelete");
  const { has_InvoicePaymentRecordCreate_permission } = checkPermission(
    "InvoicePaymentRecordCreate"
  );
  const { has_InvoicePaymentRecordDelete_permission } = checkPermission(
    "InvoicePaymentRecordDelete"
  );
  const { has_InvoicePaymentRecordView_permission } = checkPermission("InvoicePaymentRecordView");
  useEffect(() => {
    if ((detailpage || localObj?.curr_id) ?? PRdetail?.payment_no) {
      callAxios({
        url: `${ADVANCE_PAYMENT}/${
          detailpage ? detail?.id : !isModal ? localObj?.curr_id : PRdetail?.payment_no
        }`,
        deploymentTime: true,
      }).then((res) => {
        setDetails(res);
        setAttachments(res?.attachments);
        setFalse?.();
        setNotes(false);
        setLoader(false);
        form.setFieldValue("notes", res?.note);
      });
    }
    if (tabkey) {
      setTabKey(tabkey);
      removeKeyFromSS("tabKey");
    }
    return () => {
      // setTabKey("1");
      setEmail(false);
    };
    //eslint-disable-next-line
  }, [PRdetail?.payment_no, localObj?.curr_id]);

  useEffect(() => {
    if (sessionEmail) setEmail(true);
    else setEmail(false);
  }, [sessionEmail]);

  const handleEmail = () => setEmail(!email);
  const handleTabChange = (key) => setTabKey(key);
  const togglePdfModal = () => setPdfModal(!pdfModal);

  const handleNotes = () => {
    if (!notes) setNotes(!notes);

    if (notes) {
      callAxios({
        url: `${ADVANCE_PAYMENT}/${details?.payment_no}/note`,
        method: "put",
        data: { notes: Note },
      }).then((res) => {
        if (res) {
          setNotes(!notes);
          callAxios({
            url: `${ADVANCE_PAYMENT}/${details?.payment_no}`,
          }).then((res) => {
            setDetails(res);
          });
          Toast({ message: res.message });
        }
      });
    }
  };

  const handleImage = (e: any) => {
    setTabKey("4");
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
      formdata.append("subjectId", details?.id);
      formdata.append("name", "undefined");
      formdata.append(`files[0]`, file as any);
      formdata.append(
        "module",
        details.payment_type == "advance" ? "advance_payment" : "invoice_payment"
      );

      callAxios({
        url: `${ADVANCE_PAYMENT}/attachments`,
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

  const singleAttachmentDownload = (id) => {
    setIsBool(true);
    callAxios({
      url: `advancepayment/${id}/download-attachment`,
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

  const singleAttachmentDelete = (id) => {
    setIsBool(true);
    callAxios({
      url: `${ADVANCE_PAYMENT}${endpoints.ATTACHMENT}/${id}`,
      method: "delete",
    }).then((res) => {
      setIsBool(false);
      Toast({ message: res?.message });
      setAttachments(attachments?.filter((attach: { id: number }) => attach?.id !== id));
    });
  };
  const toggleCustomerDetailModal = () => setCustomerDetail(!customerDetail);

  const multipleDownloads = () => {
    setIsBool(true);
    callAxios({
      url: `${ADVANCE_PAYMENT}/${details?.payment_no}/download-all`,
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

  const pdfDownload = () => {
    setIsBool(true);
    callAxios({
      url: `${ADVANCE_PAYMENT}/${details?.payment_no}/pdf?download=true`,
    })
      .then((res) => {
        if (res) {
          const element = document.createElement("a");
          element.href = res;
          element.download = `Payment Receipt-${details?.payment_no} .pdf`;
          element.click();
          setIsBool(false);
        }
      })
      .catch(() => setIsBool(false));
  };
  const onPrint = () => {
    setPdfUrl(`${ADVANCE_PAYMENT}/${details?.payment_no}/pdf`);
    togglePdfModal();
  };

  const option: any["items"] = useMemo(
    () => [
      {
        key: "1",
        label: (
          <Popconfirm
            key="confirm"
            placement="left"
            disabled={
              (imsEdit === "false" ? details?.platform_type === "books" : true)
                ? has_PaymentReceiptsDelete_permission
                : false
            }
            title={
              (imsEdit === "false" ? details?.platform_type === "books" : true) &&
              has_PaymentReceiptsDelete_permission
                ? `Are you sure you want to delete "${details?.payment_no}"?`
                : "Permission Denied"
            }
            okText={
              (imsEdit === "false" ? details?.platform_type === "books" : true) &&
              has_PaymentReceiptsDelete_permission
                ? "YES"
                : "OK"
            }
            cancelText="No"
            showCancel={
              (imsEdit === "false" ? details?.platform_type === "books" : true) &&
              has_PaymentReceiptsDelete_permission
            }
            onCancel={(e) => e?.stopPropagation()}
            onConfirm={(e) => {
              e?.stopPropagation();
              (imsEdit === "false" ? details?.platform_type === "books" : true) &&
                has_PaymentReceiptsDelete_permission &&
                handleConfirm?.(details);
            }}
          >
            <label
              className={`${
                (imsEdit === "false" ? details?.invoice_info?.platform_type === "books" : true) &&
                has_PaymentReceiptsView_permission
              } ? 'pointer' : 'not-allowed'`}
              style={{
                cursor:
                  (imsEdit === "false" ? details?.platform_type === "books" : true) &&
                  has_PaymentReceiptsView_permission
                    ? "pointer"
                    : "not-allowed",
                width: "100%",
                display: "block",
              }}
              onClick={(e) => e?.stopPropagation()}
            >
              Delete
            </label>
          </Popconfirm>
        ),
        disabled: false,
      },
    ],
    [details]
  );
  const memoizeTabs = useMemo(
    () =>
      [
        {
          key: "1",
          label: "Details",
          hidden: false,
          children: (
            <>
              {details && Object.keys(details).length > 0 && (
                <>
                  <DetailPayments details={details} />
                </>
              )}
            </>
          ),
        },
        {
          key: "3",
          label: "Refunds",
          hidden: details?.payment_type === "invoice_payment",

          children: (
            <>
              {details && Object.keys(details).length > 0 && (
                <>
                  {has_InvoicePaymentRecordView_permission ? (
                    <Refund
                      PaymentRefund
                      isModal={isModal}
                      PRdetail={details}
                      fetchList={fetchList}
                      refetchRefund={refetchRefund}
                      refetchPaymentReceived={refetchPaymentReceived}
                      url={`${endpoints.ADVANCE_REFUND}/${details?.id}/list`}
                      Permissions={{
                        create: has_InvoicePaymentRecordCreate_permission,
                        delete: has_InvoicePaymentRecordDelete_permission,
                      }}
                    />
                  ) : (
                    <AccessDenied />
                  )}
                </>
              )}
            </>
          ),
        },
        {
          key: "2",
          label: "Linked Invoices",
          hidden: false,
          children: (
            <>
              {details && Object.keys(details).length > 0 && (
                <DetailLinkedInvoices details={details} type={details?.payment_type} />
              )}
            </>
          ),
        },
        {
          key: "4",
          label: "Attachments",
          hidden: false,
          children: (
            <>
              {details && Object.keys(details).length > 0 && (
                <Attachments
                  details={details}
                  setIsBool={setIsBool}
                  attachments={attachments}
                  handleImage={handleImage}
                  multipleDownloads={multipleDownloads}
                  hasDelete={has_PaymentReceiptsEdit_permission}
                  singleAttachmentDelete={singleAttachmentDelete}
                  singleAttachmentDownload={singleAttachmentDownload}
                />
              )}
            </>
          ),
        },
        {
          key: "5",
          label: "History",
          hidden: false,
          children: (
            <>
              {details && Object.keys(details).length > 0 && (
                <HistoryTable details={details} isModal={isModal} />
              )}
            </>
          ),
        },
      ].filter((tab) => !tab.hidden),
    [details, isbool, tabKey]
  );

  const titleElement = (
    <div className="back-to-listing">
      <Breadcrumbx
        name=""
        detailPage
        refetch={refetchPaymentReceived}
        moduleName={"payment receipts"}
        handleFullScreen={handleFullScreen}
      />
      <div className="_no"> {`Payment Receipt No. ${details?.payment_no}`}</div>
    </div>
  );

  if (fetchingRoles) return <SpinnerX />;

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
                title={titleElement}
                className={`__items_details_header payment_received_header ${
                  isModal ? "payment-modal p-0" : ""
                } `}
                subTitle={
                  <Tag
                    className={`generic-badge
                  ${details?.status}`}
                  >
                    {capitalize(
                      details?.status === "prtl-applied" ? "Partially applied" : details?.status
                    )}
                  </Tag>
                }
                extra={
                  isModal
                    ? []
                    : [
                        <>
                          {!email && (
                            <>
                              <Dropdown.Button
                                trigger={["click"]}
                                menu={{ items: option }}
                                overlayClassName="generic_dropdown"
                                icon={
                                  <img
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/dropdown.svg`}
                                    alt="dropdown"
                                  />
                                }
                                // className="mr-10 btn-edit _detailpage_edit_btn"
                                className={`${
                                  // details?.payment_type === "advance" ||
                                  details?.payment_type === "advance" &&
                                  has_PaymentReceiptsEdit_permission
                                    ? "edit  mr-10 btn-edit _detailpage_edit_btn"
                                    : "no-edit  mr-10 btn-edit _detailpage_edit_btn"
                                }`}
                              >
                                <div
                                  className={"base-style"}
                                  onClick={() =>
                                    details?.payment_type === "advance" &&
                                    has_PaymentReceiptsEdit_permission
                                      ? navigate(`/payment-received-edit?id=${details?.payment_no}`)
                                      : null
                                  }
                                >
                                  Edit
                                </div>
                              </Dropdown.Button>
                            </>
                          )}
                        </>,
                      ]
                }
                footer={
                  <>
                    {!email ? (
                      <div
                        className={`__generic_content_side ${isModal ? "vh-0 pt-20 px-30" : ""}`}
                      >
                        <div className="_payment_received_detial_page _payment_received_page">
                          <div className="d-flex mb-20">
                            <div className="__customer_image">
                              <Image
                                preview={false}
                                className="customer-dp"
                                src={
                                  details?.customer?.photo || details?.invoice?.customer?.photo
                                    ? ImagePath(
                                        details?.customer?.photo ||
                                          (details?.invoice?.customer?.photo as string),
                                        created_by_platform
                                      )
                                    : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                                        import.meta.env.VITE_CUSTOMER_PLACEHOLDER_IMAGE
                                      }`
                                }
                                // placeholder={
                                //   <Icons.AiOutlineFileImage style={{ width: 34, height: 34 }} />
                                // }
                              />
                            </div>

                            <div className="__payment_received_detials">
                              {!isModal && (
                                <div className="account_receipt d-flex __general_receipt">
                                  <TooltipX title="PDF">
                                    <img
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/pdf_icon.svg`}
                                      alt="pdf icon"
                                      onClick={pdfDownload}
                                      className="hover-effect"
                                    />
                                  </TooltipX>
                                  <TooltipX title="Print">
                                    <img
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/print.svg`}
                                      alt="Print Icon"
                                      onClick={onPrint}
                                      className="hover-effect"
                                    />
                                  </TooltipX>
                                  <TooltipX title="Email">
                                    <img
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/email.svg`}
                                      alt="Email Box Icon"
                                      className="hover-effect"
                                      onClick={handleEmail}
                                    />
                                  </TooltipX>
                                  <label
                                    htmlFor="myattachements"
                                    className=""
                                    style={{
                                      cursor: !has_PaymentReceiptsEdit_permission
                                        ? "not-allowed"
                                        : "pointer",
                                    }}
                                  >
                                    <TooltipX placement="bottomRight" title="Attachment">
                                      <img
                                        src={`${
                                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                        }/static/media/attachment.svg`}
                                        alt="Attachment Icon"
                                        className="hover-effect"
                                        style={{
                                          cursor: !has_PaymentReceiptsEdit_permission
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
                                      />
                                      {/* <Icons.MdOutlineAttachFile size={25} /> */}
                                    </TooltipX>
                                    <input
                                      type="file"
                                      name="myfile"
                                      id="myattachements"
                                      onChange={handleImage}
                                      style={{ display: "none" }}
                                      disabled={!has_PaymentReceiptsEdit_permission}
                                      accept=".png,.jpg,.jpeg,.pdf,.csv,.doc,.docx"
                                    />
                                  </label>
                                </div>
                              )}
                              <div className="mb-15 __customer_info">
                                <span className="fw-md lh-18">Reference number:</span>
                                <span className="ref_no lh-17">{details?.reference}</span>
                              </div>

                              <div className="__customer_info mb_18">
                                <img
                                  className="mr-10"
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/user.svg`}
                                  alt="user icon"
                                />
                                <span
                                  onClick={isModal ? () => null : toggleCustomerDetailModal}
                                  className={
                                    isModal
                                      ? "_display_name"
                                      : `_display_name _customer_info_name cursor lh-18`
                                  }
                                >
                                  {details?.customer?.display_name ||
                                    details?.invoice?.customer?.display_name}
                                </span>
                              </div>
                              <div className="__customer_info">
                                <img
                                  className="mr-10"
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/business.svg`}
                                  alt="address icon"
                                />
                                <span className="lh-17">
                                  {details?.customer?.company_name ||
                                    details?.invoice?.customer?.company_name}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Divider />
                          <div className="product-details">
                            <div className="bill_box justify_between mb-10">
                              <div className="final_payment">
                                <div className="__customer_info mb-14">
                                  <span className="fw-md mw-114 mr-10 lh-17">Receipt date:</span>
                                  <span className="lh-17">
                                    {getOrganizationDate(details?.payment_date, org_date_format)}
                                  </span>
                                </div>
                                <div className="__customer_info mb-14">
                                  <span className="fw-md mw-114 mr-10 lh-17">Payment method:</span>
                                  <span className="lh-18">{details?.payment_mode}</span>
                                </div>
                              </div>
                              <div className="amount-details">
                                <div className="__customer_info mb-14 justify_between">
                                  <span className="fw-md mw-114 mr-10 lh-17">Amount received:</span>
                                  <span className="fw-bold lh-17 min_width">
                                    {details?.currency?.symbol}&nbsp;
                                    {details?.payment_type === "advance"
                                      ? (details?.payment || 0).toFixed(2)
                                      : (details?.payment_made || 0).toFixed(2)}
                                  </span>
                                </div>
                                <div className="__customer_info mb-14 justify_between">
                                  <span className="fw-md mw-114  mr-10 lh-17">Applied:</span>
                                  <span className="lh-17 min_width">
                                    {details?.currency?.symbol}&nbsp;
                                    {(
                                      (details?.payment_type === "advance"
                                        ? details?.payment
                                        : details?.payment_made) - details?.unused_amount || 0
                                    ).toFixed(2)}
                                  </span>
                                </div>
                                <div className="__customer_info mb-14 justify_between">
                                  <span className="fw-md mw-114  mr-10 lh-17">Unapplied:</span>
                                  <span className="lh-17 min_width">
                                    {details?.currency?.symbol}&nbsp;
                                    {(details?.unused_amount || 0).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <div className="payment--receipt__memo">
                                <Form
                                  form={form}
                                  initialValues={{ notes: details?.note }}
                                  className="_items_term_and_conditions"
                                >
                                  <div className="product-details-right">
                                    <div className="d-flex justify_between align-center">
                                      <Typography.Title level={5} className="fw-md">
                                        Memo
                                      </Typography.Title>
                                      {!isModal && (
                                        <>
                                          {notes && (
                                            <div className="note_cancel_btn">
                                              <Buttonx
                                                type="link"
                                                btnText="Cancel"
                                                style={{
                                                  marginBottom: 0,
                                                }}
                                                clickHandler={() => {
                                                  setNotes(false);
                                                  form.setFieldValue("notes", details?.note);
                                                }}
                                              />
                                            </div>
                                          )}
                                          <Buttonx
                                            type="link"
                                            clickHandler={handleNotes}
                                            btnText={!notes ? "Edit" : "Save"}
                                            className={!notes ? "edit_btn _btn" : "save_btn _btn"}
                                            disabled={
                                              (notes && details?.note === Note?.trim()) ||
                                              (imsEdit === "false"
                                                ? details?.platform_type !== "books"
                                                : true) ||
                                              !has_PaymentReceiptsEdit_permission
                                            }
                                          />
                                        </>
                                      )}
                                    </div>

                                    <Form.Item name="notes">
                                      <TextArea
                                        rows={4}
                                        showCount
                                        maxLength={1000}
                                        disabled={!notes}
                                        className={Note ? "text_bg_color" : ""}
                                        onChange={(e: any) => {
                                          const { value } = e.target;
                                          const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                                          form.setFieldValue("notes", formattedValue);
                                        }}
                                      />
                                    </Form.Item>
                                  </div>
                                </Form>
                              </div>
                            </div>
                            {isbool && (
                              <div className="pdf_spinner">
                                <Spinner />
                              </div>
                            )}
                          </div>
                          <div className="bg-white email-box-height">
                            <Tabs
                              activeKey={tabKey}
                              items={memoizeTabs}
                              onChange={handleTabChange}
                              className="__items-details_container __item_details_tab_container res--scroll"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Email
                        setEmail={setEmail}
                        handleEmail={handleEmail}
                        refetch={refetchPaymentReceived}
                        emailUrl={`${ADVANCE_PAYMENT}/${
                          details?.payment_no ?? localObj?.curr_id
                        }/mail`}
                      />
                    )}
                    {customerDetail && (
                      <ContactModal
                        bool={customerDetail}
                        toggle={toggleCustomerDetailModal}
                        detail={{
                          id:
                            details?.payment_type === "advance"
                              ? details?.customer?.id
                              : details?.invoice?.customer_id,
                        }}
                      />
                    )}
                    {pdfModal && (
                      <PdfViewer
                        pdfUrl={pdfUrl}
                        pdfModal={pdfModal}
                        togglePdfModal={togglePdfModal}
                      />
                    )}
                  </>
                }
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DetailPage;
