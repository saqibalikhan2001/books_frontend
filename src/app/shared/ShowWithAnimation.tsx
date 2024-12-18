import { useDelayUnmount } from "app/Hooks";
import "./style.css";

export const ShowWithAnimation = ({ children, isMounted }) => {
  const showDiv = useDelayUnmount(isMounted, 850);
  const mountedStyle = { animation: "inAnimation  .4s ease-in" };
  const unmountedStyle = {
    animation: "outAnimation .9s",
    // animationFillMode: "forwards",
  };
  return <>{showDiv && <div style={isMounted ? mountedStyle : unmountedStyle}>{children}</div>}</>;
};
