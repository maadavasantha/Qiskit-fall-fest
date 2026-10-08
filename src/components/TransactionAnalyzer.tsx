import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Zap,
  ArrowRight,
  Globe,
  Smartphone,
  Repeat,
  Share2,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { TransactionInput, AnalysisResult } from '../types';
import { SEED_USERS } from '../data/mockDatabase';

interface TransactionAnalyzerProps {
  onAnalyze: (input: TransactionInput) => AnalysisResult;
  lastResult: AnalysisResult | null;
  onSelectTab: (tab: string) => void;
  onUpdateStatus?: (txnId: string, status: AnalysisResult['caseStatus']) => void;
  adaptiveFactor: number;
}

export const TransactionAnalyzer: React.FC<TransactionAnalyzerProps> = ({
  onAnalyze,
  lastResult,
  onSelectTab,
  onUpdateStatus,
  adaptiveFactor,
}) => {
  const [userId, setUserId] = useState<string>('U1001');
  const [amount, setAmount] = useState<number>(85000);
  const [beneficiaryId, setBeneficiaryId] = useState<string>('B204');
  const [deviceId, setDeviceId] = useState<string>('DEV901');
  const [location, setLocation] = useState<string>('Hyderabad');
  const [transactionType, setTransactionType] = useState<TransactionInput['transactionType']>('UPI');
  const [recentTxns5m, setRecentTxns5m] = useState<number>(1);
  const [recentTxns1h, setRecentTxns1h] = useState<number>(2);

  const selectedUser = SEED_USERS.find((u) => u.userId === userId) || SEED_USERS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      userId,
      amount: Number(amount),
      beneficiaryId,
      deviceId,
      location,
      transactionType,
      recentTxns5m: Number(recentTxns5m),
      recentTxns1h: Number(recentTxns1h),
      adaptiveFactor,
    });
  };

  const handleApplyPreset = (amt: number, ben: string, dev: string, loc: string, v5m: number) => {
    setAmount(amt);
    setBeneficiaryId(ben);
    setDeviceId(dev);
    setLocation(loc);
    setRecentTxns5m(v5m);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Introduction */}
      <div className="border border-slate-800 bg-slate-900/50 rounded-xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Real-Time Digital Payment Fraud Detection
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Submit transaction parameters to evaluate multi-dimensional fraud intelligence across
              classical feature pipelines and parameterized Qiskit quantum circuits.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-slate-400 font-mono">
              Decision Thresholds: &le;30 Allow · 31–70 Verify · &gt;70 Block
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Transaction Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-slate-800 bg-slate-900/80 rounded-xl p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Transaction Ingestion
              </h2>
              <button
                type="button"
                onClick={() => handleApplyPreset(1450, 'B201', 'DEV901', 'Hyderabad', 0)}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" /> Reset to Normal
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* User Selection */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">User Account</label>
                <select
                  value={userId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setUserId(id);
                    const u = SEED_USERS.find((usr) => usr.userId === id);
                    if (u) {
                      setDeviceId(u.knownDevices[0] || 'DEV901');
                      setLocation(u.frequentLocation);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {SEED_USERS.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      {u.userId} — {u.name} (Avg ₹{u.avgAmount.toLocaleString()}, {u.frequentLocation})
                    </option>
                  ))}
                </select>
                <div className="mt-1 text-[11px] text-slate-400">
                  Baseline Profile: Avg ₹{selectedUser.avgAmount.toLocaleString()} · Frequent:{' '}
                  {selectedUser.frequentLocation} · Known: {selectedUser.knownDevices.join(', ')}
                </div>
              </div>

              {/* Amount */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-medium">Amount (₹ INR)</label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAmount(1200)}
                      className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                    >
                      ₹1.2K
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(18000)}
                      className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                    >
                      ₹18K
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(85000)}
                      className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                    >
                      ₹85K
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(140000)}
                      className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                    >
                      ₹140K
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-mono text-sm">₹</span>
                  <input
                    type="number"
                    min="1"
                    max="1000000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500 tabular-nums"
                  />
                </div>
              </div>

              {/* Beneficiary */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Beneficiary Account</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={beneficiaryId}
                    onChange={(e) => setBeneficiaryId(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="B201">B201 (Swiggy Merchant - Low Risk)</option>
                    <option value="B202">B202 (Utility Electricity Bill)</option>
                    <option value="B204">B204 (Crypto P2P - High Risk)</option>
                    <option value="B305">B305 (Relay Node - Flagged Mule)</option>
                    <option value="B_MULE_501">B_MULE_501 (Known Ring Node)</option>
                  </select>
                  <input
                    type="text"
                    value={beneficiaryId}
                    onChange={(e) => setBeneficiaryId(e.target.value)}
                    placeholder="Custom ID"
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Device and Location Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Hardware Device ID</label>
                  <select
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  >
                    <option value="DEV901">DEV901 (Trusted Pixel 8)</option>
                    <option value="DEV902">DEV902 (Trusted iPhone 15)</option>
                    <option value="DEV903">DEV903 (Trusted Galaxy S24)</option>
                    <option value="DEV_ROGUE_991">DEV_ROGUE_991 (Emulated Device)</option>
                    <option value="DEV_TOR_EMU_77">DEV_TOR_EMU_77 (Anonymizer Node)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Current Geolocation</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Hyderabad">Hyderabad (Home)</option>
                    <option value="Bengaluru">Bengaluru (570 km)</option>
                    <option value="Mumbai">Mumbai (710 km)</option>
                    <option value="Delhi">Delhi (1,420 km)</option>
                    <option value="Chennai">Chennai (630 km)</option>
                    <option value="Pune">Pune (560 km)</option>
                    <option value="Dubai">Dubai (2,550 km - Overseas)</option>
                    <option value="Lagos">Lagos (7,800 km - Overseas)</option>
                  </select>
                </div>
              </div>

              {/* Transaction Type & Velocity */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Channel</label>
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="UPI">UPI Transfer</option>
                    <option value="IMPS">IMPS Instant</option>
                    <option value="NEFT">NEFT Settlement</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="WALLET">Wallet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium" title="Transfers within last 5 minutes">
                    Velocity (5m)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={recentTxns5m}
                    onChange={(e) => setRecentTxns5m(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono tabular-nums focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium" title="Transfers within last 1 hour">
                    Velocity (1h)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={recentTxns1h}
                    onChange={(e) => setRecentTxns1h(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono tabular-nums focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 transition-all text-xs"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Analyze with Quantum-Classical Pipeline</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Real-Time Evaluation Result (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {lastResult ? (
            <div className="border border-slate-800 bg-slate-900/90 rounded-xl p-5 sm:p-6 space-y-5">
              {/* Header Status & Decision Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border font-mono text-xl font-bold ${
                      lastResult.riskLevel === 'HIGH'
                        ? 'bg-rose-950/40 text-rose-400 border-rose-800/80'
                        : lastResult.riskLevel === 'MEDIUM'
                        ? 'bg-amber-950/40 text-amber-400 border-amber-800/80'
                        : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/80'
                    }`}
                  >
                    {lastResult.riskScore}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{lastResult.transactionId}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400 font-mono">{lastResult.timestamp}</span>
                    </div>
                    <div className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{lastResult.decision}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium border ${
                          lastResult.riskLevel === 'HIGH'
                            ? 'bg-rose-950/50 text-rose-300 border-rose-800/60'
                            : lastResult.riskLevel === 'MEDIUM'
                            ? 'bg-amber-950/50 text-amber-300 border-amber-800/60'
                            : 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60'
                        }`}
                      >
                        {lastResult.riskLevel} RISK ({lastResult.riskScore}/100)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Case Response Action Trigger */}
                <div className="flex items-center gap-2">
                  {lastResult.decision === 'BLOCK + ALERT' && (
                    <button
                      onClick={() => onUpdateStatus?.(lastResult.transactionId, 'FROZEN')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5" /> Freeze Account
                    </button>
                  )}
                  {lastResult.decision === 'VERIFY' && (
                    <button
                      onClick={() => onUpdateStatus?.(lastResult.transactionId, 'RESOLVED_ALLOWED')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Verify 2FA
                    </button>
                  )}
                  <button
                    onClick={() => onSelectTab('response')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors"
                  >
                    View in Response Center
                  </button>
                </div>
              </div>

              {/* Three-Model Probability Gauge */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                  <span>Model Comparison Triad</span>
                  <button
                    onClick={() => onSelectTab('benchmark')}
                    className="text-cyan-400 hover:text-cyan-300 lowercase text-[11px] font-normal"
                  >
                    view benchmarks &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3">
                    <div className="text-[11px] text-slate-400 mb-1">Classical ML</div>
                    <div className="text-base font-bold text-slate-200 font-mono tabular-nums">
                      {(lastResult.classicalProbability * 100).toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Random Forest / GBDT</div>
                  </div>

                  <div className="bg-slate-950 border border-cyan-900/40 rounded-lg p-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500/10 rounded-bl-lg flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="text-[11px] text-cyan-400 mb-1">Quantum ML</div>
                    <div className="text-base font-bold text-cyan-300 font-mono tabular-nums">
                      {(lastResult.quantumProbability * 100).toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Qiskit VQC Circuit</div>
                  </div>

                  <div className="bg-slate-950 border border-indigo-900/50 rounded-lg p-3">
                    <div className="text-[11px] text-indigo-400 mb-1">Hybrid Fused</div>
                    <div className="text-base font-bold text-indigo-300 font-mono tabular-nums">
                      {(lastResult.hybridProbability * 100).toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Ensemble Decision</div>
                  </div>
                </div>
              </div>

              {/* Fraud Pattern DNA */}
              <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-3.5">
                <div className="text-[11px] text-slate-400 font-medium mb-1">Fraud Pattern DNA Signature</div>
                <div className="font-mono text-xs text-amber-300/95 tracking-wide bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800/60 select-all">
                  {lastResult.fraudDna}
                </div>
              </div>

              {/* Multi-Dimensional Intelligence Signals Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-slate-950/70 border border-slate-800/70 p-2.5 rounded-lg">
                  <div className="text-slate-400 text-[10px] flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-cyan-400" /> Device Trust
                  </div>
                  <div className="font-semibold text-slate-200 mt-1 font-mono">
                    {lastResult.intelligence.deviceTrust}/100
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {lastResult.intelligence.isNewDevice ? 'Unrecognized HW' : 'Known Device'}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/70 p-2.5 rounded-lg">
                  <div className="text-slate-400 text-[10px] flex items-center gap-1">
                    <Globe className="w-3 h-3 text-cyan-400" /> Geolocation
                  </div>
                  <div className="font-semibold text-slate-200 mt-1 font-mono">
                    {lastResult.intelligence.distanceKm} km
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {lastResult.intelligence.isImpossibleTravel ? 'Impossible Travel' : 'Normal Range'}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/70 p-2.5 rounded-lg">
                  <div className="text-slate-400 text-[10px] flex items-center gap-1">
                    <Repeat className="w-3 h-3 text-cyan-400" /> 5m Velocity
                  </div>
                  <div className="font-semibold text-slate-200 mt-1 font-mono">
                    {lastResult.intelligence.velocity5m} txns
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {lastResult.intelligence.isBurstVelocity ? 'Burst Smurfing' : 'Nominal'}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/70 p-2.5 rounded-lg">
                  <div className="text-slate-400 text-[10px] flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-cyan-400" /> Network Link
                  </div>
                  <div className="font-semibold text-slate-200 mt-1 font-mono">
                    {(lastResult.intelligence.networkRiskScore * 100).toFixed(0)}%
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {lastResult.intelligence.isInFraudRing ? 'In Fraud Ring' : 'Isolated'}
                  </div>
                </div>
              </div>

              {/* Explainability Engine: Checklist of Justification Reasons */}
              <div className="bg-slate-950/90 border border-slate-800/80 rounded-lg p-4">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span>Why this decision was reached (Explainable AI)</span>
                  <button
                    onClick={() => onSelectTab('explain')}
                    className="text-cyan-400 hover:text-cyan-300 lowercase text-[11px] font-normal"
                  >
                    inspect SHAP attributions &rarr;
                  </button>
                </div>
                <ul className="space-y-1.5 text-xs">
                  {lastResult.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantum Circuit Execution Quick Summary */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>4 Qubits</span>
                  <span>·</span>
                  <span>Depth {lastResult.quantumMetrics.circuitDepth}</span>
                  <span>·</span>
                  <span>{lastResult.quantumMetrics.totalGates} Gates</span>
                  <span>·</span>
                  <span>{lastResult.quantumMetrics.executionTimeMs} ms</span>
                </div>
                <button
                  onClick={() => onSelectTab('quantum')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  Inspect Quantum Circuit <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <Cpu className="w-12 h-12 text-slate-700 mb-3" />
              <div className="text-sm font-semibold text-slate-400">Ready to Analyze Transaction</div>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Configure parameters on the left or select an attack simulation preset from the top bar to
                evaluate the hybrid quantum pipeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
