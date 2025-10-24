import { motion } from 'framer-motion';
import { Bot, MessageSquare, Send, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const AIChat = () => {
  const aiPersonalities = [
    { name: 'Grammar Guru', specialty: 'Grammar & Syntax', color: 'from-emerald-500 to-teal-500', available: true },
    { name: 'Vocab Master', specialty: 'Vocabulary', color: 'from-blue-500 to-cyan-500', available: true },
    { name: 'Pronunciation Pro', specialty: 'Pronunciation', color: 'from-purple-500 to-pink-500', available: true },
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden border-none shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent opacity-90" />
          <CardContent className="relative p-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">AI Chat</h1>
                <p className="text-lg text-white/90">Practice English with AI tutors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Conversation
              </CardTitle>
              <CardDescription>Chat with your AI tutor</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm">Hello! I'm your AI English tutor. How can I help you today?</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Type your message..." className="flex-1" />
                <Button className="bg-gradient-to-r from-primary to-accent">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Tutor</CardTitle>
              <CardDescription>Select an AI personality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiPersonalities.map((personality) => (
                <Card key={personality.name} className="hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${personality.color} flex items-center justify-center`}>
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{personality.name}</p>
                        <p className="text-xs text-muted-foreground">{personality.specialty}</p>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
