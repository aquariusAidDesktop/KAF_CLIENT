import { NextRequest, NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  // Если сегментов пути нет — значит запрос к "/api/vosk"
  const pathSegments = params.path ?? [];
  if (pathSegments.length === 0) {
    // Возвращаем простое сообщение или, например, список файлов (опционально)
    return new NextResponse("Vosk Model API", { status: 200 });
  }

  // Собираем полный путь к файлу на диске
  const filePath = join(
    process.cwd(),
    "models",
    "vosk-model-small-ru-0.22",
    ...pathSegments
  );

  try {
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      return NextResponse.json(
        { error: "Доступ к директориям запрещён" },
        { status: 403 }
      );
    }
    const fileStream = createReadStream(filePath);
    const headers = {
      "Content-Type": "application/octet-stream",
      "Content-Length": stats.size.toString(),
    };

    return new NextResponse(fileStream as any, {
      status: 200,
      headers,
    });
  } catch (error) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 404 });
  }
}
