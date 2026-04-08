import { generateCVSuggestion } from '../services/ai.service.js';
import AiLog from '../models/aiLog.model.js';

export const getSuggestion = async (req, res, next) => {
  try {
    const { section, draftText, tone, cvId } = req.body;

    // Call AI service
    const { text: suggestion, tokensUsed } = await generateCVSuggestion(
      section,
      draftText,
      tone,
    );
    
    // Map section to promptType for logging
    let promptType = 'other';
    const s = section.toLowerCase();
    if (s.includes('summary') || s.includes('overview') || s.includes('personalinfo')) promptType = 'summary_generation';
    else if (s.includes('experience') || s.includes('project')) promptType = 'experience_rewrite';
    else if (s.includes('skill')) promptType = 'skill_suggestion';

    // Save AI Log to database
    await AiLog.create({
      userId: req.user._id,
      cvId: cvId || undefined,
      promptType,
      provider: 'gemini',
      inputText: draftText,
      responseText: suggestion,
      tokensUsed,
    });

    res.status(200).json({
      success: true,
      data: {
        suggestion,
      },
    });
  } catch (error) {
    // If it's an API key error, map to 503 Service Unavailable, else 500
    if (
      error.message.includes('GEMINI_API_KEY is not configured') ||
      error.message.includes('API key not valid')
    ) {
      error.status = 503;
    } else {
      error.status = 500;
    }
    next(error);
  }
};
