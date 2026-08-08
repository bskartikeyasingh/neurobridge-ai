import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  MessageSquare,
  HeartPulse,
  Sparkles,
  Activity,
  FileText,
  UserPlus,
  UserCheck,
  ArrowDown,
  Bot,
  GraduationCap,
} from "lucide-react";
import GlassCard from '../components/GlassCard';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />

      <nav className="fixed w-full z-50 glass-card rounded-none border-x-0 border-t-0 px-8 py-4 flex justify-between items-center bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          <span className="font-bold text-xl tracking-wide">NeuroBridge AI</span>
        </div>
        <div className="flex gap-8 items-center font-medium text-sm text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <Link to="/login" className="px-6 py-2 rounded-full border border-cardBorder hover:bg-white/5 transition-all">Login</Link>
        </div>
      </nav>

      <section className="pt-40 px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 z-10">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium"
          >
            <Sparkles size={16}/>
            AI Powered • Inclusive Education • Early Screening
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-6xl font-bold leading-tight"
          >
            AI-Powered Communication & <br />
            <span className="text-gradient">Early Screening Platform</span> <br />
            for Neurodivergent Students
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-400 max-w-lg leading-relaxed"
          >
            Empowering teachers with AI-driven communication support, behavioral screening, personalized learning recommendations, and intelligent reports to create inclusive classrooms for every student.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-4"
          >
            <Link to="/login" className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-full font-medium transition-all glow-shadow">
              Get Started
            </Link>
          </motion.div>

          <div className="grid grid-cols-4 gap-6 pt-8">
            <div>
              <h2 className="text-3xl font-bold text-cyan-400">95%</h2>
              <p className="text-gray-400 text-sm">AI Accuracy</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-cyan-400">Real-time</h2>
              <p className="text-gray-400 text-sm">Communication</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-cyan-400">PDF</h2>
              <p className="text-gray-400 text-sm">Reports</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-cyan-400">24×7</h2>
              <p className="text-gray-400 text-sm">AI Assistant</p>
            </div>
          </div>

        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}
          className="flex-1 relative"
        >
          <div className="relative w-[500px] h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-[80px]" />
            <div className="absolute inset-10 border border-white/10 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-20 border border-primary/20 rounded-full animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <GlassCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 text-center">
              <Brain className="w-16 h-16 text-accent mx-auto mb-4" />
              <div className="h-2 bg-white/10 rounded-full w-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent w-3/4" />
              </div>
              <p className="text-sm mt-3 text-gray-300">Processing Emotion Data</p>
            </GlassCard>
            
            <GlassCard className="absolute top-10 right-10 p-4 border-accent/30 glow-shadow">
               <HeartPulse className="w-8 h-8 text-accent" />
            </GlassCard>
          </div>
        </motion.div>
      </section>

      <section id="how-it-works" className="py-28 px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            How NeuroBridge Works
          </h2>
          <p className="text-gray-400 text-lg">
            Complete AI-powered workflow from student onboarding to personalized learning.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: <UserPlus size={34}/>,
              title:"Teacher",
              desc:"Registers a student securely."
            },
            {
              icon:<UserCheck size={34}/>,
              title:"Student Login",
              desc:"Logs in using Student ID & Password."
            },
            {
              icon:<MessageSquare size={34}/>,
              title:"Communication AI",
              desc:"Speech is analyzed in real time."
            },
            {
              icon:<Brain size={34}/>,
              title:"AI Screening",
              desc:"Behavioral and learning patterns are detected."
            },
            {
              icon:<Activity size={34}/>,
              title:"Risk Assessment",
              desc:"Early indicators are identified."
            },
            {
              icon:<FileText size={34}/>,
              title:"PDF Reports",
              desc:"Instant downloadable reports."
            },
            {
              icon:<Bot size={34}/>,
              title:"Teacher AI Copilot",
              desc:"Personalized teaching suggestions."
            },
            {
              icon:<GraduationCap size={34}/>,
              title:"Personalized Learning",
              desc:"Adaptive recommendations for every student."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <GlassCard className="relative h-full text-center hover:border-cyan-500 transition-all">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-5 text-cyan-400">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400">
                  {item.desc}
                </p>
              </GlassCard>
              {index !== 7 && (
                <div className="hidden lg:flex justify-center mt-6">
                  <ArrowDown className="text-cyan-500"/>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <section id="features" className="py-32 px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything NeuroBridge Can Do</h2>
          <p className="text-gray-400">A complete AI-powered ecosystem designed for teachers and neurodivergent students.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <MessageSquare size={32} />,
              title: "AI Communication",
              desc: "Real-time speech analysis, simplified explanations, emotion detection and communication assistance for neurodivergent students."
            },
            {
              icon: <Brain size={32} />,
              title: "AI Screening",
              desc: "Detect attention, communication and learning patterns using intelligent AI analysis."
            },
            {
              icon: <FileText size={32} />,
              title: "Smart PDF Reports",
              desc: "Generate professional downloadable reports with AI observations, confidence scores and recommendations."
            },
            {
              icon: <Bot size={32} />,
              title: "Teacher AI Copilot",
              desc: "Ask AI how to teach a student, generate activities, explain difficult topics and receive personalized guidance."
            },
            {
              icon: <GraduationCap size={32} />,
              title: "Personalized Learning",
              desc: "Recommend activities and learning strategies based on each student's communication profile."
            },
            {
              icon: <HeartPulse size={32} />,
              title: "Progress Monitoring",
              desc: "Track every student's improvement over time through reports, AI history and performance analytics."
            }
          ].map((feature, i) => (
            <GlassCard
              key={i}
              className="group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.18)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-cyan-500/10 to-blue-500/5" />
              <div className="relative z-10">
                <div className="bg-cyan-500/10 w-16 h-16 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:rotate-6 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-7">
                  {feature.desc}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}