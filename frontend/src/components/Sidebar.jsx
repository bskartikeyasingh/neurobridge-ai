import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Brain,
  MessageSquare,
  FileText,
  BookOpen,
  Bot
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  let menus = [];

  if (user?.role === "teacher") {
    menus = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: "Students",
        path: "/students",
        icon: <Users size={20} />,
      },
      {
        name: "Reports",
        path: "/reports",
        icon: <FileText size={20} />,
      },
      {
        name: "AI Copilot",
        path: "/copilot",
        icon: <Bot size={20} />,
      },
    ];
  } 
  else if (user?.role === "student") {
    menus = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: "Learning",
        path: "/learn",
        icon: <BookOpen size={20} />,
      },
      {
        name: "Communication",
        path: "/communication",
        icon: <MessageSquare size={20} />,
      },
      {
        name: "Reports",
        path: "/reports",
        icon: <FileText size={20} />,
      },
    ];
  } 
  else if (user?.role === "admin") {
    menus = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: "Users",
        path: "/users",
        icon: <Users size={20} />,
      },
      {
        name: "Reports",
        path: "/reports",
        icon: <FileText size={20} />,
      },
    ];
  }

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#101827] border-r border-gray-800 p-6">
      <h1 className="text-2xl font-bold text-cyan-400 mb-10">
        NeuroBridge AI
      </h1>
      
      <div className="mb-8">
        <p className="text-white font-semibold">
          {user?.name}
        </p>
        <p className="text-cyan-400 capitalize text-sm">
          {user?.role}
        </p>
      </div>

      <div className="space-y-3">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.25)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-2"
              }`
            }
          >
            {menu.icon}
            {menu.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}