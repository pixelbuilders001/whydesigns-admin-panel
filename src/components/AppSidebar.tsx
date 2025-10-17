import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Video,
  FileText,
  Image,
  Film,
  MessageSquare,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@/contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Banner", href: "/upload", icon: Upload },
  { name: "Course Videos", href: "/videos", icon: Video },
  { name: "PDF Materials", href: "/pdfs", icon: FileText },
  { name: "Images", href: "/images", icon: Image },
  { name: "Reels", href: "/reels", icon: Film },
  { name: "Blogs", href: "/blogs", icon: BookOpen },
  { name: "Meetings", href: "/meetings", icon: Calendar },
  { name: "Counselors", href: "/counselors", icon: Settings },
  // { name: "Testimonials", href: "/testimonials", icon: MessageSquare },
  // { name: "Settings", href: "/settings", icon: Settings },
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
        "bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <h1 className="text-lg font-semibold text-sidebar-foreground">
            Fashion Admin
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <nav className="px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-4 border-t">
        {isAuthenticated && !collapsed && (
          <div className="mb-3 p-3 bg-sidebar-accent rounded-md">
            <div className="text-sm font-medium text-sidebar-foreground">
              {userName || "User"}
            </div>
            <div className="text-xs text-sidebar-foreground/70 truncate">
              {userEmail}
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed ? "px-3" : "px-3"
          )}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
