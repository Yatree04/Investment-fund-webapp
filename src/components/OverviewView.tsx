import React, { useState, useMemo } from 'react';
import { Fund, Holding } from '../types';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowUp,
  ExternalLink, 
  Sparkles, 
  SendHorizontal, 
  ChevronRight, 
  Bot,
  ShieldCheck,
  TrendingUp,
  Zap,
  Activity,
  Layers,
  FileText,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  SlidersHorizontal,
  Sliders
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from 'recharts';
import { MultiAgentInteractionHub } from './MultiAgentInteractionHub';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface OverviewViewProps {
  fund: Fund;
  isSimulating: boolean;
  onNavigateToOptimizer: () => void;
  onNavigateToScenarios: () => void;
  onNavigateToHoldings?: () => void;
  currency?: 'INR' | 'USD';
  searchQuery?: string;
  onSelectHolding?: (holding: Holding) => void;
  onExecuteAgentCommand?: (cmd: string) => void;
  onExperimentInAgentWorkspace?: (strategy: any) => void;
  onNavigateToAudit?: () => void;
  onNavigateToFundSetup?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  fund,
  isSimulating,
  onNavigateToOptimizer,
  onNavigateToScenarios,
  onNavigateToHoldings,
  currency = 'INR',
  searchQuery = '',
  onSelectHolding,
  onExecuteAgentCommand,
  onExperimentInAgentWorkspace,
  onNavigateToAudit,
  onNavigateToFundSetup,
}) => {
  // Chart Display Mode: [NAV Performance] [Agent Alpha Attribution] [Factor Risk]
  const [chartMode, setChartMode] = useState<'NAV' | 'AGENT_ALPHA' | 'FACTOR_RISK'>('NAV');
  const [activePeriod, setActivePeriod] = useState<'1M' | '3M' | 'YTD' | '1Y' | '3Y'>('YTD');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('ALL');

  // Format currency helpers
  const formatCurrency = (val: number) => {
    if (currency === 'INR') {
      return `₹${(val * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}M`;
    }
    return `$${val.toFixed(1)}M`;
  };

  // High-resolution performance curve with agent alpha contributions
  const performanceData = useMemo(() => [
    { month: 'Jan', nav: 100.0, benchmark: 100.0, macroAlpha: 0.4, quantAlpha: 0.8, executionSavings: 0.2 },
    { month: 'Feb', nav: 103.2, benchmark: 101.4, macroAlpha: 0.7, quantAlpha: 1.6, executionSavings: 0.3 },
    { month: 'Mar', nav: 102.8, benchmark: 99.8,  macroAlpha: 1.1, quantAlpha: 2.2, executionSavings: 0.5 },
    { month: 'Apr', nav: 107.5, benchmark: 102.1, macroAlpha: 1.5, quantAlpha: 3.4, executionSavings: 0.7 },
    { month: 'May', nav: 111.4, benchmark: 103.6, macroAlpha: 1.9, quantAlpha: 4.8, executionSavings: 0.9 },
    { month: 'Jun', nav: 113.8, benchmark: 104.2, macroAlpha: 2.2, quantAlpha: 5.9, executionSavings: 1.1 },
    { month: 'Jul', nav: 112.9, benchmark: 103.8, macroAlpha: 2.4, quantAlpha: 6.4, executionSavings: 1.3 },
    { month: 'Aug', nav: 115.6, benchmark: 105.1, macroAlpha: 2.7, quantAlpha: 7.2, executionSavings: 1.4 },
    { month: 'Sep', nav: 117.8, benchmark: 106.4, macroAlpha: 2.9, quantAlpha: 8.1, executionSavings: 1.6 },
    { month: 'Oct', nav: 116.4, benchmark: 105.2, macroAlpha: 3.1, quantAlpha: 8.5, executionSavings: 1.7 },
    { month: 'Nov', nav: 118.9, benchmark: 107.0, macroAlpha: 3.3, quantAlpha: 9.2, executionSavings: 1.9 },
    { month: 'Dec', nav: 121.4, benchmark: 108.5, macroAlpha: 3.6, quantAlpha: 9.8, executionSavings: 2.1 }
  ], []);

  // Multi-Agent Evaluated Holdings
  const agentEvaluatedHoldings = useMemo(() => [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      assetClass: 'Equities',
      weight: '7.8%',
      value: '₹631.8M',
      pnl: '+18.4%',
      isPositive: true,
      alphaScore: '9.2/10',
      alphaRating: 'Strong Long',
      riskVerdict: 'PASSED (Capped at 8.0%)',
      macroAlignment: 'Dovish Tailwind',
      complianceStatus: 'Signed (15c3-5)',
      primaryAgent: 'Alpha Matrix AI'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      assetClass: 'Equities',
      weight: '7.2%',
      value: '₹583.2M',
      pnl: '+14.2%',
      isPositive: true,
      alphaScore: '8.8/10',
      alphaRating: 'Long Accumulate',
      riskVerdict: 'Within Barra Bounds',
      macroAlignment: 'Cloud Capex Tailwinds',
      complianceStatus: 'Signed (15c3-5)',
      primaryAgent: 'Alpha Matrix AI'
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      assetClass: 'Equities',
      weight: '8.2%',
      value: '₹664.2M',
      pnl: '+32.8%',
      isPositive: true,
      alphaScore: '9.6/10',
      alphaRating: 'Vol Skew Dispersion',
      riskVerdict: 'VETO RESIZED (Capped 8.2%)',
      macroAlignment: 'Semiconductor Dispersion',
      complianceStatus: 'Collars Active',
      primaryAgent: 'Aegis Risk Officer AI'
    },
    {
      symbol: 'SPY_OPT',
      name: 'S&P 500 Delta-Hedge Calls',
      assetClass: 'Quant Derivatives',
      weight: '5.5%',
      value: '₹445.5M',
      pnl: '+8.6%',
      isPositive: true,
      alphaScore: '9.0/10',
      alphaRating: 'Variance Premium',
      riskVerdict: 'Zero Delta Residual',
      macroAlignment: 'Index Gamma Hedge',
      complianceStatus: 'Approved',
      primaryAgent: 'Alpha Matrix AI'
    },
    {
      symbol: 'TLT',
      name: 'iShares 20Y Treasury Bond',
      assetClass: 'Fixed Income',
      weight: '6.4%',
      value: '₹518.4M',
      pnl: '-2.4%',
      isPositive: false,
      alphaScore: '6.4/10',
      alphaRating: 'Duration Buffer',
      riskVerdict: 'Rates Shock Absorption',
      macroAlignment: 'Policy Pivot Hedge',
      complianceStatus: 'Approved',
      primaryAgent: 'Macro Sentinel AI'
    },
    {
      symbol: 'GLD',
      name: 'SPDR Gold Trust',
      assetClass: 'Commodities',
      weight: '4.8%',
      value: '₹388.8M',
      pnl: '+6.1%',
      isPositive: true,
      alphaScore: '7.8/10',
      alphaRating: 'Geopolitical Tail Hedge',
      riskVerdict: 'Low Covariance Asset',
      macroAlignment: 'Currency Debasement Guard',
      complianceStatus: 'Approved',
      primaryAgent: 'Macro Sentinel AI'
    }
  ], []);

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-8 select-none">
      
      {/* =========================================================================
          TOP EXECUTIVE FUND BAR: CRISP, HIGH-SIGNAL METRICS (NO BLOAT)
         ========================================================================= */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Fund Identity & Multi-Agent Fleet Status */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-foreground tracking-tight font-sans">
                {fund.name}
              </span>
              <Badge variant="outline" className="font-mono text-xs bg-slate-100 text-slate-800 border-border">
                {fund.strategy}
              </Badge>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Fleet Active: 5 Specialized AI Agents
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Managed via collaborative multi-agent architecture with autonomous Barra factor neutralization &amp; SEC 15c3-5 pre-trade gate.
            </p>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {onNavigateToFundSetup && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigateToFundSetup}
                className="h-8 px-3 text-xs font-mono font-semibold bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border-indigo-200 rounded-lg gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Fund Limits &amp; Setup</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToOptimizer}
              className="h-8 px-3 text-xs font-mono font-semibold bg-white hover:bg-slate-50 border-border text-foreground rounded-lg gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              <span>Allocation Optimizer</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToScenarios}
              className="h-8 px-3 text-xs font-mono font-semibold bg-white hover:bg-slate-50 border-border text-foreground rounded-lg gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-rose-600" />
              <span>Stress Testing</span>
            </Button>
            {onNavigateToAudit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigateToAudit}
                className="h-8 px-3 text-xs font-mono font-semibold bg-white hover:bg-slate-50 border-border text-foreground rounded-lg gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Audit Trail</span>
              </Button>
            )}
          </div>
        </div>

        {/* Core Financial & Risk Key Performance Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 mt-3 border-t border-border/80">
          
          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-border/60">
            <div className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-semibold">
              Total Fund AUM
            </div>
            <div className="text-lg font-bold text-foreground font-sans mt-0.5">
              ₹8,100,000,000
            </div>
            <div className="text-[11px] font-mono text-muted-foreground">
              NAV: ₹{fund.nav.toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-border/60">
            <div className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-semibold">
              Net YTD Return
            </div>
            <div className="text-lg font-bold text-emerald-600 font-sans mt-0.5 flex items-center gap-1">
              <span>+18.4%</span>
              <span className="text-xs font-mono font-normal text-muted-foreground">vs +8.5% BM</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-700">
              Alpha: +9.9% Net
            </div>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-border/60">
            <div className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-semibold">
              Sharpe &amp; Sortino
            </div>
            <div className="text-lg font-bold text-foreground font-sans mt-0.5">
              2.14 <span className="text-xs font-mono text-muted-foreground font-normal">/ 2.98</span>
            </div>
            <div className="text-[11px] font-mono text-muted-foreground">
              Vol: {fund.volatilityPct.toFixed(1)}% p.a.
            </div>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-border/60">
            <div className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-semibold">
              1-Day 95% VaR
            </div>
            <div className="text-lg font-bold text-foreground font-sans mt-0.5 flex items-center justify-between">
              <span>1.14%</span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-mono py-0">
                PASSED
              </Badge>
            </div>
            <div className="text-[11px] font-mono text-muted-foreground">
              Policy Limit: &lt;1.50%
            </div>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-border/60">
            <div className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-semibold">
              Exposure Profile
            </div>
            <div className="text-lg font-bold text-foreground font-sans mt-0.5">
              +142% <span className="text-xs font-mono text-muted-foreground font-normal">Net</span>
            </div>
            <div className="text-[11px] font-mono text-muted-foreground">
              Gross: 180% · Cash: 8.2%
            </div>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-lg border border-border/60">
            <div className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-semibold">
              Barra Factor Beta
            </div>
            <div className="text-lg font-bold text-emerald-600 font-sans mt-0.5 flex items-center justify-between">
              <span>+0.008</span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-mono py-0">
                NEUTRAL
              </Badge>
            </div>
            <div className="text-[11px] font-mono text-muted-foreground">
              Target Tolerance: ±0.02
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          MULTI-AGENT INTERACTION & SPECIAL ABILITIES HUB (ADDRESSING USER CORE INTENT)
          - Showcases the 5 specialized domain agents
          - Live inter-agent deliberation & consensus stream (proposals, risk vetoes, compliance seals)
          - Interactive market shock simulation triggers
          - Selected agent domain telemetry & live metrics
         ========================================================================= */}
      <MultiAgentInteractionHub 
        onInspectAgent={(id) => {
          if (onExecuteAgentCommand) onExecuteAgentCommand(`Inspect agent telemetry: ${id}`);
        }}
        onNavigateToAudit={onNavigateToAudit}
      />

      {/* =========================================================================
          PERFORMANCE & ALPHA ATTRIBUTION CHART + RISK ATTRIBUTION
         ========================================================================= */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border mb-3">
          
          {/* Segmented Mode Selector: [Portfolio NAV] [Agent Alpha Attribution] */}
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-foreground tracking-tight font-mono uppercase">
              Portfolio &amp; Multi-Agent Performance Tracking
            </h3>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-border text-xs font-mono">
              <button
                onClick={() => setChartMode('NAV')}
                className={`px-3 py-1 rounded transition-colors ${
                  chartMode === 'NAV'
                    ? 'bg-white text-foreground font-bold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                NAV Growth
              </button>
              <button
                onClick={() => setChartMode('AGENT_ALPHA')}
                className={`px-3 py-1 rounded transition-colors ${
                  chartMode === 'AGENT_ALPHA'
                    ? 'bg-white text-foreground font-bold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Alpha Attribution by Agent
              </button>
            </div>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-border text-xs font-mono">
            {(['1M', '3M', 'YTD', '1Y', '3Y'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activePeriod === p
                    ? 'bg-primary text-primary-foreground font-bold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-[240px] w-full mt-2 relative">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'NAV' ? (
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="navGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis domain={[95, 125]} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border p-2.5 rounded-lg shadow-md text-xs font-mono text-popover-foreground">
                        <div className="font-bold text-primary">{d.month} 2025 Performance</div>
                        <div>Portfolio NAV: {d.nav.toFixed(1)} (+{(d.nav - 100).toFixed(1)}%)</div>
                        <div className="text-muted-foreground">Benchmark Index: {d.benchmark.toFixed(1)} (+{(d.benchmark - 100).toFixed(1)}%)</div>
                        <div className="text-emerald-600 font-bold mt-0.5">Net Agent Alpha: +{(d.nav - d.benchmark).toFixed(1)}%</div>
                      </div>
                    );
                  }}
                />
                <Area type="monotone" dataKey="nav" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#navGrad)" name="Fund NAV" />
                <Line type="monotone" dataKey="benchmark" stroke="#94a3b8" strokeWidth={1.8} strokeDasharray="4 4" dot={false} name="S&P 500 BM" />
              </AreaChart>
            ) : (
              <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'monospace' }} tickFormatter={(v) => `+${v}%`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border p-2.5 rounded-lg shadow-md text-xs font-mono text-popover-foreground space-y-1">
                        <div className="font-bold text-foreground">{d.month} Agent Alpha Contributions</div>
                        <div className="text-purple-600">Alpha Matrix (Quant Skew): +{d.quantAlpha}%</div>
                        <div className="text-blue-600">Macro Sentinel (Regime NLP): +{d.macroAlpha}%</div>
                        <div className="text-emerald-600">FlowRouter (Execution Savings): +{d.executionSavings}%</div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="quantAlpha" stackId="a" fill="#9333ea" name="Alpha Matrix AI (Quant Skew)" />
                <Bar dataKey="macroAlpha" stackId="a" fill="#2563eb" name="Macro Sentinel AI (Macro NLP)" />
                <Bar dataKey="executionSavings" stackId="a" fill="#10b981" name="FlowRouter AI (Execution Savings)" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border mt-1 text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Fund NAV (+18.4% YTD)
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2.5 h-0.5 bg-slate-400" />
              S&amp;P 500 Benchmark (+8.5% YTD)
            </span>
          </div>
          <span className="text-muted-foreground">
            Alpha Decomposition verified by Barra GEM3 risk model
          </span>
        </div>
      </div>

      {/* =========================================================================
          HOLDINGS TABLE WITH MULTI-AGENT CONVICTION & RISK RATINGS
         ========================================================================= */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border mb-3">
          <div>
            <h3 className="text-xs font-bold text-foreground tracking-tight font-mono uppercase">
              Portfolio Holdings &amp; Multi-Agent Conviction Matrix
            </h3>
            <p className="text-xs text-muted-foreground">
              Real-time multi-agent evaluations: Quant Alpha Score, Aegis Risk Caps, Macro Alignment, and SEC 15c3-5 Clearance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToHoldings}
              className="text-xs font-mono text-primary hover:underline font-medium flex items-center gap-1"
            >
              Open Full Holdings &amp; Risk Blotter →
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2 px-2">Asset / Ticker</th>
                <th className="py-2 px-2">Weight</th>
                <th className="py-2 px-2">Market Val</th>
                <th className="py-2 px-2">Unrealized P&amp;L</th>
                <th className="py-2 px-2">Alpha Agent Conviction</th>
                <th className="py-2 px-2">Aegis Risk Officer Status</th>
                <th className="py-2 px-2">Macro Sentinel Alignment</th>
                <th className="py-2 px-2 text-right">SEC Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {agentEvaluatedHoldings.map((h) => (
                <tr 
                  key={h.symbol}
                  onClick={onNavigateToHoldings}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-2">
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {h.symbol}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-sans truncate max-w-[150px]">
                      {h.name}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 font-bold text-foreground">
                    {h.weight}
                  </td>
                  <td className="py-2.5 px-2 text-foreground">
                    {h.value}
                  </td>
                  <td className="py-2.5 px-2">
                    <span className={`font-bold ${h.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {h.pnl}
                    </span>
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 text-[10px]">
                        {h.alphaScore}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-sans">
                        {h.alphaRating}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      h.riskVerdict.includes('VETO') 
                        ? 'bg-amber-50 text-amber-800 border-amber-300' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {h.riskVerdict}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-muted-foreground font-sans text-[11px]">
                    {h.macroAlignment}
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <Badge variant="outline" className="bg-cyan-50 text-cyan-800 border-cyan-200 text-[10px] font-mono">
                      {h.complianceStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
