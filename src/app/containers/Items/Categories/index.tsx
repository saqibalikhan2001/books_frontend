/** @format */

import { useState } from "react";
import { Button, Typography } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { endpoints } from "static";
import { useAxios, usePermissions } from "app/Hooks";
import { CategoryEdit } from "./Edit";
import { CreateCategory } from "./Create";
import { CategoryListing } from "./Listing";
import { AccessDenied, Breadcrumbx, Toast } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetCategoriesListingQuery } from "store/query/categories";
import { SpinnerX } from "app/shared/PageLoader";

const { Title } = Typography;
const { PRODUCT_CATEGORY } = endpoints;

const Categories = () => {
  const { toggle, callAxios } = useAxios();
  const [userData, setUserdata] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { paginate, Prev, Next, onChange, handlePage, handleRowSize } =
    useCustomPagination("categories");
  const { checkPermission, fetchingRoles } = usePermissions();
  const { has_CategoryView_permission } = checkPermission("CategoryView");
  const { has_CategoryCreate_permission } = checkPermission("CategoryCreate");

  const { data, isLoading, refetch, isFetching } = useGetCategoriesListingQuery(paginate, {
    refetchOnMountOrArgChange: true,
    skip: !has_CategoryView_permission,
  });

  const handleClick = (data) => {
    setUserdata(data);
    setIsModalOpen(true);
  };
  const handleConfirm = (data) => {
    callAxios({
      method: "delete",
      url: `${PRODUCT_CATEGORY}/${data.id}`,
    }).then((res) => {
      toggle();
      Toast({ message: res.message });
      refetch();
    });
  };
  const handleButton = () => {
    setIsModalOpen(true);
    setUserdata(null);
  };
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      <PageHeader
        className="generic_top_header product-header cat_top_header"
        title={
          <>
            <Breadcrumbx name="" category className="_product_breadcrumbs" />
            <Title className="product-cat-heading" level={4}>
              Product Categories
            </Title>
          </>
        }
        extra={
          has_CategoryCreate_permission && (
            <Button
              key="1"
              className="d-flex btn-form-size  align-center btn-primary px-12"
              onClick={handleButton}
            >
              <img
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_1x.svg`}
                alt="plus icon"
                className="mr-5 image_filter"
              />{" "}
              New category
            </Button>
          )
        }
      />
      <div className="cat-pagination">
        {has_CategoryView_permission ? (
          <CategoryListing
            data={data}
            Prev={Prev}
            Next={Next}
            bool={isFetching}
            onChange={onChange}
            isLoading={isLoading}
            pagination={paginate}
            handlePage={handlePage}
            handleClick={handleClick}
            handleRowSize={handleRowSize}
            handleConfirm={handleConfirm}
          />
        ) : (
          <AccessDenied />
        )}
      </div>
      {!(userData && Object.keys(userData).length) && (
        <CreateCategory
          refetch={refetch}
          isFetching={isFetching}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      {userData && Object.keys(userData).length && (
        <CategoryEdit
          refetch={refetch}
          current={userData}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
};
export default Categories;
