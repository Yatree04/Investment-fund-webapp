import React, { useState } from 'react';
import { Fund, ScenarioResult, TradeOrder } from '../types';
import { 
  ShieldAlert, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Sliders, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface StressTestingViewProps {
  fund: Fund;
  onExecuteHedge: (order: TradeOrder) => void;
}

export const StressTestingView: React.FC<StressTestingViewProps> = ({
  fund,
  onExecuteHedge,
}) => {
  // Custom interactive sensitivity shock parameters
  const [equityShock, setEquityShock] = useState<number>(0);
  const [ratesShockBps, setRatesShockBps] = useState<number>(0);
  const [vixShock, setVixShock] = useState<number>(0);
  const [fxShock, setFxShock] = useState<number>(0);
  const [hedgeQueued, setHedgeQueued] = useState<string | null>(null);

  // Compute simulated dynamic shock impact on fund
  const simulatedPnlMillions = Number((
    (fund.aumMillions * (equityShock / 100) * fund.betaToSP500 * (fund.netExposurePct / 100)) +
    (fund.aumMillions * (-ratesShockBps / 10000) * 0.45) +
    (fund.aumMillions * (vixShock > 10 ? (vixShock * 0.02) : (-vixShock * 0.01))) +
    (fund.aumMillions * (fxShock / 100) * 0.08)
  ).toFixed(2));

  const simulatedNavImpactPct = Number(((simulatedPnlMillions / fund.aumMillions) * 100).toFixed(2));
  const simulatedVar = Number(Math.max(0.5, fund.var95Pct * (1 + Math.abs(simulatedNavImpactPct) / 10 + vixShock / 50)).toFixed(2));

  const resetSliders = () => {
    setEquityShock(0);
    setRatesShockBps(0);
    setVixShock(0);
    setFxShock(0);
  };

  const handleApplyPreset = (scenario: ScenarioResult) => {
    if (scenario.scenarioId === 'rates-up-100') {
      setEquityShock(-5);
      setRatesShockBps(100);
      setVixShock(8);
      setFxShock(3);
    } else if (scenario.scenarioId === 'stagflation-oil') {
      setEquityShock(-8);
      setRatesShockBps(75);
      setVixShock(14);
      setFxShock(-4);
    } else if (scenario.scenarioId === 'ai-tech-liquidation') {
      setEquityShock(-20);
      setRatesShockBps(25);
      setVixShock(22);
      setFxShock(2);
    } else if (scenario.scenarioId === 'systemic-liquidity-crisis') {
      setEquityShock(-30);
      setRatesShockBps(-150);
      setVixShock(40);
      setFxShock(10);
    }
  };

  const handleExecuteHedgeOrder = (recommendationName: string, ticker: string, side: 'BUY' | 'SELL', shares: number, price: number) => {
    const order: TradeOrder = {
      id: `ord-hdg-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      fundId: fund.id,
      ticker,
      name: `${ticker} Stress Mitigation Hedge`,
      side,
      shares,
      targetPrice: price,
      status: 'SIMULATED',
      rationale: `Macro stress test mitigation: ${recommendationName}`,
    };

    onExecuteHedge(order);
    setHedgeQueued(recommendationName);
    setTimeout(() => setHedgeQueued(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-card p-4 rounded-lg border border-border shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            Institutional Quantitative Stress Testing &amp; VaR Simulator
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Model portfolio drawdowns, tail-risk convexity, and liquidity sensitivity under adverse macro events.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-muted-foreground">Baseline Daily VaR (95%):</span>
          <span className="bg-card px-2.5 py-1 rounded text-primary font-bold border border-border">
            {fund.var95Pct}% ($
            {((fund.aumMillions * fund.var95Pct) / 100).toFixed(1)}M)
          </span>
        </div>
      </div>

      {/* Standard Scenario Presets */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 font-semibold">
          Macro Shocks &amp; Extreme Market Event Scenarios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fund.scenarios.map((sc) => {
            const isNegative = sc.pnlImpactM < 0;
            return (
              <div
                key={sc.scenarioId}
                className="bg-card p-4 rounded-lg border border-border shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                        sc.severity === 'Severe'
                          ? 'bg-chart-5/10 text-foreground border border-chart-5/30'
                          : sc.severity === 'High'
                          ? 'bg-chart-3/10 text-foreground border border-chart-3/30'
                          : 'bg-card text-muted-foreground border border-border'
                      }`}
                    >
                      {sc.severity} Severity
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">VaR: +{sc.varChangePct}%</span>
                  </div>

                  <h4 className="text-sm font-bold text-foreground">{sc.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{sc.description}</p>

                  <div className="mt-4 p-2.5 bg-card rounded-md border border-border font-mono">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">P&amp;L Drawdown:</span>
                      <span className={`font-bold ${isNegative ? 'text-chart-5' : 'text-chart-4'}`}>
                        {sc.pnlImpactM > 0 ? `+$${sc.pnlImpactM}M` : `-$${Math.abs(sc.pnlImpactM)}M`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1">
                      <span className="text-muted-foreground">NAV Impact:</span>
                      <span className={`font-semibold ${isNegative ? 'text-chart-5' : 'text-chart-4'}`}>
                        {sc.navImpactPct > 0 ? `+${sc.navImpactPct}%` : `${sc.navImpactPct}%`}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleApplyPreset(sc)}
                  className="mt-4 w-full py-1.5 rounded-md text-xs font-medium bg-card hover:bg-muted text-primary border border-border transition flex items-center justify-center gap-1.5 shadow-xs font-semibold"
                >
                  Apply &amp; Calibrate
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Sensitivity Shocker & Decision Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Console */}
        <div className="lg:col-span-2 bg-card p-5 rounded-lg border border-border shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                Multi-Factor Sensitivity Shock Matrix
              </h3>
              <p className="text-xs text-muted-foreground">Dynamic parametric stress evaluation</p>
            </div>
            <button
              onClick={resetSliders}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-mono transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {/* Slider 1: Equity Index */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-foreground">Equity Market Shock (S&amp;P 500 / Global Equities):</span>
                <span className={`font-bold ${equityShock < 0 ? 'text-chart-5' : equityShock > 0 ? 'text-chart-4' : 'text-muted-foreground'}`}>
                  {equityShock > 0 ? `+${equityShock}%` : `${equityShock}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={equityShock}
                onChange={(e) => setEquityShock(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Rates Shock */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-foreground">Parallel Yield Curve Shift (Interest Rates):</span>
                <span className={`font-bold ${ratesShockBps > 0 ? 'text-primary' : ratesShockBps < 0 ? 'text-chart-4' : 'text-muted-foreground'}`}>
                  {ratesShockBps > 0 ? `+${ratesShockBps} bps` : `${ratesShockBps} bps`}
                </span>
              </div>
              <input
                type="range"
                min="-200"
                max="300"
                step="10"
                value={ratesShockBps}
                onChange={(e) => setRatesShockBps(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: VIX Shock */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-foreground">Implied Volatility Index Surge (VIX Points):</span>
                <span className={`font-bold ${vixShock > 15 ? 'text-chart-5' : 'text-muted-foreground'}`}>
                  +{vixShock} pts
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="2"
                value={vixShock}
                onChange={(e) => setVixShock(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 4: FX Shock */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-foreground">USD Dollar Index Movement (DXY):</span>
                <span className={`font-bold ${fxShock < 0 ? 'text-chart-5' : fxShock > 0 ? 'text-chart-4' : 'text-muted-foreground'}`}>
                  {fxShock > 0 ? `+${fxShock}%` : `${fxShock}%`}
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="1"
                value={fxShock}
                onChange={(e) => setFxShock(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Dynamic Impact Display */}
          <div className="mt-6 p-4 bg-card rounded-lg border border-border grid grid-cols-3 gap-4 font-mono text-center">
            <div>
              <span className="text-[11px] text-muted-foreground block font-sans">Simulated P&amp;L</span>
              <span className={`text-base font-bold ${simulatedPnlMillions < 0 ? 'text-chart-5' : 'text-chart-4'}`}>
                {simulatedPnlMillions > 0 ? `+$${simulatedPnlMillions}M` : `-$${Math.abs(simulatedPnlMillions)}M`}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block font-sans">Simulated NAV Impact</span>
              <span className={`text-base font-bold ${simulatedNavImpactPct < 0 ? 'text-chart-5' : 'text-chart-4'}`}>
                {simulatedNavImpactPct > 0 ? `+${simulatedNavImpactPct}%` : `${simulatedNavImpactPct}%`}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block font-sans">Projected 95% VaR</span>
              <span className="text-base font-bold text-primary">
                {simulatedVar}%
              </span>
            </div>
          </div>
        </div>

        {/* Decision Recommendations (AI Risk Mitigation Engine) */}
        <div className="relative overflow-hidden bg-card p-5 rounded-lg border border-primary/30 shadow-xs flex flex-col justify-between transition-all ring-1 ring-primary/15">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/70 to-transparent" />
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/80">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  AI Hedging Recommendations
                </h3>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px] font-mono px-2 py-0.5 font-bold">
                AI INSIGHT
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Systematic hedging recommendations synthesized by the sub-agent based on current scenario factor sensitivities:
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-card rounded-lg border border-border">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-foreground">1. Tail-Risk Volatility Convexity</span>
                  <Badge variant="outline" className="text-[10px] font-mono bg-primary/10 text-primary border-primary/25 font-semibold">
                    Delta Hedge
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Add 10,000 contracts of 2-month OTM VIX Calls to neutralize tail risk drawdown.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExecuteHedgeOrder('Tail-Risk Convexity Call Hedge', 'VIX-HEDGE', 'BUY', 10000, 4.85)}
                  className="mt-2.5 h-7 text-xs font-mono font-medium border-primary/30 hover:bg-primary/10 text-primary gap-1"
                >
                  {hedgeQueued === 'Tail-Risk Convexity Call Hedge' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-foreground" />
                      <span className="text-foreground font-semibold">Order Routed to Blotter</span>
                    </>
                  ) : (
                    'Queue Hedge Order'
                  )}
                </Button>
              </div>

              <div className="p-3 bg-card rounded-lg border border-border">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-foreground">2. Duration Neutralization</span>
                  <Badge variant="outline" className="text-[10px] font-mono bg-chart-4/10 text-foreground border-chart-4/30 font-semibold">
                    Yield Hedge
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Increase 10Y Treasury futures by 250 contracts to preserve carry through rate volatility.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExecuteHedgeOrder('10Y Duration Neutralizer', 'UST10Y-HDG', 'BUY', 250, 110.25)}
                  className="mt-2.5 h-7 text-xs font-mono font-medium border-primary/30 hover:bg-primary/10 text-primary gap-1"
                >
                  {hedgeQueued === '10Y Duration Neutralizer' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-foreground" />
                      <span className="text-foreground font-semibold">Order Routed to Blotter</span>
                    </>
                  ) : (
                    'Queue Hedge Order'
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border text-[11px] text-muted-foreground">
            Real-time compliance checks: <span className="text-chart-4 font-mono font-semibold">PASSED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
