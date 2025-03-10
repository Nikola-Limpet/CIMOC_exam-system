// app/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme } from 'next-themes';

export default function Home() {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#343A40]">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-5xl font-serif font-bold text-[#2E3A59] dark:text-[#F8F9FA] mb-6"
            style={{ fontFamily: 'var(--font-lora)' }}
          >
            2024 Mathematics Olympiad
          </motion.h1>
          
          <motion.p
            className="text-xl text-[#343A40] dark:text-[#F8F9FA] mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            A premier platform for mathematical excellence, where precision meets innovation.
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className="bg-[#2D9C92] hover:bg-[#24857D] text-white text-lg py-6 px-8 rounded-lg"
              size="lg"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16 bg-white dark:bg-[#2E3A59] px-4"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {['Real-time Analytics', 'Secure Submission', 'Instant Results'].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className={`h-12 w-12 rounded-full mb-4 flex items-center justify-center 
                    ${index % 3 === 0 ? 'bg-[#FF6B6B]' : 
                     index % 3 === 1 ? 'bg-[#6C5CE7]' : 'bg-[#2D9C92]'}`}>
                    <span className="text-white text-xl">✓</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#2E3A59] dark:text-white mb-2">
                    {feature}
                  </h3>
                  <p className="text-[#6C7A89] dark:text-gray-300">
                    {index === 0 && 'Track exam progress in real-time with detailed analytics'}
                    {index === 1 && 'Military-grade encryption for all your submissions'}
                    {index === 2 && 'Immediate scoring with detailed feedback breakdown'}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 bg-[#2E3A59] text-white text-center"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          {['1000+', '24/7', '99.9%'].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="p-4"
            >
              <div className="text-4xl font-bold mb-2">{stat}</div>
              <div className="text-[#2D9C92] font-medium">
                {index === 0 && 'Active Participants'}
                {index === 1 && 'Support Availability'}
                {index === 2 && 'Uptime Guarantee'}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}