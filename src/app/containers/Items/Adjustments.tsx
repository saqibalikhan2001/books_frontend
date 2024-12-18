/** @format */

import { useEffect, useMemo, useState } from "react";
import { Table, Form } from "antd";
import { Labels } from "static";
import { getOrganizationDate } from "utils";
import { useAxios, useStore } from "app/Hooks";
import { Adjusmenttype, dateRangeList } from "./filterOptions";
import { Selectx, Buttonx, DatePickerx, Spinner } from "app/shared";

const { DATE, ADJUSTMENT_TYPE, USER, LOCATION, QUANTITY_ADJUSTED } = Labels;

const Adjustments = ({ url }: { url: string }) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const { org_date_format } = useStore();
  const [open, setOpen] = useState(false);
  const [adjustment, setAdjustments] = useState<any>();

  useEffect(() => {
    setOpen(true);
    callAxios({
      url: `${url}/adjustment`,
    }).then((res) => {
      setAdjustments(res);
      setOpen(false);
    });
    //eslint-disable-next-line
  }, []);

  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex: "item_adjustment",
        key: DATE,
        width: 80,
        ellipsis: true,
        render: (item_adjustment) => (
          <>{getOrganizationDate(item_adjustment?.adjustment_date, org_date_format)}</>
        ),
      },
      {
        title: ADJUSTMENT_TYPE,
        dataIndex: "item_adjustment",
        key: ADJUSTMENT_TYPE,
        width: 100,
        ellipsis: true,
        render: (item_adjustment) => <>{item_adjustment?.type}</>,
      },
      {
        title: USER,
        dataIndex: "item_adjustment",
        key: USER,
        width: 100,
        ellipsis: true,
        render: (item_adjustment) => <>{item_adjustment?.user_name}</>,
      },
      {
        title: LOCATION,
        dataIndex: "item_adjustment",
        key: LOCATION,
        width: 100,
        className:"loaction_column",
        // ellipsis: true,
      
        render: (item_adjustment) => <>{item_adjustment?.warehouse_name}</>,
      },
      {
        title: QUANTITY_ADJUSTED,
        dataIndex: "amount",
        key: QUANTITY_ADJUSTED,
        width: 100,
        ellipsis: true,
        className: "text-right",
      },
    ],
    []
  );

  const hide = () => {
    form.resetFields();
    setOpen(false);
  };

  // const handleOpenChange = (newOpen: boolean) => {
  //   setOpen(newOpen);
  // };

  //@ts-ignore
  const content = (
    <div className="_generic_popupover_main">
      <Form form={form} name="control-hooks" style={{ maxWidth: 600 }}>
        <div className="form_group  mb-30">
          <Selectx
            size="middle"
            options={dateRangeList}
            label={<label></label>}
            name="package_and_shipment"
            placeholder={Labels.SELECT_TIME_PERIOD}
          />
        </div>
        <div className="form_group  mb-30">
          <label>From</label>
          <DatePickerx name="startDate" />
        </div>
        <div className="form_group  mb-30">
          <label>To</label>
          <DatePickerx name="to" />
        </div>
        <div className="form_group  mb-30">
          <label>Adjusment type</label>
          <Selectx
            size="middle"
            name="Adjusment type"
            options={Adjusmenttype}
            label={<label></label>}
            className="adjustment-field"
            placeholder={Labels.SELECT_TIME_PERIOD}
          />
        </div>
        <div className="d-flex _generic_popupover_actions pb-8">
          <Buttonx
            btnText="Reset"
            clickHandler={hide}
            className="btn-default mr-15 w-96px h-36px"
          />
          <Buttonx clickHandler={hide} btnText="Apply" className="btn-primary w-96px h-36px" />
        </div>
      </Form>
    </div>
  );

  return (
    <>
      {/* <div className="popup-tooltip d-flex align-center">
        <Popover
          open={open}
          title="Date"
          trigger="click"
          content={content}
          placement="bottomLeft"
          onOpenChange={handleOpenChange}
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

      {open ? (
        <Spinner directionSize={window.innerWidth >= 1600 ? '345px' : '132px'} size={'50px'} />
      ) : (
        <Table
          rowKey="key"
          bordered={false}
          pagination={false}
          columns={memoColumns}
          dataSource={adjustment}
          style={{ marginTop: "2px" }}
          className="generic-table report-period-tbl adjustment_table_modal"
        />
      )}
    </>
  );
};

export default Adjustments;
