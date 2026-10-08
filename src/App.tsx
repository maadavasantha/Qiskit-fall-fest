/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { TransactionAnalyzer } from './components/TransactionAnalyzer';
import { QuantumLab } from './components/QuantumLab';
import { NetworkGraph } from './components/NetworkGraph';
import { ModelBenchmark } from './components/ModelBenchmark';
import { ExplainabilityView } from './components/ExplainabilityView';
import { ResponseCenter } from './components/ResponseCenter';
import { ProjectWorkspace } from './components/ProjectWorkspace';
import { analyzeTransaction } from './services/fraudEngine';
import { TransactionInput, AnalysisResult } from './types';
import { ATTACK_SCENARIOS } from './data/mockDatabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('analyzer');
  const [adaptiveFactor, setAdaptiveFactor] = useState<number>(1.0);

  // Pre-seed with initial realistic transactions so the platform is immediately active
  const initialATO = analyzeTransaction(ATTACK_SCENARIOS[0].payload);
  const initialNormal = analyzeTransaction(ATTACK_SCENARIOS[4].payload);
  const initialSmurf = analyzeTransaction(ATTACK_SCENARIOS[1].payload);

  const [transactions, setTransactions] = useState<AnalysisResult[]>([
    initialATO,
    initialSmurf,
    initialNormal,
  ]);
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(initialATO);

  const handleAnalyze = (input: TransactionInput): AnalysisResult => {
    const result = analyzeTransaction(input);
    setLastResult(result);
    setTransactions((prev) => [result, ...prev]);
    return result;
  };

  const handleRunAttackScenario = (scenario: (typeof ATTACK_SCENARIOS)[0]) => {
    const result = handleAnalyze({ ...scenario.payload, adaptiveFactor });
    setActiveTab('analyzer');
  };

  const handleToggleAdaptiveFactor = () => {
    setAdaptiveFactor((prev) => (prev > 1.0 ? 1.0 : 1.25));
  };

  const handleUpdateStatus = (txnId: string, status: AnalysisResult['caseStatus']) => {
    setTransactions((prev) =>
      prev.map((t) => (t.transactionId === txnId ? { ...t, caseStatus: status } : t))
    );
    if (lastResult?.transactionId === txnId) {
      setLastResult((prev) => (prev ? { ...prev, caseStatus: status } : null));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRunAttackScenario={handleRunAttackScenario}
        adaptiveFactor={adaptiveFactor}
        onToggleAdaptiveFactor={handleToggleAdaptiveFactor}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 sm:py-8">
        {activeTab === 'analyzer' && (
          <TransactionAnalyzer
            onAnalyze={handleAnalyze}
            lastResult={lastResult}
            onSelectTab={setActiveTab}
            onUpdateStatus={handleUpdateStatus}
            adaptiveFactor={adaptiveFactor}
          />
        )}

        {activeTab === 'quantum' && (
          <QuantumLab
            metrics={lastResult?.quantumMetrics}
            quantumProbability={lastResult?.quantumProbability}
          />
        )}

        {activeTab === 'network' && <NetworkGraph />}

        {activeTab === 'benchmark' && <ModelBenchmark />}

        {activeTab === 'explain' && <ExplainabilityView lastResult={lastResult} />}

        {activeTab === 'response' && (
          <ResponseCenter
            transactions={transactions}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeTab === 'workspace' && <ProjectWorkspace />}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 lg:px-8 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">VNQFF-05</span>
            <span aria-hidden="true">·</span>
            <span>Quantum-Enhanced Digital Payment Fraud Detection</span>
            <span aria-hidden="true">·</span>
            <span>Hybrid Qiskit ML & Graph Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Vasantha · Niharika · Chingu · Neelima · Gay3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
