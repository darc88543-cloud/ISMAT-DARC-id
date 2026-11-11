import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface QuickBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: {
    id: number;
    league: string;
    team1: string;
    team2: string;
  } | null;
  selection: {
    type: '1' | 'X' | '2';
    label: string;
    odd: number;
  } | null;
  currentBalance: number;
  onPlaceBet: (stake: number, potentialWin: number) => boolean;
}

export const QuickBetModal: React.FC<QuickBetModalProps> = ({
  isOpen,
  onClose,
  match,
  selection,
  currentBalance,
  onPlaceBet,
}) => {
  const [stake, setStake] = useState<number>(5000);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !match || !selection) return null;

  const potentialWin = Math.round(stake * selection.odd);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (stake < 500) {
      setErrorMsg('Minimum bet stake is 500 USh');
      return;
    }
    if (stake > currentBalance) {
      setErrorMsg(`Insufficient balance (${currentBalance.toLocaleString()} USh). Please deposit first.`);
      return;
    }

    const success = onPlaceBet(stake, potentialWin);
    if (success) {
      setSuccessMsg(`Bet placed successfully! Potential Win: ${potentialWin.toLocaleString()} USh`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1600);
    }
  };

  const presets = [1000, 2000, 5000, 10000, 20000];

  return (
    <div className="fixed inset-0 z-[3500] flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-[380px] bg-[#0c2419] border border-emerald-500/30 rounded-3xl p-5 shadow-2xl text-white flex flex-col gap-3.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00e676]">
              Bet Slip &bull; {match.league}
            </span>
            <h3 className="text-sm font-extrabold text-white">
              {match.team1} vs {match.team2}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selection Badge & Odds */}
        <div className="bg-[#06170f] p-3 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#8aa396]">Pick: <span className="font-bold text-white">{selection.label}</span></div>
            <div className="text-[11px] text-[#00e676] font-semibold">Selection: {selection.type === '1' ? match.team1 : selection.type === '2' ? match.team2 : 'Draw (X)'}</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#8aa396] block">Odds</span>
            <span className="text-lg font-black text-[#00e676]">{selection.odd.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-[#8aa396] mb-1.5 flex justify-between">
              <span>Stake (USh)</span>
              <span>Balance: <strong className="text-white">{currentBalance.toLocaleString()} USh</strong></span>
            </label>
            <input
              type="number"
              min="500"
              step="500"
              value={stake}
              onChange={(e) => setStake(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full h-11 bg-[#06170f] border border-emerald-500/25 rounded-xl px-3 font-bold text-white text-base focus:border-[#00e676] outline-none"
              placeholder="Enter stake"
              required
            />
          </div>

          {/* Stake Presets */}
          <div className="grid grid-cols-5 gap-1.5">
            {presets.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setStake(amt)}
                className={`py-1 text-[11px] font-bold rounded-lg border transition-all ${
                  stake === amt
                    ? 'bg-[#00e676] text-[#041209] border-[#00e676]'
                    : 'bg-white/5 border-white/10 text-[#d1e0d7] hover:bg-white/10'
                }`}
              >
                {amt >= 1000 ? `${amt / 1000}k` : amt}
              </button>
            ))}
          </div>

          {/* Potential Win Display */}
          <div className="bg-[#081e13] p-3 rounded-xl border border-emerald-500/20 flex items-center justify-between">
            <span className="text-xs text-[#8aa396]">Potential Return:</span>
            <span className="text-base font-black text-[#00e676]">
              {potentialWin.toLocaleString()} USh
            </span>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-950/70 border border-[#00e676]/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-[#00e676] to-[#00f5d4] text-[#041209] font-black rounded-xl text-sm shadow-lg shadow-emerald-500/25 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer mt-1"
          >
            Place Bet &bull; {stake.toLocaleString()} USh
          </button>
        </form>
      </div>
    </div>
  );
};
