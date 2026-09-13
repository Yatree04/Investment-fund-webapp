import { Fund, FundMandateLimits, Holding } from '../types';

export const DEFAULT_OCULUS_LIMITS: FundMandateLimits = {
  maxSinglePositionPct: 8.5,
  warningSinglePositionPct: 7.0,
  maxTop5HoldingsPct: 35.0,
  illiquidAssetsCapPct: 2.0,

  maxGrossExposurePct: 200.0,
  maxNetExposurePct: 150.0,
  minNetExposurePct: -20.0,
  maxLongShortRatio: 2.2,
  minCashBufferPct: 3.0,

  maxVar95Pct: 1.50,
  maxStressVar99Pct: 2.75,
  maxDrawdownStopLossPct: -6.0,
  hardHaltDrawdownPct: -8.5,
  targetAnnualReturnPct: 16.5,
  targetVolPct: 7.2,

  betaToleranceMin: -0.05,
  betaToleranceMax: 0.25,
  maxTrackingErrorPct: 3.5,

  sectorCaps: {
    technology: 35.0,
    financials: 25.0,
    healthcare: 20.0,
    consumer: 20.0,
    energy: 15.0,
    industrials: 15.0,
  },

  riskOfficerVetoMode: 'STRICT_HARD_VETO',
  secCollarTolerancePct: 1.5,
  darkPoolMaxPct: 40.0,
  advMaxSlicePct: 2.5,
  requirePmSignOffAboveM: 50.0,
  prohibitedAssetClasses: ['Unlisted Penny Equities', 'Uncollateralized Crypto Tokens'],
  prohibitedTickers: ['RIVN', 'AMC', 'GME'],
};

export const DEFAULT_COMPOSITE_LIMITS: FundMandateLimits = {
  maxSinglePositionPct: 4.5,
  warningSinglePositionPct: 3.5,
  maxTop5HoldingsPct: 20.0,
  illiquidAssetsCapPct: 1.0,

  maxGrossExposurePct: 260.0,
  maxNetExposurePct: 10.0,
  minNetExposurePct: -10.0,
  maxLongShortRatio: 1.15,
  minCashBufferPct: 5.0,

  maxVar95Pct: 0.95,
  maxStressVar99Pct: 1.80,
  maxDrawdownStopLossPct: -4.0,
  hardHaltDrawdownPct: -6.0,
  targetAnnualReturnPct: 18.0,
  targetVolPct: 4.8,

  betaToleranceMin: -0.05,
  betaToleranceMax: 0.05,
  maxTrackingErrorPct: 2.0,

  sectorCaps: {
    technology: 25.0,
    financials: 25.0,
    healthcare: 20.0,
    consumer: 20.0,
    energy: 15.0,
    industrials: 20.0,
  },

  riskOfficerVetoMode: 'AUTO_RESIZE_EXECUTE',
  secCollarTolerancePct: 1.0,
  darkPoolMaxPct: 60.0,
  advMaxSlicePct: 1.5,
  requirePmSignOffAboveM: 25.0,
  prohibitedAssetClasses: ['Illiquid Small-Cap Microflips'],
  prohibitedTickers: ['DWAC', 'SPCE'],
};

export const DEFAULT_VALENCE_LIMITS: FundMandateLimits = {
  maxSinglePositionPct: 10.0,
  warningSinglePositionPct: 8.5,
  maxTop5HoldingsPct: 42.0,
  illiquidAssetsCapPct: 3.0,

  maxGrossExposurePct: 180.0,
  maxNetExposurePct: 80.0,
  minNetExposurePct: 0.0,
  maxLongShortRatio: 2.5,
  minCashBufferPct: 4.0,

  maxVar95Pct: 2.30,
  maxStressVar99Pct: 3.90,
  maxDrawdownStopLossPct: -9.0,
  hardHaltDrawdownPct: -12.0,
  targetAnnualReturnPct: 25.0,
  targetVolPct: 12.0,

  betaToleranceMin: 0.20,
  betaToleranceMax: 0.65,
  maxTrackingErrorPct: 6.0,

  sectorCaps: {
    technology: 65.0,
    financials: 15.0,
    healthcare: 15.0,
    consumer: 15.0,
    energy: 10.0,
    industrials: 15.0,
  },

  riskOfficerVetoMode: 'ADVISORY_ESCALATE',
  secCollarTolerancePct: 2.0,
  darkPoolMaxPct: 35.0,
  advMaxSlicePct: 3.0,
  requirePmSignOffAboveM: 30.0,
  prohibitedAssetClasses: ['Non-Tech Legacy Distressed Debt'],
  prohibitedTickers: [],
};

export const STRATEGY_PRESETS = [
  {
    id: 'systematic-macro',
    name: 'Systematic Global Macro & Multi-Asset',
    benchmark: 'HFRI Macro (Total) Index',
    baseCurrency: 'USD',
    defaultAumM: 1500,
    description: 'Quantitative directional, carry, and volatility capture across global rates, equities, FX, and commodities.',
    limits: DEFAULT_OCULUS_LIMITS,
  },
  {
    id: 'stat-arb-neutral',
    name: 'Equity Market Neutral & Statistical Arbitrage',
    benchmark: 'HFRX Equity Market Neutral Index',
    baseCurrency: 'USD',
    defaultAumM: 1000,
    description: 'High-frequency cross-sectional mean reversion, liquidity provision, and idiosyncratic alpha extraction with beta neutralized to zero.',
    limits: DEFAULT_COMPOSITE_LIMITS,
  },
  {
    id: 'tech-quant-growth',
    name: 'Thematic AI & Technology Quantitative Long/Short',
    benchmark: 'Nasdaq 100 Total Return',
    baseCurrency: 'USD',
    defaultAumM: 800,
    description: 'Alternative data signals, GPU supply chain tracking, and patent graph mining for concentrated structural tech leaders.',
    limits: DEFAULT_VALENCE_LIMITS,
  },
  {
    id: 'vol-arbitrage',
    name: 'Global Volatility & Dispersion Arbitrage',
    benchmark: 'CBOE Eurekahedge Volatility Index',
    baseCurrency: 'USD',
    defaultAumM: 1200,
    description: 'Index vs single-stock implied correlation trading, variance swaps, and dynamic gamma scalping.',
    limits: {
      ...DEFAULT_OCULUS_LIMITS,
      maxGrossExposurePct: 280.0,
      maxNetExposurePct: 30.0,
      maxVar95Pct: 1.20,
    },
  },
];

export interface ComplianceCheckResult {
  ruleName: string;
  category: 'CONCENTRATION' | 'LEVERAGE' | 'RISK_VAR' | 'FACTOR_BETA' | 'SECTOR' | 'COMPLIANCE';
  status: 'PASS' | 'WARNING' | 'BREACH';
  currentValue: string;
  limitValue: string;
  details: string;
  mitigationRecommendation?: string;
}

export function evaluateFundCompliance(fund: Fund, limits: FundMandateLimits): ComplianceCheckResult[] {
  const results: ComplianceCheckResult[] = [];

  // 1. Single-Stock Max Concentration
  const highestPosition = fund.holdings && fund.holdings.length > 0
    ? [...fund.holdings].sort((a, b) => b.weightPct - a.weightPct)[0]
    : null;

  if (highestPosition) {
    if (highestPosition.weightPct > limits.maxSinglePositionPct) {
      results.push({
        ruleName: 'Single-Stock Max Concentration',
        category: 'CONCENTRATION',
        status: 'BREACH',
        currentValue: `${highestPosition.ticker}: ${highestPosition.weightPct.toFixed(1)}%`,
        limitValue: `Max ${limits.maxSinglePositionPct.toFixed(1)}%`,
        details: `${highestPosition.name} (${highestPosition.ticker}) exceeds hard concentration ceiling by ${(highestPosition.weightPct - limits.maxSinglePositionPct).toFixed(2)}%.`,
        mitigationRecommendation: `Aegis Risk Officer: Auto-trim ${highestPosition.ticker} by ${((highestPosition.weightPct - limits.maxSinglePositionPct) * fund.aumMillions / 100).toFixed(1)}M to restore compliance.`,
      });
    } else if (highestPosition.weightPct >= limits.warningSinglePositionPct) {
      results.push({
        ruleName: 'Single-Stock Concentration Warning',
        category: 'CONCENTRATION',
        status: 'WARNING',
        currentValue: `${highestPosition.ticker}: ${highestPosition.weightPct.toFixed(1)}%`,
        limitValue: `Warn ≥ ${limits.warningSinglePositionPct.toFixed(1)}%`,
        details: `${highestPosition.ticker} is within 150 bps of the hard ceiling limit.`,
        mitigationRecommendation: `Pre-trade gate: Freeze further buys in ${highestPosition.ticker}.`,
      });
    } else {
      results.push({
        ruleName: 'Single-Stock Concentration Cap',
        category: 'CONCENTRATION',
        status: 'PASS',
        currentValue: `Max: ${highestPosition.weightPct.toFixed(1)}% (${highestPosition.ticker})`,
        limitValue: `Cap: ${limits.maxSinglePositionPct.toFixed(1)}%`,
        details: 'All single-name positions are within allowable concentration parameters.',
      });
    }
  }

  // 2. Gross Exposure
  if (fund.grossExposurePct > limits.maxGrossExposurePct) {
    results.push({
      ruleName: 'Max Gross Exposure Limit',
      category: 'LEVERAGE',
      status: 'BREACH',
      currentValue: `${fund.grossExposurePct.toFixed(1)}%`,
      limitValue: `Max ${limits.maxGrossExposurePct.toFixed(1)}%`,
      details: `Fund leverage of ${fund.grossExposurePct.toFixed(1)}% exceeds the mandate maximum of ${limits.maxGrossExposurePct.toFixed(1)}%.`,
      mitigationRecommendation: 'Aegis Risk Officer: Scale down derivative overlays and gross long/short books by 10%.',
    });
  } else {
    results.push({
      ruleName: 'Gross Exposure Limit',
      category: 'LEVERAGE',
      status: 'PASS',
      currentValue: `${fund.grossExposurePct.toFixed(1)}%`,
      limitValue: `Max ${limits.maxGrossExposurePct.toFixed(1)}%`,
      details: `Gross exposure operates with ${(limits.maxGrossExposurePct - fund.grossExposurePct).toFixed(1)}% buffer.`,
    });
  }

  // 3. Net Exposure
  if (fund.netExposurePct > limits.maxNetExposurePct || fund.netExposurePct < limits.minNetExposurePct) {
    results.push({
      ruleName: 'Net Directional Exposure Bounds',
      category: 'LEVERAGE',
      status: 'BREACH',
      currentValue: `${fund.netExposurePct.toFixed(1)}%`,
      limitValue: `[${limits.minNetExposurePct}%, ${limits.maxNetExposurePct}%]`,
      details: `Net exposure of ${fund.netExposurePct.toFixed(1)}% breached designated band.`,
      mitigationRecommendation: 'Rebalance long-short book via index futures hedge overlay.',
    });
  } else {
    results.push({
      ruleName: 'Net Directional Exposure Bounds',
      category: 'LEVERAGE',
      status: 'PASS',
      currentValue: `${fund.netExposurePct.toFixed(1)}%`,
      limitValue: `[${limits.minNetExposurePct}%, ${limits.maxNetExposurePct}%]`,
      details: 'Net exposure comfortably centered within authorized mandate corridor.',
    });
  }

  // 4. Value-at-Risk (VaR 95% 1-Day)
  if (fund.var95Pct > limits.maxVar95Pct) {
    results.push({
      ruleName: 'Parametric 1-Day 95% VaR Cap',
      category: 'RISK_VAR',
      status: 'BREACH',
      currentValue: `${fund.var95Pct.toFixed(2)}%`,
      limitValue: `Max ${limits.maxVar95Pct.toFixed(2)}%`,
      details: `Daily 95% VaR of ${fund.var95Pct.toFixed(2)}% ($${((fund.var95Pct * fund.aumMillions) / 100).toFixed(1)}M) exceeds the ${limits.maxVar95Pct.toFixed(2)}% threshold.`,
      mitigationRecommendation: 'Macro Sentinel AI: Inject 2-year Treasury duration hedge or buy SPX put spreads.',
    });
  } else if (fund.var95Pct >= limits.maxVar95Pct * 0.9) {
    results.push({
      ruleName: 'Parametric 1-Day 95% VaR Cap',
      category: 'RISK_VAR',
      status: 'WARNING',
      currentValue: `${fund.var95Pct.toFixed(2)}%`,
      limitValue: `Max ${limits.maxVar95Pct.toFixed(2)}%`,
      details: `VaR is at 90%+ capacity of total risk budget.`,
      mitigationRecommendation: 'Tighten stop-losses and prevent new risk-expanding orders.',
    });
  } else {
    results.push({
      ruleName: 'Parametric 1-Day 95% VaR Cap',
      category: 'RISK_VAR',
      status: 'PASS',
      currentValue: `${fund.var95Pct.toFixed(2)}%`,
      limitValue: `Max ${limits.maxVar95Pct.toFixed(2)}%`,
      details: `VaR risk consumption is healthy (${((fund.var95Pct / limits.maxVar95Pct) * 100).toFixed(0)}% of limit).`,
    });
  }

  // 5. Barra Market Beta Tolerance
  if (fund.betaToSP500 < limits.betaToleranceMin || fund.betaToSP500 > limits.betaToleranceMax) {
    results.push({
      ruleName: 'Barra Factor Beta Corridor',
      category: 'FACTOR_BETA',
      status: 'BREACH',
      currentValue: `β = ${fund.betaToSP500.toFixed(2)}`,
      limitValue: `[${limits.betaToleranceMin.toFixed(2)}, ${limits.betaToleranceMax.toFixed(2)}]`,
      details: `Portfolio market beta of ${fund.betaToSP500.toFixed(2)} drifted outside the target corridor.`,
      mitigationRecommendation: 'FlowRouter AI: Execute E-mini S&P futures adjustment order.',
    });
  } else {
    results.push({
      ruleName: 'Barra Factor Beta Corridor',
      category: 'FACTOR_BETA',
      status: 'PASS',
      currentValue: `β = ${fund.betaToSP500.toFixed(2)}`,
      limitValue: `[${limits.betaToleranceMin.toFixed(2)}, ${limits.betaToleranceMax.toFixed(2)}]`,
      details: 'Beta is fully neutralized within authorized tracking boundaries.',
    });
  }

  // 6. Prohibited Tickers Check
  const prohibitedInHoldings = fund.holdings?.filter((h) =>
    limits.prohibitedTickers.map((t) => t.toUpperCase()).includes(h.ticker.toUpperCase())
  ) || [];

  if (prohibitedInHoldings.length > 0) {
    results.push({
      ruleName: 'Prohibited Securities & Sanctions List',
      category: 'COMPLIANCE',
      status: 'BREACH',
      currentValue: `${prohibitedInHoldings.map((h) => h.ticker).join(', ')} held`,
      limitValue: '0 Prohibited Positions',
      details: `RegLex Compliance AI flagged forbidden ticker(s): ${prohibitedInHoldings.map((h) => h.ticker).join(', ')}.`,
      mitigationRecommendation: 'Mandatory immediate liquidation order via SEC Rule 15c3-5 gatekeeper.',
    });
  } else {
    results.push({
      ruleName: 'Prohibited Securities & Sanctions List',
      category: 'COMPLIANCE',
      status: 'PASS',
      currentValue: '0 Blocked Positions',
      limitValue: 'Clean Slate',
      details: 'No sanctioned or manager-restricted tickers detected in portfolio.',
    });
  }

  return results;
}
