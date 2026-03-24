import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronDown,
  DollarSign,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Shield,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { LoginModal } from "./LoginModal";
import { Link, useLocation } from "./RouterShim";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/markets", label: "Markets", icon: TrendingUp },
  { path: "/earning", label: "Earning", icon: DollarSign },
  { path: "/deposit", label: "Deposit", icon: Wallet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useApp();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const allNavItems =
    user.role === "admin"
      ? [...navItems, { path: "/admin", label: "Admin", icon: Shield }]
      : navItems;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "oklch(0.13 0.025 265 / 0.95)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid oklch(0.28 0.04 265 / 0.5)",
        }}
      >
        <div className="flex items-center gap-2 px-4 py-5 border-b border-border/50">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.18 195), oklch(0.55 0.22 295))",
            }}
          >
            <Zap size={16} className="text-black" />
          </div>
          <span className="font-bold text-sm tracking-wide neon-text-cyan">
            ChainPulseX
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {allNavItems.map(({ path, label, icon: Icon }) => {
            const active = location === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                style={
                  active
                    ? {
                        background: "oklch(0.82 0.18 195 / 0.15)",
                        border: "1px solid oklch(0.82 0.18 195 / 0.3)",
                        color: "oklch(0.82 0.18 195)",
                      }
                    : {}
                }
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {user.isLoggedIn && (
          <div
            className="m-3 p-3 rounded-lg"
            style={{
              background: "oklch(0.18 0.03 265 / 0.8)",
              border: "1px solid oklch(0.82 0.18 195 / 0.2)",
            }}
          >
            <p className="text-xs text-muted-foreground mb-1">Points Balance</p>
            <p className="text-lg font-bold neon-text-cyan">
              {user.points.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              ${(user.points / 1000).toFixed(2)} USD
            </p>
          </div>
        )}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Enter" && setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col md:ml-56 min-w-0">
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-4 h-14"
          style={{
            background: "oklch(0.13 0.025 265 / 0.9)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid oklch(0.28 0.04 265 / 0.5)",
          }}
        >
          <button
            type="button"
            className="md:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-1 md:hidden">
            <Zap size={14} className="neon-text-cyan" />
            <span className="text-sm font-bold neon-text-cyan">
              ChainPulseX
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {user.isLoggedIn ? (
              <>
                <button
                  type="button"
                  className="relative text-muted-foreground hover:text-foreground"
                >
                  <Bell size={18} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.75 0.18 195), oklch(0.55 0.22 295))",
                        }}
                      >
                        {user.username[0]?.toUpperCase()}
                      </div>
                      <span className="hidden sm:block text-sm font-medium">
                        {user.username}
                      </span>
                      <ChevronDown
                        size={14}
                        className="text-muted-foreground"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-destructive"
                    >
                      <LogOut size={14} className="mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                size="sm"
                className="btn-cyan"
                onClick={() => setShowLogin(true)}
              >
                <LogIn size={14} className="mr-1" /> Login
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
