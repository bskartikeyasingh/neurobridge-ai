import React, { useState } from "react";
import GlassCard from "../components/GlassCard";
import { Brain, Search } from "lucide-react";
import { analyzeScreening } from "../services/screening";
import { useParams } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

export default function Screening() {
  // FIX: Robustly grab the ID regardless of how it's named in your App.jsx routes (e.g. :id, :student_id, etc.)
  const params = useParams();
  const id = params.id || params.student_id || params.studentId || Object.values(params)[0];
  
  console.log("Screening ID:", id);

  const [observations, setObservations] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!observations.trim()) {
      alert("Please enter classroom observations.");
      return;
    }

    // FIX: Block the form from submitting the literal word "undefined" if the URL is broken
    if (!id || id === "undefined") {
      alert("Error: Missing Student ID. Please go back to the Student Profile and click the Screening button again.");
      return;
    }

    try {
      setLoading(true);

      const data = await analyzeScreening(
        id, 
        observations
      );
      
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("AI Screening Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pl-64 p-8 min-h-screen flex gap-8 text-white">
      {/* Left Panel */}
      <div className="w-1/2">
        <GlassCard>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Search />
            Student Screening
          </h2>

          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="w-full h-72 bg-white/5 border border-white/10 rounded-xl p-4 outline-none resize-none transition-colors focus:border-cyan-500"
            placeholder="Enter classroom observations..."
          />

          <button
            onClick={handleAnalyze}
            disabled={loading || !observations}
            className="mt-6 bg-cyan-500 hover:bg-cyan-600 px-8 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
          >
            {loading ? (
              <div className="flex items-center gap-3 text-cyan-50">
                <Brain className="animate-pulse" />
                <span>NeuroBridge AI is thinking...</span>
              </div>
            ) : (
              "Run AI Screening"
            )}
          </button>
        </GlassCard>
      </div>

      {/* Right Panel */}
      <div className="flex-1">
        <GlassCard>
          <h2 className="text-2xl font-bold mb-6 flex gap-2 items-center">
            <Brain />
            AI Result
          </h2>

          {result ? (
            <div className="space-y-2">
              
              {/* High-level stats row */}
              <div className="flex gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-xl flex-1 border border-white/10">
                  <h3 className="text-sm text-gray-400 mb-1">Emotion</h3>
                  <p className="font-semibold text-cyan-400 capitalize">{result.emotion || "Unknown"}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl flex-1 border border-white/10">
                  <h3 className="text-sm text-gray-400 mb-1">Confidence</h3>
                  <p className="font-semibold text-cyan-400">{result.confidence}%</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl flex-1 border border-white/10">
                  <h3 className="text-sm text-gray-400 mb-1">Risk</h3>
                  <p className={`font-semibold capitalize ${
                    result.risk === 'High' ? 'text-red-400' :
                    result.risk === 'Moderate' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {result.risk || "Low"}
                  </p>
                </div>
              </div>

              {/* 1. AI Summary */}
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-5 mt-6">
                <h3 className="text-cyan-400 font-bold text-lg mb-3">
                  🧠 AI Summary
                </h3>
                <TypeAnimation
                  sequence={[
                    result.summary
                  ]}
                  wrapper="p"
                  speed={80}
                  cursor={true}
                  className="text-gray-200 leading-8"
                />
              </div>

              {/* 2. Classroom Recommendations */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 mt-6">
                <h3 className="text-green-400 font-bold text-lg mb-4">
                  ✅ Recommended Classroom Strategies
                </h3>
                <div className="space-y-3">
                  {result.recommendations?.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="text-green-400 font-bold">✔</div>
                      <p className="text-gray-200">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Parent Advice */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5 mt-6">
                <h3 className="text-purple-400 font-bold text-lg mb-4">
                  👨‍👩‍👧 Parent Recommendations
                </h3>
                <div className="space-y-3">
                  {result.parent_advice?.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="text-purple-400">➜</span>
                      <p className="text-gray-200">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p>AI result will appear here.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}