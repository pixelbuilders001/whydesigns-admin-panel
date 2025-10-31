import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Video,
  FileText,
  Film,
  MessageSquare,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  BookOpen,
  Calendar,
  UserCheck,
  IdCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@/contexts/AuthContext";
import logo from "../assets/logo.png"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Leads", href: "/leads", icon: UserCheck },
  { name: "Banner", href: "/upload", icon: Upload },
  { name: "Course Videos", href: "/videos", icon: Video },
  { name: "PDF Materials", href: "/pdfs", icon: FileText },
  { name: "Reels", href: "/reels", icon: Film },
  { name: "Blogs", href: "/blogs", icon: BookOpen },
  { name: "Meetings", href: "/meetings", icon: Calendar },
  { name: "Counselors", href: "/counselors", icon: Settings },
  { name: "Team", href: "/team", icon: IdCard },
  { name: "Testimonials", href: "/testimonials", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { userName, userEmail, isAuthenticated } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen backdrop-blur-xl bg-white/70 border-r border-gray-200 shadow-xl transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-12 items-center justify-between px-5 border-b border-gray-200 shrink-0">
        {!collapsed && (
          <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text flex items-center gap-2">
            <img src={logo} alt="logo" className="w-1/5" /> Whydesigns
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:bg-gray-100"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {navigation.map((item) => {
         const isActive =
         item.href === "/"
           ? location.pathname === "/"
           : location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  "transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout Section (Fixed at bottom) */}
      <div className="border-t border-gray-200 px-3 py-5 space-y-3 shrink-0">
        {isAuthenticated && !collapsed && (
          <div className="p-3 rounded-xl bg-gray-100/70">
            <div className="text-sm font-semibold text-gray-800">
              {userName || "User"}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {userEmail}
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200",
            collapsed && "px-3 justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>

      {/* Gradient Accent Glow */}
      <div className="absolute right-0 top-0 h-full w-[3px] bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
    </div>
  );
}
