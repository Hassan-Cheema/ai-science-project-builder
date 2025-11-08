import { config } from "dotenv";
import OpenAI from "openai";

// Load environment variables from .env file if it exists
config();

// Initialize OpenAI client with API key from environment variable
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY environment variable is not set.");
    console.error("Please set it using: export OPENAI_API_KEY=your_api_key");
    process.exit(1);
}

// Example: Create a chat completion
const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        {
            role: "user",
            content: "Write a one-sentence bedtime story about a unicorn."
        }
    ]
});

console.log(response.choices[0]?.message?.content || "No response received");
