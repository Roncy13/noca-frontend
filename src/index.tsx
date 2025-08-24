import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import {
  AskWhatToCreate,
  FollowupQuestions,
  GenerateDocument,
} from "./components";
import { FormProvider } from "./context/DocumentContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <FormProvider>
              <AskWhatToCreate />
            </FormProvider>
          }
        />
        <Route
          path="/followup-question"
          element={
            <FormProvider>
              <FollowupQuestions />
            </FormProvider>
          }
        />
        <Route
          path="/generate-document"
          element={
            <FormProvider>
              <GenerateDocument />
            </FormProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
