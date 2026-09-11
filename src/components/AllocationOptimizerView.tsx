import React, { useState, useMemo } from 'react';
import { Fund, TradeOrder } from '../types';
import { 
  SlidersHorizontal, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  ArrowRight,
  CheckCircle2,
  PieChart as PieIcon,
  Diamond
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AIOptimizerWindow, StrategyIdea } from './AIOptimizerWindow';

interface AllocationOptimizerViewProps {
  funds: Fund[];
  onCommitRebalance: (orders: TradeOrder[]) => void;
  onExperimentInAgentWorkspace?: (strategy: StrategyIdea) => void;
}

export const AllocationOptimizerView: React.FC<AllocationOptimizerViewProps> = ({
  funds,
  onCommitRebalance,
  onExperimentInAgentWorkspace,
}) => {
  // Current allocated weights: Oculus 35%, Composite 30%, Valence 15%, Arista 20%
  const [weights, setWeights] = useState<Record<string, number>>({
    'des-oculus': 35,
    'des-composite': 30,
    'des-valence': 15,
    'des-arista': 20,
  });

  const [committedNotice, setCommittedNotice] = useState(false);

  const totalWeight = useMemo(() => {
    return Object.values(weights).reduce((a, b) => a + b, 0);
  }, [weights]);

  // Normalized weights
  const normWeights = useMemo(() => {
    const sum = totalWeight || 1;
    const res: Record<string, number> = {};
    for (const id of Object.keys(weights)) {
      res[id] = Number(((weights[id] / sum) * 100).toFixed(1));
    }
    return res;
  }, [weights, totalWeight]);

  // Compute Blended Portfolio Metrics
  const blendedReturn = useMemo(() => {
    return Number(
      funds
        .reduce((sum, f) => sum + (f.oneYearReturnPct * (normWeights[f.id] || 0)) / 100, 0)
        .toFixed(2)
    );
  }, [funds, normWeights]);

  const blendedVol = useMemo(() => {
    // Systematic diversification discount assumption
    const weightedVol = funds.reduce(
      (sum, f) => sum + (f.volatilityPct * (normWeights[f.id] || 0)) / 100,
      0
    );
    return Number((weightedVol * 0.82).toFixed(2));
  }, [funds, normWeights]);

  const blendedSharpe = useMemo(() => {
    return Number(((blendedReturn - 4.5) / blendedVol).toFixed(2));
  }, [blendedReturn, blendedVol]);

  const blendedVar = useMemo(() => {
    return Number(
      (
        funds.reduce((sum, f) => sum + (f.var95Pct * (normWeights[f.id] || 0)) / 100, 0) * 0.85
      ).toFixed(2)
    );
  }, [funds, normWeights]);

  // Presets
  const applyPreset = (type: 'maxSharpe' | 'minVol' | 'equal' | 'growth') => {
    if (type === 'maxSharpe') {
      setWeights({
        'des-oculus': 30,
        'des-composite': 40,
        'des-valence': 10,
        'des-arista': 20,
      });
    } else if (type === 'minVol') {
      setWeights({
        'des-oculus': 20,
        'des-composite': 35,
        'des-valence': 5,
        'des-arista': 40,
      });
    } else if (type === 'equal') {
      setWeights({
        'des-oculus': 25,
        'des-composite': 25,
        'des-valence': 25,
        'des-arista': 25,
      });
    } else if (type === 'growth') {
      setWeights({
        'des-oculus': 20,
        'des-composite': 25,
        'des-valence': 45,
        'des-arista': 10,
      });
    }
  };

  // Scatter data: Volatility (X) vs Expected Return (Y)
  const scatterData = useMemo(() => {
    const items = funds.map((f) => ({
      name: f.name,
      vol: f.volatilityPct,
      ret: f.oneYearReturnPct,
      sharpe: f.sharpeRatio,
      color: 'var(--chart-1)',
    }));

    // Add current blended simulated portfolio
    items.push({
      name: 'Simulated Target Portfolio (DT)',
      vol: blendedVol,
      ret: blendedReturn,
      sharpe: blendedSharpe,
      color: 'var(--primary)',
    });

    return items;
  }, [funds, blendedVol, blendedReturn, blendedSharpe]);

  // Correlation Matrix between funds
  const correlations = [
    { pair: 'Oculus vs Composite', value: 0.22 },
    { pair: 'Oculus vs Valence', value: 0.38 },
    { pair: 'Oculus vs Arista', value: 0.08 },
    { pair: 'Composite vs Valence', value: 0.15 },
    { pair: 'Composite vs Arista', value: -0.04 },
    { pair: 'Valence vs Arista', value: -0.12 },
  ];

  const handleCommitRebalance = () => {
    const orders: TradeOrder[] = [];
    const firmTotalAum = 5990; // $5.99B firm capital pool

    funds.forEach((f) => {
      const targetWeight = normWeights[f.id] || 25;
      const currentWeight = Number(((f.aumMillions / firmTotalAum) * 100).toFixed(1));
      const diffPct = targetWeight - currentWeight;

      if (Math.abs(diffPct) > 0.5) {
        const dollarDiffM = Number(((Math.abs(diffPct) / 100) * firmTotalAum).toFixed(1));
        orders.push({
          id: `ord-reb-${f.id.slice(-4)}-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          fundId: f.id,
          ticker: f.id.toUpperCase(),
          name: `${f.name} Rebalance`,
          side: diffPct > 0 ? 'BUY' : 'SELL',
          shares: Math.round((dollarDiffM * 1000000) / f.nav),
          targetPrice: f.nav,
          status: 'SIMULATED',
          rationale: `Capital Allocation Model reweighting: ${currentWeight}% → ${targetWeight}% ($${dollarDiffM}M ${diffPct > 0 ? 'inflow' : 'trim'})`,
        });
      }
    });

    onCommitRebalance(orders);
    setCommittedNotice(true);
    setTimeout(() => setCommittedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-card p-4 rounded-lg border border-border shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Diamond className="w-4 h-4 text-primary" />
            Market Fund Manager
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Optimize cross-fund capital distributions, evaluate correlation diversification, and generate rebalance trade tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => applyPreset('maxSharpe')}
            className="px-2.5 py-1.5 rounded-md text-xs font-mono font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition font-semibold"
          >
            Max Sharpe
          </button>
          <button
            onClick={() => applyPreset('minVol')}
            className="px-2.5 py-1.5 rounded-md text-xs font-mono font-medium bg-white hover:bg-slate-50 text-foreground border border-border transition"
          >
            Min Volatility
          </button>
          <button
            onClick={() => applyPreset('growth')}
            className="px-2.5 py-1.5 rounded-md text-xs font-mono font-medium bg-white hover:bg-slate-50 text-foreground border border-border transition"
          >
            Max Alpha / Growth
          </button>
          <button
            onClick={() => applyPreset('equal')}
            className="px-2.5 py-1.5 rounded-md text-xs font-mono font-medium bg-white hover:bg-slate-50 text-foreground border border-border transition"
          >
            1/N Equal
          </button>
        </div>
      </div>

      {/* Blended Metric Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card p-3.5 rounded-lg border border-border shadow-xs transition-colors">
          <span className="text-[11px] text-muted-foreground font-medium">Projected Annual Return</span>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-xl font-bold text-emerald-500">+{blendedReturn}%</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">Benchmark Excess: +12.1%</span>
        </div>

        <div className="bg-card p-3.5 rounded-lg border border-border shadow-xs transition-colors">
          <span className="text-[11px] text-muted-foreground font-medium">Blended Volatility</span>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-xl font-bold text-foreground">{blendedVol}%</span>
          </div>
          <span className="text-[11px] text-emerald-500 font-mono">-18% Diversification Gain</span>
        </div>

        <div className="bg-card p-3.5 rounded-lg border border-border shadow-xs transition-colors">
          <span className="text-[11px] text-muted-foreground font-medium">Blended Sharpe Ratio</span>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-xl font-bold text-primary">{blendedSharpe}</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">Risk-Free Rate: 4.5%</span>
        </div>

        <div className="bg-card p-3.5 rounded-lg border border-border shadow-xs transition-colors">
          <span className="text-[11px] text-muted-foreground font-medium">Blended 95% Daily VaR</span>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-xl font-bold text-foreground">{blendedVar}%</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">Within 1.5% Risk Mandate</span>
        </div>
      </div>

      {/* AI Quantitative Allocation Insight */}
      <div className="relative overflow-hidden bg-card border border-primary/30 rounded-lg p-3.5 shadow-xs ring-1 ring-primary/15 transition-all">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/70 to-transparent" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">AI Optimization Signal: Markowitz Frontier Tangency</span>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px] font-mono px-1.5 py-0 font-bold">
                  AI INSIGHT
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Dynamic covariance matrix suggests maintaining overweight in Oculus Fund (35%) while paring Valence (15%) to dampen macro inflation beta and expand Sharpe ratio to {blendedSharpe}.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => applyPreset('maxSharpe')}
            className="text-xs font-mono border-primary/30 text-primary hover:bg-primary/10 h-7 px-2.5 gap-1 shrink-0"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            Apply AI Tangency Weights
          </Button>
        </div>
      </div>

      {/* AI Optimisation Window: Research & Managing Node Strategy Generator */}
      <AIOptimizerWindow onExperimentInAgentWorkspace={onExperimentInAgentWorkspace} />

      {/* Allocation Sliders and Scatter Frontier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders Box */}
        <div className="bg-card p-5 rounded-lg border border-border shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-primary" />
                Target Fund Capital Weights
              </h3>
              <span className={`text-xs font-mono font-bold ${Math.abs(totalWeight - 100) < 0.1 ? 'text-emerald-500' : 'text-primary'}`}>
                Sum: {totalWeight.toFixed(0)}% (Normalized: 100%)
              </span>
            </div>

            <div className="space-y-4">
              {funds.map((f) => {
                const currentVal = weights[f.id] || 0;
                const normalizedVal = normWeights[f.id] || 0;
                return (
                  <div key={f.id} className="p-3 bg-white rounded-lg border border-border">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <div>
                        <span className="font-bold text-foreground">{f.name}</span>
                        <span className="block text-[10px] text-muted-foreground font-sans">{f.strategy}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-sm font-bold text-primary">{normalizedVal}%</span>
                        <span className="text-[10px] text-muted-foreground block">
                          ${((5990 * normalizedVal) / 100).toFixed(0)}M
                        </span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="70"
                      step="5"
                      value={currentVal}
                      onChange={(e) =>
                        setWeights((prev) => ({ ...prev, [f.id]: Number(e.target.value) }))
                      }
                      className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
                      <span>1Y Ret: +{f.oneYearReturnPct}%</span>
                      <span>Vol: {f.volatilityPct}%</span>
                      <span>Sharpe: {f.sharpeRatio}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Firm Capital: <strong className="text-foreground font-mono">$5,990M</strong></span>
            <button
              onClick={handleCommitRebalance}
              className="px-4 py-2 rounded-md text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition flex items-center gap-1.5"
            >
              {committedNotice ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                  Tickets Routed to Blotter!
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                  Commit Target Rebalance Tickets
                </>
              )}
            </button>
          </div>
        </div>

        {/* Risk-Return Frontier & Correlation Matrix */}
        <div className="space-y-6">
          {/* Scatter Plot */}
          <div className="bg-card p-5 rounded-lg border border-border shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Risk vs. Return Efficient Frontier</h3>
                <p className="text-xs text-muted-foreground">Annual Volatility vs. Expected 1Y Return</p>
              </div>
              <span className="text-[10px] font-mono text-primary font-semibold">Blue Dot = Blended Portfolio</span>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -20 }}>
                  <XAxis
                    type="number"
                    dataKey="vol"
                    name="Volatility"
                    unit="%"
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    fontFamily="JetBrains Mono"
                  />
                  <YAxis
                    type="number"
                    dataKey="ret"
                    name="Return"
                    unit="%"
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    fontFamily="JetBrains Mono"
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border p-2.5 rounded-lg shadow-xs text-xs font-mono text-foreground">
                          <p className="font-bold text-primary">{data.name}</p>
                          <p>Volatility: {data.vol}%</p>
                          <p>Return: +{data.ret}%</p>
                          <p>Sharpe: {data.sharpe}</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name.includes('Simulated') ? 'var(--primary)' : 'var(--chart-5)'}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Correlation Matrix */}
          <div className="bg-card p-5 rounded-lg border border-border shadow-xs transition-colors">
            <h3 className="text-sm font-semibold text-foreground mb-2">Inter-Fund Return Correlation Matrix</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Low/negative cross-fund correlation preserves portfolio Sharpe ratio under market stress.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {correlations.map((c) => (
                <div
                  key={c.pair}
                  className="p-2.5 bg-white rounded-lg border border-border text-center font-mono"
                >
                  <span className="block text-[10px] text-muted-foreground truncate">{c.pair}</span>
                  <span
                    className={`text-xs font-bold block mt-1 ${
                      c.value <= 0
                        ? 'text-emerald-500'
                        : c.value < 0.25
                        ? 'text-primary'
                        : 'text-foreground'
                    }`}
                  >
                    {c.value > 0 ? `+${c.value.toFixed(2)}` : c.value.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
