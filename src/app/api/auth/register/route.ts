import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (email === "test@test") {
    return NextResponse.json(
      { error: "Email уже зарегистрирован" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const id = Math.random().toString(36).substring(7);

  const user = { id, name, email };
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });

  const serialized = serialize("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 3600,
  });

  return NextResponse.json(
    { id, name, email },
    { headers: { "Set-Cookie": serialized } }
  );
}
