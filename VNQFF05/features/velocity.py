"""
VNQFF-05: Transaction Velocity Module
Owner: Chingu (Feature Engineering)
Measures transaction frequency per 5 minutes, 1 hour, and 24 hours to detect smurfing/bursts.
"""

def evaluate_velocity(recent_txns_5m, recent_txns_1h):
    """
    1 txn / hour -> Normal
    > 4 txns / 5 mins -> High Velocity / Smurfing attack risk
    """
    is_burst = recent_txns_5m >= 4
    is_high_volume = recent_txns_1h >= 10
    
    velocity_risk_score = min((recent_txns_5m * 18.0) + (recent_txns_1h * 3.0), 100.0)
    
    return {
        'velocity_5m': recent_txns_5m,
        'velocity_1h': recent_txns_1h,
        'velocity_risk_score': round(velocity_risk_score, 1),
        'is_burst_activity': is_burst,
        'is_high_volume': is_high_volume
    }
