  import React, { useState } from "react";
  import { Brain, ArrowRight, Loader2 } from "lucide-react";
  import GlassCard from "../components/GlassCard";
  import { useNavigate } from "react-router-dom";
  import { loginWithGoogle, studentLogin } from "../services/auth";
  import { useAuth } from "../context/AuthContext";

  export default function Login() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [role, setRole] = useState("teacher");
    
    // Student form state
    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    
    const { login } = useAuth();

    const handleGoogleLogin = async () => {
      try {
        setLoading(true);
        setError("");

        const user = await loginWithGoogle(role);

        login(user);
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.detail ||
          err.message ||
          "Google Sign In Failed"
        );
      } finally {
        setLoading(false);
      }
    };

    const handleStudentLogin = async () => {
      try {
        setLoading(true);
        setError("");

        const user = await studentLogin(studentId, password);

        login(user);
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.detail ||
          err.message ||
          "Invalid Student ID or Password"
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex bg-background relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/30 blur-[150px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-secondary/30 blur-[150px]" />
        </div>

        <div className="hidden lg:flex flex-1 items-center justify-center z-10 border-r border-white/5">
          <div className="relative w-full max-w-lg text-center">
            <Brain className="w-32 h-32 text-primary mx-auto mb-8" />
            <h1 className="text-5xl font-bold mb-5">NeuroBridge AI</h1>
            <p className="text-gray-400 text-lg">
              AI-powered communication and screening platform for neurodivergent students.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 z-10">
          <GlassCard className="w-full max-w-md p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="text-gray-400 mt-2">Sign in to your account</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2 text-gray-300">
                Login As
              </label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setError(""); // Clear errors when switching roles
                }}
                className="w-full bg-[#111827] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-gray-500 transition-colors"
              >
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            {/* Conditional Login Forms */}
            {role === "student" ? (
              <div className="space-y-4">
                <input
                  placeholder="Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-gray-500 transition-colors"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-gray-500 transition-colors"
                />
                <button
                  onClick={handleStudentLogin}
                  disabled={loading || !studentId || !password}
                  className="w-full bg-primary text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white text-black py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-200 transition"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09A6.96 6.96 0 015.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 001 12c0 1.78.43 3.45 1.18 4.93z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>

                
              </>
            )}

            {error && (
              <div className="mt-6 bg-red-500/10 border border-red-500 rounded-xl p-3 text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            <div className="mt-8 text-center text-xs text-gray-500">
              By signing in you agree to our Terms & Privacy Policy.
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }