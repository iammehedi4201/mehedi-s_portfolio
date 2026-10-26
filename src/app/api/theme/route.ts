import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { DEFAULT_THEMES, ThemePreset } from "@/lib/theme";

const THEME_DATA_FILE = path.join(process.cwd(), "src", "data", "theme-settings.json");

async function readLocalTheme(): Promise<ThemePreset> {
  try {
    const raw = await fs.readFile(THEME_DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_THEMES[0];
  }
}

async function writeLocalTheme(data: ThemePreset): Promise<void> {
  try {
    await fs.mkdir(path.dirname(THEME_DATA_FILE), { recursive: true });
    await fs.writeFile(
      THEME_DATA_FILE,
      JSON.stringify({ ...data, updatedAt: new Date().toISOString() }, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Failed to write theme-settings.json:", error);
  }
}

// GET /api/theme — Retrieve current active primary theme
export async function GET() {
  const theme = await readLocalTheme();
  return NextResponse.json({ success: true, theme });
}

// POST /api/theme — Update active primary theme
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.primary) {
      return NextResponse.json({ success: false, error: "Invalid theme data" }, { status: 400 });
    }

    await writeLocalTheme(body);
    return NextResponse.json({ success: true, theme: body });
  } catch (error) {
    console.error("POST /api/theme error:", error);
    return NextResponse.json({ success: false, error: "Failed to save theme" }, { status: 500 });
  }
}
