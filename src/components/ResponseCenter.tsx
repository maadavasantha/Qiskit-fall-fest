import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Download,
  CheckCircle,
  Clock,
  Filter,
  FileText,
  UserCheck,
} from 'lucide-react';

interface ResponseCenterProps {
  transactions: AnalysisResult[];
  onUpdateStatus: (txnId: string, newStatus: AnalysisResult['caseStatus']) => void;
}

export const ResponseCenter: React.FC<ResponseCenterProps> = ({ transactions, onUpdateStatus }) => {
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'HIGH' | 'VERIFY'>('ALL');
  const [selectedTxn, setSelectedTxn] = useState<AnalysisResult | null>(transactions[0] || null);

  const filteredList = transactions.filter((t) => {
    if (filter === 'HIGH') return t.riskLevel === 'HIGH';
    if (filter === 'VERIFY') return t.riskLevel === 'MEDIUM';
    if (filter === 'OPEN') return t.caseStatus === 'OPEN' || t.caseStatus === 'INVESTIGATING';
    return true;
  });

  const handleExportJSON = (txn: AnalysisResult) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(txn, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `incident_${txn.transactionId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="border border-slate-800 bg-slate-900/50 rounded-xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Fraud Incident & Response Operations Center</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 font-mono font-normal">
                Live Incident Queue
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Owner: Gay3 & Vasantha. Triage flagged payment transactions, trigger step-up 2FA challenges, freeze
              compromised sender accounts, and export AML audit dossiers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filter === 'ALL'
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-700'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              All Events ({transactions.length})
            </button>
            <button
              onClick={() => setFilter('HIGH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filter === 'HIGH'
                  ? 'bg-rose-950/60 text-rose-300 border-rose-700'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Blocked Alerts ({transactions.filter((t) => t.riskLevel === 'HIGH').length})
            </button>
            <button
              onClick={() => setFilter('VERIFY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filter === 'VERIFY'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-700'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Verification Needed ({transactions.filter((t) => t.riskLevel === 'MEDIUM').length})
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incident Table (8 cols) */}
        <div className="lg:col-span-8 border border-slate-800 bg-slate-900/90 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Transaction Stream & Case Queue
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Showing {filteredList.length} of {transactions.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Txn ID / Time</th>
                  <th className="py-2.5 px-3">Sender & Recipient</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  <th className="py-2.5 px-3 text-center">Score</th>
                  <th className="py-2.5 px-3">Decision</th>
                  <th className="py-2.5 px-3">Case Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
                {filteredList.map((t) => {
                  const isSelected = selectedTxn?.transactionId === t.transactionId;
                  return (
                    <tr
                      key={t.transactionId}
                      onClick={() => setSelectedTxn(t)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-slate-800/80 font-medium' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="text-slate-200 font-bold">{t.transactionId}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{t.timestamp}</div>
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <div className="text-slate-200">
                          {t.userId} &rarr; {t.beneficiaryId}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {t.location} · {t.deviceId}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-100 font-bold">
                        ₹{t.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            t.riskLevel === 'HIGH'
                              ? 'bg-rose-950 text-rose-300'
                              : t.riskLevel === 'MEDIUM'
                              ? 'bg-amber-950 text-amber-300'
                              : 'bg-emerald-950 text-emerald-300'
                          }`}
                        >
                          {t.riskScore}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span
                          className={`text-xs font-semibold ${
                            t.decision === 'BLOCK + ALERT'
                              ? 'text-rose-400'
                              : t.decision === 'VERIFY'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {t.decision}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span className="text-[11px] text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {t.caseStatus || 'OPEN'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Incident Actions Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedTxn ? (
            <div className="border border-slate-800 bg-slate-900/90 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                  Case Action Terminal
                </div>
                <span className="text-xs font-mono text-cyan-400">{selectedTxn.transactionId}</span>
              </div>

              <div>
                <div className="text-xs text-slate-400">Transaction Summary</div>
                <div className="text-base font-bold text-white mt-0.5">
                  ₹{selectedTxn.amount.toLocaleString()} ({selectedTxn.transactionType})
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Sender: <strong className="text-white">{selectedTxn.userId}</strong> &rarr; Beneficiary:{' '}
                  <strong className="text-white">{selectedTxn.beneficiaryId}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onUpdateStatus(selectedTxn.transactionId, 'FROZEN')}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-sm shadow-rose-950"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Freeze Sender Account & Device</span>
                </button>

                <button
                  onClick={() => onUpdateStatus(selectedTxn.transactionId, 'RESOLVED_ALLOWED')}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Request Step-Up 2FA Biometric</span>
                </button>

                <button
                  onClick={() => onUpdateStatus(selectedTxn.transactionId, 'RESOLVED_ALLOWED')}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mark as False Positive (Allow)</span>
                </button>

                <button
                  onClick={() => handleExportJSON(selectedTxn)}
                  className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-700 text-slate-300 font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Case Dossier (JSON)</span>
                </button>
              </div>

              {/* Justification Reasons */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-300">Flag Reasons:</div>
                <ul className="space-y-1 text-slate-400 text-[11px]">
                  {selectedTxn.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 text-center text-xs text-slate-500">
              Select an incident from the table to manage its response status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
