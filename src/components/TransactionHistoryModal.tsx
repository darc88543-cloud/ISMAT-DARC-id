import React, { useState } from 'react';
import {
  Receipt,
  X,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trophy,
  ArrowUpRight,
  Filter,
  Coins
} from 'lucide-react';

export type BetStatus = 'Active' | 'Won' | 'Lost' | 'Refunded';

export interface BetTransactionLeg {
  matchTitle: string;
  league: string;
  pick: string;
  odd: number;
}

export interface BetTransaction {
  id: string;
  date: string;
  type: 'Single' | 'Accumulator';
  status: BetStatus;
  stake: number;
  totalOdds: number;
  payout: number;
  legs: BetTransactionLeg[];
  cashoutAvailable?: number;
}

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: BetTransaction[];
  onCashout?: (transactionId: string, amount: number) => void;
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  transactions,
  onCashout,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | BetStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSlipId, setExpandedSlipId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesStatus = activeFilter === 'All' || tx.status === activeFilter;
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.legs.some(
        (leg) =>
          leg.matchTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          leg.league.toLowerCase().includes(searchQuery.toLowerCase()) ||
          leg.pick.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  // Calculate status counts
  const countAll = transactions.length;
  const countActive = transactions.filter((t) => t.status === 'Active').length;
  const countWon = transactions.filter((t) => t.status === 'Won').length;
  const countLost = transactions.filter((t) => t.status === 'Lost').length;
  const countRefunded = transactions.filter((t) => t.status === 'Refunded').length;

  // Financial summary metrics
  const totalWonPayout = transactions
    .filter((t) => t.status === 'Won')
    .reduce((sum, t) => sum + t.payout, 0);
  const totalStaked = transactions.reduce((sum, t) => sum + t.stake, 0);

  const getStatusBadge = (status: BetStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-cyan-500/15 text-[#00f5d4] border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
            Active
          </span>
        );
      case 'Won':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-[#00e676] border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Won
          </span>
        );
      case 'Lost':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            Lost
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <RotateCcw className="w-3 h-3" />
            Refunded
          </span>
        );
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedSlipId(expandedSlipId === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-[3600] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-[520px] bg-[#0c2419] border border-emerald-500/30 rounded-3xl shadow-2xl text-white max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#06180f] px-5 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00e676]/20 text-[#00e676] flex items-center justify-center font-black">
              <Receipt className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white leading-tight">Transaction History</h3>
              <p className="text-[11px] text-[#8aa396]">Betting tickets, settlements & payouts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Performance Strip */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-[#081e13] border-b border-white/5 text-center shrink-0">
          <div className="bg-[#06170f] p-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-[#8aa396] uppercase tracking-wider block">Total Staked</span>
            <span className="text-xs sm:text-sm font-black text-white font-mono">
              {totalStaked.toLocaleString()} USh
            </span>
          </div>
          <div className="bg-[#06170f] p-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-[#8aa396] uppercase tracking-wider block">Won Payouts</span>
            <span className="text-xs sm:text-sm font-black text-[#00e676] font-mono">
              {totalWonPayout.toLocaleString()} USh
            </span>
          </div>
          <div className="bg-[#06170f] p-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-[#8aa396] uppercase tracking-wider block">Win Ratio</span>
            <span className="text-xs sm:text-sm font-black text-amber-300 font-mono">
              {countAll > 0 ? Math.round((countWon / countAll) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Filter Navigation Bar (All, Active, Won, Lost, Refunded) */}
        <div className="p-3 bg-[#06180f] border-b border-white/10 flex flex-col gap-2 shrink-0">
          {/* Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {(
              [
                { label: 'All', count: countAll },
                { label: 'Active', count: countActive },
                { label: 'Won', count: countWon },
                { label: 'Lost', count: countLost },
                { label: 'Refunded', count: countRefunded },
              ] as const
            ).map((tab) => {
              const isSelected = activeFilter === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveFilter(tab.label)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#00e676] text-[#041209] font-black shadow-md shadow-emerald-500/20'
                      : 'bg-[#0c2419] text-[#8aa396] border border-white/5 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected
                        ? 'bg-black/20 text-[#041209]'
                        : tab.label === 'Active' && tab.count > 0
                        ? 'bg-[#00f5d4]/20 text-[#00f5d4]'
                        : 'bg-white/10 text-white/80'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 bg-[#0c2419] border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-[#00e676]">
            <Search className="w-3.5 h-3.5 text-[#8aa396]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID, team, or league..."
              className="bg-transparent border-none outline-none text-xs text-white placeholder:text-[#8aa396] flex-1"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[#8aa396] hover:text-white">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 no-scrollbar">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-[#8aa396]">
              <Filter className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm font-bold text-white">No {activeFilter} bets found</p>
              <p className="text-xs max-w-xs mt-1">
                {activeFilter === 'All'
                  ? 'You have not placed any bets yet. Browse the Sportsbook to get started!'
                  : `There are currently no tickets marked as '${activeFilter}'. Try another filter.`}
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isExpanded = expandedSlipId === tx.id;
              return (
                <div
                  key={tx.id}
                  className="bg-[#06170f] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-sm hover:border-[#00e676]/30 transition-all"
                >
                  {/* Card Top Row: ID, Date & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white font-mono tracking-wide">
                        {tx.id}
                      </span>
                      <span className="text-[10px] text-[#8aa396] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {tx.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-[#8aa396]">
                        {tx.type === 'Accumulator' ? `${tx.legs.length}-Leg Acca` : 'Single'}
                      </span>
                      {getStatusBadge(tx.status)}
                    </div>
                  </div>

                  {/* Summary Stake & Payout Row */}
                  <div className="bg-[#0c2419] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-[#8aa396] uppercase tracking-wider block">Stake</span>
                      <span className="font-mono font-bold text-white">
                        {tx.stake.toLocaleString()} USh
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] text-[#8aa396] uppercase tracking-wider block">Total Odds</span>
                      <span className="font-mono font-black text-amber-300">
                        {tx.totalOdds.toFixed(2)}x
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#8aa396] uppercase tracking-wider block">
                        {tx.status === 'Won'
                          ? 'Won Payout'
                          : tx.status === 'Lost'
                          ? 'Result'
                          : tx.status === 'Refunded'
                          ? 'Refunded Stake'
                          : 'Potential Win'}
                      </span>
                      <span
                        className={`font-mono font-black text-sm ${
                          tx.status === 'Won'
                            ? 'text-[#00e676]'
                            : tx.status === 'Lost'
                            ? 'text-red-400'
                            : tx.status === 'Refunded'
                            ? 'text-amber-300'
                            : 'text-[#00f5d4]'
                        }`}
                      >
                        {tx.status === 'Lost' ? '0 USh' : `${tx.payout.toLocaleString()} USh`}
                      </span>
                    </div>
                  </div>

                  {/* Expand / Collapse Match Legs Details */}
                  <div className="pt-1">
                    <button
                      onClick={() => toggleExpand(tx.id)}
                      className="w-full flex items-center justify-between text-[11px] font-bold text-[#8aa396] hover:text-white transition-colors py-1 cursor-pointer"
                    >
                      <span>
                        {isExpanded ? 'Hide Selection Legs' : `View ${tx.legs.length} Matches & Picks`}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-1.5 border-t border-white/5 pt-2 animate-in fade-in">
                        {tx.legs.map((leg, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-black/25 rounded-xl border border-white/5 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block">
                                {leg.league}
                              </span>
                              <span className="font-bold text-white">{leg.matchTitle}</span>
                              <div className="text-[11px] text-[#a9c9b7]">Pick: {leg.pick}</div>
                            </div>
                            <span className="font-mono font-black text-[#00e676] bg-emerald-500/10 px-2 py-1 rounded-lg">
                              {leg.odd.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Optional Cashout Action for Active Bets */}
                  {tx.status === 'Active' && tx.cashoutAvailable && onCashout && (
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <div className="text-[11px] text-[#8aa396]">
                        Early Cashout Available:
                      </div>
                      <button
                        onClick={() => onCashout(tx.id, tx.cashoutAvailable!)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs flex items-center gap-1 shadow hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Cashout {tx.cashoutAvailable.toLocaleString()} USh</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
