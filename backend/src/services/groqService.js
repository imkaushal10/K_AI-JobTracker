const Groq = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Analyze resume-job match using Groq AI
 * @param {string} resumeText - User's resume
 * @param {string} jobDescription - Job description
 * @param {string} jobTitle - Job title
 * @param {string} companyName - Company name
 * @returns {Object} - Match analysis with score and insights
 */
async function analyzeResumeMatch(resumeText, jobDescription, jobTitle, companyName) {
  try {
    const prompt = `You are an expert career advisor and ATS (Applicant Tracking System) analyzer. Analyze how well this resume matches the job posting.

**Resume:**
${resumeText}

**Job Details:**
Company: ${companyName}
Position: ${jobTitle}
Description: ${jobDescription}

**Your Task:**
Analyze the match between the resume and job posting. Provide:

1. **Match Score** (0-100): Overall compatibility score
2. **Key Strengths** (3-5 points): What makes this candidate strong for this role
3. **Missing Qualifications** (3-5 points): Skills/experience the job requires but resume lacks
4. **Suggestions** (3-5 points): Concrete advice to improve the application

**Format your response as JSON:**
{
  "matchScore": <number 0-100>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "missingQualifications": ["missing 1", "missing 2", "missing 3"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Be specific, actionable, and honest. Only return valid JSON, no other text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert career advisor. Analyze resume-job matches and return ONLY valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
       model: 'llama-3.3-70b-versatile', // Updated to latest model
      temperature: 0.3, // Lower temperature for more consistent results
      max_tokens: 1500,
      top_p: 1,
      response_format: { type: 'json_object' } // Force JSON response
    });

    const responseText = chatCompletion.choices[0].message.content;
    
    // Parse the JSON response
    const analysis = JSON.parse(responseText);

    // Validate the response structure
    if (!analysis.matchScore || !analysis.strengths || !analysis.missingQualifications || !analysis.suggestions) {
      throw new Error('Invalid response structure from AI');
    }

    // Ensure all fields are arrays
    // Note: The AI might return a single string for some fields instead of an array, so we convert them if necessary
    return {
      matchScore: analysis.matchScore,
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [analysis.strengths],
      missingQualifications: Array.isArray(analysis.missingQualifications) 
        ? analysis.missingQualifications 
        : [analysis.missingQualifications],
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [analysis.suggestions]
    };

  } catch (error) {
    console.error('Groq AI Error:', error);
    throw new Error('Failed to analyze resume match: ' + error.message);
  }
}

// Export the function for use in other modules
module.exports = {
  analyzeResumeMatch
};