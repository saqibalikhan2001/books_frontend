/**@format */

import { useCallback, useState } from "react";
import { getBooleanValueFromSS, setKeyInSS } from "utils";

const RenderProps = ({ render }) => {
  const once = getBooleanValueFromSS("once");
  const [detail, setDetail] = useState<any>();
  const [fullScreen, setFullScreen] = useState(once || false);

  const handleFullScreen = useCallback((state: boolean) => setFullScreen(state), []);

  const handleClick = (detail: any) => {
    const { id, payment_no } = detail;

    setKeyInSS("id", id || payment_no);
    setKeyInSS("once", true);
    localStorage.setItem("id", id || payment_no);
    localStorage.setItem("once", JSON.stringify(true));
    setDetail(detail);
    !fullScreen && setFullScreen(true);
  };
  const memoizeHandleClick = useCallback(handleClick, [fullScreen]);

  return render({ fullScreen, handleFullScreen, detail, memoizeHandleClick });
};

export default RenderProps;
