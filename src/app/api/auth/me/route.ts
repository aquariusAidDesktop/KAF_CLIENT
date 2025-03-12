import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn(
      "Ошибка: Authorization заголовок отсутствует или неправильный"
    );
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    return NextResponse.json({ user: decoded });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка в jwt.verify():", error.message);
    } else {
      console.error("Ошибка в jwt.verify():", error);
    }
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
