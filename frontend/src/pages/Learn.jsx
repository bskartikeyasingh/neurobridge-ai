import { useState } from "react";
import GlassCard from "../components/GlassCard";
import {
  simplifyLesson,
  askDoubt
} from "../services/learning";
import { Volume2, Mic, MicOff } from "lucide-react";
import {
  startListening,
  stopListening
} from "../services/speech";

export default function Learn() {
  const subjects = [
    {
      name: "Science",
      chapters: [
        {
          title: "Plants",
          content: `Plants make their own food using sunlight, water and carbon dioxide through the process of photosynthesis. Chlorophyll present in leaves helps absorb sunlight. Oxygen is released as a by-product.`
        },
        {
          title: "Animals",
          content: `Animals depend on plants or other animals for food. They move from one place to another and require food, water and oxygen to survive.`
        },
        {
          title: "Human Body",
          content: `The human body consists of different organs such as the heart, lungs, brain and stomach. Each organ performs an important function.`
        }
      ]
    },
    {
      name: "Mathematics",
      chapters: [
        {
          title: "Fractions",
          content: `Fractions represent equal parts of a whole. A fraction has a numerator and denominator.`
        },
        {
          title: "Numbers",
          content: `Numbers help us count, measure and compare quantities in daily life.`
        },
        {
          title: "Shapes",
          content: `Shapes include circles, triangles, rectangles and squares. Each has different sides and angles.`
        }
      ]
    },
    {
      name: "English",
      chapters: [
        {
          title: "Grammar",
          content: `Grammar is the set of rules that helps us form correct sentences.`
        },
        {
          title: "Vocabulary",
          content: `Vocabulary means all the words we know and use while speaking and writing.`
        },
        {
          title: "Reading",
          content: `Reading helps improve language, imagination and knowledge.`
        }
      ]
    }
  ];

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const [lesson, setLesson] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  const speakLesson = () => {
    if (!lesson) return;

    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(lesson);
    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  const speakAnswer = () => {
    if (!answer) return;

    const speech = new SpeechSynthesisUtterance(answer);
    speech.lang = "en-US";
    speech.rate = 0.9;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="pl-64 p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">
        📚 AI Learning Assistant
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <GlassCard
  key={subject.name}
  className="cursor-pointer hover:border-cyan-400"
  onClick={() => {
    console.log("Clicked:", subject.name);
    setSelectedSubject(subject);
  }}
>
            <h2 className="text-2xl font-bold">
              {subject.name}
            </h2>
            <p className="mt-3 text-gray-400">
              {subject.chapters.length} Chapters
            </p>
          </GlassCard>
        ))}
      </div>

      {selectedSubject && (
        <GlassCard className="mt-10">
          <h2 className="text-3xl font-bold mb-6">
            {selectedSubject.name}
          </h2>
          <div className="space-y-4">
            {selectedSubject.chapters.map((chapter) => (
              <button
                key={chapter.title}
                className="w-full text-left bg-white/5 hover:bg-cyan-500/20 p-5 rounded-xl"
                onClick={async () => {
                  setSelectedChapter(chapter);
                  setLoading(true);
                  const data = await simplifyLesson(
                    chapter.title,
                    chapter.content
                  );
                  setLesson(data.lesson);
                  setLoading(false);
                }}
              >
                📖 {chapter.title}
              </button>
            ))}
          </div>
        </GlassCard>
      )}

      {selectedChapter && (
        <GlassCard className="mt-8">
          <h2 className="text-3xl font-bold mb-4">
            {selectedChapter.title}
          </h2>
          <button
            onClick={speakLesson}
            className="mb-5 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg"
          >
            <Volume2 size={18} />
            Listen to Lesson
          </button>

          {loading ? (
            <p>Generating AI lesson...</p>
          ) : (
            <div className="whitespace-pre-wrap leading-8">
              {lesson}
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3">
              Ask a Doubt
            </h3>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about this lesson..."
              className="w-full bg-white/5 p-4 rounded-xl mb-4"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  if (!recording) {
                    setRecording(true);
                    startListening(
                      (text) => {
                        setQuestion(text);
                      },
                      () => {
                        setRecording(false);
                      }
                    );
                  } else {
                    stopListening();
                    setRecording(false);
                  }
                }}
                className={`px-5 py-2 rounded-lg ${
                  recording ? "bg-red-500" : "bg-cyan-500"
                }`}
              >
                {recording ? <MicOff /> : <Mic />}
              </button>

              <button
                className="bg-cyan-500 px-6 py-2 rounded-lg"
                onClick={async () => {
                  if (!question) return;
                  setAsking(true);
                  const data = await askDoubt(
                    selectedChapter.title,
                    question
                  );
                  setAnswer(data.answer);
                  setAsking(false);
                }}
              >
                {asking ? "Thinking..." : "Ask AI"}
              </button>
            </div>
          </div>

          {answer && (
            <GlassCard className="mt-6 bg-cyan-500/10">
              <h3 className="font-semibold text-cyan-400 mb-2">
                AI Response
              </h3>

              <button
                onClick={speakAnswer}
                className="mb-3 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg"
              >
                <Volume2 size={18} />
                Listen Answer
              </button>

              <p className="text-gray-200 whitespace-pre-wrap">
                {answer}
              </p>
            </GlassCard>
          )}
        </GlassCard>
      )}
    </div>
  );
}