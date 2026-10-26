import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const target = formData.get("target") as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension and filename
    const ext = path.extname(file.name) || ".png";
    const allowedExts = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".pdf"];
    const cleanExt = allowedExts.includes(ext.toLowerCase()) ? ext.toLowerCase() : ".png";

    let publicUrl = "";

    // If uploading the primary CV directly
    if (target === "cv" && cleanExt === ".pdf") {
      const cvPath = path.join(process.cwd(), "public", "Mehedi_Hasan_CV.pdf");
      await fs.writeFile(cvPath, buffer);
      publicUrl = "/Mehedi_Hasan_CV.pdf";
    } else {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const prefix = cleanExt === ".pdf" ? "cv" : "project";
      const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${cleanExt}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);

      publicUrl = `/uploads/${filename}`;
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Local upload error:", error);
    return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 });
  }
}
