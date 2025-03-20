import { NextRequest, NextResponse } from "next/server";
import { Model, Recognizer } from "vosk";
import { spawn } from "child_process";

export const runtime = "nodejs";

// Ленивый загрузчик модели
let model: Model | null = null;

function getModel(): Model {
  if (!model) {
    model = new Model("./models/vosk-model-small-ru-0.22");
    console.log("Модель Vosk успешно загружена");
  }
  return model;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: "Не найден файл 'audio' в FormData" },
        { status: 400 }
      );
    }

    const webmArrayBuffer = await audioFile.arrayBuffer();
    const webmBuffer = Buffer.from(webmArrayBuffer);

    const ffmpeg = spawn("ffmpeg", [
      "-i",
      "pipe:0",
      "-ar",
      "16000",
      "-ac",
      "1",
      "-f",
      "s16le",
      "pipe:1",
    ]);

    ffmpeg.stdin.write(webmBuffer);
    ffmpeg.stdin.end();

    // Собираем выходные данные ffmpeg (PCM)
    const pcmChunks: Buffer[] = [];
    ffmpeg.stdout.on("data", (chunk) => {
      pcmChunks.push(chunk);
    });

    ffmpeg.stderr.on("data", (errData) => {
      console.error("ffmpeg stderr:", errData.toString());
    });

    // Оборачиваем в Promise с явным возвратом NextResponse
    return new Promise<NextResponse>((resolve, reject) => {
      ffmpeg.stdout.on("end", () => {
        try {
          const pcmBuffer = Buffer.concat(pcmChunks);

          const recognizedModel = getModel();
          const rec = new Recognizer({
            model: recognizedModel,
            sampleRate: 16000,
          });
          rec.setWords(true);

          rec.acceptWaveform(pcmBuffer);
          const result = rec.finalResult();
          console.log("Результат распознавания:", result);

          resolve(NextResponse.json({ result }));
        } catch (error) {
          console.error("Ошибка при распознавании:", error);
          reject(
            NextResponse.json(
              { error: "Ошибка при обработке аудио" },
              { status: 500 }
            )
          );
        }
      });

      ffmpeg.on("error", (err) => {
        console.error("Ошибка ffmpeg:", err);
        reject(
          NextResponse.json(
            { error: "Ошибка при конвертации аудио" },
            { status: 500 }
          )
        );
      });
    });
  } catch (error) {
    console.error("Ошибка при распознавании:", error);
    return NextResponse.json(
      { error: "Ошибка при обработке аудио" },
      { status: 500 }
    );
  }
}
