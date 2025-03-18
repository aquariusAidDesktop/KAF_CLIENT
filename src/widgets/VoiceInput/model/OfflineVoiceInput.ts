"use client";

import { useEffect, useRef } from "react";

interface OfflineVoiceInputProps {
  onResult: (text: string) => void;
  listening: boolean;
  setListening: (val: boolean) => void;
  // Добавляем callback для установки состояния загрузки
  setIsLoadingAnswer?: (val: boolean) => void;
}

export default function OfflineVoiceInput({
  onResult,
  listening,
  setListening,
  setIsLoadingAnswer,
}: OfflineVoiceInputProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (listening) {
      startRecording();
    } else {
      stopRecording();
    }
    return () => {
      stopRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      });

      mediaRecorder.addEventListener("stop", async () => {
        // Устанавливаем флаг загрузки перед отправкой запроса
        if (setIsLoadingAnswer) setIsLoadingAnswer(true);
        const audioBlob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        try {
          const res = await fetch("/api/recognize", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          console.log("Ответ от сервера:", data);

          if (data?.result?.text) {
            onResult(data.result.text);
          } else {
            onResult("");
          }
        } catch (err) {
          console.error("Ошибка при отправке аудио:", err);
        } finally {
          // Снимаем флаг загрузки после завершения обработки
          if (setIsLoadingAnswer) setIsLoadingAnswer(false);
        }
      });

      mediaRecorder.start();
    } catch (err) {
      console.error("Ошибка доступа к микрофону:", err);
      setListening(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  return null;
}
