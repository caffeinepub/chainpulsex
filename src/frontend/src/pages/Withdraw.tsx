import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

const MIN_WITHDRAWAL_USD = 5;
const POINTS_PER_USD = 1000;

export function Withdraw() {
  const { user, addWithdrawal } = useApp();
  const [network, setNetwork] = useState<"TRC20" | "BEP20">("TRC20");
  const [address, setAddress] = useState("");
  const [amountUsd, setAmountUsd] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const availableUsd = user.points / POINTS_PER_USD;
  const pointsNeeded = Number(amountUsd) * POINTS_PER_USD;
  const hasEnough =
    user.points >= pointsNeeded && Number(amountUsd) >= MIN_WITHDRAWAL_USD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.isLoggedIn) {
      toast.error("Please login first");
      return;
    }
    if (Number(amountUsd) < MIN_WITHDRAWAL_USD) {
      toast.error(`Minimum withdrawal is $${MIN_WITHDRAWAL_USD}`);
      return;
    }
    if (!hasEnough) {
      toast.error("Insufficient points balance");
      return;
    }
    if (!address) {
      toast.error("Please enter wallet address");
      return;
    }
    addWithdrawal({
      amount: Number(amountUsd),
      walletAddress: address,
      network,
      status: "PENDING",
    });
    setSubmitted(true);
    toast.success("Withdrawal request submitted!");
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center">
        <div className="glass-card-cyan p-8">
          <CheckCircle size={48} className="neon-text-cyan mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Request Submitted!</h2>
          <p className="text-sm text-muted-foreground">
            Your withdrawal of <strong>${amountUsd} USDT</strong> on {network}{" "}
            is pending review. Processing time: 24–72 hours.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setAmountUsd("");
              setAddress("");
            }}
            className="mt-5 px-6 py-2.5 rounded-xl text-sm font-semibold btn-cyan"
          >
            New Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Withdrawal
        </p>
        <h1 className="text-2xl font-bold">
          Withdraw <span className="neon-text-cyan">Funds</span>
        </h1>
      </div>

      {/* Balance */}
      <div className="glass-card-cyan p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Available Balance
        </p>
        <p className="text-3xl font-bold">
          {user.points.toLocaleString()}{" "}
          <span className="text-sm font-normal text-muted-foreground">pts</span>
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          ${availableUsd.toFixed(3)} USD
        </p>
      </div>

      {/* Limits */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: "Min Withdrawal", val: "$5 (5,000 pts)" },
          { label: "Processing", val: "24–72 hrs" },
          { label: "Networks", val: "TRC20 / BEP20" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex-1 min-w-[120px] p-3 rounded-lg text-center glass-card"
          >
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-semibold mt-1">{item.val}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card p-5 space-y-4">
        {/* Network */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2">Network</Label>
          <div className="flex gap-2">
            {(["TRC20", "BEP20"] as const).map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setNetwork(n)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  network === n ? "btn-cyan" : "text-muted-foreground"
                }`}
                style={
                  network !== n
                    ? {
                        background: "oklch(0.20 0.03 265)",
                        border: "1px solid oklch(0.30 0.04 265)",
                      }
                    : {}
                }
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1">
            Wallet Address ({network})
          </Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={network === "TRC20" ? "T..." : "0x..."}
            className="bg-muted/50 border-border font-mono text-xs"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1">
            Amount (USD)
          </Label>
          <Input
            type="number"
            value={amountUsd}
            onChange={(e) => setAmountUsd(e.target.value)}
            placeholder="Minimum $5"
            min="5"
            className="bg-muted/50 border-border"
          />
          {amountUsd && (
            <p className="text-xs text-muted-foreground mt-1">
              = {pointsNeeded.toLocaleString()} points
              {!hasEnough && Number(amountUsd) >= MIN_WITHDRAWAL_USD && (
                <span className="negative ml-2">Insufficient balance</span>
              )}
            </p>
          )}
        </div>

        <div
          className="flex items-start gap-2 px-3 py-2 rounded-lg"
          style={{
            background: "oklch(0.60 0.22 25 / 0.08)",
            border: "1px solid oklch(0.60 0.22 25 / 0.2)",
          }}
        >
          <AlertCircle size={14} className="negative mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Withdrawal requests are manually reviewed. Fraudulent activity
            results in permanent ban.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full btn-purple"
          disabled={!user.isLoggedIn || !hasEnough || !address}
        >
          {!user.isLoggedIn ? "Login to Withdraw" : "Submit Withdrawal Request"}
        </Button>
      </form>
    </div>
  );
}
