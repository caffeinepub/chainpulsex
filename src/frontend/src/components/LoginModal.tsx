import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

export function LoginModal({ onClose }: { onClose: () => void }) {
  const { login } = useApp();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    // Demo: "admin" username gets admin role
    const role = username.toLowerCase() === "admin" ? "admin" : "user";
    login(username, role);
    toast.success(`Welcome, ${username}! 🎉`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-sm p-6 rounded-2xl relative"
        style={{
          background: "oklch(0.16 0.025 265 / 0.95)",
          border: "1px solid oklch(0.82 0.18 195 / 0.3)",
          boxShadow: "0 0 40px oklch(0.82 0.18 195 / 0.15)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.18 195), oklch(0.55 0.22 295))",
            }}
          >
            <Zap size={16} className="text-black" />
          </div>
          <span className="font-bold neon-text-cyan">ChainPulseX</span>
        </div>

        <div className="flex gap-2 mb-6">
          {(["login", "register"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t
                  ? "btn-cyan"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={tab !== t ? { background: "oklch(0.20 0.02 265)" } : {}}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1">
              Username
            </Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username (try 'admin')"
              className="bg-muted/50 border-border"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1">
              Password
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="bg-muted/50 border-border"
            />
          </div>
          <Button type="submit" className="w-full btn-cyan">
            {tab === "login" ? "Login" : "Create Account"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Tip: Use username "admin" to access Admin panel
        </p>
      </div>
    </div>
  );
}
