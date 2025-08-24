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
    <FormProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AskWhatToCreate />} />
          <Route path="/followup-question" element={<FollowupQuestions />} />
          <Route path="/generate-document" element={<GenerateDocument />} />
        </Routes>
      </BrowserRouter>
    </FormProvider>
  </React.StrictMode>
);
