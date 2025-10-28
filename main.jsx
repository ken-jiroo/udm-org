import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import { EventsProvider } from "./context/EventsContext.jsx";
import { ApplicationsProvider } from "./context/ApplicationsContext.jsx";

// ...
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProfileProvider>
        <EventsProvider>
          <ApplicationsProvider>
            <App />
          </ApplicationsProvider>
        </EventsProvider>
      </ProfileProvider>
    </BrowserRouter>
  </React.StrictMode>
);
