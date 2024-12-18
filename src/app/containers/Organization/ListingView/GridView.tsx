/** @format */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Col, Image, Row, Tag, Typography } from "antd";
import { useAxios, useStore } from "app/Hooks";
import { useTypedDispatch } from "store";
import { ImagePath } from "utils";
import { ConfirmPopup, Icons, Toast } from "app/shared";
import { Content, endpoints, Labels, routeNames } from "static";
import { set_organization } from "store/slices/OrganizationSlice";
import { SpinnerX } from "app/shared/PageLoader";

const { Text } = Typography;
const { CgOrganisation } = Icons;
const { SET_AS_DEFAULT } = Labels;
const { ORGANIZATION_DETAIL } = routeNames;

const RenderDetails = ({ title, value }: { title: string; value: string }) => (
  <Row gutter={[10, 0]} className="organization-details-list">
    <Col span={3}>
      <Typography.Text className="organization-key" strong>
        {title}
      </Typography.Text>
    </Col>
    <Col style={{ paddingLeft: 10, paddingRight: 10 }}>:</Col>
    <Col span={6} style={{ alignSelf: "center" }}>
      <Typography className="organization-value">{value}</Typography>
    </Col>
  </Row>
);

const GridView = ({
  refetch,
  //@ts-ignore
  role = {},
  organizations,
  handleSwitchClick,
  getCurrentSharedOrg,
}: any) => {
  const dispatch = useTypedDispatch();
  const { organization_id } = useAxios();
  const { current_organization_id } = useStore();
  const [orgId, setOrgId] = useState<number | string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasContentLoading, setHasContentLoading] = useState(true);

  useEffect(() => {
    if (organizations.length) setHasContentLoading(false);
    //eslint-disable-next-line
  }, [organizations]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleConfirm = () => {
    dispatch(
      set_organization({
        url: `${endpoints.SET_ORGANIZATION}/${orgId}`,
        method: "post",
      })
    )
      .unwrap()
      .then((res) => {
        Toast({ message: res.message });
        setIsModalOpen(false);
        refetch();
      });
  };

  const handleDefault = (org_id: string | number) => {
    setOrgId(org_id);
    toggleModal();
  };

  return (
    <>
      {hasContentLoading ? (
        <SpinnerX />
      ) : (
        <div className="mb-20">
          <div className="container-1280">
            <Row gutter={[0, 10]} justify="center">
              {organizations?.map((item) => (
                <Col key={item.id} span={24}>
                  <Card
                    className={`organization_card radius-5
                    ${
                      item?.organization_id === current_organization_id
                        ? "default_organization"
                        : ""
                    }`}
                  >
                    <div className="organization-card-widget d-flex">
                      <div className="organization-img radius-5 border overflow">
                        <Image
                          preview={false}
                          src={
                            item?.organizations?.logo
                              ? ImagePath(
                                  item?.organizations?.logo,
                                  item?.organizations?.created_by_platform
                                )
                              : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                                  import.meta.env.VITE_ORGANIZATION_PLACEHOLDER_IMAGE
                                }`
                          }
                        />
                      </div>
                      <div className="organization-card-widget-right d-flex justify-between flex-1 ml-20">
                        <div className="flex-1">
                          <Typography.Title level={4} className="organization-level">
                            {item.organizations.name}
                          </Typography.Title>
                          <RenderDetails
                            title="Business ID"
                            value={item?.organizations?.business_id}
                          />
                          <RenderDetails
                            title="Subscription"
                            value={item?.organizations?.organization_plan?.name}
                          />
                          <RenderDetails
                            title="Base Currency"
                            value={item?.organizations?.get_currency?.name ?? ""}
                          />
                          <RenderDetails
                            title="Time Zone"
                            value={item?.organizations?.time_zone ?? ""}
                          />
                          <Row className="mt-20">
                            {["books", "ims,books"].includes(item?.platform_type) &&
                              item?.organizations?.id !== +organization_id && (
                                <Col>
                                  <Button
                                    className="btn-form-size btn-primary mr-20"
                                    onClick={() => handleSwitchClick(item?.organization_id)}
                                  >
                                    Switch Business
                                  </Button>
                                </Col>
                              )}

                            <Col>
                              {item?.organizations?.platform_type === "ims" &&
                                item?.organizations?.is_owner && (
                                  <Button
                                    key="1"
                                    className="btn-form-size btn-primary mr-20"
                                    onClick={() => {
                                      getCurrentSharedOrg(item?.organizations);
                                    }}
                                    style={{
                                      outline: "none",
                                    }}
                                  >
                                    Share & Switch
                                  </Button>
                                )}
                              <Link to={`${ORGANIZATION_DETAIL}?org=${item?.organization_id}`}>
                                <Button className=" btn-form-size btn-default mr-10">
                                  View details
                                </Button>
                              </Link>

                              {["books", "ims,books"].includes(item?.platform_type) &&
                                // item?.organizations?.is_owner &&
                                !item?.organizations?.is_default && (
                                  <Button
                                    className={`no-border-btn ${item?.organization_id === current_organization_id ? 'link-btn' : null}`}
                                    onClick={() => handleDefault(item?.organization_id)}
                                  >
                                    {SET_AS_DEFAULT}
                                  </Button>
                                )}
                            </Col>
                            <Col>
                              {item?.organizations?.platform_type === "ims" &&
                                item?.organizations?.is_owner && (
                                  <Col
                                    style={{
                                      lineHeight: "36px",
                                    }}
                                  >
                                    <Text>Share this business to books before managing it</Text>
                                  </Col>
                                )}
                            </Col>
                          </Row>
                        </div>

                        <div className="d-flex flex-column align-center">
                          {["books", "ims,books"].includes(item?.platform_type) &&
                            // item?.organizations?.is_owner &&
                            item?.organizations?.is_default && (
                              <Tag className="set_default mr-0 mb-8">Default</Tag>
                            )}
                          {item?.platform_type === "ims,books" && (
                            <Tag
                              className="mr-0 mb-8"
                              key="icon"
                              icon={<CgOrganisation className="shared-icon" />}
                              style={{
                                borderRadius: 15,
                                backgroundColor: "#E5EFFC",
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                              }}
                              color={item?.organizations?.is_owner ? "success" : "warning"}
                            >
                              Shared
                            </Tag>
                          )}
                          <Tag
                            key="4"
                            // icon={<CgOrganisation style={{ marginRight: "3px" }} />}
                            className="mr-0"
                            style={{
                              borderRadius: 15,
                              backgroundColor: "gray",
                              fontSize: "12px",
                            }}
                            color="white"
                          >
                            {item?.platform_type === "books" ? "Books" : "Inventory"}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
      <ConfirmPopup
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        handleConfirm={handleConfirm}
        text={Content.setDefaultConfirm}
      />
    </>
  );
};

export default GridView;
