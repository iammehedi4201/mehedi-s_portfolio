import * as dotenv from "dotenv";
import path from "path";

// Load .env.local BEFORE importing dbConnect
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import dbConnect from "../src/lib/db";
import Project from "../src/lib/models/Project";

const demoProjects = [
  {
    title: "EcoTrack AI",
    description: "An AI-powered environmental monitoring dashboard that visualizes global carbon footprint data and predicts climate trends using machine learning models.",
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Python", "TensorFlow", "MongoDB"],
    category: "fullstack",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    status: "published",
  },
  {
    title: "Nova CRM",
    description: "A high-performance modern CRM designed for real estate agents. Features automated lead flows, real-time activity tracking, and an integrated appointment scheduler.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    techStack: ["React", "PostgreSQL", "Prisma", "Node.js", "GraphQL", "Azure"],
    category: "backend",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    status: "published",
  },
  {
    title: "Stellar UI Library",
    description: "A headless, highly accessible component library focused on micro-interactions and performance. Used by over 200+ developers for building modular design systems.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop",
    techStack: ["React", "Tailwind CSS", "Storybook", "Framer Motion", "Rollup"],
    category: "frontend",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    status: "published",
  },
  {
    title: "Velox Messenger",
    description: "A real-time, end-to-end encrypted chat application supporting large file transfers and secure group calls across multiple devices.",
    thumbnail: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=1470&auto=format&fit=crop",
    techStack: ["React Native", "Socket.io", "Redis", "Node.js", "WebRTC"],
    category: "mobile",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    status: "published",
  },
  {
    title: "SynthAI Platform",
    description: "Cloud-native platform that generates high-fidelity synthetic data for training autonomous vehicle sensors in simulated environments.",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1470&auto=format&fit=crop",
    techStack: ["Next.js", "Docker", "Kubernetes", "AWS Lambda", "Go"],
    category: "fullstack",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    status: "published",
  }
];

async function seed() {
  try {
    console.log("Connecting to database...");
    await dbConnect();
    
    console.log("Cleaning up existing projects...");
    await Project.deleteMany({});
    
    console.log("Seeding demo projects...");
    await Project.insertMany(demoProjects);
    
    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
