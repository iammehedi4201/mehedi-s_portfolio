import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import GlobalSettings from "@/lib/models/GlobalSettings";
import path from "path";
import fs from "fs/promises";

const CV_DATA_FILE = path.join(process.cwd(), "src", "data", "cv-settings.json");

interface CvSettingsData {
  cvUrl: string;
  activeCategory: string;
  cvLinks: {
    frontend?: string;
    backend?: string;
    fullstack?: string;
    mernstack?: string;
    react?: string;
    [key: string]: string | undefined;
  };
  updatedAt?: string;
}

const DEFAULT_SETTINGS: CvSettingsData = {
  cvUrl: "/Mehedi_Hasan_CV.pdf",
  activeCategory: "fullstack",
  cvLinks: {
    frontend: "/Mehedi_Hasan_CV.pdf",
    backend: "/Mehedi_Hasan_CV.pdf",
    fullstack: "/Mehedi_Hasan_CV.pdf",
    mernstack: "/Mehedi_Hasan_CV.pdf",
    react: "/Mehedi_Hasan_CV.pdf",
  },
};

async function readLocalCvSettings(): Promise<CvSettingsData> {
  try {
    const raw = await fs.readFile(CV_DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function writeLocalCvSettings(data: CvSettingsData): Promise<void> {
  try {
    await fs.mkdir(path.dirname(CV_DATA_FILE), { recursive: true });
    await fs.writeFile(
      CV_DATA_FILE,
      JSON.stringify({ ...data, updatedAt: new Date().toISOString() }, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Failed to write cv-settings.json:", error);
  }
}

// GET /api/cv — Public: get the CV link & categorized links
export async function GET() {
  try {
    await dbConnect();
    const settings = await GlobalSettings.findOne({});
    if (settings) {
      return NextResponse.json({
        success: true,
        cvUrl: settings.cvUrl || "/Mehedi_Hasan_CV.pdf",
        activeCategory: settings.activeCategory || "fullstack",
        cvLinks: settings.cvLinks || DEFAULT_SETTINGS.cvLinks,
      });
    }
  } catch {
    // Mongo offline, proceed to local JSON
  }

  const local = await readLocalCvSettings();
  return NextResponse.json({
    success: true,
    cvUrl: local.cvUrl || "/Mehedi_Hasan_CV.pdf",
    activeCategory: local.activeCategory || "fullstack",
    cvLinks: local.cvLinks || DEFAULT_SETTINGS.cvLinks,
  });
}

// POST /api/cv — Protected: update the CV settings
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { cvUrl, cvLinks, activeCategory } = await req.json();

    const local = await readLocalCvSettings();
    const updated: CvSettingsData = {
      cvUrl: cvUrl !== undefined ? cvUrl : local.cvUrl,
      activeCategory: activeCategory !== undefined ? activeCategory : local.activeCategory,
      cvLinks: cvLinks !== undefined ? { ...local.cvLinks, ...cvLinks } : local.cvLinks,
    };

    await writeLocalCvSettings(updated);

    // Also update Mongo if connected
    try {
      await dbConnect();
      let settings = await GlobalSettings.findOne({});
      if (!settings) {
        settings = new GlobalSettings(updated);
      } else {
        if (cvUrl !== undefined) settings.cvUrl = cvUrl;
        if (cvLinks !== undefined) settings.cvLinks = updated.cvLinks;
        if (activeCategory !== undefined) settings.activeCategory = activeCategory;
      }
      await settings.save();
    } catch {
      // Mongo offline, local store already saved
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("POST /api/cv error:", error);
    return NextResponse.json({ success: false, error: "Failed to update CV" }, { status: 500 });
  }
}
