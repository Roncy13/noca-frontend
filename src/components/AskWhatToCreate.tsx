import React, {
  Box,
  Button,
  MenuItem,
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
import { ArrowRight } from "@mui/icons-material";
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
export default function AskWhatToCreate() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormContext();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<IWhatToCreate>({
    defaultValues: {
      type: formData.type || "",
      jurisdiction: formData.jurisdiction || "",
      industry: formData.industry || "",
      otherDetails: formData.otherDetails || "",
      fontFamily: formData.fontFamily || "",
      logo: formData.logo || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = async (data: IWhatToCreate) => {
    setLoading(true);
    const result = await generateTopics(data);
    setLoading(false);

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
  }, [formData, navigate]);

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
          {/* Type */}
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

          {/* Jurisdiction */}
          <Controller
            name="jurisdiction"
            control={control}
            rules={{ required: "Jurisdiction is required" }}
            disabled={loading}
            render={({ field }) => (
              <TextField
                label="Jurisdiction: Ex: Philippines, United States, Australia, Singapore"
                fullWidth
                {...field}
                error={!!errors.jurisdiction}
                helperText={errors.jurisdiction?.message}
              />
            )}
          />

          {/* Industry */}
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

          {/* Font Family */}
          <Controller
            name="fontFamily"
            control={control}
            rules={{ required: "Font is required" }}
            disabled={loading}
            render={({ field }) => (
              <TextField
                select
                label="Font Family"
                fullWidth
                {...field}
                error={!!errors.fontFamily}
                helperText={errors.fontFamily?.message}
              >
                {["Arial", "Helvetica", "sans-serif"].map((font) => (
                  <MenuItem
                    key={font}
                    value={font}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Logo Upload */}
          <Controller
            name="logo"
            control={control}
            rules={{ required: "Logo is required" }} // ✅ add validation rule here
            render={({ field: { onChange }, fieldState: { error } }) => (
              <Box>
                <Button
                  variant="contained"
                  component="label"
                  disabled={loading}
                >
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                        setPreview(URL.createObjectURL(file));
                        const fileValue = await fileToBase64(file);
                        setValue("logo", fileValue);
                      }
                    }}
                  />
                </Button>

                {/* Show error message if no logo */}
                {error && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {error.message}
                  </Typography>
                )}

                {preview && (
                  <Box mt={2}>
                    <img
                      src={preview}
                      alt="Logo Preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}
          />

          {/* Other Details */}
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

          {/* Submit Button */}
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              color="success"
              endIcon={<ArrowRight />}
            >
              {loading ? <Loader /> : "Next"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
