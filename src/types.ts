export type AssetClass = 
  | 'Equities' 
  | 'Fixed Income' 
  | 'Quantitative Derivatives' 
  | 'Commodities' 
  | 'FX & Currencies' 
  | 'Cash & Short-Term';

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  assetClass: AssetClass;
  sector: string;
  side: 'Long' | 'Short';
  shares: number;
  price: number;
  marketValue: number;
  weightPct: number;
  unrealizedPnL: number;
  unrealizedPnLPct: number;
  beta: number;
  varContribution: number;
}

export interface MonthlyReturn {
  year: number;
  month: string;
  fundReturn: number;
  benchmarkReturn: number;
}

export interface FactorExposure {
  factor: string;
  exposure: number; // e.g. -1.0 to +1.0
  contribution: number;
}

export interface ScenarioResult {
  scenarioId: string;
  name: string;
  description: string;
  pnlImpactM: number;
  navImpactPct: number;
  varChangePct: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  sectorBreakdown: { sector: string; impactPct: number }[];
}

export interface FundMandateLimits {
  // Core Portfolio Concentration & Position Limits
  maxSinglePositionPct: number; // e.g. 8.5%
  warningSinglePositionPct: number; // e.g. 7.0%
  maxTop5HoldingsPct: number; // e.g. 35.0%
  illiquidAssetsCapPct: number; // e.g. 2.0%

  // Leverage & Balance Sheet Exposures
  maxGrossExposurePct: number; // e.g. 200.0%
  maxNetExposurePct: number; // e.g. 150.0%
  minNetExposurePct: number; // e.g. -20.0%
  maxLongShortRatio: number; // e.g. 2.0
  minCashBufferPct: number; // e.g. 3.0%

  // Risk Caps & Drawdown Circuit Breakers
  maxVar95Pct: number; // e.g. 1.50% 1-day 95% VaR
  maxStressVar99Pct: number; // e.g. 2.75% 1-day 99% VaR
  maxDrawdownStopLossPct: number; // e.g. -6.0% (auto-derisk)
  hardHaltDrawdownPct: number; // e.g. -8.5% (mandatory halt)
  targetAnnualReturnPct: number; // e.g. 15.0%
  targetVolPct: number; // e.g. 7.5%

  // Barra Factor Beta Tolerances
  betaToleranceMin: number; // e.g. -0.05
  betaToleranceMax: number; // e.g. 0.25
  maxTrackingErrorPct: number; // e.g. 3.5%

  // Sector Exposure Caps (%)
  sectorCaps: {
    technology: number; // e.g. 35%
    financials: number; // e.g. 25%
    healthcare: number; // e.g. 20%
    consumer: number; // e.g. 20%
    energy: number; // e.g. 15%
    industrials: number; // e.g. 15%
  };

  // Multi-Agent Fleet Governance & Autonomy
  riskOfficerVetoMode: 'STRICT_HARD_VETO' | 'ADVISORY_ESCALATE' | 'AUTO_RESIZE_EXECUTE';
  secCollarTolerancePct: number; // e.g. 1.5% from NBBO
  darkPoolMaxPct: number; // e.g. 40%
  advMaxSlicePct: number; // e.g. 2.5% of 30-day ADV
  requirePmSignOffAboveM: number; // e.g. $50M order threshold
  prohibitedAssetClasses: string[];
  prohibitedTickers: string[];
}

export interface Fund {
  id: string;
  name: string;
  strategy: string;
  inceptionYear: number;
  aumMillions: number;
  nav: number;
  ytdReturnPct: number;
  oneYearReturnPct: number;
  threeYearAnnualizedPct: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdownPct: number;
  var95Pct: number;
  betaToSP500: number;
  volatilityPct: number;
  grossExposurePct: number;
  netExposurePct: number;
  longShortRatio: number;
  baseCurrency?: 'USD' | 'INR' | 'EUR' | 'GBP';
  benchmark?: string;
  mandateLimits?: FundMandateLimits;
  assetAllocations: { asset: AssetClass; pct: number }[];
  factorExposures: FactorExposure[];
  historicalPerformance: {
    date: string;
    fundNav: number;
    fundReturnPct: number;
    benchmarkReturnPct: number;
  }[];
  monthlyReturns: MonthlyReturn[];
  holdings: Holding[];
  scenarios: ScenarioResult[];
}

export interface TradeOrder {
  id: string;
  timestamp: string;
  fundId: string;
  ticker: string;
  name: string;
  side: 'BUY' | 'SELL';
  shares: number;
  targetPrice: number;
  status: 'EXECUTED' | 'PENDING' | 'SIMULATED';
  rationale: string;
}

export type ViewTab = 
  | 'overview' 
  | 'fund-setup'
  | 'repository' 
  | 'agent-builder' 
  | 'progress-gate' 
  | 'audit-log' 
  | 'reporting' 
  | 'holdings' 
  | 'scenarios' 
  | 'optimizer' 
  | 'blotter';

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

export interface WorkspaceModel {
  id: string;
  name: string;
  tag: string;
  version: string;
  description: string;
  nodes: AgentNode[];
  targetVol: number;
  maxPosition: number;
  varLimit: number;
  expectedSharpe: number;
  expectedReturn: number;
  color: string;
  originStrategy?: string;
  ideaBenefits?: string[];
}
