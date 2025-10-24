import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: "What makes CognitoSpeak different from other language learning apps?",
    answer: "CognitoSpeak combines advanced AI technology with proven language learning methods to create a truly interactive experience. Unlike apps that focus on scripted lessons, our AI-powered conversations adapt to your level, interests, and learning style. We provide real-time feedback on grammar, vocabulary, pronunciation, and fluency—just like a personal tutor would. Additionally, our community features allow you to practice with other learners, creating a complete immersion experience."
  },
  {
    question: "How do the AI personalities work?",
    answer: "CognitoSpeak offers 5 different AI tutor personalities, each with a unique teaching approach: Professor Palmer focuses on academic precision, Coach Taylor provides motivational guidance, Storyteller Maya emphasizes narrative skills, Business Pro Alex specializes in professional English, and Explorer Zoe covers travel and cultural expressions. Each AI personality adapts to your level and learning pace, providing personalized feedback and encouragement along the way."
  },
  {
    question: "Is CognitoSpeak suitable for complete beginners?",
    answer: "Absolutely! CognitoSpeak is designed for learners at all levels, from complete beginners to advanced speakers. For beginners, we offer a structured curriculum that starts with basic phrases and concepts before gradually advancing to more complex material. Our AI tutors adjust their language complexity and speaking pace to match your current level, making the learning experience comfortable yet challenging."
  },
  {
    question: "How accurate is the pronunciation feedback?",
    answer: "Our pronunciation feedback system uses advanced speech recognition technology specifically trained on non-native English speakers. It can identify subtle pronunciation issues that are common among learners from different language backgrounds. The system provides visual feedback highlighting specific sounds that need improvement, along with guided exercises to help you master those challenging phonemes. Most users see significant improvement in their pronunciation clarity within just a few weeks of regular practice."
  },
  {
    question: "Can I use CognitoSpeak to prepare for English proficiency tests?",
    answer: "Yes! CognitoSpeak includes specific modules designed to help you prepare for major English proficiency tests like TOEFL, IELTS, Cambridge Exams, and more. These modules focus on test-specific vocabulary, question types, and skills assessed in each exam. Our AI tutors can also conduct mock interviews and provide feedback on practice test responses, helping you build confidence and improve your scores."
  },
  {
    question: "How does the community feature work?",
    answer: "Our community features allow you to connect with fellow English learners worldwide. You can join public practice rooms based on topics or proficiency levels, or create private rooms to practice with friends. The community forum lets you ask questions, share resources, and participate in language exchange. We also host regular community events like conversation clubs, grammar workshops, and cultural exchange sessions led by language experts."
  },
  {
    question: "Can I access CognitoSpeak on multiple devices?",
    answer: "Yes, CognitoSpeak is available across multiple platforms. You can access your account on our web platform, iOS app, and Android app. Your learning progress, conversation history, and preferences sync seamlessly across all your devices, allowing you to continue your learning journey wherever you are. Premium subscribers can use CognitoSpeak on unlimited devices simultaneously."
  },
  {
    question: "What happens after my free trial ends?",
    answer: "After your 7-day free trial of our Plus or Premium plan ends, your account will automatically convert to the plan you selected during signup unless you cancel. You can downgrade to our Free plan at any time if you're not ready to commit to a paid subscription. Don't worry—any progress you've made during your trial period will be preserved regardless of which plan you choose to continue with."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white dark:from-slate-900 to-transparent"></div>
        <div className="absolute -top-[10%] left-[30%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-50/40 to-teal-50/40 rounded-full blur-3xl dark:from-emerald-900/10 dark:to-teal-900/10"></div>
        <div className="absolute -bottom-[10%] right-[30%] w-[500px] h-[500px] bg-gradient-to-br from-blue-50/40 to-indigo-50/40 rounded-full blur-3xl dark:from-blue-900/10 dark:to-indigo-900/10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-emerald-800 dark:from-white dark:to-emerald-400">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Everything you need to know about CognitoSpeak and how it can transform your English learning journey.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-200 dark:border-slate-800">
                  <AccordionTrigger className="text-left text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 text-base sm:text-lg font-medium py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-700 dark:text-slate-300 text-base">
                    <div className="pb-1">{item.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
          
          {/* Additional support info */}
          <motion.div 
            className="mt-12 text-center p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
              Still have questions?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Our support team is just a message away. We're here to help you with any questions about our platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#contact" 
                className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm"
              >
                Contact Support
              </a>
              <a 
                href="/knowledge-base" 
                className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm"
              >
                Browse Knowledge Base
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
