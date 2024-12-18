/** @format */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Card, Image, Carousel, Typography, Form } from "antd";
import { Icons, Spinner } from "app/shared";
import { StatsHeader } from "./StatsHeader";
import { useAxios, useStore } from "app/Hooks";
import { endpoints, routeNames } from "static";
import { ImagePath, getFullDate, setSessionAndLocalObj } from "utils";

const { Title } = Typography;
const { ITEMS } = routeNames;
const { IoIosArrowBack, IoIosArrowForward } = Icons;

export const TopSellingItems = ({ preferences }) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const carouselRef: any = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({
    currency: "",
    items: [],
  });

  const date = Form.useWatch("date_range", form);
  const item_filter = Form.useWatch("item_filter", form);
  const custom_ranges = Form.useWatch("custom_ranges", form);

  useLayoutEffect(() => {
    if (preferences?.top_selling_items) {
      form.setFieldValue("date_range", preferences?.top_selling_items);
      form.setFieldValue("item_filter", preferences?.top_selling_items_filter2);
    }
  }, [form, preferences?.top_selling_items, preferences?.top_selling_items_filter2]);

  useEffect(() => {
    setLoading(true);
    let url;
    if (date && date === "custom" && custom_ranges) {
      url = `${endpoints.TOP_ITEMS}/${date}/${item_filter}?starting_date=${
        getFullDate(custom_ranges[0]) + " 00:00:00"
      }&ending_date=${getFullDate(custom_ranges[1]) + " 23:59:59"}`;
    } else if (date && date !== "custom") {
      url = `${endpoints.TOP_ITEMS}/${date}/${item_filter}`;
    }
    if (url) {
      callAxios({ url }).then((res) => {
        if (res) {
          setData({
            items: res.items,
            currency: res?.currency,
          });
          setLoading(false);
        }
      });
    }
  }, [date, custom_ranges, item_filter]);

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
      <Card className="card-layout" style={{ maxHeight: "374px", height: "100%" }}>
        <StatsHeader tittle="Top Selling Products" form={form} filter />
        <>
          {loading ? (
            <Spinner directionSize={"258px"} />
          ) : (
            <div className="h-100-60">
              {data?.items?.length > 0 ? (
                <>
                  <div className="pos-relative h-100">
                    <div className="carousel-arrow-prev" style={{ zIndex: "100" }}>
                      <IoIosArrowBack onClick={prev} />
                    </div>
                    <Carousel
                      ref={carouselRef}
                      autoplay
                      className="dashboard_carousel"
                      infinite
                      dots={true}
                      dotPosition={"bottom"}
                    >
                      {data?.items?.map((val) => (
                        <SlidesCard data={val} key={val.item_id} currency={data.currency} />
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
                    height: 274,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No top selling product at the moment
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
  const navigate = useNavigate();
  const { created_by_platform } = useStore();

  return (
    <>
      {/* <div className="pos-relative h-100"> */}
      {/* <div className="carousel-arrow-prev">
          <IoIosArrowBack
            onClick={prev}
          />
        </div> */}
      <div className="carousel-wrapper">
        <div className="carousel-image">
          <Image
            src={
              data?.images?.length
                ? ImagePath(data?.images[0], created_by_platform)
                : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                    import.meta.env.VITE_ITEM_PLACEHOLDER_IMAGE
                  }`
            }
            preview={false}
            className="cursor"
            onClick={() => {
              setSessionAndLocalObj(data?.item_id, true, ITEMS);
              navigate(ITEMS);
            }}
          />
        </div>
        <div className="carousel-content">
          <div className="mb-10">
            <Title
              level={3}
              className="cursor carousel-item-title"
              onClick={() => {
                setSessionAndLocalObj(data?.item_id, true, ITEMS);
                navigate(ITEMS);
              }}
            >
              {data.name}
            </Title>
          </div>
          {/* <span style={{ color: "green" }}> {data.name} </span> */}
          <div className="d-flex align-center gap-10 mb-5 ">
            <Title level={5} className="carousel-heading">
              {" "}
              Quantity Sold:{" "}
            </Title>
            <Title level={5} className="carousel-value">
              {data?.quantity_sold} {data.unit}
            </Title>
          </div>
          <div className="d-flex align-center gap-10 mb-5">
            <Title level={5} className="carousel-heading">
              {" "}
              Price:{" "}
            </Title>
            <Title level={5} className="carousel-value">
              {currency}&nbsp;
              {data?.price.toFixed(2)}
            </Title>
          </div>
          <div className="d-flex align-center gap-10 mb-5">
            <Title level={5} className="carousel-heading">
              {" "}
              In stock:{" "}
            </Title>
            <Title level={5} className="carousel-value">
              {" "}
              {data?.in_stock}
            </Title>
          </div>
          <div className="d-flex align-center gap-10 mb-5">
            <Title level={5} className="carousel-heading">
              {" "}
              Total sale:{" "}
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
      {/* </div> */}
    </>
  );
};
