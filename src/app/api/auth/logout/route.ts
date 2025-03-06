import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const serialized = serialize("jwt", "", {
    httpOnly: true,
    secure: false, // для разработки
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return NextResponse.json(
    { success: true },
    { headers: { "Set-Cookie": serialized } }
  );
}
