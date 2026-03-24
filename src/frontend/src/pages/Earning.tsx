import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Flame, Gift, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

export function Earning() {
  const { user, tasks, claimDailyReward, completeTask } = useApp();
  const [tab, setTab] = useState<"tasks" | "referral" | "history">("tasks");

  const handleDailyClaim = () => {
    if (!user.isLoggedIn) {
      toast.error("Please login first");
      return;
    }
    if (user.claimedToday) {
      toast.error("Already claimed today!");
      return;
    }
    const pts = claimDailyReward();
    toast.success(`+${pts} points claimed! 🔥`);
  };

  const handleTaskClaim = (taskId: string) => {
    if (!user.isLoggedIn) {
      toast.error("Please login first");
      return;
    }
    completeTask(taskId);
    toast.success("Task completed! Points added.");
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(
      `https://chainpulsex.io/ref/${user.referralCode}`,
    );
    toast.success("Referral link copied!");
  };

  const mockHistory = [
    { date: "2026-03-22", action: "Daily Login", points: 85 },
    { date: "2026-03-22", action: "Task: Explore Tokens", points: 30 },
    { date: "2026-03-21", action: "Daily Login", points: 62 },
    { date: "2026-03-21", action: "Task: Email Verify", points: 100 },
    { date: "2026-03-20", action: "Referral Bonus", points: 1000 },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Earning Center
        </p>
        <h1 className="text-2xl font-bold">
          Earn <span className="neon-text-cyan">Points & Rewards</span>
        </h1>
      </div>

      {/* Balance + Daily Claim */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card-cyan p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Total Points
          </p>
          <p className="text-4xl font-bold neon-text-cyan">
            {user.points.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            ${(user.points / 1000).toFixed(3)} USD equivalent
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min((user.dailyEarned / 500) * 100, 100)}%`,
                background:
                  "linear-gradient(90deg, oklch(0.75 0.18 195), oklch(0.55 0.22 295))",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {user.dailyEarned}/500 daily cap
          </p>
        </div>

        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Daily Login Reward
            </p>
            <p className="text-sm text-muted-foreground">
              20–150 points per day
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Flame size={14} className="text-orange-400" />
              <span className="text-sm">{user.streak} day streak</span>
              {user.streak >= 7 && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{
                    background: "oklch(0.55 0.22 295 / 0.3)",
                    color: "oklch(0.72 0.22 295)",
                  }}
                >
                  Bonus Active!
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {user.streak % 7 === 0 && user.streak > 0
                ? "7-day bonus: +500 pts"
                : `${7 - (user.streak % 7)} days to 7-day bonus`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleDailyClaim}
            disabled={user.claimedToday}
            className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              user.claimedToday
                ? "opacity-50 cursor-not-allowed"
                : "btn-cyan pulse-glow"
            }`}
            style={
              user.claimedToday ? { background: "oklch(0.22 0.03 265)" } : {}
            }
          >
            <Flame size={16} />
            {user.claimedToday ? "Claimed ✓" : "Claim Daily Reward"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/50 pb-0">
        {(["tasks", "referral", "history"] as const).map((t) => (
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
          </button>
        ))}
      </div>

      {/* Tasks */}
      {tab === "tasks" && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`glass-card p-4 flex items-center gap-4 ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{task.title}</p>
                  {task.completed && (
                    <CheckCircle size={14} className="positive" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {task.description}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold neon-text-cyan">
                  +{task.points} pts
                </p>
                {!task.completed && (
                  <Button
                    size="sm"
                    onClick={() => handleTaskClaim(task.id)}
                    className="mt-1 text-xs h-7 btn-cyan px-3"
                  >
                    Claim
                  </Button>
                )}
                {task.completed && (
                  <p className="text-xs positive mt-1">Done</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Referral */}
      {tab === "referral" && (
        <div className="space-y-4">
          <div className="glass-card-purple p-5">
            <div className="flex items-center gap-2 mb-3">
              <Gift size={16} className="neon-text-purple" />
              <h3 className="font-semibold">Your Referral Program</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Earn $1–$3 per verified referral. Reward paid after they complete
              KYC + activity.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Referral Reward", val: "$1-$3" },
                { label: "Daily Cap", val: "10 refs" },
                { label: "Your Refs", val: "0" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-lg text-center"
                  style={{ background: "oklch(0.18 0.03 265 / 0.6)" }}
                >
                  <p className="text-lg font-bold neon-text-purple">
                    {item.val}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            {user.isLoggedIn ? (
              <div className="flex gap-2">
                <div
                  className="flex-1 px-3 py-2.5 rounded-lg text-xs font-mono truncate"
                  style={{
                    background: "oklch(0.18 0.03 265)",
                    border: "1px solid oklch(0.30 0.04 265)",
                  }}
                >
                  chainpulsex.io/ref/{user.referralCode}
                </div>
                <button
                  type="button"
                  onClick={copyReferral}
                  className="px-3 py-2.5 rounded-lg btn-purple text-sm"
                >
                  <Copy size={14} />
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Login to get your referral code
              </p>
            )}
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-muted-foreground" />
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Anti-Fraud Policy
              </p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>
                • Reward only after referral completes KYC + real activity
              </li>
              <li>• Duplicate accounts auto-detected & banned</li>
              <li>• Daily referral cap enforced</li>
              <li>• VPN/proxy users may be flagged</li>
            </ul>
          </div>
        </div>
      )}

      {/* History */}
      {tab === "history" && (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                {["Date", "Action", "Points"].map((h) => (
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
              {mockHistory.map((row) => (
                <tr
                  key={`${row.date}-${row.action}`}
                  className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {row.date}
                  </td>
                  <td className="px-4 py-3 text-sm">{row.action}</td>
                  <td className="px-4 py-3 text-sm font-semibold positive">
                    +{row.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
