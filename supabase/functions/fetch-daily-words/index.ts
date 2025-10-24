import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if we already have words for today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingWords } = await supabase
      .from('daily_words')
      .select('*')
      .eq('date', today);

    if (existingWords && existingWords.length >= 3) {
      return new Response(JSON.stringify({ words: existingWords }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate new words using AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
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
            content: `You are an English vocabulary teacher. Generate 3 interesting and useful English words for students to learn today. 
            
For each word, provide:
1. The word
2. Part of speech (noun, verb, adjective, etc.)
3. Clear definition
4. 4 example sentences showing different uses

Return as JSON array:
[
  {
    "word": "string",
    "part_of_speech": "string",
    "definition": "string",
    "example_sentences": ["sentence1", "sentence2", "sentence3", "sentence4"]
  }
]`
          },
          {
            role: 'user',
            content: 'Give me 3 useful English words for intermediate learners with examples.'
          }
        ],
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const words = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    // Insert words into database
    const wordsToInsert = words.map((word: any) => ({
      word: word.word,
      definition: word.definition,
      part_of_speech: word.part_of_speech,
      example_sentences: word.example_sentences,
      date: today
    }));

    await supabase.from('daily_words').insert(wordsToInsert);

    return new Response(JSON.stringify({ words: wordsToInsert }), {
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