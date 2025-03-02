"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  useTheme,
  Grid2,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { FileRejection } from "react-dropzone";

export default function UploadPage() {
  const theme = useTheme();

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setErrorMessage(null);

    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      //   const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL;
      const uploadUrl = "/api/upload";
      if (!uploadUrl) {
        throw new Error("Upload URL is not defined");
      }
      const response = await axios.post(uploadUrl, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      console.log("Загрузка завершена:", response.data);
    } catch (error: any) {
      console.error("Ошибка при загрузке:", error);
      setErrorMessage(error.message || "Ошибка при загрузке файла");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const errors = fileRejections
      .map((rejection) => rejection.errors.map((e) => e.message).join(", "))
      .join("; ");
    setErrorMessage(`Некоторые файлы не прошли проверку: ${errors}`);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open, acceptedFiles } =
    useDropzone({
      onDrop,
      onDropRejected,
      noClick: true,
      noKeyboard: true,
      accept: {
        "application/pdf": [],
      },
    });

  const filesList = acceptedFiles.map((file) => (
    <li key={file.name}>{file.name}</li>
  ));

  return (
    <Grid2
      container
      size={"grow"}
      direction="column"
      alignItems="center"
      sx={{ p: 4 }}
    >
      <Typography variant="h3" textAlign="center">
        Загрузите книги
      </Typography>
      <Typography variant="body1" mt={3} textAlign="center">
        Выберите и перетащите файл вашей книги в выделенную область
        <br />
        или нажмите кнопку ниже
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${theme.palette.divider}`,
          borderRadius: 2,
          p: 6,
          mt: 3,
          width: "100%",
          maxWidth: 600,
          textAlign: "center",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon fontSize="large" color="action" />
        {isDragActive ? (
          <Typography variant="body1" mt={2}>
            Отпустите файлы, чтобы загрузить
          </Typography>
        ) : (
          <Typography variant="body1" mt={2}>
            Перетащите файлы сюда
          </Typography>
        )}
        <Typography variant="body2" mt={1} color="text.secondary">
          Поддерживаемые форматы: PDF
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={open}
        sx={{ mt: 6 }}
        startIcon={<CloudUploadIcon />}
        disabled={isUploading}
      >
        Выбрать файл
      </Button>

      {acceptedFiles.length > 0 && (
        <Box mt={2}>
          <Typography variant="h6">Вы выбрали:</Typography>
          <ul>{filesList}</ul>
        </Box>
      )}

      {isUploading && (
        <Box sx={{ width: "100%", maxWidth: 600, mt: 3 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" align="center" mt={1}>
            Загрузка: {progress}%
          </Typography>
        </Box>
      )}

      {/* Отображаем сообщение об ошибке, если оно есть */}
      {errorMessage && (
        <Box sx={{ mt: 2, maxWidth: 600 }}>
          <Typography variant="body2" color="error" align="center">
            {errorMessage}
          </Typography>
        </Box>
      )}
    </Grid2>
  );
}
