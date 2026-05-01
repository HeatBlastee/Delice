import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("No API key found in GEMINI_API_KEY or GOOGLE_API_KEY");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data: any = await response.json();
        console.log("Available Models:");
        data.models.forEach((m: any) => {
            console.log(`- ${m.name}`);
            console.log(`  Supported Methods: ${m.supportedGenerationMethods?.join(", ")}`);
        });
    } catch (e) {
        console.error("Error fetching models:", e);
    }
}

run();
