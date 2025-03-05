import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "supersecretkey";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (email === "existing@example") {
    return NextResponse.json(
      { error: "Email уже зарегистрирован" },
      { status: 400 }
    );
  }

  const id = Math.random().toString(36).substring(7);

  const token = jwt.sign({ id, name, email, password }, SECRET_KEY, { expiresIn: "1h" });

  return NextResponse.json({ id, name, email, token });
}
