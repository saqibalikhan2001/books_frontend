/** @format */

import { useEffect, useState } from "react";
import { Typography, Checkbox, Form } from "antd";
import { endpoints } from "static";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { Breadcrumbx, Buttonx, Spinner, Toast } from "app/shared";

const { GENERAL_CATEGORY, CATEGORIES_IMPORT } = endpoints;

export const GeneralCategories = () => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const { toggle, bool } = useBool();
  const [value, setValue] = useState<any>([]);
  const { checkPermission } = usePermissions();
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const { has_GeneralCategoryPreferenceEdit_permission } = checkPermission(
    "GeneralCategoryPreferenceEdit"
  );

  const check = Form.useWatch("checked", form);

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line
  }, []);

  const getCategories = () => {
    callAxios({
      url: GENERAL_CATEGORY,
    }).then((res) => {
      setValue(res);
      setHasContentLoading(false);
    });
  };

  const handleSubmit = (values) => {
    toggle();
    callAxios({
      method: "post",
      url: CATEGORIES_IMPORT,
      data: { categories: values.checked },
    })
      .then((res) => {
        toggle();
        form.resetFields();
        getCategories();
        Toast({ message: res.message });
      })
      .catch(() => toggle());
  };
  return (
    <>
      {hasContentLoading ? (
        <Spinner directionSize={"90vh"} />
      ) : (
        <div className="main_wrapper general_categories">
          <Breadcrumbx name="General Categories" className="navigate" setting={true} show />
          <div className="_container">
            <Typography.Title level={3} className="form_heading f-16">
              Import general categories to organization categories
            </Typography.Title>
            {value?.length > 0 ? (
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <div className="form_box">
                  <div className="form_group module-box">
                    <Typography.Text>"Please select required categories."</Typography.Text>
                    <div className="flexbox pb-10">
                      <Form.Item name="checked">
                        <Checkbox.Group>
                          <div className="categories_list">
                            {value?.map(({ id, name }) => (
                              <div className="w-48 ml-0 mb-10 category_check_list">
                                <Checkbox key={id} value={id}></Checkbox>
                                <span className="category_check_name">{name}</span>
                              </div>
                            ))}
                          </div>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>
                    <Typography.Text className="flexbox mb-15">
                      Note: You cannot change these categories after import
                    </Typography.Text>
                    {has_GeneralCategoryPreferenceEdit_permission ? (
                      <Buttonx
                        loading={bool}
                        btnText="Import"
                        htmlType="submit"
                        disabled={!Boolean(check?.length)}
                        className="btn-primary btn-form-size"
                      />
                    ) : null}
                  </div>
                </div>
              </Form>
            ) : (
              <Typography.Text>No category found</Typography.Text>
            )}
          </div>
        </div>
      )}
    </>
  );
};
