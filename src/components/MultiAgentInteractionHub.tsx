import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Sparkles, 
  Eye, 
  Activity, 
  ChevronRight,
  Filter,
  Sliders,
  Send,
  HelpCircle,
  Clock,
  Layers,
  Cpu
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export interface AgentSpecialist {
  id: string;
  name: string;
  role: string;
  domain: string;
  specialAbility: string;
  abilityDescription: string;
  status: 'ACTIVE' | 'DELIBERATING' | 'EXECUTION_GATE' | 'IDLE';
  confidenceScore: number;
  avatarColor: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ComponentType<{ className?: string }>;
  recentAction: string;
  latency: string;
  domainMetrics: { label: string; value: string }[];
}

export interface InterAgentMessage {
  id: string;
  timestamp: string;
  senderAgentId: string;
  senderName: string;
  targetAgentId?: string;
  targetName?: string;
  type: 'ALERT' | 'PROPOSAL' | 'VETO' | 'APPROVAL' | 'EXECUTION' | 'QUERY';
  title: string;
  content: string;
  parametersImpacted?: string;
  confidence: number;
  highlight?: boolean;
}

export const AGENT_FLEET: AgentSpecialist[] = [
  {
    id: 'agent-macro',
    name: 'Macro Sentinel AI',
    role: 'Global Macro & Rates Strategist',
    domain: 'Central Bank Speeches, Inflation NLP & Yield Curves',
    specialAbility: 'Regime Shift Detection & Macro Shock Pre-Emption',
    abilityDescription: 'Parses live FOMC & RBI press conference transcripts, overnight index swaps (OIS), and inflation prints to forecast rates policy shifts ahead of consensus.',
    status: 'ACTIVE',
    confidenceScore: 99.4,
    avatarColor: 'bg-blue-600',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'Macro NLP',
    icon: TrendingUp,
    recentAction: 'Detected dovish pivot in Fed governor remarks; recommended duration extension & +8% tech beta tilt.',
    latency: '1.14ms',
    domainMetrics: [
      { label: 'OIS Rate Shift', value: '-12 bps' },
      { label: 'Fed Tone Sentiment', value: '+0.74 (Dovish)' },
      { label: 'Regime State', value: 'Expansionary' }
    ]
  },
  {
    id: 'agent-alpha',
    name: 'Alpha Matrix AI',
    role: 'Quantitative Skew & Arbitrage Engine',
    domain: 'Derivative Vol Surfaces & Cross-Asset Arbitrage',
    specialAbility: 'Nonlinear Volatility Skew Arbitrage & Dispersion Alpha',
    abilityDescription: 'Decomposes 25-delta vs ATM option skew curves and cross-equity correlation structures to identify mispriced equity volatility baskets.',
    status: 'ACTIVE',
    confidenceScore: 98.7,
    avatarColor: 'bg-purple-600',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'Quant Alpha',
    icon: Zap,
    recentAction: 'Spotted 2.4σ implied skew divergence on Mega-Cap tech; synthesized delta-neutral dispersion hedge.',
    latency: '0.86ms',
    domainMetrics: [
      { label: 'Skew Z-Score', value: '2.42σ' },
      { label: 'Projected Alpha', value: '+3.4% Annualized' },
      { label: 'Sharpe Impact', value: '+0.34' }
    ]
  },
  {
    id: 'agent-risk',
    name: 'Aegis Risk Officer AI',
    role: 'Barra Factor & Covariance Surveillance',
    domain: 'Multi-Factor Orthogonalization & VaR Limits',
    specialAbility: 'Autonomous Factor Neutralization & Real-Time Veto Shield',
    abilityDescription: 'Maintains strict Barra factor neutrality (Momentum, Value, Size, Volatility). Holds unilateral automated veto power over any order breaching mandate limits.',
    status: 'ACTIVE',
    confidenceScore: 100.0,
    avatarColor: 'bg-amber-600',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'Risk Guard',
    icon: ShieldCheck,
    recentAction: 'VETO EXERCISED: Prevented NVDA concentration from exceeding 8.5% cap; pruned order size by 32%.',
    latency: '0.42ms',
    domainMetrics: [
      { label: '1-Day 95% VaR', value: '1.14% (Cap 1.50%)' },
      { label: 'Residual Beta', value: '+0.008' },
      { label: 'Active Vetoes', value: '1 Today' }
    ]
  },
  {
    id: 'agent-exec',
    name: 'FlowRouter Execution AI',
    role: 'Microstructure & Dark Pool Router',
    domain: 'Order Book Microstructure & Slippage Minimization',
    specialAbility: 'Adaptive Microstructure TWAP Slicing & Liquidity Harvesting',
    abilityDescription: 'Slices multi-million dollar orders across lit exchanges and dark pools using sub-millisecond VWAP/TWAP schedules, hiding institutional footprints.',
    status: 'ACTIVE',
    confidenceScore: 99.8,
    avatarColor: 'bg-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'Smart Router',
    icon: Cpu,
    recentAction: 'Sliced 45,000 contracts across IEX, NYSE Arca & Nasdaq; achieved -0.4 bps negative slippage (price improvement).',
    latency: '0.08ms',
    domainMetrics: [
      { label: 'Avg Slippage', value: '-0.38 bps' },
      { label: 'Dark Pool Fill', value: '64.2%' },
      { label: 'Gateway Ping', value: '0.08ms' }
    ]
  },
  {
    id: 'agent-compliance',
    name: 'RegLex Compliance AI',
    role: 'Regulatory & Mandate Verifier',
    domain: 'SEC Rule 15c3-5 & Institutional Mandates',
    specialAbility: 'Sub-Millisecond Deterministic Pre-Trade Kill-Switch',
    abilityDescription: 'Zero-hallucination deterministic firewall checking price collars (±1.5% NBBO), wash trade rules, restricted tickers, and capital thresholds before gateway handoff.',
    status: 'ACTIVE',
    confidenceScore: 100.0,
    avatarColor: 'bg-cyan-600',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    badgeText: 'SEC Gate',
    icon: FileCheck,
    recentAction: 'Approved 57,000 orders in batch #8942; generated SHA-256 cryptographic audit seal for regulatory log.',
    latency: '0.04ms',
    domainMetrics: [
      { label: 'Gate Decision', value: '100% PASSED' },
      { label: 'Price Collar', value: '±1.2% NBBO' },
      { label: 'SEC 15c3-5', value: 'Compliant' }
    ]
  }
];

const INITIAL_INTERACTIONS: InterAgentMessage[] = [
  {
    id: 'msg-1',
    timestamp: '09:42:10',
    senderAgentId: 'agent-macro',
    senderName: 'Macro Sentinel AI',
    targetAgentId: 'agent-alpha',
    targetName: 'Alpha Matrix AI',
    type: 'ALERT',
    title: 'Macro Regime Shift Detected',
    content: 'Fed speech NLP indicates high dovish inflection (78% Dec cut probability). Long bond yields easing -6 bps. Recommend expanding equity beta and positioning for tech earnings dispersion.',
    confidence: 99.4,
    highlight: false
  },
  {
    id: 'msg-2',
    timestamp: '09:42:15',
    senderAgentId: 'agent-alpha',
    senderName: 'Alpha Matrix AI',
    targetAgentId: 'agent-risk',
    targetName: 'Aegis Risk Officer AI',
    type: 'PROPOSAL',
    title: 'Alpha Rebalance Proposal: +45,000 SPY Calls & Tech Overweight',
    content: 'Proposing +45,000 delta-neutral SPY call spreads and increasing NVDA weight from 6.8% to 9.8% to capture post-earnings implied volatility compression. Estimated net alpha: +3.4%.',
    parametersImpacted: 'NVDA: +3.0% weight, SPY Calls: +45k contracts',
    confidence: 98.7,
    highlight: false
  },
  {
    id: 'msg-3',
    timestamp: '09:42:18',
    senderAgentId: 'agent-risk',
    senderName: 'Aegis Risk Officer AI',
    targetAgentId: 'agent-alpha',
    targetName: 'Alpha Matrix AI',
    type: 'VETO',
    title: 'AUTOMATED RISK VETO & RESIZE MANDATE',
    content: 'VETO EXERCISED on raw NVDA allocation. A 9.8% allocation breaches the institutional 8.5% single-stock concentration ceiling and adds +0.09 unhedged momentum factor tilt. RESIZED: NVDA capped at 8.2%; added ₹45M short QQQ delta-hedge to preserve factor neutrality.',
    parametersImpacted: 'NVDA capped at 8.2%, QQQ Short added',
    confidence: 100.0,
    highlight: true
  },
  {
    id: 'msg-4',
    timestamp: '09:42:22',
    senderAgentId: 'agent-alpha',
    senderName: 'Alpha Matrix AI',
    targetAgentId: 'agent-compliance',
    targetName: 'RegLex Compliance AI',
    type: 'PROPOSAL',
    title: 'Recalibrated Basket Submitted to Compliance',
    content: 'Risk adjustments accepted. Recalibrated portfolio metrics: Net beta = +0.008 (target <0.02), portfolio VaR reduced by 14 bps to 1.14%, projected Sharpe = 2.14. Handing off to Pre-Trade Compliance Gate.',
    parametersImpacted: 'Sharpe: 2.14, Net Beta: +0.008, VaR: 1.14%',
    confidence: 99.6,
    highlight: false
  },
  {
    id: 'msg-5',
    timestamp: '09:42:25',
    senderAgentId: 'agent-compliance',
    senderName: 'RegLex Compliance AI',
    targetAgentId: 'agent-exec',
    targetName: 'FlowRouter Execution AI',
    type: 'APPROVAL',
    title: 'SEC Rule 15c3-5 Deterministic Gate PASSED',
    content: 'All 57,000 order slices cleared price collar boundaries (within 1.2% NBBO), credit caps, and restricted securities list. Cryptographic audit receipt #SEC-8942 generated. Transmitting to execution router.',
    parametersImpacted: 'Pre-trade gate: PASSED (Latency 0.04ms)',
    confidence: 100.0,
    highlight: false
  },
  {
    id: 'msg-6',
    timestamp: '09:42:28',
    senderAgentId: 'agent-exec',
    senderName: 'FlowRouter Execution AI',
    targetName: 'Production OMS',
    type: 'EXECUTION',
    title: 'Adaptive Microstructure TWAP Executing',
    content: 'Order basket partitioned across IEX (38%), NYSE Arca (32%), and dark liquidity venues (30%). Real-time fill rate: 100% on tranche 1 with -0.4 bps negative slippage.',
    parametersImpacted: 'Slippage: -0.4 bps, Latency: 0.08ms',
    confidence: 99.8,
    highlight: false
  }
];

export const MultiAgentInteractionHub: React.FC<{
  onInspectAgent?: (agentId: string) => void;
  onNavigateToAudit?: () => void;
}> = ({ onInspectAgent, onNavigateToAudit }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentSpecialist>(AGENT_FLEET[0]);
  const [interactions, setInteractions] = useState<InterAgentMessage[]>(INITIAL_INTERACTIONS);
  const [isSimulatingEvent, setIsSimulatingEvent] = useState<boolean>(false);
  const [activeSimulationName, setActiveSimulationName] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  // Trigger interactive multi-agent market shock simulation
  const handleSimulateShock = (shockType: 'RATES_HIKE' | 'TECH_EARNINGS' | 'LIQUIDITY_FREEZE') => {
    if (isSimulatingEvent) return;
    setIsSimulatingEvent(true);

    const configs = {
      RATES_HIKE: {
        name: 'Fed Surprise +25bps Rates Shock',
        sequence: [
          {
            sender: 'Macro Sentinel AI',
            target: 'Aegis Risk Officer AI',
            type: 'ALERT' as const,
            title: '🚨 Emergency Macro Shock: Fed Signals Immediate Tightening',
            content: 'Unexpected hawkish commentary triggered a +22 bps spike in 2-Year Treasury yields. Growth equity duration risk escalated.',
            impact: 'Duration Risk: +18 bps'
          },
          {
            sender: 'Aegis Risk Officer AI',
            target: 'Alpha Matrix AI',
            type: 'VETO' as const,
            title: '🛡️ Portfolio De-Grossing & VaR Limit Defense Triggered',
            content: 'Portfolio 1-Day VaR jumped to 1.48% (dangerously near 1.50% hard cap). Mandating immediate 15% hedge allocation in 10-year Treasury futures and trimming tech growth weight.',
            impact: 'VaR Cushion restored to 1.18%'
          },
          {
            sender: 'Alpha Matrix AI',
            target: 'RegLex Compliance AI',
            type: 'PROPOSAL' as const,
            title: '⚡ Dynamic Short Hedge Vector Synthesized',
            content: 'Constructed optimal duration hedge: Short 2,400 Ultra-10Y Treasury contracts and reallocated ₹80M into high cash-flow defensive equities.',
            impact: 'Net Beta reduced to 0.48'
          },
          {
            sender: 'RegLex Compliance AI',
            target: 'FlowRouter Execution AI',
            type: 'APPROVAL' as const,
            title: '✓ Emergency Hedge Pre-Trade Clearance Signed',
            content: 'Verified SEC liquidity constraints. Margin requirements verified within prime brokerage limits. Routed to execution router.',
            impact: 'SEC 15c3-5: APPROVED'
          },
          {
            sender: 'FlowRouter Execution AI',
            target: 'Production OMS',
            type: 'EXECUTION' as const,
            title: '🎯 Hedge Basket Executed at Best Execution (NBBO)',
            content: '100% of emergency hedge contracts filled across CME and lit venues in 14ms. Portfolio risk successfully neutralized.',
            impact: 'PnL Protected: +$1.8M avoided drawdown'
          }
        ]
      },
      TECH_EARNINGS: {
        name: 'Mega-Cap Earnings Volatility Spike',
        sequence: [
          {
            sender: 'Alpha Matrix AI',
            target: 'Aegis Risk Officer AI',
            type: 'PROPOSAL' as const,
            title: '⚡ Volatility Surface Skew Arbitrage Discovered',
            content: 'Implied volatility on mega-cap tech earnings surged to 48% vs 24% historical realized vol. Proposing calendar spread arbitrage.',
            impact: 'Projected Alpha: +4.1%'
          },
          {
            sender: 'Aegis Risk Officer AI',
            target: 'Alpha Matrix AI',
            type: 'APPROVAL' as const,
            title: '🛡️ Risk Bound Verified (Within Volatility Budget)',
            content: 'Vega and gamma exposure models confirmed delta-neutral. Approved trade structure with $20M maximum risk collar.',
            impact: 'Vega Exposure: 0.00 Net'
          },
          {
            sender: 'RegLex Compliance AI',
            target: 'FlowRouter Execution AI',
            type: 'APPROVAL' as const,
            title: '✓ Pre-Trade Options Limit Check PASSED',
            content: 'Exchange position limits verified below 25,000 contracts per series. Order cleared for market routing.',
            impact: 'Position Limit: 48% of cap'
          },
          {
            sender: 'FlowRouter Execution AI',
            target: 'Production OMS',
            type: 'EXECUTION' as const,
            title: '🎯 Multi-Exchange Slicing Completed with Zero Slippage',
            content: 'Executed spread legs simultaneously across CBOE and PHLX, eliminating leg risk and capturing 3.2 bps price improvement.',
            impact: 'Fill Rate: 100%'
          }
        ]
      },
      LIQUIDITY_FREEZE: {
        name: 'Flash Liquidity Spread Widening',
        sequence: [
          {
            sender: 'FlowRouter Execution AI',
            target: 'Aegis Risk Officer AI',
            type: 'ALERT' as const,
            title: '⚠️ Market Microstructure Warning: Lit Spreads Widened 4.2x',
            content: 'Bid-ask spread on S&P components widened from 1.1 cents to 4.8 cents. Predatory HFT queue detected in lit books.',
            impact: 'Spread: 4.8c'
          },
          {
            sender: 'Aegis Risk Officer AI',
            target: 'FlowRouter Execution AI',
            type: 'VETO' as const,
            title: '🛡️ PAUSE Lit Aggressive Orders — Route Exclusively to Dark Pools',
            content: 'Halted all crossing network market orders. Imposed strict passive pegging limits (Midpoint Peg only) to prevent adverse selection.',
            impact: 'Lit Orders: PAUSED'
          },
          {
            sender: 'FlowRouter Execution AI',
            target: 'Production OMS',
            type: 'EXECUTION' as const,
            title: '🎯 Midpoint Liquidity Captured in Non-Displayed Venues',
            content: 'Rerouted 88% of flow to institutional dark pools at exact midpoint price. Saved ₹14.2M in potential market impact.',
            impact: 'Slippage Saved: 6.8 bps'
          }
        ]
      }
    };

    const config = configs[shockType];
    setActiveSimulationName(config.name);

    let step = 0;
    const interval = setInterval(() => {
      if (step < config.sequence.length) {
        const item = config.sequence[step];
        const newMsg: InterAgentMessage = {
          id: `sim-${Date.now()}-${step}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          senderAgentId: item.sender.toLowerCase().includes('macro') ? 'agent-macro' :
                         item.sender.toLowerCase().includes('alpha') ? 'agent-alpha' :
                         item.sender.toLowerCase().includes('risk') ? 'agent-risk' :
                         item.sender.toLowerCase().includes('compliance') ? 'agent-compliance' : 'agent-exec',
          senderName: item.sender,
          targetName: item.target,
          type: item.type,
          title: item.title,
          content: item.content,
          parametersImpacted: item.impact,
          confidence: 99.8,
          highlight: item.type === 'VETO' || item.type === 'ALERT'
        };

        setInteractions(prev => [newMsg, ...prev]);
        step++;
      } else {
        clearInterval(interval);
        setIsSimulatingEvent(false);
        setTimeout(() => setActiveSimulationName(null), 4000);
      }
    }, 1100);
  };

  const filteredInteractions = interactions.filter(msg => {
    if (filterType === 'ALL') return true;
    if (filterType === 'VETO') return msg.type === 'VETO';
    if (filterType === 'APPROVAL') return msg.type === 'APPROVAL' || msg.type === 'EXECUTION';
    if (filterType === 'PROPOSAL') return msg.type === 'PROPOSAL' || msg.type === 'ALERT';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* -------------------------------------------------------------------
          TOP BAR: FLEET CONSENSUS & MARKET SHOCK SIMULATION TRIGGERS
         ------------------------------------------------------------------- */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-bold text-foreground tracking-tight font-mono uppercase">
                Active Multi-Agent Fleet Intelligence
              </h2>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono">
                5 Specialists Synchronized
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-mono">
                99.8% Factual Grounding
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live multi-agent deliberation, cross-domain parameter handoffs, and real-time risk veto governance.
            </p>
          </div>

          {/* Interactive Market Shock Simulation Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Simulate Event:
            </span>
            <button
              onClick={() => handleSimulateShock('RATES_HIKE')}
              disabled={isSimulatingEvent}
              className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg border border-amber-300 bg-amber-50/70 text-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              Rates Shock (+25bps)
            </button>
            <button
              onClick={() => handleSimulateShock('TECH_EARNINGS')}
              disabled={isSimulatingEvent}
              className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg border border-purple-300 bg-purple-50/70 text-purple-800 hover:bg-purple-100 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Zap className="w-3 h-3 text-purple-600" />
              Earnings Vol Spike
            </button>
            <button
              onClick={() => handleSimulateShock('LIQUIDITY_FREEZE')}
              disabled={isSimulatingEvent}
              className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg border border-blue-300 bg-blue-50/70 text-blue-800 hover:bg-blue-100 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Activity className="w-3 h-3 text-blue-600" />
              Spread Widening
            </button>
          </div>
        </div>

        {/* Live Simulation Banner */}
        {activeSimulationName && (
          <div className="mt-3 p-2.5 bg-blue-50/80 border border-blue-200 rounded-lg flex items-center justify-between text-xs font-mono text-blue-900 animate-in fade-in">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              <span>Simulating multi-agent cascade for: <strong>{activeSimulationName}</strong></span>
            </div>
            <span className="text-[11px] text-blue-700 font-semibold">Live Cascade Active...</span>
          </div>
        )}

        {/* -------------------------------------------------------------------
            5 AGENT SPECIALIST CARDS: SHOWCASING UNIQUE DOMAIN SUPERPOWERS
           ------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mt-3">
          {AGENT_FLEET.map((agent) => {
            const Icon = agent.icon;
            const isSelected = selectedAgent.id === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30' 
                    : 'border-border bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className={`w-6 h-6 rounded-md ${agent.avatarColor} text-white flex items-center justify-center shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-foreground truncate font-sans">
                        {agent.name.replace(' AI', '')}
                      </span>
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${agent.badgeBg}`}>
                      {agent.badgeText}
                    </span>
                  </div>

                  <div className="text-[11px] text-muted-foreground font-mono truncate mb-1" title={agent.role}>
                    {agent.role}
                  </div>

                  {/* Special Ability Pill */}
                  <div className="p-1.5 rounded bg-slate-100/70 border border-slate-200/80 mb-2">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Special Ability
                    </div>
                    <div className="text-[11px] font-semibold text-foreground leading-tight line-clamp-2 mt-0.5">
                      {agent.specialAbility}
                    </div>
                  </div>
                </div>

                {/* Bottom domain metric & latency */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground truncate">{agent.domainMetrics[0]?.label}:</span>
                  <span className="font-bold text-foreground shrink-0">{agent.domainMetrics[0]?.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------------
          MAIN INTERACTION PANEL: DUAL-COLUMN DELIBERATION STREAM + SELECTED AGENT DEEP DIVE
         ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left (lg:col-span-8): Real-Time Inter-Agent Deliberation & Hand-Off Stream */}
        <div className="lg:col-span-8 bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header & Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground tracking-tight font-mono uppercase">
                  Inter-Agent Deliberation &amp; Consensus Stream
                </h3>
                <span className="text-[10px] font-mono text-muted-foreground">
                  ({filteredInteractions.length} events logged)
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-border text-[11px] font-mono">
                {(['ALL', 'VETO', 'PROPOSAL', 'APPROVAL'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterType(tab)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      filterType === tab
                        ? 'bg-white text-foreground font-bold shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Interaction Feed List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredInteractions.map((msg) => {
                const isVeto = msg.type === 'VETO';
                const isAlert = msg.type === 'ALERT';
                const isApproval = msg.type === 'APPROVAL' || msg.type === 'EXECUTION';
                const isProposal = msg.type === 'PROPOSAL';

                return (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg border transition-all text-xs ${
                      isVeto 
                        ? 'bg-rose-50/40 border-rose-200 ring-1 ring-rose-300/40' 
                        : isAlert
                        ? 'bg-amber-50/40 border-amber-200'
                        : isApproval
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-white border-border hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Top Row: Sender -> Target + Type Badge + Time */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-foreground font-mono">
                          {msg.senderName}
                        </span>
                        {msg.targetName && (
                          <>
                            <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span className="font-medium text-muted-foreground font-mono">
                              {msg.targetName}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                        <span
                          className={`px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                            isVeto 
                              ? 'bg-rose-100 text-rose-800' 
                              : isAlert 
                              ? 'bg-amber-100 text-amber-800' 
                              : isApproval 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {msg.type}
                        </span>
                        <span className="text-muted-foreground">{msg.timestamp}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="font-semibold text-foreground mb-1 font-sans">
                      {msg.title}
                    </div>

                    {/* Content */}
                    <p className="text-muted-foreground leading-relaxed">
                      {msg.content}
                    </p>

                    {/* Impact / Parameter Diff Pill */}
                    {msg.parametersImpacted && (
                      <div className="mt-2 pt-1.5 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-muted-foreground">Parameter Delta:</span>
                        <span className="font-semibold text-foreground bg-slate-100 px-2 py-0.5 rounded">
                          {msg.parametersImpacted}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Bar: Link to Full Audit Log */}
          <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              All multi-agent actions cryptographically recorded in Audit Log
            </span>
            {onNavigateToAudit && (
              <button
                onClick={onNavigateToAudit}
                className="text-primary hover:underline font-semibold flex items-center gap-1"
              >
                View Full Audit Trail →
              </button>
            )}
          </div>
        </div>

        {/* Right (lg:col-span-4): Selected Agent Domain Deep Dive */}
        <div className="lg:col-span-4 bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            {/* Header with Selected Agent Info */}
            <div className="flex items-center justify-between pb-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${selectedAgent.avatarColor} text-white flex items-center justify-center font-bold`}>
                  {React.createElement(selectedAgent.icon, { className: 'w-4 h-4' })}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground font-mono">
                    {selectedAgent.name}
                  </h4>
                  <div className="text-[11px] text-muted-foreground">
                    {selectedAgent.role}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono">
                {selectedAgent.status}
              </Badge>
            </div>

            {/* Special Ability Card */}
            <div className="p-3 rounded-lg bg-slate-50 border border-border space-y-1.5">
              <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                <Sparkles className="w-3 h-3 text-primary" />
                Domain Specialization &amp; Superpower
              </div>
              <div className="text-xs font-bold text-foreground">
                {selectedAgent.specialAbility}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {selectedAgent.abilityDescription}
              </p>
            </div>

            {/* Live Domain Telemetry Metrics */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                Domain Telemetry Metrics
              </div>
              <div className="space-y-1.5">
                {selectedAgent.domainMetrics.map((dm, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-white border border-border/80">
                    <span className="text-muted-foreground">{dm.label}</span>
                    <span className="font-bold text-foreground">{dm.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-white border border-border/80">
                  <span className="text-muted-foreground">Model Inference Latency</span>
                  <span className="font-bold text-emerald-600">{selectedAgent.latency}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-white border border-border/80">
                  <span className="text-muted-foreground">Factual Grounding Score</span>
                  <span className="font-bold text-blue-600">{selectedAgent.confidenceScore}% Grounded</span>
                </div>
              </div>
            </div>

            {/* Most Recent Action */}
            <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-200 text-xs">
              <div className="text-[10px] font-mono text-blue-700 font-bold uppercase mb-0.5">
                Last Autonomous Action
              </div>
              <p className="text-foreground leading-relaxed text-[11px]">
                {selectedAgent.recentAction}
              </p>
            </div>
          </div>

          {/* Action Button: Execute Test Command on this agent */}
          <div className="pt-3 border-t border-border mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (onInspectAgent) onInspectAgent(selectedAgent.id);
              }}
              className="w-full text-xs font-mono font-semibold justify-center gap-1.5 bg-white hover:bg-slate-50 border-border"
            >
              <Cpu className="w-3.5 h-3.5 text-primary" />
              Configure &amp; Query {selectedAgent.name.split(' ')[0]} →
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
