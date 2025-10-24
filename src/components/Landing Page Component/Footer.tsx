import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Testimonials', href: '#testimonials' },
        { label: 'AI Personalities', href: '#ai-tutors' },
        { label: 'FAQ', href: '#faq' },
      ]
    },
    {
      title: 'Learning',
      links: [
        { label: 'Grammar', href: '/grammar' },
        { label: 'Vocabulary', href: '/vocabulary' },
        { label: 'Speaking', href: '/speaking' },
        { label: 'Writing', href: '/writing' },
        { label: 'Reading', href: '/reading' },
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Practice Rooms', href: '/community/rooms' },
        { label: 'Discussion Forum', href: '/community/forum' },
        { label: 'Events', href: '/community/events' },
        { label: 'Blog', href: '/blog' },
        { label: 'Success Stories', href: '/success-stories' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ]
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Mail, href: 'mailto:contact@cognitospeak.com', label: 'Email' },
  ];

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-12 pb-8 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -bottom-[40%] -right-[40%] w-[80rem] h-[80rem] rounded-full opacity-5 bg-gradient-to-tl from-emerald-200 to-teal-200 dark:from-emerald-900 dark:to-teal-900 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -left-[40%] w-[60rem] h-[60rem] rounded-full opacity-5 bg-gradient-to-tr from-blue-200 to-indigo-200 dark:from-blue-900 dark:to-indigo-900 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-8">
          {/* Logo and company info */}
          <div className="col-span-2 md:col-span-6 lg:col-span-4">
            <div className="flex items-center mb-4">
              <img src="/logo.svg" alt="CognitoSpeak Logo" className="w-10 h-10" />
              <span className="ml-2 text-2xl font-bold text-slate-900 dark:text-white">CognitoSpeak</span>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Revolutionizing English learning with AI-powered conversations, personalized feedback, and a supportive global community.
            </p>
            
            <div className="flex space-x-3">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Footer links */}
          {footerLinks.map((section, i) => (
            <div key={i} className="col-span-1 md:col-span-3 lg:col-span-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      to={link.href}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Newsletter */}
        <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-8 pb-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Subscribe to our newsletter
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Get the latest news, updates and learning tips delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex-grow focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
              />
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 md:mb-0">
            &copy; {currentYear} CognitoSpeak. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link 
              to="/privacy" 
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              Terms of Service
            </Link>
            <Link 
              to="/cookies" 
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              Cookie Policy
            </Link>
            <Link 
              to="/accessibility" 
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
