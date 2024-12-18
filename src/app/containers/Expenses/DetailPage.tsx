/**@format */

import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@ant-design/pro-layout";
import { Tag, Form, Tabs, Input, Typography } from "antd";
import { endpoints } from "static";
import { useAxios } from "app/Hooks";
import { TooltipX } from "app/shared/ToolTip";
import { ImageDetails } from "../Items/ImageDetails";
import { Buttonx, Processing, Spinner, Toast } from "app/shared";
import { capitalize, getKeyFromSS, handleTabChange } from "utils";

const { TextArea } = Input;
const { Text } = Typography;
const { EXPENSES } = endpoints;

export const DetailPage = ({
  detail,
  refetch,
  setFalse,
  base_currency,
  loading = false,
  isModal = false,
}: any) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [data, setData] = useState<any>();
  const [notes, setNotes] = useState(false);
  const [loader, setLoader] = useState(true);
  const [primary, setPrimary] = useState(false);
  const [uploading, _setUploading] = useState(false);
  const localObj = JSON.parse(getKeyFromSS("obj"));

  const Notes = Form.useWatch("notes", form);

  useEffect(() => {
    if (localObj?.curr_id ?? detail?.id) {
      callAxios({
        url: `${EXPENSES}/${isModal ? detail?.id : localObj?.curr_id ?? detail?.id}`,
      }).then((res) => {
        form.setFieldValue("notes", res?.notes);
        setData(res);
        setFalse?.(false);
        setLoader(false);
        setPrimary(false);
        setNotes(false);
      });
    }
    //eslint-disable-next-line
  }, [detail?.id, localObj?.curr_id, primary]);
  const handleNotes = () => {
    if (!notes) setNotes(!notes);

    if (notes) {
      callAxios({
        url: `/expenses/${data?.id}/expense_note`,
        method: "put",
        data: { notes: Notes },
      }).then((res) => {
        if (res) {
          setNotes(!notes);
          callAxios({
            url: `${EXPENSES}/${data?.id}`,
          }).then((res) => {
            setData(res);
          });
          Toast({ message: res?.message });
        }
      });
    }
  };
  //for future use

  // const ActiveInactive = () => {
  //   callAxios({
  //     url: data?.is_active ? `/expenses/${data?.id}/inactive` : `/expenses/${data?.id}/active`,
  //     method: "put",
  //   }).then((res) => {
  //     setPrimary(true);
  //     Toast({ message: res?.message });
  //     refetch?.();
  //   });
  // };

  // const EditItems: MenuProps["items"] = [
  //   {
  //     key: "0",
  //     label: "Adjust quantity ",
  //     onClick: toggleModal,
  //     disabled: !Boolean(data?.is_active),
  //   },
  //   {
  //     key: "1",
  //     label: `${data?.is_active ? "Make Inactive" : "Make Active"}`,
  //     onClick: ActiveInactive,
  //   },
  //   {
  //     key: "2",
  //     label: "Clone",
  //     onClick: () => navigate(`${ITEM_CLONE}?id=${data?.id}`),
  //   },
  // ];

  const tabChildren = useMemo(
    () => [
      {
        key: "1",
        label: "Expense details",
      },
      {
        key: "2",
        label: "Sales information",
      },
      {
        key: "3",
        label: "Purchase information",
      },
    ],
    [data, base_currency, isModal]
  );
  return (
    <>
      {loader || loading ? (
        <Spinner />
      ) : (
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
          <div style={{ opacity: uploading ? 0.5 : 1, pointerEvents: uploading ? "none" : "auto" }}>
            <PageHeader
              className="__items_details_header"
              title={data?.name}
              //for future use
              // extra={
              //   isModal
              //     ? []
              //     : [
              //         <div className="__items_details_actions compact--margin d-flex ">
              //           <Dropdown.Button
              //             getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
              //             placement="top"
              //             trigger={["click"]}
              //             className="mr-2 btn-edit "
              //             menu={{ items: EditItems }}
              //           // disabled={data?.platform_type !== "books"}
              //           disabled
              //           onClick={() => navigate(`${EDIT_EXPENSE}?id=${data.id}`)}
              //             icon={
              //               <img
              //                 src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/dropdown.svg"
              //                 alt="dropdown icon"
              //               />
              //             }
              //           >
              //             Edit
              //           </Dropdown.Button>
              //         </div>,
              //       ]
              // }
              footer={
                <>
                  <div className="__main_content_side">
                    <div className="item_details-inner  p--unset">
                      <Typography.Title level={5} className="form_heading mb--30 pl-12">
                        Expense Details
                        <Tag
                          className={`generic-badge
                    `}
                        >
                          {capitalize(data.status)}
                        </Tag>
                      </Typography.Title>
                    </div>
                    <div
                      className={`__items-details_container mb-15 ${
                        isModal ? "responsive-modal" : ""
                      }`}
                    >
                      <div className="product-details d-flex align-start ">
                        <div className="custom_spacing">
                          <div className="product_images" style={{ width: 250 }}>
                            <ImageDetails
                              isModal={isModal}
                              itemId={data?.id}
                              refetch={refetch}
                              Add_New_button={false}
                              setPrimary={setPrimary}
                              Images={data?.images || []}
                              platformType={data?.platform_type}
                              primaryImage={data?.item_primary_image}
                            />
                          </div>
                        </div>

                        <div className="product-details-center custom_dot">
                          <div className="available_stock mb-30">
                            <Text className="heading">Date</Text>
                            <Text className="heading " style={{ minWidth: 117 }}>
                              {data?.date}
                            </Text>
                            <Text className="stock-values">
                              {data?.available_stock} &nbsp;
                              {data?.unit ? `${data?.unit}(s)` : ""}
                            </Text>
                          </div>
                          <div className="asset_value d-flex mb-30">
                            <Text className="heading">Total amount</Text>
                            <Text className="stock-values">
                              {data?.currency?.symbol}
                              {data?.total_amount}
                            </Text>
                          </div>
                          <div className="available_stock">
                            <Text className="heading ">
                              Origin
                              <TooltipX
                                title={`The origin of this expense is ${
                                  data?.platform_type === "ims" ? "IMS" : "BOOKS"
                                }`}
                              >
                                <img
                                  src={`${
                                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                                  }/static/media/tooltip.svg`}
                                  alt="tooltip Icon"
                                  className="hover-effect pl-9"
                                />
                              </TooltipX>
                            </Text>
                            <Text className="stock-values">
                              {data?.platform_type === "ims" ? "IMS" : "BOOKS"}
                            </Text>
                          </div>
                        </div>
                        <div className="product-details-right">
                          <div className="product_note">
                            <Text className="details-notes">Expense notes</Text>
                            {notes && (
                              <div className="note_cancel_btn">
                                <Buttonx
                                  type="link"
                                  btnText="Cancel"
                                  clickHandler={() => {
                                    setNotes(false);
                                    form.setFieldValue("notes", data?.notes);
                                  }}
                                />
                              </div>
                            )}
                            <Buttonx
                              disabled
                              type="link"
                              clickHandler={handleNotes}
                              btnText={!notes ? "Edit" : "Save"}
                              //for future use

                              // disabled={
                              //   (notes && data?.notes === Notes?.trim()) ||
                              //   data?.platform_type !== "books" ||
                              //   isModal
                              // }
                              className={!notes ? "edit_btn" : "save_btn"}
                            />
                          </div>
                          <Form form={form}>
                            <Form.Item name="notes">
                              <TextArea
                                rows={4}
                                showCount
                                maxLength={1000}
                                disabled={!notes}
                                className={Notes ? "text_bg_color" : ""}
                                onChange={(e: any) => {
                                  const { value } = e.target;
                                  const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                                  form.setFieldValue("notes", formattedValue);
                                }}
                              />
                            </Form.Item>
                          </Form>
                        </div>
                      </div>
                      {uploading && <Processing />}
                    </div>
                    <Tabs
                      items={tabChildren}
                      defaultActiveKey={"1"}
                      onChange={handleTabChange}
                      className="__items-details_container res--scroll product--item__detail_tabs"
                    />
                  </div>
                </>
              }
            />
          </div>
        </div>
      )}
    </>
  );
};
