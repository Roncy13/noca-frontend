import React, { useEffect, useState } from "react";
import { useFormContext } from "../context/DocumentContext";
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import Loader from "./Loader";
import { generateSectionContent } from "../api";
import { IGenerateSectionContent } from "../types";
import { renderClauseHTML } from "../utils";

export default function GenerateDocment() {
  const { formData, setFormData } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<IGenerateSectionContent[]>([]);

  const [number, setNumber] = useState(0);

  const setSectionContent = async (index: number) => {
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
    setSections([...sections, result]);
    setLoading(false);
    if (number < formData.sections.length) {
      setNumber(number + 1);
    }
  };

  //   useEffect(() => {
  //     console.log(number, "dsada");
  //     if (!loading) {
  //       setSectionContent(number);
  //     }
  //   }, [number]);
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
            justifyContent: "center", // center horizontally
            alignItems: "center", // center vertically
            textAlign: "center",
            marginBottom: 3,
            paddingBottom: 1,
            borderBottom: "1px solid #ccc",
            gap: 1, // space between text and loader
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            {`Generating section no: ${number + 1}`}
          </Typography>
          <Loader />
        </Box>
      ) : (
        <></>
      )}

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
              dangerouslySetInnerHTML={{ __html: renderClauseHTML(form) }}
            />
            <Divider sx={{ width: "100%" }} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
