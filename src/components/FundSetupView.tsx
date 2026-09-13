import React, { useState, useMemo, useEffect } from 'react';
import { Fund, FundMandateLimits, Holding, AssetClass } from '../types';
import { 
  DEFAULT_OCULUS_LIMITS, 
  DEFAULT_COMPOSITE_LIMITS, 
  DEFAULT_VALENCE_LIMITS,
  STRATEGY_PRESETS,
  evaluateFundCompliance,
  ComplianceCheckResult
} from '../data/mandateDefaults';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sliders, 
  SlidersHorizontal,
  Plus, 
  Check, 
  AlertTriangle, 
  Save, 
  RotateCcw, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Bot, 
  Scale, 
  Lock, 
  Unlock, 
  FileText, 
  Download, 
  ExternalLink,
  Info,
  CheckCircle2,
  XCircle,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  RefreshCw,
  Eye
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface FundSetupViewProps {
  funds: Fund[];
  selectedFundId: string;
  onSelectFund: (fundId: string) => void;
  onUpdateFundLimits: (fundId: string, limits: FundMandateLimits, updatedMetadata?: Partial<Fund>) => void;
  onCreateFund: (newFund: Fund) => void;
  onNavigateToOverview?: () => void;
}

export const FundSetupView: React.FC<FundSetupViewProps> = ({
  funds,
  selectedFundId,
  onSelectFund,
  onUpdateFundLimits,
  onCreateFund,
  onNavigateToOverview,
}) => {
  const currentFund = useMemo(() => {
    return funds.find((f) => f.id === selectedFundId) || funds[0];
  }, [funds, selectedFundId]);

  // Determine initial limits for current fund
  const getInitialLimits = (fund: Fund): FundMandateLimits => {
    if (fund.mandateLimits) return fund.mandateLimits;
    if (fund.id.includes('composite')) return DEFAULT_COMPOSITE_LIMITS;
    if (fund.id.includes('valence')) return DEFAULT_VALENCE_LIMITS;
    return DEFAULT_OCULUS_LIMITS;
  };

  const [limits, setLimits] = useState<FundMandateLimits>(() => getInitialLimits(currentFund));
  const [activeConfigTab, setActiveConfigTab] = useState<'CONCENTRATION' | 'LEVERAGE' | 'RISK_VAR' | 'SECTORS' | 'AGENTS'>('CONCENTRATION');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isNewFundModalOpen, setIsNewFundModalOpen] = useState<boolean>(false);
  const [newTickerInput, setNewTickerInput] = useState<string>('');
  
  // New fund draft state
  const [newFundDraft, setNewFundDraft] = useState({
    name: '',
    strategy: 'Systematic Macro & Cross-Asset Volatility',
    baseCurrency: 'USD' as 'USD' | 'INR' | 'EUR' | 'GBP',
    aumMillions: 1250,
    benchmark: 'HFRI Macro (Total) Index',
    targetAnnualReturnPct: 15.5,
    targetVolPct: 6.8,
    presetId: 'systematic-macro',
    description: '',
  });

  // When selectedFundId changes, update local limits
  useEffect(() => {
    setLimits(getInitialLimits(currentFund));
    setSaveSuccess(false);
  }, [selectedFundId, currentFund]);

  // Evaluate compliance in real time as limits change
  const complianceResults = useMemo(() => {
    return evaluateFundCompliance(currentFund, limits);
  }, [currentFund, limits]);

  const breachCount = complianceResults.filter((r) => r.status === 'BREACH').length;
  const warningCount = complianceResults.filter((r) => r.status === 'WARNING').length;
  const passCount = complianceResults.filter((r) => r.status === 'PASS').length;

  const handleSaveLimits = () => {
    onUpdateFundLimits(currentFund.id, limits, {
      mandateLimits: limits,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetLimits = () => {
    setLimits(getInitialLimits(currentFund));
  };

  const handleApplyPreset = (presetLimits: FundMandateLimits) => {
    setLimits({ ...presetLimits });
  };

  const handleAddProhibitedTicker = () => {
    const trimmed = newTickerInput.trim().toUpperCase();
    if (trimmed && !limits.prohibitedTickers.includes(trimmed)) {
      setLimits({
        ...limits,
        prohibitedTickers: [...limits.prohibitedTickers, trimmed],
      });
      setNewTickerInput('');
    }
  };

  const handleRemoveProhibitedTicker = (tickerToRemove: string) => {
    setLimits({
      ...limits,
      prohibitedTickers: limits.prohibitedTickers.filter((t) => t !== tickerToRemove),
    });
  };

  const handleCreateFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFundDraft.name.trim()) return;

    const preset = STRATEGY_PRESETS.find((p) => p.id === newFundDraft.presetId);
    const chosenLimits = preset ? preset.limits : DEFAULT_OCULUS_LIMITS;

    const newId = `des-${newFundDraft.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)}-${Date.now().toString().slice(-4)}`;

    const newFund: Fund = {
      id: newId,
      name: newFundDraft.name.trim(),
      strategy: newFundDraft.strategy,
      inceptionYear: new Date().getFullYear(),
      aumMillions: Number(newFundDraft.aumMillions) || 1000,
      nav: 100.0,
      ytdReturnPct: 0.0,
      oneYearReturnPct: 0.0,
      threeYearAnnualizedPct: 0.0,
      sharpeRatio: 2.1,
      sortinoRatio: 2.8,
      maxDrawdownPct: 0.0,
      var95Pct: Number((chosenLimits.maxVar95Pct * 0.75).toFixed(2)),
      betaToSP500: 0.12,
      volatilityPct: Number(newFundDraft.targetVolPct) || 6.5,
      grossExposurePct: 120.0,
      netExposurePct: 15.0,
      longShortRatio: 1.3,
      baseCurrency: newFundDraft.baseCurrency,
      benchmark: newFundDraft.benchmark,
      mandateLimits: chosenLimits,
      assetAllocations: [
        { asset: 'Equities', pct: 45.0 },
        { asset: 'Fixed Income', pct: 25.0 },
        { asset: 'Quantitative Derivatives', pct: 20.0 },
        { asset: 'Cash & Short-Term', pct: 10.0 },
      ],
      factorExposures: [
        { factor: 'Momentum (Cross-Asset)', exposure: 0.45, contribution: 2.1 },
        { factor: 'Value & Carry', exposure: 0.35, contribution: 1.5 },
        { factor: 'Low Volatility', exposure: 0.40, contribution: 1.2 },
      ],
      historicalPerformance: [
        { date: '2026-01', fundNav: 100.0, fundReturnPct: 0.0, benchmarkReturnPct: 0.0 },
      ],
      monthlyReturns: [],
      holdings: [
        {
          id: `h-${Date.now()}-1`,
          ticker: 'SPY',
          name: 'SPDR S&P 500 ETF Trust Overlay',
          assetClass: 'Equities',
          sector: 'Broad Market',
          side: 'Long',
          shares: 50000,
          price: 545.20,
          marketValue: 27260000,
          weightPct: 5.5,
          unrealizedPnL: 340000,
          unrealizedPnLPct: 1.26,
          beta: 1.0,
          varContribution: 0.35,
        },
        {
          id: `h-${Date.now()}-2`,
          ticker: 'UST10Y',
          name: 'US Treasury 10Y Note Futures',
          assetClass: 'Fixed Income',
          sector: 'Sovereign Debt',
          side: 'Long',
          shares: 200,
          price: 110.25,
          marketValue: 22050000,
          weightPct: 4.4,
          unrealizedPnL: 180000,
          unrealizedPnLPct: 0.82,
          beta: -0.15,
          varContribution: -0.10,
        },
      ],
      scenarios: [
        {
          scenarioId: 'fed-hawkish-shock',
          name: 'Fed Surprise +50bps Rate Hike',
          description: 'Rates yield curve steepens, short duration hedge activates',
          pnlImpactM: -8.5,
          navImpactPct: -0.85,
          varChangePct: 15.0,
          severity: 'Moderate',
          sectorBreakdown: [{ sector: 'Fixed Income', impactPct: -1.2 }],
        },
      ],
    };

    onCreateFund(newFund);
    onSelectFund(newId);
    setIsNewFundModalOpen(false);
    setNewFundDraft({
      name: '',
      strategy: 'Systematic Macro & Cross-Asset Volatility',
      baseCurrency: 'USD',
      aumMillions: 1250,
      benchmark: 'HFRI Macro (Total) Index',
      targetAnnualReturnPct: 15.5,
      targetVolPct: 6.8,
      presetId: 'systematic-macro',
      description: '',
    });
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12 select-none">
      
      {/* =========================================================================
          TOP EXECUTIVE COMMAND BAR: FUND SELECTOR & MANDATE STATUS
         ========================================================================= */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Fund Identity with Active Limits Badge */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h1 className="text-lg font-bold text-foreground tracking-tight font-sans">
                Fund Setup &amp; Mandate Limits
              </h1>
              <Badge variant="outline" className="font-mono text-xs bg-slate-100 text-slate-800 border-border">
                {currentFund.name}
              </Badge>
              {breachCount === 0 ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mandate Healthy (0 Breaches)
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-xs font-mono flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {breachCount} Mandate Limit Breaches
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Define statutory concentration limits, balance-sheet leverage ceilings, Barra factor corridors, and autonomous AI fleet execution policies for the active fund.
            </p>
          </div>

          {/* Quick Actions: Add New Fund, Reset, Save & Apply */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewFundModalOpen(true)}
              className="h-8 px-3 text-xs font-mono font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 rounded-lg gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New Fund</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetLimits}
              className="h-8 px-3 text-xs font-mono font-semibold bg-white hover:bg-slate-50 border-border text-foreground rounded-lg gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Reset</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleSaveLimits}
              className={`h-8 px-4 text-xs font-mono font-semibold rounded-lg gap-1.5 transition-all shadow-xs ${
                saveSuccess 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Mandate Enforced &amp; Synced</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save &amp; Apply Limits</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Available Funds Selector Strip */}
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono shrink-0 mr-2">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Active Fund:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 flex-1">
            {funds.map((f) => {
              const isSelected = f.id === currentFund.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onSelectFund(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap border ${
                    isSelected
                      ? 'bg-slate-900 text-white font-semibold border-slate-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-border'
                  }`}
                >
                  <span className="font-sans font-medium">{f.name}</span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-200/60 text-slate-600'}`}>
                    ${f.aumMillions}M
                  </span>
                </button>
              );
            })}
          </div>
          {onNavigateToOverview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToOverview}
              className="text-xs font-mono text-muted-foreground hover:text-foreground shrink-0 gap-1 h-7"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* =========================================================================
          MAIN GRID: CONFIGURATION TABS (LEFT 8 COLS) + LIVE COMPLIANCE ENGINE (RIGHT 4 COLS)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* LEFT COLUMN: PARAMETER SETUP TABS */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-border overflow-x-auto">
            <button
              onClick={() => setActiveConfigTab('CONCENTRATION')}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeConfigTab === 'CONCENTRATION'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>Position Concentration</span>
            </button>
            <button
              onClick={() => setActiveConfigTab('LEVERAGE')}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeConfigTab === 'LEVERAGE'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>Leverage &amp; Net Exposure</span>
            </button>
            <button
              onClick={() => setActiveConfigTab('RISK_VAR')}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeConfigTab === 'RISK_VAR'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>VaR &amp; Drawdown Halts</span>
            </button>
            <button
              onClick={() => setActiveConfigTab('SECTORS')}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeConfigTab === 'SECTORS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sector &amp; Asset Bands</span>
            </button>
            <button
              onClick={() => setActiveConfigTab('AGENTS')}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeConfigTab === 'AGENTS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Fleet Governance</span>
            </button>
          </div>

          {/* TAB 1: POSITION CONCENTRATION */}
          {activeConfigTab === 'CONCENTRATION' && (
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-foreground font-sans flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  Single-Name &amp; Concentration Guardrails
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Protects fund AUM against idiosyncratic single-stock blowups, liquidity freezes, and gap risk.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Max Single Position Cap */}
                <div className="p-3.5 bg-slate-50/70 rounded-lg border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      Max Single-Stock Cap (% of NAV)
                    </label>
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {limits.maxSinglePositionPct.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="15.0"
                    step="0.5"
                    value={limits.maxSinglePositionPct}
                    onChange={(e) =>
                      setLimits({ ...limits, maxSinglePositionPct: parseFloat(e.target.value) })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Hard threshold. Aegis Risk Officer automatically vetos buy orders crossing this limit.
                  </p>
                </div>

                {/* Warning Concentration Threshold */}
                <div className="p-3.5 bg-slate-50/70 rounded-lg border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      Pre-Trade Warning Threshold (% of NAV)
                    </label>
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {limits.warningSinglePositionPct.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="12.0"
                    step="0.5"
                    value={limits.warningSinglePositionPct}
                    onChange={(e) =>
                      setLimits({ ...limits, warningSinglePositionPct: parseFloat(e.target.value) })
                    }
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Soft early-warning buffer. Triggers alert before reaching the hard single-stock cap.
                  </p>
                </div>

                {/* Top 5 Holdings Aggregated Cap */}
                <div className="p-3.5 bg-slate-50/70 rounded-lg border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      Top 5 Holdings Combined Cap
                    </label>
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-200/70 px-2 py-0.5 rounded">
                      {limits.maxTop5HoldingsPct.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20.0"
                    max="60.0"
                    step="1.0"
                    value={limits.maxTop5HoldingsPct}
                    onChange={(e) =>
                      setLimits({ ...limits, maxTop5HoldingsPct: parseFloat(e.target.value) })
                    }
                    className="w-full accent-slate-700 cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Limits cumulative concentration in top portfolio leaders.
                  </p>
                </div>

                {/* Minimum Cash Buffer */}
                <div className="p-3.5 bg-slate-50/70 rounded-lg border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      Minimum Cash &amp; Liquidity Buffer
                    </label>
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {limits.minCashBufferPct.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="15.0"
                    step="0.5"
                    value={limits.minCashBufferPct}
                    onChange={(e) =>
                      setLimits({ ...limits, minCashBufferPct: parseFloat(e.target.value) })
                    }
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Mandatory overnight cash / T-Bill reserve for margin calls and derivative variation settlement.
                  </p>
                </div>
              </div>

              {/* Current Top Holdings vs Concentration Cap Table */}
              <div className="pt-2">
                <div className="text-xs font-bold text-foreground font-sans mb-2 flex items-center justify-between">
                  <span>Current Top Holdings vs Set Cap ({limits.maxSinglePositionPct.toFixed(1)}%)</span>
                  <span className="text-[11px] font-mono text-muted-foreground">Auto-checked from live book</span>
                </div>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 text-muted-foreground text-[11px] border-b border-border">
                      <tr>
                        <th className="p-2.5 font-medium">Asset</th>
                        <th className="p-2.5 font-medium">Weight</th>
                        <th className="p-2.5 font-medium">Cap Status</th>
                        <th className="p-2.5 font-medium text-right">Headroom / Breach</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {currentFund.holdings.slice(0, 5).map((h) => {
                        const isBreach = h.weightPct > limits.maxSinglePositionPct;
                        const isWarning = !isBreach && h.weightPct >= limits.warningSinglePositionPct;
                        return (
                          <tr key={h.id} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-sans font-semibold text-foreground">
                              {h.ticker} <span className="text-muted-foreground font-normal font-mono text-[11px]">({h.name})</span>
                            </td>
                            <td className="p-2.5 font-bold text-foreground">{h.weightPct.toFixed(1)}%</td>
                            <td className="p-2.5">
                              {isBreach ? (
                                <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[10px] font-bold">
                                  BREACH (+{(h.weightPct - limits.maxSinglePositionPct).toFixed(1)}%)
                                </span>
                              ) : isWarning ? (
                                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px] font-bold">
                                  WARNING
                                </span>
                              ) : (
                                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                                  PASS
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-right font-mono">
                              {isBreach ? (
                                <span className="text-rose-600 font-bold">
                                  Over by ${( ((h.weightPct - limits.maxSinglePositionPct) * currentFund.aumMillions / 100).toFixed(1) )}M
                                </span>
                              ) : (
                                <span className="text-emerald-600">
                                  +{(limits.maxSinglePositionPct - h.weightPct).toFixed(1)}% room
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEVERAGE & BALANCE SHEET */}
          {activeConfigTab === 'LEVERAGE' && (
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-foreground font-sans flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-600" />
                  Leverage Limits &amp; Directional Exposure Bands
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Enforces prime broker margin boundaries, gross balance-sheet multiplier, and market directionality corridors.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Max Gross Exposure Limit */}
                <div className="p-3.5 bg-slate-50/70 rounded-lg border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      Max Gross Exposure (% of NAV)
                    </label>
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-200/70 px-2 py-0.5 rounded">
                      {limits.maxGrossExposurePct.toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="350"
                    step="10"
                    value={limits.maxGrossExposurePct}
                    onChange={(e) =>
                      setLimits({ ...limits, maxGrossExposurePct: parseFloat(e.target.value) })
                    }
                    className="w-full accent-slate-800 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Current: {currentFund.grossExposurePct.toFixed(1)}%</span>
                    <span>Max: {limits.maxGrossExposurePct.toFixed(0)}%</span>
                  </div>
                </div>

                {/* Max Long/Short Leverage Ratio */}
                <div className="p-3.5 bg-slate-50/70 rounded-lg border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      Max Long/Short Ratio
                    </label>
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {limits.maxLongShortRatio.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="3.0"
                    step="0.1"
                    value={limits.maxLongShortRatio}
                    onChange={(e) =>
                      setLimits({ ...limits, maxLongShortRatio: parseFloat(e.target.value) })
                    }
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Limits gross long asset value relative to gross short book hedging.
                  </p>
                </div>

                {/* Net Exposure Max Bound */}
                <div className="p-3.5 bg-slate-50/70 rounded-lg border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      Max Net Long Exposure (% of NAV)
                    </label>
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      +{limits.maxNetExposurePct.toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={limits.maxNetExposurePct}
                    onChange={(e) =>
                      setLimits({ ...limits, maxNetExposurePct: parseFloat(e.target.value) })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Upper boundary for unhedged market directional risk.
                  </p>
                </div>

                {/* Net Exposure Min Bound */}
                <div className="p-3.5 bg-slate-50/70 rounded-lg border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      Min Net Short Exposure (% of NAV)
                    </label>
                    <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {limits.minNetExposurePct.toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="10"
                    step="5"
                    value={limits.minNetExposurePct}
                    onChange={(e) =>
                      setLimits({ ...limits, minNetExposurePct: parseFloat(e.target.value) })
                    }
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Lower boundary protecting against over-aggressive net short positions.
                  </p>
                </div>
              </div>

              {/* Visual Exposure Bar */}
              <div className="p-4 bg-slate-50 rounded-lg border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground font-semibold">Net Exposure Band: [{limits.minNetExposurePct}%, +{limits.maxNetExposurePct}%]</span>
                  <span className="text-foreground font-bold">Current Fund Net: {currentFund.netExposurePct.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, (currentFund.netExposurePct / limits.maxNetExposurePct) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>Short Floor: {limits.minNetExposurePct}%</span>
                  <span>Neutral: 0%</span>
                  <span>Long Ceiling: +{limits.maxNetExposurePct}%</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VAR & DRAWDOWN CIRCUIT BREAKERS */}
          {activeConfigTab === 'RISK_VAR' && (
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-foreground font-sans flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Value-at-Risk (VaR) &amp; Drawdown Circuit Breakers
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Automated risk-budget gates and autonomous portfolio liquidating circuit breakers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1-Day 95% Parametric VaR Limit */}
                <div className="p-3.5 bg-slate-50/70 rounded-lg border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      1-Day 95% Parametric VaR Cap
                    </label>
                    <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {limits.maxVar95Pct.toFixed(2)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.50"
                    max="3.00"
                    step="0.05"
                    value={limits.maxVar95Pct}
                    onChange={(e) =>
                      setLimits({ ...limits, maxVar95Pct: parseFloat(e.target.value) })
                    }
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Active: {currentFund.var95Pct.toFixed(2)}% (${((currentFund.var95Pct * currentFund.aumMillions) / 100).toFixed(1)}M)</span>
                    <span>Cap: ${((limits.maxVar95Pct * currentFund.aumMillions) / 100).toFixed(1)}M</span>
                  </div>
                </div>

                {/* 1-Day 99% Stress VaR Limit */}
                <div className="p-3.5 bg-slate-50/70 rounded-lg border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      1-Day 99% Stress VaR Limit
                    </label>
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {limits.maxStressVar99Pct.toFixed(2)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.00"
                    max="5.00"
                    step="0.10"
                    value={limits.maxStressVar99Pct}
                    onChange={(e) =>
                      setLimits({ ...limits, maxStressVar99Pct: parseFloat(e.target.value) })
                    }
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Fat-tail stress simulation tolerance against black swan market dislocations.
                  </p>
                </div>

                {/* Max Drawdown Stop-Loss Alert */}
                <div className="p-3.5 bg-slate-50/70 rounded-lg border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      Drawdown De-Risking Trigger
                    </label>
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {limits.maxDrawdownStopLossPct.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-15.0"
                    max="-2.0"
                    step="0.5"
                    value={limits.maxDrawdownStopLossPct}
                    onChange={(e) =>
                      setLimits({ ...limits, maxDrawdownStopLossPct: parseFloat(e.target.value) })
                    }
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Triggers Aegis Risk Officer automated position hedging and risk budget reduction.
                  </p>
                </div>

                {/* Hard Trading Halt Circuit Breaker */}
                <div className="p-3.5 bg-slate-50/70 rounded-lg border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      Hard Execution Halt Circuit Breaker
                    </label>
                    <span className="font-mono text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                      {limits.hardHaltDrawdownPct.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-20.0"
                    max="-4.0"
                    step="0.5"
                    value={limits.hardHaltDrawdownPct}
                    onChange={(e) =>
                      setLimits({ ...limits, hardHaltDrawdownPct: parseFloat(e.target.value) })
                    }
                    className="w-full accent-rose-700 cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Mandatory stop: Shuts down all autonomous agent execution and escalates to Investment Committee.
                  </p>
                </div>
              </div>

              {/* Barra Beta Corridor */}
              <div className="p-4 bg-slate-50 rounded-lg border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-foreground font-sans">
                    Barra Factor Market Beta Corridor (vs S&amp;P 500)
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-800">
                    [{limits.betaToleranceMin.toFixed(2)}, +{limits.betaToleranceMax.toFixed(2)}]
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-muted-foreground block mb-1">Min Beta Floor</label>
                    <input
                      type="number"
                      step="0.05"
                      value={limits.betaToleranceMin}
                      onChange={(e) => setLimits({ ...limits, betaToleranceMin: parseFloat(e.target.value) || -0.05 })}
                      className="w-full text-xs font-mono px-2.5 py-1.5 rounded border border-border bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-muted-foreground block mb-1">Max Beta Ceiling</label>
                    <input
                      type="number"
                      step="0.05"
                      value={limits.betaToleranceMax}
                      onChange={(e) => setLimits({ ...limits, betaToleranceMax: parseFloat(e.target.value) || 0.25 })}
                      className="w-full text-xs font-mono px-2.5 py-1.5 rounded border border-border bg-white"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">
                  Active Fund Beta is <span className="font-bold text-foreground">β = {currentFund.betaToSP500.toFixed(2)}</span> (within authorized neutrality envelope).
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SECTOR & ASSET CLASS BANDS */}
          {activeConfigTab === 'SECTORS' && (
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-foreground font-sans flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Sector Exposure Caps &amp; Prohibited Assets
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Sets maximum gross risk allocation per GICS sector and maintains the fund's restricted security list.
                </p>
              </div>

              {/* Sector Caps Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(limits.sectorCaps).map(([sectorKey, capVal]) => {
                  const label = sectorKey.charAt(0).toUpperCase() + sectorKey.slice(1);
                  return (
                    <div key={sectorKey} className="p-3.5 bg-slate-50/70 rounded-lg border border-border/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-foreground font-sans">
                          {label} Sector Cap
                        </label>
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-200/70 px-2 py-0.5 rounded">
                          {capVal.toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="70"
                        step="5"
                        value={capVal}
                        onChange={(e) => {
                          const newCaps = { ...limits.sectorCaps, [sectorKey]: parseFloat(e.target.value) };
                          setLimits({ ...limits, sectorCaps: newCaps });
                        }}
                        className="w-full accent-slate-800 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Prohibited Tickers & Sanctions Gate */}
              <div className="p-4 bg-slate-50 rounded-lg border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-foreground font-sans flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-600" />
                    <span>Manager Restricted &amp; Sanctioned Securities</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {limits.prohibitedTickers.length} Tickers Blocked
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">
                  RegLex Compliance AI strictly denies all algorithmic order generation for these symbols.
                </p>

                {/* Ticker chips */}
                <div className="flex flex-wrap gap-1.5">
                  {limits.prohibitedTickers.map((ticker) => (
                    <span
                      key={ticker}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-50 text-rose-800 border border-rose-200 text-xs font-mono font-bold"
                    >
                      {ticker}
                      <button
                        onClick={() => handleRemoveProhibitedTicker(ticker)}
                        className="hover:text-rose-950 ml-1 text-rose-500 text-sm font-bold leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {limits.prohibitedTickers.length === 0 && (
                    <span className="text-xs font-mono text-muted-foreground italic">No prohibited tickers defined.</span>
                  )}
                </div>

                {/* Add Ticker input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Enter ticker (e.g. COIN, PLTR)"
                    value={newTickerInput}
                    onChange={(e) => setNewTickerInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddProhibitedTicker();
                      }
                    }}
                    className="h-8 px-3 text-xs font-mono rounded-lg border border-border bg-white flex-1 uppercase"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddProhibitedTicker}
                    className="h-8 px-3 text-xs font-mono bg-white hover:bg-slate-100 border-border"
                  >
                    Add Restricted Symbol
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI AGENT FLEET GOVERNANCE */}
          {activeConfigTab === 'AGENTS' && (
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-foreground font-sans flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  AI Agent Fleet Autonomy &amp; Pre-Trade Gate Policies
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Configure autonomous veto sensitivity, execution slicing thresholds, and human-in-the-loop sign-off triggers.
                </p>
              </div>

              {/* Aegis Risk Officer Veto Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground font-sans">
                  Aegis Risk Officer AI: Autonomous Pre-Trade Veto Mode
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => setLimits({ ...limits, riskOfficerVetoMode: 'STRICT_HARD_VETO' })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      limits.riskOfficerVetoMode === 'STRICT_HARD_VETO'
                        ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-400'
                        : 'bg-slate-50 hover:bg-slate-100/70 border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-sans text-rose-900">Strict Hard Veto</span>
                      {limits.riskOfficerVetoMode === 'STRICT_HARD_VETO' && <Check className="w-3.5 h-3.5 text-rose-600" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">
                      Instant block on any order breaching single-name, sector, or VaR limits. Halts routing.
                    </p>
                  </button>

                  <button
                    onClick={() => setLimits({ ...limits, riskOfficerVetoMode: 'AUTO_RESIZE_EXECUTE' })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      limits.riskOfficerVetoMode === 'AUTO_RESIZE_EXECUTE'
                        ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-400'
                        : 'bg-slate-50 hover:bg-slate-100/70 border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-sans text-indigo-900">Auto-Resize &amp; Route</span>
                      {limits.riskOfficerVetoMode === 'AUTO_RESIZE_EXECUTE' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">
                      Automatically clips oversized orders down to permissible limit capacity without failing execution.
                    </p>
                  </button>

                  <button
                    onClick={() => setLimits({ ...limits, riskOfficerVetoMode: 'ADVISORY_ESCALATE' })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      limits.riskOfficerVetoMode === 'ADVISORY_ESCALATE'
                        ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400'
                        : 'bg-slate-50 hover:bg-slate-100/70 border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-sans text-amber-900">Advisory &amp; Escalate</span>
                      {limits.riskOfficerVetoMode === 'ADVISORY_ESCALATE' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">
                      Flags warnings and requests Portfolio Manager digital override token before proceeding.
                    </p>
                  </button>
                </div>
              </div>

              {/* RegLex & FlowRouter Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Price Collar Tolerance */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-border/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      SEC 15c3-5 Price Collar
                    </label>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      ±{limits.secCollarTolerancePct.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.5"
                    value={limits.secCollarTolerancePct}
                    onChange={(e) =>
                      setLimits({ ...limits, secCollarTolerancePct: parseFloat(e.target.value) })
                    }
                    className="w-full accent-slate-700 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Rejects orders drifting beyond NBBO band.
                  </p>
                </div>

                {/* Dark Pool Max Allocation */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-border/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      Max Dark Pool / ATS %
                    </label>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {limits.darkPoolMaxPct.toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="5"
                    value={limits.darkPoolMaxPct}
                    onChange={(e) =>
                      setLimits({ ...limits, darkPoolMaxPct: parseFloat(e.target.value) })
                    }
                    className="w-full accent-slate-700 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Remaining volume forced onto lit exchanges.
                  </p>
                </div>

                {/* PM Sign-Off Threshold */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-border/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground font-sans">
                      PM Sign-Off Order Size
                    </label>
                    <span className="font-mono text-xs font-bold text-purple-700">
                      &gt; ${limits.requirePmSignOffAboveM}M
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={limits.requirePmSignOffAboveM}
                    onChange={(e) =>
                      setLimits({ ...limits, requirePmSignOffAboveM: parseFloat(e.target.value) })
                    }
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Requires dual cryptographic PM authorization.
                  </p>
                </div>
              </div>

              {/* Strategy Template Presets */}
              <div className="pt-2 border-t border-border">
                <div className="text-xs font-bold text-foreground font-sans mb-2">
                  Institutional Strategy Presets
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {STRATEGY_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset.limits)}
                      className="p-2.5 rounded-lg border border-border bg-slate-50/50 hover:bg-slate-100 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-foreground font-sans truncate">{preset.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">
                        Bench: {preset.benchmark}
                      </div>
                      <div className="text-[10px] text-indigo-600 font-mono font-semibold mt-1 flex items-center gap-1">
                        <span>Load Limits</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: REAL-TIME COMPLIANCE ENGINE & BREACH MONITOR */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Live Mandate Health Check
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Live Book
              </span>
            </div>

            {/* Scorecard Strip */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                <div className="text-base font-bold font-mono text-emerald-800">{passCount}</div>
                <div className="text-[10px] font-mono text-emerald-700 uppercase">Pass</div>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-center">
                <div className="text-base font-bold font-mono text-amber-800">{warningCount}</div>
                <div className="text-[10px] font-mono text-amber-700 uppercase">Warning</div>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-center">
                <div className="text-base font-bold font-mono text-rose-800">{breachCount}</div>
                <div className="text-[10px] font-mono text-rose-700 uppercase">Breach</div>
              </div>
            </div>

            {/* Compliance Rules Evaluation List */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {complianceResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-all ${
                    result.status === 'BREACH'
                      ? 'bg-rose-50/70 border-rose-300'
                      : result.status === 'WARNING'
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-slate-50/70 border-border/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold font-sans text-foreground">
                      {result.ruleName}
                    </span>
                    {result.status === 'BREACH' ? (
                      <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
                        BREACH
                      </span>
                    ) : result.status === 'WARNING' ? (
                      <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                        WARN
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                        PASS
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1">
                    <span>Current: <strong className="text-foreground">{result.currentValue}</strong></span>
                    <span>{result.limitValue}</span>
                  </div>

                  <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">
                    {result.details}
                  </p>

                  {result.mitigationRecommendation && (
                    <div className="mt-2 pt-2 border-t border-border/60 text-[10px] font-mono text-indigo-700 flex items-start gap-1">
                      <Zap className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>{result.mitigationRecommendation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Save Action in Side Column */}
            <div className="pt-2 border-t border-border space-y-2">
              <Button
                variant="default"
                onClick={handleSaveLimits}
                className={`w-full text-xs font-mono font-semibold h-9 rounded-lg gap-1.5 ${
                  saveSuccess 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saveSuccess ? 'Limits Active & Applied' : 'Commit Mandate to Multi-Agent Fleet'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: ADD NEW FUND / INSTITUTIONAL ONBOARDING WIZARD
         ========================================================================= */}
      {isNewFundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in-50">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground font-sans">
                    Launch New Institutional Fund
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Provision portfolio container, benchmark, AUM, and baseline risk limits.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewFundModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-mono px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFundSubmit} className="space-y-3.5">
              {/* Fund Name */}
              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Fund Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meridian Quantitative Volatility Fund"
                  value={newFundDraft.name}
                  onChange={(e) => setNewFundDraft({ ...newFundDraft, name: e.target.value })}
                  className="w-full text-xs font-sans px-3 py-2 rounded-lg border border-border bg-white text-foreground"
                />
              </div>

              {/* Strategy Preset */}
              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Investment Strategy Classification
                </label>
                <select
                  value={newFundDraft.presetId}
                  onChange={(e) => {
                    const preset = STRATEGY_PRESETS.find((p) => p.id === e.target.value);
                    if (preset) {
                      setNewFundDraft({
                        ...newFundDraft,
                        presetId: preset.id,
                        strategy: preset.name,
                        benchmark: preset.benchmark,
                        aumMillions: preset.defaultAumM,
                      });
                    }
                  }}
                  className="w-full text-xs font-sans px-3 py-2 rounded-lg border border-border bg-white text-foreground"
                >
                  {STRATEGY_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Bench: {p.benchmark})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Initial AUM */}
                <div>
                  <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                    Initial AUM ($ Millions)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="20000"
                    step="50"
                    value={newFundDraft.aumMillions}
                    onChange={(e) => setNewFundDraft({ ...newFundDraft, aumMillions: parseFloat(e.target.value) || 1000 })}
                    className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-border bg-white text-foreground"
                  />
                </div>

                {/* Base Currency */}
                <div>
                  <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                    Base Currency
                  </label>
                  <select
                    value={newFundDraft.baseCurrency}
                    onChange={(e) => setNewFundDraft({ ...newFundDraft, baseCurrency: e.target.value as any })}
                    className="w-full text-xs font-sans px-3 py-2 rounded-lg border border-border bg-white text-foreground"
                  >
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Target Return */}
                <div>
                  <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                    Target Return (% Annualized)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newFundDraft.targetAnnualReturnPct}
                    onChange={(e) => setNewFundDraft({ ...newFundDraft, targetAnnualReturnPct: parseFloat(e.target.value) || 15.0 })}
                    className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-border bg-white text-foreground"
                  />
                </div>

                {/* Target Volatility */}
                <div>
                  <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                    Target Volatility (% Annualized)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newFundDraft.targetVolPct}
                    onChange={(e) => setNewFundDraft({ ...newFundDraft, targetVolPct: parseFloat(e.target.value) || 7.0 })}
                    className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-border bg-white text-foreground"
                  />
                </div>
              </div>

              {/* Benchmark Index */}
              <div>
                <label className="text-xs font-semibold text-foreground font-sans block mb-1">
                  Primary Benchmark Index
                </label>
                <input
                  type="text"
                  value={newFundDraft.benchmark}
                  onChange={(e) => setNewFundDraft({ ...newFundDraft, benchmark: e.target.value })}
                  className="w-full text-xs font-sans px-3 py-2 rounded-lg border border-border bg-white text-foreground"
                />
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewFundModalOpen(false)}
                  className="text-xs font-mono"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  className="text-xs font-mono bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create &amp; Provision Fund</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
