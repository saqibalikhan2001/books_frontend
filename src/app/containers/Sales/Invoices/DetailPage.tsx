/**@format */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AiOutlinePhone } from "react-icons/ai";
import { PageHeader } from "@ant-design/pro-layout";
import {
  Tag,
  Tabs,
  Image,
  Button,
  Dropdown,
  MenuProps,
  Typography,
  Popconfirm,
  Statistic,
} from "antd";
import { endpoints } from "static";
import { DetailPageProps } from "./Types";
import { HistoryTable } from "./HistoryTable";
import INVPayment from "./INVPayments/Payment";
import { TooltipX } from "app/shared/ToolTip";
import { CreditApplied } from "./AppliedOnCredit";
import { CreatePayment } from "./INVPayments/Create";
import { DetailInvoiceTable } from "./DetailInvoiceTable";
import { CreditnotesDetail } from "../CreditNotes/CreditNoteDetail";
import { ContactModal, PdfViewer, Spinner, Toast } from "app/shared";
import { EstimateDetailModal } from "../Estimates/EstimateDetailModal";
import { AccessDenied, Attachments, Breadcrumbx, Email } from "app/shared";
import { useAxios, useBool, useStore, usePermissions, useSharedOrganization } from "app/Hooks";
import { ImagePath, capitalize, getKeyFromSS, getOrganizationDate, removeKeyFromSS } from "utils";
import {
  MAX_FILE_SIZE,
  attachementAllowedFormats,
  attachmentTypeToastMessage,
} from "app/shared/AllowedFormats";

const { Title } = Typography;
const { INVOICES, SENT, PAYMENT_RECEIVED, CREATE } = endpoints;

export const DetailPage = ({
  data,
  from,
  detail,
  setparam,
  setFalse,
  handleConfirm,
  isModal = false,
  refetchInvoices,
  loading = false,
  handleFullScreen,
  detailpage = false,
}: DetailPageProps) => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, setTrue } = useBool();
  const tabkey = getKeyFromSS("tabKey");
  const [tabKey, setTabKey] = useState("1");
  const [email, setEmail] = useState(false);
  const [isbool, setIsBool] = useState(false);
  const [loader, setLoader] = useState(true);
  const { checkPermission } = usePermissions();
  const [details, setDetails] = useState<any>();
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const localObj = JSON.parse(getKeyFromSS("obj"));
  const [attachments, setAttachments] = useState([]);
  const sessionEmail = JSON.parse(getKeyFromSS("email"));
  const { bool: fetchList, setTrue: refetch } = useBool();
  const [appliedModal, setAppliedModal] = useState(false);
  const { checkModulePermission } = useSharedOrganization();
  const { bool: boolModal, toggle: toggleModal } = useBool();
  const [customerDetail, setCustomerDetail] = useState(false);
  const { created_by_platform, org_date_format } = useStore();
  const [creditNotesData, setCreditnotesData] = useState<any>();
  const [estimateDetailModal, setEstimateDetailModal] = useState(false);
  const {
    bool: fetchCreditNote,
    setTrue: refetchCreditNotes,
    setFalse: creditNoteFalse,
  } = useBool();
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  const { has_InvoiceEdit_permission } = checkPermission("InvoiceEdit");
  const has_InvoicesModule_permission = checkModulePermission("invoices");
  const { has_InvoiceDelete_permission } = checkPermission("InvoiceDelete");
  const { has_InvoiceCreate_permission } = checkPermission("InvoiceCreate");
  const { has_CreditNoteView_permission } = checkPermission("CreditNoteView");
  const { has_PaymentReceiptsView_permission } = checkPermission("PaymentReceiptsView");
  const { has_InvoicePaymentRecordCreate_permission } = checkPermission(
    "InvoicePaymentRecordCreate"
  );

  const { getCurrentModule } = useSharedOrganization();
  const { status: paymentReceived = undefined } = getCurrentModule("payment-received") || {};
  const { status: creditNotes = undefined } = getCurrentModule("credit-notes") || {};
  const toggleEstimateDetailModal = () => setEstimateDetailModal(!estimateDetailModal);

  useEffect(() => {
    if (localObj?.curr_id ?? detail?.id) {
      callAxios({
        url: `${INVOICES}/${isModal || detailpage ? detail?.id : localObj?.curr_id ?? detail?.id}`,
        deploymentTime: true,
      }).then((res) => {
        setDetails(res);
        setAttachments(res.invoice_info.attachments);
        setFalse?.(false);
        setLoader(false);
      });
      if (has_CreditNoteView_permission) {
        getCreditNotes();
      }
      if (tabkey) {
        setTabKey(tabkey);
        removeKeyFromSS("tabKey");
      } else {
        setTabKey("1");
      }
    }

    return () => {
      setEmail(false);
    };
    //eslint-disable-next-line
  }, [detail?.id, localObj?.curr_id, bool, loading]);
  useEffect(() => {
    if (fetchCreditNote) getCreditNotes();
    creditNoteFalse();

    //eslint-disable-next-line
  }, [fetchCreditNote]);

  const getCreditNotes = () => {
    callAxios({
      url: `invoices/${detail?.id ?? localObj?.curr_id}/creditnotes`,
    }).then((res) => {
      setCreditnotesData(res);
    });
  };

  useEffect(() => {
    if (sessionEmail) setEmail(true);
    else setEmail(false);
  }, [sessionEmail]);

  const handleEmail = () => setEmail(!email);
  const handleTabChange = (key) => setTabKey(key);
  const togglePdfModal = () => setPdfModal(!pdfModal);
  const handleAppliedModal = () => setAppliedModal(!appliedModal);
  const toggleCustomerDetailModal = () => setCustomerDetail(!customerDetail);
  const pdfDownload = () => {
    setIsBool(true);
    callAxios({
      url: `/invoices/${details?.invoice_info?.id}/pdf?download=true`,
    })
      .then((res) => {
        if (res) {
          const element = document.createElement("a");
          element.href = res;
          element.download = `Invoice-${details?.invoice_info?.invoice_no} .pdf`;
          element.click();
          setIsBool(false);
        }
      })
      .catch(() => setIsBool(false));
  };

  const onPrint = () => {
    setPdfUrl(`/invoices/${details?.invoice_info?.id}/pdf`);
    togglePdfModal();
  };

  const handleImage = (e: any) => {
    setTabKey("4");

    if (e.target.files !== undefined) {
      const file = e.target.files[0];

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
      if (file.size >= MAX_FILE_SIZE) {
        Toast({
          message: "File should be less than the allowed maximum Size i.e 5 MB",
          type: "error",
        });
        e.target.value = "";
        return;
      }
      setIsBool(true);
      const formdata = new FormData();
      formdata.append("subjectId", details?.invoice_info?.id as any);
      formdata.append("name", details?.invoice_info?.invoice_no as string);
      formdata.append(`files[0]`, file as any);

      callAxios({
        url: "/invoices/attachments",
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
      url: `${endpoints.INVOICES}${endpoints.ATTACHMENT}/${id}`,
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
      url: `${endpoints.INVOICES}/${details?.invoice_info?.id}/download-all`,
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
  const MarkAsSent = useCallback(
    () =>
      callAxios({
        url: `${INVOICES}/${details?.invoice_info?.id}${SENT}`,
        method: "put",
        data: {},
      }).then((res) => {
        if (res) {
          Toast({ message: res.message });
          refetch();
          refetchInvoices();
        }
      }),
    //eslint-disable-next-line
    [details, isbool]
  );

  const handleButton = () => {
    toggleModal();
  };
  const singleAttachmentDownload = (id) => {
    setIsBool(true);
    callAxios({
      url: `${endpoints.INVOICES}/${id}/download-attachment`,
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
    () =>
      [
        {
          key: "1",
          hide: false,
          label: "Details",
          children: (
            <>
              {details && Object.keys(details).length > 0 && (
                <DetailInvoiceTable isModal={isModal} details={details} setDetails={setDetails} />
              )}
            </>
          ),
        },
        {
          key: "2",
          hide: !paymentReceived,
          label: "Payments",
          children: (
            <>
              {details && Object.keys(details).length > 0 && has_PaymentReceiptsView_permission ? (
                <INVPayment
                  from={from}
                  isModal={isModal}
                  detail={details}
                  dashboardProp={detail}
                  refetch={refetch}
                  fetchList={fetchList}
                  refetchInvoices={refetchInvoices}
                  url={`${INVOICES}/${details?.invoice_info?.id}/payments`}
                />
              ) : (
                <AccessDenied />
              )}
            </>
          ),
        },
        {
          key: "3",
          label: "Credit notes",
          hide:
            (!creditNotesData?.show_add_button && !creditNotesData?.credit_notes?.length) ||
            !creditNotes,
          children: (
            <>
              {/* creditNotesData?.show_add_button */}
              {details && Object.keys(details).length > 0 && has_CreditNoteView_permission ? (
                <CreditnotesDetail
                  isModal={isModal}
                  details={details}
                  className="invoice--creditNotes"
                  creditNotesData={creditNotesData}
                  refetchInvoices={refetchInvoices}
                  refetchCreditNotes={refetchCreditNotes}
                />
              ) : (
                <AccessDenied />
              )}
            </>
          ),
        },
        {
          key: "4",
          hide: false,
          label: "Attachments",
          children: (
            <>
              {details && Object.keys(details).length > 0 && (
                <Attachments
                  isModal={isModal}
                  setIsBool={setIsBool}
                  attachments={attachments}
                  handleImage={handleImage}
                  details={details?.invoice_info}
                  multipleDownloads={multipleDownloads}
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
          children: (
            <>
              {details && Object.keys(details).length > 0 && (
                <HistoryTable isModal={isModal} details={details} />
              )}
            </>
          ),
        },
      ].filter((tab) => !tab.hide),
    //eslint-disable-next-line
    [
      isbool,
      details,
      fetchList,
      refetchInvoices,
      creditNotesData,
      fetchCreditNote,
      refetchCreditNotes,
    ]
  );

  const option: MenuProps["items"] = useMemo(
    () => [
      {
        key: "duplicate",
        label: "Duplicate",
        disabled: !has_InvoiceCreate_permission,
        onClick: () => navigate(`/invoice/clone?id=${details?.invoice_info?.id}`),
      },
      {
        key: "sent",
        label: "Mark as sent",
        onClick: MarkAsSent,
        disabled: details?.invoice_info?.status !== "draft" || !has_InvoiceEdit_permission,
        className:
          details?.invoice_info?.status !== "draft" || !has_InvoiceEdit_permission
            ? "disabled-option"
            : "",
        // disabled:
        //   details?.status === "sent" ||
        //   !(!has_SalesOrderModule_permission && has_SalesOrderCreate_permission),
      },
      {
        key: "delete",
        label: (
          <Popconfirm
            key="confirm"
            placement="left"
            disabled={
              !(
                (imsEdit === "false" ? details?.invoice_info?.platform_type === "books" : true) &&
                has_InvoiceDelete_permission
              ) || details?.invoice_info?.status !== "draft"
            }
            title={`Are you sure you want to delete "${details?.invoice_info?.invoice_no}"?`}
            okText={
              (imsEdit === "false" ? details?.invoice_info?.platform_type === "books" : true) &&
              has_InvoiceDelete_permission
                ? "YES"
                : "OK"
            }
            cancelText="No"
            showCancel={
              (imsEdit === "false" ? details?.invoice_info?.platform_type === "books" : true) &&
              has_InvoiceDelete_permission
            }
            onCancel={(e) => e?.stopPropagation()}
            onConfirm={(e) => {
              e?.stopPropagation();
              handleConfirm(
                details?.invoice_info,
                INVOICES,
                refetch,
                data,
                // detail?.invoices?.data as any,
                "/invoices",
                setparam
              );
            }}
          >
            <label
              style={{
                cursor:
                  !(
                    (imsEdit === "false"
                      ? details?.invoice_info?.platform_type === "books"
                      : true) && has_InvoiceDelete_permission
                  ) || details?.invoice_info?.status !== "draft"
                    ? "not-allowed"
                    : "pointer",
                width: "100%",
                display: "block",
                opacity:
                  !(
                    (imsEdit === "false"
                      ? details?.invoice_info?.platform_type === "books"
                      : true) && has_InvoiceDelete_permission
                  ) || details?.invoice_info?.status !== "draft"
                    ? 0.8
                    : 1,
              }}
              // className=details?.invoice_info?.platform_type === "books" && has_InvoiceDelete_permission
              //  || details?.invoice_info?.status !== "draft" ? 'disabled-option'  : ''
              onClick={(e) => e?.stopPropagation()}
            >
              Delete
            </label>
          </Popconfirm>
        ),
        disabled:
          !(
            (imsEdit === "false" ? details?.invoice_info?.platform_type === "books" : true) &&
            has_InvoiceDelete_permission
          ) || details?.invoice_info?.status !== "draft",
      },
    ],
    [
      refetch,
      details,
      navigate,
      MarkAsSent,
      handleConfirm,
      has_InvoiceDelete_permission,
      data,
      setparam,
      creditNotesData,
    ]
  );

  const titleElement = (
    <div style={{ display: "flex" }}>
      <Breadcrumbx
        name=""
        detailPage
        refetch={refetchInvoices}
        moduleName={"Invoices"}
        handleFullScreen={handleFullScreen}
      />
      &nbsp; {`Invoice No. ${details?.invoice_info?.invoice_no}`}
    </div>
  );
  const billAddress3 = (data) => {
    return `${data?.city ? data?.city + ", " : ""}${data?.state ? data?.state + ", " : ""}${
      data?.zip_code ? data?.zip_code + ", " : ""
    }${data?.country_name ? data?.country_name + "." : ""}`;
  };

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
                className={`__items_details_header justify-md-end flex-md-column __invoice_details_header modals-header ${
                  isModal ? "px-30" : ""
                }`}
                title={titleElement}
                subTitle={
                  <Tag
                    className={`generic-badge
                    ${
                      details?.invoice_info?.status &&
                      details?.invoice_info?.status === "partially paid"
                        ? "partially-paid"
                        : details?.invoice_info?.status
                    }`}
                  >
                    {capitalize(
                      details?.invoice_info?.status &&
                        details?.invoice_info?.status === "partially paid"
                        ? "PRTL Paid"
                        : details?.invoice_info?.status
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
                                menu={{ items: option }}
                                trigger={["click"]}
                                icon={
                                  <img
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/dropdown.svg`}
                                    alt="arrow icon"
                                  />
                                }
                                className="mr-10 btn-edit _detailpage_edit_btn"
                              >
                                <div
                                  className={`${
                                    details?.invoice_info?.status === "draft" &&
                                    has_InvoiceEdit_permission &&
                                    (imsEdit === "false"
                                      ? details?.invoice_info?.platform_type === "books"
                                      : true)
                                      ? "edit base-style"
                                      : "no-edit base-style"
                                  }`}
                                  onClick={() =>
                                    details?.invoice_info?.status === "draft" &&
                                    has_InvoiceEdit_permission &&
                                    (imsEdit === "false"
                                      ? details?.invoice_info?.platform_type === "books"
                                      : true)
                                      ? navigate(`/invoice-edit?id=${details?.invoice_info?.id}`)
                                      : null
                                  }
                                >
                                  Edit
                                </div>
                              </Dropdown.Button>
                              <Button
                                className={`btn-form-size btn-primary btn-primary ${
                                  details?.invoice_info.status === "paid" ||
                                  !(!has_InvoicesModule_permission && has_InvoiceCreate_permission)
                                    ? "disabled-option"
                                    : ""
                                }`}
                                type="primary"
                                onClick={handleButton}
                                disabled={
                                  details?.invoice_info.status === "paid" ||
                                  details?.invoice_info.total === 0 ||
                                  !has_InvoicePaymentRecordCreate_permission
                                }
                              >
                                Receive payment
                              </Button>
                            </>
                          )}
                        </>,
                      ]
                }
                footer={
                  <>
                    {!email ? (
                      <div
                        className={`__generic_content_side ${isModal ? "vh-0 pt-20 pr-0" : ""} ${
                          detail ? "dashboard--details" : ""
                        }`}
                      >
                        {details?.utilizeableCredits &&
                          details?.invoice_info?.status !== "paid" &&
                          !email && (
                            <div
                              style={{ background: "#fff3e5", padding: 5 }}
                              className="d-flex justify_between align-center p-5 mb-10 _invoice_detial_page"
                            >
                              <div className="d-flex credit_header">
                                Credits Available: &nbsp;
                                <Statistic
                                  precision={2}
                                  className="no-space"
                                  valueStyle={{ fontSize: "14px" }}
                                  value={details?.total_unusedcredits || 0}
                                  prefix={details?.base_currency?.symbol}
                                />
                              </div>
                              {!isModal && (
                                <Button
                                  className="btn-form-size btn-primary"
                                  type="primary"
                                  onClick={handleAppliedModal}
                                >
                                  Apply Now
                                </Button>
                              )}
                            </div>
                          )}
                        <div className="_invoice_detial_page">
                          <div className="d-flex mb-30">
                            {details?.invoice_info?.customer?.photo ? (
                              <Image
                                preview={false}
                                className="customer-dp"
                                src={ImagePath(
                                  details?.invoice_info?.customer?.photo as string,
                                  created_by_platform
                                )}
                              />
                            ) : (
                              <div className="user_default_image">
                                <img
                                  alt="user icon"
                                  className="user_profile_icon"
                                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                                    import.meta.env.VITE_CUSTOMER_PLACEHOLDER_IMAGE
                                  }`}
                                />
                              </div>
                            )}
                            <div className="__invoice_detials">
                              {!isModal && (
                                <div className="account_receipt d-flex __general_receipt">
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
                                      onClick={onPrint}
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
                                  <label htmlFor="myattachements" className="hover-effect">
                                    <TooltipX placement="bottomRight" title="Attachment">
                                      <img
                                        alt="Attachment Icon"
                                        src={`${
                                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                        }/static/media/attachment.svg`}
                                        style={{
                                          cursor: !has_InvoiceEdit_permission
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
                                      disabled={!has_InvoiceEdit_permission}
                                      accept=".png,.jpg,.jpeg,.pdf,.csv,.doc,.docx"
                                    />
                                  </label>
                                </div>
                              )}
                              <div className="mb-15 __customer_info">
                                <span className="fw-md mr-10">Reference number:</span>
                                <span>{details?.invoice_info?.reference}</span>
                              </div>

                              <div className="mb-15 __customer_info">
                                <img
                                  alt="user icon"
                                  className="mr-10"
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/user.svg`}
                                />
                                <span
                                  onClick={() => !isModal && toggleCustomerDetailModal()}
                                  className={
                                    isModal
                                      ? "_display_name"
                                      : "_display_name _customer_info_name cursor"
                                  }
                                >
                                  {details?.invoice_info?.display_name}
                                </span>
                              </div>
                              <div className="mb-15 __customer_info">
                                <img
                                  className="mr-10"
                                  alt="address icon"
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/business.svg`}
                                />
                                <span>{details?.invoice_info?.customer?.company_name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="product-details">
                            <div className="mb-15">
                              <Title level={4}>Bill to</Title>
                            </div>
                            <div className="d-flex justify_between res--x">
                              <div className="__general_details_page_left ">
                                <div className="mb-15 __customer_info">
                                  <img
                                    alt="user icon"
                                    className="mr-10"
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/user.svg`}
                                  />
                                  <span className="_display_name">
                                    {details?.invoice_info?.billing_address?.attention}
                                  </span>
                                </div>

                                <div className="mb-15 __customer_info">
                                  <img
                                    className="mr-10"
                                    alt="address icon"
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/business.svg`}
                                  />
                                  <span>{details?.invoice_info?.customer?.company_name}</span>
                                </div>

                                <div className="mb-15 __customer_info">
                                  <img
                                    className="mr-10"
                                    alt="location icon"
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/location.svg`}
                                  />
                                  <span>
                                    {details?.invoice_info?.billing_address?.street || ""}
                                    {details?.invoice_info?.billing_address?.street_2
                                      ? `, ${details?.invoice_info?.billing_address?.street_2}`
                                      : ""}

                                    {billAddress3(details?.invoice_info?.billing_address)}
                                  </span>
                                </div>

                                <div
                                  className="mb-15 __customer_info phone_info"
                                  style={{ alignItems: "center" }}
                                >
                                  <span className="">
                                    <AiOutlinePhone className="phone_icon" size="22px" />
                                  </span>
                                  <span>{details?.invoice_info?.billing_address?.phone}</span>
                                </div>
                              </div>
                              <div className="__general_details_page_right">
                                <div className="__customer_info mb-15">
                                  <span className="fw-md w-102 mr-10">Issue date:</span>{" "}
                                  <span>
                                    {getOrganizationDate(
                                      details?.invoice_info?.invoice_date,
                                      org_date_format
                                    )}
                                  </span>
                                </div>
                                <div className="__customer_info mb-15">
                                  <span className="fw-md w-102  mr-10">Expiry date:</span>
                                  <span>
                                    {getOrganizationDate(
                                      details?.invoice_info?.due_date,
                                      org_date_format
                                    )}
                                  </span>
                                </div>
                                <div className="__customer_info mb-15">
                                  <span className="fw-md w-102  mr-10">Payment terms:</span>
                                  <span>{details?.invoice_info?.invoice_term_name}</span>
                                </div>
                                <div className="__customer_info mb-15">
                                  <span className="fw-md w-102  mr-10">Order No:</span>
                                  <span
                                    className={`_display_name ${
                                      details?.invoice_info?.estimate_id && !isModal
                                        ? " _customer_info_name"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      details?.invoice_info?.estimate_id && !isModal
                                        ? toggleEstimateDetailModal()
                                        : null
                                    }
                                  >
                                    {details?.invoice_info?.order_no}
                                  </span>
                                </div>

                                {/*<div className="mb-15 __customer_info">
                                  <Icons.RxPerson size="18px" />
                                  <span
                                        onClick={toggleCustomerDetailModal}
                                        className="_display_name _customer_info_name cursor"
                                      >
                                
                                    {details?.invoice_info?.customer?.display_name}
                                  </span>
                                </div>
                                <div className="mb-15 __customer_info">
                                  <Icons.HiOutlineOfficeBuilding size="18px" />
                                  <span className="_display_name">
                                    {details?.invoice_info?.customer?.company_name}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="product-details">
                              <div className="mb-15">
                                <Title level={4}>Bill to</Title>
                              </div>
                              <div className="d-flex justify_between">
                                <div className="__general_details_page_left ">
                                  <div className="mb-15 __customer_info">
                                    <Icons.RxPerson size="18px" />
                                    <span className="_display_name">
                                      {details?.invoice_info?.customer?.display_name}
                                    </span>
                                  </div>

                                  <div className="mb-15 __customer_info">
                                    <Icons.HiOutlineOfficeBuilding size="18px" />
                                    <span>{details?.invoice_info?.customer?.company_name}</span>
                                  </div>

                                  <div className="mb-15 __customer_info">
                                    <Icons.VscLocation size="18px" />
                                    <span>{details?.invoice_info?.billing_address?.country_name}</span>
                                  </div>
                                </div>
                                <div className="__general_details_page_right">
                                  <div className="__customer_info mb-15">
                                    <span className="fw-md w-102 mr-10">Issue date:</span>{" "}
                                    <span>
                                      {getOrganizationDate(
                                        details?.invoice_info?.created_at,
                                        org_date_format
                                      )}
                                    </span>
                                  </div>
                                  <div className="__customer_info mb-15">
                                    <span className="fw-md w-102  mr-10">Expiry date:</span>
                                    <span>
                                      {getOrganizationDate(
                                        details?.invoice_info?.due_date,
                                        org_date_format
                                      )}
                                    </span>
                                  </div>
                                  <div className="__customer_info mb-15">
                                    <span className="fw-md w-102  mr-10">Payment terms:</span>
                                    <span>{details?.invoice_info?.invoice_term_name}</span>
                                  </div>
                                  {/* {details?.invoice_info?.order_no && (
                                    <div className="__customer_info mb-15">
                                      <span className="fw-md w-102  mr-10">Order No:</span>
                                      <span onClick={toggleEstimateDetailModal}>
                                        {details?.invoice_info?.order_no}
                                      </span>
                                    </div>
                                  )} */}
                              </div>
                            </div>
                          </div>
                          <EstimateDetailModal
                            isModal
                            bool={estimateDetailModal}
                            toggle={toggleEstimateDetailModal}
                            className="__invoices-estimates--modal"
                            detail={{ id: details?.invoice_info?.estimate_id }}
                          />
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
                    ) : (
                      <Email
                        setEmail={setEmail}
                        refetch={refetchInvoices}
                        handleEmail={handleEmail}
                        emailUrl={`${endpoints.INVOICES}/${
                          details?.invoice_info?.id ?? localObj?.curr_id
                        }/mail`}
                      />
                    )}
                  </>
                }
              />
            </div>
          </div>
          {pdfModal && (
            <PdfViewer pdfModal={pdfModal} togglePdfModal={togglePdfModal} pdfUrl={pdfUrl} />
          )}
          {boolModal && (
            <CreatePayment
              refetch={refetch}
              showModal={boolModal}
              toggleModal={toggleModal}
              refetchInvoices={refetchInvoices}
              invoice_id={details?.invoice_info?.id}
              has_permission={has_InvoicePaymentRecordCreate_permission}
              url={`${PAYMENT_RECEIVED}/${details?.invoice_info?.id}${CREATE}`}
            />
          )}
        </>
      )}
      {customerDetail && (
        <ContactModal
          bool={customerDetail}
          toggle={toggleCustomerDetailModal}
          detail={{ id: details?.invoice_info?.customer?.id }}
        />
      )}
      <CreditApplied
        detail={details}
        showModal={appliedModal}
        refetchApplied={refetchInvoices}
        toggleModal={handleAppliedModal}
        refetchPaymentReceived={() => null}
        has_permission={details?.utilizeableCredits}
      />
    </>
  );
};
