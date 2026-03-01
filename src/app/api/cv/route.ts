import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import GlobalSettings from "@/lib/models/GlobalSettings";

// GET /api/cv — Public: get the CV link
export async function GET() {
  try {
    await dbConnect();
    const settings = await GlobalSettings.findOne({});
    return NextResponse.json({ 
      success: true, 
      cvUrl: settings?.cvUrl || "",
      activeCategory: settings?.activeCategory || "",
      cvLinks: settings?.cvLinks || {
        frontend: "",
        backend: "",
        fullstack: "",
        mernstack: "",
        react: ""
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch CV" }, { status: 500 });
  }
}

// POST /api/cv — Protected: update the CV link
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { cvUrl, cvLinks, activeCategory } = await req.json();

    let settings = await GlobalSettings.findOne({});
    if (!settings) {
      settings = new GlobalSettings({ 
        cvUrl: cvUrl || "", 
        cvLinks: cvLinks || {},
        activeCategory: activeCategory || ""
      });
    } else {
      if (cvUrl !== undefined) settings.cvUrl = cvUrl;
      if (cvLinks !== undefined) settings.cvLinks = cvLinks;
      if (activeCategory !== undefined) settings.activeCategory = activeCategory;
    }
    await settings.save();

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update CV" }, { status: 500 });
  }
}
