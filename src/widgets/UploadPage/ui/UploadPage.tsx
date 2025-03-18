"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { FileRejection } from "react-dropzone";

export default function UploadPage() {
  const theme = useTheme();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
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
      const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL;
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
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Ошибка при загрузке файла"
        );
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Произошла неизвестная ошибка");
      }
      console.error("Ошибка при загрузке:", error);
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
    <Box
      sx={{
        p: 4,
        width: "90vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
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
          <Typography variant="body1" component="p" mt={2}>
            Отпустите файлы, чтобы загрузить
          </Typography>
        ) : (
          <Typography variant="body1" component="p" mt={2}>
            Перетащите файлы сюда
          </Typography>
        )}
        <Typography variant="body2" mt={1} color="text.secondary" component="p">
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
      {errorMessage && (
        <Box sx={{ mt: 2, maxWidth: 600 }}>
          <Typography variant="body2" color="error" align="center">
            {errorMessage}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
