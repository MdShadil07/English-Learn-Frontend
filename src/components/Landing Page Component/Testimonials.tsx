import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatarUrl?: string;
  avatarFallback: string;
  content: string;
  rating: number;
  location: string;
  accent: 'emerald' | 'blue' | 'purple' | 'amber' | 'teal';
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Business Professional',
    avatarUrl: '/assets/testimonials/sarah.jpg',
    avatarFallback: 'SJ',
    content: 'CognitoSpeak transformed my business English skills in just 3 months. The AI conversation practice gave me the confidence to lead international meetings. The personalized feedback was exactly what I needed!',
    rating: 5,
    location: 'Germany',
    accent: 'emerald'
  },
  {
    id: 2,
    name: 'Miguel Rodriguez',
    role: 'University Student',
    avatarUrl: '/assets/testimonials/miguel.jpg',
    avatarFallback: 'MR',
    content: 'The pronunciation coach feature has been a game-changer for me. I\'ve struggled with certain English sounds for years, but the real-time feedback helped me finally master them. My professors have noticed the improvement!',
    rating: 5,
    location: 'Spain',
    accent: 'blue'
  },
  {
    id: 3,
    name: 'Aiko Tanaka',
    role: 'Software Developer',
    avatarUrl: '/assets/testimonials/aiko.jpg',
    avatarFallback: 'AT',
    content: 'What I love most about CognitoSpeak is how the AI adapts to my technical vocabulary needs. The writing assistant helped me improve my documentation skills, which has been crucial for my career advancement.',
    rating: 5,
    location: 'Japan',
    accent: 'purple'
  },
  {
    id: 4,
    name: 'Pavel Ivanov',
    role: 'Marketing Specialist',
    avatarUrl: '/assets/testimonials/pavel.jpg',
    avatarFallback: 'PI',
    content: 'The community aspect of CognitoSpeak sets it apart from other language apps. I\'ve made connections with people from around the world, and practicing together in the rooms feature has accelerated my progress.',
    rating: 4,
    location: 'Russia',
    accent: 'amber'
  },
  {
    id: 5,
    name: 'Lin Wei',
    role: 'Medical Student',
    avatarUrl: '/assets/testimonials/lin.jpg',
    avatarFallback: 'LW',
    content: 'As a medical student, I needed specialized English vocabulary. The custom modules and AI-powered corrections have been invaluable. I\'ve improved more in 6 months than in years of traditional classes.',
    rating: 5,
    location: 'China',
    accent: 'teal'
  }
];

const getAccentColor = (accent: string) => {
  const accentColors = {
    emerald: {
      light: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-300',
      medium: 'text-emerald-600 dark:text-emerald-400',
      dark: 'bg-emerald-500'
    },
    blue: {
      light: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/30 text-blue-800 dark:text-blue-300',
      medium: 'text-blue-600 dark:text-blue-400',
      dark: 'bg-blue-500'
    },
    purple: {
      light: 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800/30 text-purple-800 dark:text-purple-300',
      medium: 'text-purple-600 dark:text-purple-400',
      dark: 'bg-purple-500'
    },
    amber: {
      light: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/30 text-amber-800 dark:text-amber-300',
      medium: 'text-amber-600 dark:text-amber-400',
      dark: 'bg-amber-500'
    },
    teal: {
      light: 'bg-teal-100 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800/30 text-teal-800 dark:text-teal-300',
      medium: 'text-teal-600 dark:text-teal-400',
      dark: 'bg-teal-500'
    }
  };
  
  return accentColors[accent as keyof typeof accentColors];
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const activeTestimonial = testimonials[activeIndex];
  const accentColor = getAccentColor(activeTestimonial.accent);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 inset-0 -z-10">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white dark:from-slate-900 to-transparent"></div>
        <div className="absolute -top-[20%] right-[20%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[500px] h-[500px] bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-emerald-800 dark:from-white dark:to-emerald-400">
            Success Stories from Our Community
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Discover how learners around the world have transformed their English skills with CognitoSpeak.
          </p>
        </div>

        {/* Testimonial display */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            key={activeTestimonial.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-5 gap-6 md:gap-10 items-center"
          >
            {/* Left side - Avatar */}
            <div className="lg:col-span-2 flex flex-col items-center lg:items-end">
              <div className={`relative p-1 rounded-full ${accentColor.light} border mb-4 shadow-lg`}>
                <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800`}>
                  <Avatar className="w-full h-full">
                    <AvatarImage src={activeTestimonial.avatarUrl} alt={activeTestimonial.name} />
                    <AvatarFallback className="text-4xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {activeTestimonial.avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 rounded-full p-1 shadow">
                  <div className={`w-8 h-8 rounded-full ${accentColor.dark} flex items-center justify-center`}>
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{activeTestimonial.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-2">{activeTestimonial.role}</p>
                <div className="flex items-center justify-center lg:justify-end gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-4 h-4 ${i < activeTestimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                    />
                  ))}
                </div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  From {activeTestimonial.location}
                </div>
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="lg:col-span-3">
              <div className="relative">
                <div className="absolute -left-6 top-0 text-6xl opacity-20 text-emerald-300 dark:text-emerald-700">"</div>
                <blockquote className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed relative z-10 italic">
                  {activeTestimonial.content}
                </blockquote>
                <div className="absolute -right-6 bottom-0 text-6xl opacity-20 text-emerald-300 dark:text-emerald-700">"</div>
              </div>
            </div>
          </motion.div>

          {/* Navigation controls */}
          <div className="mt-12 flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-slate-300 dark:border-slate-700"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeIndex ? 'bg-emerald-500 scale-110' : 'bg-slate-300 dark:bg-slate-700'}`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-slate-300 dark:border-slate-700"
              onClick={nextTestimonial}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
