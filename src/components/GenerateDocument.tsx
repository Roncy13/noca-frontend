import PrintIcon from "@mui/icons-material/Print";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "../context/DocumentContext";

import { useNavigate } from "react-router-dom";
import { BASE_URL, generateSectionContent, updateLogoAndFont } from "../api";
import { IGenerateSectionContent } from "../types";
import { renderClauseHTML } from "../utils";
import Loader from "./Loader";

export default function GenerateDocment() {
  const navigate = useNavigate();

  const { formData, clearStorage } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<IGenerateSectionContent[]>([]);
  const [showPrint, setShowPrint] = useState(false);

  const [number, setNumber] = useState(0);
  const didRun = useRef(false);
  const setSectionContent = async (index: number) => {
    if (loading) {
      return;
    }
    setLoading(true);

    const outline = formData.sections[index];

    const result = await generateSectionContent({
      ...formData,
      no: index + 1,
      outline,
      supportingDetails: formData.questions.map(
        (r) => `${r.question} ${r.answer}`
      ),
    });

    setLoading(false);
    setSections([...sections, result]);
  };

  useEffect(() => {
    console.log(
      sections,
      " sections ",
      sections.length < formData.sections.length && sections.length > 0
    );
    if (sections.length < formData.sections.length && sections.length > 0) {
      console.log(sections.length, formData.sections.length, " ll");
      console.log("section set");
      setSectionContent(sections.length);
    }
    setNumber(sections.length);
  }, [sections]);

  useEffect(() => {
    if (didRun.current) return; // prevent re-run
    didRun.current = true;
    setSectionContent(number);
  }, []);

  useEffect(() => {
    if (sections.length > 0) {
      setShowPrint(true);
    }
  }, [formData, sections]);
  return (
    <Paper
      elevation={3}
      sx={{
        width: "70%",
        margin: "2rem auto",
        padding: "2rem",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        maxHeight: "100vh", // limit height of the paper
      }}
    >
      {/* Header */}
      <Box
        sx={{
          textAlign: "center",
          marginBottom: 3,
          paddingBottom: 1,
          borderBottom: "1px solid #ccc",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Generate Document
        </Typography>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row", // put items in one line
            justifyContent: "left", // center horizontally
            alignItems: "center", // center vertically
            textAlign: "center",
            marginBottom: 3,
            paddingBottom: 1,
            borderBottom: "1px solid #ccc",
            gap: 1, // space between text and loader
          }}
        >
          <Typography variant="body1">
            {`Generating section no: ${number + 1}`}
          </Typography>
          <Loader />
        </Box>
      ) : (
        <></>
      )}
      {/* Logo */}
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <img
          src={formData.logo}
          alt={"Your Logo"}
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </Box>
      {/* Scrollable Content */}
      <Box
        sx={{
          overflowY: "auto", // makes it scrollable
          maxHeight: "60vh", // adjust as needed
          paddingRight: 1, // optional, prevent scrollbar overlap
        }}
      >
        {sections.map((form, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            mb={2} // spacing between sections
          >
            <Typography
              component="div"
              fontFamily={formData.fontFamily}
              dangerouslySetInnerHTML={{
                __html: renderClauseHTML(form, index),
              }}
            />
            <Divider sx={{ width: "100%" }} />
          </Box>
        ))}
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={() => {
            clearStorage();
            setTimeout(() => {
              navigate("/");
            }, 500);
          }}
        >
          Return to Home
        </Button>
        {showPrint ? (
          <Button
            type="button"
            variant="contained"
            color="success"
            startIcon={<PrintIcon />}
            onClick={async () => {
              await updateLogoAndFont(formData.fontFamily, formData.logo);
              window.open(`${BASE_URL}/documents/documentPrint`, "_blank");
            }}
          >
            Print
          </Button>
        ) : (
          <></>
        )}
      </Box>
    </Paper>
  );
}
