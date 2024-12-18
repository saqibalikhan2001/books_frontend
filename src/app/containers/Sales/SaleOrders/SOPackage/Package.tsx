import { useCallback, useEffect, useState } from "react";
import { Button } from "antd";
import { endpoints } from "static";
import { EditPackage } from "./Edit";
import { SoPackageProps } from "./Types";
import { CreatePackage } from "./Create";
import { PackagesListing } from "./Listing";
import { AccessDenied, Toast } from "app/shared";
// import { CreateShipment } from "./PkShipmnet/Create";
import { useAxios, useBool, usePermissions } from "app/Hooks";

const { PACKAGES: PACKAGES_URL, PACKAGE_CREATE } = endpoints;

const SOPackages = ({ url, detail }: SoPackageProps) => {
  const [current, setCurrent] = useState({});
  // commented for purpose
  // const [packageId, setPackageId] = useState(null);
  // const [shipment, setShipment] = useState(false);
  const { checkPermission } = usePermissions();
  const { bool, toggle: toggleModal } = useBool();
  const [isCreate, setIsCreate] = useState(false);
  const [data, setData] = useState({
    hide_button: false,
    list: [],
  });
  const { bool: fetchList, toggle: refetch } = useBool();
  const { callAxios, toggle: loader, bool: loading } = useAxios();
  const { has_PackageView_permission } = checkPermission("PackageView");
  const { has_PackageEdit_permission } = checkPermission("PackageEdit");
  const { has_PackageCreate_permission } = checkPermission("PackageCreate");
  const { has_PackageDelete_permission } = checkPermission("PackageDelete");

  const handleClick = (data: any) => {
    setIsCreate(false);
    setCurrent(data);
    toggleModal();
  };

  const memoizeClick = useCallback(handleClick, [toggleModal]);
  const handleConfirm = (data: any) => {
    callAxios({
      method: "delete",
      url: `${PACKAGES_URL}/${data.id}`,
    }).then((res: any) => {
      if (res) {
        Toast({ message: res.message });
        refetch();
      }
    });
  };

  const memoizeConfirm = useCallback(
    handleConfirm,
    //eslint-disable-next-line
    []
  );

  // commented for purpose
  // const handleShipment = (data: any) => {
  //   setPackageId(data?.id);
  //   setShipment(true);
  //   toggleModal();
  // };

  const handleButton = () => {
    toggleModal();
    setIsCreate(true);
  };
  useEffect(() => {
    if (has_PackageView_permission) {
      loader();
      callAxios({
        url: url,
      }).then((res: any) => {
        setData({ ...data, list: res?.list, hide_button: res?.hide_button });
        loader();
      });
    }
    //eslint-disable-next-line
  }, [url, fetchList, has_PackageView_permission]);

  return (
    <>
      {has_PackageView_permission ? (
        <>
          <PackagesListing
            loading={loading}
            listing={data?.list || []}
            handleClick={memoizeClick}
            handleConfirm={memoizeConfirm}
            // handleShipment={handleShipment} commented for purpose
            has_permission={has_PackageDelete_permission}
          />
          {!data.hide_button && (
            <Button type="link" onClick={handleButton}>
              Create Now
            </Button>
          )}
        </>
      ) : (
        <AccessDenied />
      )}
      {bool && isCreate && (
        <CreatePackage
          bool={bool}
          refetch={refetch}
          SODetails={detail}
          toggleModal={toggleModal}
          has_permission={has_PackageCreate_permission}
          url={`${PACKAGE_CREATE}?sales_order_id=${detail?.id}`}
        />
      )}

      {bool && !isCreate && (
        <EditPackage
          bool={bool}
          refetch={refetch}
          SODetails={detail}
          pkgDetail={current}
          toggleModal={toggleModal}
          has_permission={has_PackageEdit_permission}
        />
      )}

      {/* {bool && shipment && (
        <CreateShipment
          bool={bool}
          refetch={refetch}
          package_id={packageId}
          toggleModal={toggleModal}
          url={`/shipments/create?package_id=${packageId}`}
        />
      )} */}
    </>
  );
};

export default SOPackages;
