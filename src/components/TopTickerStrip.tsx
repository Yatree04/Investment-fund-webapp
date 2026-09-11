import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface TopTickerStripProps {
  onSelectTicker?: (ticker: string) => void;
  onOpenMobileMenu?: () => void;
}

export const TopTickerStrip: React.FC<TopTickerStripProps> = ({
  onSelectTicker,
  onOpenMobileMenu,
}) => {
  const tickers = [
    { symbol: 'AAPL', change: '+1.09%', isUp: true, price: '198.42' },
    { symbol: 'MSFT', change: '+1.43%', isUp: true, price: '412.17' },
    { symbol: 'NVDA', change: '-2.33%', isUp: false, price: '134.76' },
    { symbol: 'GOOGL', change: '+0.91%', isUp: true, price: '185.30' },
    { symbol: 'GLD', change: '+0.21%', isUp: true, price: '228.94' },
    { symbol: 'TLT', change: '-1.06%', isUp: false, price: '88.12' },
  ];

  return (
    <div className="w-full bg-card border-b border-border px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs font-mono select-none overflow-x-auto no-scrollbar gap-4 shrink-0">
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        {/* Mobile menu trigger */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-1 rounded text-muted-foreground hover:text-foreground"
            aria-label="Open navigation"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}

        {/* Live status badge */}
        <div className="flex items-center gap-1.5 text-chart-4 font-bold shrink-0">
          <span className="w-2 h-2 rounded-full bg-chart-4 animate-pulse" />
          <span className="tracking-wide text-[11px]">LIVE</span>
        </div>

        {/* Ticker items matching screenshot */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          {tickers.map((t) => (
            <div
              key={t.symbol}
              onClick={() => onSelectTicker && onSelectTicker(t.symbol)}
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="font-semibold text-foreground">{t.symbol}</span>
              <span className={`text-[11px] font-medium ${t.isUp ? 'text-chart-4' : 'text-chart-5'}`}>
                {t.change}
              </span>
              <span className={`text-[11px] flex items-center ${t.isUp ? 'text-chart-4' : 'text-chart-5'}`}>
                {t.isUp ? '▲' : '▼'}{t.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Alert matching screenshot */}
      <div className="flex items-center gap-1.5 text-destructive dark:text-destructive font-medium text-[11px] shrink-0 truncate">
        <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />
        <span className="truncate">RISK ALERT: NVDA position exceeds +15% concentration bound</span>
      </div>
    </div>
  );
};
