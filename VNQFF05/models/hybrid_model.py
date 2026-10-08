"""
VNQFF-05: Hybrid Quantum-Classical Model
Owner: Neelima (Quantum ML Architecture)
Fuses classical gradient baseline with quantum kernel/variational probability.
"""
import numpy as np

class HybridFraudModel:
    """
    Ensemble decision layer:
    P_hybrid = alpha * P_quantum + (1 - alpha) * P_classical + nonlinear_interaction
    """
    def __init__(self, quantum_weight=0.55):
        self.quantum_weight = quantum_weight
        
    def predict(self, classical_prob, quantum_prob, network_risk=0.0):
        # Quantum model captures complex multi-body entanglement between
        # velocity and geolocation jumps; classical captures linear threshold bounds.
        alpha = self.quantum_weight
        base_ensemble = (alpha * quantum_prob) + ((1.0 - alpha) * classical_prob)
        
        # Cross-layer reinforcement if both models identify high suspicion
        concordance = 1.0 - abs(quantum_prob - classical_prob)
        synergy_boost = 0.05 * concordance if (quantum_prob > 0.6 and classical_prob > 0.6) else 0.0
        
        # Incorporate network topology prior
        hybrid_prob = float(np.clip(base_ensemble + synergy_boost + (network_risk * 0.1), 0.01, 0.99))
        return round(hybrid_prob, 4)
