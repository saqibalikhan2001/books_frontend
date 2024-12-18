/** @format */

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
// import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { PersistGate } from "reduxjs-toolkit-persist/integration/react";
import { MainLayout } from "app/Layout";
import { store, persistor } from "./store/store";
// import { AuthProvider } from "./Context";
import { Antd_theme_provider } from "./Antd_theme_provider";
import { Container, Spinner } from "app/shared";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";

export const App = () => (
  <>
    <BrowserRouter>
      {/* <AuthProvider> */}
      <Provider store={store}>
        <PersistGate loading={<Spinner directionSize={"100vh"} />} persistor={persistor}>
          <Antd_theme_provider>
            <MainLayout />
          </Antd_theme_provider>
        </PersistGate>
      </Provider>
      {/* </AuthProvider> */}
    </BrowserRouter>
    <Container />
  </>
);
