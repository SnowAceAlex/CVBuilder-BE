import { generateCVSuggestion } from '../services/ai.service.js';

export const getSuggestion = async (req, res, next) => {
  try {
    const { section, draftText, tone } = req.body;

    // Call AI service
    const suggestion = await generateCVSuggestion(section, draftText, tone);

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
