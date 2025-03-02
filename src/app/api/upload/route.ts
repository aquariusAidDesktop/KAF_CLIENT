import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    // Папка, куда будем сохранять (к примеру, в папку public/uploads)
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Создадим папку, если не существует
    await fs.mkdir(uploadDir, { recursive: true });

    // Сохраняем каждый файл на диск
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Дадим уникальное имя файлу (чтобы избежать конфликтов)
      const fileName = `${uuid()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      // Записываем файл в файловую систему
      await fs.writeFile(filePath, buffer);
    }

    // Возвращаем успешный ответ
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Ошибка при загрузке файлов:", error);
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}
