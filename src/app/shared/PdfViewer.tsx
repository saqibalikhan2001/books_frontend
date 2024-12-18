/** @format */

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { useAxios } from "app/Hooks";
import { Spinner } from "./PageLoader";
import { removeKeyFromSS } from "utils";
import { Buttonx } from "./Button";

export const PdfViewer = ({ pdfUrl, pdfModal, togglePdfModal }: any) => {
  const { callAxios } = useAxios();
  const [pdf, setPdf] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    callAxios({
      url: pdfUrl,
    }).then((res) => {
      setPdf(res);
      setLoading(false);
    });
  }, [pdfUrl]);

  const PDFtitle = () => (
    <div className="justify_between d-flex new_prod_btn mr-30 pdf--popup">
      <div>PDF viewer</div>
      <div>
        <Buttonx
          className="btn-primary"
          btnText="Open PDF in new windows"
          disabled={loading}
          clickHandler={() => {
            let pdfWindow: any = window.open("", "_blank", "pdf");
            pdfWindow.document.write(
              "<iframe title='pdf' style='border: none' width='100%' height='100%'" +
                " src='data:application/pdf;base64, " +
                encodeURI(pdf) +
                "'></iframe>"
            );
          }}
        />
      </div>
    </div>
  );

  return (
    <Modal
      centered
      width={1000}
      footer={null}
      destroyOnClose
      open={pdfModal}
      style={{ top: 0 }}
      title={<PDFtitle />}
      className="estimate_lg_modal"
      // className="estimate_md_modal"
      wrapClassName="generic_modal_style pdf-popup--main"
      bodyStyle={{
        height: "100%",
      }}
      onCancel={() => {
        togglePdfModal();
        removeKeyFromSS("print");
      }}
    >
      {loading ? (
        <Spinner />
      ) : (
        <object
          data={`data:application/pdf;base64,${pdf}`}
          type="application/pdf"
          style={{ width: "100%", height: "75vh" }}
          aria-label="pdf"
        />
      )}
    </Modal>
  );
};
