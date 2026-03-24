import { Input } from "@/components/ui/input";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Sparkline } from "../components/Sparkline";
import { formatMarketCap, formatPrice, tokens } from "../data/tokens";

type Filter = "all" | "trending" | "gainers" | "losers";

export function Markets() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = tokens.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.symbol.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all"
        ? true
        : filter === "gainers"
          ? t.change24h > 0
          : filter === "losers"
            ? t.change24h < 0
            : t.change24h > 2;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-6xl space-y-5">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Crypto Markets
        </p>
        <h1 className="text-2xl font-bold">
          Live <span className="neon-text-cyan">Token Prices</span>
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 bg-muted/50 border-border text-sm"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "trending", "gainers", "losers"] as Filter[]).map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === f
                  ? "btn-cyan"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={
                filter !== f
                  ? {
                      background: "oklch(0.20 0.03 265)",
                      border: "1px solid oklch(0.30 0.04 265)",
                    }
                  : {}
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                {[
                  "#",
                  "Token",
                  "Price",
                  "24h %",
                  "7d %",
                  "Market Cap",
                  "Volume",
                  "7d Chart",
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
              {filtered.map((token) => (
                <tr
                  key={token.symbol}
                  className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {token.rank}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          background: `${token.color}33`,
                          color: token.color,
                        }}
                      >
                        {token.symbol[0]}
                      </div>
                      <div>
                        <p className="font-medium">{token.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {token.symbol}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatPrice(token.price)}
                  </td>
                  <td
                    className={`px-4 py-3 text-xs ${token.change24h >= 0 ? "positive" : "negative"}`}
                  >
                    <span className="flex items-center gap-1">
                      {token.change24h >= 0 ? (
                        <TrendingUp size={10} />
                      ) : (
                        <TrendingDown size={10} />
                      )}
                      {token.change24h >= 0 ? "+" : ""}
                      {token.change24h}%
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-xs ${token.change7d >= 0 ? "positive" : "negative"}`}
                  >
                    {token.change7d >= 0 ? "+" : ""}
                    {token.change7d}%
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatMarketCap(token.marketCap)}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatMarketCap(token.volume24h)}
                  </td>
                  <td className="px-4 py-3">
                    <Sparkline
                      data={token.sparkline}
                      positive={token.change7d >= 0}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
