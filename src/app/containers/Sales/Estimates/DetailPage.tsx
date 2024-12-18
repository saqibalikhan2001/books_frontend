/**@format */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AiOutlinePhone } from "react-icons/ai";
import { Tag, Tabs, Image, Select, Dropdown, MenuProps, Typography, Popconfirm } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { endpoints, routeNames } from "static";
import { HistoryTable } from "./HistoryTable";
import { EstimateDetailPageProps } from "./Types";
import { DetailItemTable } from "./DetailItemTable";
import { statusDraft, statusSent } from "./constant";
import {
  Icons,
  Toast,
  Email,
  Spinner,
  PdfViewer,
  Attachments,
  ContactModal,
  Breadcrumbx,
  AccessDenied,
} from "app/shared";
import { InvoiceModal } from "./InvoiceModal";
import { InvoicesList } from "./InvoicesList";
import { TooltipX } from "app/shared/ToolTip";
import { SpinnerX } from "app/shared/PageLoader";
import { useAxios, useBool, usePermissions, useStore } from "app/Hooks";
import { ImagePath, capitalize, getKeyFromSS, getOrganizationDate, removeKeyFromSS } from "utils";
import {
  MAX_FILE_SIZE,
  attachementAllowedFormats,
  attachmentTypeToastMessage,
} from "app/shared/AllowedFormats";

const { Title } = Typography;
const { ESTIMATES_ClONE, EDIT_ESTIMATE } = routeNames;

export const DetailPage = ({
  data,
  detail,
  refetch,
  isModal,
  setparam,
  setFalse,
  detailpage,
  handleConfirm,
  loading = false,
  handleFullScreen,
}: EstimateDetailPageProps) => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, setTrue } = useBool();
  const tabkey = getKeyFromSS("tabKey");
  const [email, setEmail] = useState(false);
  const [tabKey, setTabKey] = useState("1");
  const [loader, setLoader] = useState(true);
  const [isbool, setIsBool] = useState(false);
  const [details, setDetails] = useState<any>();
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const localObj = JSON.parse(getKeyFromSS("obj"));
  const [attachments, setAttachments] = useState([]);
  const sessionEmail = JSON.parse(getKeyFromSS("email"));
  const [invoiceModal, setInvoiceModal] = useState(false);
  const { checkPermission, fetchingRoles } = usePermissions();
  const [customerDetail, setCustomerDetail] = useState(false);
  const { created_by_platform, org_date_format } = useStore();
  const { has_InvoiceView_permission } = checkPermission("InvoiceView");
  const { has_EstimatesEdit_permission } = checkPermission("EstimatesEdit");
  const { has_EstimatesDelete_permission } = checkPermission("EstimatesDelete");

  const handleEmail = () => setEmail(!email);
  const togglePdfModal = () => setPdfModal(!pdfModal);
  const toggleCustomerDetailModal = () => setCustomerDetail(!customerDetail);
  const toggleInvoiceModal = () => setInvoiceModal(!invoiceModal);

  useEffect(() => {
    if (localObj?.curr_id ?? detail?.id) {
      // setFalse(true);
      callAxios({
        url: `${endpoints.ESTIMATES}/${
          isModal || detailpage ? detail?.id : localObj?.curr_id ?? detail?.id
        }`,
        deploymentTime: true,
      }).then((res) => {
        setDetails(res);
        setAttachments(res?.attachments);
        setFalse?.(false);
        setLoader(false);
      });
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
  }, [localObj?.curr_id, detail?.id, bool]);

  useEffect(() => {
    if (sessionEmail) setEmail(true);
    else setEmail(false);
  }, [sessionEmail]);

  const handleTabChange = (key) => setTabKey(key);

  const ConvertToSO = useCallback(
    () =>
      callAxios({
        url: `${endpoints.ESTIMATE}/${details?.id}${endpoints.SALES_ORDERS}`,
        method: "post",
        data: details,
      }).then((res) => {
        if (res) {
          Toast({ message: res.message });
          refetch?.();
          setTrue();
        }
      }),
    //eslint-disable-next-line
    [details, refetch, setTrue]
  );
  const sentMark = useCallback(
    () =>
      callAxios({
        url: `${endpoints.ESTIMATES}/${details?.id}${endpoints.ESTIMATE_SENT}`,
        method: "put",
      }).then((res) => {
        if (res) {
          Toast({ message: res.message });
          refetch?.();
          setTrue();
        }
      }),
    //eslint-disable-next-line
    [details, refetch, setTrue]
  );
  const handleImage = (e: any) => {
    setTabKey("2");
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
      formdata.append("subjectId", details?.id as any);
      formdata.append("name", details?.estimate_no as string);
      formdata.append(`files[0]`, file as any);
      callAxios({
        url: endpoints.ESTIMATE_ATTACHMENT,
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
      url: `${endpoints.ESTIMATES}${endpoints.ATTACHMENT}/${id}`,
      method: "delete",
    }).then((res) => {
      setIsBool(false);
      Toast({ message: res?.message });
      setAttachments(attachments?.filter((attach: { id: number }) => attach?.id !== id));
      // refetch();
      setTrue();
    });
  };
  const singleAttachmentDownload = (id) => {
    setIsBool(true);
    callAxios({
      url: `${endpoints.ESTIMATES}/${id}/download-attachment`,
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

  const multipleDownloads = () => {
    setIsBool(true);
    callAxios({
      url: `${endpoints.ESTIMATES}/${details?.id}/download-all`,
    }).then((res) => {
      if (res?.name) {
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
  const changeStatus = (value) => {
    callAxios({
      url: `${endpoints.ESTIMATES}/${details?.id}/${value}`,
      method: "put",
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        refetch?.();
        setTrue();
      }
    });
  };

  const onPrint = () => {
    setPdfUrl(`${endpoints.ESTIMATES}/${details?.id}/pdf`);
    togglePdfModal();
  };

  const pdfDownload = () => {
    setIsBool(true);
    callAxios({
      url: `${endpoints.ESTIMATES}/${details?.id}/pdf?download=true`,
    })
      .then((res) => {
        if (res) {
          const element = document.createElement("a");
          element.href = res;
          element.download = `Estimate-${details?.estimate_no} .pdf`;
          element.click();
          setIsBool(false);
        }
      })
      .catch(() => setIsBool(false));
  };

  const memoizeTabs = useMemo(
    () => [
      {
        key: "1",
        label: "Details",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              <>
                <DetailItemTable isModal={isModal} details={details} setDetails={setDetails} />
              </>
            )}
          </>
        ),
      },
      {
        key: "2",
        label: "Attachments",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              <>
                <Attachments
                  details={details}
                  isModal={isModal}
                  setIsBool={setIsBool}
                  attachments={attachments}
                  handleImage={handleImage}
                  multipleDownloads={multipleDownloads}
                  singleAttachmentDelete={singleAttachmentDelete}
                  singleAttachmentDownload={singleAttachmentDownload}
                />
              </>
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
              <>
                <HistoryTable isModal={isModal} details={details} />
              </>
            )}
          </>
        ),
      },
      {
        key: "4",
        label: "Invoices",
        children: (
          <>
            {details && Object.keys(details).length > 0 && has_InvoiceView_permission ? (
              <>
                <InvoicesList
                  isModal
                  url={`estimates/${details?.id}/invoices`}
                  refetch={refetch}
                  has_permission
                />
              </>
            ) : (
              <AccessDenied />
            )}
          </>
        ),
      },
    ],
    //eslint-disable-next-line
    [details, isbool, isModal]
  );
  const items: MenuProps["items"] = useMemo(
    () => [
      {
        key: "0",
        onClick: ConvertToSO,
        label: "Convert to SO",
        icon: <Icons.MdOutlinePointOfSale size={18} />,
        disabled: details?.status !== "accepted" || !has_EstimatesEdit_permission || true,
      },
    ],
    [ConvertToSO, details?.status]
  );
  const option: MenuProps["items"] = useMemo(
    () => [
      {
        key: "0",
        label: "Duplicate",
        onClick: () => navigate(`${ESTIMATES_ClONE}?id=${details?.id}`),
      },
      {
        key: "1",
        label: "Mark as sent",
        onClick: sentMark,
        disabled: details?.status !== "draft" || !has_EstimatesEdit_permission,
      },
      {
        key: "2",
        label: (
          <Popconfirm
            key="confirm"
            placement="left"
            disabled={
              !(details?.platform_type === "books" && has_EstimatesDelete_permission) ||
              details?.status !== "draft"
            }
            title={`Are you sure you want to delete "${details?.estimate_no}"?`}
            okText={
              details?.platform_type === "books" && has_EstimatesDelete_permission ? "YES" : "OK"
            }
            cancelText="No"
            showCancel={details?.platform_type === "books" && has_EstimatesDelete_permission}
            onCancel={(e) => e?.stopPropagation()}
            onConfirm={(e) => {
              e?.stopPropagation();
              details?.platform_type === "books" &&
                handleConfirm(details, "/estimates", refetch, data, "/estimates", setparam);
            }}
          >
            <label
              style={{
                cursor:
                  !(details?.platform_type === "books" && has_EstimatesDelete_permission) ||
                  details?.status !== "draft"
                    ? "not-allowed"
                    : "pointer",
                width: "100%",
                display: "block",
              }}
              onClick={(e) => e?.stopPropagation()}
            >
              Delete
            </label>
          </Popconfirm>
        ),
        disabled: details?.status !== "draft",
      },
    ],
    [
      data,
      refetch,
      details,
      navigate,
      sentMark,
      setparam,
      handleConfirm,
      has_EstimatesDelete_permission,
    ]
  );

  const titleElement = (
    <div className="back-to-listing">
      <Breadcrumbx
        name=""
        detailPage
        refetch={refetch}
        moduleName={"Estimates"}
        handleFullScreen={handleFullScreen}
      />
      <div className="_no"> {`Estimate No. ${details?.estimate_no}`}</div>
    </div>
  );
  const billAddress3 = (data) => {
    return `${data?.city ? data?.city + ", " : ""}${data?.state ? data?.state + ", " : ""}${
      data?.zip_code ? data?.zip_code + ", " : ""
    }${data?.country_name ? data?.country_name + "." : ""}`;
  };
  if (fetchingRoles) return <SpinnerX />;
  return (
    <>
      {loader || loading ? (
        <Spinner />
      ) : (
        <>
          <div
            style={{
              animation: "fadeInRight",
              animationDuration: "0.3s",
            }}
          >
            <div style={{ pointerEvents: isbool ? "none" : "auto" }}>
              <PageHeader
                className=" __items_details_header flex-md-column __estimate_detials_header __estimates_detials_header "
                title={titleElement}
                subTitle={
                  <Tag
                    className={`generic-badge ${
                      details?.status === "prtl-applied" ? "PRTL Applied" : details?.status
                    }`}
                  >
                    {capitalize(
                      details?.status === "prtl-applied" ? "PRTL Applied" : details?.status
                    )}
                  </Tag>
                }
                extra={[
                  <>
                    {!email && !isModal && (
                      <div className="__items_details_actions item_detail_header_actions">
                        <div className="status_selection">
                          <label className="_status_label" style={{ marginRight: 0 }}>
                            Status
                          </label>
                          <Select
                            size="large"
                            options={
                              details?.status === "draft"
                                ? statusDraft
                                : details?.status === "sent"
                                ? statusSent
                                : []
                            }
                            placeholder={"Status"}
                            value={details?.status}
                            onChange={changeStatus}
                            suffixIcon={
                              <img
                                src={`${
                                  import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                }/static/media/dropdown.svg`}
                                alt="arrow icon"
                              />
                            }
                            popupClassName="overlap py-10 status_bg_color width-md-120"
                            className="h-36px w-200 __status_dropdown"
                            disabled={
                              !(
                                (details?.status === "sent" || details?.status === "draft") &&
                                has_EstimatesEdit_permission
                              )
                            }
                            getPopupContainer={(trigger) => trigger.parentElement}
                          />
                        </div>
                        <div className="dropdown_btn_list">
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
                            className="btn-edit _detailpage_edit_btn"

                            // disabled={details?.status === "expired"}
                          >
                            <div
                              className={`${
                                (details?.status === "draft" || details?.status === "sent") &&
                                details?.platform_type === "books" &&
                                has_EstimatesEdit_permission
                                  ? "edit base-style"
                                  : "no-edit base-style"
                              }`}
                              onClick={() =>
                                (details?.status === "draft" || details?.status === "sent") &&
                                details?.platform_type === "books" &&
                                has_EstimatesEdit_permission
                                  ? navigate(`${EDIT_ESTIMATE}?id=${details?.id}`)
                                  : null
                              }
                            >
                              Edit
                            </div>
                          </Dropdown.Button>
                          <div className="d-flex align-center __convert_invoice_btn">
                            <Dropdown.Button
                              type="primary"
                              disabled={details?.status !== "accepted"}
                              onClick={toggleInvoiceModal}
                              menu={{ items }}
                              className="__header_dropdown"
                              trigger={["click"]}
                              icon={
                                <span
                                  className={`generic-dropdown-icon ${
                                    data?.issuedCredits <= 0 ? "disabled-svg" : "bg-blue"
                                  }`}
                                >
                                  <img
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/dropdown.svg`}
                                    alt="arrow icon"
                                  />
                                </span>
                              }
                            >
                              Convert to invoice
                            </Dropdown.Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>,
                ]}
                footer={
                  <>
                    {!email ? (
                      <div
                        className={`__generic_content_side  ${isModal ? "vh-0 pr-0" : ""}  ${
                          detail ? "dashboard--details" : ""
                        }`}
                      >
                        <div className="_estimate_detial_page">
                          <div className="d-flex mb-30">
                            {details?.contact?.photo ? (
                              <Image
                                className="customer-dp"
                                preview={false}
                                src={ImagePath(
                                  details?.contact?.photo as string,
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
                            <div className="__estimate_detials">
                              {!isModal && (
                                <div className="account_receipt d-flex __general_receipt">
                                  <TooltipX title="PDF">
                                    <img
                                      className="mr-10 hover-effect"
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/pdf_icon.svg`}
                                      alt="Pdf Icon"
                                      onClick={pdfDownload}
                                    />
                                  </TooltipX>
                                  <TooltipX title="Print">
                                    <img
                                      className="mr-10 hover-effect"
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/print.svg`}
                                      alt="Print Icon"
                                      onClick={onPrint}
                                    />
                                  </TooltipX>
                                  <TooltipX title="Email">
                                    <img
                                      className="mr-5 hover-effect"
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/email.svg`}
                                      alt="Email Box Icon"
                                      onClick={handleEmail}
                                    />
                                  </TooltipX>
                                  <label htmlFor="myattachements" className="">
                                    <TooltipX placement="bottomRight" title="Attachment">
                                      <img
                                        className="hover-effect"
                                        src={`${
                                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                        }/static/media/attachment.svg`}
                                        alt="Attachment Icon"
                                        style={{
                                          cursor: !has_EstimatesEdit_permission
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
                                      />
                                      {/* <Icons.MdOutlineAttachFile size="25px" onClick={handleImage} /> */}
                                    </TooltipX>
                                    <input
                                      type="file"
                                      name="myfile"
                                      id="myattachements"
                                      onChange={handleImage}
                                      style={{ display: "none" }}
                                      accept=".png,.jpg,.jpeg,.pdf,.csv,.doc,.docx"
                                      disabled={!has_EstimatesEdit_permission}
                                    />
                                  </label>
                                </div>
                              )}
                              <div className="mb-15 __customer_info">
                                <span className="fw-md">Reference number: </span>
                                <span className="ref_title">{details?.reference}</span>
                              </div>
                              <div className="mb-15 __customer_info estimates_names estimates_reference">
                                <img
                                  className="mr-10"
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/user.svg`}
                                  alt="user icon"
                                />
                                <span
                                  //@ts-ignore
                                  onClick={isModal ? () => null : toggleCustomerDetailModal}
                                  className="_display_name _customer_info_name cursor"
                                >
                                  {details?.display_name}
                                </span>
                              </div>

                              <div className="mb-15 __customer_info company_info">
                                <span className="mw-18 mr-10 company_icon">
                                  <img
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/business.svg`}
                                  />
                                </span>
                                <span>{details?.contact?.company_name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="product-details">
                            <div className="mb-20">
                              <Title level={4}>Bill to</Title>
                            </div>
                            <div className="d-flex justify_between  estimates-data">
                              <div className="__general_details_page_left ">
                                <div className="mb-15 __customer_info estimates_names">
                                  <img
                                    className="mr-10 "
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/user.svg`}
                                    alt="user icon"
                                  />
                                  <span className="_display_name ">
                                    {details?.billing_address?.attention}
                                  </span>
                                </div>

                                <div className="mb-15 __customer_info company_info">
                                  {/* <Icons.HiOutlineOfficeBuilding size="18px" /> */}
                                  <span className="mr-10 mw-18 company_icon">
                                    <img
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/business.svg`}
                                      alt="address icon"
                                    />
                                  </span>
                                  <span>{details?.contact?.company_name}</span>
                                </div>

                                <div className="mb-15 __customer_info">
                                  <span className="mr-10 mw-18" style={{fontSize: "18px"}}>
                                    <img
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/location.svg`}
                                      alt="location icon"
                                    />
                                  </span>
                                  <span className="mt-2">
                                    {details?.billing_address?.street || ""}
                                    {details?.billing_address?.street_2
                                      ? `, ${details?.billing_address?.street_2}`
                                      : ""}

                                    {billAddress3(details?.billing_address)}
                                  </span>
                                </div>
                                <div className="mb-15 __customer_info phone_info" style={{alignItems:"flex-end"}}>
                                  <span className="">
                                    <AiOutlinePhone className="phone_icon" size="22px" />
                                  </span>
                                  <span className="">{details?.billing_address?.phone}</span>
                                </div>
                              </div>
                              <div className="__general_details_page_right ">
                                <div className="__customer_info mb-15">
                                  <span className="fw-md w-102 mr-10">Issue date:</span>{" "}
                                  <span>
                                    {getOrganizationDate(details?.estimate_date, org_date_format)}
                                  </span>
                                </div>
                                <div className="__customer_info mb-15">
                                  <span className="fw-md w-102  mr-10">Expiry date:</span>
                                  <span>
                                    {getOrganizationDate(details?.expiry_date, org_date_format)}
                                  </span>
                                </div>
                                <div className="__customer_info mb-15">
                                  <span className="fw-md w-102  mr-10">Payment terms:</span>
                                  <span>{details?.payment_term_name}</span>
                                </div>
                              </div>
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
                            items={memoizeTabs}
                            onChange={handleTabChange}
                            activeKey={tabKey}
                            className="__items-details_container __item_details_tab_container __estimates_tab_container res--scroll"
                          />
                        </div>
                      </div>
                    ) : (
                      <Email
                        refetch={refetch}
                        setEmail={setEmail}
                        handleEmail={handleEmail}
                        emailUrl={`${endpoints.ESTIMATES}/${details?.id ?? localObj?.curr_id}/mail`}
                      />
                    )}
                    {customerDetail && (
                      <ContactModal
                        bool={customerDetail}
                        toggle={toggleCustomerDetailModal}
                        detail={{ id: details?.customer_id }}
                      />
                    )}
                    <InvoiceModal
                      invoiceModal={invoiceModal}
                      toggleInvoiceModal={toggleInvoiceModal}
                      details={details}
                      refetch={refetch}
                    />
                  </>
                }
              />
            </div>
          </div>
          {pdfModal && (
            <PdfViewer pdfModal={pdfModal} togglePdfModal={togglePdfModal} pdfUrl={pdfUrl} />
          )}
        </>
      )}
    </>
  );
};
