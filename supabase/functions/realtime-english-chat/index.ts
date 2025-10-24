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
    const { messages, level } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const levelInstructions = {
      beginner: "Use simple vocabulary and short sentences. Speak slowly and clearly. Focus on basic grammar.",
      intermediate: "Use moderate vocabulary and varied sentence structures. Correct mistakes gently.",
      advanced: "Use sophisticated vocabulary and complex sentences. Provide detailed corrections.",
      fluent: "Speak naturally at native level. Focus on nuance and advanced expressions."
    };

    const systemPrompt = `You are an expert English language tutor having a natural conversation with a ${level} student.

Your teaching approach:
- Speak naturally and conversationally, like a friendly teacher
- Listen carefully to the student's speech
- When you hear a grammar mistake, gently correct it by saying "You said [wrong], but we usually say [correct]"
- When you hear pronunciation issues, provide tips on how to say it correctly
- Introduce new vocabulary naturally in context
- Give real-time encouraging feedback like "Great job!" or "That's much better!"
- Keep responses concise and conversational (2-3 sentences max)
- ${levelInstructions[level as keyof typeof levelInstructions]}

Be warm, patient, and supportive. Make learning feel like chatting with a helpful friend.`;

    console.log("Starting streaming chat...");

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
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const error = await response.text();
      console.error('AI gateway error:', error);
      throw new Error(`AI request failed: ${error}`);
    }

    // Return the stream directly
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error in realtime-english-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
