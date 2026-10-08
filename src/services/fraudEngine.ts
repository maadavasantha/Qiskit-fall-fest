import { TransactionInput, AnalysisResult, IntelligenceSignals } from '../types';
import { SEED_USERS, CITY_COORDS, INITIAL_GRAPH_NODES, INITIAL_GRAPH_LINKS } from '../data/mockDatabase';
import { simulateQuantumCircuit } from './quantumEngine';

// Haversine distance in kilometers
function getHaversineDistanceKm(cityA: string, cityB: string): number {
  const coordA = CITY_COORDS[cityA] || { lat: 17.3850, lng: 78.4867 };
  const coordB = CITY_COORDS[cityB] || { lat: 17.3850, lng: 78.4867 };

  const R = 6371; // km
  const dLat = ((coordB.lat - coordA.lat) * Math.PI) / 180;
  const dLon = ((coordB.lng - coordA.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coordA.lat * Math.PI) / 180) *
      Math.cos((coordB.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function analyzeTransaction(input: TransactionInput): AnalysisResult {
  const user = SEED_USERS.find(u => u.userId === input.userId) || {
    userId: input.userId,
    name: 'Unknown User',
    avgAmount: 8000,
    stdAmount: 3000,
    frequentLocation: 'Hyderabad',
    knownDevices: ['DEV901'],
    registeredDate: '2024-01-01',
  };

  // 1. Device Trust
  const isKnownDevice = user.knownDevices.includes(input.deviceId);
  const isRogueDevice = input.deviceId.includes('ROGUE') || input.deviceId.includes('EMU') || input.deviceId.includes('TOR');
  const deviceTrust = isKnownDevice ? 95 : (isRogueDevice ? 12 : 45);
  const isNewDevice = !isKnownDevice;

  // 2. Location & Impossible Travel
  const distanceKm = Number(getHaversineDistanceKm(user.frequentLocation, input.location).toFixed(1));
  // Assume a 45 min interval between typical interactions
  const simulatedTimeDiffHours = 0.75;
  const travelSpeedKmh = Number((distanceKm / simulatedTimeDiffHours).toFixed(1));
  const isImpossibleTravel = distanceKm > 400 && travelSpeedKmh > 850;
  const isAnomalousLocation = distanceKm > 350;

  // 3. Behaviour / Amount Z-Score
  const zScore = Number((Math.abs(input.amount - user.avgAmount) / Math.max(user.stdAmount, 500)).toFixed(2));
  const isUnusualAmount = zScore > 2.5;

  // 4. Velocity
  const isBurstVelocity = input.recentTxns5m >= 4;

  // 5. Beneficiary & Network Graph Analysis
  const flaggedBeneficiaries = ['B204', 'B305', 'B_MULE_501', 'U1009'];
  const isFlaggedMule = flaggedBeneficiaries.includes(input.beneficiaryId);
  const isInFraudRing = input.beneficiaryId === 'B204' || input.beneficiaryId === 'B305';
  const networkRiskScore = isInFraudRing ? 0.88 : (isFlaggedMule ? 0.75 : 0.08);

  const intelligence: IntelligenceSignals = {
    isNewDevice,
    deviceTrust,
    isImpossibleTravel,
    isAnomalousLocation,
    distanceKm,
    travelSpeedKmh,
    isUnusualAmount,
    zScore,
    velocity5m: input.recentTxns5m,
    isBurstVelocity,
    isFlaggedMule,
    isInFraudRing,
    networkRiskScore,
  };

  // 6. Classical ML Probability (Random Forest simulation)
  let classicalRiskScore = 0.05;
  if (isUnusualAmount) classicalRiskScore += 0.28;
  if (isNewDevice) classicalRiskScore += 0.22;
  if (isAnomalousLocation) classicalRiskScore += 0.20;
  if (isBurstVelocity) classicalRiskScore += 0.24;
  if (isFlaggedMule) classicalRiskScore += 0.26;
  const classicalProbability = Number(Math.min(Math.max(classicalRiskScore, 0.03), 0.96).toFixed(4));

  // 7. Quantum ML Model via Variational Quantum Classifier (Neelima)
  const { quantumProbability, metrics: quantumMetrics } = simulateQuantumCircuit(
    input.amount,
    input.recentTxns5m,
    deviceTrust,
    distanceKm
  );

  // 8. Hybrid Model Fusion
  // P_hybrid combines linear decision boundaries with quantum non-linear state overlap
  const alpha = 0.55; // Quantum weight
  const baseEnsemble = alpha * quantumProbability + (1 - alpha) * classicalProbability;
  const concordance = 1.0 - Math.abs(quantumProbability - classicalProbability);
  const synergyBoost = (quantumProbability > 0.6 && classicalProbability > 0.6) ? (0.06 * concordance) : 0;
  const rawHybrid = baseEnsemble + synergyBoost + (networkRiskScore * 0.08);
  const hybridProbability = Number(Math.min(Math.max(rawHybrid, 0.02), 0.99).toFixed(4));

  // 9. Risk Engine & Adaptive Thresholding (Gay3)
  const adaptiveFactor = input.adaptiveFactor ?? 1.0;
  let hardPenalties = 0;
  if (isNewDevice) hardPenalties += 10;
  if (isImpossibleTravel) hardPenalties += 16;
  if (isFlaggedMule) hardPenalties += 16;
  if (isBurstVelocity) hardPenalties += 12;
  if (isInFraudRing) hardPenalties += 18;

  const rawScore = (hybridProbability * 100 * 0.70 + hardPenalties) * adaptiveFactor;
  const riskScore = Number(Math.min(Math.max(rawScore, 1), 99).toFixed(1));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  let decision: 'ALLOW' | 'VERIFY' | 'BLOCK + ALERT';

  if (riskScore <= 30) {
    riskLevel = 'LOW';
    decision = 'ALLOW';
  } else if (riskScore <= 70) {
    riskLevel = 'MEDIUM';
    decision = 'VERIFY';
  } else {
    riskLevel = 'HIGH';
    decision = 'BLOCK + ALERT';
  }

  // 10. Explainability & Fraud DNA
  const reasons: string[] = [];
  const dnaComponents: string[] = [];

  if (isNewDevice) {
    reasons.push(isRogueDevice ? 'Untrusted/Rogue emulated hardware environment detected' : 'Unrecognized or newly registered device');
    dnaComponents.push('NEW_DEV');
  }
  if (isImpossibleTravel) {
    reasons.push(`Physically impossible travel speed (${travelSpeedKmh} km/h over ${distanceKm} km)`);
    dnaComponents.push('IMPOSSIBLE_TRAVEL');
  } else if (isAnomalousLocation) {
    reasons.push(`Geolocation differs by ${distanceKm} km from user's primary centroid (${user.frequentLocation})`);
    dnaComponents.push('GEO_ANOMALY');
  }
  if (isUnusualAmount) {
    reasons.push(`Transaction amount deviates abnormally from user average (₹${input.amount.toLocaleString()} vs ₹${user.avgAmount.toLocaleString()}, Z-score: +${zScore}σ)`);
    dnaComponents.push('AMOUNT_ANOMALY');
  }
  if (isBurstVelocity) {
    reasons.push(`Abnormal transaction frequency (${input.recentTxns5m} transfers within 5 minutes)`);
    dnaComponents.push('HIGH_VELOCITY');
  }
  if (isFlaggedMule) {
    reasons.push(`Beneficiary account (${input.beneficiaryId}) has confirmed linkage to known mule accounts`);
    dnaComponents.push('MULE_ACCOUNT');
  }
  if (isInFraudRing) {
    reasons.push(`Graph topology reveals account participating in an active cyclic money laundering ring`);
    dnaComponents.push('RING_CYCLE');
  }

  if (reasons.length === 0) {
    reasons.push('Normal transaction volume and recognized device aligned with baseline history');
    dnaComponents.push('NORMAL_BASELINE');
  }

  const fraudDna = `[DNA] ${dnaComponents.join(' • ')}`;

  // Feature Attribution (SHAP-style normalized impacts)
  const featureAttributions = [
    { feature: 'Device Trust', impact: isNewDevice ? 24 : -12, isNegative: isNewDevice },
    { feature: 'Geolocation Jump', impact: isImpossibleTravel ? 28 : (isAnomalousLocation ? 16 : -8), isNegative: isAnomalousLocation },
    { feature: 'Amount Deviation', impact: isUnusualAmount ? 20 : -14, isNegative: isUnusualAmount },
    { feature: 'Transaction Velocity', impact: isBurstVelocity ? 18 : -10, isNegative: isBurstVelocity },
    { feature: 'Mule Graph Linkage', impact: isFlaggedMule ? 22 : -15, isNegative: isFlaggedMule },
  ];

  return {
    transactionId: `TXN${Math.floor(100000 + Math.random() * 900000)}`,
    userId: input.userId,
    amount: input.amount,
    beneficiaryId: input.beneficiaryId,
    deviceId: input.deviceId,
    location: input.location,
    transactionType: input.transactionType,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    riskScore,
    riskLevel,
    decision,
    classicalProbability,
    quantumProbability,
    hybridProbability,
    quantumMetrics,
    intelligence,
    reasons,
    fraudDna,
    featureAttributions,
    caseStatus: decision === 'BLOCK + ALERT' ? 'OPEN' : (decision === 'VERIFY' ? 'INVESTIGATING' : 'RESOLVED_ALLOWED'),
  };
}
