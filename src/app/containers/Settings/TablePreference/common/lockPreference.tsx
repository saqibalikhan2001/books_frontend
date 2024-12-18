/**@format */

import { useEffect, useState } from "react";
import { Button, Form, Space, Typography, Modal, Row } from "antd";
import { Labels } from "static";
import { useAxios } from "app/Hooks";
import { TooltipX } from "app/shared/ToolTip";
import { Toast, Icons, CheckBox, Buttonx, Spinner } from "app/shared";

const { Text } = Typography;
const { RiDeleteBinLine, VscAdd } = Icons;

type FieldPrefprops = {
  data: any;
  url: string;
  isLoading: Boolean;
  permission: Boolean;
  refetch: () => void;
};

const LockPreference = ({
  data,
  url = "",
  isLoading,
  refetch,
  permission = false,
}: FieldPrefprops) => {
  const [form] = Form.useForm();
  const [status, setStatus] = useState(false);
  const { callAxios, bool, toggle } = useAxios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lockedloading, _setlockloading] = useState(false);
  const [lockedColumnsArray, setLockedColumnArray] = useState([]);

  const formvalue = Form.useWatch("preferences", form);

  useEffect(() => {
    const alreadyLockedcolumns = data?.preferences
      ?.filter((val) => val.locked)
      .map((obj) => {
        return obj.slug;
      });

    setLockedColumnArray(alreadyLockedcolumns);
  }, [data?.preferences, status]);

  useEffect(() => {
    form.setFieldValue("preferences", data?.preferences);
    if (status) setStatus(false);
  }, [data, status]);

  const onSubmit = (values: any) => {
    if (data.show_invited_popup) {
      setIsModalOpen(true);
    } else {
      handleSubmit(values);
    }
  };

  const handleSubmit = (values: any) => {
    let payload = {
      slug: data.slug,
      lock_status: true,
      lock_column: lockedColumnsArray,
      //@ts-ignore
      preferences: values?.preferences,
    };

    toggle();
    callAxios({
      method: "put",
      data: payload,
      url: `table-setting/${url}`,
    }).then((res) => {
      if (res) {
        refetch();
        Toast({ message: res?.message });
        setIsModalOpen(false);

        // LockedColumnApiCall();
      }
    });
  };

  // const LockedColumnApiCall = () => {
  //   let payload = {
  //     slug: data.slug,
  //     lock_status: true,
  //     lock_column: lockedColumnsArray,
  //   };
  //   callAxios({
  //     method: "post",
  //     data: payload,
  //     url: `reorder`,
  //   }).then((res) => {
  //     Toast({ message: "Table setting save successfully" });
  //     toggle();
  //     refetch();
  //     if (!res) setStatus(!status);
  //   });
  // };

  const handleClick = (slug) => {
    const lockedCols = [...lockedColumnsArray];
    //@ts-ignore
    const exist = lockedCols.includes(slug);
    if (!exist) {
      if (lockedColumnsArray.length === 3) {
        Toast({ type: "info", message: "You can only lock 3 columns." });
        const cloneForm = JSON.parse(JSON.stringify(formvalue));
        const index = formvalue.findIndex((obj) => obj.slug === slug);

        if (index !== -1) {
          cloneForm[index]["locked"] = false;
        }
        form.setFieldsValue({ preferences: cloneForm });
        return;
      }
      //@ts-ignore
      lockedCols.push(slug);
      setLockedColumnArray(lockedCols);
    } else {
      //@ts-ignore
      const pos = lockedCols.indexOf(slug);
      lockedCols.splice(pos, 1);
      setLockedColumnArray(lockedCols);
    }
  };
  if (isLoading) return <Spinner directionSize={"81.4vh"} />;
  return (
    <>
      {lockedloading ? (
        <Spinner directionSize={"81.4vh"} />
      ) : (
        <Form name="form-pref" form={form} onFinish={onSubmit}>
          <div className="preference_list_table">
            <table
              className="custom-listing-tbl"
              style={{
                width: "100%",
                borderSpacing: 0,
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#d9d9d929" }}>
                  <th style={{ textAlign: "left", padding: "8px" }}>Column Name</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Is Lockable</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Current Locked Columns</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Default Columns</th>
                </tr>
              </thead>
              <Form.List name="preferences">
                {(fields, { add, remove }) => (
                  <>
                    <tbody>
                      {fields.map(({ key, name, ...restField }) => (
                        <tr key={key} style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)" }}>
                          <td style={{ textAlign: "left", padding: "8px" }}>
                            <Text>{data?.preferences[key]?.name}</Text>
                            {/* {data?.preferences[key]?.used_by?.length > 0 && (
                            <TooltipX
                              placement="bottom"
                              title={`This column is locked by ${data?.preferences[
                                key
                              ]?.used_by_user_name?.toString()}`}
                            >
                              &nbsp; &nbsp; &nbsp; &nbsp; <BsQuestionOctagon />
                            </TooltipX >
                          )} */}
                          </td>
                          <td style={{ textAlign: "left", padding: "8px" }}>
                            <CheckBox
                              disabled={
                                data?.preferences[key]?.default ||
                                (formvalue?.length > 0 && formvalue[key]?.locked)
                              }
                              {...restField}
                              name={[`${name}`, "is_lockable"]}
                            />
                          </td>
                          <td style={{ textAlign: "left", padding: "8px" }}>
                            {/* {data?.preferences[key]?.is_lockable && ( */}
                            <CheckBox
                              disabled={
                                data?.preferences[key]?.default ||
                                (formvalue?.length > 0 && !formvalue[key]?.is_lockable)
                              }
                              {...restField}
                              handleClick={() => handleClick(data?.preferences[key]?.slug)}
                              name={[`${name}`, "locked"]}
                            />
                            {/* )} */}
                          </td>
                          <td style={{ textAlign: "left", padding: "8px" }}>
                            {data?.preferences[key]?.default && (
                              <CheckBox
                                disabled={data?.preferences[key]?.default}
                                {...restField}
                                name={[`${name}`, "default"]}
                              />
                            )}
                          </td>

                          <td style={{ display: "none" }}>
                            <TooltipX title="Delete">
                              <Button
                                shape="circle"
                                icon={<RiDeleteBinLine size={14} color="red" />}
                                onClick={() => remove(name)}
                              />
                            </TooltipX>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <Form.Item style={{ marginBottom: "0" }}>
                      <Text
                        onClick={() => add()}
                        style={{ color: "blue", cursor: "pointer", display: "none" }}
                      >
                        <VscAdd color="blue" /> Add Anthor Line
                      </Text>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </table>
          </div>
          {permission && (
            <Space>
              <Buttonx
                btnText="Save"
                loading={bool}
                // wrapperCol={{
                //   offset: 10,
                // }}
                className="btn-form-size btn-primary"
              />
            </Space>
          )}
        </Form>
      )}
      <Modal
        centered
        width={400}
        footer={null}
        destroyOnClose
        closable={false}
        open={isModalOpen}
        maskClosable={false}
        className="radius-5 default_modal"
      >
        <Space>
          <Typography.Text style={{ textAlign: "center" }}>
            Selected column(s) are locked by some users. If you unlock, the other users will not be
            able to locked them further. Are you sure you want to proceed?
          </Typography.Text>
        </Space>
        <Row justify="center">
          <Space>
            <Button className="btn-form-size btn-default" onClick={() => setIsModalOpen(false)}>
              {Labels.CANCEL}
            </Button>
            <Button
              className="btn-form-size btn-primary"
              onClick={() => {
                handleSubmit(form.getFieldsValue());
              }}
            >
              {Labels.SAVE}
            </Button>
          </Space>
        </Row>
      </Modal>
    </>
  );
};
export default LockPreference;
