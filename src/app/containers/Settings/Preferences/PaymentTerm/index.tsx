/** @format */

import { useState } from "react";
import { Breadcrumbx, Toast } from "app/shared";
import { useGetPaymentTermsQuery } from "store/query/paymentTerm";
import { Listing } from "./Listing";
import { CreatePaymentTerm } from "./Create";
import { EditPaymentTerm } from "./Edit";
import { useAxios, useBool } from "app/Hooks";
import { Button } from "antd";

export const PaymentTerm = () => {
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(false);
  const { bool = false, toggle } = useBool();
  const { callAxios } = useAxios();

  const { data, refetch, isFetching } = useGetPaymentTermsQuery("", {
    refetchOnMountOrArgChange: true,
  });
  const handleToggle = () => setPaymentModal(!paymentModal);
  const handleClick = (data) => {
    setPaymentData(data);
    handleToggle();
  };

  const handleConfirm = (data) => {
    callAxios({
      method: "delete",
      url: `/terms/${data.id}`,
    }).then((res) => {
      toggle();
      Toast({ message: res.message });
      refetch();
    });
  };
  return (
    <>
      <div className="main_wrapper">
        <div className="d-flex justify_between">
          <Breadcrumbx name="Payment Terms" className="navigate" setting={true} show />
          <div className="back-btn align-self-center">
            <Button key="1" className="d-flex align-center btn-primary" onClick={handleToggle}>
              <img
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_2x.svg`}
                className="mr-5 required_clr--white"
                alt="plus icon"
              />
              Add New
            </Button>
          </div>
        </div>
        <div className="cat-pagination">
          {data?.length && (
            <Listing
              data={data}
              isFetching={isFetching}
              handleClick={handleClick}
              handleConfirm={handleConfirm}
            />
          )}
        </div>
        {!(paymentData && Object.keys(paymentData).length) && (
          <CreatePaymentTerm
            pref
            setPaymentData={setPaymentData}
            paymentModal={paymentModal}
            handleToggle={handleToggle}
            refetch={refetch}
            toggle={toggle}
            bool={bool}
          />
        )}
        {paymentData && Object.keys(paymentData).length && (
          <EditPaymentTerm
            setPaymentData={setPaymentData}
            paymentModal={paymentModal}
            handleToggle={handleToggle}
            refetch={refetch}
            toggle={toggle}
            current={paymentData}
            bool={bool}
          />
        )}
      </div>
    </>
  );
};
