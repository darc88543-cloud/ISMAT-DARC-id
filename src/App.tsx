/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AplexLogo } from './components/AplexLogo';
import { InstallAppModal } from './components/InstallAppModal';
import { BetSlipDrawer, BetSelection } from './components/BetSlipDrawer';
import { GamePlayerModal } from './components/GamePlayerModal';
import { SupportChatModal } from './components/SupportChatModal';
import { TransactionHistoryModal, BetTransaction } from './components/TransactionHistoryModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import {
  Download,
  Wallet,
  Receipt,
  CircleDot,
  Menu,
  Headphones,
  User,
  ShieldCheck,
  Search,
  Eye,
  LogOut,
  Users,
  Coins,
  Flame,
  CheckCircle2,
  Sparkles,
  Play,
  X,
  ChevronDown,
  Edit3,
  Video,
  Activity,
  UserX,
  Lock
} from 'lucide-react';

// Registered Users Database Interface
interface AppUser {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  online: boolean;
  banned: boolean;
}

// Live Match Interface
interface LiveMatch {
  id: number;
  league: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  minute: number;
  odd1: number;
  oddX: number;
  odd2: number;
  videoUrl: string;
}

// Traffic Log Interface
interface TrafficLog {
  ip: string;
  user: string;
  action: string;
  time: string;
  flag: string;
}

export default function App() {
  // PWA Hook
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    install,
    simulatedStandalone,
    setSimulatedStandalone,
  } = usePWAInstall();

  // Navigation & View States
  const [mainView, setMainView] = useState<'sports' | 'casino'>('sports');
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<'users' | 'matches' | 'video' | 'traffic'>('users');

  // Modals
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState<boolean>(false);
  const [isForgotPassModalOpen, setIsForgotPassModalOpen] = useState<boolean>(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState<boolean>(false);
  const [isTransactionHistoryOpen, setIsTransactionHistoryOpen] = useState<boolean>(false);

  // Multi-Selection Bet Slip State
  const [betSelections, setBetSelections] = useState<BetSelection[]>([]);
  const [isBetSlipOpen, setIsBetSlipOpen] = useState<boolean>(false);

  // Transaction & Betting History State (Filtered: Active, Won, Lost, Refunded)
  const [betTransactions, setBetTransactions] = useState<BetTransaction[]>([
    {
      id: 'APX-982140',
      date: 'Today, 14:15',
      type: 'Accumulator',
      status: 'Active',
      stake: 15000,
      totalOdds: 5.64,
      payout: 84600,
      cashoutAvailable: 22400,
      legs: [
        { matchTitle: 'Arsenal vs Chelsea', league: 'Premier League', pick: '1 (Arsenal Win)', odd: 1.45 },
        { matchTitle: 'Real Madrid vs Barcelona', league: 'La Liga', pick: '1 (Real Madrid Win)', odd: 1.20 },
        { matchTitle: 'Bayern Munich vs Inter Milan', league: 'Champions League', pick: '1 (Bayern Win)', odd: 1.35 },
        { matchTitle: 'Vipers SC vs KCCA FC', league: 'Uganda Premier League', pick: '1 (Vipers Win)', odd: 1.95 },
      ],
    },
    {
      id: 'APX-974211',
      date: 'Yesterday, 21:30',
      type: 'Accumulator',
      status: 'Won',
      stake: 20000,
      totalOdds: 4.80,
      payout: 96000,
      legs: [
        { matchTitle: 'Manchester City vs Liverpool', league: 'Premier League', pick: 'X (Draw)', odd: 3.40 },
        { matchTitle: 'Juventus vs AC Milan', league: 'Serie A', pick: 'Under 2.5 Goals', odd: 1.41 },
      ],
    },
    {
      id: 'APX-961045',
      date: '09 Nov 2026, 17:00',
      type: 'Single',
      status: 'Won',
      stake: 50000,
      totalOdds: 1.85,
      payout: 92500,
      legs: [
        { matchTitle: 'Vipers SC vs SC Villa', league: 'Uganda Premier League', pick: '1 (Vipers SC Win)', odd: 1.85 },
      ],
    },
    {
      id: 'APX-953820',
      date: '08 Nov 2026, 20:45',
      type: 'Accumulator',
      status: 'Lost',
      stake: 10000,
      totalOdds: 14.20,
      payout: 0,
      legs: [
        { matchTitle: 'Chelsea vs Tottenham', league: 'Premier League', pick: '2 (Tottenham Win)', odd: 3.10 },
        { matchTitle: 'Dortmund vs Leipzig', league: 'Bundesliga', pick: '1 (Dortmund Win)', odd: 2.10 },
        { matchTitle: 'Marseille vs Lyon', league: 'Ligue 1', pick: '1 (Marseille Win)', odd: 2.18 },
      ],
    },
    {
      id: 'APX-948192',
      date: '07 Nov 2026, 16:00',
      type: 'Single',
      status: 'Lost',
      stake: 15000,
      totalOdds: 3.80,
      payout: 0,
      legs: [
        { matchTitle: 'Express FC vs KCCA FC', league: 'Uganda Premier League', pick: 'X (Draw)', odd: 3.80 },
      ],
    },
    {
      id: 'APX-934509',
      date: '05 Nov 2026, 19:00',
      type: 'Single',
      status: 'Refunded',
      stake: 25000,
      totalOdds: 2.10,
      payout: 25000,
      legs: [
        { matchTitle: 'Atletico Madrid vs Sevilla', league: 'La Liga', pick: 'Match Postponed (Weather) - Stake Refunded', odd: 1.00 },
      ],
    },
  ]);

  // Game Player Modal State
  const [activeGame, setActiveGame] = useState<{
    title: string;
    provider: string;
    image: string;
    category: string;
  } | null>(null);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [balance, setBalance] = useState<number>(0);

  // Signup Form State
  const [regMode, setRegMode] = useState<'default' | 'quick'>('default');
  const [signupName, setSignupName] = useState('');
  const [signupPhoneCode, setSignupPhoneCode] = useState('+256');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCurrency, setSignupCurrency] = useState('UGX');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptAge, setAcceptAge] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot Password State
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Deposit Form State
  const [depositMethod, setDepositMethod] = useState<'mtn' | 'airtel'>('mtn');
  const [depositPhone, setDepositPhone] = useState('770 123-456');
  const [depositAmount, setDepositAmount] = useState<number>(10000);

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000);
  const [withdrawSystem, setWithdrawSystem] = useState<'mtn' | 'airtel'>('mtn');
  const [withdrawAccount, setWithdrawAccount] = useState('0772 109283');

  // Casino Search & Filters
  const [casinoSearchQuery, setCasinoSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // In-Memory Users Database
  const [usersList, setUsersList] = useState<AppUser[]>([
    {
      id: 101,
      name: 'Kato Ivan',
      email: 'kato.ivan@gmail.com',
      password: 'Password123',
      phone: '+256 772 109283',
      country: '🇺🇬 UG',
      online: true,
      banned: false,
    },
    {
      id: 102,
      name: 'Mwesigwa Ronald',
      email: 'ronald.mwe@yahoo.com',
      password: 'Password123',
      phone: '+256 752 491029',
      country: '🇺🇬 UG',
      online: true,
      banned: false,
    },
    {
      id: 103,
      name: 'Sarah Nansubuga',
      email: 'sarah.n@gmail.com',
      password: 'Password123',
      phone: '+256 701 391024',
      country: '🇺🇬 UG',
      online: false,
      banned: false,
    },
  ]);

  // Live Matches State
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([
    {
      id: 1,
      league: 'Premier League',
      team1: 'Arsenal',
      team2: 'Chelsea',
      score1: 2,
      score2: 1,
      minute: 68,
      odd1: 1.45,
      oddX: 4.20,
      odd2: 6.80,
      videoUrl: '',
    },
    {
      id: 2,
      league: 'La Liga',
      team1: 'Real Madrid',
      team2: 'Barcelona',
      score1: 3,
      score2: 2,
      minute: 81,
      odd1: 1.20,
      oddX: 5.10,
      odd2: 11.0,
      videoUrl: '',
    },
    {
      id: 3,
      league: 'Premier League',
      team1: 'Manchester City',
      team2: 'Liverpool',
      score1: 1,
      score2: 1,
      minute: 34,
      odd1: 2.10,
      oddX: 3.40,
      odd2: 3.30,
      videoUrl: '',
    },
    {
      id: 4,
      league: 'Champions League',
      team1: 'Bayern Munich',
      team2: 'Inter Milan',
      score1: 2,
      score2: 0,
      minute: 52,
      odd1: 1.35,
      oddX: 5.00,
      odd2: 8.50,
      videoUrl: '',
    },
    {
      id: 5,
      league: 'Uganda Premier League',
      team1: 'Vipers SC',
      team2: 'KCCA FC',
      score1: 1,
      score2: 0,
      minute: 63,
      odd1: 1.95,
      oddX: 3.10,
      odd2: 3.80,
      videoUrl: '',
    },
    {
      id: 6,
      league: 'Serie A',
      team1: 'Juventus',
      team2: 'AC Milan',
      score1: 0,
      score2: 0,
      minute: 19,
      odd1: 2.25,
      oddX: 3.20,
      odd2: 3.10,
      videoUrl: '',
    },
  ]);

  // New Video Match Form State
  const [newMatchLeague, setNewMatchLeague] = useState('');
  const [newMatchTeams, setNewMatchTeams] = useState('');
  const [newMatchVideoUrl, setNewMatchVideoUrl] = useState('');
  const [newOdd1, setNewOdd1] = useState(1.85);
  const [newOddX, setNewOddX] = useState(3.40);
  const [newOdd2, setNewOdd2] = useState(4.20);

  // Live Traffic & Activity Log
  const [trafficLogs, setTrafficLogs] = useState<TrafficLog[]>([
    {
      ip: '102.134.12.9',
      user: 'Kato Ivan',
      action: 'Placed 20,000 USh bet on Arsenal',
      time: 'Just now',
      flag: '🇺🇬',
    },
    {
      ip: '197.239.4.11',
      user: 'Mwesigwa Ronald',
      action: 'Deposited 50,000 USh (MTN MoMo)',
      time: '1 min ago',
      flag: '🇺🇬',
    },
    {
      ip: '41.210.145.2',
      user: 'Guest_849',
      action: 'Browsing Sweet Bonanza 1000',
      time: '3 mins ago',
      flag: '🇺🇬',
    },
  ]);

  // Casino Games Catalogue
  const casinoGames = [
    {
      id: 'g1',
      title: 'Sweet Bonanza 1000',
      provider: 'Pragmatic Play',
      category: 'Slots',
      image: '/src/assets/images/casino_slots_banner_1794425603550.jpg',
    },
    {
      id: 'g2',
      title: 'Gates of Olympus 1000',
      provider: 'Pragmatic Play',
      category: 'Slots',
      image: '/src/assets/images/casino_game_olympus_1794425604054.jpg',
    },
    {
      id: 'g3',
      title: 'Aviator Crash',
      provider: 'Spribe (Aviator)',
      category: 'Crash',
      image: '/src/assets/images/aplex_hero_banner_1794425602980.jpg',
    },
    {
      id: 'g4',
      title: 'Sugar Rush 1000',
      provider: 'Pragmatic Play',
      category: 'Slots',
      image: '/src/assets/images/casino_slots_banner_1794425603550.jpg',
    },
    {
      id: 'g5',
      title: 'Narcos Video Slot',
      provider: 'NetEnt',
      category: 'Slots',
      image: '/src/assets/images/sports_soccer_action_1794425605353.jpg',
    },
    {
      id: 'g6',
      title: 'Aztec Gold Megaways',
      provider: 'Novomatic',
      category: 'Jackpot',
      image: '/src/assets/images/casino_game_olympus_1794425604054.jpg',
    },
    {
      id: 'g7',
      title: 'Space Wars',
      provider: 'NetEnt',
      category: 'Slots',
      image: '/src/assets/images/casino_slots_banner_1794425603550.jpg',
    },
    {
      id: 'g8',
      title: 'Book of Ra Deluxe',
      provider: 'Novomatic',
      category: 'Slots',
      image: '/src/assets/images/casino_game_olympus_1794425604054.jpg',
    },
  ];

  // ==========================================
  // AUTHENTICATION LOGIC (STRICT EMAIL ONLY)
  // ==========================================

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = signupEmail.trim().toLowerCase();
    const name = signupName.trim() || 'User_' + Math.floor(Math.random() * 1000);
    const phone = `${signupPhoneCode} ${signupPhone.trim() || '700 000000'}`;
    const password = signupPassword || '123456';

    // 1. Strict Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address (e.g. user@gmail.com). Only emails are permitted!');
      return;
    }

    // 2. Prevent duplicate signups
    const alreadyRegistered = usersList.some((u) => u.email.toLowerCase() === email);
    if (alreadyRegistered) {
      alert('This email is already registered! Please log in, or click "Forgot your password?" if you lost access.');
      setIsSignupModalOpen(false);
      setIsLoginModalOpen(true);
      return;
    }

    // 3. Register user
    const newUser: AppUser = {
      id: usersList.length + 101,
      name,
      email,
      password,
      phone,
      country: '🇺🇬 UG',
      online: true,
      banned: false,
    };

    setUsersList((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsSignupModalOpen(false);
    alert(`Registration Successful! Welcome to APLEX, ${name}!`);

    // Add to activity log
    setTrafficLogs((prev) => [
      {
        ip: '102.134.' + Math.floor(Math.random() * 250) + '.1',
        user: name,
        action: 'New account registered on APLEX',
        time: 'Just now',
        flag: '🇺🇬',
      },
      ...prev,
    ]);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.trim().toLowerCase();
    const pass = loginPassword;

    // 1. Check for Admin Credentials
    if (email === 'darc88543@gmail.com' && pass === 'Darcid@123') {
      setIsLoginModalOpen(false);
      setIsAdminView(true);
      return;
    }

    // 2. Check in registered users list
    const foundUser = usersList.find((u) => u.email.toLowerCase() === email);
    if (!foundUser) {
      alert('No account found with this email! Please check spelling or Sign Up.');
      return;
    }

    if (foundUser.banned) {
      alert('Your account has been suspended by APLEX Administration. Please contact VIP support.');
      return;
    }

    if (foundUser.password !== pass) {
      alert('Incorrect password! If you forgot it, click "Forgot your password?" to verify via Gmail.');
      return;
    }

    // Login successful
    foundUser.online = true;
    setCurrentUser(foundUser);
    setIsLoginModalOpen(false);

    setTrafficLogs((prev) => [
      {
        ip: '197.239.' + Math.floor(Math.random() * 250) + '.4',
        user: foundUser.name,
        action: 'User signed in to APLEX',
        time: 'Just now',
        flag: '🇺🇬',
      },
      ...prev,
    ]);
  };

  // Forgot password flow
  const handleSendGmailCode = (e: React.FormEvent) => {
    e.preventDefault();
    const email = forgotEmail.trim().toLowerCase();
    const exists = usersList.some((u) => u.email.toLowerCase() === email) || email === 'darc88543@gmail.com';
    if (!exists) {
      alert('This email is not registered in our system. Please sign up first.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    alert(
      `[Gmail App Notification - APLEX Security]\nA verification code has been sent to your Gmail inbox:\n\nVerification Code: ${code}\n\nEnter this code on the screen to reset your password.`
    );
    setForgotStep(2);
  };

  const handleVerifyAndResetPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode !== verificationCode) {
      alert('Invalid verification code! Please check your Gmail app and enter the exact 6 digits.');
      return;
    }
    if (newPassword.length < 5) {
      alert('Password must be at least 5 characters long.');
      return;
    }

    setUsersList((prev) =>
      prev.map((u) => (u.email.toLowerCase() === forgotEmail.toLowerCase() ? { ...u, password: newPassword } : u))
    );

    alert('Password reset successfully! You can now log in with your new password.');
    setIsForgotPassModalOpen(false);
    setIsLoginModalOpen(true);
    setLoginEmail(forgotEmail);
  };

  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setIsProfileDrawerOpen(false);
  };

  // Deposit Logic
  const handleProcessDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const brand = depositMethod === 'mtn' ? 'MTN MoMo' : 'Airtel Money';
    alert(
      `[${brand} Prompt Sent]\nEnter your PIN on phone +256 ${depositPhone} to complete deposit of ${depositAmount.toLocaleString()} USh.`
    );
    setBalance((prev) => prev + depositAmount);
    setIsDepositModalOpen(false);

    setTrafficLogs((prev) => [
      {
        ip: '41.210.' + Math.floor(Math.random() * 250) + '.2',
        user: currentUser?.name || 'Guest User',
        action: `Deposited ${depositAmount.toLocaleString()} USh (${brand})`,
        time: 'Just now',
        flag: '🇺🇬',
      },
      ...prev,
    ]);
  };

  // Withdrawal Logic
  const handleProcessWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > balance) {
      alert(`Insufficient balance! Your current balance is ${balance.toLocaleString()} USh.`);
      return;
    }
    setBalance((prev) => prev - withdrawAmount);
    alert(
      `Withdrawal request of ${withdrawAmount.toLocaleString()} USh via ${withdrawSystem.toUpperCase()} (Account: ${withdrawAccount}) submitted successfully!`
    );
    setIsWithdrawModalOpen(false);
  };

  // Multi-Selection Bet Slip Handlers
  const handleToggleOddsSelection = (
    match: LiveMatch,
    pickType: '1' | 'X' | '2',
    pickLabel: string,
    odd: number
  ) => {
    setBetSelections((prev) => {
      const existingIdx = prev.findIndex((s) => s.matchId === match.id);
      if (existingIdx > -1) {
        const existing = prev[existingIdx];
        if (existing.pickType === pickType) {
          // Deselect if clicking the same pick
          return prev.filter((_, idx) => idx !== existingIdx);
        }
        // Switch pick on same match
        const copy = [...prev];
        copy[existingIdx] = {
          matchId: match.id,
          league: match.league,
          team1: match.team1,
          team2: match.team2,
          pickType,
          pickLabel,
          odd,
        };
        return copy;
      } else {
        // Add new selection
        return [
          ...prev,
          {
            matchId: match.id,
            league: match.league,
            team1: match.team1,
            team2: match.team2,
            pickType,
            pickLabel,
            odd,
          },
        ];
      }
    });
  };

  const handleRemoveSelection = (matchId: number) => {
    setBetSelections((prev) => prev.filter((s) => s.matchId !== matchId));
  };

  const handleClearAllSelections = () => {
    setBetSelections([]);
  };

  const handlePlaceMultiBet = (
    totalStake: number,
    potentialReturn: number,
    isMulti: boolean,
    details: string
  ): boolean => {
    if (balance < totalStake) {
      return false;
    }
    setBalance((prev) => prev - totalStake);

    // Create and save new BetTransaction record
    const newTxId = `APX-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newTx: BetTransaction = {
      id: newTxId,
      date: `Today, ${nowTime}`,
      type: isMulti ? 'Accumulator' : 'Single',
      status: 'Active',
      stake: totalStake,
      totalOdds: parseFloat((potentialReturn / totalStake).toFixed(2)),
      payout: potentialReturn,
      cashoutAvailable: Math.round(totalStake * 0.95),
      legs: betSelections.map((s) => ({
        matchTitle: `${s.team1} vs ${s.team2}`,
        league: s.league,
        pick: `${s.pickType} (${s.pickLabel})`,
        odd: s.odd,
      })),
    };
    setBetTransactions((prev) => [newTx, ...prev]);

    setTrafficLogs((prev) => [
      {
        ip: '102.134.12.9',
        user: currentUser?.name || 'Kato Ivan',
        action: `Placed ${totalStake.toLocaleString()} USh ${details} (Ticket #${newTxId})`,
        time: 'Just now',
        flag: '🇺🇬',
      },
      ...prev,
    ]);
    return true;
  };

  const handleCashout = (transactionId: string, cashoutAmount: number) => {
    setBalance((prev) => prev + cashoutAmount);
    setBetTransactions((prev) =>
      prev.map((tx) =>
        tx.id === transactionId
          ? {
              ...tx,
              status: 'Won',
              payout: cashoutAmount,
              cashoutAvailable: undefined,
            }
          : tx
      )
    );
    setTrafficLogs((prev) => [
      {
        ip: '102.134.12.9',
        user: currentUser?.name || 'Kato Ivan',
        action: `Cashed out ticket ${transactionId} early for ${cashoutAmount.toLocaleString()} USh`,
        time: 'Just now',
        flag: '🇺🇬',
      },
      ...prev,
    ]);
    alert(`Cashout Successful! ${cashoutAmount.toLocaleString()} USh has been credited to your balance.`);
  };

  // Admin Controls
  const toggleBanUser = (id: number) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = !u.banned;
          alert(`User ${u.name} has been ${updated ? 'BANNED' : 'UNBANNED'}.`);
          return { ...u, banned: updated };
        }
        return u;
      })
    );
  };

  const updateMatchScore = (id: number, team: 1 | 2, val: number) => {
    setLiveMatches((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return team === 1 ? { ...m, score1: val } : { ...m, score2: val };
        }
        return m;
      })
    );
  };

  const updateMatchOdd = (id: number, key: 'odd1' | 'oddX' | 'odd2', val: number) => {
    setLiveMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [key]: val } : m))
    );
  };

  const submitNewVideoMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const teams = newMatchTeams.split('vs');
    const newMatch: LiveMatch = {
      id: liveMatches.length + 1,
      league: newMatchLeague || 'Uganda Premier League',
      team1: teams[0] ? teams[0].trim() : 'Team 1',
      team2: teams[1] ? teams[1].trim() : 'Team 2',
      score1: 0,
      score2: 0,
      minute: 1,
      odd1: newOdd1,
      oddX: newOddX,
      odd2: newOdd2,
      videoUrl: newMatchVideoUrl,
    };

    setLiveMatches((prev) => [newMatch, ...prev]);
    alert('Video Match added and live broadcast embedded on APLEX Sportsbook!');
    setAdminTab('matches');
  };

  // Filtered Casino Games
  const filteredCasinoGames = casinoGames.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(casinoSearchQuery.toLowerCase()) ||
      g.provider.toLowerCase().includes(casinoSearchQuery.toLowerCase());
    const matchesProvider = selectedProvider === 'All' || g.provider.toLowerCase().includes(selectedProvider.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    return matchesSearch && matchesProvider && matchesCategory;
  });

  return (
    <div className={`min-h-screen bg-[#06180f] text-white flex flex-col font-sans ${simulatedStandalone ? 'ring-8 ring-emerald-500/20 max-w-[430px] mx-auto shadow-2xl my-2 rounded-[40px] overflow-hidden' : ''}`}>
      {/* ============================================================== */}
      {/* 1. TOP HEADER                                                  */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-[100] bg-[#06180f]/95 backdrop-blur-md border-b border-white/10 px-3.5 sm:px-5 h-15 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setMainView('sports');
            setIsAdminView(false);
          }}
          className="cursor-pointer"
        >
          <AplexLogo size="md" subtext="SPORTS & CASINO" />
        </div>

        {/* Center / Quick Install CTA */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-[#00e676] border border-emerald-500/30 hover:bg-emerald-500/25 transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install Real App on Home Screen</span>
          </button>
        </div>

        {/* Right Header Navigation */}
        <div className="flex items-center gap-2.5">
          {/* Mobile Direct Download Icon */}
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="sm:hidden w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#00e676] active:scale-95 transition-transform"
            title="Download App to Home Screen"
          >
            <Download className="w-4 h-4" />
          </button>

          {!currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3 py-1.5 text-xs font-bold text-white hover:text-[#00e676] transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => setIsSignupModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#00e676] text-[#041209] font-black text-xs hover:brightness-105 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsTransactionHistoryOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#d1e0d7] hover:text-[#00e676] hover:border-[#00e676]/30 transition-all cursor-pointer"
                title="View Bet Transaction History"
              >
                <Receipt className="w-3.5 h-3.5 text-[#00e676]" />
                <span>My Bets ({betTransactions.length})</span>
              </button>
              <div
                onClick={() => setIsDepositModalOpen(true)}
                className="flex flex-col items-end leading-tight cursor-pointer hover:opacity-90"
              >
                <span className="text-[9px] uppercase tracking-wider text-[#8aa396]">Balance</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#00e676]">
                  {balance.toLocaleString()} USh
                </span>
              </div>
              <div
                onClick={() => setIsProfileDrawerOpen(true)}
                className="flex items-center gap-1.5 p-1 pr-2 bg-black/40 border border-white/10 rounded-full cursor-pointer hover:border-[#00e676]/40 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#184431] text-[#bbf7d0] flex items-center justify-center text-xs font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
                <Menu className="w-4 h-4 text-[#8aa396]" />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MAIN CONTAINER                                              */}
      {/* ============================================================== */}
      <main className="flex-1 max-w-[540px] w-full mx-auto px-3 sm:px-4 py-3 flex flex-col gap-4 pb-24">
        {/* ============================================================== */}
        {/* VIEW A: SPORTSBOOK                                             */}
        {/* ============================================================== */}
        {mainView === 'sports' && (
          <div className="flex flex-col gap-3.5 animate-in fade-in duration-150">
            {/* Promo Banner with Real Home Screen Download CTA */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a3824] via-[#062417] to-[#04140b] border border-[#00e676]/30 p-4 shadow-xl">
              <img
                src="/src/assets/images/aplex_hero_banner_1794425602980.jpg"
                alt="APLEX Stadium"
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-[0.5px]"
              />
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="max-w-[65%]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#00e676]/20 text-[#00e676] border border-[#00e676]/30 mb-1">
                    <Sparkles className="w-3 h-3" /> OFFICIAL APLEX APP
                  </span>
                  <h2 className="text-lg sm:text-xl font-black uppercase text-white leading-tight">
                    Add to Home Screen
                  </h2>
                  <p className="text-[11px] text-[#b0cfbe] mt-0.5 leading-snug">
                    Get faster live odds, 1-tap launch, and instant betting without browser bars.
                  </p>
                </div>

                <button
                  onClick={() => setIsInstallModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#00e676] text-[#041209] font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Install App
                </button>
              </div>
            </div>

            {/* Sport Categories Horizontal Pills */}
            <div className="bg-gradient-to-r from-[#10422d] to-[#176646] rounded-2xl p-3 border border-white/5 flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#00e676]" /> Matches
                </span>
                <span className="text-[11px] font-extrabold text-[#00e676] uppercase tracking-wider">
                  LIVE Sport
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['⚽ Football', '🎾 Tennis', '🏀 Basketball', '🏒 Hockey', '🏉 Rugby', '⚾ Baseball'].map((sp, idx) => (
                  <button
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-semibold text-white whitespace-nowrap hover:bg-[#00e676]/20 hover:border-[#00e676]/40 transition-colors"
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Matches Section */}
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 live-pulse" />
                Live Matches Now
              </span>
              <span className="text-xs text-[#00e676] font-bold cursor-pointer">
                All ({liveMatches.length})
              </span>
            </div>

            {/* Live Matches Cards */}
            <div className="flex flex-col gap-2.5">
              {liveMatches.map((m) => {
                const isSelected1 = betSelections.some((s) => s.matchId === m.id && s.pickType === '1');
                const isSelectedX = betSelections.some((s) => s.matchId === m.id && s.pickType === 'X');
                const isSelected2 = betSelections.some((s) => s.matchId === m.id && s.pickType === '2');

                return (
                  <div
                    key={m.id}
                    className="bg-[#0e2d1f] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-2.5 hover:border-[#00e676]/30 transition-all shadow-md"
                  >
                    {/* Match Header */}
                    <div className="flex justify-between items-center text-[11px] text-[#8aa396]">
                      <span className="font-semibold text-emerald-300">{m.league} &bull; 2nd Half</span>
                      <div className="flex items-center gap-1.5 text-red-400 font-extrabold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" />
                        {m.minute}'
                      </div>
                    </div>

                    {/* Teams & Scores */}
                    <div className="flex flex-col gap-1 text-sm font-bold">
                      <div className="flex justify-between items-center">
                        <span className="text-white">{m.team1}</span>
                        <span className="text-[#00e676] text-base font-black">{m.score1}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">{m.team2}</span>
                        <span className="text-[#00e676] text-base font-black">{m.score2}</span>
                      </div>
                    </div>

                    {/* Embedded Live Video if URL exists */}
                    {m.videoUrl && (
                      <div className="w-full rounded-xl overflow-hidden my-1 border border-white/10 shadow">
                        <iframe
                          src={m.videoUrl}
                          title={`${m.team1} vs ${m.team2}`}
                          className="w-full h-40 border-none"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {/* Odds Buttons (1, X, 2) - Click toggles Bet Slip Selection */}
                    <div className="grid grid-cols-3 gap-2 mt-0.5">
                      <button
                        onClick={() => handleToggleOddsSelection(m, '1', `${m.team1} Win`, m.odd1)}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                          isSelected1
                            ? 'bg-[#00e676] text-[#041209] font-black border border-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.45)] scale-[1.02]'
                            : 'bg-black/40 border border-white/10 hover:border-[#00e676] hover:bg-[#00e676]/15 group'
                        }`}
                      >
                        <span className={`text-[10px] ${isSelected1 ? 'text-[#041209] font-bold' : 'text-[#8aa396] group-hover:text-emerald-300'}`}>
                          1 {isSelected1 ? '✓' : ''}
                        </span>
                        <span className={`text-xs sm:text-sm font-black ${isSelected1 ? 'text-[#041209]' : 'text-white group-hover:text-[#00e676]'}`}>
                          {m.odd1.toFixed(2)}
                        </span>
                      </button>

                      <button
                        onClick={() => handleToggleOddsSelection(m, 'X', 'Draw', m.oddX)}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                          isSelectedX
                            ? 'bg-[#00e676] text-[#041209] font-black border border-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.45)] scale-[1.02]'
                            : 'bg-black/40 border border-white/10 hover:border-[#00e676] hover:bg-[#00e676]/15 group'
                        }`}
                      >
                        <span className={`text-[10px] ${isSelectedX ? 'text-[#041209] font-bold' : 'text-[#8aa396] group-hover:text-emerald-300'}`}>
                          X {isSelectedX ? '✓' : ''}
                        </span>
                        <span className={`text-xs sm:text-sm font-black ${isSelectedX ? 'text-[#041209]' : 'text-white group-hover:text-[#00e676]'}`}>
                          {m.oddX.toFixed(2)}
                        </span>
                      </button>

                      <button
                        onClick={() => handleToggleOddsSelection(m, '2', `${m.team2} Win`, m.odd2)}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                          isSelected2
                            ? 'bg-[#00e676] text-[#041209] font-black border border-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.45)] scale-[1.02]'
                            : 'bg-black/40 border border-white/10 hover:border-[#00e676] hover:bg-[#00e676]/15 group'
                        }`}
                      >
                        <span className={`text-[10px] ${isSelected2 ? 'text-[#041209] font-bold' : 'text-[#8aa396] group-hover:text-emerald-300'}`}>
                          2 {isSelected2 ? '✓' : ''}
                        </span>
                        <span className={`text-xs sm:text-sm font-black ${isSelected2 ? 'text-[#041209]' : 'text-white group-hover:text-[#00e676]'}`}>
                          {m.odd2.toFixed(2)}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Casino Banner Hub Card */}
            <div
              onClick={() => setMainView('casino')}
              className="bg-gradient-to-r from-[#0e3b28] to-[#155d3e] rounded-2xl p-4 border border-white/10 flex flex-col gap-2.5 cursor-pointer hover:border-[#00e676]/50 transition-all shadow-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-400" /> APLEX VIP Casino
                </span>
                <span className="text-[11px] font-black text-[#00e676] uppercase tracking-wider">
                  PLAY LIVE &rarr;
                </span>
              </div>
              <p className="text-xs text-[#a9c9b7]">
                Over 1,200+ certified slots, Spribe Aviator crash game, roulette, and VIP live dealer tables.
              </p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
                <span className="px-3 py-1 rounded-lg bg-black/35 text-[11px] font-semibold text-white whitespace-nowrap">
                  🎰 Sweet Bonanza
                </span>
                <span className="px-3 py-1 rounded-lg bg-black/35 text-[11px] font-semibold text-white whitespace-nowrap">
                  ⚡ Gates of Olympus
                </span>
                <span className="px-3 py-1 rounded-lg bg-black/35 text-[11px] font-semibold text-white whitespace-nowrap">
                  ✈️ Aviator
                </span>
              </div>
            </div>

            {/* Trending Sports Carousel */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#8aa396] uppercase tracking-wider">
                Trending Sports
              </span>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                {[
                  { name: 'Football', img: '/src/assets/images/sports_soccer_action_1794425605353.jpg' },
                  { name: 'Basketball', img: '/src/assets/images/aplex_hero_banner_1794425602980.jpg' },
                  { name: 'Tennis', img: '/src/assets/images/sports_soccer_action_1794425605353.jpg' },
                  { name: 'Rugby', img: '/src/assets/images/aplex_hero_banner_1794425602980.jpg' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="relative min-w-[120px] h-[150px] rounded-2xl overflow-hidden border border-white/10 shrink-0 flex items-end p-3 cursor-pointer group"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <span className="relative z-10 text-xs font-black uppercase text-white tracking-wider">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW B: CASINO LOBBY                                           */}
        {/* ============================================================== */}
        {mainView === 'casino' && (
          <div className="flex flex-col gap-3.5 animate-in fade-in duration-150">
            {/* Search Bar */}
            <div className="flex items-center gap-2.5 bg-[#0b2418] border border-white/10 rounded-2xl px-3.5 py-2.5 shadow-sm focus-within:border-[#00e676]">
              <Search className="w-4 h-4 text-[#8aa396]" />
              <input
                type="text"
                value={casinoSearchQuery}
                onChange={(e) => setCasinoSearchQuery(e.target.value)}
                placeholder="Search games or providers..."
                className="bg-transparent border-none outline-none text-xs text-white flex-1 placeholder:text-[#8aa396]"
              />
              {casinoSearchQuery && (
                <button onClick={() => setCasinoSearchQuery('')} className="text-[#8aa396] hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Providers Bar */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-[#8aa396] uppercase tracking-wider">
                Top Providers
              </span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['All', 'Pragmatic Play', 'Evolution', 'Spribe (Aviator)', 'NetEnt', 'Novomatic', 'Hacksaw Gaming'].map(
                  (prov) => (
                    <button
                      key={prov}
                      onClick={() => setSelectedProvider(prov)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all whitespace-nowrap ${
                        selectedProvider === prov
                          ? 'bg-[#0f3826] border-[#00e676] text-[#00e676]'
                          : 'bg-[#0b2418] border-white/10 text-[#8aa396] hover:text-white'
                      }`}
                    >
                      {prov}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Categories Filter Bar */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {['All', 'Slots', 'Crash', 'Jackpot'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#00e676] text-[#041209] font-black'
                      : 'bg-white/5 text-[#8aa396] hover:text-white border border-white/5'
                  }`}
                >
                  {cat === 'All' ? 'All Games' : cat === 'Crash' ? 'Crash (Aviator)' : cat}
                </button>
              ))}
            </div>

            {/* Games Grid */}
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" /> Featured & Hot Games
              </span>
              <span className="text-xs text-[#8aa396]">({filteredCasinoGames.length} games)</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {filteredCasinoGames.map((game) => (
                <div
                  key={game.id}
                  onClick={() => setActiveGame(game)}
                  className="group relative h-[140px] rounded-2xl overflow-hidden border border-white/10 p-3 flex flex-col justify-end cursor-pointer shadow-md transition-all hover:scale-[1.02] hover:border-[#00e676]"
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                  {/* Play Hover Overlay Badge */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#00e676] text-[#041209] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>

                  <div className="relative z-10 flex flex-col leading-tight">
                    <span className="text-xs font-black text-white truncate drop-shadow">
                      {game.title}
                    </span>
                    <span className="text-[10px] font-bold text-[#00e676] uppercase tracking-wider">
                      {game.provider}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* 3. FLOATING CHAT & SUPPORT                                     */}
      {/* ============================================================== */}
      <div
        onClick={() => setIsSupportChatOpen(true)}
        className="fixed bottom-20 left-4 z-[90] w-12 h-12 rounded-full bg-[#ffd600] text-[#1a1a1a] flex items-center justify-center shadow-xl shadow-black/50 cursor-pointer active:scale-95 transition-transform"
        title="24/7 VIP Support"
      >
        <Headphones className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-[#06180f]">
          1
        </span>
      </div>

      {/* ============================================================== */}
      {/* 4. BOTTOM NAVIGATION                                           */}
      {/* ============================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#061910]/95 backdrop-blur-md border-t border-white/10 z-[1000] flex justify-around items-center px-1 pb-safe">
        <button
          onClick={() => {
            setMainView('sports');
            setIsAdminView(false);
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
            mainView === 'sports' && !isAdminView ? 'text-[#00e676]' : 'text-[#8aa396] hover:text-white'
          }`}
        >
          <Receipt className="w-4.5 h-4.5" />
          <span>Sports</span>
        </button>

        <button
          onClick={() => {
            setMainView('casino');
            setIsAdminView(false);
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
            mainView === 'casino' && !isAdminView ? 'text-[#00e676]' : 'text-[#8aa396] hover:text-white'
          }`}
        >
          <CircleDot className="w-4.5 h-4.5" />
          <span>Casino</span>
        </button>

        {/* Bet Slip Bottom Nav Tab with Dynamic Counter Badge */}
        <button
          onClick={() => setIsBetSlipOpen(true)}
          className={`relative flex flex-col items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
            isBetSlipOpen ? 'text-[#00e676]' : betSelections.length > 0 ? 'text-[#00e676]' : 'text-[#8aa396] hover:text-white'
          }`}
        >
          <div className="relative">
            <Receipt className="w-4.5 h-4.5" />
            {betSelections.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-[#00e676] text-[#041209] text-[10px] font-black flex items-center justify-center shadow-sm">
                {betSelections.length}
              </span>
            )}
          </div>
          <span>Slip</span>
        </button>

        <button
          onClick={() => setIsDepositModalOpen(true)}
          className="flex flex-col items-center gap-1 text-[11px] font-bold text-[#8aa396] hover:text-[#00e676] transition-colors cursor-pointer"
        >
          <Wallet className="w-4.5 h-4.5" />
          <span>Deposit</span>
        </button>

        <button
          onClick={() => setIsInstallModalOpen(true)}
          className="flex flex-col items-center gap-1 text-[11px] font-bold text-[#8aa396] hover:text-[#00e676] transition-colors cursor-pointer"
        >
          <Download className="w-4.5 h-4.5" />
          <span>App</span>
        </button>

        <button
          onClick={() => setIsProfileDrawerOpen(true)}
          className="flex flex-col items-center gap-1 text-[11px] font-bold text-[#8aa396] hover:text-white transition-colors cursor-pointer"
        >
          <Menu className="w-4.5 h-4.5" />
          <span>More</span>
        </button>
      </nav>

      {/* ============================================================== */}
      {/* 5. PROFILE DRAWER                                              */}
      {/* ============================================================== */}
      {isProfileDrawerOpen && (
        <div
          onClick={() => setIsProfileDrawerOpen(false)}
          className="fixed inset-0 z-[2500] bg-black/70 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed top-0 right-0 w-[78%] max-w-[340px] h-full bg-[#15222e] rounded-l-3xl p-5 flex flex-col justify-between overflow-y-auto no-scrollbar shadow-2xl animate-in slide-in-from-right duration-200"
          >
            <div>
              {/* Level Circle */}
              <div className="w-18 h-18 rounded-full bg-[#00d07e] text-[#041209] text-3xl font-black flex items-center justify-center mx-auto my-3 shadow-lg">
                1
              </div>
              <div className="text-center mb-3">
                <span className="text-sm font-extrabold text-white">
                  {currentUser ? currentUser.name : 'Guest Player'}
                </span>
                <span className="text-[11px] text-[#8aa396] block">
                  {currentUser ? currentUser.email : 'Log in to view stats'}
                </span>
              </div>

              {/* Balance Box */}
              <div className="bg-[#101924] p-3.5 rounded-2xl border border-white/10 flex flex-col gap-2.5 mb-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-[#8aa396]">Balance</span>
                  <span className="text-base font-extrabold text-white">
                    {balance.toLocaleString()} USh
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsProfileDrawerOpen(false);
                    setIsDepositModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-[#00d07e] text-[#041209] rounded-xl font-black text-xs hover:brightness-105 active:scale-95 transition-all shadow"
                >
                  Deposit
                </button>
              </div>

              {/* Menu List */}
              <div className="flex flex-col text-xs text-slate-100 divide-y divide-white/5">
                {/* Install Real App button inside drawer */}
                <button
                  onClick={() => {
                    setIsProfileDrawerOpen(false);
                    setIsInstallModalOpen(true);
                  }}
                  className="py-3 text-left font-bold text-[#00e676] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4" /> Install APLEX on Home Screen
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-[#00e676]">
                    NEW
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileDrawerOpen(false);
                    setIsBetSlipOpen(true);
                  }}
                  className="py-3 text-left font-bold text-white flex items-center justify-between hover:text-[#00e676] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#00e676]" /> Active Bet Slip
                  </span>
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#00e676] text-[#041209]">
                    {betSelections.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileDrawerOpen(false);
                    setIsWithdrawModalOpen(true);
                  }}
                  className="py-3 text-left hover:text-[#00e676] transition-colors"
                >
                  Withdrawal Request
                </button>
                <button
                  onClick={() => {
                    alert('Invite code: APLEX2026. Share with friends for a 20,000 USh bonus!');
                  }}
                  className="py-3 text-left hover:text-[#00e676] transition-colors"
                >
                  Bring a friend (Referral)
                </button>
                <button
                  onClick={() => {
                    setIsProfileDrawerOpen(false);
                    setIsTransactionHistoryOpen(true);
                  }}
                  className="py-3 text-left hover:text-[#00e676] transition-colors flex items-center justify-between"
                >
                  <span>Transaction History</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-emerald-300">
                    {betTransactions.length} Bets
                  </span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileDrawerOpen(false);
                    setIsSupportChatOpen(true);
                  }}
                  className="py-3 text-left hover:text-[#00e676] transition-colors"
                >
                  Support Center
                </button>
                <button
                  onClick={() => {
                    setIsProfileDrawerOpen(false);
                    setIsSettingsModalOpen(true);
                  }}
                  className="py-3 text-left hover:text-[#00e676] transition-colors"
                >
                  Settings
                </button>
                {currentUser && (
                  <button
                    onClick={handleLogout}
                    className="py-3 text-left text-red-400 font-bold hover:text-red-300 transition-colors"
                  >
                    Exit / Log Out
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Lower Section */}
            <div className="pt-4 border-t border-white/10 flex justify-between text-xs text-[#8aa396]">
              <span
                onClick={() => {
                  setMainView('sports');
                  setIsProfileDrawerOpen(false);
                }}
                className="cursor-pointer hover:text-white"
              >
                Home
              </span>
              <span
                onClick={() => {
                  setMainView('casino');
                  setIsProfileDrawerOpen(false);
                }}
                className="cursor-pointer hover:text-white"
              >
                Casino
              </span>
              <span
                onClick={() => {
                  setIsProfileDrawerOpen(false);
                  setIsAdminView(true);
                }}
                className="cursor-pointer text-emerald-400 font-bold hover:underline"
              >
                Admin
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. SIGN UP MODAL (STRICT EMAIL ONLY)                           */}
      {/* ============================================================== */}
      {isSignupModalOpen && (
        <div
          onClick={() => setIsSignupModalOpen(false)}
          className="fixed inset-0 z-[3000] flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[400px] bg-white text-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-3 max-h-[92vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-slate-900">Sign Up</h3>
              <button
                onClick={() => setIsSignupModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick vs Default Tab */}
            <div className="flex p-1 bg-slate-100 rounded-xl self-center">
              <button
                type="button"
                onClick={() => setRegMode('default')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  regMode === 'default' ? 'bg-[#00d07e] text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Default
              </button>
              <button
                type="button"
                onClick={() => setRegMode('quick')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  regMode === 'quick' ? 'bg-[#00d07e] text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Quick
              </button>
            </div>

            <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-2.5">
              {regMode === 'default' && (
                <>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Your name"
                    className="w-full h-11 bg-slate-100 rounded-xl px-3.5 text-xs font-medium text-slate-900 outline-none"
                    required
                  />

                  {/* Phone Wrap */}
                  <div className="flex items-center bg-slate-100 rounded-xl px-2 h-11 gap-1">
                    <select
                      value={signupPhoneCode}
                      onChange={(e) => setSignupPhoneCode(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-700 outline-none pr-1 border-r border-slate-300"
                    >
                      <option value="+256">🇺🇬 +256</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+254">🇰🇪 +254</option>
                    </select>
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="700 123-456"
                      className="flex-1 bg-transparent text-xs font-medium text-slate-900 outline-none pl-2"
                    />
                  </div>
                </>
              )}

              {/* Currency Select */}
              <div className="relative">
                <select
                  value={signupCurrency}
                  onChange={(e) => setSignupCurrency(e.target.value)}
                  className="w-full h-11 bg-slate-100 rounded-xl px-3.5 text-xs font-bold text-slate-700 appearance-none outline-none"
                >
                  <option value="UGX">UGX - Ugandan Shilling</option>
                  <option value="USD">USD - US Dollar</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>

              {/* STRICT EMAIL ONLY */}
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="Email Address (e.g. user@gmail.com)"
                className="w-full h-11 bg-slate-100 rounded-xl px-3.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#00d07e]"
                required
              />

              {regMode === 'default' && (
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-11 bg-slate-100 rounded-xl px-3.5 text-xs font-medium text-slate-900 outline-none"
                  required
                />
              )}

              {/* Toggles */}
              <label className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                  className="w-4 h-4 accent-[#00d07e]"
                />
                <span>I accept terms & conditions</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptAge}
                  onChange={(e) => setAcceptAge(e.target.checked)}
                  required
                  className="w-4 h-4 accent-[#00d07e]"
                />
                <span>I am 18 years old or older</span>
              </label>

              <button
                type="submit"
                className="w-full h-12 bg-[#00d07e] text-white font-extrabold rounded-xl text-sm shadow-md hover:brightness-105 active:scale-95 transition-all mt-1 cursor-pointer"
              >
                Sign Up
              </button>
            </form>

            <div className="text-center text-xs text-slate-500">
              Already have an account?{' '}
              <span
                onClick={() => {
                  setIsSignupModalOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="text-[#00d07e] font-bold cursor-pointer hover:underline"
              >
                Log in
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. LOG IN MODAL (STRICT EMAIL ONLY)                            */}
      {/* ============================================================== */}
      {isLoginModalOpen && (
        <div
          onClick={() => setIsLoginModalOpen(false)}
          className="fixed inset-0 z-[3000] flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] bg-white text-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-3.5"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-slate-900">Log in</h3>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-11 bg-slate-100 rounded-xl px-3.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#00d07e]"
                required
              />

              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-11 bg-slate-100 rounded-xl px-3.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#00d07e]"
                required
              />

              <div className="text-right">
                <span
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setForgotStep(1);
                    setForgotEmail('');
                    setIsForgotPassModalOpen(true);
                  }}
                  className="text-xs text-slate-500 hover:text-[#00d07e] font-semibold cursor-pointer"
                >
                  Forgot your password?
                </span>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#00d07e] text-white font-extrabold rounded-xl text-sm shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                Log in
              </button>
            </form>

            <div className="text-center text-xs text-slate-500">
              Don't have an account yet?{' '}
              <span
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setIsSignupModalOpen(true);
                }}
                className="text-[#00d07e] font-bold cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. FORGOT PASSWORD MODAL (GMAIL APP VERIFICATION CODE)         */}
      {/* ============================================================== */}
      {isForgotPassModalOpen && (
        <div
          onClick={() => setIsForgotPassModalOpen(false)}
          className="fixed inset-0 z-[3000] flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[390px] bg-white text-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-3.5"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-900">Password Recovery</h3>
              <button
                onClick={() => setIsForgotPassModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotStep === 1 ? (
              <form onSubmit={handleSendGmailCode} className="flex flex-col gap-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your registered email address. We will send a 6-digit verification code to your Gmail app.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full h-11 bg-slate-100 rounded-xl px-3.5 text-xs font-medium text-slate-900 outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full h-12 bg-[#00d07e] text-white font-extrabold rounded-xl text-sm shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  Send Verification Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndResetPass} className="flex flex-col gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800">
                  <span className="font-bold">Code sent to your Gmail inbox!</span> Please check your Gmail app.
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full h-12 bg-slate-100 rounded-xl px-3.5 text-center font-black tracking-widest text-lg text-slate-900 outline-none"
                  required
                />

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full h-11 bg-slate-100 rounded-xl px-3.5 text-xs font-medium text-slate-900 outline-none"
                  required
                  minLength={6}
                />

                <button
                  type="submit"
                  className="w-full h-12 bg-[#00d07e] text-white font-extrabold rounded-xl text-sm shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  Reset Password & Log In
                </button>
              </form>
            )}

            <div className="text-center text-xs text-slate-500">
              Remembered password?{' '}
              <span
                onClick={() => {
                  setIsForgotPassModalOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="text-[#00d07e] font-bold cursor-pointer hover:underline"
              >
                Back to Log in
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. DEPOSIT MODAL                                               */}
      {/* ============================================================== */}
      {isDepositModalOpen && (
        <div
          onClick={() => setIsDepositModalOpen(false)}
          className="fixed inset-0 z-[3000] flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[390px] bg-white text-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-3.5"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-slate-900">Deposit</h3>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* MTN vs Airtel Badges */}
            <div className="grid grid-cols-2 gap-2.5">
              <div
                onClick={() => setDepositMethod('mtn')}
                className={`border-2 rounded-2xl p-3 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  depositMethod === 'mtn' ? 'border-[#00d07e] bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="w-18 h-10 bg-[#ffcc00] rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-black font-black text-sm border-2 border-black px-2 py-0.5 rounded-lg">
                    MTN
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-800">MTN MoMo</span>
              </div>

              <div
                onClick={() => setDepositMethod('airtel')}
                className={`border-2 rounded-2xl p-3 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  depositMethod === 'airtel' ? 'border-[#00d07e] bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="w-18 h-10 bg-[#e60000] rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm">
                  airtel
                </div>
                <span className="text-xs font-bold text-slate-800">Airtel Money</span>
              </div>
            </div>

            <form onSubmit={handleProcessDeposit} className="flex flex-col gap-3">
              <div className="flex items-center bg-slate-100 rounded-xl px-3 h-11 gap-1">
                <span className="text-xs font-bold text-slate-700">🇺🇬 +256</span>
                <input
                  type="tel"
                  value={depositPhone}
                  onChange={(e) => setDepositPhone(e.target.value)}
                  placeholder="770 123-456"
                  className="flex-1 bg-transparent text-xs font-semibold text-slate-900 outline-none pl-2"
                  required
                />
              </div>

              <input
                type="number"
                min="500"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Math.max(500, parseInt(e.target.value) || 0))}
                className="w-full h-11 bg-slate-100 rounded-xl px-3.5 text-sm font-bold text-slate-900 outline-none"
                required
              />

              {/* Amount Presets */}
              <div className="grid grid-cols-3 gap-2">
                {[5000, 10000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      depositAmount === amt
                        ? 'bg-[#00d07e] text-white border-[#00d07e]'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#00d07e] text-white font-black rounded-xl text-sm shadow-md hover:brightness-105 active:scale-95 transition-all mt-1"
              >
                Deposit {depositAmount.toLocaleString()} USh
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 10. WITHDRAWAL MODAL                                           */}
      {/* ============================================================== */}
      {isWithdrawModalOpen && (
        <div
          onClick={() => setIsWithdrawModalOpen(false)}
          className="fixed inset-0 z-[3000] flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] bg-white text-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-3.5"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-slate-900">Withdrawal Request</h3>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-100 p-3 rounded-xl flex justify-between text-xs">
              <span className="text-slate-600">Available Balance:</span>
              <span className="font-extrabold text-[#00d07e]">{balance.toLocaleString()} USh</span>
            </div>

            <form onSubmit={handleProcessWithdrawal} className="flex flex-col gap-3">
              <input
                type="number"
                min="1000"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="Enter amount"
                className="w-full h-11 bg-slate-100 rounded-xl px-3.5 text-xs font-bold text-slate-900 outline-none"
                required
              />

              <div className="relative">
                <select
                  value={withdrawSystem}
                  onChange={(e) => setWithdrawSystem(e.target.value as 'mtn' | 'airtel')}
                  className="w-full h-11 bg-slate-100 rounded-xl px-3.5 text-xs font-bold text-slate-700 appearance-none outline-none"
                >
                  <option value="mtn">MTN Mobile Money (Uganda)</option>
                  <option value="airtel">Airtel Money (Uganda)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>

              <input
                type="text"
                value={withdrawAccount}
                onChange={(e) => setWithdrawAccount(e.target.value)}
                placeholder="Wallet / Phone number"
                className="w-full h-11 bg-slate-100 rounded-xl px-3.5 text-xs font-medium text-slate-900 outline-none"
                required
              />

              <button
                type="submit"
                className="w-full h-12 bg-[#00d07e] text-white font-extrabold rounded-xl text-sm shadow-md hover:brightness-105 active:scale-95 transition-all mt-1"
              >
                Submit Payout
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 11. SETTINGS MODAL                                             */}
      {/* ============================================================== */}
      {isSettingsModalOpen && (
        <div
          onClick={() => setIsSettingsModalOpen(false)}
          className="fixed inset-0 z-[3000] flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[360px] bg-white text-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-3.5"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-slate-900">Settings</h3>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('APLEX Account settings updated successfully!');
                setIsSettingsModalOpen(false);
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                value={`ID: ${currentUser ? currentUser.id : '8492019'}`}
                readOnly
                className="w-full h-11 bg-slate-200 rounded-xl px-3.5 text-xs font-bold text-slate-700 outline-none"
              />
              <input
                type="password"
                placeholder="Change Password"
                className="w-full h-11 bg-slate-100 rounded-xl px-3.5 text-xs font-medium text-slate-900 outline-none"
              />
              <button
                type="submit"
                className="w-full h-12 bg-[#00d07e] text-white font-extrabold rounded-xl text-sm shadow-md hover:brightness-105 active:scale-95 transition-all"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 12. FULL ADMIN DASHBOARD VIEW                                  */}
      {/* ============================================================== */}
      {isAdminView && (
        <div className="fixed inset-0 z-[5000] bg-[#040f09] text-white overflow-y-auto pb-16 animate-in fade-in">
          {/* Admin Header */}
          <div className="bg-[#081a11] border-b border-white/10 px-4 py-3 flex justify-between items-center sticky top-0 z-20">
            <div>
              <div className="flex items-center gap-2">
                <AplexLogo size="sm" showText={false} />
                <span className="font-black text-sm tracking-wider uppercase text-[#00e676]">
                  APLEX
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white">
                  ADMIN CONTROL
                </span>
              </div>
              <div className="text-[11px] text-[#8aa396] flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#00e676] live-pulse" />
                Super Admin Session Active
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAdminView(false)}
                className="px-3 py-1.5 rounded-lg bg-[#00d07e] text-[#041009] font-extrabold text-xs flex items-center gap-1 hover:brightness-105 active:scale-95 transition-all"
              >
                <Eye className="w-3.5 h-3.5" /> View Site
              </button>
              <button
                onClick={() => {
                  setIsAdminView(false);
                  handleLogout();
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-extrabold text-xs flex items-center gap-1 hover:bg-red-700 active:scale-95 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" /> Exit
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto p-4 flex flex-col gap-4">
            {/* Live Analytics Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0e2d1f] p-3.5 rounded-2xl border border-white/10 flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-[#00e676]">342</span>
                <span className="text-[11px] text-[#8aa396] flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] live-pulse" /> People Online
                </span>
              </div>

              <div className="bg-[#0e2d1f] p-3.5 rounded-2xl border border-white/10 flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-[#00e676]">
                  {(12890 + usersList.length).toLocaleString()}
                </span>
                <span className="text-[11px] text-[#8aa396] flex items-center gap-1 mt-1">
                  <Users className="w-3 h-3 text-[#00e676]" /> Total App Users
                </span>
              </div>

              <div className="bg-[#0e2d1f] p-3.5 rounded-2xl border border-white/10 flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-amber-400">48.2M USh</span>
                <span className="text-[11px] text-[#8aa396] flex items-center gap-1 mt-1">
                  <Coins className="w-3 h-3 text-amber-400" /> Total Volume Today
                </span>
              </div>

              <div className="bg-[#0e2d1f] p-3.5 rounded-2xl border border-white/10 flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-[#00e676]">
                  {liveMatches.length}
                </span>
                <span className="text-[11px] text-[#8aa396] flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3 text-[#00e676]" /> Active Matches
                </span>
              </div>
            </div>

            {/* Admin Nav Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-white/10 pb-2">
              <button
                onClick={() => setAdminTab('users')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  adminTab === 'users'
                    ? 'bg-[#00e676] text-[#041009] font-black'
                    : 'bg-[#0b2418] text-[#8aa396] hover:text-white border border-white/5'
                }`}
              >
                <UserX className="w-3.5 h-3.5" /> Users & Bans
              </button>

              <button
                onClick={() => setAdminTab('matches')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  adminTab === 'matches'
                    ? 'bg-[#00e676] text-[#041009] font-black'
                    : 'bg-[#0b2418] text-[#8aa396] hover:text-white border border-white/5'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Matches
              </button>

              <button
                onClick={() => setAdminTab('video')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  adminTab === 'video'
                    ? 'bg-[#00e676] text-[#041009] font-black'
                    : 'bg-[#0b2418] text-[#8aa396] hover:text-white border border-white/5'
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Add Video Match
              </button>

              <button
                onClick={() => setAdminTab('traffic')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  adminTab === 'traffic'
                    ? 'bg-[#00e676] text-[#041009] font-black'
                    : 'bg-[#0b2418] text-[#8aa396] hover:text-white border border-white/5'
                }`}
              >
                <Activity className="w-3.5 h-3.5" /> Traffic History
              </button>
            </div>

            {/* TAB 1: USERS & BANS */}
            {adminTab === 'users' && (
              <div className="bg-[#0e2d1f] p-4 rounded-2xl border border-white/10 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-extrabold text-white">Registered APLEX Users</h4>
                  <span className="text-xs text-[#8aa396]">Active Count: {usersList.length}</span>
                </div>

                <div className="flex flex-col divide-y divide-white/5">
                  {usersList.map((u) => (
                    <div key={u.id} className="py-3 flex justify-between items-center gap-2">
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                          {u.name} {u.country}
                          {u.online && <span className="w-2 h-2 rounded-full bg-[#00e676] live-pulse" />}
                        </div>
                        <div className="text-[11px] text-[#8aa396]">
                          {u.email} &bull; {u.phone}
                        </div>
                        <div className="text-[10px] mt-0.5">
                          Status:{' '}
                          <span className={u.banned ? 'text-red-400 font-bold' : 'text-[#00e676] font-bold'}>
                            {u.banned ? 'BANNED' : 'ACTIVE'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleBanUser(u.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          u.banned
                            ? 'bg-[#00d07e] text-[#041009] hover:brightness-105'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {u.banned ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: EDIT MATCHES */}
            {adminTab === 'matches' && (
              <div className="bg-[#0e2d1f] p-4 rounded-2xl border border-white/10 flex flex-col gap-3">
                <h4 className="text-sm font-extrabold text-white">Live Match Scores & Odds Editor</h4>
                <div className="flex flex-col gap-3">
                  {liveMatches.map((m) => (
                    <div
                      key={m.id}
                      className="bg-[#0a2116] p-3.5 rounded-xl border border-white/10 flex flex-col gap-2.5"
                    >
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span>
                          {m.team1} vs {m.team2} ({m.league})
                        </span>
                        <span className="text-red-400 font-black">{m.minute}'</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-[#8aa396] block mb-1">{m.team1} Score</label>
                          <input
                            type="number"
                            value={m.score1}
                            onChange={(e) => updateMatchScore(m.id, 1, parseInt(e.target.value) || 0)}
                            className="w-full bg-[#06180f] border border-white/15 rounded-lg py-1 px-2 text-center text-sm font-bold text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#8aa396] block mb-1">{m.team2} Score</label>
                          <input
                            type="number"
                            value={m.score2}
                            onChange={(e) => updateMatchScore(m.id, 2, parseInt(e.target.value) || 0)}
                            className="w-full bg-[#06180f] border border-white/15 rounded-lg py-1 px-2 text-center text-sm font-bold text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-[#8aa396] block mb-1">Odd (1)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={m.odd1}
                            onChange={(e) => updateMatchOdd(m.id, 'odd1', parseFloat(e.target.value) || 1.0)}
                            className="w-full bg-[#06180f] border border-white/15 rounded-lg py-1 px-2 text-center text-xs font-bold text-[#00e676] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#8aa396] block mb-1">Odd (X)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={m.oddX}
                            onChange={(e) => updateMatchOdd(m.id, 'oddX', parseFloat(e.target.value) || 1.0)}
                            className="w-full bg-[#06180f] border border-white/15 rounded-lg py-1 px-2 text-center text-xs font-bold text-[#00e676] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#8aa396] block mb-1">Odd (2)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={m.odd2}
                            onChange={(e) => updateMatchOdd(m.id, 'odd2', parseFloat(e.target.value) || 1.0)}
                            className="w-full bg-[#06180f] border border-white/15 rounded-lg py-1 px-2 text-center text-xs font-bold text-[#00e676] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ADD VIDEO MATCH */}
            {adminTab === 'video' && (
              <div className="bg-[#0e2d1f] p-4 rounded-2xl border border-white/10 flex flex-col gap-3">
                <h4 className="text-sm font-extrabold text-white">Add Live Stream / Video Match</h4>
                <form onSubmit={submitNewVideoMatch} className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={newMatchLeague}
                    onChange={(e) => setNewMatchLeague(e.target.value)}
                    placeholder="League (e.g. Uganda Premier League)"
                    required
                    className="w-full h-11 bg-[#092416] border border-white/15 rounded-xl px-3 text-xs text-white outline-none"
                  />
                  <input
                    type="text"
                    value={newMatchTeams}
                    onChange={(e) => setNewMatchTeams(e.target.value)}
                    placeholder="Teams (e.g. Vipers SC vs KCCA FC)"
                    required
                    className="w-full h-11 bg-[#092416] border border-white/15 rounded-xl px-3 text-xs text-white outline-none"
                  />
                  <input
                    type="text"
                    value={newMatchVideoUrl}
                    onChange={(e) => setNewMatchVideoUrl(e.target.value)}
                    placeholder="Live Video Embed URL (e.g. https://www.youtube.com/embed/...)"
                    required
                    className="w-full h-11 bg-[#092416] border border-white/15 rounded-xl px-3 text-xs text-white outline-none"
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-[#8aa396] block mb-1">Odd 1</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newOdd1}
                        onChange={(e) => setNewOdd1(parseFloat(e.target.value) || 1.85)}
                        className="w-full bg-[#06180f] border border-white/15 rounded-lg py-1 text-center text-xs font-bold text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8aa396] block mb-1">Odd X</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newOddX}
                        onChange={(e) => setNewOddX(parseFloat(e.target.value) || 3.40)}
                        className="w-full bg-[#06180f] border border-white/15 rounded-lg py-1 text-center text-xs font-bold text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8aa396] block mb-1">Odd 2</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newOdd2}
                        onChange={(e) => setNewOdd2(parseFloat(e.target.value) || 4.20)}
                        className="w-full bg-[#06180f] border border-white/15 rounded-lg py-1 text-center text-xs font-bold text-white outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 bg-[#00d07e] text-[#041009] font-black rounded-xl text-sm shadow-md hover:brightness-105 active:scale-95 transition-all mt-1"
                  >
                    Add & Broadcast Match
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: TRAFFIC & HISTORY */}
            {adminTab === 'traffic' && (
              <div className="bg-[#0e2d1f] p-4 rounded-2xl border border-white/10 flex flex-col gap-3">
                <h4 className="text-sm font-extrabold text-white">Live People Activity & Bets Log</h4>
                <div className="flex flex-col gap-2">
                  {trafficLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="bg-[#081b12] border border-white/10 rounded-xl p-3 flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {log.flag} {log.user}
                          <span className="text-[10px] text-[#8aa396] font-normal">({log.ip})</span>
                        </div>
                        <div className="text-[#00e676] text-[11px] mt-0.5">{log.action}</div>
                      </div>
                      <span className="text-[10px] text-[#8aa396]">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 13. SLIDE-UP MULTI-SELECTION BET SLIP DRAWER                   */}
      {/* ============================================================== */}
      <BetSlipDrawer
        selections={betSelections}
        onRemoveSelection={handleRemoveSelection}
        onClearAll={handleClearAllSelections}
        balance={balance}
        onPlaceBet={handlePlaceMultiBet}
        onOpenDeposit={() => {
          setIsBetSlipOpen(false);
          setIsDepositModalOpen(true);
        }}
        isOpen={isBetSlipOpen}
        onToggleOpen={() => setIsBetSlipOpen(!isBetSlipOpen)}
      />

      {/* ============================================================== */}
      {/* 14. CASINO GAME PLAYER MODAL                                   */}
      {/* ============================================================== */}
      <GamePlayerModal
        isOpen={!!activeGame}
        onClose={() => setActiveGame(null)}
        game={activeGame}
        balance={balance}
        onUpdateBalance={(delta) => setBalance((prev) => Math.max(0, prev + delta))}
      />

      {/* ============================================================== */}
      {/* 15. CUSTOMER SUPPORT CONCIERGE CHAT MODAL                     */}
      {/* ============================================================== */}
      <SupportChatModal
        isOpen={isSupportChatOpen}
        onClose={() => setIsSupportChatOpen(false)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* ============================================================== */}
      {/* 16. REAL APP HOME SCREEN DOWNLOAD MODAL                        */}
      {/* ============================================================== */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
        isAndroid={isAndroid}
        onTriggerInstall={install}
        simulatedStandalone={simulatedStandalone}
        onToggleSimulatedStandalone={() => setSimulatedStandalone(!simulatedStandalone)}
      />

      {/* ============================================================== */}
      {/* 17. TRANSACTION & BETTING HISTORY MODAL WITH STATUS FILTERS    */}
      {/* ============================================================== */}
      <TransactionHistoryModal
        isOpen={isTransactionHistoryOpen}
        onClose={() => setIsTransactionHistoryOpen(false)}
        transactions={betTransactions}
        onCashout={handleCashout}
      />
    </div>
  );
}
