export type PortfolioSkills = { development: string[]; ml: string[] };

export type PortfolioProject = {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
};

export type RelevanceResponse = {
  skills: PortfolioSkills;
  projects: PortfolioProject[];
  explanation?: string;
  source: "ai" | "fallback";
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

export async function getRelevanceFromJD(
  jdText: string,
  skills: PortfolioSkills,
  projects: PortfolioProject[]
): Promise<RelevanceResponse> {
  if (!GEMINI_API_KEY) {
    console.warn("VITE_GEMINI_API_KEY not set. Using fallback heuristic.");
    return fallbackRelevance(jdText, skills, projects);
  }

  const skillsList = [...skills.development, ...skills.ml];
  const projectsList = projects.map((p) => `${p.title} (${p.tech.join(", ")})`).join("\n");

  const prompt = `You are a portfolio relevance matcher. Given a job description, analyze which skills and projects from the provided portfolio are most relevant.

Available Skills: ${skillsList.join(", ")}

Available Projects:
${projectsList}

Job Description:
${jdText}

Return a JSON response (and ONLY JSON, no markdown or extra text) with this exact structure:
{
  "skills": {
    "development": ["Skill1", "Skill2", ...],
    "ml": ["Skill3", "Skill4", ...]
  },
  "projects": [
    "Project Title 1",
    "Project Title 2",
    ...
  ],
  "explanation": "Brief explanation of why these were chosen"
}

Instructions:
- Include 3-6 most relevant skills in each category (development and ml).
- Include 2-4 most relevant projects.
- Only return skills/projects that exist in the provided lists.
- If a skill/project doesn't fit, don't include it.
- Ensure skills are capitalized exactly as provided in the Available Skills list.
- Return only valid JSON.`;

  // Retry logic with exponential backoff
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Calling Gemini API (attempt ${attempt + 1}/${maxRetries})...`);

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (response.status === 429) {
        // Rate limited - wait and retry
        const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.warn(`Rate limited (429). Retrying in ${waitTime}ms...`);
        lastError = new Error("Rate limited");
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      if (!response.ok) {
        const error = await response.json();
        console.error("Gemini API error status:", response.status);
        console.error("Gemini API error details:", error);
        console.error("API URL attempted:", GEMINI_API_URL);
        console.error("API Key set:", !!GEMINI_API_KEY);
        return fallbackRelevance(jdText, skills, projects);
      }

      const data: GeminiResponse = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Extract JSON from response (handles potential markdown wrapping)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn("Could not parse JSON from Gemini response");
        return fallbackRelevance(jdText, skills, projects);
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate and sanitize response
      const validatedSkills: PortfolioSkills = {
        development: (parsed.skills?.development || []).filter((s: string) =>
          skills.development.includes(s)
        ),
        ml: (parsed.skills?.ml || []).filter((s: string) => skills.ml.includes(s)),
      };

      const validatedProjects = (parsed.projects || [])
        .map((title: string) => projects.find((p) => p.title === title))
        .filter((p: PortfolioProject | undefined): p is PortfolioProject => p !== undefined);

      // Fallback if result is empty
      if (validatedSkills.development.length === 0 && validatedSkills.ml.length === 0) {
        validatedSkills.development = skills.development.slice(0, 3);
        validatedSkills.ml = skills.ml.slice(0, 3);
      }

      if (validatedProjects.length === 0) {
        validatedProjects.push(...projects.slice(0, 2));
      }

      return {
        skills: validatedSkills,
        projects: validatedProjects,
        explanation: parsed.explanation || "Personalized for this role.",
        source: "ai",
      };
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error("All retry attempts exhausted. Using fallback.", lastError);
  return fallbackRelevance(jdText, skills, projects);
}

function fallbackRelevance(
  jdText: string,
  skills: PortfolioSkills,
  projects: PortfolioProject[]
): RelevanceResponse {
  const text = jdText.toLowerCase();

  const keywordMatches = (items: string[]) =>
    items.filter((item) => text.includes(item.toLowerCase()));

  const matchedDev = keywordMatches(skills.development);
  const matchedMl = keywordMatches(skills.ml);

  const matchedProjects = projects.filter((project) => {
    const blob = [project.title, project.description, project.tech.join(" ")].join(" ").toLowerCase();
    return blob.split(/[^a-z0-9]+/).some((word) => word && text.includes(word));
  });

  return {
    skills: {
      development: matchedDev.length ? matchedDev : skills.development.slice(0, 3),
      ml: matchedMl.length ? matchedMl : skills.ml.slice(0, 3),
    },
    projects: matchedProjects.length ? matchedProjects : projects.slice(0, 2),
    explanation: "Keyword-matched relevance (API fallback).",
    source: "fallback",
  };
}
