import React, { useState } from 'react';
import { Share2, AlertOctagon, RefreshCw, CheckCircle, Search, ShieldAlert } from 'lucide-react';
import { INITIAL_GRAPH_NODES, INITIAL_GRAPH_LINKS } from '../data/mockDatabase';
import { GraphNode } from '../types';

export const NetworkGraph: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_GRAPH_NODES);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(INITIAL_GRAPH_NODES[4]); // B204 selected by default
  const [filterMode, setFilterMode] = useState<'all' | 'flagged' | 'mules'>('all');

  const filteredNodes = nodes.filter((n) => {
    if (filterMode === 'flagged') return n.flagged;
    if (filterMode === 'mules') return n.type === 'mule';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="border border-slate-800 bg-slate-900/50 rounded-xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Graph-Based Fraud Network & Mule Ring Visualizer</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950/60 text-rose-400 border border-rose-800/60 font-mono font-normal">
                Cycle Ring Detected
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Owner: Chingu (Feature Engineering & Graph Analysis). Identifies money-mule pass-through relays and
              cyclic transaction loops using NetworkX directed-graph topology algorithms.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filterMode === 'all'
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-700'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              All Accounts ({nodes.length})
            </button>
            <button
              onClick={() => setFilterMode('mules')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filterMode === 'mules'
                  ? 'bg-rose-950/60 text-rose-300 border-rose-700'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Mule Relays (2)
            </button>
            <button
              onClick={() => setFilterMode('flagged')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filterMode === 'flagged'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-700'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Flagged Only (3)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: SVG Network Visualizer (8 cols) */}
        <div className="lg:col-span-8 border border-slate-800 bg-slate-900/90 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> User Accounts
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block"></span> Verified Beneficiary
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block animate-pulse"></span> Mule / Ring Node
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Click any node to inspect</div>
          </div>

          {/* SVG Canvas */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 overflow-hidden relative min-h-[460px] flex items-center justify-center">
            <svg viewBox="0 0 640 460" className="w-full h-full max-h-[460px] select-none">
              <defs>
                <marker
                  id="arrow-normal"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                </marker>
                <marker
                  id="arrow-flagged"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                </marker>
              </defs>

              {/* Render Directed Links */}
              {INITIAL_GRAPH_LINKS.map((link, idx) => {
                const sNode = nodes.find((n) => n.id === link.source);
                const tNode = nodes.find((n) => n.id === link.target);
                if (!sNode || !tNode) return null;

                const isRingEdge =
                  (link.source === 'B204' && link.target === 'B305') ||
                  (link.source === 'B305' && link.target === 'U1009') ||
                  (link.source === 'U1009' && link.target === 'B204');

                return (
                  <g key={idx}>
                    <line
                      x1={sNode.x}
                      y1={sNode.y}
                      x2={tNode.x}
                      y2={tNode.y}
                      stroke={isRingEdge ? '#f43f5e' : link.flagged ? '#fb7185' : '#334155'}
                      strokeWidth={isRingEdge ? 2.5 : link.flagged ? 2 : 1.5}
                      strokeDasharray={isRingEdge ? '4 3' : 'none'}
                      markerEnd={link.flagged ? 'url(#arrow-flagged)' : 'url(#arrow-normal)'}
                      className={isRingEdge ? 'animate-pulse' : ''}
                    />
                    {/* Amount weight label on link */}
                    <text
                      x={(sNode.x + tNode.x) / 2}
                      y={(sNode.y + tNode.y) / 2 - 6}
                      fill={isRingEdge ? '#fda4af' : '#64748b'}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      ₹{(link.weight / 1000).toFixed(0)}k
                    </text>
                  </g>
                );
              })}

              {/* Render Nodes */}
              {filteredNodes.map((n) => {
                const isSelected = selectedNode?.id === n.id;
                const isMule = n.type === 'mule';

                return (
                  <g
                    key={n.id}
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setSelectedNode(n)}
                  >
                    {/* Pulsing halo for flagged ring mules */}
                    {n.flagged && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={isSelected ? 24 : 18}
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Selection Ring */}
                    {isSelected && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={22}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Core Node Circle */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={16}
                      fill={
                        n.flagged
                          ? '#881337'
                          : n.type === 'beneficiary'
                          ? '#083344'
                          : '#172554'
                      }
                      stroke={
                        n.flagged
                          ? '#f43f5e'
                          : n.type === 'beneficiary'
                          ? '#22d3ee'
                          : '#3b82f6'
                      }
                      strokeWidth="2"
                    />

                    {/* Label inside node */}
                    <text
                      x={n.x}
                      y={n.y + 4}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {n.id.substring(0, 4)}
                    </text>

                    {/* Node text label below */}
                    <text
                      x={n.x}
                      y={n.y + 26}
                      fill={n.flagged ? '#fca5a5' : '#cbd5e1'}
                      fontSize="10"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      textAnchor="middle"
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
            <span className="font-mono text-[11px] text-rose-400">
              Active Cyclic Ring: B204 &rarr; B305 &rarr; U1009 &rarr; B204 (₹241,000 laundered)
            </span>
            <span className="text-[11px] text-slate-400">Total Graph Flow: ₹334,900</span>
          </div>
        </div>

        {/* Right: Selected Node Intelligence Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedNode ? (
            <div className="border border-slate-800 bg-slate-900/90 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                  Node Analysis
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono font-semibold ${
                    selectedNode.flagged
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {selectedNode.flagged ? 'FLAGGED HIGH RISK' : 'TRUSTED ACCOUNT'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-mono">{selectedNode.id}</h3>
                <div className="text-xs text-slate-300">{selectedNode.label}</div>
              </div>

              {/* In/Out Degree Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg">
                  <div className="text-slate-400 text-[10px]">In-Degree (Incoming)</div>
                  <div className="text-base font-bold text-cyan-400 font-mono mt-0.5">
                    {selectedNode.inDegree} txns
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg">
                  <div className="text-slate-400 text-[10px]">Out-Degree (Outgoing)</div>
                  <div className="text-base font-bold text-indigo-400 font-mono mt-0.5">
                    {selectedNode.outDegree} txns
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs space-y-1">
                <div className="text-[11px] text-slate-400">Total Transaction Volume</div>
                <div className="text-base font-bold text-slate-100 font-mono">
                  ₹{selectedNode.totalVolume.toLocaleString()}
                </div>
              </div>

              {/* Mule / Ring Diagnostics */}
              <div className="space-y-2 text-xs">
                <div className="text-xs font-semibold text-slate-400">Topology Diagnostics</div>
                <div className="bg-slate-950 border border-slate-800/80 p-2.5 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mule Symmetry:</span>
                    <span className="font-mono text-slate-200">
                      {selectedNode.inDegree > 0 && selectedNode.outDegree > 0
                        ? 'High Pass-Through (Mule Candidate)'
                        : 'Terminal Node'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cyclic Ring Loop:</span>
                    <span className={`font-mono font-semibold ${selectedNode.flagged ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {selectedNode.flagged ? 'YES (Cycle Length = 3)' : 'NO'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Explanatory summary */}
              <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded border border-slate-800">
                {selectedNode.flagged
                  ? 'This account acts as a high-speed intermediary node with balanced inflow and outflow within an interconnected cluster. Recommended action: Mark account for immediate transaction hold and AML verification.'
                  : 'Account exhibits standard terminal purchasing behavior without smurfing or cyclical funneling.'}
              </div>
            </div>
          ) : (
            <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 text-center text-xs text-slate-500">
              Select any graph node on the left to inspect its degree centrality and mule indicators.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
