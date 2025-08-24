import React, { useEffect, useState, useCallback } from "react";
import { useFormContext } from "../context/DocumentContext";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import Loader from "./Loader";
import { generateDraftSections, generateFollowupQuestion } from "../api";
import { useNavigate } from "react-router-dom";

interface ITopics {
  topic: string;
  number: number;
  question: string;
  answer: string;
  suggestedAnswer: string;
}

export default function FollowupQuestions() {
  const { formData, setFormData } = useFormContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<ITopics>({
    defaultValues: {
      topic: formData.topics[0],
      number: 1,
      question: "",
      answer: "",
      suggestedAnswer: "",
    },
  });

  // watch values
  const questionValue = useWatch({ control, name: "question" });
  const suggestedAnswerValue = useWatch({ control, name: "suggestedAnswer" });
  const answerValue = useWatch({ control, name: "answer" });
  const numberValue = useWatch({ control, name: "number" });

  /**
   * Load a follow-up question for the current number
   */
  const getFollowupQuestion = useCallback(async () => {
    if (loading) {
      return;
    }
    const { number } = getValues();
    const topic = formData.topics[number - 1];

    if (!topic) return; // no more topics

    setLoading(true);

    try {
      const result = await generateFollowupQuestion({
        ...formData,
        topic,
      });

      setValue("question", result.question || "");
      setValue("answer", "");
      setValue("suggestedAnswer", result.suggested_answer || "");
    } finally {
      setLoading(false);
    }
  }, [formData, getValues, setValue]);

  /**
   * Handle submit and move to next question
   */
  const onSubmit = async () => {
    const { number } = getValues();
    const nextNumber = number + 1;

    // Save current Q&A
    const questions = [
      ...(formData?.questions || []),
      {
        question: questionValue,
        answer: answerValue,
      },
    ];

    setFormData({
      ...formData,
      questions,
    });

    if (nextNumber <= formData.topics.length) {
      // Go to next question
      setValue("number", nextNumber);
    } else {
      // All questions answered → generate draft
      const result = await generateDraftSections({
        ...formData,
        supportingDetails: questions.map((r) => `${r.question} ${r.answer}`),
      });

      setFormData({
        ...formData,
        sections: result.sections,
      });
    }
  };

  useEffect(() => {
    if (!numberValue) return;

    // Call followup question when number changes
    getFollowupQuestion();
  }, [numberValue]); // re-run when number changes

  useEffect(() => {
    if (formData?.sections?.length > 0) {
      navigate("/generate-document", { replace: true });
    }
  }, [formData]); // re-run when number changes
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
            Answer Followup Question
          </Typography>
        </Box>

        {/* Content */}
        {!loading ? (
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Question */}
            <Typography variant="body1">{questionValue}</Typography>

            {/* Answer input */}
            <Controller
              name="answer"
              control={control}
              rules={{ required: "Answer is required" }}
              render={({ field }) => (
                <TextField
                  label="Type N/A if not applicable"
                  fullWidth
                  {...field}
                  error={!!errors.answer}
                  multiline
                  rows={4}
                  helperText={`Suggested Answer: ${suggestedAnswerValue}`}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Next
            </Button>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Typography variant="body1">
              {`Generating question number ${numberValue}...`}
            </Typography>
            <Loader />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
