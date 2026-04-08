import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generateCVSuggestion = async (
  section,
  promptText,
  tone = 'professional',
) => {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

  // System prompt to guide the output depending on section
  let formatInstruction = 'Provide the suggestion in a professional tone.';
  const lowerSection = section.toLowerCase();

  if (lowerSection.includes('experience') || lowerSection.includes('project')) {
    formatInstruction +=
      ' Return the response as a bulleted list of achievements, using strong action verbs.';
  } else if (
    lowerSection.includes('skill') ||
    lowerSection.includes('education') ||
    lowerSection.includes('certification')
  ) {
    formatInstruction +=
      ' Return the response as a concise, standardized representation.';
  } else {
    // defaults to summary/overview formatting
    formatInstruction +=
      ' Return the response as a cohesive, impactful paragraph.';
  }

  const fullPrompt = `
You are an expert resume writer and career coach.
The user wants a suggestion for their CV's "${section}" section.
Their input/draft is: "${promptText}"
Tone requested: ${tone}

Instructions:
${formatInstruction}
Improve the grammar, impact, and clarity of the input. 
Output ONLY the raw suggested text without any conversational filler, markdown formatting blocks like \`\`\`, or introductory phrases.
`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return {
      text: response.text().trim(),
      tokensUsed: response.usageMetadata?.totalTokenCount || 0,
    };
  } catch (error) {
    console.error('Error in generateCVSuggestion:', error);
    throw new Error('Failed to generate AI suggestion: ' + error.message);
  }
};
