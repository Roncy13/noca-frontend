import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Divider, Modal, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "../context/DocumentContext";
import { useNavigate } from "react-router-dom";
import {
  BASE_URL,
  generateSectionContent,
  updateContent,
  updateLogoAndFont,
} from "../api";
import { IGenerateSectionContent } from "../types";
import { renderClauseHTML } from "../utils";
import Loader from "./Loader";

// Tiptap
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function GenerateDocument() {
  const navigate = useNavigate();
  const { formData, clearStorage } = useFormContext();

  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [sections, setSections] = useState<IGenerateSectionContent[]>([]);
  const [showPrint, setShowPrint] = useState(false);

  const [number, setNumber] = useState(0);
  const didRun = useRef(false);

  // Modal state
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Editor state
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const setSectionContent = async (index: number) => {
    if (loading) return;
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
    setSections((prev) => [...prev, result]);
  };

  useEffect(() => {
    if (sections.length < formData.sections.length && sections.length > 0) {
      setSectionContent(sections.length);
    }
    setNumber(sections.length);
  }, [sections]);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    setSectionContent(number);
  }, []);

  useEffect(() => {
    if (sections.length > 0) setShowPrint(true);
  }, [sections]);

  const handleEditClick = (index: number, content: string) => {
    setEditingIndex(index);
    editor?.commands.setContent(content); // load content into TipTap editor
    setOpen(true);
  };

  const handleSave = async () => {
    if (editingIndex === null || !editor) return;
    setLoadingModal(true);
    const editorValues = editor.getHTML();
    const result = await updateContent(editorValues, editingIndex);
    console.log(result, " result");
    const updated = [...sections];
    updated[editingIndex] = result;

    setSections(updated);
    setLoadingModal(false);
    setOpen(false);
  };

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
        maxHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", marginBottom: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Generate Document
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>{`Generating section no: ${number + 1}`}</Typography>
          <Loader />
        </Box>
      )}

      {/* Logo */}
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <img
          src={formData.logo}
          alt="Your Logo"
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ overflowY: "auto", maxHeight: "60vh" }}>
        {sections.map((form, index) => (
          <Box key={index} mb={2}>
            <Typography
              component="div"
              fontFamily={formData.fontFamily}
              dangerouslySetInnerHTML={{
                __html: renderClauseHTML(form, index),
              }}
            />
            <Box display="flex" gap={1} justifyContent="flex-end" m={2}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() =>
                  handleEditClick(index, renderClauseHTML(form, index))
                }
              >
                Edit
              </Button>
            </Box>
            <Divider sx={{ mt: 1 }} />
          </Box>
        ))}
      </Box>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
        <Button
          variant="contained"
          onClick={() => {
            clearStorage();
            setTimeout(() => navigate("/"), 500);
          }}
        >
          Return to Home
        </Button>
        {showPrint && (
          <Button
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
        )}
      </Box>

      {/* Edit Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper sx={{ width: "70%", margin: "5% auto", padding: "2rem" }}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            Edit Section
          </Typography>
          {editor && (
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                minHeight: "200px",
                padding: "1rem",
                mb: 2,
              }}
            >
              <EditorContent disabled={loadingModal} editor={editor} />
            </Box>
          )}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              disableElevation={loadingModal}
              variant="outlined"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disableElevation={loadingModal}
              variant="contained"
              onClick={handleSave}
            >
              {loadingModal ? <Loader /> : "Save"}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Paper>
  );
}
