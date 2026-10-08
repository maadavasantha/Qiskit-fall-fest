export interface UserProfile {
  userId: string;
  name: string;
  avgAmount: number;
  stdAmount: number;
  frequentLocation: string;
  knownDevices: string[];
  registeredDate: string;
}

export interface TransactionInput {
  userId: string;
  amount: number;
  beneficiaryId: string;
  deviceId: string;
  location: string;
  transactionType: 'UPI' | 'IMPS' | 'NEFT' | 'CREDIT_CARD' | 'WALLET';
  recentTxns5m: number;
  recentTxns1h: number;
  adaptiveFactor?: number;
}

export interface QuantumMetrics {
  qubits: number;
  circuitDepth: number;
  totalGates: number;
  hadamardCount: number;
  cnotCount: number;
  rotationGates: number;
  executionTimeMs: number;
  featureAnglesRad: number[];
  stateProbabilities: { state: string; probability: number }[];
  blochAngles: { qubit: string; theta: number; phi: number }[];
}

export interface IntelligenceSignals {
  isNewDevice: boolean;
  deviceTrust: number;
  isImpossibleTravel: boolean;
  isAnomalousLocation: boolean;
  distanceKm: number;
  travelSpeedKmh: number;
  isUnusualAmount: boolean;
  zScore: number;
  velocity5m: number;
  isBurstVelocity: boolean;
  isFlaggedMule: boolean;
  isInFraudRing: boolean;
  networkRiskScore: number;
}

export interface AnalysisResult {
  transactionId: string;
  userId: string;
  amount: number;
  beneficiaryId: string;
  deviceId: string;
  location: string;
  transactionType: string;
  timestamp: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  decision: 'ALLOW' | 'VERIFY' | 'BLOCK + ALERT';
  classicalProbability: number;
  quantumProbability: number;
  hybridProbability: number;
  quantumMetrics: QuantumMetrics;
  intelligence: IntelligenceSignals;
  reasons: string[];
  fraudDna: string;
  featureAttributions: { feature: string; impact: number; isNegative: boolean }[];
  caseStatus?: 'OPEN' | 'INVESTIGATING' | 'RESOLVED_ALLOWED' | 'RESOLVED_BLOCKED' | 'FROZEN';
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'user' | 'beneficiary' | 'mule';
  flagged: boolean;
  x: number;
  y: number;
  inDegree: number;
  outDegree: number;
  totalVolume: number;
}

export interface GraphLink {
  source: string;
  target: string;
  weight: number;
  flagged: boolean;
}

export interface BenchmarkModel {
  name: string;
  category: 'Classical' | 'Quantum' | 'Hybrid';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  latencyMs: number;
  hardware: string;
  notes: string;
}
