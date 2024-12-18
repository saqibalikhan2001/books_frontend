import { Image, Radio, Space, Typography } from "antd";
import { useCreateFormApi, useStore } from "app/Hooks";
import { Breadcrumbx, Icons } from "app/shared";
import { SpinnerX } from "app/shared/PageLoader";
import { TooltipX } from "app/shared/ToolTip";
import "assets/scss/organization/_detailpage.scss";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { endpoints } from "static";
import { ImagePath } from "utils";

const dateformat = dayjs(new Date());

const { Text, Title } = Typography;
const { ORGANIZATIONS } = endpoints;
const { FiEdit, AiOutlineInfoCircle } = Icons;

const DetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const org_id = searchParams.get("org");
  const { current_organization_id } = useStore();

  const { details: current, formLoading } = useCreateFormApi(`${ORGANIZATIONS}/${org_id}`);

  return (
    <>
      {formLoading ? (
        <SpinnerX />
      ) : (
        <div className="main_wrapper container-1280">
          <div className="business_header">
            <Breadcrumbx
              name="Manage Businesses"
              organization
              organizationName={current?.name}
              className="navigate"
            />

            {["books"].includes(current?.platform_type) &&
              (current?.is_owner || current?.exact_owner) &&
              !current?.is_default &&
              current_organization_id == org_id && (
                <div
                  className="d-flex align-center"
                  style={{ color: "#0061DD", cursor: "pointer" }}
                  onClick={() => navigate(`/organization-profile?org=${org_id}`)}
                >
                  <FiEdit className="mr-5" />
                  Edit
                </div>
              )}
            {current?.platform_type !== "books" &&
              (current?.is_owner || current?.exact_owner) &&
              !current?.is_default && (
                <Space>
                  <TooltipX title="Go to inventory to edit this business">
                    <AiOutlineInfoCircle size={18} />
                  </TooltipX>
                </Space>
              )}
          </div>
          <div className="_container organization-detail-page">
            <Title level={4} className="h4 company_logo">
              Company Logo
            </Title>
            <div className="form_box mbx-30">
              <Image
                preview={false}
                style={{ width: 100, height: 100 }}
                onClick={(e) => e.stopPropagation()}
                src={
                  current?.logo
                    ? ImagePath(current?.logo, current?.created_by_platform)
                    : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                        import.meta.env.VITE_ORGANIZATION_PLACEHOLDER_IMAGE
                      }`
                }
              />
            </div>
            {/* <Row style={{ marginTop: 10, background: "white", display: "block" }}>
            <Col className=""> */}
            {/* <Space
                className="info-sec"
                size={0}
                direction="vertical"
                style={{ display: "block" }}
              >
                <Row>
                  <Col className="" span={14} style={{ marginBottom: 15 }}>
                    <Text strong>Company Logo</Text>
                  </Col>
                </Row>
                <Row style={{ marginTop: 10, paddingBottom: 20 }}>
                  <Col className="" offset={1}>
                    <Space direction="vertical" style={{ display: "block" }}>
                      <Image
                        preview={false}
                        style={{ width: 80 }}
                        fallback="./img/company_logo.png"
                        onClick={(e) => e.stopPropagation()}
                        src={ImagePath(current?.logo, current?.created_by_platform)}
                      />
                    </Space>
                  </Col>
                </Row>
              </Space> */}
            <Title level={4} className="h4 mb-25">
              Company Name
            </Title>
            <div className="form_box">
              <div className="flexbox form-row-container justify-content-between">
                <div className="form_group flex-47">
                  <Title className="text-col" level={5}>
                    Company name
                  </Title>
                  <Text className="mb-22 d-inline-block">{current?.name}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="text-col" level={5}>
                    Legal name
                  </Title>
                  <Text className="mb-22 d-inline-block">{current?.legal_name}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="text-col" level={5}>
                    EIN
                  </Title>
                  <div className="d-flex flex-column">
                    <Text className="text-col mb-5">
                      <Radio
                        disabled={current?.number_type !== 1}
                        checked={current?.number_type === 1}
                      >
                        EIN
                      </Radio>
                      <Radio
                        disabled={current?.number_type !== 2}
                        checked={current?.number_type === 2}
                      >
                        SNN
                      </Radio>
                    </Text>
                    <Text className=" d-inline-block">{current?.number_value}</Text>
                  </div>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="text-col" level={5}>
                    License number
                  </Title>
                  <Text className=" d-inline-block">{current?.license_no}</Text>
                </div>
              </div>
            </div>
            <Title level={4} className="h4 mb-25">
              Company Type
            </Title>
            <div className="form_box">
              <div className="flexbox form-row-container justify-content-between">
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Tax form
                  </Title>
                  <Text className="d-inline-block">{current?.tax_form}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Industry
                  </Title>
                  <Text className=" d-inline-block">{current?.get_type?.label}</Text>
                </div>
              </div>
            </div>
            {/* <Space direction="vertical" className="info-sec">
                <Row>
                  <Col className="">
                    <Text strong>Company Name</Text>
                  </Col>
                </Row>
                <Row>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Company name
                    </Text>
                    <Text className="text-col">{current?.name}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Legal name
                    </Text>
                    <Text className="text-col">{current?.legal_name}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      EIN
                    </Text>
                    <Text className="text-col">
                      <Radio
                        disabled={current?.number_type !== 1}
                        checked={current?.number_type === 1}
                      >
                        EIN
                      </Radio>
                      <Radio
                        disabled={current?.number_type !== 2}
                        checked={current?.number_type === 2}
                      >
                        SNN
                      </Radio>
                    </Text>
                    <Text className="text-col">{current?.number_value}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Licence number
                    </Text>
                    <Text className="text-col">{current?.license_no}</Text>
                  </Col>
                </Row>
              </Space> */}
            {/* <Space direction="vertical" className="info-sec">
                <Row>
                  <Col className="">
                    <Text strong>Company Type</Text>
                  </Col>
                </Row>
                <Row>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Tax form
                    </Text>
                    <Text className="text-col">{current?.tax_form}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Industry
                    </Text>
                    <Text className="text-col">{current?.get_type?.label}</Text>
                  </Col>
                </Row>
              </Space> */}
            <Title level={4} className="h4 mb-25">
              Company Info
            </Title>
            <div className="form_box">
              <div className="flexbox form-row-container justify-content-between">
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Currency
                  </Title>
                  <Text className="mb-22 d-inline-block">{current?.get_currency?.name}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Time Zone
                  </Title>
                  <Text className="mb-22 d-inline-block">{current?.time_zone}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Date Format
                  </Title>
                  <Text className="mb-22 d-inline-block">{`MMM,DD YY [${dateformat.format(
                    "MMM,DD YY"
                  )}]`}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Contact person name
                  </Title>
                  <Text className="mb-22 d-inline-block">{current?.primary_contact_name}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Company email
                  </Title>
                  <Text className="mb-22 d-inline-block">{current?.company_email}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Customer-facing email
                  </Title>
                  <Text className="mb-22 d-inline-block">{current?.primary_contact_email}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Company phone
                  </Title>
                  <Text className=" d-inline-block">{current?.phone}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Company website
                  </Title>
                  <Text className=" d-inline-block">{current?.company_website}</Text>
                </div>
              </div>
            </div>
            {/* <Space direction="vertical" className="info-sec">
                <Row>
                  <Col className="">
                    <Text strong>Company Info</Text>
                  </Col>
                </Row>
                <Row>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Currency
                    </Text>
                    <Text className="text-col">{current?.get_currency?.name}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Time Zone
                    </Text>
                    <Text className="text-col">{current?.time_zone}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Date Format
                    </Text>
                    <Text className="text-col">{`MMM,DD YY [${dateformat.format(
                      "MMM,DD YY"
                    )}]`}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Contact person name
                    </Text>
                    <Text className="text-col">{current?.primary_contact_name}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Company email
                    </Text>
                    <Text className="text-col">{current?.company_email}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Customer-facing email
                    </Text>
                    <Text className="text-col">{current?.primary_contact_email}</Text>
                  </Col>

                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Company phone
                    </Text>
                    <Text className="text-col">{current?.phone}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Company website
                    </Text>
                    <Text className="text-col">{current?.company_website}</Text>
                  </Col>
                </Row>
              </Space> */}
            <Title level={4} className="h4 mb-25">
              Address
            </Title>
            <div className="form_box">
              <div className="flexbox form-row-container justify-content-between">
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Country
                  </Title>
                  <Text className="d-inline-block mb-22">{current?.country?.country_name}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    State/Province
                  </Title>
                  <Text className="d-inline-block mb-22">{current?.company_province}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Street address 1
                  </Title>
                  <Text className="d-inline-block mb-22">{current?.company_street}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Street address 2
                  </Title>
                  <Text className="d-inline-block mb-22">{current?.company_street_2}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    City
                  </Title>
                  <Text className="d-inline-block mb-22">{current?.company_city}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    ZIP code
                  </Title>
                  <Text className="d-inline-block mb-22">{current?.company_postal_code}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Company address
                  </Title>
                  <Text className="d-inline-block mb-22">{current?.company_address}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Customer-facing address
                  </Title>
                  <Text className="d-inline-block ">{current?.customer_address}</Text>
                </div>
                <div className="form_group flex-47 ">
                  <Title className="h5" level={5}>
                    Legal address
                  </Title>
                  <Text className="d-inline-block ">{current?.legal_address}</Text>
                </div>
              </div>
            </div>
            {/* <Space direction="vertical" className="info-sec">
                <Row>
                  <Col className="">
                    <Text strong>Address</Text>
                  </Col>
                </Row>
                <Row>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Country
                    </Text>
                    <Text className="text-col">{current?.country?.country_name}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      State/Province
                    </Text>
                    <Text className="text-col">{current?.company_province}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Street address 1
                    </Text>
                    <Text className="text-col">{current?.company_street}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Street address 2
                    </Text>
                    <Text className="text-col">{current?.company_street_2}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      City
                    </Text>
                    <Text className="text-col">{current?.company_city}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      ZIP code
                    </Text>
                    <Text className="text-col">{current?.company_postal_code}</Text>
                  </Col>

                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Company address
                    </Text>
                    <Text className="text-col">{current?.company_address}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Customer-facing address
                    </Text>
                    <Text className="text-col">{current?.customer_address}</Text>
                  </Col>
                  <Col className="" offset={1} span={8}>
                    <Text className="text-col" strong>
                      Legal address
                    </Text>
                    <Text className="text-col">{current?.legal_address}</Text>
                  </Col>
                </Row>
              </Space> */}
            {/* </Col>
          </Row> */}
          </div>
        </div>
      )}
    </>
  );
};
export default DetailPage;
