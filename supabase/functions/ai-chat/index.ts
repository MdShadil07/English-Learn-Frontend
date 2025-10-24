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
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

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
            content: `You are a helpful AI study assistant. Help students with their questions, provide clear explanations, and encourage learning. 
            
CRITICAL FORMATTING RULES:
- Use proper spacing between paragraphs
- Keep responses natural and conversational
- Format lists clearly with proper line breaks
- Avoid excessive symbols or markdown
- Use simple, clear language
- Add blank lines between sections for readability

Be friendly, supportive, and easy to understand.` 
          },
          ...messages
        ],
      }),
    });

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;
    
    // Clean up response formatting
    aiResponse = aiResponse
      .replace(/\*\*/g, '') // Remove markdown bold
      .replace(/\*/g, '') // Remove asterisks
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks to 2
      .trim();

    return new Response(JSON.stringify({ response: aiResponse }), {
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
