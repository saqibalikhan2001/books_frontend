/** @format */

import { useCallback, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert } from "antd";
import { endpoints, routeNames } from "static";
import DetailPage from "../Customers/DetailPage";
import { SpinnerX } from "app/shared/PageLoader";
import { SubHeader } from "../Customers/SubHeader";
import { CustomerListing } from "../Customers/Listing";
import { BillIconListing, ContactFlowDiagram } from "assets/svg";
import { useGetSuppliersListingQuery } from "store/query/customers";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { getKeyFromSS, handletoggle, setSessionAndLocalObj } from "utils";
import { AccessDenied, ErrorFallback, Onboarding, SearchAlert, Spinner, Toast } from "app/shared";
import { useAxios, useDetailPage, usePermissions, useSharedOrganization } from "app/Hooks";

const { SUPPLIERS } = endpoints;
const { EDIT_SUPPLIER } = routeNames;

const Suppliers = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(false);
  const [loader, setLoader] = useState(false);
  const { bool, callAxios, toggle } = useAxios();
  const [products, setProducts] = useState<any>([]);
  const [emailLoading, setEmailLoading] = useState(false);
  const [customLoading, setcustomLoading] = useState(false);
  const { checkPermission, fetchingRoles } = usePermissions();

  const { getCurrentModule } = useSharedOrganization();
  const { has_SupplierView_permission } = checkPermission("SupplierView");
  const { paginate, handlePagination, Next } = useCustomPagination("contacts");
  const { status = true } = getCurrentModule("contact") || {};
  const {
    detail,
    setbool,
    fullScreen,
    setDetail,
    bool: loading,
    handleFullScreen,
    memoizeHandleClick,
  } = useDetailPage();
  const sidebarPosition = useSelector((state: any) => state.sidebarReducer);

  const { data, refetch, isFetching } = useGetSuppliersListingQuery(
    { paginate, sidebarPosition },
    {
      refetchOnMountOrArgChange: true,
      skip: !has_SupplierView_permission || !status,
    }
  );

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);

  useEffect(() => {
    handlePagination({ ...paginate, page: 1 });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isFetching) setLoader(false);
  }, [isFetching]);

  const alertUser = () => {
    const params = {
      ...paginate,
      page: 1,
    };
    sessionStorage.setItem("params", JSON.stringify(params));
  };

  useEffect(() => {
    if (paginate.page === 1) {
      setProducts(data?.contacts.data);
    } else {
      //@ts-ignore
      setProducts([...products, ...data?.contacts?.data]);
    }
    //eslint-disable-next-line
  }, [data?.contacts.data]);

  const handleClick = (contact: any) => {
    setSessionAndLocalObj(contact?.id, true, "/suppliers");
    navigate(`${EDIT_SUPPLIER}?id=${contact.id}`);
  };

  const memoizeClick = useCallback(handleClick, [navigate]);
  const memoizeConfirm = useCallback(
    (curr: any) => {
      const dataFromLS = JSON.parse(getKeyFromSS("obj"));
      const currentIndex = products.findIndex((data) => data?.id === curr?.id);
      toggle();
      callAxios({
        method: "delete",
        url: `${SUPPLIERS}/${curr.id}`,
      }).then((res) => {
        if (res) {
          if (curr?.id === detail?.id) setDetail(null);
          Toast({ message: res.message });
          refetch();
          if (products.length > 1) {
            setSessionAndLocalObj(
              products[currentIndex + 1]?.id
                ? products[currentIndex + 1]?.id
                : products[currentIndex - 1]?.id,
              dataFromLS?.once ? dataFromLS?.once : false,
              "/suppliers",
              null,
              null
            );
          } else {
            setSessionAndLocalObj("", false, "/suppliers", null, null);
            handletoggle(handleFullScreen);
            setProducts([]);
          }
        }
      });
    },
    //eslint-disable-next-line
    [products, refetch, detail]
  );
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      <SearchAlert
        description={["Display Name", "First Name", "Last Name", "Company Name", "Phone"]}
      />
      {!status ? (
        <Alert
          showIcon
          // closable
          type="info"
          message="Module Permissions"
          description="Please Enable Module Permissions To See Details"
        />
      ) : (
        <>
          {!has_SupplierView_permission ? (
            <AccessDenied />
          ) : status ? (
            <>
              {customLoading || bool || (!loader && isFetching) ? (
                <Spinner directionSize={"91.6vh"} />
              ) : !data?.show_onboard_screen ? (
                <>
                  {products && (
                    <div
                      className="customer_detail_listing supplier--details"
                      style={{
                        animation: "fadeInLeft",
                        animationDuration: "0.3s",
                      }}
                    >
                      <>
                        {!fullScreen && (
                          <SubHeader
                            supplier
                            enable={!status}
                            noData={(data?.contacts?.data.length as any) > 0 ? false : true}
                          />
                        )}
                        <div className={fullScreen ? "scrollbar_container" : ""}>
                          {!loading && (
                            <div className={!fullScreen ? "full_screen" : "list"}>
                              {data?.contacts && (
                                <CustomerListing
                                  supplier
                                  next={Next}
                                  listing={data}
                                  status={status}
                                  loader={loader}
                                  refetch={refetch}
                                  setEmail={setEmail}
                                  products={products}
                                  loading={isFetching}
                                  pagination={paginate}
                                  setLoader={setLoader}
                                  showDetail={fullScreen}
                                  setProducts={setProducts}
                                  handleClick={memoizeClick}
                                  setparam={handlePagination}
                                  handleConfirm={memoizeConfirm}
                                  setEmailLoading={setEmailLoading}
                                  sidebarPosition={sidebarPosition}
                                  setcustomLoading={setcustomLoading}
                                  handleFullScreen={handleFullScreen}
                                  handleViewClick={memoizeHandleClick}
                                />
                              )}
                            </div>
                          )}

                          {fullScreen && (
                            <>
                              <div className="content_side __item--conent-side">
                                {data?.contacts && (
                                  <ErrorBoundary
                                    FallbackComponent={ErrorFallback}
                                    onReset={() => null}
                                  >
                                    <DetailPage
                                      supplier
                                      email={email}
                                      detail={detail}
                                      loading={loading}
                                      setFalse={setbool}
                                      setEmail={setEmail}
                                      emailLoading={emailLoading}
                                      handleConfirm={memoizeConfirm}
                                      handleFullScreen={handleFullScreen}
                                    />
                                  </ErrorBoundary>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    </div>
                  )}
                </>
              ) : (
                <Onboarding
                  name="Suppliers"
                  videoFrame={
                    <iframe
                      width="700"
                      height="400"
                      frameBorder="0"
                      allowFullScreen
                      title="YouTube video player"
                      src="https://www.youtube.com/embed/7fruK9bGEdI"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  }
                  headerTitle="Suppliers"
                  buttonLabel=" Create Supplier"
                  DisplayIcon={BillIconListing}
                  FlowDiagram={ContactFlowDiagram}
                  buttonLink={routeNames.ADD_SUPPLIER}
                  description="Create and manage your supplier contacts here"
                />
              )}
            </>
          ) : null}
        </>
      )}
    </>
  );
};
export default Suppliers;
