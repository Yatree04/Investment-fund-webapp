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
  Diamond,
  Search,
  Sliders,
  Database,
  BarChart2,
  Clock,
  UserCheck,
  Zap,
  Lock,
  Check,
  AlertTriangle,
  Send,
  Terminal,
  FileText,
  LineChart as LineChartIcon,
  ChevronRight,
  ExternalLink,
  Cpu,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from 'recharts';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { StrategyIdea } from './AIOptimizerWindow';

interface AllocationOptimizerViewProps {
  funds: Fund[];
  onCommitRebalance: (orders: TradeOrder[]) => void;
  onExperimentInAgentWorkspace?: (strategy: StrategyIdea) => void;
  onOpenAgentModal?: (query?: string) => void;
}

export const AllocationOptimizerView: React.FC<AllocationOptimizerViewProps> = ({
  funds,
  onCommitRebalance,
  onExperimentInAgentWorkspace,
  onOpenAgentModal
}) => {
  // Navigation Sub-Tabs matching wireframe: [Data and analysis] | [Portfolio stimulation Model 1] | [Portfolio stimulation Model 2]
  const [activeSubTab, setActiveSubTab] = useState<'data-analysis' | 'sim-model-1' | 'sim-model-2'>('data-analysis');

  // Timeframe / Metric pills in right panel
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');

  // Bottom prompt bar state
  const [promptBarText, setPromptBarText] = useState<string>('');
  const [promptResult, setPromptResult] = useState<string | null>(null);
  const [isPromptRunning, setIsPromptRunning] = useState<boolean>(false);

  // Trade Execution & Risk Restrictions Modal (Image 3)
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState<boolean>(false);
  const [executionTimeParam, setExecutionTimeParam] = useState<string>('TWAP 09:30 - 16:00 EST / 45-min interval');
  const [humanSupervisor, setHumanSupervisor] = useState<string>('Alexander Vance (PM) & Dr. Elena Rostova');
  const [gatewayParam, setGatewayParam] = useState<string>('NY4 FIX 4.4 Ultra-Low Latency DMA');
  
  // Autonomy, Human, Gateway toggles
  const [autonomyMode, setAutonomyMode] = useState<'Autonomous' | 'Semi-Autonomous' | 'Rule-Based'>('Autonomous');
  const [humanApprovalRequired, setHumanApprovalRequired] = useState<boolean>(true);
  const [gatewayProtocol, setGatewayProtocol] = useState<'DMA FIX' | 'Smart Router' | 'Dark Pool'>('DMA FIX');

  // Risk Management Restrictions Inputs
  const [maxRiskIndex, setMaxRiskIndex] = useState<string>('1.25% 1-Day VaR 95%');
  const [maxSectorExposure, setMaxSectorExposure] = useState<string>('15.0% Share of NAV');
  const [maxSingleAssetExposure, setMaxSingleAssetExposure] = useState<string>('5.0% Single Equity NAV');
  const [maxDrawdownLimit, setMaxDrawdownLimit] = useState<string>('3.50% Hard Stop Loss');

  // Notification status
  const [publishSuccessNotice, setPublishSuccessNotice] = useState<string | null>(null);

  // Interactive 9-Grid Card Selection State (Image 2)
  const [selectedGridCard, setSelectedGridCard] = useState<string | null>('card-1');

  // Chart data for Data & Analysis (Image 1)
  const dataAnalysisChartData = [
    { time: 'Week 1', nav: 100.0, benchmark: 100.0, confidence: 99.8 },
    { time: 'Week 2', nav: 102.4, benchmark: 101.1, confidence: 99.7 },
    { time: 'Week 3', nav: 105.1, benchmark: 102.0, confidence: 99.8 },
    { time: 'Week 4', nav: 107.8, benchmark: 102.8, confidence: 99.9 },
    { time: 'Week 5', nav: 111.2, benchmark: 103.5, confidence: 99.8 },
    { time: 'Week 6', nav: 114.6, benchmark: 104.2, confidence: 99.9 },
    { time: 'Week 7', nav: 118.0, benchmark: 105.0, confidence: 99.8 },
    { time: 'Week 8', nav: 122.5, benchmark: 106.1, confidence: 99.9 },
  ];

  // Chart data for Model 1 Simulation (Image 2)
  const model1SimChartData = [
    { time: '09:30', baseModel: 100.0, simulatedModel: 99.4, upperBand: 100.5, lowerBand: 98.5 },
    { time: '10:30', baseModel: 101.8, simulatedModel: 103.2, upperBand: 104.2, lowerBand: 102.0 },
    { time: '11:30', baseModel: 103.1, simulatedModel: 106.5, upperBand: 107.8, lowerBand: 105.1 },
    { time: '12:30', baseModel: 104.5, simulatedModel: 109.8, upperBand: 111.0, lowerBand: 108.4 },
    { time: '13:30', baseModel: 105.8, simulatedModel: 114.2, upperBand: 115.6, lowerBand: 112.8 },
    { time: '14:30', baseModel: 107.2, simulatedModel: 118.9, upperBand: 120.4, lowerBand: 117.2 },
    { time: '15:30', baseModel: 108.4, simulatedModel: 124.1, upperBand: 125.8, lowerBand: 122.5 },
    { time: '16:00', baseModel: 109.2, simulatedModel: 128.5, upperBand: 130.2, lowerBand: 126.8 },
  ];

  // Chart data for Model 2 Simulation (Image 2)
  const model2SimChartData = [
    { time: '09:30', baseModel: 100.0, simulatedModel: 98.8, upperBand: 100.2, lowerBand: 97.5 },
    { time: '10:30', baseModel: 101.8, simulatedModel: 104.5, upperBand: 106.0, lowerBand: 103.0 },
    { time: '11:30', baseModel: 103.1, simulatedModel: 108.2, upperBand: 110.1, lowerBand: 106.4 },
    { time: '12:30', baseModel: 104.5, simulatedModel: 112.4, upperBand: 114.2, lowerBand: 110.5 },
    { time: '13:30', baseModel: 105.8, simulatedModel: 117.9, upperBand: 120.0, lowerBand: 115.8 },
    { time: '14:30', baseModel: 107.2, simulatedModel: 122.5, upperBand: 124.8, lowerBand: 120.2 },
    { time: '15:30', baseModel: 108.4, simulatedModel: 127.8, upperBand: 130.0, lowerBand: 125.4 },
    { time: '16:00', baseModel: 109.2, simulatedModel: 132.4, upperBand: 134.8, lowerBand: 130.0 },
  ];

  // 9 Interactive Factor & Asset Cards (Image 2)
  const factorAndAssetCards = [
    {
      id: 'card-1',
      title: 'Factors and stalks',
      category: 'Alpha Factors',
      metric: 'Momentum +1.84σ',
      subtext: '42 Long / 18 Short equities',
      status: 'OPTIMAL',
      details: 'Dynamic cross-sectional momentum ranking across S&P 500 with Barra factor orthogonalization.'
    },
    {
      id: 'card-2',
      title: 'assets etc',
      category: 'Asset Allocation',
      metric: '58% Eq / 24% Opt / 18% UST',
      subtext: 'Multi-asset overlay',
      status: 'BALANCED',
      details: 'Delta hedged equity portfolio with sovereign bond roll-down carry and volatility skew protection.'
    },
    {
      id: 'card-3',
      title: 'Sector Weights',
      category: 'GICS Constraints',
      metric: 'Tech 28.5% | Fin 22.0%',
      subtext: 'Max sector cap: 15.0%',
      status: 'COMPLIANT',
      details: 'Strict sector bounds enforced to prevent over-concentration in semiconductor hardware.'
    },
    {
      id: 'card-4',
      title: 'Volatility Skew',
      category: 'Options Convexity',
      metric: '25Δ Skew: 2.4σ Arb',
      subtext: 'Variance premia harvest',
      status: 'ACTIVE',
      details: 'ATM vs 25-delta OTM implied volatility surface arbitrage capturing systematic retail premium.'
    },
    {
      id: 'card-5',
      title: 'Beta Neutralization',
      category: 'Risk Hedge',
      metric: 'Market Beta: 0.008',
      subtext: 'Target: 0.00 ± 0.02',
      status: 'NEUTRALIZED',
      details: 'S&P 500 E-mini future overlays continuously neutralizing systemic equity market direction.'
    },
    {
      id: 'card-6',
      title: 'Liquidity Depth',
      category: 'Market Access',
      metric: 'ADV Cap: <2.10%',
      subtext: 'Est. Slippage: 0.18 bps',
      status: 'HIGH DEPTH',
      details: 'Order slicing algorithm guarantees orders do not exceed 2.5% of trailing 30-day average daily volume.'
    },
    {
      id: 'card-7',
      title: 'Carry & Yield',
      category: 'Fixed Income / FX',
      metric: '+14.2 bps Net Carry',
      subtext: 'USD/JPY Cross-currency basis',
      status: 'HARVESTING',
      details: 'Captures offshore funding disparity via 3-month currency basis swaps into SOFR collateral.'
    },
    {
      id: 'card-8',
      title: 'Tail Risk Bounds',
      category: 'VaR & Stress',
      metric: '95% VaR: 1.14%',
      subtext: 'Max Drawdown: -3.80%',
      status: 'SECURE',
      details: 'OTM put spread collar ladder guarantees capital preservation under catastrophic tail-risk shocks.'
    },
    {
      id: 'card-9',
      title: 'Execution Gateway',
      category: 'FIX Protocol',
      metric: 'DMA Route: 0.08 ms',
      subtext: 'SEC 15c3-5 Approved',
      status: 'ONLINE',
      details: 'Low-latency direct market access with pre-trade price collar & capital threshold enforcement.'
    }
  ];

  // Handle bottom prompt submission
  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptBarText.trim()) return;

    setIsPromptRunning(true);
    const query = promptBarText;

    setTimeout(() => {
      setIsPromptRunning(false);
      setPromptResult(
        `✓ PORTFOLIO FIT AUDIT COMPLETE FOR "${query}":\n` +
        `• Active Allocation: 58.0% Equities / 24.0% Options Variance / 18.0% UST Yield.\n` +
        `• Stress Test Verification: Passed SEC 15c3-5 and 95% VaR bounds (1.14% vs 1.25% limit).\n` +
        `• Recommended Action: Deploy portfolio fit hypothesis with 15.0% max sector ceiling and automated TWAP routing.`
      );
    }, 700);
  };

  // Handle Publish Limits & Trade (Image 3)
  const handlePublishLimitsAndTrade = (e: React.FormEvent) => {
    e.preventDefault();

    // Create simulated execution orders
    const newOrders: TradeOrder[] = [
      {
        id: `ord-lim-${Date.now()}-1`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        fundId: 'des-oculus',
        ticker: 'SPY',
        name: 'SPDR S&P 500 ETF (Delta Hedge)',
        side: 'BUY',
        shares: 45000,
        targetPrice: 585.20,
        status: 'EXECUTED',
        rationale: `Published limits: Autonomy [${autonomyMode}], VaR Cap [${maxRiskIndex}], Approved by [${humanSupervisor}]`
      },
      {
        id: `ord-lim-${Date.now()}-2`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        fundId: 'des-oculus',
        ticker: 'NVDA',
        name: 'NVIDIA Corp (Risk Rebalance)',
        side: 'SELL',
        shares: 12000,
        targetPrice: 128.40,
        status: 'EXECUTED',
        rationale: `Sector restriction compliance: Capped tech exposure under ${maxSectorExposure}`
      }
    ];

    onCommitRebalance(newOrders);
    setIsExecutionModalOpen(false);
    setPublishSuccessNotice(`✓ Trading limits published & ${newOrders.length} compliance orders dispatched via ${gatewayParam}!`);

    setTimeout(() => {
      setPublishSuccessNotice(null);
    }, 5000);
  };

  return (
    <div className="h-full flex-1 flex flex-col min-h-0 overflow-hidden space-y-2 select-none bg-muted/50 p-2 sm:p-3">
      
      {/* =========================================================================
          TOP COMMAND & HEADER BAR MATCHING SKETCH
          - Left: /agent bar
          - Sub-bar: [Current portfolio and market]
          - Right Tabs: [Data and analysis] [Portfolio stimulation Model 1] [Portfolio stimulation Model 2]
         ========================================================================= */}
      <div className="bg-card border border-border rounded-xl p-2.5 sm:p-3 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 shrink-0">
        
        {/* Left: /agent bar */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full flex items-center bg-muted hover:bg-card border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-ring/30 rounded-lg transition-all">
            <span className="pl-3 pr-1 text-primary font-mono text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </span>
            <input
              type="text"
              value={promptBarText}
              onChange={(e) => setPromptBarText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePromptSubmit(e)}
              placeholder="/agent bar - query market stats or optimize portfolio..."
              className="w-full py-1.5 pl-1 pr-8 text-xs font-mono text-foreground placeholder:text-muted-foreground bg-transparent focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handlePromptSubmit}
              className="absolute right-2 p-1 rounded text-primary hover:bg-accent"
              title="Execute /agent search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center/Right: Sub-tabs exactly matching wireframe sketches */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            type="button"
            onClick={() => setActiveSubTab('data-analysis')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'data-analysis'
                ? 'bg-chart-4 text-secondary font-bold border-chart-4 shadow-2xs'
                : 'bg-card text-foreground hover:bg-muted/50 border-border'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Data and analysis</span>
            {activeSubTab === 'data-analysis' && <Check className="w-3 h-3 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('sim-model-1')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'sim-model-1'
                ? 'bg-chart-4 text-secondary font-bold border-chart-4 shadow-2xs'
                : 'bg-card text-foreground hover:bg-muted/50 border-border'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Portfolio stimulation Model 1</span>
            {activeSubTab === 'sim-model-1' && <Check className="w-3 h-3 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('sim-model-2')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'sim-model-2'
                ? 'bg-chart-4 text-secondary font-bold border-chart-4 shadow-2xs'
                : 'bg-card text-foreground hover:bg-muted/50 border-border'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Portfolio stimulation Model 2</span>
            {activeSubTab === 'sim-model-2' && <Check className="w-3 h-3 ml-0.5" />}
          </button>
        </div>

        {/* Right Action: Restrictions & Deploy Button */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            onClick={() => setIsExecutionModalOpen(true)}
            className="h-8 px-3 text-xs font-mono font-bold bg-chart-2 hover:bg-chart-2 text-secondary rounded-lg gap-1.5 shadow-2xs"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Restrictions &amp; Trade Limits</span>
          </Button>
        </div>

      </div>

      {/* Success Notification Banner */}
      {publishSuccessNotice && (
        <div className="px-3 py-2 bg-muted border border-border text-foreground rounded-xl text-xs font-mono flex items-center justify-between gap-2 shrink-0 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-chart-4" />
            <span>{publishSuccessNotice}</span>
          </div>
          <Badge className="bg-chart-4 text-secondary text-[10px] font-mono">
            PUBLISHED &amp; ROUTED
          </Badge>
        </div>
      )}

      {/* Sub-Header Tag: "Current portfolio and market" */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-card border border-border rounded-lg text-xs font-mono font-bold text-foreground shadow-2xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-chart-4 animate-pulse" />
            <span>Current portfolio and market</span>
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            {activeSubTab === 'data-analysis' ? 'Live Data Feed & Predictive AI Risk Analysis' : 'Interactive Factor Allocation & Benchmark Simulation Sandbox'}
          </span>
        </div>
      </div>

      {/* =========================================================================
          MAIN 2-COLUMN VIEWPORT MATCHING WIREFRAME
          Left: 3 Stacked Cards (Market stats / Portfolio monitoring)
          Right: Dynamic Canvas (Data & Analysis OR Portfolio Simulation 3x3 Grid)
         ========================================================================= */}
      <div className="flex-1 min-h-0 border border-border rounded-2xl bg-card shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        
        {/* =========================================================================
            LEFT COLUMN: 3 STACKED CARDS MATCHING WIREFRAME
            Card 1: Market stats / Portfolio monitoring
            Card 2: Market stats (Factor Loadings / Volatility)
            Card 3: Market stats (Asset Distribution & Liquidity)
           ========================================================================= */}
        <div className="lg:col-span-4 border-r border-border p-3 sm:p-3.5 flex flex-col justify-between bg-muted/40 overflow-y-auto min-h-0 space-y-3">
          
          {/* Card 1: Market stats or Portfolio monitoring */}
          <div className="rounded-xl border-2 border-border bg-card p-3 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-chart-4" />
                <span className="font-mono text-xs font-bold text-foreground uppercase tracking-tight">
                  {activeSubTab === 'data-analysis' ? 'Market stats (Index & Rates)' : 'Portfolio monitoring (Live)'}
                </span>
              </div>
              <Badge variant="outline" className="bg-muted text-foreground border-border text-[9px] font-mono">
                {activeSubTab === 'data-analysis' ? 'S&P 500: 5,852.4' : 'Sharpe 2.84'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-muted p-2 rounded-lg border border-border/60">
                <span className="text-[9px] uppercase text-muted-foreground block">1-Year Return</span>
                <span className="text-sm font-bold text-chart-4">+22.4%</span>
                <span className="text-[9px] text-muted-foreground block">+4.2% vs Benchmark</span>
              </div>
              <div className="bg-muted p-2 rounded-lg border border-border/60">
                <span className="text-[9px] uppercase text-muted-foreground block">95% Daily VaR</span>
                <span className="text-sm font-bold text-foreground">1.14%</span>
                <span className="text-[9px] text-chart-4 block">Below 1.25% Cap</span>
              </div>
              <div className="bg-muted p-2 rounded-lg border border-border/60">
                <span className="text-[9px] uppercase text-muted-foreground block">Net Beta Tilt</span>
                <span className="text-sm font-bold text-foreground">0.008</span>
                <span className="text-[9px] text-chart-4 block">Market Neutral</span>
              </div>
              <div className="bg-muted p-2 rounded-lg border border-border/60">
                <span className="text-[9px] uppercase text-muted-foreground block">VIX Implied Vol</span>
                <span className="text-sm font-bold text-foreground">14.82</span>
                <span className="text-[9px] text-muted-foreground block">Skew: 2.4σ Rich</span>
              </div>
            </div>
          </div>

          {/* Card 2: Market stats (Factor & Sector Dynamics) */}
          <div className="rounded-xl border-2 border-border bg-card p-3 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-mono text-xs font-bold text-foreground uppercase tracking-tight">
                  Market stats (Factor Loadings)
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Barra GEM3</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              {[
                { factor: 'Momentum Factor', score: '+1.84σ', color: 'text-chart-4', fill: '85%' },
                { factor: 'Volatility Skew Premia', score: '+2.40σ', color: 'text-chart-2', fill: '92%' },
                { factor: 'Value vs Growth Spread', score: '-0.38σ', color: 'text-destructive', fill: '40%' },
                { factor: 'Quality & Balance Sheet', score: '+1.12σ', color: 'text-primary', fill: '68%' },
              ].map((f, idx) => (
                <div key={idx} className="bg-muted p-1.5 rounded-lg border border-border/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-foreground font-medium">{f.factor}</span>
                    <span className={`font-bold ${f.color}`}>{f.score}</span>
                  </div>
                  <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                    <div className="bg-chart-4 h-full rounded-full" style={{ width: f.fill }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Market stats (Asset Allocation & Liquidity) */}
          <div className="rounded-xl border-2 border-border bg-card p-3 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-chart-2" />
                <span className="font-mono text-xs font-bold text-foreground uppercase tracking-tight">
                  Market stats (Liquidity &amp; Asset Split)
                </span>
              </div>
              <span className="text-[10px] font-mono text-foreground font-bold">100% Allocated</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-muted/80 p-1.5 rounded border border-border">
                  <span className="text-[9px] uppercase text-foreground block">Equities</span>
                  <span className="text-xs font-bold text-foreground">58.0%</span>
                </div>
                <div className="bg-muted/80 p-1.5 rounded border border-border">
                  <span className="text-[9px] uppercase text-foreground block">Options/Var</span>
                  <span className="text-xs font-bold text-foreground">24.0%</span>
                </div>
                <div className="bg-accent/80 p-1.5 rounded border border-border">
                  <span className="text-[9px] uppercase text-accent-foreground block">UST / Cash</span>
                  <span className="text-xs font-bold text-accent-foreground">18.0%</span>
                </div>
              </div>

              <div className="bg-muted p-2 rounded-lg border border-border/60 text-[10.5px] text-muted-foreground space-y-0.5">
                <div className="flex items-center justify-between">
                  <span>ADV Liquidity Utilization:</span>
                  <strong className="text-foreground font-mono">2.1% (Cap &lt;2.5%)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Slippage Model Impact:</span>
                  <strong className="text-chart-4 font-mono">0.18 bps</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================================
            RIGHT AREA - VIEW 1: DATA AND ANALYSIS (Image 1)
           ========================================================================= */}
        {activeSubTab === 'data-analysis' && (
          <div className="lg:col-span-8 p-3 sm:p-4 flex flex-col justify-between overflow-y-auto min-h-0 space-y-3">
            
            {/* Top 4 Mini Pill Buttons matching wireframe sketch */}
            <div className="flex items-center justify-between pb-1 border-b border-border/70">
              <div className="flex items-center gap-1.5">
                {(['1D', '1W', '1M', '1Y'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTimeframe(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all border ${
                      selectedTimeframe === t
                        ? 'bg-secondary text-primary-foreground border-secondary shadow-2xs'
                        : 'bg-card text-muted-foreground hover:bg-muted border-border'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-chart-4 inline-block" />
                  Portfolio Trajectory
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-muted inline-block" />
                  S&amp;P 500 Baseline
                </span>
              </div>
            </div>

            {/* Main Interactive Growth / Trajectory Line Chart */}
            <div className="h-56 sm:h-64 w-full bg-muted/50 p-2 rounded-xl border border-border/80 shadow-2xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataAnalysisChartData}>
                  <defs>
                    <linearGradient id="dataAnalysisGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} stroke="var(--muted-foreground)" domain={[95, 130]} />
                  <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'var(--font-mono)', borderRadius: '8px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="nav" 
                    stroke="var(--chart-4)" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#dataAnalysisGrad)" 
                    name="Simulated Portfolio NAV" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="benchmark" 
                    stroke="var(--muted-foreground)" 
                    strokeWidth={1.75} 
                    strokeDasharray="4 4" 
                    dot={false} 
                    name="Benchmark Index" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* AI Suggestion Box (Green styled container matching the wireframe in Image 1) */}
            <div className="rounded-xl border-2 border-chart-4 bg-muted/80 p-3 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 text-foreground font-mono text-xs font-bold">
                <Sparkles className="w-4 h-4 text-foreground" />
                <span>Ai suggestion on how it might change, compare and for cast, risk coming, montoring etc,</span>
              </div>

              {/* 4 Distinct Detailed Bullet Lines matching the sketch */}
              <div className="space-y-2 font-sans text-xs text-foreground bg-card/80 p-3 rounded-lg border border-border shadow-2xs">
                <div className="flex items-start gap-2 border-b border-border pb-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-chart-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Regime Shift &amp; Volatility Forecast:</strong> Neural factor surface projects a 78% probability of volatility compression into upcoming macro rate decision. Implied skew curve is expected to flatten by 1.8 vol points across mega-cap tech index options.
                  </p>
                </div>

                <div className="flex items-start gap-2 border-b border-border pb-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-chart-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Comparative Model Performance:</strong> Model 1 (+22.5% cumulative alpha) outpaces passive benchmark by 16.4% while maintaining strict factor beta neutrality (0.008) and lower maximum drawdown (-3.8% vs -8.2%).
                  </p>
                </div>

                <div className="flex items-start gap-2 border-b border-border pb-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-chart-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Proactive Risk &amp; Concentration Warning:</strong> Semiconductor GICS exposure currently sits at 13.8% (approaching the 15.0% mandate cap). Recommend staging pre-trade collar hedge to lock in unrealized gamma gains before earnings.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-chart-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Live Telemetry &amp; Anti-Hallucination Monitoring:</strong> All sub-agent scratchpads refreshed 38s ago against live OPRA and NY4 tick logs. Confidence score is mathematically grounded at 99.8% with zero memory drift.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            RIGHT AREA - VIEW 2 & 3: PORTFOLIO STIMULATION MODEL 1 & MODEL 2 (Image 2)
           ========================================================================= */}
        {(activeSubTab === 'sim-model-1' || activeSubTab === 'sim-model-2') && (
          <div className="lg:col-span-8 p-3 sm:p-4 flex flex-col justify-between overflow-y-auto min-h-0 space-y-3">
            
            {/* Top 4 Mini Pill Buttons matching wireframe sketch */}
            <div className="flex items-center justify-between pb-1 border-b border-border/70">
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'Expected Sharpe', val: activeSubTab === 'sim-model-1' ? '2.84' : '3.12' },
                  { label: 'Simulated 95% VaR', val: activeSubTab === 'sim-model-1' ? '1.14%' : '0.98%' },
                  { label: 'Alpha Outperformance', val: activeSubTab === 'sim-model-1' ? '+5.6%' : '+7.2%' },
                  { label: 'Max Drawdown', val: activeSubTab === 'sim-model-1' ? '-3.8%' : '-2.4%' },
                ].map((p, pIdx) => (
                  <div key={pIdx} className="px-2.5 py-1 rounded-lg bg-muted border border-border text-center">
                    <span className="text-[8px] font-mono uppercase text-muted-foreground block">{p.label}</span>
                    <span className="text-[11px] font-mono font-bold text-foreground block">{p.val}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <span className="w-2.5 h-0.5 bg-secondary inline-block" />
                  Base Model
                </span>
                <span className="flex items-center gap-1 text-destructive font-bold">
                  <span className="w-2.5 h-0.5 bg-destructive inline-block" />
                  {activeSubTab === 'sim-model-1' ? 'Model 1 Simulation' : 'Model 2 Simulation'}
                </span>
              </div>
            </div>

            {/* Dual Comparison Chart (Base vs Red Line Simulation matching Image 2 sketch) */}
            <div className="h-44 sm:h-52 w-full bg-muted/50 p-2 rounded-xl border border-border/80 shadow-2xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeSubTab === 'sim-model-1' ? model1SimChartData : model2SimChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} stroke="var(--muted-foreground)" domain={[95, 136]} />
                  <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'var(--font-mono)', borderRadius: '8px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="baseModel" 
                    stroke="var(--secondary)" 
                    strokeWidth={2} 
                    dot={false} 
                    name="Base Portfolio Model" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="simulatedModel" 
                    stroke="var(--chart-5)" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: 'var(--chart-5)' }} 
                    name="Simulated Model Trajectory" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 3x3 Grid of 9 Factors & Asset Allocation Cards (Green background, red outline styling matching Image 2 sketch) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-foreground font-bold px-0.5">
                <span>Factors, Assets &amp; Strategic Hypothesis Matrix (3x3 Grid):</span>
                <span className="text-[10px] text-muted-foreground font-normal">Click any card to inspect hypothesis</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {factorAndAssetCards.map((card) => {
                  const isSelected = selectedGridCard === card.id;

                  return (
                    <div
                      key={card.id}
                      onClick={() => setSelectedGridCard(card.id)}
                      className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer shadow-2xs space-y-1 bg-muted/75 ${
                        isSelected
                          ? 'border-destructive ring-2 ring-destructive/30 bg-muted/90'
                          : 'border-border hover:border-destructive hover:bg-muted/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs font-mono text-foreground truncate">
                          {card.title}
                        </span>
                        <span className="px-1 py-0.2 bg-card/90 text-foreground text-[8px] font-mono font-bold rounded border border-border">
                          {card.status}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono font-semibold text-foreground truncate">
                        {card.metric}
                      </div>

                      <div className="text-[9.5px] font-sans text-foreground line-clamp-1">
                        {card.subtext}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Row inside View 2: Deploy portfolio fit and hypothesis Button */}
            <div className="pt-2 flex items-center justify-end">
              <Button
                type="button"
                onClick={() => setIsExecutionModalOpen(true)}
                className="h-10 px-5 bg-card hover:bg-muted text-foreground border-2 border-chart-4 rounded-xl font-mono text-xs font-bold gap-2 shadow-xs transition-all hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4 text-chart-4" />
                <span>Deploy portfolio fit and hypothesis</span>
              </Button>
            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
          BOTTOM PROMPT BAR (Across All Views) MATCHING WIREFRAME
          "prompt bar to understand and audit previous workflows that were done and make things portfolio fit analysis..."
         ========================================================================= */}
      <div className="bg-card border border-border rounded-xl p-2.5 sm:p-3 shadow-2xs space-y-2 shrink-0">
        <form onSubmit={handlePromptSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-muted hover:bg-card border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-ring/30 rounded-xl transition-all">
            <span className="pl-3.5 pr-1.5 text-primary font-mono text-xs font-semibold flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-primary" />
            </span>
            <input
              type="text"
              value={promptBarText}
              onChange={(e) => setPromptBarText(e.target.value)}
              placeholder="prompt bar to understand and audit previous workflows that were done and make things portfolio fit analysis..."
              className="w-full py-2 pl-1 pr-10 text-xs sm:text-sm font-mono text-foreground placeholder:text-muted-foreground/80 bg-transparent focus:outline-hidden"
            />
          </div>
          <Button
            type="submit"
            disabled={isPromptRunning || !promptBarText.trim()}
            className="h-10 px-4 bg-chart-4 hover:bg-chart-4 text-secondary text-xs font-mono rounded-xl font-bold gap-1.5 shadow-xs shrink-0"
          >
            {isPromptRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Analyze Portfolio Fit</span>
          </Button>
        </form>

        {/* Prompt Output Card */}
        {promptResult && (
          <div className="p-3 bg-secondary text-secondary-foreground rounded-xl font-mono text-xs space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between pb-1 border-b border-secondary text-muted-foreground text-[11px]">
              <span className="text-chart-4 font-bold"># PORTFOLIO FIT INTELLIGENCE RESPONSE</span>
              <button
                type="button"
                onClick={() => setPromptResult(null)}
                className="text-muted-foreground hover:text-primary-foreground"
              >
                ✕ Close
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-secondary-foreground">
              {promptResult}
            </pre>
          </div>
        )}
      </div>

      {/* =========================================================================
          TRADE EXECUTION & RISK RESTRICTIONS MODAL (Image 3)
          - Header: Trade execution
          - Top right: mark in some format (e.g. SEC 15c3-5 / FIX 4.4)
          - Time and other parameters: Autonomy / Human / Gateway
          - Risk Management: Max risk index / Max sector exposure / Max single asset
          - Action: Publish limits and trade
         ========================================================================= */}
      {isExecutionModalOpen && (
        <div className="fixed inset-0 z-50 bg-secondary/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card text-foreground border-2 border-border rounded-3xl shadow-2xl w-full max-w-xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 font-mono">
            
            {/* Header matching Image 3 sketch */}
            <div className="flex items-start justify-between border-b border-border/80 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-mono tracking-tight text-foreground">
                  Trade execution
                </h3>
                <p className="text-xs text-muted-foreground font-sans mt-0.5">
                  Algorithmic routing constraints and pre-trade regulatory restrictions
                </p>
              </div>

              {/* Top right: "mark in some format" */}
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-lg bg-muted/90 border border-border text-[10px] font-mono font-bold text-foreground">
                  SEC 15c3-5 / FIX 4.4 DMA
                </span>
                <span className="text-[9px] text-muted-foreground block mt-0.5">mark in some format</span>
              </div>
            </div>

            <form onSubmit={handlePublishLimitsAndTrade} className="space-y-4">
              
              {/* Section 1: Time and other parameters to be added (Rows with Autonomy, Human, Gateway buttons) */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Time and other parameters to be added
                </div>

                {/* Row 1: Time / TWAP execution window + [Autonomy] Button */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={executionTimeParam}
                      onChange={(e) => setExecutionTimeParam(e.target.value)}
                      placeholder="e.g. TWAP 09:30 - 16:00 EST / 45-min interval"
                      className="h-10 text-xs font-mono bg-card/90 border-border rounded-xl text-foreground focus-visible:ring-border"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAutonomyMode(autonomyMode === 'Autonomous' ? 'Semi-Autonomous' : 'Autonomous')}
                    className={`h-10 px-4 rounded-xl text-xs font-mono font-bold shrink-0 border-border ${
                      autonomyMode === 'Autonomous'
                        ? 'bg-secondary text-primary-foreground hover:bg-secondary'
                        : 'bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    Autonomy ({autonomyMode})
                  </Button>
                </div>

                {/* Row 2: Human Operator Sign-off + [Human] Button */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={humanSupervisor}
                      onChange={(e) => setHumanSupervisor(e.target.value)}
                      placeholder="e.g. Alexander Vance (PM) & Risk Officer"
                      className="h-10 text-xs font-mono bg-card/90 border-border rounded-xl text-foreground focus-visible:ring-border"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setHumanApprovalRequired(!humanApprovalRequired)}
                    className={`h-10 px-4 rounded-xl text-xs font-mono font-bold shrink-0 border-border ${
                      humanApprovalRequired
                        ? 'bg-chart-2 text-secondary hover:bg-chart-2'
                        : 'bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    Human ({humanApprovalRequired ? 'Dual Sign-off' : 'Auto'})
                  </Button>
                </div>

                {/* Row 3: Gateway FIX route + [Gateway] Button */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={gatewayParam}
                      onChange={(e) => setGatewayParam(e.target.value)}
                      placeholder="e.g. NY4 FIX 4.4 Ultra-Low Latency DMA"
                      className="h-10 text-xs font-mono bg-card/90 border-border rounded-xl text-foreground focus-visible:ring-border"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setGatewayProtocol(gatewayProtocol === 'DMA FIX' ? 'Smart Router' : 'DMA FIX')}
                    className="h-10 px-4 rounded-xl text-xs font-mono font-bold shrink-0 bg-secondary text-primary-foreground hover:bg-secondary border-border"
                  >
                    Gateway ({gatewayProtocol})
                  </Button>
                </div>
              </div>

              {/* Section 2: Risk Management Restrictions (Image 3) */}
              <div className="space-y-3 pt-2 border-t border-border/80">
                <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Risk Management
                </div>

                {/* Maximum risk index */}
                <div className="flex items-center justify-between gap-4">
                  <label className="text-xs font-mono font-medium text-foreground flex-1">
                    Maximum risk index
                  </label>
                  <div className="w-48 sm:w-56">
                    <Input
                      type="text"
                      value={maxRiskIndex}
                      onChange={(e) => setMaxRiskIndex(e.target.value)}
                      placeholder="e.g. 1.25% 1-Day VaR 95%"
                      className="h-9 text-xs font-mono bg-card/90 border-border rounded-xl text-foreground"
                    />
                  </div>
                </div>

                {/* Max sector exposure: Share of NAV in one GICS sector */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs font-mono font-medium text-foreground">
                      Max sector exposure
                    </div>
                    <div className="text-[10px] text-muted-foreground font-sans">
                      Share of NAV in one GICS sector
                    </div>
                  </div>
                  <div className="w-48 sm:w-56">
                    <Input
                      type="text"
                      value={maxSectorExposure}
                      onChange={(e) => setMaxSectorExposure(e.target.value)}
                      placeholder="e.g. 15.0% Share of NAV"
                      className="h-9 text-xs font-mono bg-card/90 border-border rounded-xl text-foreground"
                    />
                  </div>
                </div>

                {/* Max single asset exposure: Share of NAV in one asset */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs font-mono font-medium text-foreground">
                      Max single asset exposure
                    </div>
                    <div className="text-[10px] text-muted-foreground font-sans">
                      Share of NAV in one stock / instrument
                    </div>
                  </div>
                  <div className="w-48 sm:w-56">
                    <Input
                      type="text"
                      value={maxSingleAssetExposure}
                      onChange={(e) => setMaxSingleAssetExposure(e.target.value)}
                      placeholder="e.g. 5.0% Single Asset NAV"
                      className="h-9 text-xs font-mono bg-card/90 border-border rounded-xl text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons: Cancel and "Publish limits and trade" */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExecutionModalOpen(false)}
                  className="h-10 px-4 text-xs font-mono border-border bg-card/80 hover:bg-card text-foreground rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-10 px-6 text-xs font-mono font-bold bg-secondary hover:bg-secondary text-primary-foreground rounded-xl shadow-xs transition-all hover:scale-[1.01]"
                >
                  Publish limits and trade
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
