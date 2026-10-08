import React, { useState } from 'react';
import { Cpu, Zap, Activity, Info, Layers, RefreshCw } from 'lucide-react';
import { QuantumMetrics } from '../types';

interface QuantumLabProps {
  metrics?: QuantumMetrics;
  quantumProbability?: number;
}

export const QuantumLab: React.FC<QuantumLabProps> = ({
  metrics = {
    qubits: 4,
    circuitDepth: 12,
    totalGates: 26,
    hadamardCount: 4,
    cnotCount: 6,
    rotationGates: 16,
    executionTimeMs: 18.4,
    featureAnglesRad: [1.256, 0.628, 2.199, 1.571],
    stateProbabilities: [
      { state: '|0000>', probability: 0.041 },
      { state: '|0001>', probability: 0.052 },
      { state: '|0010>', probability: 0.048 },
      { state: '|0011>', probability: 0.063 },
      { state: '|0100>', probability: 0.055 },
      { state: '|0101>', probability: 0.068 },
      { state: '|0110>', probability: 0.064 },
      { state: '|0111>', probability: 0.079 },
      { state: '|1000>', probability: 0.059 },
      { state: '|1001>', probability: 0.073 },
      { state: '|1010>', probability: 0.069 },
      { state: '|1011>', probability: 0.084 },
      { state: '|1100>', probability: 0.077 },
      { state: '|1101>', probability: 0.091 },
      { state: '|1110>', probability: 0.086 },
      { state: '|1111>', probability: 0.091 },
    ],
    blochAngles: [
      { qubit: 'q0 (Amount)', theta: 1.256, phi: 0.785 },
      { qubit: 'q1 (Velocity)', theta: 0.628, phi: -0.421 },
      { qubit: 'q2 (Device)', theta: 2.199, phi: 1.257 },
      { qubit: 'q3 (Location)', theta: 1.571, phi: 0.314 },
    ],
  },
  quantumProbability = 0.82,
}) => {
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  const qubitLabels = [
    { id: 'q0', label: 'q[0]: Amount', feature: 'Scaled Txn Amount', angle: metrics.featureAnglesRad[0] ?? 1.25 },
    { id: 'q1', label: 'q[1]: Velocity', feature: '5m Txn Frequency', angle: metrics.featureAnglesRad[1] ?? 0.62 },
    { id: 'q2', label: 'q[2]: Device', feature: 'Device Risk Angle', angle: metrics.featureAnglesRad[2] ?? 2.19 },
    { id: 'q3', label: 'q[3]: Location', feature: 'Geographic Distance', angle: metrics.featureAnglesRad[3] ?? 1.57 },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="border border-slate-800 bg-slate-900/50 rounded-xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Quantum Machine Learning Lab & Circuit Inspector</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 font-mono font-normal">
                Qiskit 1.x VQC
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Owner: Neelima (Quantum ML Architecture). Implements a Variational Quantum Classifier (VQC) with
              ZZFeatureMap second-order Pauli expansion and RealAmplitudes ansatz.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 font-mono">Predicted Quantum Fraud Prob</div>
            <div className="text-2xl font-bold text-cyan-300 font-mono tabular-nums">
              {(quantumProbability * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Quantum Metric Hardware Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400">Total Qubits</div>
          <div className="text-xl font-bold text-slate-100 font-mono mt-0.5">{metrics.qubits}</div>
          <div className="text-[10px] text-slate-400 font-mono">Hilbert Dim: 2⁴ = 16</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400">Circuit Depth</div>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-0.5">{metrics.circuitDepth}</div>
          <div className="text-[10px] text-slate-400 font-mono">2-reps linear ansatz</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400">Total Quantum Gates</div>
          <div className="text-xl font-bold text-indigo-400 font-mono mt-0.5">{metrics.totalGates}</div>
          <div className="text-[10px] text-slate-400 font-mono">4 H + 16 Rot + 6 CNOT</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400">Entangling CNOTs</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{metrics.cnotCount}</div>
          <div className="text-[10px] text-slate-400 font-mono">Nearest-neighbor chain</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400">Execution Latency</div>
          <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">{metrics.executionTimeMs} ms</div>
          <div className="text-[10px] text-slate-400 font-mono">Local Aer simulator</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400">Encoding Scheme</div>
          <div className="text-sm font-bold text-slate-200 mt-1 truncate">ZZFeatureMap</div>
          <div className="text-[10px] text-slate-400 font-mono">Non-linear phase mapping</div>
        </div>
      </div>

      {/* Main Visual Quantum Circuit Diagram */}
      <div className="border border-slate-800 bg-slate-900/90 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Interactive Parameterized Quantum Circuit (PQC)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any gate to inspect mathematical transformation, rotation parameters, and entanglement action.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="w-2.5 h-2.5 rounded bg-cyan-500/20 border border-cyan-400 inline-block"></span> H Gate
            <span className="w-2.5 h-2.5 rounded bg-indigo-500/20 border border-indigo-400 inline-block ml-2"></span> Rz(ϕ)
            <span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-400 inline-block ml-2"></span> Ry(θ)
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-400 inline-block ml-2"></span> CNOT
          </div>
        </div>

        {/* Visual Circuit Canvas Grid */}
        <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 sm:p-6 overflow-x-auto">
          <div className="min-w-[760px] space-y-7 relative py-2">
            {qubitLabels.map((q, idx) => (
              <div key={q.id} className="flex items-center gap-4 relative">
                {/* Qubit identifier */}
                <div className="w-28 shrink-0">
                  <div className="font-mono text-xs font-bold text-slate-200">{q.id}</div>
                  <div className="text-[10px] text-slate-400 truncate">{q.feature}</div>
                </div>

                {/* Wire container */}
                <div className="flex-1 flex items-center relative">
                  {/* Background Quantum Wire */}
                  <div className="absolute left-0 right-0 h-[2px] bg-slate-800 z-0"></div>

                  {/* Gates Sequence */}
                  <div className="relative z-10 flex items-center justify-between w-full pr-8">
                    {/* 1. Initial State */}
                    <div className="font-mono text-xs text-slate-400 bg-slate-950 px-1 border border-slate-800 rounded">
                      |0⟩
                    </div>

                    {/* 2. Hadamard State Preparation Gate */}
                    <button
                      onClick={() =>
                        setSelectedGate(
                          `Hadamard H on ${q.id}: Creates equal superposition state (|0⟩ + |1⟩)/√2.`
                        )
                      }
                      className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-500/80 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center hover:scale-105 transition-transform shadow-sm shadow-cyan-950"
                      title="Hadamard Gate (Superposition)"
                    >
                      H
                    </button>

                    {/* 3. Parameterized Feature Encoding Rz */}
                    <button
                      onClick={() =>
                        setSelectedGate(
                          `Rz(ϕ${idx}) on ${q.id}: Encodes feature angle ϕ = ${q.angle.toFixed(
                            3
                          )} rad via phase rotation e^{-iϕ/2 Z}.`
                        )
                      }
                      className="px-2 h-8 rounded bg-indigo-950/80 border border-indigo-500/80 text-indigo-200 font-mono text-[10px] flex items-center justify-center hover:scale-105 transition-transform"
                      title={`Rz(${q.angle.toFixed(2)} rad)`}
                    >
                      Rz({q.angle.toFixed(2)})
                    </button>

                    {/* 4. CNOT Entanglement Indicator */}
                    <button
                      onClick={() =>
                        setSelectedGate(
                          `Entanglement CNOT pair between q[${idx}] and q[${(idx + 1) % 4}]: Entangles quantum features.`
                        )
                      }
                      className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center hover:scale-110 transition-transform"
                      title="CNOT Control/Target"
                    >
                      {idx % 2 === 0 ? '●' : '⊕'}
                    </button>

                    {/* 5. Variational Ansatz Rotation Ry(theta) */}
                    <button
                      onClick={() =>
                        setSelectedGate(
                          `Variational Ry(θ${idx}) Ansatz layer on ${q.id}: Parameterized rotation with trained weight θ.`
                        )
                      }
                      className="px-2 h-8 rounded bg-amber-950/80 border border-amber-500/80 text-amber-200 font-mono text-[10px] flex items-center justify-center hover:scale-105 transition-transform"
                      title="Variational Ry(θ)"
                    >
                      Ry(θ_{idx})
                    </button>

                    {/* 6. Measurement readout */}
                    <button
                      onClick={() =>
                        setSelectedGate(`Pauli-Z Readout Measurement on ${q.id}: Projects state into computational basis.`)
                      }
                      className="w-8 h-8 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs flex items-center justify-center hover:border-cyan-400"
                      title="Measurement"
                    >
                      M
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Gate Inspection Box */}
        {selectedGate && (
          <div className="bg-slate-950 border border-cyan-900/60 rounded-lg p-3 flex items-start gap-2.5 text-xs">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-slate-300 flex-1">{selectedGate}</div>
            <button
              onClick={() => setSelectedGate(null)}
              className="text-slate-400 hover:text-slate-200 text-[11px]"
            >
              dismiss
            </button>
          </div>
        )}
      </div>

      {/* Statevector Probability Distribution & Bloch Angles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 16-Basis State Probabilities (7 cols) */}
        <div className="lg:col-span-7 border border-slate-800 bg-slate-900/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Statevector Probability Distribution (|0000⟩ to |1111⟩)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">1024 Shots Simulation</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2">
            {metrics.stateProbabilities.map((item) => (
              <div
                key={item.state}
                className="bg-slate-950 border border-slate-800 rounded p-2 text-center flex flex-col justify-end h-28"
              >
                <div className="w-full bg-slate-900 rounded-t overflow-hidden flex items-end justify-center h-16 mb-1">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-indigo-500 rounded-t transition-all duration-300"
                    style={{ height: `${Math.min(item.probability * 400, 100)}%` }}
                  ></div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 font-semibold">{item.state}</div>
                <div className="text-[10px] font-mono text-cyan-300 font-bold tabular-nums">
                  {(item.probability * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloch Sphere Coordinates & Scientific Rationale (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-slate-800 bg-slate-900/80 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              Qubit Bloch Coordinates (θ, ϕ)
            </h3>
            <div className="space-y-2 text-xs">
              {metrics.blochAngles.map((b) => (
                <div
                  key={b.qubit}
                  className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between"
                >
                  <span className="font-mono text-slate-300 font-medium">{b.qubit}</span>
                  <div className="flex gap-3 font-mono tabular-nums text-slate-400 text-[11px]">
                    <span>θ = {b.theta} rad</span>
                    <span>ϕ = {b.phi} rad</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-indigo-950 bg-indigo-950/20 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              Scientific Defense: Why Quantum for Payment Fraud?
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Traditional ML models evaluate payment risk along planar thresholds. By projecting 4 correlated features
              (amount, burst frequency, hardware trust, and impossible travel speed) into an entangling 16-dimensional
              Hilbert space, the parameterised quantum circuit uncovers non-linear correlated anomalies without
              combinatorial feature explosion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
