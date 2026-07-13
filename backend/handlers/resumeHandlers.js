import multer from "multer";
import { sendJson, getSession } from "../utils/helpers.js";
import { extractResumeText } from "../resume-analyzer/parser.js";
import { calculateATS } from "../resume-analyzer/atsScore.js";
import { findMissingSkills } from "../resume-analyzer/skills.js";
import { getSuggestions } from "../resume-analyzer/suggestions.js";

const MAX_RESUME_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RESUME_FILE_SIZE_BYTES, files: 1 },
}).single("resume");

export async function handleAnalyzeResume(req, res) {
  // Auth check — parsing an uploaded file is expensive work and must not be
  // reachable anonymously.
  const session = getSession(req);
  if (!session) {
    return sendJson(res, 401, { error: "Login required." });
  }

  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.file) {
      return sendJson(res, 400, { error: "No resume file uploaded." });
    }

    const TIMEOUT_MS = 15000; // 15 seconds
    const extractionPromise = extractResumeText(req.file);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Resume text extraction timed out.')), TIMEOUT_MS)
    );

    // Race the extraction against the timeout
    const text = await Promise.race([extractionPromise, timeoutPromise]);

    const atsScore = calculateATS(text);
    const missingSkills = findMissingSkills(text);
    const suggestions = getSuggestions(atsScore);

    return sendJson(res, 200, {
      atsScore,
      missingSkills,
      suggestions,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    if (error.message === 'Resume text extraction timed out.') {
      return sendJson(res, 408, {
        error: "The request took too long to process. The resume file might be corrupted or too complex."
      });
    }

    return sendJson(res, 500, { error: error.message || "Failed to analyze resume." });
  }
}