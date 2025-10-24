import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import { Logo } from '@/components/Icons';
import NewsletterSubscription from './NewsletterSubscription';

interface FooterProps {
  variant?: 'landing' | 'dashboard';
  showNewsletter?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  variant = 'dashboard',
  showNewsletter = false
}) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'AI Tutors', href: '#ai-tutors' },
        ...(variant === 'landing' ? [{ label: 'Testimonials', href: '#testimonials' }] : []),
        ...(variant === 'landing' ? [{ label: 'FAQ', href: '#faq' }] : []),
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
        ...(variant === 'landing' ? [
          { label: 'Blog', href: '/blog' },
          { label: 'Success Stories', href: '/success-stories' }
        ] : []),
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        ...(variant === 'landing' ? [
          { label: 'Careers', href: '/careers' }
        ] : []),
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ]
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    ...(variant === 'landing' ? [
      { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
      { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' }
    ] : []),
  ];

  const bottomLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    ...(variant === 'landing' ? [
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Accessibility', href: '/accessibility' }
    ] : []),
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${
        variant === 'landing'
          ? 'bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800'
          : 'border-t border-emerald-200/30 dark:border-emerald-700/30'
      } ${variant === 'landing' ? 'pt-8 pb-6' : 'py-6 sm:py-8'} relative`}
    >
      {/* Background gradient - only for landing page */}
      {variant === 'landing' && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -bottom-[40%] -right-[40%] w-[80rem] h-[80rem] rounded-full opacity-5 bg-gradient-to-tl from-emerald-200 to-teal-200 dark:from-emerald-900 dark:to-teal-900 blur-3xl"></div>
          <div className="absolute -bottom-[30%] -left-[40%] w-[60rem] h-[60rem] rounded-full opacity-5 bg-gradient-to-tr from-blue-200 to-indigo-200 dark:from-blue-900 dark:to-indigo-900 blur-3xl"></div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className={`grid gap-6 ${
          variant === 'landing'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
        }`}>
          {/* Logo and company info */}
          <div className={`${
            variant === 'landing' ? 'col-span-1 md:col-span-2' : 'col-span-1'
          }`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center mb-3"
            >
              <Logo
                size="2xl"
                variant="adaptive"
                animated={true}
                className="mr-3"
              />
              <div>
                <span className={`text-xl font-bold ${
                  variant === 'landing'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-emerald-800 dark:text-emerald-200'
                }`}>CognitoSpeak</span>
                <p className={`text-xs ${
                  variant === 'landing'
                    ? 'text-slate-500 dark:text-slate-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}>AI-Powered Learning</p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`mb-3 ${
                variant === 'landing'
                  ? 'text-slate-600 dark:text-slate-400'
                  : 'text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {variant === 'landing'
                ? 'AI-powered English learning with personalized conversations and global community support.'
                : 'Transform your English with AI-powered learning. Join thousands achieving fluency worldwide.'
              }
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex space-x-3"
            >
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
                      variant === 'landing'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 hover:scale-110'
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 hover:text-emerald-800 dark:hover:text-emerald-200 hover:scale-110 hover:shadow-md'
                    }`}
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`${
                variant === 'landing' ? 'col-span-1' : 'col-span-1'
              }`}
            >
              <h3 className={`font-semibold text-sm uppercase tracking-wider mb-3 ${
                variant === 'landing'
                  ? 'text-slate-900 dark:text-white'
                  : 'text-emerald-800 dark:text-emerald-200'
              }`}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    {variant === 'landing' ? (
                      <Link
                        to={link.href}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:translate-x-1 inline-block"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition-all duration-200 hover:translate-x-1 inline-block"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter subscription - for dashboard variant */}
        {variant === 'dashboard' && showNewsletter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <NewsletterSubscription variant="dashboard" />
          </motion.div>
        )}

        {/* Newsletter subscription - only for landing page */}
        {variant === 'landing' && showNewsletter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-10"
          >
            <NewsletterSubscription variant="landing" />
          </motion.div>
        )}

        {/* Bottom footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: variant === 'landing' ? 1.2 : 0.9 }}
          className={`mt-6 border-t ${
            variant === 'landing'
              ? 'border-slate-200 dark:border-slate-800 pt-6'
              : 'border-emerald-200/20 dark:border-emerald-700/20 pt-4'
          } flex flex-col md:flex-row justify-between items-center`}
        >
          <p className={`text-sm mb-4 md:mb-0 ${
            variant === 'landing'
              ? 'text-slate-600 dark:text-slate-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            &copy; {currentYear} CognitoSpeak. All rights reserved.
          </p>
          <div className={`flex flex-wrap justify-center gap-x-6 gap-y-2 ${
            variant === 'landing' ? '' : 'items-center'
          }`}>
            {bottomLinks.map((link, index) => (
              <React.Fragment key={link.label}>
                {variant === 'landing' ? (
                  <Link
                    to={link.href}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:underline"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors hover:underline"
                  >
                    {link.label}
                  </a>
                )}
                {index < bottomLinks.length - 1 && (
                  <span className={`${
                    variant === 'landing'
                      ? 'text-slate-400'
                      : 'text-emerald-400'
                  }`}>•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
