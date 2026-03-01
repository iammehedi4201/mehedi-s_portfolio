import * as dotenv from "dotenv";
import path from "path";

// Load .env.local BEFORE importing dbConnect
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import dbConnect from "../src/lib/db";
import Project from "../src/lib/models/Project";

async function setOrder() {
  try {
    console.log("Connecting to database...");
    await dbConnect();

    // Fetch all non-deleted projects ordered by createdAt descending (newest first)
    const projects = await Project.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();

    console.log(`Found ${projects.length} projects. Setting order...`);

    await Promise.all(
      projects.map((p: any, idx: number) =>
        Project.findByIdAndUpdate(p._id, { order: idx })
      )
    );

    console.log("Order update completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error setting project order:", err);
    process.exit(1);
  }
}

setOrder();
