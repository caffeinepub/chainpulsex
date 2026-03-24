import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  Shield,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

type AdminTab = "deposits" | "withdrawals" | "users" | "settings";

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
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Shield size={48} className="text-muted-foreground" />
        <p className="text-muted-foreground">Admin access required</p>
        <p className="text-xs text-muted-foreground">
          Login with username "admin" to access
        </p>
      </div>
    );
  }

  const pendingDeposits = deposits.filter((d) => d.status === "PENDING");
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "PENDING");

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      CONFIRMED: "bg-green-500/20 text-green-400 border-green-500/30",
      APPROVED: "bg-green-500/20 text-green-400 border-green-500/30",
      REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
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
            <table className="w-full text-sm">
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
                {deposits.map((dep) => (
                  <tr
                    key={dep.id}
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
            <table className="w-full text-sm">
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
                {withdrawals.map((w) => (
                  <tr
                    key={w.id}
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
            <table className="w-full text-sm">
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
                    username: "admin",
                    role: "admin",
                    points: 99999,
                    status: "active",
                  },
                ].map((u) => (
                  <tr
                    key={u.username}
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
                onClick={() => toast.success("Earning system paused")}
                className="px-4 py-2 rounded-lg text-sm btn-purple"
              >
                Pause Earning System
              </button>
              <button
                type="button"
                onClick={() => toast.success("Rewards adjusted")}
                className="px-4 py-2 rounded-lg text-sm btn-cyan"
              >
                Adjust Reward Rates
              </button>
              <button
                type="button"
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
