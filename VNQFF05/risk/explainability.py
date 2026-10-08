"""
VNQFF-05: Explainability Engine & Fraud DNA
Owner: Gay3 (Risk Engine & Explainability)
Produces human-readable justification reasons, feature importance attribution, and Fraud DNA signatures.
"""

def generate_explanation(txn_data, intelligence, risk_result):
    """
    Generates human-understandable explanation why a transaction was flagged.
    """
    reasons = []
    dna_components = []
    
    # 1. Device explanation
    if intelligence.get('is_new_device'):
        reasons.append("Unrecognized or new hardware device detected.")
        dna_components.append("NEW_DEVICE")
    elif intelligence.get('device_trust', 100) < 40:
        reasons.append(f"Low device trust score ({intelligence.get('device_trust')}/100) indicating suspicious environment.")
        dna_components.append("UNTRUSTED_DEVICE")
        
    # 2. Location explanation
    if intelligence.get('is_impossible_travel'):
        speed = intelligence.get('travel_speed_kmh', 0)
        reasons.append(f"Physically impossible travel speed detected ({speed} km/h between locations).")
        dna_components.append("IMPOSSIBLE_TRAVEL")
    elif intelligence.get('is_anomalous_location'):
        dist = intelligence.get('distance_km', 0)
        reasons.append(f"Geographic location differs significantly ({dist} km) from user's historical centroid.")
        dna_components.append("GEO_ANOMALY")
        
    # 3. Behaviour / Amount
    if intelligence.get('is_unusual_amount'):
        z = intelligence.get('z_score', 0)
        reasons.append(f"Transaction amount deviates abnormally from historical baseline (Z-score: +{z}σ).")
        dna_components.append("AMOUNT_ANOMALY")
        
    # 4. Velocity
    if intelligence.get('is_burst_velocity'):
        v5 = intelligence.get('velocity_5m', 0)
        reasons.append(f"High transaction frequency detected ({v5} transactions within 5 minutes).")
        dna_components.append("HIGH_VELOCITY")
        
    # 5. Beneficiary / Network
    if intelligence.get('is_flagged_mule'):
        reasons.append("Destination beneficiary account has prior linkage to mule account activity.")
        dna_components.append("MULE_BENEFICIARY")
        
    if intelligence.get('is_in_fraud_ring'):
        reasons.append("Graph analysis identified transaction inside an active cyclic fraud ring.")
        dna_components.append("FRAUD_RING_CYCLE")
        
    if not reasons:
        reasons.append("Transaction characteristics align with legitimate historical patterns.")
        dna_components.append("NORMAL_BASELINE")
        
    dna_string = " + ".join(dna_components)
    
    # Feature contribution breakdown (SHAP-style normalized impacts)
    feature_attributions = [
        {'feature': 'Device Trust', 'impact': +24 if 'NEW_DEVICE' in dna_components else -12},
        {'feature': 'Geographic Velocity', 'impact': +28 if 'IMPOSSIBLE_TRAVEL' in dna_components else ('+15' if 'GEO_ANOMALY' in dna_components else -8)},
        {'feature': 'Amount Deviation', 'impact': +20 if 'AMOUNT_ANOMALY' in dna_components else -15},
        {'feature': 'Transaction Velocity', 'impact': +18 if 'HIGH_VELOCITY' in dna_components else -10},
        {'feature': 'Mule Graph Link', 'impact': +22 if 'MULE_BENEFICIARY' in dna_components else -14},
    ]
    
    return {
        'reasons': reasons,
        'fraud_dna': dna_string,
        'feature_attributions': feature_attributions
    }
