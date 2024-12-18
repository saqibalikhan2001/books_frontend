/**@format */

import { useMemo } from "react";
import { setKeyInSS, getKeyFromSS, getKeyFromLS, deleteKeyFromLS } from "utils";

export const usePersistItemDetail = (
  handleFullScreen: (bool: boolean) => void,
  bulkDeleteFalse: () => void,
  deleteBulkItem: boolean = false
) => {
  const once = getKeyFromLS("once") ?? false;
  const once_ss = getKeyFromSS("once") ?? false;
  const local_obj = getKeyFromLS("obj");
  const session_obj = JSON.parse(getKeyFromSS("obj"));

  useMemo(() => {
    if (local_obj && !sessionStorage.length) {
      let obj = {
        once: local_obj.once,
        module_name: "",
        curr_id: local_obj.curr_id,
        prev_id: null,
        next_id: null,
      };
      setKeyInSS("once", once);
      setKeyInSS("obj", JSON.stringify(obj));
      handleFullScreen(true);
    }
  }, [once, local_obj, handleFullScreen]);

  const getCurrentObj = (paymentReceived: boolean = false, data: any) => {
    const data2 = data?.find((item: { id: number; payment_no: string }) =>
      paymentReceived
        ? session_obj?.prev_id
          ? session_obj?.prev_id === item.payment_no
          : session_obj?.next_id === item.payment_no
        : session_obj?.prev_id
        ? session_obj?.prev_id === item.id
        : session_obj?.next_id === item.id
    );
    return data2;
  };

  const handleSessionState = (data: any, moduleName: string, paymentReceived?: boolean) => {
    if ((deleteBulkItem || (once && !deleteBulkItem)) && data?.data?.length === 0 && once_ss) {
      sessionStorage.clear();
      deleteKeyFromLS("once");
      deleteKeyFromLS("obj");
      handleFullScreen(false);
    }
    if (deleteBulkItem && data?.data?.length !== 0 && once_ss) {
      let current_obj = {
        once: true,
        module_name: `/${moduleName}`,
        curr_id: null,
        prev_id: null,
        next_id: null,
      };
      const obj = getCurrentObj(paymentReceived, data?.data);
      if (obj) {
        current_obj = {
          ...current_obj,
          curr_id: obj.id,
        };
        setKeyInSS("obj", JSON.stringify(current_obj));
        localStorage.setItem("obj", JSON.stringify(current_obj));
      } else if (!obj) {
        current_obj = {
          ...current_obj,
          curr_id: paymentReceived ? data?.data[0]?.payment_no : data?.data[0]?.id,
        };
        setKeyInSS("obj", JSON.stringify(current_obj));
        localStorage.setItem("obj", JSON.stringify(current_obj));
      }
      localStorage.setItem("once", JSON.stringify(true));
      setKeyInSS("once", true);
      handleFullScreen(true);
      bulkDeleteFalse();
    }
  };

  return { handleSessionState };
};
