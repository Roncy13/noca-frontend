import React, { useEffect, useState } from "react";
import { useFormContext } from "../context/DocumentContext";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import Loader from "./Loader";
import { generateFollowupQuestion } from "../api";
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

  const getFollowupQuestion = async () => {
    const { number } = getValues();
    const topic = formData.topics[number - 1];

    setLoading(true);
    // ensure loading UI updates before API call
    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      const result = await generateFollowupQuestion({
        ...formData,
        topic,
      });
      console.log(result, " result");
      setValue("question", result.question);
      setValue("answer", "");
      setValue("suggestedAnswer", result.suggested_answer);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    const { number } = getValues();
    const nextNumber = number + 1;

    // Save current Q&A
    setFormData({
      ...formData,
      questions: [
        ...(formData?.questions || []),
        {
          question: questionValue,
          answer: answerValue,
        },
      ],
    });

    if (nextNumber <= formData.topics.length) {
      // move to next question
      setValue("number", nextNumber);
      setValue("answer", "");
      setValue("suggestedAnswer", "");
      setValue("question", "");
      await getFollowupQuestion();
    } else {
      navigate("/generate-document", { replace: true });
    }
  };

  // load first question on mount
  useEffect(() => {
    getFollowupQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            {/* Question (not a controlled field) */}
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
              {loading ? <Loader /> : "Next"}
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
