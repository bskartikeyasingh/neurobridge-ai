import { useState } from "react";
import GlassCard from "../components/GlassCard";
import { Bot, Send } from "lucide-react";
import { askCopilot } from "../services/copilot";

export default function Copilot() {
  const [studentId, setStudentId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!studentId || !question) {
      alert("Enter student id and question");
      return;
    }

    try {
      setLoading(true);

      // Fixed parameter order to match the service expectation: (question, studentId)
      const data = await askCopilot(
        question,
        studentId
      );

      setAnswer(data.answer);
    } catch (err) {
      console.log(err);
      alert("AI failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pl-64 p-8">
      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <Bot size={34}/>
          <h1 className="text-3xl font-bold">
            Teacher AI Copilot
          </h1>
        </div>

        <input
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full mb-4 bg-white/5 rounded-xl p-4 outline-none border border-transparent focus:border-cyan-500 transition-colors"
        />

        <textarea
          placeholder="Ask anything..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full h-40 bg-white/5 rounded-xl p-4 outline-none border border-transparent focus:border-cyan-500 transition-colors resize-none"
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="mt-5 bg-cyan-500 hover:bg-cyan-600 transition-colors px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18}/>
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </GlassCard>

      {answer && (
        <GlassCard className="mt-8">
          <h2 className="text-xl font-bold mb-5 text-cyan-400">
            AI Recommendation
          </h2>
          <div className="whitespace-pre-wrap leading-8 text-gray-200">
            {answer}
          </div>
        </GlassCard>
      )}
    </div>
  );
}