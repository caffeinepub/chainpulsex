import {
  ArrowRight,
  DollarSign,
  Flame,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "../components/RouterShim";
import { Sparkline } from "../components/Sparkline";
import { useApp } from "../context/AppContext";
import { formatPrice, tokens } from "../data/tokens";

export function Dashboard() {
  const { user, claimDailyReward } = useApp();

  const handleClaim = () => {
    if (!user.isLoggedIn) {
      toast.error("Please login first");
      return;
    }
    if (user.claimedToday) {
      toast.error("Already claimed today! Come back tomorrow.");
      return;
    }
    const pts = claimDailyReward();
    toast.success(`🎉 Daily reward claimed: +${pts} points!`);
  };

  const trending = tokens.slice(0, 5);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Dashboard Overview
        </p>
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back,{" "}
          <span className="neon-text-cyan">
            {user.isLoggedIn ? user.username : "Trader"}
          </span>
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card-cyan p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Points Balance
            </p>
            <Wallet size={16} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{user.points.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            ${(user.points / 1000).toFixed(2)} USD equiv.
          </p>
        </div>

        <div className="glass-card-purple p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Today's Earned
            </p>
            <DollarSign size={16} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold neon-text-purple">
            {user.dailyEarned}
          </p>
          <p className="text-xs text-muted-foreground mt-1">of 500 daily cap</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Login Streak
            </p>
            <Flame size={16} className="text-orange-400" />
          </div>
          <p className="text-2xl font-bold">
            {user.streak}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              days
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {7 - (user.streak % 7)} days to next bonus
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleClaim}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            user.claimedToday
              ? "opacity-50 cursor-not-allowed"
              : "btn-cyan pulse-glow"
          }`}
          style={
            user.claimedToday
              ? {
                  background: "oklch(0.22 0.03 265)",
                  color: "oklch(0.60 0.04 265)",
                }
              : {}
          }
          disabled={user.claimedToday}
        >
          <Flame size={16} />
          {user.claimedToday ? "Claimed Today" : "Claim Daily Reward"}
        </button>
        <Link
          to="/deposit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold btn-purple"
        >
          <Wallet size={16} /> Deposit
        </Link>
        <Link
          to="/earning"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: "oklch(0.20 0.03 265)",
            border: "1px solid oklch(0.30 0.04 265)",
          }}
        >
          <DollarSign size={16} /> Earn More
        </Link>
      </div>

      {/* Live Prices */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
              style={{ background: "oklch(0.82 0.18 195)" }}
            >
              1
            </span>
            <h2 className="font-semibold text-sm uppercase tracking-wide">
              Live Token Prices
            </h2>
          </div>
          <Link
            to="/markets"
            className="text-xs neon-text-cyan flex items-center gap-1 hover:opacity-80"
          >
            View All <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-2">
          {trending.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: `${token.color}33`, color: token.color }}
              >
                {token.symbol[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{token.name}</p>
                <p className="text-xs text-muted-foreground">{token.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {formatPrice(token.price)}
                </p>
                <p
                  className={`text-xs flex items-center gap-1 justify-end ${
                    token.change24h >= 0 ? "positive" : "negative"
                  }`}
                >
                  {token.change24h >= 0 ? (
                    <TrendingUp size={10} />
                  ) : (
                    <TrendingDown size={10} />
                  )}
                  {token.change24h >= 0 ? "+" : ""}
                  {token.change24h}%
                </p>
              </div>
              <div className="hidden sm:block">
                <Sparkline
                  data={token.sparkline}
                  positive={token.change24h >= 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earning Preview */}
      <div className="glass-card-purple p-5">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "oklch(0.55 0.22 295)" }}
          >
            2
          </span>
          <h2 className="font-semibold text-sm uppercase tracking-wide">
            Earning Dashboard
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Daily Login", reward: "20-150 pts", icon: "🔥" },
            { label: "Tasks", reward: "10-200 pts", icon: "✅" },
            { label: "Referrals", reward: "$1-3 each", icon: "👥" },
            { label: "Daily Cap", reward: "500 pts max", icon: "⚡" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-lg text-center"
              style={{ background: "oklch(0.18 0.03 265 / 0.6)" }}
            >
              <p className="text-xl mb-1">{item.icon}</p>
              <p className="text-xs font-medium">{item.label}</p>
              <p className="text-xs neon-text-purple mt-1">{item.reward}</p>
            </div>
          ))}
        </div>
        <Link
          to="/earning"
          className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold btn-purple"
        >
          Go to Earning Center <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
