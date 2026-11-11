import React, { useState, useEffect } from 'react';
import { X, Play, RotateCw, Trophy, Volume2, VolumeX } from 'lucide-react';

interface GamePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: {
    title: string;
    provider: string;
    image: string;
    category: string;
  } | null;
  balance: number;
  onUpdateBalance: (delta: number) => void;
}

export const GamePlayerModal: React.FC<GamePlayerModalProps> = ({
  isOpen,
  onClose,
  game,
  balance,
  onUpdateBalance,
}) => {
  const [betAmount, setBetAmount] = useState<number>(2000);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const [crashMultiplier, setCrashMultiplier] = useState<number>(1.0);
  const [isCrashed, setIsCrashed] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && game?.category === 'Crash') {
      setIsCrashed(false);
      setCrashMultiplier(1.0);
      let mult = 1.0;
      timer = setInterval(() => {
        mult += 0.08 + Math.random() * 0.12;
        if (mult > 4.5 && Math.random() < 0.25) {
          setIsCrashed(true);
          clearInterval(timer);
        } else {
          setCrashMultiplier(parseFloat(mult.toFixed(2)));
        }
      }, 150);
    }
    return () => clearInterval(timer);
  }, [isOpen, game]);

  if (!isOpen || !game) return null;

  const handleSpin = () => {
    if (balance < betAmount) {
      alert(`Insufficient balance (${balance.toLocaleString()} USh) to place ${betAmount.toLocaleString()} USh bet.`);
      return;
    }

    setIsPlaying(true);
    setLastWin(null);
    onUpdateBalance(-betAmount);

    setTimeout(() => {
      // 60% win rate for fun interactive demo
      const isWinner = Math.random() > 0.4;
      if (isWinner) {
        const multipliers = [1.5, 2.0, 3.2, 5.0, 10.0];
        const chosen = multipliers[Math.floor(Math.random() * multipliers.length)];
        const won = Math.round(betAmount * chosen);
        setLastWin(won);
        onUpdateBalance(won);
      } else {
        setLastWin(0);
      }
      setIsPlaying(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[3600] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div
        className="relative w-full max-w-[540px] bg-[#0c2419] border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl text-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-[#06180f] px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00e676] animate-pulse" />
            <div>
              <h3 className="text-sm font-extrabold text-white leading-tight">{game.title}</h3>
              <p className="text-[10px] text-[#8aa396]">{game.provider} &bull; Certified RNG</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game Stage Area */}
        <div className="relative aspect-[16/10] w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden border-b border-white/10">
          <img
            src={game.image}
            alt={game.title}
            className={`absolute inset-0 w-full h-full object-cover opacity-35 filter blur-[1px] transition-transform duration-700 ${
              isPlaying ? 'scale-110' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c2419] via-transparent to-black/60" />

          {/* Interactive Dynamic Display */}
          <div className="relative z-10 flex flex-col items-center gap-3 p-4 text-center">
            {game.category === 'Crash' ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs uppercase font-extrabold text-[#8aa396] tracking-widest">
                  Live Aviator Altitude
                </span>
                <span
                  className={`text-5xl font-black tracking-tight tabular-nums ${
                    isCrashed ? 'text-red-500 line-through' : 'text-[#00e676]'
                  }`}
                >
                  {crashMultiplier.toFixed(2)}x
                </span>
                {isCrashed && (
                  <span className="text-xs font-bold text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-500/40">
                    Flew Away! Next round starting...
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2 sm:gap-3 p-3 bg-black/60 rounded-2xl border border-emerald-500/30 backdrop-blur-md">
                  {['🍒', '💎', '7️⃣', '🔔'].map((sym, idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-14 sm:w-16 sm:h-18 rounded-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 flex items-center justify-center text-2xl sm:text-3xl shadow-inner transition-transform ${
                        isPlaying ? 'animate-bounce' : ''
                      }`}
                    >
                      {isPlaying ? '🎰' : sym}
                    </div>
                  ))}
                </div>

                {lastWin !== null && lastWin > 0 && (
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/20 text-[#00e676] border border-emerald-500/50 text-sm font-extrabold animate-in zoom-in-95">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    BIG WIN! +{lastWin.toLocaleString()} USh
                  </div>
                )}
                {lastWin === 0 && !isPlaying && (
                  <span className="text-xs text-[#8aa396]">Better luck on the next spin!</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 bg-[#06180f] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div>
              <span className="text-[10px] text-[#8aa396] uppercase tracking-wider block">Balance</span>
              <span className="text-sm font-extrabold text-white">{balance.toLocaleString()} USh</span>
            </div>

            {/* Bet Stake selector */}
            <div className="flex items-center gap-1 bg-[#0c2419] p-1 rounded-xl border border-white/10">
              {[1000, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setBetAmount(amt)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                    betAmount === amt ? 'bg-[#00e676] text-[#041209]' : 'text-[#8aa396] hover:text-white'
                  }`}
                >
                  {amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSpin}
            disabled={isPlaying}
            className="w-full sm:w-auto px-6 h-11 bg-gradient-to-r from-[#00e676] to-[#00f5d4] text-[#041209] font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                Spinning...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Play &bull; {betAmount.toLocaleString()} USh
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
