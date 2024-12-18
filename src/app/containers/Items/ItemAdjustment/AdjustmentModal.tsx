/** @format */

import { useCallback, useEffect, useState } from "react";
import { Form, Input } from "antd";
import dayjs from "dayjs";
import { rules } from "utils";
import { AdjustmentTable } from "./AdjusmentTable";
import { Content, endpoints, Labels } from "static";
import { DetailpageForm, ModalProps } from "../Types";
import { useAxios, useCreateFormApi, useStore } from "app/Hooks";
import { CreateAccount } from "app/containers/chartOfAccounts/Create";
import { Buttonx, DatePickerx, InputField, Selectx, Spinner, Toast } from "app/shared";

const todayDate = dayjs(new Date());
const { ITEM_ADJUSTMENT } = endpoints;

const initialvalues = {
  type: "",
  items: [],
  reason: "",
  date: todayDate,
  description: "",
  warehouse_id: null,
  purchase_account_id: null,
};

export const ModalForm = ({ handleCancel, itemDetail, className, refetch }: ModalProps) => {
  const [form] = Form.useForm();
  const [url, setUrl] = useState("");
  const { org_date_format } = useStore();
  const [modal, setModal] = useState(false);
  const [item, setItem] = useState<any>([]);
  const { callAxios, toggle, bool } = useAxios();
  const [adjustment, setAdjustment] = useState(false);
  const [warehouseId, setWarehouseId] = useState(null);
  const handleItemList = useCallback((items: any) => setItem(items), []);

  const { purchaseAccount, warehouses, formLoading, details } = useCreateFormApi(
    `${ITEM_ADJUSTMENT}/create`
  );
  useEffect(() => {
    if (itemDetail) {
      const ware_id = itemDetail?.stocks[0]?.warehouse_id;
      form.setFieldValue("warehouse_id", ware_id);
    }
  }, [itemDetail]);

  const handleWarehouse = (value) => {
    setWarehouseId(value);
    value && setAdjustment(true);
    setUrl(`itemadjustments/create/warehouseitemlist/${value}`);
  };

  const onSubmit = (values: DetailpageForm) => {
    toggle();
    values.type = "quantity";
    const itemObj = item.filter((data) => data.id !== null);
    values.items = itemObj.map((adjusttedItem) => ({
      id: adjusttedItem.id,
      adjusted_quantity: adjusttedItem?.quantity,
    }));
    if (!values.items[0]?.id) {
      Toast({ message: "Adjustment item is required", type: "error" });
      toggle();
    } else {
      callAxios({
        url: ITEM_ADJUSTMENT,
        method: "post",
        data: values,
      })
        .then((res) => {
          toggle();
          handleCancel();
          Toast({ message: res.message });
          refetch();
        })
        .catch(() => toggle());
    }
  };
  const handleDescription = (e) => {
    let value = e.target.value;
    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");

    form.setFieldValue("description", formattedValue);
  };
  const handleAccount = (_?: any, res?: any) => {
    setModal(!modal);
    res &&
      form.setFieldsValue({ purchase_account_id: { id: res?.id, label: res?.title || res.name } });
    if (res && !purchaseAccount.some((obj) => obj.id === res?.id)) {
      purchaseAccount.push({ id: res?.id, label: res?.title, title: res?.title });
    }
  };
  return (
    <>
      {formLoading ? (
        <Spinner directionSize={"570px"} />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          requiredMark={false}
          initialValues={initialvalues}
          className={`adjust-tbl-main ${className}`}
        >
          <div className="adjustment-popup">
            <div className="flexbox  justify-content-between flex-start">
              <div className="form_group flex-47 date-field mb-30">
                <DatePickerx
                  isRequired
                  name="date"
                  size="small"
                  inputReadOnly
                  label={Labels.DATE}
                  format={org_date_format}
                  popupClassName="overlap"
                />
              </div>
              <div className=" flex-47 mb-30">
                <Selectx
                  required
                  showSearch
                  size="large"
                  allowClear={false}
                  name="warehouse_id"
                  disabled={itemDetail}
                  label={Labels.LOCATION}
                  placeholder="Select location"
                  handleChange={handleWarehouse}
                  popupClassName="overlap dropdown--scroll item_dropdown"
                  options={warehouses.map((data) => {
                    return { id: data?.id, label: data?.name };
                  })}
                />
              </div>
              <div className="form_group flex-47 ">
                <InputField
                  required
                  form={form}
                  size="large"
                  name="reason"
                  colon={false}
                  label={Labels.REASON}
                  className="input_field"
                  placeholder="Enter reason"
                  rules={rules({ message: Content.enter_reason })}
                />
              </div>
              <div className="form_group flex-47 ">
                {<label className="form--label_style">Description</label>}
                <Form.Item colon={false} name="description" className="meteorite">
                  <Input.TextArea
                    rows={4}
                    showCount
                    maxLength={1000}
                    className="description_box"
                    onChange={handleDescription}
                    placeholder="Enter description"
                  ></Input.TextArea>
                </Form.Item>
              </div>
              <div className="form_group flex-47 transform_-Y mb-5">
                <Selectx
                  required
                  size="large"
                  allowClear={false}
                  name="purchase_account_id"
                  className="mb-5 gray_border"
                  placeholder="Select account"
                  handleAddNew={handleAccount}
                  label="Inventory adjustment account"
                  popupClassName="overlap dropdown--scroll item_dropdown"
                  options={purchaseAccount?.map((value) => ({
                    id: value.id,
                    label: value?.title || value?.name,
                  }))}
                  showButton={
                    import.meta.env.VITE_ADD_ACCOUNTS === "false" || !modal ? false : true
                  }
                  rules={rules({ message: Content.select_inventory_adjustment })}
                />
              </div>
            </div>
            <AdjustmentTable
              url={url}
              item={item}
              itemDetail={itemDetail}
              adjustment={adjustment}
              warehouseId={warehouseId}
              handleItemList={handleItemList}
              stockPreference={details?.stock_preference}
              className="generic-table qty_adjustment_table "
            />
            <div className="button_flexbox flex-end ">
              <Buttonx
                type="default"
                btnText="Cancel"
                htmlType="button"
                clickHandler={handleCancel}
                className="btn-default btn-form-size cate_cancel_btn mr-20 mb-30"
              />
              <Buttonx
                loading={bool}
                btnText="Save"
                className="btn-primary btn-form-size mb-30"
                disabled={
                  !item?.length
                    ? "true"
                    : item.some(
                        (obj) =>
                          obj.quantity === "0" || obj.quantity === "-0" || obj.quantity === ""
                      )
                }
              />
            </div>
          </div>
        </Form>
      )}
      <CreateAccount
        isItemForm
        bool={modal}
        query="inventory"
        has_permission={true}
        toggle={handleAccount}
      />
    </>
  );
};
