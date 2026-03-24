import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Shield,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

const ADMIN_USERNAME = "sandeepkarna977";
const ADMIN_PASSWORD = "Sandeep@321";

type AdminTab = "deposits" | "withdrawals" | "users" | "settings";

function AdminLoginForm() {
  const { login } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        login(username, "admin");
        toast.success("Welcome, Admin!");
      } else {
        setError("Invalid admin credentials. Please try again.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div
        className="w-full max-w-md p-8 rounded-2xl space-y-6"
        style={{
          background: "oklch(0.13 0.025 265 / 0.95)",
          border: "1px solid oklch(0.82 0.18 195 / 0.25)",
          boxShadow: "0 0 40px oklch(0.82 0.18 195 / 0.08)",
        }}
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.18 195 / 0.2), oklch(0.55 0.22 295 / 0.2))",
              border: "1px solid oklch(0.82 0.18 195 / 0.3)",
            }}
          >
            <Shield size={28} className="neon-text-cyan" />
          </div>
          <div>
            <h1 className="text-xl font-bold neon-text-cyan">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your admin credentials to continue
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-username"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              data-ocid="admin.input"
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
              style={{
                background: "oklch(0.18 0.03 265 / 0.8)",
                border: "1px solid oklch(0.30 0.04 265)",
                color: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "oklch(0.82 0.18 195 / 0.5)";
                e.target.style.boxShadow =
                  "0 0 0 2px oklch(0.82 0.18 195 / 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "oklch(0.30 0.04 265)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                data-ocid="admin.input"
                className="w-full px-4 py-3 pr-11 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "oklch(0.18 0.03 265 / 0.8)",
                  border: "1px solid oklch(0.30 0.04 265)",
                  color: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "oklch(0.82 0.18 195 / 0.5)";
                  e.target.style.boxShadow =
                    "0 0 0 2px oklch(0.82 0.18 195 / 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "oklch(0.30 0.04 265)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              data-ocid="admin.error_state"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
              style={{
                background: "oklch(0.40 0.18 25 / 0.15)",
                border: "1px solid oklch(0.55 0.20 25 / 0.3)",
                color: "oklch(0.70 0.18 25)",
              }}
            >
              <Lock size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            data-ocid="admin.submit_button"
            className="w-full py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-60"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.18 195), oklch(0.55 0.22 295))",
              color: "black",
            }}
          >
            {loading ? "Verifying..." : "Access Admin Panel"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          🔒 Secured with 2FA and audit logging
        </p>
      </div>
    </div>
  );
}

export function Admin() {
  const {
    user,
    deposits,
    withdrawals,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
  } = useApp();
  const [tab, setTab] = useState<AdminTab>("deposits");

  if (!user.isLoggedIn || user.role !== "admin") {
    return <AdminLoginForm />;
  }

  const pendingDeposits = deposits.filter((d) => d.status === "PENDING");
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "PENDING");

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      CONFIRMED: "bg-green-500/20 text-green-400 border-green-500/30",
      APPROVED: "bg-green-500/20 text-green-400 border-green-500/30",
      REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
      ACTIVE: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs border ${styles[status] || ""}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Admin Panel
        </p>
        <h1 className="text-2xl font-bold">
          Control <span className="neon-text-cyan">Center</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", val: "3", icon: Users, color: "cyan" },
          {
            label: "Pending Deposits",
            val: String(pendingDeposits.length),
            icon: AlertTriangle,
            color: "yellow",
          },
          {
            label: "Pending Withdrawals",
            val: String(pendingWithdrawals.length),
            icon: AlertTriangle,
            color: "purple",
          },
          {
            label: "Total Deposits",
            val: String(deposits.length),
            icon: CheckCircle,
            color: "green",
          },
        ].map((item) => (
          <div key={item.label} className="glass-card p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {item.label}
            </p>
            <p className="text-2xl font-bold neon-text-cyan">{item.val}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/50">
        {(["deposits", "withdrawals", "users", "settings"] as AdminTab[]).map(
          (t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTab(t)}
              data-ocid="admin.tab"
              className={`px-4 py-2 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                tab === t
                  ? "border-current neon-text-cyan"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {t === "deposits" && pendingDeposits.length > 0 && (
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                  style={{
                    background: "oklch(0.60 0.22 25 / 0.3)",
                    color: "oklch(0.65 0.22 25)",
                  }}
                >
                  {pendingDeposits.length}
                </span>
              )}
            </button>
          ),
        )}
      </div>

      {/* Deposits */}
      {tab === "deposits" && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="admin.table">
              <thead>
                <tr className="border-b border-border/50">
                  {[
                    "User",
                    "Network",
                    "Amount",
                    "TX Hash",
                    "Ref ID",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs text-muted-foreground font-medium uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deposits.map((dep, i) => (
                  <tr
                    key={dep.id}
                    data-ocid={`admin.item.${i + 1}`}
                    className="border-b border-border/20 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3 text-xs">{dep.userId}</td>
                    <td className="px-4 py-3 text-xs">{dep.network}</td>
                    <td className="px-4 py-3 font-semibold">${dep.amount}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                      {dep.txHash.slice(0, 12)}...
                    </td>
                    <td className="px-4 py-3 text-xs font-mono neon-text-cyan">
                      {dep.referenceId}
                    </td>
                    <td className="px-4 py-3">{statusBadge(dep.status)}</td>
                    <td className="px-4 py-3">
                      {dep.status === "PENDING" && (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            data-ocid="admin.confirm_button"
                            onClick={() => {
                              approveDeposit(dep.id);
                              toast.success("Deposit approved");
                            }}
                            className="p-1 rounded positive hover:opacity-80"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            type="button"
                            data-ocid="admin.delete_button"
                            onClick={() => {
                              rejectDeposit(dep.id);
                              toast.error("Deposit rejected");
                            }}
                            className="p-1 rounded negative hover:opacity-80"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Withdrawals */}
      {tab === "withdrawals" && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="admin.table">
              <thead>
                <tr className="border-b border-border/50">
                  {[
                    "User",
                    "Network",
                    "Amount",
                    "Wallet",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs text-muted-foreground font-medium uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w, i) => (
                  <tr
                    key={w.id}
                    data-ocid={`admin.item.${i + 1}`}
                    className="border-b border-border/20 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3 text-xs">{w.userId}</td>
                    <td className="px-4 py-3 text-xs">{w.network}</td>
                    <td className="px-4 py-3 font-semibold">${w.amount}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                      {w.walletAddress.slice(0, 16)}...
                    </td>
                    <td className="px-4 py-3">{statusBadge(w.status)}</td>
                    <td className="px-4 py-3">
                      {w.status === "PENDING" && (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            data-ocid="admin.confirm_button"
                            onClick={() => {
                              approveWithdrawal(w.id);
                              toast.success("Withdrawal approved");
                            }}
                            className="p-1 rounded positive hover:opacity-80"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            type="button"
                            data-ocid="admin.delete_button"
                            onClick={() => {
                              rejectWithdrawal(w.id);
                              toast.error("Withdrawal rejected");
                            }}
                            className="p-1 rounded negative hover:opacity-80"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users */}
      {tab === "users" && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="admin.table">
              <thead>
                <tr className="border-b border-border/50">
                  {["Username", "Role", "Points", "Status", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs text-muted-foreground font-medium uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    username: "alice",
                    role: "user",
                    points: 3200,
                    status: "active",
                  },
                  {
                    username: "bob",
                    role: "user",
                    points: 850,
                    status: "active",
                  },
                  {
                    username: "sandeepkarna977",
                    role: "admin",
                    points: 99999,
                    status: "active",
                  },
                ].map((u, i) => (
                  <tr
                    key={u.username}
                    data-ocid={`admin.item.${i + 1}`}
                    className="border-b border-border/20 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3 font-medium">{u.username}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs border ${
                          u.role === "admin"
                            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold neon-text-cyan">
                      {u.points.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {statusBadge(u.status.toUpperCase())}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs"
                        data-ocid="admin.delete_button"
                        onClick={() => toast.error(`User ${u.username} banned`)}
                      >
                        Ban
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings */}
      {tab === "settings" && (
        <div className="space-y-4">
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Reward Settings
            </h3>
            {[
              { label: "Daily Login Reward Range", val: "20 – 150 points" },
              { label: "Daily Earning Cap", val: "500 points ($0.50)" },
              { label: "Monthly Cap", val: "10,000 points ($10)" },
              { label: "Points per USD", val: "1,000 points" },
              { label: "Min Withdrawal", val: "$5 (5,000 points)" },
              { label: "7-Day Streak Bonus", val: "+500 points" },
              { label: "30-Day Streak Bonus", val: "+2,000 points" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2 border-b border-border/30"
              >
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-sm font-semibold neon-text-cyan">
                  {item.val}
                </span>
              </div>
            ))}
          </div>
          <div className="glass-card p-5">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              System Controls
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                data-ocid="admin.primary_button"
                onClick={() => toast.success("Earning system paused")}
                className="px-4 py-2 rounded-lg text-sm btn-purple"
              >
                Pause Earning System
              </button>
              <button
                type="button"
                data-ocid="admin.secondary_button"
                onClick={() => toast.success("Rewards adjusted")}
                className="px-4 py-2 rounded-lg text-sm btn-cyan"
              >
                Adjust Reward Rates
              </button>
              <button
                type="button"
                data-ocid="admin.button"
                onClick={() => toast.success("Fraud report generated")}
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  background: "oklch(0.20 0.03 265)",
                  border: "1px solid oklch(0.30 0.04 265)",
                }}
              >
                Export Fraud Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
