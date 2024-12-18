/**@format */

import { Col, Divider, Form, Modal, Row, Space } from "antd";
import { Buttonx, InputField, Selectx } from "app/shared";
import { RepeatDuration, RepeatModalProps } from "./Types";

export const RepeatModal = ({
  toggle,
  visible,
  form: mainform,
  repeat_duration,
}: RepeatModalProps) => {
  const [form] = Form.useForm();
  const onFinish = (values: { number: number; repeat_every: number }) => {
    const repeatDuration = repeat_duration?.find(
      (dur: RepeatDuration) => dur.id === values.repeat_every
    );
    mainform.setFieldsValue({ repeat_duration: `${values.number} ${repeatDuration?.label}` });
    toggle();
  };

  return (
    <>
      <Modal
        footer={null}
        destroyOnClose
        open={visible}
        onCancel={toggle}
        title="Repeat Duration"
        maskClosable={false}
      >
        <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
          <Row>
            <Col span={6} offset={2}>
              <InputField
                colon={false}
                size="middle"
                name="number"
                label="Duration"
                type="number"
                stringMode={false}
                className="flex_root"
              />
            </Col>
            <Col span={12} offset={1}>
              <Selectx
                colon={false}
                size="middle"
                name="repeat_every"
                label="Repeat Every"
                className="flex_root"
                options={repeat_duration}
              />
            </Col>
          </Row>
          <Divider />

          <Space className="steps-action">
            <Buttonx
              size="middle"
              type="default"
              btnText="Cancel"
              htmlType="button"
              clickHandler={toggle}
            />
            <Buttonx size="middle" btnText="Save" loading={false} />
          </Space>
        </Form>
      </Modal>
    </>
  );
};
