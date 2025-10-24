import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, level } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const levelPrompts = {
      beginner: 'Analyze this beginner-level English speech. Focus on basic grammar, simple sentence structure, and common pronunciation errors. Be encouraging and provide simple corrections.',
      intermediate: 'Analyze this intermediate-level English speech. Check for grammar accuracy, sentence variety, and pronunciation clarity. Provide constructive feedback on areas for improvement.',
      advanced: 'Analyze this advanced-level English speech. Evaluate complex grammar usage, idiomatic expressions, fluency, and subtle pronunciation nuances. Provide detailed feedback.',
      fluent: 'Analyze this fluent-level English speech. Look for near-native proficiency, natural flow, advanced vocabulary usage, and minor pronunciation refinements. Provide professional-level feedback.'
    };

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: `You are an expert English language tutor specializing in speech analysis. ${levelPrompts[level as keyof typeof levelPrompts] || levelPrompts.intermediate}

Provide your feedback in the following JSON format:
{
  "score": <number out of 10>,
  "grammarScore": <number out of 10>,
  "pronunciationScore": <number out of 10>,
  "fluencyScore": <number out of 10>,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "grammarErrors": [{"error": "mistake text", "correction": "correct version", "explanation": "why"}],
  "pronunciationTips": ["tip1", "tip2"],
  "overallFeedback": "detailed feedback text"
}` 
          },
          { role: 'user', content: `Analyze this speech transcript: "${transcript}"` }
        ],
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Try to parse JSON from the response
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : aiResponse);
    } catch (e) {
      // Fallback if JSON parsing fails
      analysis = {
        score: 7,
        grammarScore: 7,
        pronunciationScore: 7,
        fluencyScore: 7,
        strengths: ["Good attempt"],
        improvements: ["Keep practicing"],
        grammarErrors: [],
        pronunciationTips: [],
        overallFeedback: aiResponse
      };
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
