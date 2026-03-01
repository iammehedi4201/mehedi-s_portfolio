import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary API Secret not configured on server" },
        { status: 500 }
      );
    }

    // Build params to sign (Cloudinary requires them in alphabetical order)
    // Only timestamp is strictly required for a simple upload, but you can add folder etc.
    const paramsToSign = `timestamp=${timestamp}`;
    
    // Create signature: SHA1(params + api_secret)
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Signing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
