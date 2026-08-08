import React, { useState } from "react";
import GlassCard from "../components/GlassCard";
import { useParams } from "react-router-dom";
import { startListening, stopListening } from "../services/speech";
import { Mic, MicOff, Brain, Waves, User, Settings2 } from "lucide-react";
import { motion } from "framer-motion";
import { analyzeCommunication } from "../services/communication";
import { TypeAnimation } from "react-type-animation";

export default function Communication() {
  const { id } = useParams(); 
  
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text.");
      return;
    }

    try {
      setLoading(true);

      const data = await analyzeCommunication(
        id,
        inputText
      );

      setResult(data);
    } catch (err) {
      console.error(err);
      alert("AI analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const confidence = result?.confidence ?? 0;
  const circleLength = 251.2;
  const dashOffset = circleLength - (confidence / 100) * circleLength;

  // Extracted logic to fix the SonarQube nested ternary warnings
  let riskBadgeClass = "bg-green-500/20 text-green-400";
  let riskTextClass = "text-green-400";

  if (result?.risk === "High") {
    riskBadgeClass = "bg-red-500/20 text-red-400";
    riskTextClass = "text-red-400";
  } else if (result?.risk === "Medium") {
    riskBadgeClass = "bg-yellow-500/20 text-yellow-400";
    riskTextClass = "text-yellow-400";
  }

  return (
    <div className="pl-64 pt-8 p-8 min-h-screen flex gap-6">

      {/* LEFT PANEL */}
      <div className="flex-[0.8] flex flex-col gap-6">

        <GlassCard className="flex items-center gap-4 p-4 border-l-4 border-l-primary">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
            <User className="text-gray-300" />
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Alex Johnson
            </h3>

            <p className="text-sm text-gray-400">
              Mode: Simplified English
            </p>
          </div>
        </GlassCard>

        <GlassCard className="flex-1 flex flex-col relative overflow-hidden">
          {isRecording && (
            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
          )}

          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Waves className="w-4 h-4" />
            Student Communication
          </h3>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste what the student said..."
            className="w-full h-56 bg-white/5 rounded-xl p-4 outline-none resize-none border border-white/10"
          />

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => {
                if (!isRecording) {
                  setIsRecording(true);
                  startListening(
                    (text) => {
                      setInputText(text);
                    },
                    () => {
                      setIsRecording(false);
                    }
                  );
                } else {
                  stopListening();
                  setIsRecording(false);
                }
              }}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition ${
                isRecording
                  ? "bg-red-500/20 border border-red-500"
                  : "bg-primary/20 border border-primary"
              }`}
            >
              {isRecording ? (
                <MicOff size={34} />
              ) : (
                <Mic size={34} />
              )}
            </button>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-primary hover:bg-blue-600 px-8 py-3 rounded-xl font-semibold"
            >
              {loading ? "Analyzing..." : "Analyze AI"}
            </button>
          </div>
        </GlassCard>

      </div>

      {/* CENTER */}
      <div className="flex-[1.2] flex flex-col gap-6">

        <GlassCard className="flex-1">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Brain className="text-cyan-400" />
              AI Communication Analysis
            </h2>
            <Settings2 />
          </div>

          <h3 className="text-gray-400 mb-2">
            Student Input
          </h3>

          <div className="bg-white/5 rounded-xl p-4 mb-6 whitespace-pre-wrap">
            {inputText || "No student input yet."}
          </div>

          <h3 className="text-cyan-400 mb-3">
            AI Analysis
          </h3>

          <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 min-h-[320px]">
            {loading ? (
              <p className="text-center text-gray-300">
                Analyzing with AI...
              </p>
            ) : result ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-cyan-400 mb-2">
                    Simplified Explanation
                  </h3>
                  <TypeAnimation
                    sequence={[
                        result.simplified
                    ]}
                    wrapper="p"
                    speed={85}
                    cursor={true}
                    className="text-gray-200 leading-8"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-cyan-400 mb-2">
                    Detected Emotion
                  </h3>
                  <p className="text-gray-200">
                    {result.emotion}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-cyan-400 mb-2">
                    Risk Level
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${riskBadgeClass}`}
                  >
                    {result.risk}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-cyan-400 mb-2">
                    Teacher Suggestion
                  </h3>
                  <TypeAnimation
                    sequence={[
                        result.suggestion
                    ]}
                    wrapper="p"
                    speed={80}
                    cursor={true}
                    className="text-gray-200 leading-8"
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-400">
                AI analysis will appear here.
              </p>
            )}
          </div>
        </GlassCard>

      </div>

      {/* RIGHT PANEL */}
      <div className="flex-[0.8] flex flex-col gap-6">

        <GlassCard>
          <h3 className="font-semibold mb-6">
            AI Confidence
          </h3>

          <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="#22D3EE"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circleLength}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                initial={{ strokeDashoffset: circleLength }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1 }}
              />
            </svg>

            <div className="absolute text-center">
              <h2 className="text-3xl font-bold">
                {confidence}%
              </h2>
              <p className="text-sm text-gray-400">
                Confidence
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Emotion</span>
              <span className="text-cyan-400">
                {result?.emotion || "--"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Risk</span>
              <span className={riskTextClass}>
                {result?.risk || "--"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Status</span>
              <span className="text-green-400">
                AI Ready
              </span>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}