/* eslint-disable react-refresh/only-export-components */
import React from "react";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import '@trussworks/react-uswds/lib/index.css'
import { BrowserRouter as Router } from "react-router-dom"
import LoadingOverlay from "./Application/sharedComponents/loadingOverlay";
import { AuthenticationResult, EventMessage, EventType, PublicClientApplication } from "@azure/msal-browser";
import App from "./App";
import { msalConfig } from "./Presentation/utils/authConfig";
import { MsalProvider } from "@azure/msal-react";


export const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
          const payload = event.payload as AuthenticationResult;
          const account = payload.account;
          msalInstance.setActiveAccount(account);
      }
  });
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <React.Suspense fallback={<LoadingOverlay />}>
      <MsalProvider instance={msalInstance}>
        <Router>
          <App />
        </Router>
      </MsalProvider>
    </React.Suspense>
  // </React.StrictMode>
);
