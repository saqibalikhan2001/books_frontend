/**@format */

import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
//@ts-ignore
import { getBooleanValueFromSS, setSessionAndLocalObj, getKeyFromSS, setKeyInLS } from "utils";
// import { useLoading } from "./useLoading";

export const useDetailPage = () => {
  const location = useLocation();
  const once = JSON.parse(localStorage.getItem("once") as any);
  const [detail, setDetail] = useState<any>();
  // const [bool, setFalse, setTrue] = useLoading();
  const [bool, setbool] = useState(false);
  const [fullScreen, setFullScreen] = useState(once || false);

  const handleFullScreen = useCallback((fullScreen: boolean) => setFullScreen(fullScreen), []);

  const handleClick = (detail: any, listing: any, paymentReceived?: boolean) => {
    setKeyInLS("email", false);
    const dataFromLS = JSON.parse(getKeyFromSS("obj"));
    const { id, payment_no } = detail;
    if (dataFromLS?.curr_id === id || dataFromLS?.curr_id === payment_no) setbool(false);
    else setbool(true);

    const current = listing.findIndex((item: { id: number; payment_no: string }) =>
      paymentReceived ? item.payment_no === payment_no : item.id === id
    );
    const prev_id =
      (paymentReceived ? listing[current - 1]?.payment_no : listing[current - 1]?.id) || null;
    const next_id =
      (paymentReceived ? listing[current + 1]?.payment_no : listing[current + 1]?.id) || null;
    setSessionAndLocalObj(
      paymentReceived ? payment_no : id,
      true,
      `${location.pathname}`,
      prev_id,
      next_id
    );
    setDetail(detail);
    !fullScreen && setFullScreen(true);
  };
  const memoizeHandleClick = useCallback(
    handleClick,
    //eslint-disable-next-line
    [fullScreen]
  );

  return { fullScreen, handleFullScreen, detail, memoizeHandleClick, setbool, bool, setDetail };
};
