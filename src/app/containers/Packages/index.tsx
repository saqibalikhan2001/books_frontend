/** @format */

import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { Alert, Col, Row } from "antd";
import DetailPage from "./DetailPage";
import { SubHeader } from "./SubHeader";
import RenderProps from "app/RenderProps";
import { AccessDenied } from "app/shared";
import { PackagesListing } from "./Listing";
import { endpoints, routeNames } from "static";
import { useGetPackagesListingQuery } from "store/query/packages";
import { useAxios, usePermissions, useSearchParam, useSharedOrganization } from "app/Hooks";

const { PACKAGES } = endpoints;
const { EDIT_PACKAGE } = routeNames;
const Packages = () => {
  const navigate = useNavigate();
  const { bool, handleConfirm } = useAxios();
  const { checkPermission } = usePermissions();
  const { total, getParams, setTotal } = useSearchParam("");
  const { has_PackageView_permission } = checkPermission("PackageView");
  const { getCurrentModule, checkModulePermission } = useSharedOrganization();
  const { status = true } = getCurrentModule("Package") || {};

  const {
    data = [],
    refetch,
    isLoading,
  } = useGetPackagesListingQuery(getParams(), {
    refetchOnMountOrArgChange: true,
    skip: !has_PackageView_permission || checkModulePermission("Package"),
  });

  useEffect(() => {
    setTotal(data?.total);
  }, [setTotal, data?.total]);

  const handleClick = (data: any) => navigate(`${EDIT_PACKAGE}?id=${data.id}`);

  const memoizeClick = useCallback(handleClick, [navigate]);
  const memoizeConfirm = useCallback(
    (params) => handleConfirm(params, PACKAGES, refetch),
    [handleConfirm, refetch]
  );

  return (
    <RenderProps
      render={({ fullScreen, handleFullScreen, memoizeHandleClick, detail }) => (
        <>
          {has_PackageView_permission ? (
            <>
              {!status && (
                <Alert
                  showIcon
                  // closable
                  type="info"
                  message="Module Permissions"
                  description="Please Enable Module Permissions To See Details"
                />
              )}
              <SubHeader enable={!status} />

              <Row>
                <Col span={fullScreen ? 10 : 24}>
                  <PackagesListing
                    total={total}
                    showDetail={fullScreen}
                    listing={data?.data || []}
                    handleClick={memoizeClick}
                    loading={bool || isLoading}
                    handleConfirm={memoizeConfirm}
                    handleViewClick={memoizeHandleClick}
                  />
                </Col>

                {fullScreen && (
                  <>
                    <Col span={14}>
                      <DetailPage detail={detail} handleFullScreen={handleFullScreen} />
                    </Col>
                  </>
                )}
              </Row>
            </>
          ) : (
            <AccessDenied />
          )}
        </>
      )}
    />
  );
};

export default Packages;
