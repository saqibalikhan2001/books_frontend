/** @format */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Image, Carousel, Typography, Form, Card } from "antd";
import { Icons, Spinner } from "app/shared";
import { StatsHeader } from "./StatsHeader";
import { endpoints, routeNames } from "static";
import { useAxios, useStore } from "app/Hooks";
import { ImagePath, getFullDate, setSessionAndLocalObj } from "utils";

const { Title } = Typography;
const { CUSTOMERS } = routeNames;
const { IoIosArrowBack, IoIosArrowForward } = Icons;

export const TopCustomer = ({ preferences }) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const carouselRef: any = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({
    currency: "",
    customers: [],
  });

  const date = Form.useWatch("date_range", form);
  const custom_ranges = Form.useWatch("custom_ranges", form);

  useLayoutEffect(() => {
    preferences?.top_customers && form.setFieldValue("date_range", preferences?.top_customers);
  }, [form, preferences?.top_customers]);

  useEffect(() => {
    setLoading(true);
    let url;
    if (date && date === "custom" && custom_ranges) {
      url = `${endpoints.TOP_CUSTOMERS}/${date}?starting_date=${
        getFullDate(custom_ranges[0]) + " 00:00:00"
      }&ending_date=${getFullDate(custom_ranges[1]) + " 23:59:59"}`;
    } else if (date && date !== "custom") {
      url = `${endpoints.TOP_CUSTOMERS}/${date}`;
    }
    if (url) {
      callAxios({ url }).then((res) => {
        setData({
          currency: res?.currency,
          customers: res.customers,
        });
        setLoading(false);
      });
    }
  }, [date, custom_ranges]);

  const next = () => {
    if (carouselRef.current) {
      carouselRef?.current?.next();
    }
  };
  const prev = () => {
    if (carouselRef.current) {
      carouselRef.current?.prev();
    }
  };
  return (
    <>
      <Card className="card-layout h-318 mb-10">
        <StatsHeader tittle="Top Customers" form={form} />
        <>
          {loading ? (
            <Spinner directionSize={"258px"} />
          ) : (
            <div className="h-100-60">
              {data?.customers.length > 0 ? (
                <>
                  <div className="pos-relative h-100 top_customer">
                    <div className="carousel-arrow-prev" style={{ zIndex: "100" }}>
                      <IoIosArrowBack onClick={prev} />
                    </div>
                    <Carousel
                      ref={carouselRef}
                      autoplay
                      infinite
                      dots={true}
                      className="dashboard_carousel"
                      dotPosition={"bottom"}
                    >
                      {data?.customers.map((value) => (
                        <SlidesCard data={value} key={value.customer_id} currency={data.currency} />
                      ))}
                    </Carousel>
                    <div className="carousel-arrow-next">
                      <IoIosArrowForward onClick={next} />
                    </div>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    height: 260,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No top customers at the moment
                </div>
              )}
            </div>
          )}
        </>
      </Card>
    </>
  );
};

const SlidesCard = ({ data, currency }) => {
  const naviagte = useNavigate();
  const { created_by_platform } = useStore();

  return (
    <>
      <div className="pos-relative h-100">
        {/* <div className="carousel-arrow-prev">
          <IoIosArrowBack
            onClick={prev}
          />

        </div> */}
        <div
          className="carousel-wrapper"
          onClick={() => {
            setSessionAndLocalObj(data?.customer_id, true, CUSTOMERS);
            naviagte(CUSTOMERS);
          }}
        >
          <div className="carousel-image circle-image">
            <Image
              src={
                data?.photo
                  ? ImagePath(data?.photo, created_by_platform)
                  : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                      import.meta.env.VITE_CUSTOMER_PLACEHOLDER_IMAGE
                    }`
              }
              preview={false}
            />
          </div>
          <div className="carousel-content">
            <div className="mb-10">
              <Title className="carousel-item-title" level={3}>
                {data?.display_name}{" "}
              </Title>
              <span style={{ color: "#6e6e6e" }}> Customer </span>
            </div>
            <div className="d-flex align-center gap-10 mb-5">
              <Title level={5} className="carousel-heading">
                Company Name:
              </Title>
              <Title level={5} className="carousel-value">
                {data?.company_name}
              </Title>
            </div>
            <div className="d-flex align-center gap-10 mb-5">
              <Title level={5} className="carousel-heading">
                License number:
              </Title>
              <Title level={5} className="carousel-value">
                {data?.license_no}
              </Title>
            </div>
            <div className="d-flex align-center gap-10 mb-5">
              <Title level={5} className="carousel-heading">
                Balance Due:
              </Title>
              <Title level={5} className="carousel-value asterisk">
                {currency}&nbsp;
                {data?.balance_due.toFixed(2)}
              </Title>
            </div>
            <div className="d-flex align-center gap-10 mb-5">
              <Title level={5} className="carousel-heading">
                {" "}
                Total Sale:{" "}
              </Title>
              <Title level={5} className="carousel-value">
                {currency}&nbsp;
                {data?.total_sale.toFixed(2)}
              </Title>
            </div>
          </div>
        </div>
        {/* <div className="carousel-arrow-next">
          <IoIosArrowForward
            onClick={next}
          /> 
        </div> */}
      </div>
    </>
  );
};
