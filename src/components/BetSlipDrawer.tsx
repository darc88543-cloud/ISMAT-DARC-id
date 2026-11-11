import React, { useState } from 'react';
import {
  Receipt,
  X,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Coins,
  Flame,
  ArrowRight
} from 'lucide-react';

export interface BetSelection {
  matchId: number;
  league: string;
  team1: string;
  team2: string;
  pickType: '1' | 'X' | '2';
  pickLabel: string;
  odd: number;
}

interface BetSlipDrawerProps {
  selections: BetSelection[];
  onRemoveSelection: (matchId: number) => void;
  onClearAll: () => void;
  balance: number;
  onPlaceBet: (totalStake: number, potentialReturn: number, isMulti: boolean, details: string) => boolean;
  onOpenDeposit: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const BetSlipDrawer: React.FC<BetSlipDrawerProps> = ({
  selections,
  onRemoveSelection,
  onClearAll,
  balance,
  onPlaceBet,
  onOpenDeposit,
  isOpen,
  onToggleOpen,
}) => {
  const [betMode, setBetMode] = useState<'accumulator' | 'single'>('accumulator');
  const [multiStake, setMultiStake] = useState<number>(5000);
  const [singleStakes, setSingleStakes] = useState<Record<number, number>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [placedBetSlip, setPlacedBetSlip] = useState<{
    id: string;
    selectionsCount: number;
    stake: number;
    potentialWin: number;
  } | null>(null);

  // If there are no selections and drawer was closed, don't show floating bar
  if (selections.length === 0 && !isOpen && !placedBetSlip) {
    return null;
  }

  // Calculate Accumulator Odds
  const totalMultiOdds = selections.reduce((acc, s) => acc * s.odd, 1);
  const formattedMultiOdds = parseFloat(totalMultiOdds.toFixed(2));

  // Multi Bet Acca Bonus calculation
  let accaBonusPercent = 0;
  if (selections.length === 2) accaBonusPercent = 3;
  else if (selections.length === 3) accaBonusPercent = 7;
  else if (selections.length === 4) accaBonusPercent = 12;
  else if (selections.length >= 5) accaBonusPercent = 20;

  const baseReturn = Math.round(multiStake * formattedMultiOdds);
  const bonusAmount = Math.round((baseReturn * accaBonusPercent) / 100);
  const totalMultiPotentialReturn = baseReturn + bonusAmount;

  // Single bets calculation
  const totalSingleStake = selections.reduce((acc, s) => {
    const sStake = singleStakes[s.matchId] !== undefined ? singleStakes[s.matchId] : 2000;
    return acc + sStake;
  }, 0);

  const totalSingleReturn = selections.reduce((acc, s) => {
    const sStake = singleStakes[s.matchId] !== undefined ? singleStakes[s.matchId] : 2000;
    return acc + Math.round(sStake * s.odd);
  }, 0);

  const activeTotalStake = betMode === 'accumulator' ? multiStake : totalSingleStake;
  const activePotentialReturn = betMode === 'accumulator' ? totalMultiPotentialReturn : totalSingleReturn;

  const handleSingleStakeChange = (matchId: number, val: number) => {
    setSingleStakes((prev) => ({
      ...prev,
      [matchId]: Math.max(0, val),
    }));
  };

  const handleApplyStakeToAllSingles = (amt: number) => {
    const updated: Record<number, number> = {};
    selections.forEach((s) => {
      updated[s.matchId] = amt;
    });
    setSingleStakes(updated);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (selections.length === 0) {
      setErrorMsg('Add at least one match to your bet slip.');
      return;
    }

    if (activeTotalStake < 500) {
      setErrorMsg('Minimum stake is 500 USh');
      return;
    }

    if (activeTotalStake > balance) {
      setErrorMsg(`Insufficient balance (${balance.toLocaleString()} USh). Please deposit to place this bet.`);
      return;
    }

    const summaryText =
      betMode === 'accumulator'
        ? `${selections.length}-Leg Combo (${formattedMultiOdds}x)`
        : `${selections.length} Singles`;

    const success = onPlaceBet(activeTotalStake, activePotentialReturn, betMode === 'accumulator', summaryText);
    if (success) {
      const generatedId = `APX-${Math.floor(100000 + Math.random() * 900000)}`;
      setPlacedBetSlip({
        id: generatedId,
        selectionsCount: selections.length,
        stake: activeTotalStake,
        potentialWin: activePotentialReturn,
      });
      onClearAll();
    }
  };

  const presets = [1000, 2000, 5000, 10000, 25000, 50000];

  return (
    <>
      {/* ============================================================== */}
      {/* 1. FLOATING MINIMIZED SLIDE-UP TRIGGER BAR                    */}
      {/* ============================================================== */}
      {!isOpen && selections.length > 0 && (
        <div className="fixed bottom-18 left-3 right-3 sm:left-auto sm:right-6 sm:w-[420px] z-[950] animate-in slide-in-from-bottom-5 duration-200">
          <div
            onClick={onToggleOpen}
            className="bg-[#0b271a] border border-[#00e676]/40 rounded-2xl p-3 shadow-2xl shadow-black/80 flex items-center justify-between cursor-pointer hover:border-[#00e676] active:scale-[0.99] transition-all backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#00e676] to-[#00b0ff] text-[#041209] flex items-center justify-center font-black shadow-md">
                <Receipt className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-black flex items-center justify-center border-2 border-[#0b271a]">
                  {selections.length}
                </span>
              </div>
              <div className="flex flex-col leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase text-white tracking-wide">
                    Bet Slip
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#00e676]/20 text-[#00e676]">
                    {selections.length === 1 ? '1 Selection' : `${selections.length} Multi Picks`}
                  </span>
                </div>
                <div className="text-[11px] text-[#8aa396] font-medium flex items-center gap-1">
                  Odds: <strong className="text-[#00e676] font-mono">{formattedMultiOdds}</strong> &bull; Win up to{' '}
                  <strong className="text-white">
                    {totalMultiPotentialReturn.toLocaleString()} USh
                  </strong>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleOpen();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#00e676] text-[#041209] font-black text-xs flex items-center gap-1 hover:brightness-105 active:scale-95 transition-all shadow-md shadow-emerald-500/25 shrink-0"
            >
              <span>View Slip</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. EXPANDED SLIDE-UP SHEET DRAWER                             */}
      {/* ============================================================== */}
      {isOpen && (
        <div
          onClick={onToggleOpen}
          className="fixed inset-0 z-[3200] bg-black/70 backdrop-blur-sm animate-in fade-in flex flex-col justify-end"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[500px] mx-auto bg-[#0c2419] border-t-2 border-emerald-500/40 rounded-t-3xl shadow-2xl text-white max-h-[86vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
          >
            {/* Grab Handle */}
            <div
              onClick={onToggleOpen}
              className="w-full pt-2.5 pb-1 flex justify-center cursor-pointer hover:opacity-80"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#00e676]/20 text-[#00e676] flex items-center justify-center font-black">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 leading-none">
                    Bet Slip
                    <span className="w-5 h-5 rounded-full bg-[#00e676] text-[#041209] text-[11px] font-black flex items-center justify-center">
                      {selections.length}
                    </span>
                  </h3>
                  <span className="text-[10px] text-[#8aa396]">
                    {selections.length === 0
                      ? 'No matches selected'
                      : selections.length === 1
                      ? 'Single Match'
                      : `${selections.length} Selections Accumulator`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {selections.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="p-1.5 rounded-lg text-xs text-[#8aa396] hover:text-red-400 hover:bg-white/5 flex items-center gap-1 transition-colors"
                    title="Clear All Selections"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">Clear</span>
                  </button>
                )}
                <button
                  onClick={onToggleOpen}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SUCCESS CELEBRATION MODAL INSET */}
            {placedBetSlip && (
              <div className="p-6 flex flex-col items-center text-center gap-3 animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-[#00e676] border-2 border-[#00e676] flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-widest text-[#00e676]">
                    Ticket Confirmed
                  </span>
                  <h4 className="text-lg font-black text-white">Bet Placed Successfully!</h4>
                  <p className="text-xs text-[#8aa396] mt-0.5">
                    Slip Reference: <strong className="text-white font-mono">{placedBetSlip.id}</strong>
                  </p>
                </div>

                <div className="w-full bg-[#06170f] p-3 rounded-2xl border border-white/10 flex justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#8aa396] block">Total Stake</span>
                    <strong className="text-white font-mono">{placedBetSlip.stake.toLocaleString()} USh</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8aa396] block">Selections</span>
                    <strong className="text-[#00e676]">{placedBetSlip.selectionsCount} Legs</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#8aa396] block">Potential Payout</span>
                    <strong className="text-[#00e676] font-mono text-sm">
                      {placedBetSlip.potentialWin.toLocaleString()} USh
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPlacedBetSlip(null);
                    onToggleOpen();
                  }}
                  className="w-full py-3 bg-[#00e676] text-[#041209] rounded-xl font-black text-xs hover:brightness-105 active:scale-95 transition-all shadow-md mt-2"
                >
                  Continue Betting
                </button>
              </div>
            )}

            {!placedBetSlip && (
              <>
                {/* Bet Mode Tabs (Accumulator vs Singles) */}
                {selections.length > 0 && (
                  <div className="px-4 pt-2.5 pb-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setBetMode('accumulator')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        betMode === 'accumulator'
                          ? 'bg-[#00e676] text-[#041209] font-black shadow-md'
                          : 'bg-[#06170f] text-[#8aa396] border border-white/5 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Accumulator (Combo)</span>
                      {selections.length > 1 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/20 font-black">
                          {formattedMultiOdds}x
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setBetMode('single')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        betMode === 'single'
                          ? 'bg-[#00e676] text-[#041209] font-black shadow-md'
                          : 'bg-[#06170f] text-[#8aa396] border border-white/5 hover:text-white'
                      }`}
                    >
                      <span>Singles ({selections.length})</span>
                    </button>
                  </div>
                )}

                {/* Acca Boost Banner if 2+ selections */}
                {betMode === 'accumulator' && selections.length >= 2 && (
                  <div className="mx-4 mt-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950 to-[#0e3b28] border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span>{selections.length}-Leg Acca Boost</span>
                    </div>
                    <span className="font-black text-[#00e676] bg-emerald-500/20 px-2 py-0.5 rounded text-[11px]">
                      +{accaBonusPercent}% Extra Cash
                    </span>
                  </div>
                )}

                {/* Selections Scroll List */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 no-scrollbar max-h-[35vh]">
                  {selections.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center text-[#8aa396]">
                      <Receipt className="w-10 h-10 mb-2 opacity-30" />
                      <p className="text-sm font-bold text-white">Your bet slip is empty</p>
                      <p className="text-xs max-w-xs mt-1">
                        Click on any match odds (1, X, 2) in the Sportsbook to start building your ticket.
                      </p>
                    </div>
                  ) : (
                    selections.map((s) => {
                      const currentSingleStake =
                        singleStakes[s.matchId] !== undefined ? singleStakes[s.matchId] : 2000;
                      return (
                        <div
                          key={s.matchId}
                          className="bg-[#06170f] border border-white/10 rounded-2xl p-3 flex flex-col gap-2 relative shadow-sm hover:border-emerald-500/30 transition-all"
                        >
                          {/* Match Header */}
                          <div className="flex items-start justify-between pr-6">
                            <div>
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                                {s.league}
                              </span>
                              <h4 className="text-xs font-black text-white leading-tight">
                                {s.team1} vs {s.team2}
                              </h4>
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => onRemoveSelection(s.matchId)}
                              className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/5 hover:bg-red-500/20 text-[#8aa396] hover:text-red-400 flex items-center justify-center transition-colors"
                              title="Remove selection"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Pick Tag & Odds */}
                          <div className="flex items-center justify-between pt-1 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded bg-emerald-500/20 text-[#00e676] font-black text-xs flex items-center justify-center">
                                {s.pickType}
                              </span>
                              <span className="text-xs font-bold text-[#d1e0d7]">{s.pickLabel}</span>
                            </div>

                            <span className="text-sm font-black text-[#00e676] font-mono tabular-nums">
                              {s.odd.toFixed(2)}
                            </span>
                          </div>

                          {/* Single Bet Stake Input when in Single mode */}
                          {betMode === 'single' && (
                            <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1 flex-1">
                                <span className="text-[11px] text-[#8aa396]">Stake:</span>
                                <input
                                  type="number"
                                  min="500"
                                  step="500"
                                  value={currentSingleStake}
                                  onChange={(e) =>
                                    handleSingleStakeChange(s.matchId, parseInt(e.target.value) || 0)
                                  }
                                  className="w-24 bg-[#0c2419] border border-white/15 rounded-lg px-2 py-1 text-xs font-bold text-white text-right outline-none focus:border-[#00e676]"
                                />
                                <span className="text-[10px] text-[#8aa396]">USh</span>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-[#8aa396] block">Returns</span>
                                <span className="text-xs font-bold text-[#00e676] font-mono">
                                  {Math.round(currentSingleStake * s.odd).toLocaleString()} USh
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Bottom Controls & Stake Inputs */}
                {selections.length > 0 && (
                  <form
                    onSubmit={handleFormSubmit}
                    className="p-4 bg-[#06180f] border-t border-white/10 flex flex-col gap-3"
                  >
                    {/* Multi Bet Stake input */}
                    {betMode === 'accumulator' && (
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-bold text-[#d1e0d7]">Accumulator Stake</label>
                          <div className="flex items-center gap-1 text-[11px] text-[#8aa396]">
                            <span>Bal:</span>
                            <strong className="text-white font-mono">{balance.toLocaleString()} USh</strong>
                            {balance < multiStake && (
                              <button
                                type="button"
                                onClick={onOpenDeposit}
                                className="text-[#00e676] font-bold underline ml-1 cursor-pointer"
                              >
                                Deposit
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="500"
                            step="500"
                            value={multiStake}
                            onChange={(e) => setMultiStake(Math.max(0, parseInt(e.target.value) || 0))}
                            placeholder="Enter stake amount"
                            className="flex-1 h-11 bg-[#0c2419] border border-emerald-500/30 rounded-xl px-3 font-mono font-bold text-sm text-white focus:border-[#00e676] outline-none"
                            required
                          />
                          <span className="text-xs font-black text-[#8aa396]">USh</span>
                        </div>

                        {/* Presets */}
                        <div className="grid grid-cols-6 gap-1.5">
                          {presets.map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setMultiStake(amt)}
                              className={`py-1 text-[11px] font-bold rounded-lg border transition-all ${
                                multiStake === amt
                                  ? 'bg-[#00e676] text-[#041209] border-[#00e676]'
                                  : 'bg-white/5 border-white/10 text-[#d1e0d7] hover:bg-white/10'
                              }`}
                            >
                              {amt >= 1000 ? `${amt / 1000}k` : amt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Single Bets quick preset buttons */}
                    {betMode === 'single' && (
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-[11px] text-[#8aa396]">Apply to all:</span>
                        <div className="flex gap-1.5">
                          {[1000, 2000, 5000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => handleApplyStakeToAllSingles(amt)}
                              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold text-white hover:bg-white/10"
                            >
                              {amt.toLocaleString()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Calculation Summary Bar */}
                    <div className="bg-[#0c2419] p-3 rounded-2xl border border-white/10 flex flex-col gap-1.5 text-xs">
                      <div className="flex justify-between items-center text-[#8aa396]">
                        <span>Total Odds:</span>
                        <span className="font-mono font-black text-white text-sm">
                          {betMode === 'accumulator' ? formattedMultiOdds : 'Individual'}
                        </span>
                      </div>

                      {betMode === 'accumulator' && accaBonusPercent > 0 && (
                        <div className="flex justify-between items-center text-emerald-400 text-[11px]">
                          <span>Acca Bonus (+{accaBonusPercent}%):</span>
                          <span className="font-mono font-bold">+{bonusAmount.toLocaleString()} USh</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-1 border-t border-white/5 text-sm font-extrabold">
                        <span className="text-[#d1e0d7]">Potential Payout:</span>
                        <span className="font-mono font-black text-lg text-[#00e676]">
                          {activePotentialReturn.toLocaleString()} USh
                        </span>
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="p-2.5 bg-red-950/70 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-[#00e676] via-[#00f5d4] to-[#00b0ff] text-[#041209] font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span>
                        Place {betMode === 'accumulator' ? 'Acca Bet' : 'Singles'} &bull;{' '}
                        {activeTotalStake.toLocaleString()} USh
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
