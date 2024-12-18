/**@format */

import { Form, Table } from "antd";
import type { TableProps } from "antd/es/table";
import { useAxios, useStore } from "app/Hooks";
import { Buttonx, DatePickerx, Selectx } from "app/shared";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import { getOrganizationDate } from "utils";
import { Spinner } from "../PageLoader";
// import { TooltipX } from "../ToolTip";
import { DataType } from "../types";

dayjs.extend(customParseFormat);

const dateRangeList = [
  {
    id: "thismonth",
    label: "This month",
  },
  {
    id: "thisyear",
    label: "This year",
  },
  {
    id: "custom",
    label: "Custom",
  },
];
const Userlist = [
  {
    id: "user3",
    label: "user3",
  },
  {
    id: "user2",
    label: "user2",
  },
  {
    id: "user1",
    label: "user1",
  },
];
export const ActivityLog = ({ url }: { url: string; isModal?: boolean | any }) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const { org_date_format } = useStore();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<any>("desc");
  //@ts-ignore
  const onChange: TableProps<DataType>["onChange"] = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "asc" : "desc");
  };
  useEffect(() => {
    setLoading(true);
    callAxios({
      url: `${url}?order_by=${sortOrder}`,
    }).then((res) => {
      setActivity(res);
      setLoading(false);
    });
    //eslint-disable-next-line
  }, [url, sortOrder]);

  const onFinish = () => {};
  const resetValue = () => form.resetFields();

  const columns: any = [
    {
      dataIndex: "",
      render: (props: any) => {
        return (
          <div className="d-flex">
            <div className="create_name">
              {getOrganizationDate(props?.created_at, org_date_format)}
            </div>
            <div className="create_name pl-9">{props?.time}</div>
          </div>
        );
      },
      width: "20%",
      key: "created_at",
      title: "Timestamp",
      // sorter: activity?.length && !isModal,
      // showSorterTooltip: false,
      // defaultSortOrder: "desc",
      // sortDirections: ["asc", "desc"],

      // title: ({ sortColumns }: any) => {
      //   const key = sortColumns && sortColumns[0]?.column?.key;
      //   return (
      //     <div className="d-flex">
      //       Timestamp
      //       {key === "created_at" ? (
      //         sortOrder === "asc" ? (
      //           // <span className="arrow arrow-bar is-top"></span>
      //           <span className="white-circle">
      //             <TooltipX title={`Sort by ${sortOrder}`} placement="bottom">
      //               <img
      //                 src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/sort-ascending.svg"
      //                 alt="ascending order"
      //                 className="ascending order"
      //               />
      //             </TooltipX>
      //           </span>
      //         ) : (
      //           <span className="white-circle">
      //             <TooltipX title={`Sort by ${sortOrder}`} placement="bottom">
      //               <img
      //                 src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/sort-descending.svg"
      //                 alt="descending order"
      //                 className="ascending order"
      //               />
      //             </TooltipX>
      //           </span>
      //         )
      //       ) : (
      //         ""
      //       )}
      //     </div>
      //   );
      // },
    },
    // {
    //   title: "Location",
    //   dataIndex: "location",
    // },
    {
      title: "Action",
      dataIndex: "description",
      className: "action-field",
      align: "left",
      width: "60%",
    },
    {
      title: "By User",
      dataIndex: "",
      render: (data: any) => {
        return (
          <>
            <div className="create_name">{data?.creator}</div>
            <div className="creator_role">{data?.creator_role}</div>
          </>
        );
      },
      align: "left",
      width: "20%",
      //@ts-ignore
      className: (record) => (record.creator ? "useracdef" : ""),
    },
  ];

  //@ts-ignore
  const content = (
    <div className="_generic_popupover_main">
      <Form form={form} name="control-hooks" onFinish={onFinish} style={{ maxWidth: 600 }}>
        <div className="form_group  mb-30">
          <label>Date</label>
          <Selectx
            size="large"
            className="h-40"
            options={dateRangeList}
            label={<label></label>}
            name="sales_information"
            placeholder="Select date"
          />
        </div>
        <div className="form_group  mb-30">
          <label>From</label>
          <DatePickerx
            name="from"
            format={org_date_format}
            defaultValue={dayjs("2015/01/01", org_date_format)}
          />
        </div>

        <div className="form_group  mb-30">
          <label>To</label>
          <DatePickerx
            name="to"
            format={org_date_format}
            defaultValue={dayjs("2015/01/01", org_date_format)}
          />
        </div>
        {/* <div className="form_group  mb-30">
          <label>Location</label>
          <Selectx
            options={locationList}
            name="location"
            className="h-40"
            placeholder="Select location"
            label={<label></label>}
            size="large"
          />
        </div> */}
        <div className="form_group  mb-30">
          <label>User</label>
          <Selectx
            name="user"
            size="large"
            className="h-40"
            options={Userlist}
            label={<label></label>}
            placeholder="Select user"
          />
        </div>
      </Form>
      <div className="d-flex _generic_popupover_actions pb-8">
        <Buttonx
          btnText="Reset"
          clickHandler={resetValue}
          className="btn-default mr-15 w-96px h-36px"
        ></Buttonx>
        <Buttonx btnText="Apply" className="btn-primary w-96px h-36px"></Buttonx>
      </div>
    </div>
  );

  return (
    <>
      {/* <div className="popup-tooltip d-flex align-center">
        <Popover
          placement="bottomLeft"
          content={content}
          trigger="click"
          overlayClassName="adjust-filter-main"
        >
          <RiEqualizerFill className="popup-over" />
        </Popover>
        <div className="adjustment-filter">
          <Button
            type="link"
            onClick={() => {
              form.resetFields();
              setOpen(false);
            }}
          >
            Clear filters
          </Button>
        </div>
      </div> */}
      {loading ? (
        <div >
          <Spinner directionSize={window.innerWidth >= 1600 ? '345px' : '132px'} size={'50px'} />
        </div>
      ) : (
        <Table
          // onChange={onChange}
          bordered={false}
          columns={columns}
          pagination={false}
          dataSource={activity}
          style={{ marginTop: "2px" }}
          className="generic-table activity-tbl"
        />
      )}
    </>
  );
};
