/** @format */

import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Form, Typography } from "antd";
import type { InputRef } from "antd";
import { EmailProps } from "./types";
import { setKeyInSS } from "utils";
import { TooltipX } from "./ToolTip";
import { useAxios, useBool } from "app/Hooks";
import { Content, endpoints, routeNames } from "static";
import { Buttonx, ConfirmPopup, InputField, Selectx, Spinner, Toast } from "app/shared";
import {
  MAX_FILE_SIZE,
  attachementAllowedFormats,
  attachmentTypeToastMessage,
} from "./AllowedFormats";
const { INVOICES } = routeNames;
const allowedFormats = ["jpg", "jpeg", "png", "pdf", "doc", "docx", "csv"];

export const Email = ({ handleEmail, emailUrl = "", setEmail, refetch }: EmailProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { callAxios } = useAxios();
  const emailRef = useRef<InputRef>(null);
  const { bool, toggle } = useBool(false);
  const [value, setValue] = useState<any>();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [Filevalue, setFileValue] = useState<any>([]);
  const creditNoteId = searchParams.get("creditnoteid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultFlName, setdefaultFlName] = useState({});
  const invoiceId = searchParams.get("id");
  const pendingInvoiceId = searchParams.get("idd");
  const isFile = form.getFieldValue("defaultFileStatus");
  const filteredFiles = Filevalue.filter((file) => file.size);
  const MAX_SIZE = filteredFiles.reduce((sum, file) => (sum += file.size), 0);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleDefault = () => {
    toggleModal();
    handleEmail?.();
    sessionStorage.removeItem("email");
    pendingInvoiceId && navigate(INVOICES);
    invoiceId && navigate(-1);
    creditNoteId && navigate(-1);
  };
  useEffect(() => {
    setKeyInSS("params", "");
  }, []);

  useEffect(() => {
    callAxios({
      url:
        invoiceId ?? pendingInvoiceId
          ? `${endpoints.INVOICES}/${invoiceId ?? pendingInvoiceId}/mail`
          : creditNoteId
          ? `${endpoints.CREDIT_NOTES}/${creditNoteId}/mail`
          : emailUrl,
    }).then((res) => {
      if (res) {
        setValue(res);
        setLoading(false);
        setdefaultFlName(res.defaultFileName);
        setFileValue([{ name: res.defaultFileName }]);
        form.setFieldsValue({ defaultFileStatus: true });
      }
    });
    // eslint-disable-next-line
  }, [emailUrl]);

  useEffect(() => {
    if (value) {
      form.setFieldsValue({
        body: value?.body,
        subject: value?.subject,
        email: value?.contact_persons?.length > 0 ? value?.contact_persons[0]?.email : [],
      });
    }
  }, [form, value]);

  const submitEmail = (values) => {
    const formdata = new FormData();
    formdata.append(`body`, values.body);
    formdata.append("email", values.email);
    formdata.append("subject", values.subject);
    formdata.append("defaultFileStatus", isFile);

    for (let i = isFile ? 1 : 0; i < Filevalue.length; i++) {
      formdata.append(`files[${i}]`, Filevalue[i]);
    }
    toggle();
    callAxios({
      method: "post",
      data: formdata,
      url:
        invoiceId ?? pendingInvoiceId
          ? `${endpoints.INVOICES}/${invoiceId ?? pendingInvoiceId}/mail`
          : creditNoteId
          ? `${endpoints.CREDIT_NOTES}/${creditNoteId}/mail`
          : emailUrl,
    })
      .then((res) => {
        toggle();
        if (res) {
          setValue(res);
          if (!location?.search?.includes("id=")) {
            setEmail?.(false);
            sessionStorage.removeItem("email");
            refetch?.();
          }
          Toast({ message: "Email has been sent successfully", type: "success" });
          invoiceId && navigate(-1);
          pendingInvoiceId && navigate(INVOICES);
          creditNoteId && navigate(-1);
        }
      })
      .catch((error) => {
        Toast({ message: error.message, type: "error" });
        toggle();
      });
  };
  const hanldeAttachement = (e) => {
    const file = e.target.files[0];
    const currentFileType = file?.type;
    const currentFileSize = MAX_SIZE + file?.size;

    if (currentFileSize > MAX_FILE_SIZE) {
      e.target.value = "";
      Toast({
        message: "Attachment should be less than the allowed maximum Size i.e 5 MB.",
        type: "error",
      });
      return;
    }

    if (!attachementAllowedFormats.includes(currentFileType)) {
      e.target.value = "";
      Toast({
        message: attachmentTypeToastMessage,
        type: "error",
      });
      return;
    }

    setFileValue([...Filevalue, file]);
    e.target.value = "";
  };

  function handleRemove(i) {
    const newList = Filevalue.filter((file, index) => {
      file.name === value.defaultFileName && form.setFieldsValue({ defaultFileStatus: false });
      return index !== i;
    });
    setFileValue(newList);
    const defaultEx = newList?.find((file) => file?.size);
    const defaultFl = newList?.find((file) => file?.name === defaultFlName);
    const defaultExist = Boolean(defaultEx);

    const returnBool = () => {
      if (defaultFl && defaultExist) {
        return true;
      } else if (defaultFl && !defaultExist) {
        return true;
      } else if (!defaultFl && defaultExist) {
        return false;
      } else {
        return false;
      }
    };
    form.setFieldsValue({
      defaultFileStatus: returnBool(),
    });
  }
  const handleErrorSubmit = (err) => {
    if (err.errorFields.length) {
      if (emailRef.current !== null && !err.values.email) {
        emailRef.current.blur();
        // emailRef.current.focus();
      }
    }
  };

  //@ts-ignore
  const validateEmail = (rule, value, callback) => {
    const email_address = Array.isArray(value) ? value : [value];

    if (!value || (Array.isArray(email_address) && email_address.length === 0)) {
      callback("Email should not be empty");
      // emailRef.current?.focus()
    } else if (
      Array.isArray(email_address) &&
      email_address.every((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    ) {
      callback();
    } else {
      callback("Please enter valid email addresses");
    }
  };

  return (
    <>
      {loading ? (
        // <div style={{ marginTop: 30 }}>
        <div className="custom-spinner">
          <Spinner directionSize={"100%"} />
        </div>
      ) : (
        // </div>
        <div
          className={`__generic_content_side no-fix-height ${
            invoiceId ? "email-template-standalone" : ""
          } ${pendingInvoiceId ? "pending-popup--email" : ""}
          ${creditNoteId ? "email--template-wrapper" : ""}
          `}
        >
          <div className="pending-popup--inner">
            <div className={`send-email ${invoiceId ? "__items-details_container" : ""} `}>
              <Typography.Title className="email_heading" level={4}>
                Send email
              </Typography.Title>
            </div>
            <div>
              <div className="__items-details_container">
                <Form
                  form={form}
                  requiredMark={false}
                  onFinish={submitEmail}
                  onFinishFailed={handleErrorSubmit}
                  className="email_form __email-form--main"
                >
                  <div className="email_subject email-to--main">
                    <Typography.Text className="f--bold email-to-text">To </Typography.Text>
                    <Selectx
                      required
                      mode="tags"
                      name="email"
                      allowClear={false}
                      innerRef={emailRef}
                      // innerRef={emailRef}
                      placeholder="Enter emails"
                      className="email-subj-dropdown"
                      popupClassName="email_dropdown"
                      rules={[
                        {
                          required: true,
                          validator: validateEmail,
                        },
                      ]}
                      style={{
                        marginRight: "2px",
                        marginLeft: "70px",
                        marginTop: "10px",
                        padding: "8px",
                      }}
                    />
                  </div>
                  <div className="email_subject ">
                    <Typography.Text className="f--bold">Subject : </Typography.Text>
                    <InputField
                      name="subject"
                      className="subject_field"
                      placeholder="Enter subject"
                      // rules={rules({ message: "please fill data in this field" })}
                    />
                  </div>
                  <div className="attachment_list">
                    <Typography.Text className="f--bold">Attachments : </Typography.Text>
                    {Filevalue.map((file, i) => {
                      return (
                        <div className="attachment" key={i}>
                          <label style={{ textTransform: "none" }}>{`${file.name}`}</label>
                          <img
                            alt="delete"
                            className="cursor-pointer"
                            onClick={() => handleRemove(i)}
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/deleteqtyadjrow.svg`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <Form.Item name="body" className="email_editor">
                    <ReactQuill
                      theme="snow"
                      modules={modules}
                      formats={formats}
                      className="email_content"
                    />
                  </Form.Item>
                  <QuillToolbar />
                  <div className="button_flexbox">
                    <Buttonx
                      btnText="Send"
                      loading={bool}
                      className="btn-form-size btn-primary mr-20"
                    />
                    <Buttonx
                      btnText="Discard"
                      htmlType="button"
                      clickHandler={toggleModal}
                      className="btn-form-size btn-default mr-20 btn-discard"
                    />
                    <Form.Item name="files" className="upload_btn">
                      <label
                        htmlFor="myattachement"
                        style={{ cursor: Filevalue.length === 5 ? "not-allowed" : "pointer" }}
                      >
                        <TooltipX title="Attachments size cannot exceed 25MB, maximum 5 files">
                          <img
                            alt="attachment icon"
                            className="upload-icon hover-effect"
                            style={{ cursor: Filevalue.length === 5 ? "not-allowed" : "pointer" }}
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/attachment.svg`}
                          />
                        </TooltipX>
                        <input
                          type="file"
                          name="myfile"
                          id="myattachement"
                          style={{ display: "none" }}
                          onChange={hanldeAttachement}
                          disabled={Filevalue.length === 5}
                          accept=".png,.jpg,.jpeg,.pdf,.csv,.doc,.docx"
                        />
                      </label>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmPopup
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        text={Content.emailConfirm}
        handleConfirm={handleDefault}
      />
    </>
  );
};
export default Email;

const mySizelist = [
  "8px",
  "9px",
  "10px",
  "11px",
  "12px",
  "14px",
  "16px",
  "18px",
  "24px",
  "30px",
  "36px",
  "48px",
  "60px",
  "72px",
  "96px",
];
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path className="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9" />
  </svg>
);

const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path className="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5" />
  </svg>
);

function undoChange() {
  //@ts-ignore
  this.quill.history.undo();
}
function redoChange() {
  //@ts-ignore
  this.quill.history.redo();
}

var Size = Quill.import("attributors/style/size");
Size.whitelist = [
  "8px",
  "9px",
  "10px",
  "11px",
  "12px",
  "14px",
  "16px",
  "18px",
  "24px",
  "30px",
  "36px",
  "48px",
  "60px",
  "72px",
  "96px",
];
Quill.register(Size, true);

const Font = Quill.import("formats/font");
Font.whitelist = ["arial", "georgia", "comic-sans", "courier-new", "helvetica", "lucida", "impact"];
Quill.register(Font, true);

const isValidFileFormat = (fileName: string): boolean => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  return fileExtension ? allowedFormats.includes(fileExtension) : false;
};

function imageHandler() {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();
  input.onchange = async () => {
    const file = input.files ? input.files[0] : null;
    if (!isValidFileFormat(file?.name as any)) {
      Toast({
        message: attachmentTypeToastMessage,
        type: "error",
      });
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        //@ts-ignore
        const range = this.quill.getSelection();
        const img = reader.result; // base64 image
        //@ts-ignore
        this.quill.insertEmbed(range.index, "image", img); // Insert the image
      };
      reader.readAsDataURL(file);
    }
  };
}

export const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      image: imageHandler,
      undo: undoChange,
      redo: redoChange,
    },
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
};

export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "code-block",
];

export const QuillToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats">
      <select className="ql-header" defaultValue="1" title="Blocks type">
        <option value="1">Normal</option>
        <option value="2">H1</option>
        <option value="3">H2</option>
        <option value="4">H3</option>
      </select>

      <select className="ql-size" defaultValue="14">
        {mySizelist.map((size) => (
          <option value={size}>{parseInt(size)}</option>
        ))}
      </select>
      <select className="ql-font" defaultValue="arial" title="fonts">
        <option value="arial">Arial</option>
        <option value="georgia">Georgia</option>
        <option value="impact">Impact</option>
        <option value="comic-sans">Comic Sans</option>
        <option value="courier-new">Courier New</option>
        <option value="helvetica">Helvetica</option>
        <option value="lucida">Lucida</option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold" title="bold" />
      <button className="ql-italic" title="italic" />
      <button className="ql-underline" title="underline" />
      <button className="ql-strike" title="strike" />
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" title="Unordered" />
      <button className="ql-list" value="bullet" title="Ordered" />
      <button className="ql-indent" value="-1" title="Indent" />
      <button className="ql-indent" value="+1" title="Outdent" />
    </span>

    <span className="ql-formats">
      <select className="ql-align" title="Positions" />
      <select className="ql-color" title="color picker" />
    </span>
    <span className="ql-formats">
      <button className="ql-link" title="Link" />
      <button className="ql-image" title="Image" />
    </span>
    <span className="ql-formats">
      <button className="ql-blockquote" title="Blockquote" />
    </span>
    <span className="ql-formats">
      <button className="ql-code-block" title="Code-block" />
    </span>
    <span className="ql-formats">
      <button className="ql-undo" title="Undo">
        <CustomUndo />
      </button>
      <button className="ql-redo" title="Redo">
        <CustomRedo />
      </button>
    </span>
  </div>
);
