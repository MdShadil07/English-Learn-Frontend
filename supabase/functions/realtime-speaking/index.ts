import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const upgradeHeader = req.headers.get("upgrade") || "";
  
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let openAISocket: WebSocket | null = null;
  let sessionCreated = false;

  socket.onopen = async () => {
    console.log("Client connected");
    
    try {
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
      }

      const model = "gpt-4o-realtime-preview-2024-12-17";
      const url = `wss://api.openai.com/v1/realtime?model=${model}`;
      
      openAISocket = new WebSocket(url, {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "realtime=v1"
        }
      });
      
      openAISocket.onopen = () => {
        console.log("Connected to OpenAI Realtime API");
      };

      openAISocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("OpenAI event:", data.type);

          if (data.type === 'session.created' && !sessionCreated) {
            sessionCreated = true;
            console.log("Session created, configuring...");
            
            const sessionConfig = {
              type: 'session.update',
              session: {
                modalities: ['text', 'audio'],
                instructions: `You are an expert English language tutor having a natural conversation with a student. 

Your teaching approach:
- Speak naturally and conversationally, like a friendly teacher
- Listen carefully to the student's speech
- When you hear a grammar mistake, gently correct it by saying "You said [wrong], but we usually say [correct]"
- When you hear pronunciation issues, repeat the word correctly and have them practice
- Introduce new vocabulary naturally in context
- Give real-time encouraging feedback like "Great job!" or "That's much better!"
- At natural breaks, provide brief performance ratings

After 3-4 exchanges, provide a quick assessment:
- Grammar: [score]/10 - [brief comment]
- Pronunciation: [score]/10 - [brief comment]  
- Fluency: [score]/10 - [brief comment]
- Vocabulary: [score]/10 - [brief comment]

Be warm, patient, and supportive. Make learning feel like chatting with a helpful friend.`,
                voice: 'alloy',
                input_audio_format: 'pcm16',
                output_audio_format: 'pcm16',
                input_audio_transcription: {
                  model: 'whisper-1'
                },
                turn_detection: {
                  type: 'server_vad',
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 1000
                },
                temperature: 0.8,
                max_response_output_tokens: 4096
              }
            };
            
            openAISocket?.send(JSON.stringify(sessionConfig));
          }

          socket.send(event.data);
        } catch (error) {
          console.error("Error processing OpenAI message:", error);
        }
      };

      openAISocket.onerror = (error) => {
        console.error("OpenAI WebSocket error:", error);
        socket.send(JSON.stringify({ 
          type: 'error', 
          error: 'Connection to AI failed' 
        }));
      };

      openAISocket.onclose = () => {
        console.log("OpenAI connection closed");
        socket.close();
      };
    } catch (error) {
      console.error("Error setting up OpenAI connection:", error);
      socket.send(JSON.stringify({ 
        type: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
      socket.close();
    }
  };

  socket.onmessage = (event) => {
    if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
      openAISocket.send(event.data);
    }
  };

  socket.onclose = () => {
    console.log("Client disconnected");
    openAISocket?.close();
  };

  socket.onerror = (error) => {
    console.error("Client WebSocket error:", error);
    openAISocket?.close();
  };

  return response;
});
