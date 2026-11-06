import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini AI client server-side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || 'dummy_key',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API Endpoint for AI Java Code Explanation & Debugging
  app.post('/api/java/explain', async (req, res) => {
    try {
      const { code, question } = req.body;
      if (!code && !question) {
        return res.status(400).json({ error: 'Code or question is required' });
      }

      const prompt = `You are an expert Java senior software engineer and passionate computer science educator, similar to the Babel-IT pedagogical style.
Analyze the following Java code / question with extreme clarity and precision.

Java Code / Query:
${code || question}

Provide your response in valid JSON with the following structure:
{
  "title": "Short title describing the concept",
  "overview": "High-level summary of what this code does and why it matters in Java.",
  "lineBreakdown": [
    {
      "lineNumber": 1,
      "code": "line of code",
      "explanation": "Detailed explanation of this exact line, JVM behavior, memory allocation (Stack/Heap), or syntax rule."
    }
  ],
  "jvmMemoryNotes": "How objects/primitives are allocated between Stack and Heap during execution.",
  "commonPitfalls": ["Pitfall 1", "Pitfall 2"],
  "quizQuestion": {
    "question": "A quick test question on this snippet",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why this option is correct."
  }
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an expert Java educator. Always respond in valid JSON matching the requested schema.',
        },
      });

      const text = response.text || '{}';
      let jsonResult;
      try {
        jsonResult = JSON.parse(text);
      } catch (parseErr) {
        // Fallback if markdown fenced json
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        jsonResult = JSON.parse(cleaned);
      }

      res.json(jsonResult);
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      res.status(500).json({
        error: err.message || 'Failed to generate explanation from AI',
        title: 'Java Analysis Error',
        overview: 'Could not connect to AI service. Please ensure GEMINI_API_KEY is configured in Secrets.',
        lineBreakdown: [],
        jvmMemoryNotes: 'N/A',
        commonPitfalls: [],
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = Number(process.env.PORT || 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`JavaBabel server running on http://localhost:${port}`);
  });
}

startServer();
