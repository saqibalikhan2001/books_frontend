/** @format */

import { Suspense } from "react";
import { useStore } from "app/Hooks";
import { RouterConfig } from "./routes";
import { SpinnerX } from "app/shared/PageLoader";

export const AppRoutes = () => {
  const { id_token = "", access_token = "" } = useStore();

  const auth = Boolean(id_token || access_token);

  const routeConfig = (
    <Suspense fallback={<SpinnerX />}>
      <RouterConfig auth={auth} />
    </Suspense>
  );

  return <>{routeConfig}</>;
};
