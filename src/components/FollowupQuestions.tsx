import React, { useEffect, useState, useCallback, useRef } from "react";
import { useFormContext } from "../context/DocumentContext";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import Loader from "./Loader";
import { generateDraftSections, generateFollowupQuestion } from "../api";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "@mui/icons-material";

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
  const [generatingContent, setGeneratingContent] = useState(false);
  const navigate = useNavigate();
  const didRun = useRef(false);
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
  const [topicsLength] = useState(formData.topics.length);
  const questionValue = useWatch({ control, name: "question" });
  const suggestedAnswerValue = useWatch({ control, name: "suggestedAnswer" });
  const answerValue = useWatch({ control, name: "answer" });
  const numberValue = useWatch({ control, name: "number" });

  // Fetch followup question
  const getFollowupQuestion = useCallback(
    async (number: number) => {
      const topic = formData.topics[number - 1];
      if (!topic) return;

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 50)); // let React paint loader

      try {
        const result = await generateFollowupQuestion({ ...formData, topic });
        setValue("question", result.question || "");
        setValue("answer", "");
        setValue("suggestedAnswer", result.suggested_answer || "");
      } finally {
        setLoading(false);
      }
    },
    [formData, setValue]
  );

  const onSubmit = async () => {
    const { number } = getValues();
    const nextNumber = number + 1;

    // Save current answer
    const questions = [
      ...(formData?.questions || []),
      { question: questionValue, answer: answerValue },
    ];
    setFormData({ ...formData, questions });

    if (nextNumber <= formData.topics.length) {
      // Move to next question
      setValue("number", nextNumber);
      await getFollowupQuestion(nextNumber); // fetch next question
    } else {
      // All questions done → generate draft
      setGeneratingContent(true);
      const result = await generateDraftSections({
        ...formData,
        supportingDetails: questions.map((r) => `${r.question} ${r.answer}`),
      });

      setFormData({ ...formData, sections: result.sections });
      navigate("/generate-document", { replace: true });
    }
  };

  useEffect(() => {
    if (didRun.current) return; // prevent re-run
    didRun.current = true;
    getFollowupQuestion(1);
  }, []);

  useEffect(() => {
    if (formData?.sections?.length > 0) {
      navigate("/generate-document", { replace: true });
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
        sx={{
          width: "70%",
          margin: "2rem auto",
          padding: "2rem",
          borderRadius: "12px",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            marginBottom: 3,
            paddingBottom: 1,
            borderBottom: "1px solid #ccc",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Answer Followup Question {numberValue} / {topicsLength}
          </Typography>
        </Box>

        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Typography variant="body1">{`Generating question number ${numberValue}...`}</Typography>
            <Loader />
          </Box>
        ) : generatingContent ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Typography variant="body1">Generating draft content...</Typography>
            <Loader />
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography variant="body1">{questionValue}</Typography>
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
                  helperText={`Suggested Answer: ${
                    suggestedAnswerValue.length > 0
                      ? suggestedAnswerValue
                      : "___________"
                  }`}
                />
              )}
            />
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
        )}
      </Paper>
    </Box>
  );
}
