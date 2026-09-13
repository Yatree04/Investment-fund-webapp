import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Save, 
  Download, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  FileText, 
  ArrowRight, 
  Layers, 
  UserCheck, 
  Code2, 
  Database, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Sliders, 
  Send,
  ExternalLink,
  Lock,
  Cpu,
  Zap,
  Activity,
  Plus,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface AuditLogViewProps {
  onNavigateToOverview?: () => void;
  onOpenAgentModal?: (query?: string) => void;
  onSelectTab?: (tab: any) => void;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  agentRole: string;
  agentDomain: string;
  badgeColor: string;
  action: string;
  type: 'VERIFICATION' | 'VETO' | 'PROPOSAL' | 'EXECUTION' | 'HUMAN_OVERRIDE';
  status: 'GROUNDED' | 'VERIFIED' | 'OVERRIDDEN' | 'FLAGGED';
  inputFeeds: string[];
  functionsInvoked: string[];
  outputPayload: string;
  passedToAgent?: string;
  latencyMs: number;
  confidenceScore: number;
  cryptoHash: string;
  details: string;
  metrics: { label: string; value: string }[];
}

export interface HumanInterventionEntry {
  id: string;
  timestamp: string;
  operator: string;
  role: string;
  actionTaken: string;
  reasoning: string;
  parameterBefore: string;
  parameterAfter: string;
  targetAgent: string;
  pnlImpact: string;
  complianceSigned: boolean;
}

const INITIAL_AUDIT_RECORDS: AuditRecord[] = [
  {
    id: 'aud-001',
    timestamp: '09:42:28 UTC',
    agentId: 'agent-exec',
    agentName: 'FlowRouter Execution AI',
    agentRole: 'Algorithmic Execution & Microstructure',
    agentDomain: 'Order Book Slicing & TWAP Routing',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    action: 'Multi-Venue TWAP Slicing & Liquidity Harvesting',
    type: 'EXECUTION',
    status: 'GROUNDED',
    inputFeeds: ['SIP_CONSOLIDATED_TAPE', 'NYSE_ARCA_L2_BOOK', 'IEX_D_PEG_FEED'],
    functionsInvoked: ['adaptive_twap_slice()', 'cross_venue_slippage_calc()', 'nbbo_sweep_filter()'],
    outputPayload: 'Sliced 45,000 delta-neutral contracts across IEX (38%), NYSE Arca (32%), and Dark Pools (30%). Fill rate: 100%. Avg slippage: -0.38 bps.',
    passedToAgent: 'Production FIX Gateway / Trade Blotter',
    latencyMs: 0.08,
    confidenceScore: 99.8,
    cryptoHash: 'sha256:7f4a8b92e10c5d73aa68b55d',
    details: 'Autonomous execution engine monitored quote queues to avoid HFT latency arbitrage. Achieved price improvement by resting midpoint orders in non-displayed venues.',
    metrics: [
      { label: 'Slippage', value: '-0.38 bps' },
      { label: 'Fills', value: '45,000 / 45,000' },
      { label: 'Venue Split', value: 'IEX / ARCA / Dark' }
    ]
  },
  {
    id: 'aud-002',
    timestamp: '09:42:25 UTC',
    agentId: 'agent-compliance',
    agentName: 'RegLex Compliance AI',
    agentRole: 'Institutional Pre-Trade Gatekeeper',
    agentDomain: 'SEC Rule 15c3-5 & Mandate Caps',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    action: 'Deterministic Pre-Trade Regulatory Gate Clearance',
    type: 'VERIFICATION',
    status: 'VERIFIED',
    inputFeeds: ['SEC_RULE_15C3_POLICIES', 'NBBO_PRICE_TAPE', 'FIRM_CREDIT_LINE_LEDGER'],
    functionsInvoked: ['sec_15c3_pretrade_gate()', 'nbbo_collar_check(±1.5%)', 'wash_sale_prevention_filter()'],
    outputPayload: 'All 57,000 order slices verified compliant. Zero restricted securities. Price collars verified within 1.2% of NBBO. Cryptographic signature attached.',
    passedToAgent: 'FlowRouter Execution AI',
    latencyMs: 0.04,
    confidenceScore: 100.0,
    cryptoHash: 'sha256:4d83e209fa881b67c290e441',
    details: 'Embedded deterministic filter executed within FPGA colocation loop. Certified that neither capital limits, price collar boundaries, nor wash sale rules were violated.',
    metrics: [
      { label: 'SEC Gate Decision', value: 'APPROVED' },
      { label: 'Price Collar', value: '1.2% vs 1.5% Cap' },
      { label: 'Restricted List', value: 'CLEARED' }
    ]
  },
  {
    id: 'aud-003',
    timestamp: '09:42:18 UTC',
    agentId: 'agent-risk',
    agentName: 'Aegis Risk Officer AI',
    agentRole: 'Barra Factor & Covariance Surveillance',
    agentDomain: 'Multi-Factor Orthogonalization & VaR Limits',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    action: 'Autonomous Risk Veto & Single-Stock Position Resize',
    type: 'VETO',
    status: 'GROUNDED',
    inputFeeds: ['BARRA_GEM3_US9_COVARIANCE', 'DAILY_VAR_SURFACE', 'PORTFOLIO_CONCENTRATION_LEDGER'],
    functionsInvoked: ['barra_factor_orthogonalization()', 'concentration_cap_veto()', 'ledoit_wolf_covariance_shrinkage()'],
    outputPayload: 'VETO EXERCISED on raw +3.0% NVDA addition (would reach 9.8%, exceeding 8.5% cap). Scaled NVDA to 8.2% and injected ₹45M short QQQ hedge to preserve zero factor tilt.',
    passedToAgent: 'RegLex Compliance AI & Alpha Matrix AI',
    latencyMs: 0.42,
    confidenceScore: 100.0,
    cryptoHash: 'sha256:99c2b318d420f188ab66e512',
    details: 'Risk engine detected that adding 300 bps to NVDA would tilt portfolio momentum factor by +0.09 sigma and expand 1-Day VaR beyond target tolerance. Automatically resized order and synthesized hedge.',
    metrics: [
      { label: 'Veto Triggered', value: 'NVDA Concentration' },
      { label: 'Post-Veto VaR', value: '1.14% (Cap 1.50%)' },
      { label: 'Residual Beta', value: '+0.008' }
    ]
  },
  {
    id: 'aud-004',
    timestamp: '09:42:15 UTC',
    agentId: 'agent-alpha',
    agentName: 'Alpha Matrix AI',
    agentRole: 'Quantitative Skew & Arbitrage Engine',
    agentDomain: 'Derivative Vol Surfaces & Statistical Arbitrage',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    action: 'Volatility Surface Skew Arbitrage Synthesis',
    type: 'PROPOSAL',
    status: 'GROUNDED',
    inputFeeds: ['CBOE_IV_TERM_STRUCTURE', 'OPRA_OPTIONS_L3_TICKSTREAM', 'EARNINGS_DISPERSION_FEED'],
    functionsInvoked: ['sabr_vol_surface_calibration()', 'skew_arbitrage_solver()', 'delta_neutral_frontier_opt()'],
    outputPayload: 'Detected 2.4-sigma divergence in mega-cap tech implied skew vs realized correlation. Formulated +45k SPY delta-hedged call spreads & tech dispersion basket. Projected alpha: +3.4%.',
    passedToAgent: 'Aegis Risk Officer AI',
    latencyMs: 0.86,
    confidenceScore: 98.7,
    cryptoHash: 'sha256:22b8c991a039d567fe998812',
    details: 'Constructed non-directional volatility dispersion trade. Bounded covariance condition number (<14.2) to prevent numerical inversion drift. Semantic grounding against live NY4 ticks: PASSED.',
    metrics: [
      { label: 'Skew Divergence', value: '2.42σ' },
      { label: 'Projected Alpha', value: '+3.4% Ann.' },
      { label: 'Sharpe Impact', value: '+0.34' }
    ]
  },
  {
    id: 'aud-005',
    timestamp: '09:42:10 UTC',
    agentId: 'agent-macro',
    agentName: 'Macro Sentinel AI',
    agentRole: 'Global Macro & Rates Strategist',
    agentDomain: 'Central Bank Speeches, Inflation NLP & Yield Curves',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    action: 'Central Bank Transcript NLP & Policy Regime Shift Detection',
    type: 'VERIFICATION',
    status: 'GROUNDED',
    inputFeeds: ['FED_CHAIR_PRESS_TRANSCRIPT', 'CME_FEDWATCH_OIS_SWAPS', 'BLS_CPI_CORE_REPORT'],
    functionsInvoked: ['finbert_central_bank_nlp()', 'ois_forward_curve_shift()', 'duration_sensitivity_model()'],
    outputPayload: 'Identified dovish inflection in Fed communications (78% December 25bps cut probability). Forward 2Y/10Y yield curve steepening by +8 bps. Recommended equity beta expansion.',
    passedToAgent: 'Alpha Matrix AI',
    latencyMs: 1.14,
    confidenceScore: 99.4,
    cryptoHash: 'sha256:11a4e982c771b904d4400199',
    details: 'Natural language analysis parsed Fed Chairman remarks and identified statistically significant shift in tone score from -0.12 (hawkish) to +0.74 (dovish). Grounded against immutable audio transcription.',
    metrics: [
      { label: 'Dovish Score', value: '+0.74' },
      { label: 'Cut Probability', value: '78%' },
      { label: 'Yield Impact', value: '-12 bps OIS' }
    ]
  }
];

const INITIAL_HUMAN_INTERVENTIONS: HumanInterventionEntry[] = [
  {
    id: 'hi-01',
    timestamp: '10:35:40 UTC',
    operator: 'Alexander Vance',
    role: 'Lead Portfolio Manager',
    actionTaken: 'Overrode single-stock position ceiling for NVDA to 8.5% (down from default 10.0%).',
    reasoning: 'Supply-chain lead times indicated elevated short-term volatility ahead of supplier earnings; Human Risk Committee mandated tighter concentration cap.',
    parameterBefore: 'max_position: 10.0%',
    parameterAfter: 'max_position: 8.5%',
    targetAgent: 'Aegis Risk Officer AI',
    pnlImpact: 'Preserved +$2.4M in alpha during midday sector pullback; prevented SEC 15c3 breach.',
    complianceSigned: true
  },
  {
    id: 'hi-02',
    timestamp: '09:42:15 UTC',
    operator: 'Dr. Elena Rostova',
    role: 'Lead Quantitative Researcher',
    actionTaken: 'Adjusted volatility lookback window from 30 days to 10 days.',
    reasoning: 'Macro regime shift triggered by Federal Reserve rates commentary required higher responsiveness to short-term gamma shocks.',
    parameterBefore: 'vol_lookback_days: 30',
    parameterAfter: 'vol_lookback_days: 10',
    targetAgent: 'Alpha Matrix AI',
    pnlImpact: 'Reduced portfolio tracking error by 18 bps during morning market open.',
    complianceSigned: true
  }
];

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  onNavigateToOverview,
  onOpenAgentModal,
  onSelectTab
}) => {
  const [activeTab, setActiveTab] = useState<'LEDGER' | 'LINEAGE' | 'GOVERNANCE' | 'SEMANTIC_QA'>('LEDGER');
  const [records, setRecords] = useState<AuditRecord[]>(INITIAL_AUDIT_RECORDS);
  const [humanInterventions, setHumanInterventions] = useState<HumanInterventionEntry[]>(INITIAL_HUMAN_INTERVENTIONS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [agentFilter, setAgentFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(INITIAL_AUDIT_RECORDS[0]);

  // Anti-hallucination countdown state
  const [countdown, setCountdown] = useState<number>(38);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshNotification, setRefreshNotification] = useState<string | null>(null);

  // Semantic QA state
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [qaHistory, setQaHistory] = useState<{ q: string; a: string; time: string; verified: boolean }[]>([
    {
      q: 'Why did Aegis Risk Officer veto the raw NVDA allocation proposed by Alpha Matrix?',
      a: 'At 09:42:18 UTC, Alpha Matrix proposed increasing NVDA from 6.8% to 9.8%. Aegis Risk Officer detected that this would breach the institutional 8.5% single-stock concentration ceiling and introduce +0.09 unhedged momentum factor tilt. Aegis exercised automated veto authority, resizing NVDA to 8.2% and requiring a ₹45M short QQQ hedge to preserve factor neutrality.',
      time: '09:44:12 UTC',
      verified: true
    },
    {
      q: 'How does the platform guarantee zero lookahead bias and anti-hallucination?',
      a: 'Every 45 seconds, all active agent nodes flush intermediate context cache and ground their state directly against the immutable SEC SIP tape and NYSE/IEX L2 order books. Decisions are recorded with cryptographic SHA-256 state hashes, with factual grounding confidence currently at 99.8%.',
      time: '09:48:30 UTC',
      verified: true
    }
  ]);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  // New Intervention Modal
  const [isNewInterventionOpen, setIsNewInterventionOpen] = useState<boolean>(false);
  const [newAction, setNewAction] = useState<string>('');
  const [newReasoning, setNewReasoning] = useState<string>('');
  const [newParamBefore, setNewParamBefore] = useState<string>('');
  const [newParamAfter, setNewParamAfter] = useState<string>('');

  // Countdown timer for anti-hallucination ground truth refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerRefresh(false);
          return 45;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerRefresh = (manual = true) => {
    setIsRefreshing(true);
    const msg = manual
      ? 'Manual Ground-Truth Refresh executed: Scratchpad memory resynchronized with live NYSE/IEX tape.'
      : 'Automated Anti-Hallucination Refresh: Flushed stale context; verified zero state drift across 5 agents.';
    setRefreshNotification(msg);

    setTimeout(() => {
      setIsRefreshing(false);
      setCountdown(45);
      setTimeout(() => setRefreshNotification(null), 4000);
    }, 700);
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const q = userQuestion;
    setUserQuestion('');
    setIsAnswering(true);

    setTimeout(() => {
      let answer = `Based on verified audit records: The multi-agent fleet evaluated constraints with 99.8% factual grounding. No hallucination or constraint violation was identified in the execution lineage.`;

      if (q.toLowerCase().includes('nvda') || q.toLowerCase().includes('veto')) {
        answer = `Aegis Risk Officer exercised automated veto at 09:42:18 UTC because the proposed NVDA addition would have breached the 8.5% portfolio concentration cap. The order was resized to 8.2% with a factor-neutral short QQQ overlay.`;
      } else if (q.toLowerCase().includes('sec') || q.toLowerCase().includes('compliance')) {
        answer = `RegLex Compliance AI verified SEC Rule 15c3-5 pre-trade market access on all 57,000 order slices with 0.04ms latency. Price collars were confirmed within 1.2% of NBBO with zero wash trading flags.`;
      } else if (q.toLowerCase().includes('macro') || q.toLowerCase().includes('rate')) {
        answer = `Macro Sentinel AI processed FOMC transcripts and OIS swap markets, identifying a dovish inflection with 78% December rate cut probability, prompting duration expansion.`;
      }

      setQaHistory(prev => [
        {
          q,
          a: answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC',
          verified: true
        },
        ...prev
      ]);
      setIsAnswering(false);
    }, 650);
  };

  const handleCreateIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.trim() || !newReasoning.trim()) return;

    const newEntry: HumanInterventionEntry = {
      id: `hi-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC',
      operator: 'Alexander Vance',
      role: 'Lead Portfolio Manager',
      actionTaken: newAction,
      reasoning: newReasoning,
      parameterBefore: newParamBefore || 'default_setting',
      parameterAfter: newParamAfter || 'custom_override',
      targetAgent: 'Multi-Agent Fleet',
      pnlImpact: 'Logged into immutable semantic audit ledger; all agents acknowledged human guidance.',
      complianceSigned: true
    };

    setHumanInterventions(prev => [newEntry, ...prev]);
    setNewAction('');
    setNewReasoning('');
    setNewParamBefore('');
    setNewParamAfter('');
    setIsNewInterventionOpen(false);
  };

  const filteredRecords = records.filter(r => {
    if (agentFilter !== 'ALL' && r.agentId !== agentFilter) return false;
    if (typeFilter !== 'ALL' && r.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.agentName.toLowerCase().includes(q) ||
             r.action.toLowerCase().includes(q) ||
             r.details.toLowerCase().includes(q) ||
             r.outputPayload.toLowerCase().includes(q) ||
             r.cryptoHash.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-8 select-none">
      
      {/* =========================================================================
          TOP INSTITUTIONAL GOVERNANCE & AUDIT BAR
         ========================================================================= */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left Title & Status */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-foreground tracking-tight font-sans flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Multi-Agent Governance &amp; Audit Log
              </span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-mono">
                SEC Rule 15c3-5 Compliant
              </Badge>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Anti-Hallucination: Grounded (99.8%)
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              Immutable cryptographic ledger tracking cross-agent deliberations, autonomous risk vetoes, and human-in-the-loop overrides.
            </p>
          </div>

          {/* Right: Anti-Hallucination Refresh Monitor & Actions */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-border text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Next Tape Refresh:</span>
              <span className="font-bold text-foreground">{countdown}s</span>
              <button
                onClick={() => triggerRefresh(true)}
                disabled={isRefreshing}
                title="Force ground-truth refresh now"
                className="ml-1 text-primary hover:text-primary/80 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewInterventionOpen(true)}
              className="h-8 px-3 text-xs font-mono font-semibold bg-white hover:bg-slate-50 border-border text-foreground rounded-lg gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>Log PM Override</span>
            </Button>

            {onNavigateToOverview && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigateToOverview}
                className="h-8 px-3 text-xs font-mono font-medium text-muted-foreground hover:text-foreground"
              >
                ← Back to Overview
              </Button>
            )}
          </div>
        </div>

        {/* Refresh Notification Banner */}
        {refreshNotification && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs font-mono text-emerald-900 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{refreshNotification}</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">
              VERIFIED
            </span>
          </div>
        )}
      </div>

      {/* =========================================================================
          NAVIGATION TABS: [1. Execution Ledger] [2. Payload Lineage] [3. Human Governance] [4. Semantic Q&A]
         ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border rounded-xl p-2.5 shadow-xs">
        
        {/* View mode tabs */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-border text-xs font-mono font-medium">
          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'LEDGER'
                ? 'bg-white text-foreground font-bold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-primary" />
            Decision Ledger ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('LINEAGE')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'LINEAGE'
                ? 'bg-white text-foreground font-bold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            Inter-Agent Lineage
          </button>
          <button
            onClick={() => setActiveTab('GOVERNANCE')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'GOVERNANCE'
                ? 'bg-white text-foreground font-bold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            PM Overrides ({humanInterventions.length})
          </button>
          <button
            onClick={() => setActiveTab('SEMANTIC_QA')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'SEMANTIC_QA'
                ? 'bg-white text-foreground font-bold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Semantic Audit Q&amp;A
          </button>
        </div>

        {/* Search & Quick Filters (Active when in Ledger mode) */}
        {activeTab === 'LEDGER' && (
          <div className="flex items-center gap-2 flex-1 max-w-lg justify-end">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search actions, hashes, functions, payloads..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-border rounded-lg text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary focus:bg-white transition-all"
              />
            </div>

            {/* Agent Filter */}
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              aria-label="Filter by agent specialist"
              className="bg-white border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-hidden"
            >
              <option value="ALL">All Agents</option>
              <option value="agent-macro">Macro Sentinel AI</option>
              <option value="agent-alpha">Alpha Matrix AI</option>
              <option value="agent-risk">Aegis Risk Officer AI</option>
              <option value="agent-compliance">RegLex Compliance AI</option>
              <option value="agent-exec">FlowRouter Execution AI</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by event type"
              className="bg-white border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-hidden"
            >
              <option value="ALL">All Event Types</option>
              <option value="VETO">Vetoes &amp; Resizes</option>
              <option value="VERIFICATION">Compliance Checks</option>
              <option value="EXECUTION">Executions</option>
              <option value="PROPOSAL">Proposals</option>
            </select>
          </div>
        )}
      </div>

      {/* =========================================================================
          VIEW 1: DECISION LEDGER & DEEP INSPECTION (CLEAN 2-COLUMN LAYOUT)
         ========================================================================= */}
      {activeTab === 'LEDGER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column (lg:col-span-7): Clean Ledger Records List */}
          <div className="lg:col-span-7 bg-card border border-border rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border text-xs font-mono text-muted-foreground">
              <span>Verified Agent Decisions ({filteredRecords.length})</span>
              <span>Sorted by Time (Latest First)</span>
            </div>

            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredRecords.map((rec) => {
                const isSelected = selectedRecord?.id === rec.id;
                const isVeto = rec.type === 'VETO';
                const isExec = rec.type === 'EXECUTION';
                const isCompliance = rec.type === 'VERIFICATION';

                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/40' 
                        : 'border-border bg-white hover:bg-slate-50/70 hover:border-slate-300'
                    }`}
                  >
                    {/* Top Row: Agent + Timestamp + Type Badge */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-xs text-foreground font-mono">
                          {rec.agentName}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${rec.badgeColor}`}>
                          {rec.agentDomain.split(',')[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          isVeto 
                            ? 'bg-rose-100 text-rose-800' 
                            : isExec 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : isCompliance 
                            ? 'bg-cyan-100 text-cyan-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {rec.type}
                        </span>
                        <span className="text-muted-foreground">{rec.timestamp}</span>
                      </div>
                    </div>

                    {/* Action Title */}
                    <div className="font-semibold text-xs text-foreground mb-1">
                      {rec.action}
                    </div>

                    {/* Payload Summary Snippet */}
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {rec.outputPayload}
                    </p>

                    {/* Bottom Metadata: Latency, Hash, Confidence */}
                    <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span>Latency: <strong className="text-foreground">{rec.latencyMs}ms</strong></span>
                        <span>Grounding: <strong className="text-blue-600">{rec.confidenceScore}%</strong></span>
                      </div>
                      <span className="truncate max-w-[140px] text-slate-400">
                        {rec.cryptoHash}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (lg:col-span-5): Deep Record Inspection */}
          <div className="lg:col-span-5 bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between">
            {selectedRecord ? (
              <div className="space-y-4">
                {/* Header with Verification Seal */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Cryptographic Audit Receipt
                    </span>
                    <h3 className="text-sm font-bold text-foreground font-mono">
                      {selectedRecord.id}
                    </h3>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-mono flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    SEAL VERIFIED
                  </Badge>
                </div>

                {/* Agent & Action Overview */}
                <div className="p-3 rounded-lg bg-slate-50 border border-border space-y-1">
                  <div className="text-[11px] font-mono text-primary font-bold">
                    {selectedRecord.agentName} ({selectedRecord.agentRole})
                  </div>
                  <div className="text-xs font-semibold text-foreground">
                    {selectedRecord.action}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                    {selectedRecord.details}
                  </p>
                </div>

                {/* Key Execution Metrics */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                    Execution Metrics
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedRecord.metrics.map((m, idx) => (
                      <div key={idx} className="p-2 rounded bg-white border border-border text-center">
                        <div className="text-[9px] font-mono text-muted-foreground uppercase">{m.label}</div>
                        <div className="text-xs font-bold text-foreground font-mono mt-0.5">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Input Feeds */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 flex items-center gap-1">
                    <Database className="w-3 h-3 text-muted-foreground" />
                    Input Datasets &amp; Tick Feeds
                  </div>
                  <div className="space-y-1">
                    {selectedRecord.inputFeeds.map((feed, idx) => (
                      <div key={idx} className="text-[11px] font-mono p-1.5 rounded bg-white border border-border/80 flex items-center justify-between">
                        <span className="text-foreground">{feed}</span>
                        <span className="text-emerald-600 text-[9px] font-bold">ACTIVE</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Python / Quantitative Functions Invoked */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-muted-foreground" />
                    Deterministic Functions Invoked
                  </div>
                  <div className="space-y-1">
                    {selectedRecord.functionsInvoked.map((fn, idx) => (
                      <div key={idx} className="text-[11px] font-mono p-1.5 rounded bg-slate-900 text-slate-100">
                        <code>{fn}</code>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output Payload Passed Downstream */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 flex items-center justify-between">
                    <span>Passed Downstream Payload</span>
                    {selectedRecord.passedToAgent && (
                      <span className="text-primary text-[10px] font-bold">➔ {selectedRecord.passedToAgent}</span>
                    )}
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-border text-xs font-mono text-foreground leading-relaxed">
                    {selectedRecord.outputPayload}
                  </div>
                </div>

                {/* Cryptographic SHA-256 Signature */}
                <div className="p-2 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-500" />
                    {selectedRecord.cryptoHash}
                  </span>
                  <span className="text-emerald-700 font-bold">TAMPER-PROOF</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-muted-foreground p-8 text-center">
                Select a decision record on the left to inspect its full cryptographic audit trail.
              </div>
            )}
          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW 2: INTER-AGENT PAYLOAD FLOW & LINEAGE VISUALIZER
         ========================================================================= */}
      {activeTab === 'LINEAGE' && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground tracking-tight font-mono uppercase">
              End-to-End Inter-Agent Execution Lineage
            </h3>
            <p className="text-xs text-muted-foreground">
              Tracing the complete sequence from initial macro rate parsing, to quant alpha generation, risk veto neutralization, SEC compliance gating, and market TWAP slicing.
            </p>
          </div>

          {/* Stepper Pipeline Flow */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            {[
              {
                step: '1. Macro Trigger',
                agent: 'Macro Sentinel AI',
                domain: 'FOMC Speeches & OIS Curve',
                action: 'Dovish pivot detected (-12 bps rates shift)',
                output: '+8% Tech Equity Beta Recommended',
                badge: 'bg-blue-50 text-blue-700 border-blue-200'
              },
              {
                step: '2. Alpha Vector',
                agent: 'Alpha Matrix AI',
                domain: 'Derivative Vol Surfaces',
                action: '2.4σ implied skew arbitrage spotted',
                output: 'Synthesized +45k SPY Calls / Tech Basket',
                badge: 'bg-purple-50 text-purple-700 border-purple-200'
              },
              {
                step: '3. Risk Veto Shield',
                agent: 'Aegis Risk Officer AI',
                domain: 'Barra GEM3 & VaR Limit',
                action: 'VETO: Capped NVDA at 8.2% & added QQQ hedge',
                output: 'Portfolio VaR: 1.14%, Beta: +0.008',
                badge: 'bg-amber-50 text-amber-700 border-amber-200'
              },
              {
                step: '4. SEC Pre-Trade Gate',
                agent: 'RegLex Compliance AI',
                domain: 'SEC Rule 15c3-5 Rules',
                action: '100% price collars & capital limits passed',
                output: 'Cryptographic SEC Seal Signed',
                badge: 'bg-cyan-50 text-cyan-700 border-cyan-200'
              },
              {
                step: '5. Execution Fill',
                agent: 'FlowRouter Execution AI',
                domain: 'Dark Pools & TWAP Slicing',
                action: 'Sliced 45,000 contracts across venues',
                output: '0.08ms Latency, -0.38 bps Slippage',
                badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }
            ].map((node, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-border bg-white flex flex-col justify-between relative shadow-2xs">
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase font-bold mb-1">
                    {node.step}
                  </div>
                  <div className="font-bold text-xs text-foreground font-mono">
                    {node.agent}
                  </div>
                  <span className={`inline-block text-[9px] font-mono px-1.5 py-0.2 rounded border mt-1 mb-2 ${node.badge}`}>
                    {node.domain}
                  </span>
                  <p className="text-[11px] text-foreground font-medium mb-1">
                    {node.action}
                  </p>
                </div>
                <div className="pt-2 border-t border-border text-[10px] font-mono text-primary font-semibold mt-2">
                  ➔ {node.output}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-border text-xs font-mono text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Complete multi-agent pipeline verified with zero data loss or unhedged factor drift.
            </span>
            <span className="font-bold text-foreground">Total Pipeline Execution Time: 2.54ms</span>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: HUMAN-IN-THE-LOOP GOVERNANCE & OVERRIDES
         ========================================================================= */}
      {activeTab === 'GOVERNANCE' && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-foreground tracking-tight font-mono uppercase">
                Portfolio Manager Overrides &amp; Governance Ledger
              </h3>
              <p className="text-xs text-muted-foreground">
                Formal record of human-in-the-loop decisions, risk tolerance overrides, and manual strategy parameter adjustments.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsNewInterventionOpen(true)}
              className="text-xs font-mono font-semibold gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Override Entry
            </Button>
          </div>

          {/* Overrides Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Timestamp / ID</th>
                  <th className="py-2.5 px-3">Operator &amp; Role</th>
                  <th className="py-2.5 px-3">Target Agent</th>
                  <th className="py-2.5 px-3">Parameter Adjustment</th>
                  <th className="py-2.5 px-3">PM Justification</th>
                  <th className="py-2.5 px-3">Outcome / P&amp;L Protection</th>
                  <th className="py-2.5 px-3 text-right">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {humanInterventions.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{entry.timestamp}</div>
                      <div className="text-[10px] text-muted-foreground">{entry.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground font-sans">{entry.operator}</div>
                      <div className="text-[10px] text-muted-foreground">{entry.role}</div>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {entry.targetAgent}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200 text-[10px]">
                          {entry.parameterBefore}
                        </span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px] font-bold">
                          {entry.parameterAfter}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-sans text-[11px] text-foreground max-w-[260px]">
                      {entry.reasoning}
                    </td>
                    <td className="py-3 px-3 font-sans text-[11px] text-emerald-700 font-medium max-w-[220px]">
                      {entry.pnlImpact}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Badge className="bg-emerald-600 text-white text-[10px] font-mono">
                        SIGNED
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: SEMANTIC NATURAL LANGUAGE AUDIT Q&A
         ========================================================================= */}
      {activeTab === 'SEMANTIC_QA' && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground tracking-tight font-mono uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Semantic Natural Language Audit Query
            </h3>
            <p className="text-xs text-muted-foreground">
              Query historical multi-agent decisions, verify anti-hallucination compliance, and audit why specific trades were sized or vetoed.
            </p>
          </div>

          {/* Ask Input */}
          <form onSubmit={handleAskQuestion} className="flex gap-2">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="e.g., Why did Aegis Risk Officer veto the NVDA allocation? or How was anti-hallucination verified?"
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-border rounded-lg text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary focus:bg-white transition-all"
            />
            <Button
              type="submit"
              disabled={isAnswering || !userQuestion.trim()}
              className="text-xs font-mono font-semibold gap-1.5 shrink-0"
            >
              {isAnswering ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Query Audit Memory</span>
            </Button>
          </form>

          {/* Q&A Thread */}
          <div className="space-y-3 pt-2">
            {qaHistory.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-white space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px] pb-1.5 border-b border-border/60">
                  <span className="font-semibold text-primary">Question: &quot;{item.q}&quot;</span>
                  <span>{item.time}</span>
                </div>
                <div className="text-foreground leading-relaxed font-sans text-xs bg-slate-50 p-3 rounded-lg border border-border/80">
                  {item.a}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Grounded against immutable NY4 and SEC tick records
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          LOG HUMAN INTERVENTION MODAL
         ========================================================================= */}
      {isNewInterventionOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-border rounded-xl max-w-lg w-full p-5 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground font-mono">
                Log Human Intervention / Parameter Override
              </h3>
              <button
                onClick={() => setIsNewInterventionOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIntervention} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">
                  Action Taken (Summary)
                </label>
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="e.g. Overrode NVDA position ceiling to 8.5%"
                  required
                  className="w-full px-3 py-1.5 border border-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">
                  PM Reasoning &amp; Justification
                </label>
                <textarea
                  value={newReasoning}
                  onChange={(e) => setNewReasoning(e.target.value)}
                  placeholder="Explain why this human guidance is necessary..."
                  rows={3}
                  required
                  className="w-full px-3 py-1.5 border border-border rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Parameter Before
                  </label>
                  <input
                    type="text"
                    value={newParamBefore}
                    onChange={(e) => setNewParamBefore(e.target.value)}
                    placeholder="max_position: 10%"
                    className="w-full px-3 py-1.5 border border-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Parameter After
                  </label>
                  <input
                    type="text"
                    value={newParamAfter}
                    onChange={(e) => setNewParamAfter(e.target.value)}
                    placeholder="max_position: 8.5%"
                    className="w-full px-3 py-1.5 border border-border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewInterventionOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Sign &amp; Record Override
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
