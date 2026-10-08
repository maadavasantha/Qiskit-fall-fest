"""
VNQFF-05: Risk Engine & Decision Matrix
Owner: Gay3 (Risk Engine & Explainability)
Maps hybrid probability and fraud signals into a calibrated 0-100 Risk Score.
Thresholds:
- 0 to 30   : LOW    -> ALLOW
- 31 to 70  : MEDIUM -> VERIFY (Step-up 2FA)
- 71 to 100 : HIGH   -> BLOCK + ALERT
"""

class RiskEngine:
    def __init__(self, low_threshold=30, high_threshold=70):
        self.low_threshold = low_threshold
        self.high_threshold = high_threshold
        
    def calculate_risk(self, hybrid_prob, intelligence_flags, adaptive_factor=1.0):
        """
        Calculates 0-100 risk score and produces decision.
        adaptive_factor: > 1.0 during high-alert festival mode, < 1.0 for relaxed mode.
        """
        # Base score from probability
        raw_score = hybrid_prob * 100.0
        
        # Additional risk penalties based on critical hard signals
        penalties = 0.0
        if intelligence_flags.get('is_new_device'):
            penalties += 8.0
        if intelligence_flags.get('is_impossible_travel'):
            penalties += 14.0
        if intelligence_flags.get('is_flagged_mule'):
            penalties += 15.0
        if intelligence_flags.get('is_burst_velocity'):
            penalties += 10.0
        if intelligence_flags.get('is_in_fraud_ring'):
            penalties += 16.0
            
        final_score = min(max((raw_score * 0.75 + penalties) * adaptive_factor, 0.0), 100.0)
        risk_score = round(final_score, 1)
        
        if risk_score <= self.low_threshold:
            risk_level = 'LOW'
            decision = 'ALLOW'
        elif risk_score <= self.high_threshold:
            risk_level = 'MEDIUM'
            decision = 'VERIFY'
        else:
            risk_level = 'HIGH'
            decision = 'BLOCK + ALERT'
            
        return {
            'risk_score': risk_score,
            'risk_level': risk_level,
            'decision': decision
        }
