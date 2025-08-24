import React, {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { generateTopics } from "../api";
import { useFormContext } from "../context/DocumentContext";
import { IWhatToCreate } from "../types";
import Loader from "./Loader";

export default function AskWhatToCreate() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormContext();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IWhatToCreate>({
    defaultValues: {
      type: formData.type || "",
      jurisdiction: formData.jurisdiction || "",
      industry: formData.industry || "",
      otherDetails: formData.otherDetails || "",
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: IWhatToCreate) => {
    // Call API or process form data
    setLoading(true);
    const result = await generateTopics(data);
    setLoading(false);
    console.log(result.topics, "result");
    setFormData({
      ...formData,
      ...data,
      topics: result.topics,
    });
  };

  useEffect(() => {
    if (formData?.topics?.length > 0) {
      navigate("/followup-question", { replace: true });
    }
  }, [formData]);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Paper
        elevation={3}
        sx={{
          width: "70%",
          margin: "2rem auto",
          padding: "2rem",
          borderRadius: "12px",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            marginBottom: 3,
            paddingBottom: 1,
            borderBottom: "1px solid #ccc",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            AI Document Generator
          </Typography>
        </Box>

        {/* Form Fields */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Controller
            name="type"
            control={control}
            rules={{ required: "Type is required" }}
            disabled={loading}
            render={({ field }) => (
              <TextField
                label="Type: Ex: Invitation, Order, Invitation, Employment Contract and Etc."
                fullWidth
                {...field}
                error={!!errors.type}
                helperText={errors.type?.message}
              />
            )}
          />

          <Controller
            name="jurisdiction"
            control={control}
            rules={{ required: "Jurisdiction is required" }}
            disabled={loading}
            render={({ field }) => (
              <TextField
                label="Jurisdiction: Ex: Philippines, United States, Australia, Singapre"
                fullWidth
                {...field}
                error={!!errors.jurisdiction}
                helperText={errors.jurisdiction?.message}
              />
            )}
          />

          <Controller
            name="industry"
            control={control}
            rules={{ required: "Industry is required" }}
            disabled={loading}
            render={({ field }) => (
              <TextField
                label="Industry: Information Technology, Beauty and Products, Restaurant and etc."
                fullWidth
                {...field}
                error={!!errors.industry}
                helperText={errors.industry?.message}
              />
            )}
          />

          <Controller
            name="otherDetails"
            control={control}
            disabled={loading}
            render={({ field }) => (
              <TextField
                label="Other Details: Ex. The name of my company is Jollibee, its the number 1 fast food here in the philippines"
                fullWidth
                multiline
                rows={4}
                {...field}
                error={!!errors.otherDetails}
                helperText={errors.otherDetails?.message}
              />
            )}
          />

          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            color="primary"
          >
            {loading ? <Loader /> : "Next"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
