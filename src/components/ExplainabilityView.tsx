import React from 'react';
import { AnalysisResult } from '../types';
import { HelpCircle, Sparkles, TrendingUp, Compass, Dna, ShieldCheck } from 'lucide-react';

interface ExplainabilityViewProps {
  lastResult: AnalysisResult | null;
}

export const ExplainabilityView: React.FC<ExplainabilityViewProps> = ({ lastResult }) => {
  const result = lastResult || {
    transactionId: 'TXN849201',
    userId: 'U1001',
    amount: 85000,
    beneficiaryId: 'B204',
    deviceId: 'DEV_ROGUE_991',
    location: 'Dubai',
    transactionType: 'UPI',
    timestamp: '14:22:09',
    riskScore: 88.5,
    riskLevel: 'HIGH' as const,
    decision: 'BLOCK + ALERT' as const,
    classicalProbability: 0.79,
    quantumProbability: 0.84,
    hybridProbability: 0.86,
    quantumMetrics: {
      qubits: 4,
      circuitDepth: 12,
      totalGates: 26,
      hadamardCount: 4,
      cnotCount: 6,
      rotationGates: 16,
      executionTimeMs: 19.2,
      featureAnglesRad: [1.25, 0.62, 2.19, 1.57],
      stateProbabilities: [],
      blochAngles: [],
    },
    intelligence: {
      isNewDevice: true,
      deviceTrust: 12,
      isImpossibleTravel: true,
      isAnomalousLocation: true,
      distanceKm: 2550,
      travelSpeedKmh: 3400,
      isUnusualAmount: true,
      zScore: 16.2,
      velocity5m: 1,
      isBurstVelocity: false,
      isFlaggedMule: true,
      isInFraudRing: true,
      networkRiskScore: 0.88,
    },
    reasons: [
      'Unrecognized or rogue emulated hardware device detected (DEV_ROGUE_991).',
      'Physically impossible travel speed detected (3400 km/h jump to Dubai).',
      'Transaction amount (₹85,000) is +16.2σ above historical user average (₹12,000).',
      'Destination account B204 is an active intermediary node in a known mule ring.',
    ],
    fraudDna: '[DNA] NEW_DEV • IMPOSSIBLE_TRAVEL • AMOUNT_ANOMALY • MULE_ACCOUNT • RING_CYCLE',
    featureAttributions: [
      { feature: 'Device Trust Anomaly', impact: 24, isNegative: true },
      { feature: 'Impossible Travel Jump', impact: 28, isNegative: true },
      { feature: 'Amount Z-Score Outlier', impact: 20, isNegative: true },
      { feature: 'Mule Ring Association', impact: 22, isNegative: true },
      { feature: 'Historical Account Age', impact: -6, isNegative: false },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="border border-slate-800 bg-slate-900/50 rounded-xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Explainable AI (XAI) & Fraud Pattern DNA</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950/60 text-indigo-400 border border-indigo-800/60 font-mono font-normal">
                Auditable Decisioning
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Owner: Gay3 (Risk Engine & Explainability). Translates opaque quantum state probabilities and classical
              decision trees into transparent, human-auditable justification factors for regulatory compliance.
            </p>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            Target Transaction:{' '}
            <span className="text-white font-bold">{result.transactionId}</span> ({result.decision})
          </div>
        </div>
      </div>

      {/* Fraud Pattern DNA Signature Spotlight */}
      <div className="border border-amber-900/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/20 rounded-xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Dna className="w-4 h-4 text-amber-400" />
          <span>Fraud Pattern DNA Representation</span>
        </div>
        <div className="font-mono text-sm sm:text-base font-bold text-amber-200 bg-slate-950/90 border border-amber-700/40 px-4 py-3 rounded-lg tracking-wide select-all">
          {result.fraudDna}
        </div>
        <p className="text-xs text-slate-400">
          Compact deterministic hash summarizing the primary risk genes: hardware identity, geolocation velocity,
          statistical amount deviation, and network topology status.
        </p>
      </div>

      {/* SHAP-Style Feature Attributions & Behavioral Deviation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SHAP Feature Contribution Waterfall (7 cols) */}
        <div className="lg:col-span-7 border border-slate-800 bg-slate-900/90 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              SHAP-Style Feature Risk Contribution (+/- Impact)
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Baseline = 5.0</span>
          </div>

          <div className="space-y-3 pt-2">
            {result.featureAttributions.map((attr, idx) => {
              const isRiskIncrease = attr.isNegative || attr.impact > 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{attr.feature}</span>
                    <span
                      className={`font-mono font-bold tabular-nums ${
                        isRiskIncrease ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {attr.impact > 0 ? `+${attr.impact}` : attr.impact} pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden flex">
                    {isRiskIncrease ? (
                      <div
                        className="bg-rose-500 rounded-full h-full transition-all"
                        style={{ width: `${Math.min(Math.abs(attr.impact) * 3, 100)}%` }}
                      ></div>
                    ) : (
                      <div
                        className="bg-emerald-500 rounded-full h-full transition-all ml-auto"
                        style={{ width: `${Math.min(Math.abs(attr.impact) * 3, 100)}%` }}
                      ></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-3">
            <span className="text-rose-400">Red: Elevates Fraud Risk Score</span>
            <span className="text-emerald-400">Green: Lowers Risk (Trust Signal)</span>
          </div>
        </div>

        {/* Behavioral Fingerprint & Deviation Centroid (5 cols) */}
        <div className="lg:col-span-5 border border-slate-800 bg-slate-900/90 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Behavioral Fingerprint Deviations
            </h3>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Amount Distribution Shift</div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-slate-200 font-mono">Current: ₹{result.amount.toLocaleString()}</span>
                <span className="font-mono text-rose-400 font-bold">
                  +{result.intelligence.zScore}σ Z-Score
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Baseline Normal: ₹12,000 ± ₹4,500 (99.7% of genuine txns lie below ₹25,500)
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Impossible Travel Speed</div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-slate-200 font-mono">{result.intelligence.travelSpeedKmh} km/h</span>
                <span className="font-mono text-rose-400 font-bold">PHYSICAL ANOMALY</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Maximum commercial airline velocity threshold: 850 km/h.
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Hardware Environment Integrity</div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-slate-200 font-mono">{result.deviceId}</span>
                <span className="font-mono text-amber-400 font-bold">
                  Trust: {result.intelligence.deviceTrust}/100
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Signature matches rooted virtual device emulator.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
