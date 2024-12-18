/**@format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Form, Typography } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";
import { useAxios, useBool } from "app/Hooks";
import { Buttonx, PdfViewer, Selectx, Spinner, Toast } from "app/shared";

const AllDatta = [
  {
    id: 1,
    label: "Same Design for Old & New Printouts",
  },
  {
    id: 2,
    label: "Different Designs for Old & New Printouts",
  },
];
const { Title } = Typography;

const PdfPreferences = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { org_date_format } = useStore();
  const [previewTemplate, setpreviewTemplate] = useState(false);
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const [previewTemplateSlug, setPreviewTemplateSlug] = useState<string | null>(null);
  const [handleBrowseData, setHandleBrowseData] = useState({
    all_templates: [],
    organization_templates: [],
  });
  const [Handleolddata, setHandleolddata] = useState({
    all_templates: [],
  });
  const [HandleNewdata, setHandleNewdata] = useState({
    all_templates: [],
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState({
    new_template_id: null,
    old_template_id: null,
    all_template_id: null,
  });

  const dropdown = Form.useWatch("pdfType", form);

  const handlepdfDropdown = (value) => {
    if (value == 2) {
      let filteredTemplates = handleBrowseData.organization_templates.filter(
        (template: any) => template.type === "old" || template.type === "new"
      );
      let oldTemplateIds = filteredTemplates
        .filter((template: any) => template.type === "old")
        .map((template: any) => template.general_pdf_template_id);
      let newTemplateIds = filteredTemplates
        .filter((template: any) => template.type === "new")
        .map((template: any) => template.general_pdf_template_id);
      //@ts-ignore
      setSelectedTemplateId((prevState) => ({
        ...prevState,
        old_template_id: oldTemplateIds,
        new_template_id: newTemplateIds,
      }));

      // Keep `handleBrowseData.all_templates` intact
      setHandleBrowseData({
        ...handleBrowseData,
        all_templates: [...handleBrowseData.all_templates],
      });
      // setFieldValue("organizationType", option ? option.value : null);
      form.setFieldValue("pdfType", 2);
    } else {
      form.setFieldValue("pdfType", 1);
    }
  };

  useEffect(() => {
    // setLoader(true);
    callAxios({ url: `preferences/pdftemplates` })
      .then((res) => {
        setHasContentLoading(false);
        setHandleBrowseData(res);
        setHandleolddata({ all_templates: res.all_templates });
        setHandleNewdata({ all_templates: res.all_templates });
        const filteredTemplates = res.organization_templates.filter(
          (template) =>
            template.type === "all" || template.type === "new" || template.type === "old"
        );
        const defaultType = filteredTemplates.find((template) => template.type === "all");

        if (defaultType) {
          let newTemplateIds = filteredTemplates.reduce((acc, template) => {
            if (template.type === "all") {
              if (template.type === "all" && template.is_active == 1) {
                form.setFieldValue("pdfType", 1);
              } else {
                form.setFieldValue("pdfType", 2);
              }
              // If "all", set dropdown to "Same for all invoices"
              acc.all_template_id = template.general_pdf_template_id;
            } else if (template.type === "new") {
              acc.new_template_id = template.general_pdf_template_id;
            } else if (template.type === "old") {
              acc.old_template_id = template.general_pdf_template_id;
            }
            return acc;
          }, {});
          setSelectedTemplateId((prevState) => ({
            ...prevState,
            ...newTemplateIds,
          }));
        }
      })

      .catch(() => setHasContentLoading(false));
  }, []);
  const handleTemplateClick = (templateId, type) => {
    const id = Array.isArray(templateId) ? templateId[0] : templateId;
    const selectedTemplateIdOldData = Array.isArray(selectedTemplateId.old_template_id)
      ? selectedTemplateId.old_template_id[0]
      : selectedTemplateId.old_template_id;
    const selectedTemplateIdNewData = Array.isArray(selectedTemplateId.new_template_id)
      ? selectedTemplateId.new_template_id[0]
      : selectedTemplateId.new_template_id;
    const selectedTemplateIdAllData = Array.isArray(selectedTemplateId.all_template_id)
      ? selectedTemplateId.all_template_id[0]
      : selectedTemplateId.all_template_id;

    const updatedSelectedTemplate = {
      all_template_id: type == "all" ? id : selectedTemplateIdAllData,
      old_template_id: type == "old" ? id : selectedTemplateIdOldData,
      new_template_id: type == "new" ? id : selectedTemplateIdNewData,
    };

    setSelectedTemplateId(updatedSelectedTemplate);
  };

  const openPdf = (template: any) => {
    setPreviewTemplateSlug(template.slug);
    togglePdfModal();
  };
  const togglePdfModal = () => setpreviewTemplate(!previewTemplate);
  const handleSubmit = () => {
    toggle();
    callAxios({
      method: "put",
      data: {
        status:
          //@ts-ignore
          dropdown == 1
            ? { all: true, new: false, old: false }
            : { all: false, new: true, old: true },
        new_template_id:
          typeof selectedTemplateId?.new_template_id === "object"
            ? //@ts-ignore
              selectedTemplateId?.new_template_id[0]
            : selectedTemplateId?.new_template_id,
        old_template_id:
          typeof selectedTemplateId?.old_template_id === "object"
            ? //@ts-ignore

              selectedTemplateId?.old_template_id[0]
            : selectedTemplateId?.old_template_id,
        all_template_id:
          typeof selectedTemplateId?.all_template_id === "object"
            ? //@ts-ignore

              selectedTemplateId?.all_template_id[0]
            : selectedTemplateId?.all_template_id,
      },
      url: `preferences/pdftemplates`,
    })
      .then((res) => {
        toggle();
        if (res) {
          Toast({ message: res.message });
          navigate("/pdf-preferences");
        }
      })
      .catch(() => toggle());
  };
  return (
    <>
      {hasContentLoading ? (
        <Spinner directionSize={"90vh"} />
      ) : (
        <>
          <PageHeader
            className="generic_top_header"
            title={
              <Title style={{ marginTop: 0, marginBottom: 0, fontWeight: "bold" }} level={4}>
                PDF Templates
              </Title>
            }
          />
          <div className="flexbox pdf_preference inner_spacing  form-row-container justify-content-between">
            <Form
              form={form}
              className=""
              // initialValues={{ pdfType:  }}
            >
              <div className="form_label">
                <label className="form--label_style">
                  How you want to Configure Printout Designs?{" "}
                  <span className="time-span">(only for invoices sections)</span>
                </label>
                <Selectx
                  size="large"
                  name="pdfType"
                  allowClear={false}
                  options={AllDatta}
                  handleSort={false}
                  className="adjustment-field"
                  handleChange={handlepdfDropdown}
                  placeholder="Select Account Category"
                  popupClassName="overlap dropdown--scroll"
                />
              </div>
            </Form>

            <div
              className="card_container styled--store"
              style={{ display: "flex", flexDirection: "row" }}
            >
              {handleBrowseData.all_templates?.length > 0 && dropdown == 1 ? (
                handleBrowseData.all_templates.map((data: any, index) => (
                  <div
                    key={index}
                    className="temp"
                    onClick={() => handleTemplateClick(data?.id, "all")}
                    style={{
                      border:
                        selectedTemplateId.all_template_id == data.id ? "1px solid #1170ff" : "",
                    }}
                  >
                    {selectedTemplateId.all_template_id == data.id && (
                      <span className="selected btn"> selected</span>
                    )}
                    <div className="img_container">
                      <img alt={data?.name} src={data?.image_url} style={{ maxWidth: "170px" }} />
                      <div className="default_badge">
                        {data?.is_default == true && (
                          <span style={{ marginLeft: "39px" }} className="status status--draft">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text_area">
                      <button
                        type="submit"
                        id="click_login_button"
                        className="button--primary ml-15"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPdf(data);
                        }}
                      >
                        Preview Template
                      </button>
                    </div>
                    <label>{data?.name}</label>
                  </div>
                ))
              ) : (
                <p>{dropdown == 1 && "No Templates available."}</p>
              )}
            </div>
            <h6>
              {dropdown == 2 && (
                <>
                  Printout Designs For Old Data
                  <span className="time-span">
                    (selected design will be used for printouts of data created before{" "}
                    {getOrganizationDate(
                      //@ts-ignore
                      handleBrowseData.organization_templates[2]?.active_from,
                      org_date_format
                    )}
                    )
                  </span>
                </>
              )}
            </h6>
            <div className="styled--store" style={{ display: "flex", flexDirection: "row" }}>
              {Handleolddata.all_templates?.length > 0 && dropdown == 2 ? (
                Handleolddata.all_templates.map((data: any, index) => (
                  <div
                    key={index}
                    className="temp"
                    onClick={() => handleTemplateClick(data.id, "old")}
                    style={{
                      border:
                        selectedTemplateId.old_template_id == data.id ? "1px solid #1170ff" : "",
                    }}
                  >
                    {selectedTemplateId.old_template_id == data.id && (
                      <span className="selected btn"> selected</span>
                    )}
                    <div className="img_container">
                      <img alt={data?.name} src={data?.image_url} style={{ maxWidth: "170px" }} />
                      <div className="default_badge">
                        {data?.is_default == true && (
                          <span style={{ marginLeft: "39px" }} className="status status--draft">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text_area">
                      <button
                        type="submit"
                        id="click_login_button"
                        className="button--primary ml-15"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPdf(data);
                        }}
                      >
                        Preview Template
                      </button>
                    </div>
                    <label>{data?.name}</label>
                  </div>
                ))
              ) : (
                <p>{dropdown == 2 && "No Templates available."}</p>
              )}
            </div>

            <h6>
              {dropdown == 2 && (
                <>
                  Printout Designs For New Data
                  <span className="time-span">
                    (selected design will be used for printouts of data created from{" "}
                    {getOrganizationDate(
                      //@ts-ignore
                      handleBrowseData.organization_templates[2]?.active_from,
                      org_date_format
                    )}
                    )
                  </span>
                </>
              )}
            </h6>
            <div className="card_container" style={{ display: "flex", flexDirection: "column" }}>
              <div
                className="card_container styled--store"
                style={{ display: "flex", flexDirection: "row" }}
              >
                {HandleNewdata.all_templates?.length > 0 && dropdown == 2 ? (
                  HandleNewdata.all_templates.map((data: any, index) => (
                    <div
                      key={index}
                      className="temp"
                      onClick={() => handleTemplateClick(data.id, "new")}
                      style={{
                        border:
                          selectedTemplateId.new_template_id == data.id ? "1px solid #1170ff" : "",
                      }}
                    >
                      {selectedTemplateId.new_template_id == data.id && (
                        <span className="selected btn"> selected</span>
                      )}
                      <div className="img_container">
                        <img alt={data?.name} src={data?.image_url} style={{ maxWidth: "170px" }} />
                        <div className="default_badge">
                          {data?.is_default == true && (
                            <span style={{ marginLeft: "39px" }} className="status status--draft">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text_area">
                        <button
                          type="submit"
                          id="click_login_button"
                          className="button--primary ml-15"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPdf(data);
                          }}
                        >
                          Preview Template
                        </button>
                      </div>
                      <label>{data?.name}</label>
                    </div>
                  ))
                ) : (
                  <p>{dropdown == 2 && "No Templates available."}</p>
                )}
              </div>
              <div className="button_flexbox">
                <Buttonx
                  btnText="Cancel"
                  htmlType="button"
                  clickHandler={() => navigate(-1)}
                  className="btn-default btn-form-size mr-20 dropdown--scroll"
                />
                <Buttonx
                  btnText="Save"
                  loading={bool}
                  clickHandler={handleSubmit}
                  className="btn-primary btn-form-size"
                />
              </div>
            </div>
            {previewTemplate && (
              <PdfViewer
                pdfModal={previewTemplate}
                togglePdfModal={togglePdfModal}
                pdfUrl={`/sample-pdf/${previewTemplateSlug}`}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default PdfPreferences;
