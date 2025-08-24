import React, { useEffect } from "react";
import { useFormContext } from "../context/DocumentContext";
import { Typography } from "@mui/material";

export default function GenerateDocment() {
  const { formData, setFormData } = useFormContext();
  useEffect(() => {
    console.log(formData, new Date());
  }, []);
  return <Typography>Generate Document</Typography>;
}
