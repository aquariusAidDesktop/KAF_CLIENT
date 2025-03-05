import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "supersecretkey";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email !== "test@test" || password !== "123") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: "1234", name: "Руслан", email, password },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  const serialized = serialize("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return NextResponse.json(
    { success: true },
    { headers: { "Set-Cookie": serialized } }
  );
}
