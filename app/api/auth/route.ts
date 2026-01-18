import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "auth";

export async function POST(req: Request) {
  const { password, redirect } = (await req.json().catch(() => ({}))) as {
    password?: string;
    redirect?: string;
  };

  const expected = process.env.SITE_PASSWORD;
  if (!expected) {
    return NextResponse.json({ message: "SITE_PASSWORD not set" }, { status: 500 });
  }

  if (!password || password !== expected) {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ redirect: redirect || "/" });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set({ name: COOKIE_NAME, value: "", path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}