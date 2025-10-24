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
    const { messages, isFirstMessage, level = 'beginner' } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Adjust difficulty based on level
    const levelInstructions = {
      beginner: 'Use simple vocabulary (A1-A2 level), speak slowly, use basic grammar structures, and be very encouraging. Focus on building confidence.',
      intermediate: 'Use moderate vocabulary (B1-B2 level), normal speaking pace, introduce idiomatic expressions occasionally, and provide constructive feedback.',
      advanced: 'Use advanced vocabulary (C1-C2 level), natural native speed, include idioms and complex structures, and give detailed feedback on nuances.'
    };

    const systemPrompt = isFirstMessage 
      ? `You are an expert English language tutor having a natural conversation with a ${level} level student. 

Your teaching approach:
${levelInstructions[level as keyof typeof levelInstructions] || levelInstructions.beginner}

- Start by warmly greeting the student and asking them to introduce themselves
- Speak naturally and conversationally, like a friendly teacher
- Listen carefully to the student's speech
- When you notice a grammar mistake, gently correct it: "You said [wrong], but we usually say [correct]" and count it
- When pronunciation seems off, repeat the word correctly
- Introduce new vocabulary naturally in context and highlight it
- Give encouraging real-time feedback like "Great job!" or "That's much better!"

Keep track of:
- Number of corrections made
- New vocabulary words introduced
- Number of conversational exchanges

After 3-4 exchanges, provide a comprehensive assessment with:
- Grammar: [score]/10 - [brief comment]
- Pronunciation: [score]/10 - [brief comment]
- Fluency: [score]/10 - [brief comment]
- Vocabulary: [score]/10 - [brief comment]

Then provide a learning summary with:
- Key improvements made
- Specific corrections given
- New words learned
- Areas to focus on next

Be warm, patient, and supportive. Make learning feel like chatting with a helpful friend.`
      : `You are an expert English language tutor in an ongoing conversation with a ${level} level student.

${levelInstructions[level as keyof typeof levelInstructions] || levelInstructions.beginner}

Continue the natural conversation:
- Respond to what the student just said
- Gently correct any grammar mistakes you notice and count them
- Help with pronunciation when needed
- Introduce and highlight new vocabulary
- Encourage and give positive feedback
- Ask follow-up questions to keep the conversation flowing

If this is around the 3rd-4th exchange, include:
1. Scores for Grammar, Pronunciation, Fluency, and Vocabulary (each out of 10)
2. A learning summary with corrections, new words, and recommendations

Keep responses natural and concise.`;

    console.log("Sending request to Lovable AI...");

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Lovable AI error:', error);
      throw new Error(`AI request failed: ${error}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log("AI response received");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in english-tutor function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
