import * as dotenv from "dotenv";
import path from "path";

// Load .env.local BEFORE importing dbConnect
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import dbConnect from "../src/lib/db";
import Project from "../src/lib/models/Project";

const demoProjects = [
  {
    title: "VIPB Asset Management Company Ltd.",
    description: "Full-stack Mutual Fund Investment Platform supporting Individual, Joint, and Corporate accounts with automated recurring SIP and lump sum investments, investor and admin dashboards, tax certificates, PDF reports, Excel exports, and weekly portfolio alerts.",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1470&auto=format&fit=crop",
    techStack: ["Next.js", "React.js", "Express.js", "MongoDB", "Mongoose", "JWT", "Recharts", "Nodemailer", "TanStack", "Tailwind CSS"],
    category: "fullstack",
    liveUrl: "https://vipbamc.com/",
    githubUrl: "https://github.com/iammehedi4201",
    status: "published",
  },
  {
    title: "ICE Business Times",
    description: "Full-stack business magazine platform and dedicated Content Management System (CMS) enabling administrators to publish, schedule, and organize magazine articles with dynamic categorization, search, archive, SEO-friendly routing, and role-based authentication.",
    thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1470&auto=format&fit=crop",
    techStack: ["Next.js", "React.js", "Express.js", "MongoDB", "Mongoose", "REST API", "Tailwind CSS", "Shadcn UI", "JWT", "DigitalOcean"],
    category: "fullstack",
    liveUrl: "https://icebusinesstimes.com",
    githubUrl: "https://github.com/iammehedi4201",
    status: "published",
  },
  {
    title: "Bangladeshi Medicine API & Directory",
    description: "High-throughput REST and GraphQL API indexing over 20,000+ pharmaceutical products, generics, dosage forms, and brand alternatives in Bangladesh with instant fuzzy search and clean database architecture.",
    thumbnail: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1470&auto=format&fit=crop",
    techStack: ["Node.js", "Express.js", "TypeScript", "PostgreSQL", "Mongoose", "REST API", "Docker"],
    category: "backend",
    liveUrl: "https://bd-medicine-api.vercel.app",
    githubUrl: "https://github.com/iammehedi4201/bd-medicine-api",
    status: "published",
  },
  {
    title: "LearnCraft — Interactive Learning Platform",
    description: "Modern developer learning platform featuring modular interactive roadmaps, spaced repetition flashcards, automated code runners, and telemetry analytics.",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "MongoDB", "Zod"],
    category: "frontend",
    liveUrl: "https://learncraft.dev",
    githubUrl: "https://github.com/iammehedi4201/learncraft",
    status: "published",
  },
  {
    title: "Design System Tokens & Component Kit",
    description: "Custom semantic design system architecture featuring light/dark adaptive tokens, interactive playground, and solid color components without gradients.",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1470&auto=format&fit=crop",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Radix UI", "CSS Tokens"],
    category: "frontend",
    liveUrl: "/design-system",
    githubUrl: "https://github.com/iammehedi4201/mehedi-s_portfolio",
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
    // add order based on array index so seeded projects have consistent order
    const docs = demoProjects.map((p, i) => ({ ...p, order: i }));
    await Project.insertMany(docs);
    
    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
