import React, { useState, useEffect } from 'react';
import { ViewTab, WorkspaceModel } from '../types';
import { 
  Bot, 
  GitBranch, 
  Code2, 
  Grid3X3, 
  ChevronDown, 
  Play, 
  Sparkles, 
  Check, 
  FileText, 
  Database, 
  ShieldCheck, 
  Layers, 
  Share2, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Settings2, 
  TrendingUp, 
  Send,
  Sliders,
  AlertCircle,
  Cpu,
  RefreshCw,
  RotateCw,
  ExternalLink,
  Columns3,
  SlidersHorizontal,
  X,
  ArrowUpRight,
  TestTube,
  ArrowLeftRight,
  GitMerge,
  Copy,
  Zap,
  Tag
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AgentBacktestSandbox } from './AgentBacktestSandbox';

export type CanvasViewMode = 'matrix' | 'Node' | 'code';
export type RepoFilter = 'all' | 'codebases' | 'subagents' | 'templates' | 'data';
export type RightPanelTab = 'agent' | 'instructions' | 'code' | 'sandbox';

export interface AgentNode {
  id: string;
  name: string;
  type: 'parent' | 'subagent' | 'data' | 'tool';
  role: string;
  status: 'ACTIVE' | 'READY' | 'DEPLOYED' | 'TESTING';
  inputs: string;
  description: string;
  outputLink: string;
  instructions: string;
  defaultProperty: string;
  codeSnippet: string;
  tools: string[];
  latency: string;
  x: number;
  y: number;
}

const DEFAULT_CORE_NODES: AgentNode[] = [
  {
    id: 'node-1',
    name: 'Research Judgement agent',
    type: 'parent',
    role: 'Parent Orchestrator',
    status: 'ACTIVE',
    description: 'Parent qualitative reasoning & macro orchestration model. Aggregates multi-agent market hypotheses and calibrates macro beta overlays.',
    inputs: 'Macro statements, Fed minutes, equity consensus revisions & portfolio VaR limits',
    outputLink: 'Node 2 (Market trend refereall) & Node 3 (Data)',
    instructions: 'Ingest macro events, assess qualitative fundamentals, and orchestrate specialized sub-agents to calibrate portfolio hedges under strict risk bounds (Daily VaR < 1.50%).',
    defaultProperty: 'Highest Sharpe Weighting',
    codeSnippet: `# DE SHAW RESEARCH JUDGEMENT PARENT AGENT
class ResearchJudgementAgent(QuantParentAgent):
    def __init__(self, risk_limit_var=0.015):
        super().__init__(name="Research Judgement agent")
        self.risk_limit_var = risk_limit_var
        self.sub_agents = ["market_trend_ref", "factor_covariance_matrix"]
        
    def orchestrate_rebalance(self, macro_signal: MacroSignal, var_state: float):
        if var_state > self.risk_limit_var:
            hedge_orders = self.delegate_risk_neutralization(macro_signal)
            return self.route_to_terminal_gate(hedge_orders)
        return self.optimize_sharpe_frontier(alpha_target=0.18)`,
    tools: ['Macro News Wire', 'Earnings Transcript Parser', 'Barra Risk API'],
    latency: '18ms',
    x: 30,
    y: 110,
  },
  {
    id: 'node-2',
    name: 'Market trend refereall',
    type: 'subagent',
    role: 'Sub-Agent: Feature Extractor',
    status: 'DEPLOYED',
    description: 'Monitors hyperscaler capital expenditures, AI semiconductor supply chains, and sovereign bond curve dynamics.',
    inputs: 'Live yield spreads, hyperscaler Capex reports & commodities futures',
    outputLink: 'Execution Sub-Agent (Terminal Node)',
    instructions: 'Monitor real-time sector momentum rotations and identify cross-asset lead-lag relationships across global technology and energy supply chains.',
    defaultProperty: 'Factor Neutral Union',
    codeSnippet: `# MARKET TREND REFERRAL SUB-AGENT
class MarketTrendReferralSubAgent(FeatureExtractor):
    def extract_momentum_factors(self, tick_stream: TickStream):
        spread_lead = self.calculate_yield_spread_beta(tick_stream)
        capex_momentum = self.evaluate_hyperscaler_spend()
        return FactorVector(lead_lag=spread_lead, momentum=capex_momentum)`,
    tools: ['L3 Market Depth Feeder', 'Real-Time Momentum Engine', 'Sentiment Classifier'],
    latency: '12ms',
    x: 220,
    y: 25,
  },
  {
    id: 'node-3',
    name: 'Data & Factor Matrix',
    type: 'data',
    role: 'Quantitative Feature Store',
    status: 'ACTIVE',
    description: 'Ultra-low latency colocation feature store aggregating Barra risk factor exposures, covariance matrices, and cross-asset beta parameters.',
    inputs: 'Barra Factor Covariance, Bloomberg BVAL & Equinix NY4 raw L2 orderbook feeds',
    outputLink: 'Market trend refereall & Terminal Gate',
    instructions: 'Continuously refresh rolling 30-day covariance matrices and stream orthogonalized factor alphas to downstream decision nodes.',
    defaultProperty: 'Conservative 15c3-5 Check',
    codeSnippet: `# FACTOR COVARIANCE FEATURE STORE
class DataFactorMatrixNode(DataNode):
    def compute_orthogonal_alphas(self, raw_ticks: MarketDepth):
        cleaned_cov = self.eigen_factor_cleaner(raw_ticks)
        return self.barra_engine.orthogonalize(cleaned_cov)`,
    tools: ['Equinix NY4 Direct Feed', 'Barra Multiple-Horizon Risk Model', 'KDB+ Tick Store'],
    latency: '4ms',
    x: 200,
    y: 195,
  },
  {
    id: 'node-4',
    name: 'Execution Sub-Agent',
    type: 'tool',
    role: 'Terminal Execution Gate',
    status: 'READY',
    description: 'Pre-trade compliance checker and smart order router executing algorithmic fills via FIX 4.4.',
    inputs: 'Target allocation delta vectors from Research Judgement agent and feature sub-agents',
    outputLink: 'Institutional OMS / Trade Blotter (FIX 4.4 Port 9800)',
    instructions: 'Validate order sizes against SEC 15c3-5 market access rules, cap single-name concentration at 10%, and route via TWAP/VWAP algorithms.',
    defaultProperty: 'Strict 10% Capped',
    codeSnippet: `# SEC 15c3-5 COMPLIANT EXECUTION GATE
class ExecutionSubAgentGate(TerminalGate):
    def route_blotter_order(self, target_order: OrderRequest):
        if self.compliance_check_15c3_5(target_order):
            return self.fix_router.dispatch_twap(target_order)
        raise RiskBreachException("SEC 15c3-5 Gate Triggered")`,
    tools: ['FIX 4.4 Direct DMA', 'Pre-Trade Risk Validator', 'TWAP/VWAP Algorithmic Slicer'],
    latency: '0.08ms',
    x: 390,
    y: 110,
  }
];

const INITIAL_WORKSPACE_MODELS: WorkspaceModel[] = [
  {
    id: 'model-1',
    name: 'Production Core',
    tag: 'Core Orchestrator',
    version: 'v1.0',
    description: 'Primary production multi-agent architecture with Research Judgement parent node, trend referral sub-agent, and SEC 15c3-5 execution gate.',
    targetVol: 14,
    maxPosition: 10,
    varLimit: 1.25,
    expectedSharpe: 1.84,
    expectedReturn: 13.8,
    color: 'var(--primary)', // Blue
    nodes: DEFAULT_CORE_NODES,
  },
  {
    id: 'model-2',
    name: 'Delta-Neutral Alpha',
    tag: 'Stat-Arb Overlay',
    version: 'v1.2',
    description: 'High-frequency statistical arbitrage model with tighter VaR limit (1.05%), L2 orderbook imbalance extractor, and dynamic delta-neutral hedging.',
    targetVol: 11,
    maxPosition: 8,
    varLimit: 1.05,
    expectedSharpe: 2.15,
    expectedReturn: 15.6,
    color: 'var(--chart-4)', // Emerald
    nodes: [
      {
        id: 'node-stat-parent',
        name: 'Stat-Arb Parent Orchestrator',
        type: 'parent',
        role: 'Parent Orchestrator',
        status: 'ACTIVE',
        description: 'Orchestrates high-frequency statistical arbitrage and cointegration mean-reversion trades.',
        inputs: 'Implied Volatility Surface, Order Imbalances & Cointegration Baskets',
        outputLink: 'Delta-Neutral Execution Gate',
        instructions: 'Monitor co-integrated equity pairs and route high-turnover arbitrage sweeps under strict delta-neutral constraints.',
        defaultProperty: 'Highest Sharpe Weighting',
        codeSnippet: `# STATISTICAL ARBITRAGE PARENT
class StatArbParentAgent(QuantParentAgent):
    def evaluate_spreads(self, z_scores):
        if abs(z_scores.current) > 2.2:
            return self.execute_pair_mean_reversion(z_scores)`,
        tools: ['Cointegration Engine', 'Barra Risk API', 'Z-Score Monitor'],
        latency: '8ms',
        x: 30,
        y: 110,
      },
      {
        id: 'node-stat-sub',
        name: 'L2 Order Imbalance Extractor',
        type: 'subagent',
        role: 'Sub-Agent: Feature Extractor',
        status: 'READY',
        description: 'Extracts microsecond queue depth imbalances and calculates real-time VPIN order flow toxicity.',
        inputs: 'NASDAQ ITCH 5.0 Depth Feed',
        outputLink: 'Stat-Arb Parent Orchestrator',
        instructions: 'Extract microsecond queue depth imbalances and compute real-time VPIN toxicity scores.',
        defaultProperty: 'Factor Neutral Union',
        codeSnippet: `# L2 DEPTH FEATURE EXTRACTOR
class L2DepthExtractor(FeatureExtractor):
    def compute_vpin(self, tick_feed):
        return self.toxicity_engine.calculate_volume_sync(tick_feed)`,
        tools: ['ITCH 5.0 Processor', 'FPGA Tick Sizer'],
        latency: '0.04ms',
        x: 220,
        y: 25,
      },
      {
        id: 'node-stat-data',
        name: 'Tick & Microstructure Store',
        type: 'data',
        role: 'Quantitative Feature Store',
        status: 'ACTIVE',
        description: 'High-speed 50-nanosecond tick colocation buffer at Equinix NY4.',
        inputs: 'Equinix NY4 raw L2/L3 colocation feed',
        outputLink: 'L2 Order Imbalance Extractor',
        instructions: 'Maintain 50-nanosecond tick buffers and trade-at-settlement historical snapshots.',
        defaultProperty: 'Conservative 15c3-5 Check',
        codeSnippet: `# TICK FEATURE STORE
class TickFeatureStore(DataNode):
    def get_order_book(self, symbol):
        return self.ny4_colo.snapshot(symbol)`,
        tools: ['NY4 Colocation Direct', 'KDB+/q Tick'],
        latency: '0.08ms',
        x: 200,
        y: 195,
      },
      {
        id: 'node-stat-gate',
        name: 'Delta-Neutral Execution DMA Gate',
        type: 'tool',
        role: 'Terminal Execution Gate',
        status: 'READY',
        description: 'Enforces pre-trade portfolio delta limits and executes paired DMA sweeps.',
        inputs: 'Calculated arbitrage legs and hedge ratios',
        outputLink: 'Direct Market Access (FIX 4.4)',
        instructions: 'Enforce pre-trade portfolio delta < ±0.02 and route paired limit orders simultaneously.',
        defaultProperty: 'Strict Delta Capped',
        codeSnippet: `# DELTA-NEUTRAL EXECUTION GATE
class DeltaNeutralGate(TerminalGate):
    def execute_paired_sweep(self, long_leg, short_leg):
        if self.verify_delta_neutrality(long_leg, short_leg):
            return self.route_dual_dma(long_leg, short_leg)`,
        tools: ['FIX 4.4 Engine', 'Pre-Trade SEC 15c3-5 Gate'],
        latency: '0.04ms',
        x: 390,
        y: 110,
      }
    ]
  },
  {
    id: 'model-3',
    name: 'Macro Rebalance Overlay',
    tag: 'Macro Overlay',
    version: 'v2.0',
    description: 'Rates shock hedge with Barra covariance multi-factor neutralization and cross-asset sovereign yield curve tracking.',
    targetVol: 16,
    maxPosition: 14,
    varLimit: 1.40,
    expectedSharpe: 1.95,
    expectedReturn: 14.2,
    color: 'var(--chart-2)', // Purple
    nodes: [
      {
        id: 'node-macro-parent',
        name: 'Yield Curve Macro Orchestrator',
        type: 'parent',
        role: 'Parent Orchestrator',
        status: 'ACTIVE',
        description: 'Models sovereign yield curve dynamics and macro factor shifts.',
        inputs: 'US 2Y/10Y curve, ECB minutes, breakeven inflation rates',
        outputLink: 'Barra Factor Covariance Sub-Agent',
        instructions: 'Model term structure twists and apply duration hedges across macro portfolios.',
        defaultProperty: 'Highest Sharpe Weighting',
        codeSnippet: `# MACRO YIELD CURVE ORCHESTRATOR
class MacroCurveOrchestrator(QuantParentAgent):
    def model_term_structure(self, yield_curve):
        steepener_signal = yield_curve.ten_year - yield_curve.two_year
        return self.rebalance_duration_exposure(steepener_signal)`,
        tools: ['Fed Funds Live', 'Bloomberg BVAL Feeder', 'Barra Multi-Factor'],
        latency: '24ms',
        x: 30,
        y: 110,
      },
      {
        id: 'node-macro-sub',
        name: 'Barra Factor Covariance Sub-Agent',
        type: 'subagent',
        role: 'Sub-Agent: Risk Neutralizer',
        status: 'DEPLOYED',
        description: 'Barra multi-factor risk model decomposes active risk and neutralizes style tilts.',
        inputs: 'Cross-asset factor risk model covariance matrix',
        outputLink: 'Terminal Gate',
        instructions: 'Decompose active risk and neutralize style factor tilt extremes.',
        defaultProperty: 'Factor Neutral Union',
        codeSnippet: `# FACTOR COVARIANCE NEUTRALIZER
class FactorCovarianceNeutralizer(FeatureExtractor):
    def compute_active_betas(self, factor_matrix):
        return self.barra_api.decompose_risk(factor_matrix)`,
        tools: ['Barra Risk Model', 'Eigenvalue Decomposer'],
        latency: '15ms',
        x: 220,
        y: 25,
      },
      {
        id: 'node-macro-gate',
        name: 'Cross-Asset Futures DMA Router',
        type: 'tool',
        role: 'Terminal Execution Gate',
        status: 'READY',
        description: 'Direct DMA execution router for treasury futures and duration hedge baskets.',
        inputs: 'Treasury futures and ETF hedging baskets',
        outputLink: 'CME Globex Gateway',
        instructions: 'Route interest rate futures hedges to execute macro duration adjustments.',
        defaultProperty: 'Conservative 15c3-5 Check',
        codeSnippet: `# CME FUTURES GATE
class CMEFuturesGate(TerminalGate):
    def route_hedge(self, duration_contracts):
        return self.globex_router.send_order(duration_contracts)`,
        tools: ['CME Globex API', 'SEC 15c3-5 Pre-Trade Check'],
        latency: '2ms',
        x: 390,
        y: 110,
      }
    ]
  }
];

interface AgentWorkspaceViewProps {
  activeTab: ViewTab;
  importedModel?: WorkspaceModel | null;
  onClearImportedModel?: () => void;
}

export const AgentWorkspaceView: React.FC<AgentWorkspaceViewProps> = ({ 
  activeTab,
  importedModel,
  onClearImportedModel
}) => {
  // Multi-Model Management State
  const [models, setModels] = useState<WorkspaceModel[]>(INITIAL_WORKSPACE_MODELS);
  const [activeModelId, setActiveModelId] = useState<string>('model-1');
  const [sandboxInitialMode, setSandboxInitialMode] = useState<'single' | 'compare' | 'merge'>('single');
  const [isNewModelMenuOpen, setIsNewModelMenuOpen] = useState<boolean>(false);

  // Active Model resolution
  const activeModel = models.find(m => m.id === activeModelId) || models[0];

  // Listen for imported model from AI Optimisation Window
  useEffect(() => {
    if (importedModel) {
      setModels((prev) => {
        const exists = prev.some((m) => m.id === importedModel.id);
        if (exists) return prev;
        return [...prev, importedModel];
      });
      setActiveModelId(importedModel.id);
      setRightTab('sandbox');
      setSandboxInitialMode('single');
      if (onClearImportedModel) {
        onClearImportedModel();
      }
    }
  }, [importedModel, onClearImportedModel]);

  // View mode switcher: matrix / Node / code
  const [viewMode, setViewMode] = useState<CanvasViewMode>('Node');
  
  // Repository filter pills: [ All ] [ Code bases ] [ sub agents ] [ sub agents ]
  const [repoFilter, setRepoFilter] = useState<RepoFilter>('all');

  // Selected node state for Inspector
  const [selectedNodeId, setSelectedNodeId] = useState<string>(activeModel.nodes[0]?.id || 'node-1');

  // Sync selected node with active model
  useEffect(() => {
    if (activeModel && activeModel.nodes.length > 0) {
      if (!activeModel.nodes.some(n => n.id === selectedNodeId)) {
        setSelectedNodeId(activeModel.nodes[0].id);
      }
    }
  }, [activeModel, selectedNodeId]);

  const selectedNode = activeModel.nodes.find(n => n.id === selectedNodeId) || activeModel.nodes[0] || DEFAULT_CORE_NODES[0];

  // Right Panel Tabs: [ Agent | Instructions | Code | Backtest Sandbox ]
  const [rightTab, setRightTab] = useState<RightPanelTab>('agent');

  // Canvas Inspector Editable fields for selected agent
  const [agentNameInput, setAgentNameInput] = useState<string>(selectedNode?.name || '');
  const [agentInputsText, setAgentInputsText] = useState<string>(selectedNode?.inputs || '');
  const [agentDescText, setAgentDescText] = useState<string>(selectedNode?.description || '');
  const [agentOutputLinkText, setAgentOutputLinkText] = useState<string>(selectedNode?.outputLink || '');
  const [agentInstructionsText, setAgentInstructionsText] = useState<string>(selectedNode?.instructions || '');
  const [selectedProperty, setSelectedProperty] = useState<string>(selectedNode?.defaultProperty || 'Highest Sharpe Weighting');

  // Update inspector fields when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setAgentNameInput(selectedNode.name);
      setAgentInputsText(selectedNode.inputs);
      setAgentDescText(selectedNode.description);
      setAgentOutputLinkText(selectedNode.outputLink);
      setAgentInstructionsText(selectedNode.instructions);
      setSelectedProperty(selectedNode.defaultProperty);
    }
  }, [selectedNodeId, activeModelId]);

  // Anti-hallucination auto-refresh countdown state per node
  const [nodeCountdowns, setNodeCountdowns] = useState<Record<string, number>>({
    'node-1': 42,
    'node-2': 36,
    'node-3': 58,
    'node-4': 24,
  });
  const [refreshingNodeId, setRefreshingNodeId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setNodeCountdowns((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (next[k] <= 1) {
            next[k] = k === 'node-1' ? 45 : k === 'node-2' ? 40 : k === 'node-3' ? 60 : 30;
          } else {
            next[k] -= 1;
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualNodeRefresh = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setRefreshingNodeId(nodeId);
    setTimeout(() => {
      setRefreshingNodeId(null);
      setNodeCountdowns((prev) => ({
        ...prev,
        [nodeId]: 45
      }));
    }, 600);
  };

  // Version dropdown
  const [selectedVersion, setSelectedVersion] = useState<string>(activeModel.version || 'Version 1');
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState<boolean>(false);

  // Bottom Model Idea / workspace ideator prompt state
  const [ideaPrompt, setIdeaPrompt] = useState<string>(
    'Add a stop-loss delta hedge when portfolio VaR breaches 1.25%, and incorporate L2 tick order imbalance into the momentum feature extractor.'
  );
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [ideatorOutput, setIdeatorOutput] = useState<string | null>(null);

  // Prompt / Test Modal state
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [promptQuery, setPromptQuery] = useState<string>('Simulate rate shock of +50bps and verify delta neutral hedge execution');
  const [isPromptRunning, setIsPromptRunning] = useState<boolean>(false);
  const [promptResponse, setPromptResponse] = useState<string | null>(null);

  // Audit modal state
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  // Model creation handler
  const handleCreateNewModel = (type: 'blank' | 'clone' | 'template') => {
    setIsNewModelMenuOpen(false);
    let newModel: WorkspaceModel;

    if (type === 'clone') {
      newModel = {
        ...activeModel,
        id: `model-${Date.now()}`,
        name: `${activeModel.name} (Copy)`,
        version: 'v1.1-copy',
        color: 'var(--primary)',
      };
    } else if (type === 'template') {
      newModel = {
        id: `model-${Date.now()}`,
        name: 'Volatility Skew Arbitrage',
        tag: 'Vol-Arb Model',
        version: 'v1.0-vol',
        description: 'Cross-strike option skew and variance swap risk-reversal arbitrage model.',
        targetVol: 12,
        maxPosition: 7,
        varLimit: 0.95,
        expectedSharpe: 2.22,
        expectedReturn: 16.4,
        color: 'var(--chart-5)',
        nodes: [
          {
            id: `node-vol-parent-${Date.now()}`,
            name: 'Vol Skew Parent Orchestrator',
            type: 'parent',
            role: 'Parent Orchestrator',
            status: 'ACTIVE',
            description: 'Option implied volatility term structure arbitrageur harvesting skew risk premia.',
            inputs: 'CBOE IV Term Structure, S&P 500 options chain',
            outputLink: 'Variance Swap Execution Gate',
            instructions: 'Harvest implied volatility risk premia when ATM/OTM skew widens past 2.0 std dev.',
            defaultProperty: 'Highest Sharpe Weighting',
            codeSnippet: `# VOLATILITY SKEW ARBITRAGE
class VolSkewAgent(QuantParentAgent):
    def evaluate_skew(self, iv_surface):
        return self.calculate_variance_premia(iv_surface)`,
            tools: ['CBOE Direct Feed', 'Black-Scholes-Merton Engine'],
            latency: '6ms',
            x: 30,
            y: 110,
          }
        ]
      };
    } else {
      newModel = {
        id: `model-${Date.now()}`,
        name: `Custom Agent Model #${models.length + 1}`,
        tag: 'Draft Model',
        version: 'v0.1-draft',
        description: 'Blank agent canvas ready to configure DAG nodes and parameters.',
        targetVol: 14,
        maxPosition: 10,
        varLimit: 1.25,
        expectedSharpe: 1.75,
        expectedReturn: 13.0,
        color: 'var(--muted-foreground)',
        nodes: [
          {
            id: `node-draft-parent-${Date.now()}`,
            name: 'Primary Decision Orchestrator',
            type: 'parent',
            role: 'Parent Orchestrator',
            status: 'READY',
            description: 'Custom parent decision orchestrator for quantitative strategy execution.',
            inputs: 'Market Data Feeds',
            outputLink: 'Execution Gate',
            instructions: 'Configure agent decision weights and downstream feature nodes.',
            defaultProperty: 'Highest Sharpe Weighting',
            codeSnippet: `# NEW AGENT ORCHESTRATOR\nclass CustomAgent(QuantParentAgent):\n    pass`,
            tools: ['Market Feeder'],
            latency: '10ms',
            x: 30,
            y: 110,
          }
        ]
      };
    }

    setModels(prev => [...prev, newModel]);
    setActiveModelId(newModel.id);
  };

  // Close tab handler
  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (models.length <= 1) return;
    const remaining = models.filter(m => m.id !== id);
    setModels(remaining);
    if (activeModelId === id) {
      setActiveModelId(remaining[0].id);
    }
  };

  // Handle model merge execution from Sandbox
  const handleMergeModels = (modelAId: string, modelBId: string, mergeStrategy: string) => {
    const modA = models.find(m => m.id === modelAId) || activeModel;
    const modB = models.find(m => m.id === modelBId) || models[1] || activeModel;

    const mergedModel: WorkspaceModel = {
      id: `model-merged-${Date.now()}`,
      name: `Merged: ${modA.name.slice(0, 8)} + ${modB.name.slice(0, 8)}`,
      tag: 'Merged Strategy',
      version: 'v1.0-merged',
      description: `Synthesized model combining ${modA.name} and ${modB.name} using ${mergeStrategy} allocation protocol.`,
      targetVol: Math.round(((modA.targetVol || 14) + (modB.targetVol || 14)) / 2 * 0.92),
      maxPosition: Math.max(modA.maxPosition || 10, modB.maxPosition || 10),
      varLimit: Number((Math.min(modA.varLimit || 1.25, modB.varLimit || 1.25) * 0.92).toFixed(2)),
      expectedSharpe: Number((Math.max(modA.expectedSharpe || 1.84, modB.expectedSharpe || 1.84) + 0.18).toFixed(2)),
      expectedReturn: Number((Math.max(modA.expectedReturn || 13.8, modB.expectedReturn || 13.8) + 1.4).toFixed(1)),
      color: 'var(--chart-4)', // Emerald
      nodes: [
        ...modA.nodes.filter(n => n.type === 'parent'),
        ...modB.nodes.filter(n => n.type === 'subagent' || n.type === 'data'),
        ...modA.nodes.filter(n => n.type === 'tool'),
      ]
    };

    setModels(prev => [...prev, mergedModel]);
    setActiveModelId(mergedModel.id);
    setRightTab('sandbox');
    setSandboxInitialMode('single');
  };

  // Handle ideate and synthesize
  const handleSynthesizeIdea = () => {
    setIsSynthesizing(true);
    setIdeatorOutput(null);
    setTimeout(() => {
      setIsSynthesizing(false);
      setIdeatorOutput(
        `✓ Workspace Ideator Applied to ${activeModel.name}:\n` +
        `• Generated sub-agent parameter update: "Delta-Neutral Stop-Loss Overlay (VaR > 1.25%)".\n` +
        `• Connected L2 Order Imbalance feed into Market Trend Referral node.\n` +
        `• Re-calibrated Backtest Sandbox with targeted datasets (Annualized Sharpe +0.18, Max Drawdown reduced by 1.1%).`
      );
      // Auto-switch to sandbox to see model outputs!
      setRightTab('sandbox');
      setSandboxInitialMode('single');
    }, 900);
  };

  // Handle prompt selected agent
  const handleRunAgentPrompt = () => {
    setIsPromptRunning(true);
    setPromptResponse(null);
    setTimeout(() => {
      setIsPromptRunning(false);
      setPromptResponse(
        `[${selectedNode.name} Execution Output]\n` +
        `• Input Processed: "${promptQuery}"\n` +
        `• Status: PASSED all 4 pre-trade compliance gates (SEC 15c3-5, <10% concentration).\n` +
        `• Model Decision: Synthetic short index futures overlay recommended (-15% beta exposure).\n` +
        `• Simulated VaR: Stabilized from 1.34% to 1.14% (within 1.50% firm ceiling).\n` +
        `• Target Route: Direct Market Access (FIX 4.4 Port 9800) ready for blotter staging.`
      );
    }, 800);
  };

  // Repository items matching wireframe
  const repositoryItems = [
    {
      id: 'repo-1',
      title: 'Research Judgement agent',
      category: 'subagents',
      nodeMatch: 'node-1',
      tag: 'Parent Agent',
    },
    {
      id: 'repo-2',
      title: 'Templates',
      category: 'templates',
      nodeMatch: 'node-2',
      tag: 'Quant Template',
    },
    {
      id: 'repo-3',
      title: 'Data',
      category: 'data',
      nodeMatch: 'node-3',
      tag: 'Data Stream',
    },
    {
      id: 'repo-4',
      title: 'Sub agent',
      category: 'subagents',
      nodeMatch: 'node-4',
      tag: 'Execution Sub-Agent',
    },
    {
      id: 'repo-5',
      title: 'Market trend refereall',
      category: 'subagents',
      nodeMatch: 'node-2',
      tag: 'Trend Extractor',
    },
  ];

  const filteredRepoItems = repositoryItems.filter(item => {
    if (repoFilter === 'all') return true;
    if (repoFilter === 'codebases') return item.category === 'codebases' || item.category === 'templates';
    if (repoFilter === 'subagents') return item.category === 'subagents';
    if (repoFilter === 'templates') return item.category === 'templates';
    if (repoFilter === 'data') return item.category === 'data';
    return true;
  });

  return (
    <div className="h-full flex-1 flex flex-col min-h-0 overflow-hidden space-y-2 select-none bg-card">
      
      {/* Top Workspace Header with Multi-Model Tabs and Model Handling Section */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-border shrink-0">
        
        {/* Left: View Title */}
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-foreground font-mono tracking-tight">
            Agent Builder / Workspace
          </span>
          <Badge variant="outline" className="text-[10px] font-mono bg-muted text-muted-foreground border-border">
            DAG Architecture
          </Badge>
        </div>

        {/* Center: Model Tabs Section */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-xl py-0.5">
          {models.map((mod) => {
            const isActive = mod.id === activeModelId;
            return (
              <div
                key={mod.id}
                onClick={() => {
                  setActiveModelId(mod.id);
                  if (mod.nodes.length > 0) {
                    setSelectedNodeId(mod.nodes[0].id);
                  }
                }}
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer transition-all border shrink-0 ${
                  isActive
                    ? 'bg-card text-foreground border-primary ring-2 ring-ring/20 shadow-2xs font-bold'
                    : 'bg-muted hover:bg-muted text-muted-foreground border-border'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: mod.color || 'var(--primary)' }} 
                />
                <span className="truncate max-w-[140px]">{mod.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-border/60 text-muted-foreground">
                  {mod.version}
                </span>

                {models.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => handleCloseTab(mod.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-destructive p-0.5 rounded transition-opacity"
                    title="Close model tab"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* + New Model Button with Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNewModelMenuOpen(!isNewModelMenuOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground bg-muted hover:bg-muted border border-dashed border-border transition-all shrink-0"
              title="Add or Ideate on New Model"
            >
              <Plus className="w-3 h-3 text-primary" />
              <span>New Model</span>
              <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
            </button>

            {isNewModelMenuOpen && (
              <div className="absolute left-0 mt-1 w-56 bg-popover border border-border rounded-xl shadow-lg z-40 p-1 font-mono text-xs animate-in fade-in">
                <button
                  type="button"
                  onClick={() => handleCreateNewModel('blank')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-muted flex items-center gap-2 text-foreground"
                >
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  <div>
                    <span className="font-semibold block">Blank Model</span>
                    <span className="text-[10px] text-muted-foreground block">Empty canvas to design DAG</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateNewModel('clone')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-muted flex items-center gap-2 text-foreground"
                >
                  <Copy className="w-3.5 h-3.5 text-chart-4" />
                  <div>
                    <span className="font-semibold block">Clone Active Model</span>
                    <span className="text-[10px] text-muted-foreground block">Duplicate {activeModel.name}</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateNewModel('template')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-muted flex items-center gap-2 text-foreground"
                >
                  <Sparkles className="w-3.5 h-3.5 text-chart-5" />
                  <div>
                    <span className="font-semibold block">Volatility Skew Arb</span>
                    <span className="text-[10px] text-muted-foreground block">From Research Node idea</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Model Handling Section (Compare & Merge in Sandbox) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setRightTab('sandbox');
              setSandboxInitialMode('compare');
            }}
            className="h-7 px-2.5 text-xs font-mono text-accent-foreground bg-accent/50 hover:bg-accent/60 border-border rounded-lg gap-1 shadow-2xs"
            title="Compare two models side-by-side in the Sandbox"
          >
            <ArrowLeftRight className="w-3 h-3 text-primary" />
            <span>Compare in Sandbox</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setRightTab('sandbox');
              setSandboxInitialMode('merge');
            }}
            className="h-7 px-2.5 text-xs font-mono text-foreground bg-muted/50 hover:bg-muted/60 border-border rounded-lg gap-1 shadow-2xs"
            title="Merge two models into a unified strategy in Sandbox"
          >
            <GitMerge className="w-3 h-3 text-chart-4" />
            <span>Merge Models</span>
          </Button>

          <Badge variant="outline" className="text-[10px] font-mono bg-card text-foreground border-border hidden sm:inline-flex">
            Sharpe: {activeModel.expectedSharpe || 1.84} · VaR: {activeModel.varLimit || 1.25}%
          </Badge>
        </div>

      </div>

      {/* AI Strategy Experimentation Notice Banner (When experimenting from Market Fund Manager) */}
      {activeModel.originStrategy && (
        <div className="px-3 py-2 bg-accent/70 border border-border rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono shrink-0 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-primary text-primary-foreground">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="text-accent-foreground font-bold block">
                Experimenting with Strategy Idea: {activeModel.originStrategy}
              </span>
              <span className="text-[11px] text-accent-foreground font-sans">
                {activeModel.description}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeModel.ideaBenefits?.map((b, idx) => (
              <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-card text-accent-foreground font-bold border border-border shadow-2xs">
                {b}
              </span>
            ))}
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setRightTab('sandbox');
                setSandboxInitialMode('single');
              }}
              className="h-6 text-[11px] font-mono bg-primary hover:bg-primary text-primary-foreground rounded-md px-2.5 gap-1"
            >
              <TestTube className="w-3 h-3" />
              <span>Backtest Live</span>
            </Button>
          </div>
        </div>
      )}

      {/* Main 3-Column Container matching wireframe sketch */}
      <div className="flex-1 min-h-0 border border-border rounded-2xl bg-card shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* =========================================================================
            LEFT COLUMN: REPOSITORY (Images 1-4)
            - Repository title
            - Filter buttons: [ All ] [ Code bases ] [ sub agents ] [ templates ]
            - Vertical list of items
           ========================================================================= */}
        <div className="lg:col-span-3 border-r border-border p-3 flex flex-col justify-between bg-card min-h-0 overflow-hidden">
          <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
            <div className="mb-2 shrink-0 flex items-center justify-between">
              <h2 className="text-xs font-bold text-foreground tracking-tight font-mono">
                Repository
              </h2>
              <span className="text-[10px] font-mono text-muted-foreground">
                Model: <strong className="text-foreground">{activeModel.name}</strong>
              </span>
            </div>

            {/* Filter pills matching sketch */}
            <div className="grid grid-cols-2 gap-1 mb-3 shrink-0">
              <button
                type="button"
                onClick={() => setRepoFilter('all')}
                className={`py-1 px-2 rounded-lg text-[11px] font-mono transition-all border ${
                  repoFilter === 'all'
                    ? 'bg-primary text-primary-foreground font-bold border-primary shadow-2xs'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setRepoFilter('codebases')}
                className={`py-1 px-2 rounded-lg text-[11px] font-mono transition-all border ${
                  repoFilter === 'codebases'
                    ? 'bg-primary text-primary-foreground font-bold border-primary shadow-2xs'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                Code bases
              </button>
              <button
                type="button"
                onClick={() => setRepoFilter('subagents')}
                className={`py-1 px-2 rounded-lg text-[11px] font-mono transition-all border ${
                  repoFilter === 'subagents'
                    ? 'bg-primary text-primary-foreground font-bold border-primary shadow-2xs'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                sub agents
              </button>
              <button
                type="button"
                onClick={() => setRepoFilter('templates')}
                className={`py-1 px-2 rounded-lg text-[11px] font-mono transition-all border ${
                  repoFilter === 'templates'
                    ? 'bg-primary text-primary-foreground font-bold border-primary shadow-2xs'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                templates
              </button>
            </div>

            {/* Vertical list of items */}
            <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1">
              {filteredRepoItems.map((item) => {
                const isSelected = selectedNode?.name === item.title;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      const matched = activeModel.nodes.find(n => n.name.toLowerCase().includes(item.title.toLowerCase().slice(0, 8)));
                      if (matched) setSelectedNodeId(matched.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-accent border-primary shadow-2xs'
                        : 'bg-card hover:bg-muted border-border'
                    }`}
                  >
                    <span className="text-xs font-semibold text-foreground font-mono block">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {item.tag}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom quick add button */}
          <div className="pt-2 border-t border-border shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[11px] font-mono text-foreground hover:bg-muted h-8 gap-1 border-border bg-card"
              onClick={() => {
                const newNode: AgentNode = {
                  id: `node-${Date.now().toString().slice(-3)}`,
                  name: `Custom Sub-Agent #${activeModel.nodes.length + 1}`,
                  type: 'subagent',
                  role: 'Custom Quantitative Sub-Agent',
                  status: 'READY',
                  description: 'Custom quantitative risk and alpha signal generator.',
                  inputs: 'Real-time L2 orderbook stream & factor covariance feed',
                  outputLink: 'Execution Sub-Agent',
                  instructions: 'Execute systematic statistical arbitrage and maintain beta neutrality under volatile conditions.',
                  defaultProperty: 'Factor Neutral Union',
                  codeSnippet: `# CUSTOM QUANTITATIVE SUB-AGENT\nclass CustomSubAgent(QuantAgent):\n    def execute(self, ticks):\n        return alpha_signal`,
                  tools: ['Barra Risk API', 'Execution Gateway'],
                  latency: '10ms',
                  x: 220,
                  y: 110,
                };
                
                setModels(prev => prev.map(m => {
                  if (m.id === activeModelId) {
                    return { ...m, nodes: [...m.nodes, newNode] };
                  }
                  return m;
                }));
                setSelectedNodeId(newNode.id);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Sub-Agent Node</span>
            </Button>
          </div>
        </div>

        {/* =========================================================================
            CENTER COLUMN: CANVAS GRAPH + BOTTOM IDEATOR (Images 1-4)
            - Top bar: [ matrix / Node / code ] + [ Version 1 ▼ ]
            - Middle: Interactive Node DAG (or Code view if "code" is active)
            - Bottom: Model Idea / workspace ideator prompt and edit bar
           ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-between border-r border-border bg-card p-3 min-h-0 overflow-hidden">
          <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
            {/* Top Bar matching sketch: "matrix / Node / code" + "Version 1 ▼" */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-border shrink-0">
              
              {/* Mode switch container: [ matrix / Node / code ] */}
              <div className="flex items-center px-2.5 py-1 rounded-xl border border-border bg-card font-mono text-xs shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('matrix')}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    viewMode === 'matrix'
                      ? 'bg-muted text-foreground font-bold border border-border'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  matrix
                </button>
                <span className="text-muted-foreground mx-1">/</span>
                <button
                  type="button"
                  onClick={() => setViewMode('Node')}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    viewMode === 'Node'
                      ? 'bg-muted text-foreground font-bold border border-border'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  Node
                </button>
                <span className="text-muted-foreground mx-1">/</span>
                <button
                  type="button"
                  onClick={() => setViewMode('code')}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    viewMode === 'code'
                      ? 'bg-muted text-foreground font-bold border border-border'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  code
                </button>
              </div>

              {/* Version dropdown matching sketch: [ Version 1 ▼ ] */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
                  className="h-7 text-xs font-mono gap-1 text-foreground px-2.5 bg-card hover:bg-muted border-border rounded-lg shadow-2xs"
                >
                  <span>{selectedVersion}</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </Button>

                {isVersionDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-popover border border-border rounded-xl shadow-lg z-30 p-1 font-mono text-xs animate-in fade-in">
                    {[
                      'Version 1 (Production Core)',
                      'Version 1.1 (Low Latency DMA)',
                      'Version 1.2 (Delta-Neutral Alpha)',
                      'Version 2.0-Alpha (Omni Macro)',
                    ].map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          setSelectedVersion(v.split(' (')[0]);
                          setIsVersionDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-muted flex items-center justify-between ${
                          selectedVersion === v.split(' (')[0] ? 'text-primary font-bold bg-accent' : 'text-foreground'
                        }`}
                      >
                        <span>{v}</span>
                        {selectedVersion === v.split(' (')[0] && <Check className="w-3 h-3 text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Canvas View (when "Node" is active) */}
            {viewMode === 'Node' && (
              <div className="relative w-full flex-1 min-h-[260px] rounded-xl border border-border bg-card overflow-hidden p-2 select-none flex items-center justify-center">
                {/* SVG Connections matching sketch topology */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <defs>
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--secondary)" opacity="0.9" />
                    </marker>
                  </defs>

                  {/* Node 1 (left) -> Node 2 (top) */}
                  <path
                    d="M 140 120 C 165 95, 175 60, 205 50"
                    fill="none"
                    stroke="var(--secondary)"
                    strokeWidth="1.75"
                    markerEnd="url(#arrow)"
                  />

                  {/* Node 1 (left) -> Node 3 (bottom) */}
                  <path
                    d="M 140 150 C 165 175, 170 215, 195 220"
                    fill="none"
                    stroke="var(--secondary)"
                    strokeWidth="1.75"
                    markerEnd="url(#arrow)"
                  />

                  {/* Node 2 (top) -> Terminal / Node 4 (right) */}
                  <path
                    d="M 305 60 C 335 75, 350 105, 375 130"
                    fill="none"
                    stroke="var(--secondary)"
                    strokeWidth="1.75"
                    markerEnd="url(#arrow)"
                  />

                  {/* Node 3 (bottom) -> Terminal / Node 4 (right) */}
                  <path
                    d="M 300 220 C 335 200, 350 165, 375 145"
                    fill="none"
                    stroke="var(--secondary)"
                    strokeWidth="1.75"
                    markerEnd="url(#arrow)"
                  />
                </svg>

                {/* Node Cards inside canvas */}
                <div className="relative w-full h-full">
                  {/* Node 1: Left tall rounded card (Research Judgement agent / Parent) */}
                  {activeModel.nodes[0] && (
                    <div
                      onClick={() => setSelectedNodeId(activeModel.nodes[0].id)}
                      className={`absolute left-2 top-[60px] w-[138px] h-[115px] p-2 rounded-2xl border-2 transition-all cursor-pointer z-10 flex flex-col justify-between shadow-2xs ${
                        selectedNodeId === activeModel.nodes[0].id
                          ? 'bg-card border-primary ring-2 ring-ring/30'
                          : 'bg-card hover:bg-muted border-border'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-primary font-bold">
                            {activeModel.nodes[0].type}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleManualNodeRefresh(e, 'node-1')}
                            title="Anti-Hallucination Refresh countdown"
                            className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-muted text-foreground border border-border text-[8px] font-mono font-bold hover:bg-muted"
                          >
                            <RotateCw className={`w-2.5 h-2.5 ${refreshingNodeId === 'node-1' ? 'animate-spin text-chart-4' : ''}`} />
                            <span>{nodeCountdowns['node-1'] || 42}s</span>
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-foreground font-mono leading-tight block">
                          {activeModel.nodes[0].name}
                        </span>
                      </div>
                      <div className="text-[8px] font-mono text-muted-foreground border-t border-border pt-0.5 flex items-center justify-between">
                        <span>Lat: {activeModel.nodes[0].latency}</span>
                        <span className="text-chart-4 font-semibold">Grounded</span>
                      </div>
                    </div>
                  )}

                  {/* Node 2: Top card (Market trend refereall / Subagent) */}
                  {activeModel.nodes[1] && (
                    <div
                      onClick={() => setSelectedNodeId(activeModel.nodes[1].id)}
                      className={`absolute left-[195px] top-[10px] w-[125px] h-[82px] p-2 rounded-xl border-2 transition-all cursor-pointer z-10 flex flex-col justify-between shadow-2xs ${
                        selectedNodeId === activeModel.nodes[1].id
                          ? 'bg-card border-primary ring-2 ring-ring/30'
                          : 'bg-card hover:bg-muted border-border'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-chart-2 font-bold block">
                            {activeModel.nodes[1].type}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleManualNodeRefresh(e, 'node-2')}
                            title="Anti-Hallucination Refresh countdown"
                            className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-muted text-foreground border border-border text-[8px] font-mono font-bold hover:bg-muted"
                          >
                            <RotateCw className={`w-2.5 h-2.5 ${refreshingNodeId === 'node-2' ? 'animate-spin text-chart-2' : ''}`} />
                            <span>{nodeCountdowns['node-2'] || 36}s</span>
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-foreground font-mono leading-tight block mt-0.5">
                          {activeModel.nodes[1].name}
                        </span>
                      </div>
                      <div className="text-[8px] font-mono text-muted-foreground border-t border-border pt-0.5 flex items-center justify-between">
                        <span>{activeModel.nodes[1].latency}</span>
                        <span className="text-chart-2 font-semibold">Synced</span>
                      </div>
                    </div>
                  )}

                  {/* Node 3: Bottom card (Data & Factor Matrix / Data) */}
                  {activeModel.nodes[2] && (
                    <div
                      onClick={() => setSelectedNodeId(activeModel.nodes[2].id)}
                      className={`absolute left-[190px] bottom-[10px] w-[125px] h-[82px] p-2 rounded-xl border-2 transition-all cursor-pointer z-10 flex flex-col justify-between shadow-2xs ${
                        selectedNodeId === activeModel.nodes[2].id
                          ? 'bg-card border-primary ring-2 ring-ring/30'
                          : 'bg-card hover:bg-muted border-border'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-chart-4 font-bold block">
                            {activeModel.nodes[2].type}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleManualNodeRefresh(e, 'node-3')}
                            title="Anti-Hallucination Refresh countdown"
                            className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-muted text-foreground border border-border text-[8px] font-mono font-bold hover:bg-muted"
                          >
                            <RotateCw className={`w-2.5 h-2.5 ${refreshingNodeId === 'node-3' ? 'animate-spin text-chart-4' : ''}`} />
                            <span>{nodeCountdowns['node-3'] || 58}s</span>
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-foreground font-mono leading-tight block mt-0.5">
                          {activeModel.nodes[2].name}
                        </span>
                      </div>
                      <div className="text-[8px] font-mono text-muted-foreground border-t border-border pt-0.5 flex items-center justify-between">
                        <span>{activeModel.nodes[2].latency}</span>
                        <span className="text-chart-4 font-semibold">L2 Validated</span>
                      </div>
                    </div>
                  )}

                  {/* Node 4: Right terminal node (Execution Sub-Agent / Tool) */}
                  {activeModel.nodes[3] && (
                    <div
                      onClick={() => setSelectedNodeId(activeModel.nodes[3].id)}
                      className={`absolute right-2 top-[75px] w-[128px] h-[92px] p-2 rounded-xl border-2 transition-all cursor-pointer z-10 flex flex-col justify-between shadow-2xs ${
                        selectedNodeId === activeModel.nodes[3].id
                          ? 'bg-card border-primary ring-2 ring-ring/30'
                          : 'bg-card hover:bg-muted border-border'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-destructive font-bold block">
                            Terminal Gate
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleManualNodeRefresh(e, 'node-4')}
                            title="Anti-Hallucination Refresh countdown"
                            className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-muted text-foreground border border-border text-[8px] font-mono font-bold hover:bg-muted"
                          >
                            <RotateCw className={`w-2.5 h-2.5 ${refreshingNodeId === 'node-4' ? 'animate-spin text-destructive' : ''}`} />
                            <span>{nodeCountdowns['node-4'] || 24}s</span>
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-foreground font-mono leading-tight block mt-0.5">
                          {activeModel.nodes[3].name}
                        </span>
                      </div>
                      <div className="text-[8px] font-mono text-muted-foreground border-t border-border pt-0.5 flex items-center justify-between">
                        <span>SEC 15c3-5</span>
                        <span className="text-foreground font-bold">PASS</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Code View mode */}
            {viewMode === 'code' && (
              <div className="w-full flex-1 min-h-[260px] rounded-xl border border-border bg-secondary text-secondary-foreground font-mono text-xs p-3 overflow-y-auto space-y-1">
                <div className="flex items-center justify-between pb-1.5 border-b border-secondary text-muted-foreground text-[11px]">
                  <span># {selectedNode.name} Implementation ({activeModel.name})</span>
                  <span className="text-chart-4">Python 3.11 · Compiled</span>
                </div>
                <pre className="pt-2 text-[11px] leading-relaxed overflow-x-auto text-secondary-foreground">
                  {selectedNode.codeSnippet}
                </pre>
              </div>
            )}

            {/* Matrix View mode */}
            {viewMode === 'matrix' && (
              <div className="w-full flex-1 min-h-[260px] rounded-xl border border-border bg-card p-3 overflow-y-auto font-mono text-xs space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="font-bold text-foreground">Cross-Agent Factor Covariance Matrix</span>
                  <span className="text-[10px] text-muted-foreground">Barra Multi-Asset Model</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse text-[10px]">
                    <thead>
                      <tr className="border-b border-border bg-muted">
                        <th className="p-1.5 text-left">Agent Node</th>
                        <th className="p-1.5">Alpha Beta</th>
                        <th className="p-1.5">Momentum</th>
                        <th className="p-1.5">Vol Sensitivity</th>
                        <th className="p-1.5">Corr (NY4)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-1.5 text-left font-semibold text-foreground">Research Judgement</td>
                        <td className="p-1.5 text-primary font-bold">1.00</td>
                        <td className="p-1.5">0.42</td>
                        <td className="p-1.5 text-foreground">0.12</td>
                        <td className="p-1.5">0.88</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 text-left font-semibold text-foreground">Market Trend Referral</td>
                        <td className="p-1.5">0.42</td>
                        <td className="p-1.5 text-primary font-bold">1.00</td>
                        <td className="p-1.5">0.68</td>
                        <td className="p-1.5">0.94</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 text-left font-semibold text-foreground">Data &amp; Factor Store</td>
                        <td className="p-1.5 text-foreground">0.12</td>
                        <td className="p-1.5">0.68</td>
                        <td className="p-1.5 text-primary font-bold">1.00</td>
                        <td className="p-1.5">0.99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              BOTTOM: MODEL IDEA / WORKSPACE IDEATOR PROMPT & EDIT BAR (Images 1-4)
              - Ideation chip buttons: Delta-Neutral Hedge Overlay, L2 Imbalance, Barra Covariance
              - Prompt Input field + [ Ideate & Apply ]
             ========================================================================= */}
          <div className="pt-2 border-t border-border mt-2 shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Model Ideator &amp; Architecture Engine
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                Active: <strong className="text-foreground">{activeModel.name}</strong>
              </span>
            </div>

            {/* Quick Prompt Ideation Chips */}
            <div className="flex flex-wrap items-center gap-1">
              {[
                'Delta-Neutral Hedge Overlay',
                'L2 Order Imbalance Filter',
                'Barra Covariance Decomposer',
                'SEC 15c3-5 Pre-Trade Limit Gate'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setIdeaPrompt(`Apply ${chip} with strict risk constraints on ${activeModel.name}.`)}
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground border border-border transition-all"
                >
                  + {chip}
                </button>
              ))}
            </div>

            {/* Prompt input and action button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={ideaPrompt}
                  onChange={(e) => setIdeaPrompt(e.target.value)}
                  placeholder="Ideate or modify model architecture, agent weights, or parameters..."
                  className="w-full h-8 pl-2.5 pr-8 text-xs font-mono rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>
              <Button
                type="button"
                size="sm"
                onClick={handleSynthesizeIdea}
                disabled={isSynthesizing}
                className="h-8 px-3 font-mono text-xs bg-primary hover:bg-primary text-primary-foreground rounded-lg gap-1 shrink-0 font-semibold shadow-2xs"
              >
                <Sparkles className={`w-3 h-3 ${isSynthesizing ? 'animate-spin' : ''}`} />
                <span>{isSynthesizing ? 'Synthesizing...' : 'Ideate & Apply'}</span>
              </Button>
            </div>

            {ideatorOutput && (
              <div className="p-2 rounded-lg bg-muted border border-border text-[10px] font-mono text-foreground whitespace-pre-line animate-in fade-in">
                {ideatorOutput}
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: AGENT INSPECTOR & SANDBOX (Images 1-4)
            - Tabs: [ Agent ] [ Instructions ] [ Code ] [ Backtest Sandbox ]
            - Content updates dynamically per active tab
            - In Sandbox mode: Supports Single Model, Compare Models, and Merge Models
           ========================================================================= */}
        <div className="lg:col-span-4 p-3 flex flex-col justify-between bg-card min-h-0 overflow-hidden">
          <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
            
            {/* Top Tabs matching sketch */}
            <div className="flex items-center justify-between pb-2 border-b border-border mb-2 shrink-0">
              <div className="flex items-center gap-1 font-mono text-xs overflow-x-auto py-0.5">
                <button
                  type="button"
                  onClick={() => setRightTab('agent')}
                  className={`px-2 py-1 rounded-md transition-all ${
                    rightTab === 'agent'
                      ? 'bg-muted text-foreground font-bold border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Agent
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab('instructions')}
                  className={`px-2 py-1 rounded-md transition-all ${
                    rightTab === 'instructions'
                      ? 'bg-muted text-foreground font-bold border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Instructions
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab('code')}
                  className={`px-2 py-1 rounded-md transition-all ${
                    rightTab === 'code'
                      ? 'bg-muted text-foreground font-bold border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Code
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab('sandbox')}
                  className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                    rightTab === 'sandbox'
                      ? 'bg-primary text-primary-foreground font-bold border border-primary shadow-2xs'
                      : 'text-primary hover:text-accent-foreground'
                  }`}
                >
                  <TestTube className="w-3 h-3" />
                  <span>Sandbox</span>
                </button>
              </div>

              {/* Audit Badge */}
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(true)}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border text-foreground bg-muted hover:bg-muted transition-all shrink-0 flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>audit</span>
              </button>
            </div>

            {/* TAB CONTENT: SANDBOX (Interactive Model Outputs, Compare & Merge) */}
            {rightTab === 'sandbox' && (
              <div className="flex-1 min-h-0 overflow-y-auto">
                <AgentBacktestSandbox
                  selectedNodeName={selectedNode.name}
                  models={models}
                  activeModelId={activeModelId}
                  onSelectModel={(id) => setActiveModelId(id)}
                  onMergeModels={handleMergeModels}
                  initialMode={sandboxInitialMode}
                  onDeployModel={() => {
                    alert(`Model "${activeModel.name}" (${activeModel.version}) successfully deployed to production OMS.`);
                  }}
                />
              </div>
            )}

            {/* TAB CONTENT: CODE */}
            {rightTab === 'code' && (
              <div className="flex-1 min-h-0 overflow-y-auto font-mono text-xs space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="text-muted-foreground">Source: {selectedNode.name}.py</span>
                  <Badge variant="outline" className="text-[10px] bg-muted">FIX 4.4 Engine</Badge>
                </div>
                <div className="p-2.5 rounded-xl bg-secondary text-secondary-foreground text-[11px] leading-relaxed overflow-x-auto">
                  <pre>{selectedNode.codeSnippet}</pre>
                </div>
              </div>
            )}

            {/* TAB CONTENT: INSTRUCTIONS */}
            {rightTab === 'instructions' && (
              <div className="flex-1 min-h-0 overflow-y-auto font-mono text-xs space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground block">System Prompt / Behavioral Guidelines:</label>
                  <textarea
                    value={agentInstructionsText}
                    onChange={(e) => setAgentInstructionsText(e.target.value)}
                    rows={8}
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground block">Allocated API Tools:</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.tools.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-muted border border-border text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: AGENT INSPECTOR (Default wireframe layout) */}
            {rightTab === 'agent' && (
              <div className="flex flex-col flex-1 min-h-0 justify-between">
                <div className="space-y-2.5 overflow-y-auto pr-0.5 flex-1 min-h-0">
                  
                  {/* Agent / Sub-agent Name Input */}
                  <div>
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-0.5">
                      Name
                    </label>
                    <input
                      type="text"
                      value={agentNameInput}
                      onChange={(e) => setAgentNameInput(e.target.value)}
                      className="w-full font-mono text-xs font-bold border border-border rounded-lg px-2 py-1.5 text-foreground bg-card focus:outline-hidden focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  {/* Inputs */}
                  <div>
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-0.5">
                      Inputs
                    </label>
                    <textarea
                      value={agentInputsText}
                      onChange={(e) => setAgentInputsText(e.target.value)}
                      rows={2}
                      className="w-full font-mono text-xs border border-border rounded-lg p-2 text-foreground bg-card focus:outline-hidden focus:ring-1 focus:ring-ring resize-none"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-0.5">
                      Description
                    </label>
                    <textarea
                      value={agentDescText}
                      onChange={(e) => setAgentDescText(e.target.value)}
                      rows={3}
                      className="w-full font-mono text-xs border border-border rounded-lg p-2 text-foreground bg-card focus:outline-hidden focus:ring-1 focus:ring-ring resize-none"
                    />
                  </div>

                  {/* Output Link */}
                  <div>
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-0.5">
                      Output Link
                    </label>
                    <input
                      type="text"
                      value={agentOutputLinkText}
                      onChange={(e) => setAgentOutputLinkText(e.target.value)}
                      className="w-full font-mono text-xs border border-border rounded-lg px-2 py-1 text-foreground bg-card focus:outline-hidden focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  {/* Instructions */}
                  <div>
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-0.5">
                      Instructions
                    </label>
                    <textarea
                      value={agentInstructionsText}
                      onChange={(e) => setAgentInstructionsText(e.target.value)}
                      rows={3}
                      className="w-full font-mono text-xs border border-border rounded-lg p-2 text-foreground bg-card focus:outline-hidden focus:ring-1 focus:ring-ring resize-none"
                    />
                  </div>

                  {/* Default Properties Dropdown */}
                  <div>
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-0.5">
                      Default Properties
                    </label>
                    <select
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      className="w-full font-mono text-xs border border-border rounded-lg px-2 py-1.5 text-foreground bg-card focus:outline-hidden focus:ring-1 focus:ring-ring"
                    >
                      <option value="Highest Sharpe Weighting">Highest Sharpe Weighting</option>
                      <option value="Factor Neutral Union">Factor Neutral Union</option>
                      <option value="Conservative 15c3-5 Check">Conservative 15c3-5 Check</option>
                      <option value="Strict Delta Capped">Strict Delta Capped</option>
                    </select>
                  </div>

                  {/* Tools list */}
                  <div>
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                      Assigned Tools
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.tools.map((t, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] font-mono bg-muted border-border">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button: [ Prompt the selected agent/subagent ] */}
                <div className="pt-2 border-t border-border shrink-0">
                  <Button
                    type="button"
                    onClick={() => setIsPromptModalOpen(true)}
                    className="w-full font-mono text-xs h-9 bg-card hover:bg-muted text-foreground border border-border rounded-xl font-semibold shadow-2xs gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-primary" />
                    <span>Prompt the selected agent/subagent</span>
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* PROMPT TEST MODAL */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-50 bg-secondary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border border-border bg-card shadow-2xl rounded-2xl animate-in zoom-in-95 p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                <span className="font-bold text-xs text-foreground">
                  Prompt Agent: {selectedNode.name} ({activeModel.name})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPromptModalOpen(false)}
                className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">
                Enter quantitative prompt or simulation command:
              </label>
              <textarea
                value={promptQuery}
                onChange={(e) => setPromptQuery(e.target.value)}
                rows={3}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
              />
            </div>

            {promptResponse && (
              <div className="p-3 rounded-xl bg-muted border border-border text-[11px] leading-relaxed whitespace-pre-line text-foreground">
                {promptResponse}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsPromptModalOpen(false);
                  setRightTab('sandbox');
                  setSandboxInitialMode('single');
                }}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <TestTube className="w-3.5 h-3.5" />
                <span>Open in Backtest Sandbox</span>
              </button>

              <Button
                type="button"
                onClick={handleRunAgentPrompt}
                disabled={isPromptRunning}
                className="font-mono text-xs h-8 bg-primary hover:bg-primary text-primary-foreground rounded-lg px-4 gap-1.5"
              >
                <Send className={`w-3 h-3 ${isPromptRunning ? 'animate-spin' : ''}`} />
                <span>{isPromptRunning ? 'Executing...' : 'Send Prompt'}</span>
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* AGENT AUDIT MODAL */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-secondary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border border-border bg-card shadow-2xl rounded-2xl animate-in zoom-in-95 p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-chart-4" />
                <span className="text-xs font-bold text-foreground">
                  Agent Audit &amp; Safety Compliance Log
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-card border border-border flex items-center justify-between">
                <span className="text-muted-foreground">Target Model / Agent:</span>
                <span className="font-bold text-foreground">{activeModel.name} · {selectedNode.name}</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border flex items-center justify-between">
                <span className="text-muted-foreground">SEC Rule 15c3-5 DMA Gate:</span>
                <Badge variant="outline" className="bg-muted text-foreground border-border">
                  PASSED (0.04ms)
                </Badge>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border flex items-center justify-between">
                <span className="text-muted-foreground">Execution Latency SLA (&lt;25ms):</span>
                <Badge variant="outline" className="bg-muted text-foreground border-border">
                  {selectedNode.latency} (COMPLIANT)
                </Badge>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border flex items-center justify-between">
                <span className="text-muted-foreground">Pre-Trade VaR Impact Limit:</span>
                <Badge variant="outline" className="bg-muted text-foreground border-border">
                  {activeModel.varLimit || 1.14}% / 1.50% MAX
                </Badge>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                onClick={() => setIsAuditModalOpen(false)}
                className="h-8 text-xs font-mono bg-primary hover:bg-primary text-primary-foreground rounded-lg px-4"
              >
                Close Audit
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};
