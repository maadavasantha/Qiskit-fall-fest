"""
VNQFF-05: Behaviour Fingerprinting Module
Owner: Chingu (Feature Engineering)
Computes deviations from user's historical transaction behavior profile.
"""
import numpy as np

def calculate_behaviour_deviation(user_profile, current_amount, current_hour):
    """
    Computes statistical Z-score and time-of-day circadian anomaly.
    """
    avg_amt = user_profile.get('avg_amount', 8000.0)
    std_amt = max(user_profile.get('std_amount', 3000.0), 500.0)
    
    # Amount Z-score
    z_score = abs(current_amount - avg_amt) / std_amt
    
    # Circadian anomaly: normal hours 07:00 to 23:00 vs night hours 01:00 to 05:00
    is_night_txn = 1 if (1 <= current_hour <= 5) else 0
    circadian_penalty = 1.8 if is_night_txn else 1.0
    
    anomaly_factor = min((z_score * circadian_penalty) / 4.0, 1.0)
    return {
        'z_score': round(float(z_score), 2),
        'is_night_txn': bool(is_night_txn),
        'anomaly_factor': round(float(anomaly_factor), 3),
        'is_unusual_amount': z_score > 2.5
    }
