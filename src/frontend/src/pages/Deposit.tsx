import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Clock, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

const TRC20_ADDRESS = "THS4eZw4H6Xqdhnkdt3Up52ZSHQTKg6zRH";
const BEP20_ADDRESS = "0x95807b190b65c6b6d907527ff9fd4ef657099719";

function generateRef() {
  return `CPX${Math.floor(10000000 + Math.random() * 90000000)}`;
}

export function Deposit() {
  const { addDeposit } = useApp();
  const [network, setNetwork] = useState<"TRC20" | "BEP20" | "BYBIT">("TRC20");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [refId] = useState(generateRef);
  const [timeLeft, setTimeLeft] = useState(600);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const address = network === "TRC20" ? TRC20_ADDRESS : BEP20_ADDRESS;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied!");
  };

  const copyRef = () => {
    navigator.clipboard.writeText(refId);
    toast.success("Reference ID copied!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !txHash) {
      toast.error("Please fill all fields");
      return;
    }
    addDeposit({
      network,
      amount: Number(amount),
      txHash,
      status: "PENDING",
      referenceId: refId,
    });
    setSubmitted(true);
    toast.success("Deposit submitted! Pending verification.");
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center">
        <div className="glass-card-cyan p-8">
          <CheckCircle size={48} className="neon-text-cyan mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Deposit Submitted!</h2>
          <p className="text-muted-foreground text-sm mb-2">
            Reference ID:{" "}
            <span className="font-mono neon-text-cyan">{refId}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Your deposit is pending admin verification (24-72 hrs). You'll see
            it in your history once approved.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-5 px-6 py-2.5 rounded-xl text-sm font-semibold btn-cyan"
          >
            Make Another Deposit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Deposit Funds
        </p>
        <h1 className="text-2xl font-bold">
          Add <span className="neon-text-cyan">Funds</span>
        </h1>
      </div>

      {/* Network Tabs */}
      <div className="flex gap-2">
        {(["TRC20", "BEP20", "BYBIT"] as const).map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setNetwork(n)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              network === n
                ? "btn-cyan"
                : "text-muted-foreground hover:text-foreground"
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
            {n === "BYBIT" ? "Bybit Pay" : n}
          </button>
        ))}
      </div>

      {/* Expiry */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg w-fit"
        style={{
          background: "oklch(0.60 0.22 25 / 0.1)",
          border: "1px solid oklch(0.60 0.22 25 / 0.3)",
        }}
      >
        <Clock size={14} className="negative" />
        <span className="text-xs negative">
          Expires in: {mins}:{secs.toString().padStart(2, "0")}
        </span>
      </div>

      {/* QR + Address */}
      {network !== "BYBIT" ? (
        <div className="glass-card p-6 space-y-4">
          {/* Stylized QR */}
          <div className="flex flex-col items-center">
            <div
              className="w-44 h-44 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "white", padding: "12px" }}
            >
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='white'/%3E%3Crect x='10' y='10' width='30' height='30' fill='none' stroke='black' strokeWidth='4'/%3E%3Crect x='16' y='16' width='18' height='18' fill='black'/%3E%3Crect x='60' y='10' width='30' height='30' fill='none' stroke='black' strokeWidth='4'/%3E%3Crect x='66' y='16' width='18' height='18' fill='black'/%3E%3Crect x='10' y='60' width='30' height='30' fill='none' stroke='black' strokeWidth='4'/%3E%3Crect x='16' y='66' width='18' height='18' fill='black'/%3E%3Crect x='45' y='10' width='5' height='5' fill='black'/%3E%3Crect x='52' y='10' width='5' height='5' fill='black'/%3E%3Crect x='45' y='17' width='5' height='5' fill='black'/%3E%3Crect x='45' y='24' width='5' height='5' fill='black'/%3E%3Crect x='52' y='24' width='5' height='5' fill='black'/%3E%3Crect x='60' y='45' width='5' height='5' fill='black'/%3E%3Crect x='67' y='45' width='5' height='5' fill='black'/%3E%3Crect x='74' y='45' width='5' height='5' fill='black'/%3E%3Crect x='81' y='45' width='5' height='5' fill='black'/%3E%3Crect x='88' y='45' width='5' height='5' fill='black'/%3E%3Crect x='45' y='45' width='10' height='10' fill='black'/%3E%3Crect x='60' y='60' width='5' height='5' fill='black'/%3E%3Crect x='70' y='60' width='5' height='5' fill='black'/%3E%3Crect x='80' y='60' width='5' height='5' fill='black'/%3E%3Crect x='65' y='70' width='5' height='5' fill='black'/%3E%3Crect x='75' y='70' width='5' height='5' fill='black'/%3E%3Crect x='85' y='70' width='5' height='5' fill='black'/%3E%3Crect x='60' y='80' width='15' height='5' fill='black'/%3E%3Crect x='80' y='80' width='10' height='5' fill='black'/%3E%3C/svg%3E")`,
                  backgroundSize: "cover",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Scan to send {network} USDT
            </p>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1">
              Wallet Address ({network})
            </Label>
            <div className="flex gap-2">
              <div
                className="flex-1 px-3 py-2.5 rounded-lg text-xs font-mono break-all"
                style={{
                  background: "oklch(0.18 0.03 265)",
                  border: "1px solid oklch(0.30 0.04 265)",
                }}
              >
                {address}
              </div>
              <button
                type="button"
                onClick={copyAddress}
                className="px-3 py-2.5 rounded-lg btn-cyan text-sm flex-shrink-0"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div
            className="flex gap-2 items-center px-3 py-2 rounded-lg"
            style={{
              background: "oklch(0.60 0.22 25 / 0.08)",
              border: "1px solid oklch(0.60 0.22 25 / 0.2)",
            }}
          >
            <AlertCircle size={14} className="negative flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Only send USDT on {network} network. Other assets will be lost.
            </p>
          </div>
        </div>
      ) : (
        <div className="glass-card p-6 flex flex-col items-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Scan with Bybit App to pay
          </p>
          <img
            src="/assets/uploads/IMG_20260323_160155-1.jpg"
            alt="Bybit Pay QR"
            className="w-64 h-64 object-cover rounded-xl"
          />
          <p className="text-xs text-muted-foreground">san***@****</p>
        </div>
      )}

      {/* Reference ID */}
      <div className="glass-card p-4">
        <Label className="text-xs text-muted-foreground mb-2">
          Your Reference ID
        </Label>
        <div className="flex gap-2">
          <div
            className="flex-1 px-3 py-2.5 rounded-lg font-mono text-sm neon-text-cyan"
            style={{
              background: "oklch(0.18 0.03 265)",
              border: "1px solid oklch(0.82 0.18 195 / 0.3)",
            }}
          >
            {refId}
          </div>
          <button
            type="button"
            onClick={copyRef}
            className="px-3 py-2.5 rounded-lg btn-cyan text-sm"
          >
            <Copy size={14} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Include this ID in your transfer memo/note
        </p>
      </div>

      {/* Submission */}
      <form onSubmit={handleSubmit} className="glass-card p-5 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Submit Payment Proof
        </h3>
        <div>
          <Label className="text-xs text-muted-foreground mb-1">
            Amount (USDT)
          </Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 50"
            min="5"
            className="bg-muted/50 border-border"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1">
            Transaction Hash (TX ID)
          </Label>
          <Input
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="Paste your TX hash here"
            className="bg-muted/50 border-border font-mono text-xs"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          After sending, paste your TX hash above. Admin will verify within
          24-72 hours.
        </p>
        <Button type="submit" className="w-full btn-cyan">
          Submit Deposit
        </Button>
      </form>
    </div>
  );
}
