import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

// Hardcode key for this test script since .env might not be picked up easily without dotenv package configuration for ES modules in this specific way if not set up perfectly.
// But wait, the project has type: module.
// I'll just fetch directly using native fetch to avoid package dependency issues in this standalone script if possible, 
// OR simpler: just use the key directly.

const API_KEY = "AIzaSyCdI4XeEzshZX3IzX-UnskSCcFBkQ4PM0s";

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods})`));
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
