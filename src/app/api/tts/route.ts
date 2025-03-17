import { NextRequest, NextResponse } from "next/server";
import { Piper } from "node-piper";
import fs from "fs";
import path from "path";

const modelPath = path.join(process.cwd(), "model", "ru_RU-irina-medium.onnx");
const configPath = path.join(process.cwd(), "model", "ru_RU-irina-medium.onnx.json");

const piper = new Piper(modelPath, configPath);

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Текст обязателен" }, { status: 400 });
  }

  const outputPath = path.join(process.cwd(), "public", "output.wav");

  try {
    const audioBuffer = await piper.synthesize(text);
    fs.writeFileSync(outputPath, audioBuffer);
    return NextResponse.json({ audio: "/output.wav" });
  } catch (error) {
    console.error("Ошибка генерации речи:", error);
    return NextResponse.json({ error: "Ошибка генерации речи" }, { status: 500 });
  }
}
