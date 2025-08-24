import React, { useEffect } from "react";
import { useFormContext } from "../context/DocumentContext";

export default function FollowupQuestions() {
  const { formData, setFormData } = useFormContext();

  useEffect(() => {
    console.log(formData, new Date());
  }, []);
  return <div>12312</div>;
}
