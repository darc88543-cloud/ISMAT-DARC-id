import React, { useState } from 'react';
import { AplexLogo } from './AplexLogo';
import {
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  Smartphone,
  ShieldCheck,
  Zap,
  Bell,
  Sparkles,
  ArrowRight,
  Laptop
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  onTriggerInstall: () => Promise<string>;
  simulatedStandalone: boolean;
  onToggleSimulatedStandalone: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  isIOS: detectedIOS,
  isAndroid: detectedAndroid,
  onTriggerInstall,
  simulatedStandalone,
  onToggleSimulatedStandalone,
}) => {
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'desktop'>(
    detectedIOS ? 'ios' : detectedAndroid ? 'android' : 'android'
  );
  const [installStatusMsg, setInstallStatusMsg] = useState<string | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setIsInstalling(true);
    setInstallStatusMsg(null);
    try {
      const outcome = await onTriggerInstall();
      if (outcome === 'accepted') {
        setInstallStatusMsg('APLEX has been successfully added to your home screen!');
      } else if (outcome === 'dismissed') {
        setInstallStatusMsg('Installation was dismissed. You can install anytime from the menu.');
      } else {
        // Manual prompt needed
        if (activeTab === 'ios') {
          setInstallStatusMsg('Follow the quick 3 steps below in Safari to add to your Home Screen.');
        } else {
          setInstallStatusMsg('Tap your browser menu (⋮) and select "Install app" or "Add to Home screen".');
        }
      }
    } catch {
      setInstallStatusMsg('Tap your browser menu (⋮) and choose "Add to Home screen".');
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-[460px] bg-[#0c2419] border border-emerald-500/25 rounded-3xl p-5 sm:p-6 shadow-2xl text-white max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-8">
          <AplexLogo size="lg" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight text-white">Download APLEX</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-[#00e676] border border-emerald-500/30">
                OFFICIAL APP
              </span>
            </div>
            <p className="text-xs text-[#8aa396]">
              Install the real app on your mobile home screen
            </p>
          </div>
        </div>

        {/* Home Screen App Icon Preview Tile */}
        <div className="bg-[#06170f] border border-emerald-500/20 rounded-2xl p-3.5 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-2xl bg-[#092b1b] border-2 border-[#00e676]/60 p-1 flex items-center justify-center shadow-lg shadow-emerald-950/60 shrink-0">
              <img
                src="/public/apple-touch-icon.png"
                alt="APLEX Icon"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  // Fallback to SVG if PNG is loading
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#00e676] flex items-center justify-center shadow">
                <CheckCircle2 className="w-3 h-3 text-[#041209]" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                APLEX
                <span className="text-[10px] font-semibold text-emerald-400">★ 4.9</span>
              </div>
              <div className="text-[11px] text-[#8aa396]">Sports & Live Casino</div>
              <div className="text-[10px] text-emerald-400/90 font-medium flex items-center gap-1 mt-0.5">
                <Zap className="w-3 h-3" /> Real Home Screen App • 0 MB Storage
              </div>
            </div>
          </div>

          {isInstalled && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-[#00e676] text-xs font-bold border border-emerald-500/30">
              Installed
            </span>
          )}
        </div>

        {/* Device Switcher Tabs */}
        <div className="flex p-1 bg-[#06170f] rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-[#00e676] text-[#041209] shadow-md font-extrabold'
                : 'text-[#8aa396] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Android / Chrome
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ios'
                ? 'bg-[#00e676] text-[#041209] shadow-md font-extrabold'
                : 'text-[#8aa396] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            iPhone / Safari
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'desktop'
                ? 'bg-[#00e676] text-[#041209] shadow-md font-extrabold'
                : 'text-[#8aa396] hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            Desktop / PC
          </button>
        </div>

        {/* Tab-Specific Guided Installation Instructions */}
        {activeTab === 'ios' && (
          <div className="bg-[#081e13] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-[#00e676]">
              <Sparkles className="w-3.5 h-3.5" />
              How to add APLEX on iPhone & iPad:
            </div>
            
            <div className="space-y-2.5 text-xs text-[#d1e0d7]">
              <div className="flex items-start gap-2.5 bg-black/25 p-2.5 rounded-xl border border-white/5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-[#00e676] font-extrabold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="flex-1">
                  Tap the <strong className="text-white">Share</strong> button in the bottom Safari toolbar.
                  <div className="inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-white/15 text-white text-[11px]">
                    <Share2 className="w-3 h-3" /> Share
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-black/25 p-2.5 rounded-xl border border-white/5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-[#00e676] font-extrabold flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="flex-1">
                  Scroll down the action list and select <strong className="text-white">"Add to Home Screen"</strong>.
                  <div className="inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-white/15 text-white text-[11px]">
                    <PlusSquare className="w-3 h-3" /> Add to Home Screen
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-black/25 p-2.5 rounded-xl border border-white/5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-[#00e676] font-extrabold flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="flex-1">
                  Tap <strong className="text-[#00e676]">"Add"</strong> in the top-right corner. The APLEX real app icon will immediately appear on your home screen!
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'android' && (
          <div className="bg-[#081e13] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
            <div className="text-xs font-bold text-[#00e676] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Direct Android 1-Click Install:
            </div>
            <p className="text-xs text-[#d1e0d7] leading-relaxed">
              Click the button below to prompt Android & Chrome to save the real APLEX app to your apps list and home screen.
            </p>

            {/* Direct Trigger Button */}
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="w-full h-12 bg-gradient-to-r from-[#00e676] to-[#00f5d4] text-[#041209] rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {isInstallable ? 'Install APLEX App Now' : 'Prompt Install to Home Screen'}
            </button>

            <div className="text-[11px] text-[#8aa396] border-t border-white/10 pt-2 flex items-center gap-2">
              <span className="font-semibold text-white">Alternative:</span> Tap Chrome menu (⋮) &bull; Select "Install app" or "Add to Home screen".
            </div>
          </div>
        )}

        {activeTab === 'desktop' && (
          <div className="bg-[#081e13] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
            <div className="text-xs font-bold text-[#00e676] uppercase tracking-wider flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5" />
              Install on PC / Mac:
            </div>
            <p className="text-xs text-[#d1e0d7] leading-relaxed">
              Install APLEX as a dedicated standalone desktop app with full keyboard shortcuts, smooth video streaming, and zero browser tab clutter.
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full h-12 bg-[#00e676] text-[#041209] rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#00c853] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Install APLEX Desktop App
            </button>
            <div className="text-[11px] text-[#8aa396] border-t border-white/10 pt-2">
              Or click the <strong>Install</strong> icon on the right side of your browser address bar.
            </div>
          </div>
        )}

        {/* Status Feedback Message */}
        {installStatusMsg && (
          <div className="p-3 bg-emerald-950/70 border border-[#00e676]/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
            <span>{installStatusMsg}</span>
          </div>
        )}

        {/* Feature Benefits Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-[#06170f] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00e676] shrink-0" />
            <span>Instant 1-Tap Access</span>
          </div>
          <div className="bg-[#06170f] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#00e676] shrink-0" />
            <span>Live Match Alerts</span>
          </div>
          <div className="bg-[#06170f] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00e676] shrink-0" />
            <span>Encrypted Banking</span>
          </div>
          <div className="bg-[#06170f] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
            <span>Zero Browser Bars</span>
          </div>
        </div>

        {/* Preview Sandbox Simulation Toggle */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <div className="text-[11px] text-[#8aa396]">
            Preview standalone app mode:
          </div>
          <button
            onClick={() => {
              onToggleSimulatedStandalone();
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/15 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {simulatedStandalone ? 'Exit App View' : 'Simulate App View'}
            <ArrowRight className="w-3 h-3 text-[#00e676]" />
          </button>
        </div>
      </div>
    </div>
  );
};
