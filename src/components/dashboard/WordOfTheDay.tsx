import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  BookOpen,
  Lightbulb,
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  PauseCircle,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface WordExample {
  sentence: string;
  translation: string;
  context: string;
}

interface DailyWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  examples: WordExample[];
  audioUrl?: string;
  synonyms: string[];
  antonyms: string[];
}

const WordOfTheDay = () => {
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // Sample data - in a real app, this would come from an API
  const dailyWords: DailyWord[] = [
    {
      id: '1',
      word: 'Serendipity',
      phonetic: '/ˌserənˈdɪpɪti/',
      partOfSpeech: 'noun',
      definition: 'The occurrence of events by chance in a happy or beneficial way',
      difficulty: 'advanced',
      synonyms: ['chance', 'fortune', 'luck', 'fluke'],
      antonyms: ['misfortune', 'planning', 'design'],
      examples: [
        {
          sentence: 'A fortunate stroke of serendipity led to their meeting.',
          translation: 'Un golpe de suerte afortunado llevó a su encuentro.',
          context: 'Romantic encounter'
        },
        {
          sentence: 'The discovery was pure serendipity.',
          translation: 'El descubrimiento fue pura casualidad.',
          context: 'Scientific breakthrough'
        },
        {
          sentence: 'She found her dream job through serendipity.',
          translation: 'Encontró su trabajo soñado por casualidad.',
          context: 'Career success'
        },
        {
          sentence: 'Serendipity played a major role in their friendship.',
          translation: 'La casualidad jugó un papel importante en su amistad.',
          context: 'Personal relationships'
        },
        {
          sentence: 'The serendipity of the moment was unforgettable.',
          translation: 'La casualidad del momento fue inolvidable.',
          context: 'Life moments'
        }
      ]
    },
    {
      id: '2',
      word: 'Ephemeral',
      phonetic: '/ɪˈfemərəl/',
      partOfSpeech: 'adjective',
      definition: 'Lasting for a very short time',
      difficulty: 'intermediate',
      synonyms: ['temporary', 'transient', 'fleeting', 'short-lived'],
      antonyms: ['permanent', 'eternal', 'lasting', 'enduring'],
      examples: [
        {
          sentence: 'The beauty of cherry blossoms is ephemeral.',
          translation: 'La belleza de los cerezos en flor es efímera.',
          context: 'Nature appreciation'
        },
        {
          sentence: 'Social media trends are often ephemeral.',
          translation: 'Las tendencias de las redes sociales son a menudo efímeras.',
          context: 'Digital culture'
        },
        {
          sentence: 'The ephemeral nature of life makes it precious.',
          translation: 'La naturaleza efímera de la vida la hace preciosa.',
          context: 'Philosophy'
        },
        {
          sentence: 'Their happiness was sadly ephemeral.',
          translation: 'Su felicidad fue lamentablemente efímera.',
          context: 'Emotional state'
        },
        {
          sentence: 'Morning dew is a perfect example of ephemeral beauty.',
          translation: 'El rocío matutino es un ejemplo perfecto de belleza efímera.',
          context: 'Natural phenomena'
        }
      ]
    },
    {
      id: '3',
      word: 'Quintessential',
      phonetic: '/ˌkwɪntɪˈsenʃəl/',
      partOfSpeech: 'adjective',
      definition: 'Representing the most perfect or typical example of a quality or class',
      difficulty: 'advanced',
      synonyms: ['perfect', 'ideal', 'ultimate', 'classic'],
      antonyms: ['atypical', 'uncharacteristic', 'unusual'],
      examples: [
        {
          sentence: 'She is the quintessential English teacher.',
          translation: 'Ella es la maestra de inglés por excelencia.',
          context: 'Professional description'
        },
        {
          sentence: 'This painting is quintessential Renaissance art.',
          translation: 'Esta pintura es el arte renacentista por excelencia.',
          context: 'Art history'
        },
        {
          sentence: 'His behavior was quintessential gentlemanly conduct.',
          translation: 'Su comportamiento fue una conducta caballeresca por excelencia.',
          context: 'Social behavior'
        },
        {
          sentence: 'The dish represents quintessential French cuisine.',
          translation: 'El plato representa la cocina francesa por excelencia.',
          context: 'Culinary arts'
        },
        {
          sentence: 'That movie is the quintessential romantic comedy.',
          translation: 'Esa película es la comedia romántica por excelencia.',
          context: 'Entertainment'
        }
      ]
    }
  ];

  const playAudio = (wordId: string) => {
    setPlayingAudio(wordId);
    // Simulate audio playback
    setTimeout(() => setPlayingAudio(null), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-yellow-500 to-amber-500';
      case 'advanced': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-500';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200';
      case 'advanced': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200';
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="p-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"
          >
            <BookOpen className="h-8 w-8" />
          </motion.div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Word of the Day
            </h2>
            <p className="text-emerald-600 dark:text-emerald-400 text-lg font-medium">
              Expand your vocabulary with today's curated words
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 mr-1" />
            3 Premium Words
          </Badge>
          <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 text-sm">
            <Volume2 className="h-4 w-4 mr-1" />
            Audio Available
          </Badge>
        </div>
      </motion.div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {dailyWords.map((word, index) => (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.3 + index * 0.1,
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{
              y: -10,
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className="group cursor-pointer"
          >
            <Card className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 via-emerald-50/80 to-teal-50/90 dark:from-slate-800/95 dark:via-emerald-900/40 dark:to-teal-900/50 backdrop-blur-xl border border-emerald-200/40 dark:border-emerald-700/40 shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
              {/* Background decorations */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-300/20 to-teal-300/20 dark:from-emerald-700/20 dark:to-teal-700/20 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-300/20 to-emerald-300/20 dark:from-cyan-700/20 dark:to-emerald-700/20 blur-xl group-hover:scale-125 transition-transform duration-500"></div>

              <CardHeader className="relative pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"
                      >
                        <Star className="h-6 w-6" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-emerald-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                          {word.word}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                            {word.phonetic}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => playAudio(word.id)}
                            className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md"
                          >
                            {playingAudio === word.id ? (
                              <PauseCircle className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={cn('text-xs font-medium', getDifficultyBg(word.difficulty))}>
                        {word.difficulty}
                      </Badge>
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        {word.partOfSpeech}
                      </span>
                    </div>
                  </div>
                </div>

                <CardDescription className="text-emerald-700 dark:text-emerald-300 text-base leading-relaxed">
                  {word.definition}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* Synonyms & Antonyms */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                      Related Words
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {word.synonyms.map((synonym, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                      >
                        {synonym}
                      </Badge>
                    ))}
                    {word.antonyms.slice(0, 2).map((antonym, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      >
                        ≠ {antonym}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Examples Toggle */}
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <button
                      onClick={() => setExpandedWord(expandedWord === word.id ? null : word.id)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                          5 Example Sentences
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedWord === word.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </motion.div>
                    </button>
                  </motion.div>

                  {/* Expandable Examples */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedWord === word.id ? 'auto' : 0,
                      opacity: expandedWord === word.id ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pt-2">
                      {word.examples.map((example, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: expandedWord === word.id ? 1 : 0,
                            x: expandedWord === word.id ? 0 : -20
                          }}
                          transition={{ delay: idx * 0.1, duration: 0.3 }}
                          className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-emerald-200/40 dark:border-emerald-700/40 space-y-2"
                        >
                          <p className="text-sm font-medium text-emerald-900 dark:text-white leading-relaxed">
                            "{example.sentence}"
                          </p>
                          <p className="text-xs text-cyan-600 dark:text-cyan-400 italic">
                            {example.translation}
                          </p>
                          <Badge variant="outline" className="text-xs bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700">
                            {example.context}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Progress Indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400">Mastery Progress</span>
                    <span className="text-emerald-800 dark:text-emerald-200 font-semibold">
                      {Math.floor(Math.random() * 100)}%
                    </span>
                  </div>
                  <div className={cn('w-full h-2 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/30')}>
                    <motion.div
                      className={cn('h-full rounded-full bg-gradient-to-r', getDifficultyColor(word.difficulty))}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.floor(Math.random() * 100)}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + index * 0.2 }}
                    />
                  </div>
                </div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 py-3 group-hover:shadow-emerald-500/25"
              >
                <span className="flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4" />
                  Practice This Word
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </span>
              </Button>
            </motion.div>
          </motion.div>

              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-6 p-6 rounded-3xl bg-gradient-to-r from-white/80 to-emerald-50/80 dark:from-slate-800/80 dark:to-emerald-900/30 backdrop-blur-xl border border-emerald-200/40 dark:border-emerald-700/40">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-900 dark:text-white">1,247</div>
            <div className="text-sm text-emerald-600 dark:text-emerald-400">Words Learned</div>
          </div>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-emerald-300 to-transparent"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-900 dark:text-white">89%</div>
            <div className="text-sm text-emerald-600 dark:text-emerald-400">Avg. Retention</div>
          </div>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-emerald-300 to-transparent"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-900 dark:text-white">156</div>
            <div className="text-sm text-emerald-600 dark:text-emerald-400">Day Streak</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WordOfTheDay;
