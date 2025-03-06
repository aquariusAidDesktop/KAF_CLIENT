import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const dummyPasswordHash = await bcrypt.hash("123", 10);
  if (
    email !== "test@test" ||
    !(await bcrypt.compare(password, dummyPasswordHash))
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const user = { id: "1234", name: "Руслан", email };
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });

  // Возвращаем токен в JSON-ответе, что позволяет сохранять его в localStorage
  return NextResponse.json({ success: true, ...user, token });
}
