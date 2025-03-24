'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Brain, Target, Globe, LineChart, PiggyBank, GraduationCap } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <section className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-16">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4 flex justify-center">
            <motion.div
              className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              AI-Powered Financial Guidance
            </motion.div>
          </div>
          <h1 className="mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
            WealthCompanion AI
          </h1>
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            Your intelligent partner in financial growth and education
          </p>
          <div className="flex justify-center gap-4">
            <SignedOut>
              <Button asChild size="lg" className="text-lg">
                <Link href="/sign-in">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="/sign-up">Create Account</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button asChild size="lg" className="text-lg">
                <Link href="/welcome">Complete Your Profile <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </SignedIn>
          </div>
        </motion.div>

        <motion.div 
          className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <feature.icon className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-24 w-full max-w-4xl rounded-lg border bg-card p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-4 text-3xl font-bold">Why Choose WealthCompanion AI?</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            With 76% of Indian adults having low financial literacy, we&apos;re here to bridge the gap with AI-powered guidance.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="rounded-lg border p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                <h3 className="mb-2 text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

const features = [
  {
    title: "Conversational Learning",
    description: "Ask basic investment questions in natural language and get clear, easy-to-understand answers.",
    icon: Brain,
  },
  {
    title: "Personalized Recommendations",
    description: "Get tailored investment suggestions based on your profile, income, and financial goals.",
    icon: Target,
  },
  {
    title: "Multi-Language Support",
    description: "Access financial guidance in your preferred language - English, Hindi, or Gujarati.",
    icon: Globe,
  },
  {
    title: "Smart Profile System",
    description: "Create your investor profile with age, income, goals, and risk tolerance for personalized advice.",
    icon: Shield,
  },
  {
    title: "Investment Education",
    description: "Learn about SIPs, mutual funds, and other investment options through interactive conversations.",
    icon: GraduationCap,
  },
  {
    title: "Risk Assessment",
    description: "Understand your risk tolerance and get investment suggestions that match your comfort level.",
    icon: LineChart,
  },
  {
    title: "Real-time Market Insights",
    description: "Stay updated with market trends and get AI-powered analysis of investment opportunities.",
    icon: Sparkles,
  },
  {
    title: "Goal Planning",
    description: "Set and track your financial goals with personalized investment strategies.",
    icon: Target,
  },
  {
    title: "Beginner Friendly",
    description: "Perfect for first-time investors with no prior experience in the stock market.",
    icon: PiggyBank,
  },
];

const benefits = [
  {
    title: "For First-Time Investors",
    description: "Get started with confidence through guided conversations and personalized recommendations.",
  },
  {
    title: "AI-Powered Guidance",
    description: "Access instant, accurate answers to your investment questions 24/7.",
  },
  {
    title: "Personalized Experience",
    description: "Receive investment suggestions tailored to your profile and financial goals.",
  },
  {
    title: "Educational Approach",
    description: "Learn about investments through interactive conversations and real-world examples.",
  },
];