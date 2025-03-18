"use client";

import { useEffect, useRef, useState } from "react";
import Vosk from "vosk-browser";

interface OfflineVoiceInputProps {
  onResult: (text: string) => void;
  listening: boolean;
  setListening: (val: boolean) => void;
}

export default function OfflineVoiceInput({
  onResult,
  listening,
  setListening,
}: OfflineVoiceInputProps) {
  const [model, setModel] = useState<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptNodeRef = useRef<ScriptProcessorNode | null>(null);
  const recognizerRef = useRef<any>(null);
  const lastPartialRef = useRef<string>("");

  const stopListening = () => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (scriptNodeRef.current) {
        scriptNodeRef.current.disconnect();
        scriptNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      recognizerRef.current = null;
      console.log("Прослушивание остановлено.");
    } catch (err) {
      console.error("Ошибка остановки распознавания:", err);
    }
  };

  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Загрузка модели...");
        const m = await Vosk.createModel(
          "/models/vosk-model-small-ru-0.22.tar.gz"
        );
        setModel(m);
        console.log("Модель загружена.");
      } catch (err) {
        console.error("Ошибка загрузки модели Vosk:", err);
      }
    };
    loadModel();

    return () => {
      stopListening();
    };
  }, []);

  useEffect(() => {
    if (listening) {
      startListening();
    } else {
      stopListening();
    }
  }, [listening]);

  const startListening = async () => {
    if (!model) {
      console.warn("Модель Vosk не загружена");
      setListening(false);
      return;
    }
    try {
      console.log("Инициализация аудио контекста...");
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      console.log("Запрос доступа к микрофону...");

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err: any) {
        if (err.message && err.message.includes("Requested device not found")) {
          alert(
            "Микрофон не найден. Пожалуйста, подключите микрофон и попробуйте снова."
          );
        } else {
          console.error("Ошибка доступа к микрофону:", err);
        }
        setListening(false);
        return;
      }
      mediaStreamRef.current = stream;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      scriptNodeRef.current = audioContextRef.current.createScriptProcessor(
        4096,
        1,
        1
      );

      try {
        recognizerRef.current = new model.KaldiRecognizer(16000);
        console.log("Распознаватель создан.");
      } catch (err) {
        console.error("Ошибка создания распознавателя:", err);
        setListening(false);
        return;
      }

      recognizerRef.current.on("result", (result: any) => {
        try {
          if (lastPartialRef.current) {
            lastPartialRef.current = "";
          }
          if (result && result.result && result.result.text) {
            console.log("Финальный результат:", result.result.text);
            onResult(result.result.text);
            setListening(false);
          }
        } catch (innerErr) {
          console.error("Ошибка обработки финального результата:", innerErr);
        }
      });

      recognizerRef.current.on("partialresult", (result: any) => {
        try {
          if (result && result.result && result.result.partial) {
            const partialText = result.result.partial;
            if (partialText !== lastPartialRef.current) {
              lastPartialRef.current = partialText;
              console.log("Промежуточный результат:", partialText);
              onResult(partialText);
            }
          }
        } catch (innerErr) {
          console.error(
            "Ошибка обработки промежуточного результата:",
            innerErr
          );
        }
      });

      recognizerRef.current.on("error", (error: any) => {
        console.error("Ошибка распознавания:", error);
      });

      scriptNodeRef.current.onaudioprocess = (event) => {
        try {
          const audioBuffer = event.inputBuffer;
          recognizerRef.current.acceptWaveform(audioBuffer);
        } catch (error) {
          console.error("Ошибка обработки аудио потока:", error);
        }
      };

      source.connect(scriptNodeRef.current);
      scriptNodeRef.current.connect(audioContextRef.current.destination);
      console.log("Прослушивание начато.");
    } catch (err) {
      console.error("Ошибка доступа к микрофону или инициализации аудио:", err);
      setListening(false);
    }
  };

  return null;
}
