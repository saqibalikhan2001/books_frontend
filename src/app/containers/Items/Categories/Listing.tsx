/** @format */
import { useMemo, useState } from "react";
import { Table } from "antd";
import { Labels } from "static";
import { ActionMenu, EmptyIcon, Spinner, TooltipX } from "app/shared";
import type { ColumnsType } from "antd/es/table";
import { CustomPaginate } from "app/shared/CustomPaginate";
import { CategoriesType, CategoriesListProps } from "./Types";
import { usePermissions } from "app/Hooks";
import { CategoryView } from "./View";

const { DELETE, PRODUCT_CATEGORIES } = Labels;

export const CategoryListing = ({
  Prev,
  Next,
  data,
  bool,
  onChange,
  isLoading,
  handlePage,
  pagination,
  handleClick,
  handleRowSize,
  handleConfirm,
}: CategoriesListProps) => {
  const { checkPermission } = usePermissions();
  const localParams = sessionStorage.getItem("params");
  const parsedparams = JSON.parse(localParams as any);
  const [modalData, setModalData] = useState<any>();
  const [isView, setIsView] = useState(false);

  const { has_CategoryEdit_permission } = checkPermission("CategoryEdit");
  const { has_CategoryDelete_permission } = checkPermission("CategoryDelete");
  const handleOpen = (record) => {
    setModalData(record);
    setIsView(!isView);
  };
  const Title = ({ type, title }) => (
    <div className="d-flex" style={{ justifyContent: "flex-start" }}>
      {title}
      {parsedparams?.sort_column === type && (
        <TooltipX title={`Sort by ${parsedparams.sort === "asc" ? "ascending" : "descending"}`}>
          {parsedparams.sort === "asc" ? ascendingIcon : descendingIcon}
        </TooltipX>
      )}
    </div>
  );
  const memoizeColumn: ColumnsType<CategoriesType> = useMemo(
    () => [
      {
        title: () => <Title type="name" title="Category name" />,
        key: "name",
        sorter: true,
        dataIndex: "name",
        showSorterTooltip: false,
        defaultSortOrder: "ascend",
        sortDirections: ["ascend", "descend"],
        width:350,
      },
      {
        title: () => <Title type="description" title="Category description " />,
        key: "description",
        sorter: true,
        dataIndex: "description",
        showSorterTooltip: false,
        width:600,
        defaultSortOrder: "ascend",
        sortDirections: ["ascend", "descend"],
        render: (text) => (
          <div className="category-description">
            {text}
          </div>
        )
      },
      {
        title: () => <Title type="item_count" title="Total Products" />,
        sorter: true,
        key: "item_count",
        dataIndex: "item_count",
        showSorterTooltip: false,
        width:200,
        defaultSortOrder: "ascend",
        sortDirections: ["ascend", "descend"],
        onCell: () => ({
          style: {
              minWidth: '150px', 
          },
      }),
      },
      {
        title: "",
        width: 60,
        dataIndex: "",
        align: "center",
        render: (props) => (
          <ActionMenu
            category
            showEdit
            data={props}
            handleClick={handleClick}
            handleConfirm={handleConfirm}
            canEdit={has_CategoryEdit_permission}
            deletePermission={has_CategoryDelete_permission}
            title={
              has_CategoryDelete_permission
                ? `${DELETE} "${props.name}" ${PRODUCT_CATEGORIES} `
                : "Access Denied"
            }
          />
        ),
        onCell: () => ({
          onClick: (event) => {
            event.stopPropagation();
          },
        }),
      },
    ],
    [handleClick, handleConfirm, parsedparams?.sort]
  );

  return (
    <>
      {bool || isLoading ? (
        <Spinner directionSize={"75vh"} />
      ) : data?.data?.length ? (
        <>
          <CustomPaginate
            Prev={Prev}
            Next={Next}
            paginate={pagination}
            handlePage={handlePage}
            className="pagination_row"
            totalPages={data?.last_page}
            handleRowSize={handleRowSize}
          />
          <div className="my-custom-table cat-listing-table">
            <div id="wrapper" className={"item-table "}>
              <Table
                size="middle"
                pagination={false}
                onChange={onChange}
                columns={memoizeColumn}
                dataSource={data?.data || []}
                rowKey={(record: any) => record.id}
                onRow={(record) => ({
                  onClick: () => handleOpen(record),
                })}
                className="generic-table categorie_table"
                scroll={{ ...(Number(data?.data.length) > 10 && { y: 600 }) }}
              />
            </div>
          </div>
          <div className="item_listing_count">
            <p>{`Total Categories : ${data?.total}`}</p>
          </div>
        </>
      ) : (
        <div className="center-align-icon vh-239">
          <EmptyIcon />
          <span>No data found</span>
        </div>
      )}
      <CategoryView setIsModalOpen={setIsView} isModalOpen={isView} modalData={modalData} />
    </>
  );
};

const ascendingIcon = (
  <span className="white-circle">
    <img
      alt="ascending order"
      className="ascending order"
      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-ascending.svg`}
    />
  </span>
);
const descendingIcon = (
  <span className="white-circle">
    <img
      alt="descending order"
      className="ascending order"
      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-descending.svg`}
    />
  </span>
);
