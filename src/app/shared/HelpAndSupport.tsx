import { IoIosChatboxes, IoIosCloseCircle, IoMdSwitch } from "react-icons/io";
import { PiWhatsappLogoDuotone } from "react-icons/pi";
import { FaHandshakeAngle } from "react-icons/fa6";
import { AiOutlineMail } from "react-icons/ai";
import { useEffect, useState } from "react";
import { FaQuestion } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { Drawer, Input } from "antd";
import UserManual from "./Header/Usermanual";

export const HelpAndSupport = ({ closeDrawer, isDrawerOpen }) => {
  const [showHelplisting, setHelplisting] = useState(false);
  const handleHelpdocuments = () => {
    setHelplisting(true);
  };
  return (
    <Drawer
      width={300}
      zIndex={500}
      placement="right"
      open={isDrawerOpen}
      onClose={closeDrawer}
      style={{ color: "black" }}
      className="help_support_sidebar"
      contentWrapperStyle={{
        top: "60px",
      }}
      title={
        <div className="heading_inner" style={{ marginTop: "0" }}>
          Help & Support
          <span className="horizontal_line"></span>
        </div>
      }
    >
      <>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
          className="help_support_list"
        >
          <a
            className="hover_style"
            onClick={handleHelpdocuments}
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "75px",
              backgroundColor: "transparent",
            }}
          >
            <FaHandshakeAngle style={{ width: 20, height: "30px", marginBottom: "5px" }} />

            <div className="text_column">Help Documents</div>
          </a>

          <a
            target="_blank"
            className="hover_style"
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "75px",
              backgroundColor: "transparent",
            }}
            href="https://www.seebiz.cloud/inventory/contact-us/"
          >
            <FaQuestion style={{ width: 15, height: "30px", marginBottom: "5px" }} />
            <div className="text_column">FAQ</div>
          </a>
        </div>

        {!showHelplisting && (
          <>
            <div
              className="help_support_list"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <a
                target="_blank"
                className="hover_style"
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: "75px",
                  backgroundColor: "transparent",
                }}
                href="https://www.seebiz.cloud/inventory/contact-us/"
              >
                <IoMdSwitch style={{ width: 20, height: "30px", marginBottom: "5px" }} />
                <div className="text_column">Migration Guide</div>
              </a>
              <a
                target="_blank"
                className="hover_style"
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: "75px",
                  backgroundColor: "transparent",
                }}
                href="https://www.seebiz.cloud/inventory/user-manual/how-to-register-with-seebiz-inventory/"
              >
                <TbWorld style={{ width: 20, height: "30px", marginBottom: "5px" }} />
                <div className="text_column">Product Tour</div>
              </a>
            </div>
            <div className="content_container">
              <div className="heading_inner">
                <h5>Need Assistance?</h5>
                <span className="horizontal_line"></span>
              </div>
              <div style={{ width: "100%", marginBottom: "10px" }}>
                <a
                  target="_blank"
                  className="assistance"
                  style={{
                    color: "#161616",
                    width: "100%",
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                    height: "50px",
                    backgroundColor: "transparent",
                  }}
                  href="https://www.seebiz.cloud/inventory/contact-us/"
                >
                  <IoIosChatboxes style={{ width: 20, height: "20px", marginRight: "15px" }} />
                  <div className="text_area">Chat With Our Experts</div>
                </a>
                <a
                  className="assistance"
                  style={{
                    width: "100%",
                    color: "#161616",
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                    height: "50px",
                    backgroundColor: "transparent",
                  }}
                  href="mailto:info@seebiz.cloud"
                >
                  <AiOutlineMail style={{ width: 20, height: "20px", marginRight: "15px" }} />

                  <div className="text_area">Send Email</div>
                </a>
              </div>
              <div className="heading_inner">
                <h5>Video Tutorials</h5>
                <span className="horizontal_line"></span>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <a
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "75px",
                    backgroundColor: "transparent",
                    transition: "background-color 0.3s",
                  }}
                  target="_blank"
                  href="https://www.youtube.com/watch?v=nzA65-Au0Uc"
                >
                  <img
                    alt="help--icon"
                    style={{ width: "80%", marginBottom: "5px" }}
                    src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/help_section/thumb_item.png"
                  />
                </a>
                <a
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "75px",
                    backgroundColor: "transparent",
                  }}
                  target="_blank"
                  href="https://www.youtube.com/watch?v=7fruK9bGEdI&ab_channel=SeeBizInventory"
                >
                  <img
                    alt="help--icon"
                    style={{ width: "80%", marginBottom: "5px" }}
                    src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/help_section/thumb_contact.png"
                  />
                </a>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <a
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "75px",
                    backgroundColor: "transparent",
                  }}
                  target="_blank"
                  href="https://www.youtube.com/watch?v=-wl3Rt2UCTM&ab_channel=SeeBizInventory"
                >
                  <img
                    alt="help--icon"
                    style={{ width: "80%", marginBottom: "5px" }}
                    src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/help_section/thumb_saleorder.png"
                  />
                </a>
                <a
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "75px",
                    backgroundColor: "transparent",
                  }}
                  target="_blank"
                  href="https://www.youtube.com/watch?v=VanjBMN14IE&ab_channel=SeeBizInventory"
                >
                  <img
                    style={{ width: "80%", marginBottom: "5px" }}
                    src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/help_section/thumb_invoice.png"
                    alt="notification--icon"
                  />
                </a>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <a
                  href="https://www.youtube.com/playlist?list=PLrNraRgjv2ipX3nY1Rr-3yGKSukDDj-Gw"
                  target="_blank"
                >
                  View More Videos
                </a>
              </div>
              <div style={{ marginTop: "10px" }}>
                <div className="heading_inner">
                  <h5>Ring Us</h5>
                  <span className="horizontal_line"></span>
                </div>
                <p>Anytime between Monday - Friday</p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <PiWhatsappLogoDuotone style={{ width: 20, height: 20, marginRight: "10px" }} />
                  <a
                    href="tel:(+1) 2139869911"
                    style={{ margin: "0", color: "#161616", fontWeight: "700" }}
                  >
                    +1 213 986 9911
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </>

      {showHelplisting && <ShowDocumentationDetails setHelplisting={setHelplisting} />}
    </Drawer>
  );
};
const ShowDocumentationDetails = ({ setHelplisting }) => {
  const [filterData, setFilterData] = useState(UserManual);
  const [Filter, setFilterSearch] = useState("");
  useEffect(() => {
    const reuslt = UserManual.filter((data) => {
      return Object.keys(data).some(() =>
        data["label"].toLowerCase().includes(Filter.trim().toLowerCase())
      );
    });
    setFilterData(reuslt);
  }, [Filter]);
  return (
    <>
      <div className="user_manual">
        <div className="d-flex user_manual_header w-100 info">
          <span>User Manual</span>
          <button
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
            onClick={() => setHelplisting(false)}
          >
            {<IoIosCloseCircle style={{ width: 24, height: "24px" }} />}
          </button>
          {/* <Buttonx
            clickHandler={() => setHelplisting(false)}
            htmlType="button"
            btnText={""}
            className="btn-form-size btn-primary"
            icon={<RxCross2 size={15} />}
          /> */}
        </div>
        <Input
          allowClear
          name="search"
          // addonBefore={selectBefore}
          onChange={(e) => setFilterSearch(e.target.value)}
          placeholder="Search here..."
          className="search_box no-transition"
          suffix={
            <img
              alt="search==here"
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/search.svg`}
            />
          }
        />

        <div className="options-- float-left w-100">
          {filterData.map((doc) => (
            <>
              <div className="user_manual_options">
                <a target="_blank" href={`//${doc.url}`} rel="noopener noreferrer">
                  <span>{doc.value}</span>

                  <span style={{ marginLeft: "10px" }}>{doc.label}</span>
                </a>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
};
