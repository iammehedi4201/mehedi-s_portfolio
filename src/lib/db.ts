import mongoose from "mongoose";

/* ===== MongoDB Connection Singleton ===== */

function getMongoURI() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
  }
  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailureTime: number;
}

/* Use global cache to prevent multiple connections in dev hot-reload */
const globalWithMongoose = global as typeof global & {
  mongoose: MongooseCache;
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null, lastFailureTime: 0 };
}

// 30 seconds cooldown after a failed connection attempt to avoid stalling dev server
const FAILURE_COOLDOWN_MS = 30000;

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  // Fast-fail if recent connection failed, avoiding repeated 15s TCP timeouts
  if (cached.lastFailureTime && Date.now() - cached.lastFailureTime < FAILURE_COOLDOWN_MS) {
    throw new Error("Database offline (cooldown active)");
  }

  if (!cached.promise) {
    let uri = getMongoURI();
    // Prevent Windows IPv6 ::1 TCP SYN timeout by resolving localhost to 127.0.0.1
    if (uri.includes("localhost")) {
      uri = uri.replace("localhost", "127.0.0.1");
    }

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500,
      socketTimeoutMS: 3000,
      family: 4, // Force IPv4
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      cached.lastFailureTime = 0;
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.lastFailureTime = Date.now();
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
