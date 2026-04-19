import { LayoutDashboard, FolderKanban, AlertTriangle, Map, BookOpen, Presentation } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import jessicaAvatar from "@/assets/jessica-avatar.jpg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Programs", url: "/programs", icon: FolderKanban },
  { title: "Risks", url: "/risks", icon: AlertTriangle },
  { title: "Roadmap", url: "/roadmap", icon: Map },
  { title: "Exec Briefing", url: "/executive-briefing", icon: Presentation },
  { title: "My Approach", url: "/my-approach", icon: BookOpen },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="px-4 py-5 flex items-center gap-2.5 min-h-[56px]">
        {collapsed ? (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="2" />
              <path d="M8 8h4a4 4 0 0 1 0 8H8V8z" fill="white" fillOpacity="0.9" />
              <line x1="8" y1="8" x2="8" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="2" />
                <path d="M8 8h4a4 4 0 0 1 0 8H8V8z" fill="white" fillOpacity="0.9" />
                <line x1="8" y1="8" x2="8" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-white/90 font-semibold text-[15px] tracking-tight">
              Program<span className="font-bold text-white">IQ</span>
            </span>
          </div>
        )}
      </div>

      {/* Nova Systems workspace label */}
      {!collapsed && (
        <div className="px-4 pb-2">
          <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Nova Systems</span>
        </div>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-white/10 rounded-xl text-white/65 text-[15px] font-semibold transition-colors duration-150"
                      activeClassName="bg-white/18 text-white font-bold shadow-sm"
                    >
                      <item.icon className="h-[18px] w-[18px]" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <img
            src={jessicaAvatar}
            alt="Jessica Manzo"
            className="h-9 w-9 rounded-lg object-cover shrink-0"
            loading="lazy"
          />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-white text-sm font-medium truncate">Jessica Manzo</span>
              <span className="text-white/50 text-xs truncate">Senior TPM</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
