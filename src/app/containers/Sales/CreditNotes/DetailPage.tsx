/** @format */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Tag, Tabs, Image, Dropdown, MenuProps, Typography, Popconfirm } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Refund } from "../Refund/Refund";
import { DetailsTab } from "./DetailsTab";
import { HistoryTable } from "./HistoryTable";
import { endpoints, routeNames } from "static";
import { CreditNoteDetailProps } from "./Types";
import { AppliedInvoice } from "./AppliedOnInvoice/AppliedInvoice";
import { useAxios, useBool, usePermissions, useStore } from "app/Hooks";
import { ImagePath, capitalize, getKeyFromSS, getOrganizationDate, removeKeyFromSS } from "utils";
import {
  Spinner,
  Toast,
  Email,
  Attachments,
  PdfViewer,
  ContactModal,
  Breadcrumbx,
} from "app/shared";
import { TooltipX } from "app/shared/ToolTip";
import {
  MAX_FILE_SIZE,
  attachementAllowedFormats,
  attachmentTypeToastMessage,
} from "app/shared/AllowedFormats";
import { AiOutlinePhone } from "react-icons/ai";
import { SpinnerX } from "app/shared/PageLoader";

const { Title } = Typography;

export const DetailPage = ({
  data,
  from,
  detail,
  refetch,
  setparam,
  setFalse,
  detailpage,
  handleConfirm,
  isModal = false,
  loading = false,
  handleFullScreen,
}: CreditNoteDetailProps) => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, setTrue } = useBool();
  const tabkey = getKeyFromSS("tabKey");
  const [email, setEmail] = useState(false);
  const [tabKey, setTabKey] = useState("1");
  const [loader, setLoader] = useState(true);
  const [fetch, setFetch] = useState(false);
  const [isbool, setIsBool] = useState(false);
  const [details, setDetails] = useState<any>();
  const localObj = JSON.parse(getKeyFromSS("obj"));
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [attachments, setAttachments] = useState([]);
  const sessionEmail = JSON.parse(getKeyFromSS("email"));
  const { checkPermission, fetchingRoles } = usePermissions();
  // const { checkModulePermission } = useSharedOrganization();
  const { created_by_platform, org_date_format } = useStore();
  const [customerDetail, setCustomerDetail] = useState(false);
  const { bool: fetchList, setTrue: refetchRefund } = useBool();
  const { has_CreditNoteCreate_permission } = checkPermission("CreditNoteCreate");
  const { has_CreditNoteDelete_permission } = checkPermission("CreditNoteDelete");
  const { has_CreditNoteEdit_permission } = checkPermission("CreditNoteEdit");
  const imsEdit = import.meta.env.VITE_IMS_DATA_CAN_EDIT;

  useEffect(() => {
    if (localObj?.curr_id ?? detail?.id) {
      callAxios({
        url: `${endpoints.CREDIT_NOTES}/${
          detailpage ? detail?.id : !isModal ? localObj?.curr_id : detail?.id
        }`,
        deploymentTime: true,
      }).then((res) => {
        setDetails(res);
        setAttachments(res?.creditNote?.attachments);
        setFalse?.(false);
        setLoader(false);
        if (tabkey) {
          setTabKey(tabkey);
          removeKeyFromSS("tabKey");
        }
      });
    }
    return () => {
      setTabKey("1");
      setEmail(false);
    };
  }, [localObj?.curr_id, detail?.id, bool, fetch]);
  useEffect(() => {
    if (sessionEmail) setEmail(true);
    else setEmail(false);
  }, [sessionEmail]);

  const handleEmail = () => setEmail(!email);
  const handleTabChange = (key) => setTabKey(key);
  const togglePdfModal = () => setPdfModal(!pdfModal);
  const toggleFetch = () => setFetch(!fetch);
  const toggleCustomerDetailModal = () => setCustomerDetail(!customerDetail);

  const sentMark = useCallback(
    () =>
      callAxios({
        url: `${endpoints.CREDIT_NOTES}/${details?.creditNote?.id}/confirmed`,
        method: "put",
      }).then((res) => {
        if (res) {
          Toast({ message: res.message });
          refetch?.();
          setTrue();
        }
      }),
    [details, refetch, setTrue]
  );
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
      formdata.append("subjectId", details?.creditNote?.id as any);
      formdata.append("name", details?.creditNote?.credit_note_no as string);
      formdata.append(`files[0]`, file as any);

      callAxios({
        url: `${endpoints.CREDIT_NOTES}${endpoints.ATTACHMENT}s`,
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
      url: `${endpoints.CREDIT_NOTES}${endpoints.ATTACHMENT}/${id}`,
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
      url: `${endpoints.CREDIT_NOTES}/${details?.creditNote?.id}/download-all`,
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

  const onPrint = () => {
    setPdfUrl(`${endpoints.CREDIT_NOTES}/${details?.creditNote?.id}/pdf`);
    togglePdfModal();
  };

  const pdfDownload = () => {
    setIsBool(true);
    callAxios({
      url: `${endpoints.CREDIT_NOTES}/${details?.creditNote?.id}/pdf?download=true`,
    })
      .then((res) => {
        if (res) {
          const element = document.createElement("a");
          element.href = res;
          element.download = `Credit note-${details?.creditNote?.credit_note_no} .pdf`;
          element.click();
          setIsBool(false);
        }
      })
      .catch(() => setIsBool(false));
  };

  const singleAttachmentDownload = (id) => {
    setIsBool(true);
    callAxios({
      url: `${endpoints.CREDIT_NOTES}/${id}/download-attachment`,
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
        children: <>{<DetailsTab detail={details} setDetails={setDetails} isModal={isModal} />}</>,
      },
      {
        key: "2",
        label: "Applied on Invoices",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              <AppliedInvoice
                from={from}
                isModal={isModal}
                detail={details}
                fetchList={fetchList}
                refetchApplied={refetchRefund}
                refetchPaymentReceived={refetch}
                url={`${endpoints.CREDIT_NOTES}/${details?.creditNote?.id}/utilizaecredits`}
              />
            )}
          </>
        ),
      },
      {
        key: "3",
        label: "Refunds",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              <Refund
                isModal={isModal}
                PRdetail={details}
                fetchList={fetchList}
                toggleFetch={toggleFetch}
                refetchRefund={refetchRefund}
                refetchPaymentReceived={refetch}
                url={`${endpoints.CREDIT_REFUND}/${details?.creditNote?.id}/list`}
                Permissions={{
                  create: has_CreditNoteCreate_permission,
                  delete: has_CreditNoteDelete_permission,
                }}
              />
            )}
          </>
        ),
      },
      {
        key: "4",
        label: "Attachments",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              <Attachments
                isModal={isModal}
                setIsBool={setIsBool}
                attachments={attachments}
                handleImage={handleImage}
                details={details.creditNote}
                multipleDownloads={multipleDownloads}
                hasDelete={has_CreditNoteEdit_permission}
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
              <HistoryTable detail={details?.creditNote} isModal={isModal} />
            )}
          </>
        ),
      },
    ],
    [details, isbool, isModal, fetchList]
  );

  const option: MenuProps["items"] = useMemo(
    () => [
      // {
      //   key: "0",
      //   label: "Duplicate",
      //   onClick: () => navigate(`${endpoints.CREDIT_NOTES}/clone?id=${details?.creditNote?.id}`),
      // },
      {
        key: "1",
        label: "Mark as open",
        onClick: sentMark,
        disabled: details?.creditNote?.status !== "draft" || !has_CreditNoteEdit_permission,
        className: details?.creditNote?.status !== "draft" ? "disabled-option" : "",
      },
      // {
      //   key: "2",
      //   label: "Create refund",
      //   onClick: () => {},
      //   disabled: false,
      // },
      {
        key: "3",
        label: (
          <Popconfirm
            key="confirm"
            placement="left"
            disabled={
              ((imsEdit === "false" ? details?.creditNote?.platform_type !== "books" : true) &&
                !has_CreditNoteDelete_permission) ||
              details?.creditNote?.status !== "draft"
            }
            title={
              (imsEdit === "false" ? details?.creditNote?.platform_type === "books" : true) &&
              has_CreditNoteDelete_permission
                ? `Are you sure you want to delete "${details?.creditNote?.credit_note_no}"?`
                : "Permission Denied"
            }
            okText={
              (imsEdit === "false" ? details?.creditNote?.platform_type === "books" : true) &&
              has_CreditNoteDelete_permission
                ? "YES"
                : "OK"
            }
            cancelText="No"
            showCancel={
              (imsEdit === "false" ? details?.creditNote?.platform_type === "books" : true) &&
              has_CreditNoteDelete_permission
            }
            onCancel={(e) => e?.stopPropagation()}
            onConfirm={(e) => {
              e?.stopPropagation();
              (imsEdit === "false" ? details?.creditNote?.platform_type === "books" : true) &&
                has_CreditNoteDelete_permission &&
                handleConfirm(
                  details?.creditNote,
                  "/creditnotes",
                  refetch,
                  data,
                  "/creditnotes",
                  setparam
                );
            }}
          >
            <label
              style={{
                cursor:
                  ((imsEdit === "false" ? details?.creditNote?.platform_type !== "books" : true) &&
                    !has_CreditNoteDelete_permission) ||
                  details?.creditNote?.status !== "draft"
                    ? "not-allowed"
                    : "pointer",
                width: "100%",
                display: "block",
                opacity:
                  ((imsEdit === "false" ? details?.creditNote?.platform_type !== "books" : true) &&
                    !has_CreditNoteDelete_permission) ||
                  details?.creditNote?.status !== "draft"
                    ? 0.8
                    : 1,
              }}
              onClick={(e) => e?.stopPropagation()}
            >
              Delete
            </label>
          </Popconfirm>
        ),
        disabled:
          ((imsEdit === "false" ? details?.creditNote?.platform_type !== "books" : true) &&
            !has_CreditNoteDelete_permission) ||
          details?.creditNote?.status !== "draft",
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
      has_CreditNoteDelete_permission,
    ]
  );

  const titleElement = (
    <div className="back-to-listing">
      <Breadcrumbx
        name=""
        detailPage
        refetch={refetch}
        moduleName={"Credit notes "}
        handleFullScreen={handleFullScreen}
      />
      <div className="_no"> {`Credit note No. ${details?.creditNote?.credit_note_no}`}</div>
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
                className={`__items_details_header  creditdetail--head ${
                  isModal ? "credit-note-modal p-0" : ""
                }`}
                title={titleElement}
                subTitle={
                  <Tag
                    className={`generic-badge ${
                      details?.creditNote?.status &&
                      details?.creditNote?.status === "partially applied"
                        ? "partially-applied"
                        : details?.creditNote?.status
                    }`}
                  >
                    {capitalize(
                      details?.creditNote?.status === "partially applied"
                        ? "PRTL Applied"
                        : details?.creditNote?.status
                    )}
                  </Tag>
                }
                extra={
                  isModal
                    ? []
                    : [
                        <>
                          {!email && (
                            <div className="__items_details_actions item_detail_header_actions">
                              <Dropdown.Button
                                trigger={["click"]}
                                menu={{ items: option }}
                                className="btn-edit"
                                disabled={
                                  !(
                                    details?.creditNote?.status === "draft" ||
                                    details?.creditNote?.status === "open"
                                  )
                                }
                                icon={
                                  <img
                                    className=""
                                    alt="dropdown"
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/dropdown.svg`}
                                  />
                                }
                                onClick={() =>
                                  navigate(
                                    `${routeNames.EDIT_CREDIT_NOTE}?id=${details?.creditNote?.id}`
                                  )
                                }
                              >
                                Edit
                              </Dropdown.Button>
                            </div>
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
                        <div className="_credit_note_detial_page gap-adj ">
                          <div className="d-flex mb-30">
                            {details?.customer?.photo ? (
                              <Image
                                preview={false}
                                className="customer-dp"
                                src={ImagePath(
                                  details?.customer?.photo as string,
                                  created_by_platform
                                )}
                              />
                            ) : (
                              <div className="user_default_image">
                                {/* <AiOutlineUser /> */}
                                <img
                                  alt="user icon"
                                  className="user_profile_icon"
                                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                                    import.meta.env.VITE_CUSTOMER_PLACEHOLDER_IMAGE
                                  }`}
                                />
                              </div>
                            )}
                            <div className="__credit_note_detials ">
                              {!isModal && (
                                <div className="account_receipt d-flex __general_receipt">
                                  <TooltipX title="PDF">
                                    <img
                                      alt=""
                                      onClick={pdfDownload}
                                      className="mr-10 hover-effect"
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/pdf_icon.svg`}
                                    />
                                  </TooltipX>
                                  <TooltipX title="Print">
                                    <img
                                      alt=""
                                      onClick={onPrint}
                                      className="mr-10 hover-effect"
                                      src={`${
                                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                      }/static/media/print.svg`}
                                    />
                                  </TooltipX>
                                  <TooltipX title="Email">
                                    <img
                                      alt=""
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
                                      cursor: !has_CreditNoteEdit_permission
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
                                          cursor: !has_CreditNoteEdit_permission
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
                                      disabled={!has_CreditNoteEdit_permission}
                                    />
                                  </label>
                                </div>
                              )}
                              <div className="mb-15 __customer_info l--h_17">
                                <span className="fw-md">Reference number: </span>
                                <span className="ref_title">{details?.creditNote?.reference}</span>
                              </div>
                              <div className="mb-15 __customer_info l--h_17 customer_detail_names estimates_reference">
                                <img
                                  alt="user icon"
                                  className="mr-10 "
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/user.svg`}
                                />
                                <span
                                  onClick={isModal ? () => null : toggleCustomerDetailModal}
                                  className={
                                    isModal
                                      ? "_display_name"
                                      : "_display_name _customer_info_name cursor"
                                  }
                                >
                                  {details?.customer?.display_name}
                                </span>
                              </div>
                              <div className="mb-15 __customer_info l--h_17">
                                <img
                                  className="mr-10"
                                  alt="address icon"
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/business.svg`}
                                />
                                <span>{details?.customer?.company_name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="product-details mb-5">
                            <div className="mb-15">
                              <Title level={4} className="pl-2">
                                Invoice to
                              </Title>
                            </div>
                            <div className="d-flex justify_between">
                              <div className="__general_details_page_left flex-md-50">
                                <div className="mb-15 __customer_info customer_detail_names l--h_17 fix--lft">
                                  <img
                                    alt="user icon"
                                    className="mr-10"
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/user.svg`}
                                  />
                                  <span className="_display_name">
                                    {details?.billing_address?.attention}
                                  </span>
                                </div>
                                <div className="mb-15 __customer_info l--h_17 fix--lft">
                                  <img
                                    className="mr-10"
                                    alt="address icon"
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/business.svg`}
                                  />
                                  <span>{details?.customer?.company_name}</span>
                                </div>
                                <div className="mb-15 __customer_info  l--h_17 fix--lft">
                                  <img
                                    className="mr-10"
                                    alt="location icon"
                                    src={`${
                                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                    }/static/media/location.svg`}
                                  />
                                  <span>
                                    {" "}
                                    {details?.billing_address?.street || ""}
                                    {details?.billing_address?.street_2
                                      ? `, ${details?.billing_address?.street_2}`
                                      : ""}
                                    {billAddress3(details?.billing_address)}
                                  </span>
                                </div>
                                <div
                                  className="mb-15 __customer_info  l--h_17 fix--lft phone_info"
                                  style={{ alignItems: "center" }}
                                >
                                  <span className="">
                                    <AiOutlinePhone className="phone_icon" size="20px" />
                                  </span>
                                  <span> {details?.billing_address?.phone}</span>
                                </div>
                              </div>
                              <div className="__general_details_page_right credit_details--alignment align-right-info ">
                                <div className="__customer_info mb-15">
                                  <span className="fw-md w-102 mr-10">Issue date:</span>{" "}
                                  <span>
                                    {getOrganizationDate(
                                      details?.creditNote?.credit_note_date,
                                      org_date_format
                                    )}
                                  </span>
                                </div>
                                <div className="__customer_info mb-15">
                                  <span className="fw-md w-102  mr-10">Invoice number:</span>
                                  <span>{details?.invoice_no}</span>
                                </div>
                                <div className="__customer_info mb-15">
                                  <span className="fw-md w-102  mr-10">Invoice amount:</span>
                                  <span>
                                    {details?.base_currency?.symbol}&nbsp;
                                    {details?.total.toFixed(2)}
                                  </span>
                                </div>
                                <div className="__customer_info mb-15">
                                  <span className="fw-md w-102  mr-10">Total Issued Credits:</span>
                                  <span>
                                    {details?.base_currency?.symbol}&nbsp;
                                    {(details?.total - details?.remaining_credits).toFixed(2)}
                                  </span>
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
                        <div className="bg-white">
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
                        handleEmail={handleEmail}
                        emailUrl={`${endpoints.CREDIT_NOTES}/${
                          details?.creditNote?.id ?? localObj?.curr_id
                        }/mail`}
                      />
                    )}
                    {customerDetail && !isModal && (
                      <ContactModal
                        bool={customerDetail}
                        toggle={toggleCustomerDetailModal}
                        detail={{ id: details?.customer_id }}
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
        </>
      )}
    </>
  );
};
