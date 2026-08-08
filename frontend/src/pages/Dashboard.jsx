import React, { useEffect, useState, useMemo } from "react";
import GlassCard from "../components/GlassCard";
import Sidebar from "../components/Sidebar";

import { getStudentCount } from "../services/student";
import { logout } from "../services/auth";

import { useNavigate } from "react-router-dom";

import {
  Users,
  Activity,
  FileText,
  Brain,
  Search,
  Bell,
  LogOut,
  BookOpen
} from "lucide-react";

import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();

  const [studentCount, setStudentCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || "teacher";

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const count = await getStudentCount();
      setStudentCount(count);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const stats = role === "teacher" ? [
    {
      icon: <Users />,
      label: "Students",
      value: studentCount,
      change: "Live"
    },
    {
      icon: <Activity />,
      label: "Sessions",
      value: "28",
      change: "+5"
    },
    {
      icon: <Brain />,
      label: "Screenings",
      value: "16",
      change: "+2"
    },
    {
      icon: <FileText />,
      label: "Reports",
      value: "42",
      change: "+4"
    }
  ] : role === "student" ? [
    {
      icon: <BookOpen />,
      label: "Lessons",
      value: "12",
      change: "+1"
    },
    {
      icon: <Brain />,
      label: "AI Chats",
      value: "18",
      change: "+3"
    },
    {
      icon: <Activity />,
      label: "Progress",
      value: "82%",
      change: "+8%"
    },
    {
      icon: <FileText />,
      label: "Reports",
      value: "4",
      change: "Latest"
    }
  ] : [
    {
      icon: <Users />,
      label: "Teachers",
      value: "10",
      change: "Live"
    },
    {
      icon: <Users />,
      label: "Students",
      value: studentCount,
      change: "Live"
    },
    {
      icon: <Brain />,
      label: "AI Reports",
      value: "65",
      change: "+6"
    },
    {
      icon: <FileText />,
      label: "System",
      value: "Healthy",
      change: "100%"
    }
  ];

  const notifications = [
    {
      title: "New Screening Completed",
      message: "Rahul Kumar screening report is ready."
    },
    {
      title: "Communication Analysis",
      message: "An AI communication session was completed."
    },
    {
      title: "Learning Progress",
      message: "A student completed today's lesson."
    }
  ];

  return (
    <>
      <Sidebar />

      <div className="pl-64 pt-8 p-8 min-h-screen">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              {role === "teacher"
                ? "Teacher Dashboard"
                : role === "student"
                ? "Student Dashboard"
                : "Admin Dashboard"}
            </h1>

            <p className="text-gray-400 mt-2">
              Welcome back, {user.name}
              {role === "teacher" && " • Monitor students and generate AI reports"}
              {role === "student" && " • Continue your personalized learning"}
              {role === "admin" && " • Manage platform users"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input (Redirects on Enter Key) */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search students..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate("/students?search=" + e.target.value);
                  }
                }}
                className="bg-card border border-cardBorder rounded-full pl-10 pr-4 py-2 w-64"
              />
            </div>

            {/* Bell/Notification Toggle Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="glass-card p-2 rounded-full relative"
              >
                <Bell />
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-[#111827] border border-gray-700 rounded-xl shadow-xl z-50">
                  <div className="p-4 border-b border-gray-700 font-semibold">
                    Notifications
                  </div>
                  {notifications.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border-b border-gray-700 hover:bg-white/5"
                    >
                      <h4 className="font-semibold text-cyan-400">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-300">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <img
                src={
                  user.picture ||
                  user.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || "User"
                  )}`
                }
                className="w-11 h-11 rounded-full"
                alt="Profile"
              />

              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-500/20"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <div className="bg-white/5 p-3 rounded-xl">
                    {stat.icon}
                  </div>
                  <span className="text-accent text-sm">
                    {stat.change}
                  </span>
                </div>

                <div>
                  <h2 className="text-3xl font-bold">
                    {stat.value}
                  </h2>
                  <p className="text-gray-400">
                    {stat.label}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Data Visualization Sections */}
        <div className="grid lg:grid-cols-3 gap-8">
          <GlassCard className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-5">
              AI Communication Activity
            </h2>

            <div className="h-64 flex items-end gap-2">
              {[40, 70, 50, 90, 60, 85, 95, 55, 75, 65, 80, 100].map((item, index) => (
                <div
                  key={index}
                  className="flex-1 bg-white/5 rounded relative"
                >
                  <div
                    className="absolute bottom-0 w-full rounded bg-gradient-to-t from-cyan-500 to-blue-500"
                    style={{ height: `${item}%` }}
                  />
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-semibold mb-5">
              Emotion Distribution
            </h2>

            {[
              ["Happy", 65, "bg-green-500"],
              ["Neutral", 20, "bg-blue-500"],
              ["Anxious", 10, "bg-yellow-500"],
              ["Stress", 5, "bg-red-500"]
            ].map((e) => (
              <div key={e[0]} className="mb-5">
                <div className="flex justify-between mb-2">
                  <span>{e[0]}</span>
                  <span>{e[1]}%</span>
                </div>

                <div className="h-2 rounded bg-white/5">
                  <div
                    className={`h-full rounded ${e[2]}`}
                    style={{ width: `${e[1]}%` }}
                  />
                </div>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </>
  );
}