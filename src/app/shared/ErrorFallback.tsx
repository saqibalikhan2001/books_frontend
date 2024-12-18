/** @format */

import { FallbackProps } from "react-error-boundary";
import { Link } from "react-router-dom";
//@ts-ignore
export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h1 style={{ fontSize: "250px", color: "black" }}>OOPS !</h1>
        {/* <pre>{error.message}</pre> */}
        <p style={{ color: "black" }}>
          An Error has occured. We have been notified. Go <Link to="/dashboard">DashBoard</Link>
        </p>
        {/* <button onClick={resetErrorBoundary}>Try again</button> */}
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={`https://www.seebiz.cloud/inventory/contact-us/`}
        >
          Contact us
        </a>
      </div>
    </div>
  );
};
