import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "supersecretkey";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return NextResponse.json({ user: decoded });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
